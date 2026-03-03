"use strict";

const path = require("path");
const fs = require("fs");

const BLOB_PREFIX = "debugdiary";

function blobPath(userId) {
  return `${BLOB_PREFIX}/${sanitizeUserId(userId)}/diary.json`;
}

function sanitizeUserId(userId) {
  if (!userId || typeof userId !== "string") return "anonymous";
  return userId.replace(/[^a-zA-Z0-9-_]/g, "").slice(0, 64) || "anonymous";
}

async function readDiary(userId) {
  const uid = sanitizeUserId(userId);
  if (process.env.VERCEL && process.env.BLOB_READ_WRITE_TOKEN) {
    const { get, put } = require("@vercel/blob");
    const pathname = blobPath(uid);
    try {
      const result = await get(pathname, { access: "private" });
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
  const all = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
  return all.users && all.users[uid] ? all.users[uid] : { entries: [] };
}

async function writeDiary(userId, data) {
  const uid = sanitizeUserId(userId);
  if (process.env.VERCEL && process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = require("@vercel/blob");
    await put(blobPath(uid), JSON.stringify(data, null, 2), {
      access: "private",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return;
  }
  const dbPath = path.join(__dirname, "diary.json");
  let all = { users: {} };
  if (fs.existsSync(dbPath)) {
    all = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
    if (!all.users) all.users = {};
  }
  all.users[uid] = data;
  fs.writeFileSync(dbPath, JSON.stringify(all, null, 2));
}

module.exports = { readDiary, writeDiary };
