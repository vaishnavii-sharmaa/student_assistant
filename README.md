# Student Assistant

AI-powered learning assistant with smart notes, video recommendations, quizzes, and performance tracking.

## Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Groq API key

### Environment Variables

Copy `.env.example` to `.env` in the project root and fill in your keys:

```
GROQ_API_KEY=gsk-...
GROQ_MODEL=llama-3.3-70b-versatile
MONGO_URI=mongodb://localhost:27017/student-assistant
JWT_SECRET=your-secret-key
CLIENT_URL=http://localhost:5173
PORT=5000
```

### Install & Run

**Backend:**
```bash
cd server
npm install
npm run dev
```

**Frontend:**
```bash
cd client
npm install
npm run dev
```

Open http://localhost:5173

## Features

- **Smart Notes** — AI-generated Markdown notes with difficulty levels
- **YouTube Videos** — Educational video recommendations
- **LeetCode Practice** — Coding questions for CS topics
- **AI Quizzes** — Timed MCQ quizzes with explanations
- **Performance Analysis** — Score tracking, weak areas, personalized feedback
- **Study Dashboard** — History, streaks, score trends
- **Pomodoro Timer** — Built-in focus timer
- **Follow-up Chat** — Ask questions about your topic
- **Learning Roadmap** — AI-suggested next topics
- **Flashcards** — Auto-generated review cards

## Tech Stack

- Frontend: React + Vite, Tailwind CSS, React Router, Framer Motion, Recharts
- Backend: Node.js + Express, MongoDB + Mongoose, JWT Auth
- AI: Groq LLM (e.g. LLaMA 3.3)
