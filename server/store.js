"use strict";

const path = require("path");
const fs = require("fs");

const DIARY_BLOB_PATH = "debugdiary/diary.json";

async function readDiary() {
  if (process.env.VERCEL && process.env.BLOB_READ_WRITE_TOKEN) {
    const { get, put } = require("@vercel/blob");
    try {
      const result = await get(DIARY_BLOB_PATH, { access: "private" });
      if (!result || result.statusCode === 404) return { entries: [] };
      const stream = result.stream || (result.blob && result.blob.stream && result.blob.stream());
      if (!stream) return { entries: [] };
      const chunks = [];
      for await (const chunk of stream) chunks.push(chunk);
      const text = Buffer.concat(chunks).toString("utf-8");
      return JSON.parse(text || '{"entries":[]}');
    } catch (e) {
      if (e.code === "BLOB_NOT_FOUND" || (e.message && e.message.includes("not found"))) return { entries: [] };
      throw e;
    }
  }
  const dbPath = path.join(__dirname, "diary.json");
  if (!fs.existsSync(dbPath)) return { entries: [] };
  return JSON.parse(fs.readFileSync(dbPath, "utf-8"));
}

async function writeDiary(data) {
  if (process.env.VERCEL && process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = require("@vercel/blob");
    await put(DIARY_BLOB_PATH, JSON.stringify(data, null, 2), {
      access: "private",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return;
  }
  const dbPath = path.join(__dirname, "diary.json");
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

module.exports = { readDiary, writeDiary };
