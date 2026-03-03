const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

const { readDiary, writeDiary } = require("./store");

function getUserId(req) {
  return req.headers["x-diary-user-id"] || null;
}

function requireUserId(req, res, next) {
  const userId = getUserId(req);
  if (!userId || userId.trim() === "") {
    return res.status(400).json({ error: "Missing X-Diary-User-Id header. Reload the page." });
  }
  req.diaryUserId = userId;
  next();
}

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.warn("WARNING: GEMINI_API_KEY is not set. Set it in server/.env to use Analyse & write entry.");
}
if (!process.env.VERCEL) {
  const DB_PATH = path.join(__dirname, "diary.json");
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ users: {} }, null, 2));
  }
}

// async function callGemini(prompt) {
//   // const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;
//   const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`; 
//   const body = {
//     contents: [{ parts: [{ text: prompt }] }],
//     generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
//   };

//   const res = await fetch(url, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(body)
//   });

//   if (!res.ok) {
//     const err = await res.text();
//     console.error("Gemini API error:", res.status, err);
//     throw new Error(`Gemini error ${res.status}: ${err}`);
//   }

//   const data = await res.json();
//   return data.candidates[0].content.parts[0].text;
// }

async function callGemini(prompt) {
  if (!API_KEY) {
    throw new Error("Missing GEMINI_API_KEY. Add it to server/.env and restart the server.");
  }

  const genAI = new GoogleGenerativeAI(API_KEY);
  // gemini-2.0-flash is deprecated for new users; use 2.5-flash
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 4096,
      responseMimeType: "application/json",
    },
  });

  const result = await model.generateContent(prompt);
  const response = result.response;
  if (!response) {
    const reason = (result.candidates && result.candidates[0]?.finishReason) || "unknown";
    throw new Error(`Gemini returned no text (finishReason: ${reason}). Try again or use a different model.`);
  }
  const text = response.text();
  return text || "";
}

/** Find the index of the closing } that matches the first {, ignoring { } inside strings. */
function findMatchingClosingBrace(str) {
  const start = str.indexOf("{");
  if (start === -1) return -1;
  let depth = 0;
  let inString = false;
  let quote = null;
  let i = start;
  while (i < str.length) {
    const c = str[i];
    if (!inString) {
      if (c === "{") depth++;
      else if (c === "}") {
        depth--;
        if (depth === 0) return i;
      } else if (c === '"' || c === "'") {
        inString = true;
        quote = c;
      }
      i++;
      continue;
    }
    if (c === "\\" && i + 1 < str.length) {
      i += 2;
      continue;
    }
    if (c === quote) {
      inString = false;
    }
    i++;
  }
  return -1;
}

/** Extract and parse JSON from Gemini's response (may include markdown or extra text). */
function parseGeminiJson(text) {
  if (!text || typeof text !== "string") throw new Error("Empty response");
  let clean = text
    .replace(/^[\s\S]*?```(?:json)?\s*/i, "")
    .replace(/\s*```[\s\S]*$/i, "")
    .trim();
  const first = clean.indexOf("{");
  const last = findMatchingClosingBrace(clean);
  if (first !== -1 && last !== -1 && last > first) {
    clean = clean.slice(first, last + 1);
  }
  clean = clean.replace(/,(\s*[}\]])/g, "$1");
  clean = fixLiteralNewlinesInJsonStrings(clean);
  return JSON.parse(clean);
}

/** Gemini sometimes puts real newlines inside JSON strings; JSON only allows \\n. */
function fixLiteralNewlinesInJsonStrings(str) {
  let out = "";
  let i = 0;
  let inString = false;
  let quote = null;
  while (i < str.length) {
    const c = str[i];
    if (!inString) {
      out += c;
      if (c === '"' || c === "'") {
        inString = true;
        quote = c;
      }
      i++;
      continue;
    }
    if (c === "\\" && i + 1 < str.length) {
      out += c + str[i + 1];
      i += 2;
      continue;
    }
    if (c === quote) {
      out += c;
      inString = false;
      i++;
      continue;
    }
    if ((c === "\n" || c === "\r") && inString) {
      out += " ";
      i++;
      continue;
    }
    out += c;
    i++;
  }
  return out;
}

app.get("/api/entries", requireUserId, async (req, res) => {
  const diary = await readDiary(req.diaryUserId);
  res.json(diary.entries);
});

app.get("/api/stats", requireUserId, async (req, res) => {
  const diary = await readDiary(req.diaryUserId);
  const entries = diary.entries;
  const tagCounts = {};
  entries.forEach((e) => {
    (e.tags || []).forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  const topTag = Object.entries(tagCounts).sort((a, b) => b[1] - a[1])[0];
  res.json({
    total: entries.length,
    tagCounts,
    topWeakness: topTag ? topTag[0] : null,
    streak: computeStreak(entries),
  });
});

function computeStreak(entries) {
  if (!entries.length) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let streak = 0;
  let current = new Date(today);
  const dateSet = new Set(
    entries.map((e) => {
      const d = new Date(e.createdAt);
      d.setHours(0, 0, 0, 0);
      return d.toISOString();
    })
  );
  while (dateSet.has(current.toISOString())) {
    streak++;
    current.setDate(current.getDate() - 1);
  }
  return streak;
}

app.post("/api/entries", requireUserId, async (req, res) => {
  const { code, description, language } = req.body;
  if (!code || !description) {
    return res.status(400).json({ error: "code and description are required" });
  }

  const prompt = `You are DebugDiary. A developer submitted this buggy ${language || "code"}.

Description: "${description}"

Code:
\`\`\`
${code.slice(0, 800)}
\`\`\`

You must reply with exactly one valid JSON object. No other text, no explanation, no markdown, no code fences, no backticks. Output the raw JSON only.

Schema (use double quotes for keys and strings; escape quotes inside strings; no newlines inside string values):
{
  "title": "Short poetic diary title",
  "fix": "corrected code only",
  "whatWentWrong": "2 sentences: technical root cause",
  "deeperLesson": "2 sentences: why this mistake happens psychologically",
  "patternWarning": "1 memorable rule of thumb",
  "tags": ["tag1","tag2"],
  "severity": "low or medium or high",
  "mood": "one of: frustrated, curious, embarrassed, enlightened, relieved"
}

Tags must be exactly from this list (use 1-3): async-error, logic-flaw, typo, scope-issue, type-error, api-misuse, off-by-one, null-reference, state-bug, syntax-error

Reply with only the JSON object, nothing else.`;

  try {
    const text = await callGemini(prompt);
    console.log("Gemini raw response:", text);

    let parsed;
    try {
      parsed = parseGeminiJson(text);
    } catch (parseErr) {
      console.error("JSON parse error:", parseErr.message);
      console.error("Full Gemini response:", text);
      const snippet = text.length > 300 ? text.slice(0, 300) + "…" : text;
      return res.status(500).json({
        error: "Gemini returned invalid JSON. Try again; the server console has the full response.",
        rawSnippet: snippet,
      });
    }

    const entry = {
      id: uuidv4(),
      code,
      description,
      language: language || "unknown",
      createdAt: new Date().toISOString(),
      ...parsed,
    };

    const diary = await readDiary(req.diaryUserId);
    diary.entries.unshift(entry);
    await writeDiary(req.diaryUserId, diary);
    res.json(entry);
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/entries/:id", requireUserId, async (req, res) => {
  const diary = await readDiary(req.diaryUserId);
  diary.entries = diary.entries.filter((e) => e.id !== req.params.id);
  await writeDiary(req.diaryUserId, diary);
  res.json({ success: true });
});

const PORT = process.env.PORT || 3001;
if (process.env.VERCEL) {
  module.exports = app;
} else {
  app.listen(PORT, () => console.log(`DebugDiary server running on :${PORT}`));
}