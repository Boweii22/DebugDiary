require("dotenv").config();

async function main() {
  const key = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

  const res = await fetch(url);
  const data = await res.json();

  console.log(
    (data.models || []).map((m) => ({
      name: m.name,
      methods: m.supportedGenerationMethods,
    }))
  );
}

main().catch(console.error);