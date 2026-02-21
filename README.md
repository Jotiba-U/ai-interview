# 🧠 AI Interview System

<div align="center">

**A full-stack AI-powered interview simulation platform**  
Practice interviews with real AI, get evaluated, and improve — all in one place.

![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-REST%20API-000000?style=flat&logo=flask&logoColor=white)
![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=flat&logo=react&logoColor=black)
![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=flat&logo=sqlite&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini-AI%20Model-4285F4?style=flat&logo=google&logoColor=white)

</div>

---

## 📌 Overview

The **AI Interview System** is a full-stack web application that lets users simulate realistic job interviews powered by Google's Gemini AI. Users upload their resume, select a domain, and the AI conducts a structured interview across 7 progressive stages — then delivers a detailed performance evaluation.

---

## ✨ Features

### 👤 For Users
- 📝 Create account & log in securely
- 📄 Upload PDF Resume & select interview domain
- 🤖 AI-driven, dynamic interview questions
- 💬 Real-time chat-style interview interface
- 📊 Score (1–10) + detailed feedback on completion
- 🗂️ View & manage past interview history
- 👤 Personal profile page

### 🔐 For Admin
- 🔑 Secure admin login
- 👥 View all registered users
- 🗑️ Delete users from the platform
- 🏷️ Update user domain selections

### ⚙️ System Highlights
- Modular Flask Blueprint architecture
- Resume parsing with PyPDF2
- In-memory session management with UUID
- Gemini Pro → Flash fallback (fault tolerant)
- Intelligence-based adaptive interview length

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React.js | Component-based UI & client-side routing |
| **Backend** | Flask (Python) | REST API with Blueprint architecture |
| **AI Model** | Google Gemini API | Question generation & performance evaluation |
| **Database** | SQLite | Lightweight, zero-setup data persistence |
| **Resume Parser** | PyPDF2 | Extracts text from uploaded PDF resumes |
| **Cross-Origin** | Flask-CORS | Enables React ↔ Flask communication |
| **Config** | python-dotenv | Secure environment variable management |

---

## 📁 Project Structure

```
AI/
│
├── backend/
│   ├── app.py                  ← Flask entry point & Blueprint registration
│   ├── ai_cache.db             ← SQLite database
│   ├── requirements.txt        ← Python dependencies
│   ├── .env                    ← API keys (not committed to git)
│   │
│   ├── utils/
│   │   └── db_helper.py        ← Shared DB utility functions
│   │
│   └── routes/
│       ├── auth_routes.py      ← /api/auth — Signup & Login
│       ├── admin_routes.py     ← /api/admin — Admin operations
│       └── ai_routes.py        ← /api/ai — Core AI interview engine
│
├── frontend/
│   ├── package.json
│   ├── public/
│   └── src/
│       ├── App.js              ← React Router — all route definitions
│       ├── index.js
│       ├── styles/             ← CSS files per component
│       └── components/
│           ├── Home.js
│           ├── Login.js
│           ├── Signup.js
│           ├── MainInterface.js    ← Resume upload + domain selection
│           ├── Interview.js        ← Live AI chat interview
│           ├── Feedback.js         ← Score & evaluation display
│           ├── Profile.js          ← Past interview history
│           ├── AdminLogin.js
│           └── AdminDashboard.js
│
├── your_database.db            ← Legacy/backup database
├── INTERVIEW_PREP.md           ← Detailed project explanation guide
└── README.md
```

---

## 🔄 How It Works

```
1. User signs up / logs in
         ↓
2. Uploads PDF Resume + Selects Domain (MainInterface)
         ↓
3. Backend extracts resume text via PyPDF2
         ↓
4. Gemini Flash generates progressive interview questions
   across 7 stages: Introduction → HR → Technical →
   Project → Scenario → Soft Skills → Closing
         ↓
5. User answers each question in real-time chat UI
         ↓
6. After 7+ questions → Gemini Pro evaluates full session
         ↓
7. Feedback page shows: Score / Summary / Strengths /
   Improvements / Suggestions
         ↓
8. Interview saved to Profile history (localStorage)
```

---

## 🧠 AI Interview Stages

The AI conducts the interview across **7 structured stages**, advancing every 3 questions:

| # | Stage | Focus |
|---|---|---|
| 1 | **Introduction** | Tell me about yourself |
| 2 | **HR** | Behavioral & situational questions |
| 3 | **Technical** | Domain-specific knowledge |
| 4 | **Project** | Resume-based project deep-dive |
| 5 | **Scenario** | Problem-solving & critical thinking |
| 6 | **Soft Skills** | Communication, teamwork, leadership |
| 7 | **Closing** | Candidate questions & wrap-up |

---

## 🔌 API Endpoints

### Auth — `/api/auth/`
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/signup` | Register a new user |
| `POST` | `/api/auth/login` | Authenticate & login |

### AI Interview — `/api/ai/`
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/ai/start_interview` | Upload resume, receive first question |
| `POST` | `/api/ai/next_question` | Submit answer, get next AI question |

### Admin — `/api/admin/`
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/admin/login` | Admin authentication |
| `GET` | `/api/admin/users` | Fetch all registered users |
| `DELETE` | `/api/admin/users/<email>` | Delete a user by email |
| `POST` | `/api/admin/user/domain` | Update a user's domain |

---

## 🗄️ Database Schema

```sql
-- Users table (ai_cache.db)
CREATE TABLE IF NOT EXISTS users (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    email    TEXT UNIQUE NOT NULL,
    name     TEXT NOT NULL,
    password TEXT NOT NULL,
    domain   TEXT DEFAULT NULL
);
```

| Database File | Purpose |
|---|---|
| `backend/ai_cache.db` | Primary — stores all user data |
| `your_database.db` | Legacy backup (root level) |

---

## 📦 Feedback Response Format

At the end of every interview, Gemini returns a structured JSON evaluation:

```json
{
  "score": 8,
  "summary": "Strong candidate with good technical knowledge...",
  "what_worked": [
    "Clear communication throughout",
    "Strong project explanation",
    "Good understanding of core concepts"
  ],
  "how_to_improve": [
    "Add more depth to technical answers",
    "Structure responses using STAR method",
    "Be more specific with examples"
  ],
  "suggestions": [
    "Practice deploying applications to cloud platforms",
    "Work on database optimization skills",
    "Build more end-to-end projects"
  ]
}
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 16+
- A valid [Google Gemini API Key](https://aistudio.google.com/)

---

### 🔧 Backend Setup

```bash
# 1. Navigate to backend
cd AI/backend

# 2. Install dependencies
pip install -r requirements.txt

# 3. Create .env file
echo GEMINI_API_KEY=your_key_here > .env

# 4. Start the Flask server
python app.py
```

> ✅ Backend runs at: **http://localhost:5000**

---

### 🎨 Frontend Setup

```bash
# 1. Navigate to frontend
cd AI/frontend

# 2. Install packages
npm install

# 3. Start the React app
npm start
```

> ✅ Frontend runs at: **http://localhost:3000**

---

## 🛡️ Security Notes

> The following improvements are recommended before production deployment:

| Current | Recommended |
|---|---|
| Plain text passwords | `bcrypt` password hashing |
| Hardcoded admin credentials | Environment variables |
| No JWT auth | Proper JWT with token expiry |
| HTTP only | HTTPS with SSL certificates |
| In-memory sessions | Redis or persistent session store |

---

## 🤝 Contributing

Pull requests are welcome!  
For major changes, please open an issue first to discuss what you'd like to change.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 👨‍💻 Author

**Jotiba M Ugale**  
Built with 💙 using Flask, React & Google Gemini AI

---

<div align="center">
⭐ If you found this project useful, consider giving it a star!
</div>
