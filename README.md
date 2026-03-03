# 📓 DebugDiary

> Turn your bugs into lessons. Powered by Google Gemini.

DebugDiary is a full-stack web app that transforms your broken code into **personal diary entries** — revealing the root cause, the fix, the deeper lesson, and your recurring patterns as a developer.

---

## ✨ Features

- **AI-powered diary entries** — Gemini analyses your bug and writes a reflective journal entry
- **Pattern tracking** — tags your errors (async-error, logic-flaw, etc.) to reveal your weaknesses
- **Growth dashboard** — visualise your bug history, top weakness, streak, and error breakdown
- **Code diff viewer** — toggle between broken and fixed code with syntax highlighting
- **"Remember this"** — a memorable rule of thumb burned into every entry

---

## 🚀 Quick Start

### 1. Get a Gemini API Key
- Go to [aistudio.google.com](https://aistudio.google.com)
- Click **Get API Key** → **Create API key**
- Copy the key

### 2. Install dependencies

```bash
npm run install:all
```

### 3. Set up environment

```bash
cd server
cp .env.example .env
# Edit .env and paste your Gemini API key
```

### 4. Run the app

```bash
# From the root directory:
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

---

## 📤 Deploy to GitHub + Vercel

### Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: DebugDiary"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/debugdiary.git
git push -u origin main
```

(Create the repo on [github.com/new](https://github.com/new) first if needed; use the repo URL for `origin`.)

### Host on Vercel

1. **Connect the repo**
   - Go to [vercel.com](https://vercel.com) → **Add New** → **Project** → Import your GitHub repo.

2. **Environment variables** (Project → Settings → Environment Variables)
   - `GEMINI_API_KEY` — your [Google AI Studio](https://aistudio.google.com) API key.
   - `BLOB_READ_WRITE_TOKEN` — create a **Vercel Blob** store: Project → **Storage** → **Create Database** → **Blob**, then link it to the project so this token is set automatically.

3. **Deploy**
   - Leave **Build Command** and **Output Directory** as in `vercel.json` (client is built, output is `client/dist`).  
   - Deploy. The app will be live at `https://your-project.vercel.app`.  
   - Diary data is stored in Vercel Blob (persists across deployments).

---

## 🗂️ Project Structure

```
debugdiary/
├── package.json          # Root — runs both with concurrently
├── server/
│   ├── index.js          # Express API + Gemini integration
│   ├── diary.json        # Local JSON database (auto-created)
│   └── .env              # Your API key goes here
└── client/
    ├── src/
    │   ├── pages/
    │   │   ├── Home.jsx        # Landing page
    │   │   ├── NewEntry.jsx    # Bug submission form
    │   │   ├── Dashboard.jsx   # Stats + all entries
    │   │   └── EntryDetail.jsx # Full diary entry view
    │   ├── components/
    │   │   ├── Layout.jsx      # Nav + page wrapper
    │   │   └── EntryCard.jsx   # Entry preview card
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css           # Design system + global styles
    └── index.html
```

---

## 🔌 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/entries` | Get all diary entries |
| POST | `/api/entries` | Create new entry (calls Gemini) |
| DELETE | `/api/entries/:id` | Delete an entry |
| GET | `/api/stats` | Get dashboard statistics |

---

## 🎨 Tech Stack

- **Frontend**: React 18, Vite, Framer Motion, React Router, React Syntax Highlighter
- **Backend**: Node.js, Express
- **AI**: Google Gemini 1.5 Flash (`@google/generative-ai`)
- **Storage**: Local JSON file (dev) / Vercel Blob (production)
- **Fonts**: Instrument Serif + Syne + DM Mono

---

## 💡 How it works

1. You paste broken code + describe what went wrong
2. A carefully engineered prompt sends it to Gemini 1.5 Flash
3. Gemini returns structured JSON: title, fix, root cause, deeper lesson, pattern warning, tags, severity, mood
4. The entry is saved locally and rendered as a beautiful diary page
5. Your dashboard tracks patterns across all your entries over time

---

Built with ❤️ and Google Gemini
