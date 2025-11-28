🧠 AI Interview System

A full-stack AI-powered interview simulation platform built using Flask + React.
The system allows users to practice interviews, receive AI-generated questions, get evaluated, and view analytics.
Includes full authentication, admin features, and session tracking.

🚀 Features

🔹 For Users
Create account & login
Upload Resume & Select Domain
Start AI-powered interview
Receive intelligent follow-up questions
Score generation & feedback
View past performance
Profile management


🔹 For Admin
Secure admin login
View all users
Delete User Option


🔹 System Features
Frontend: React (Vite)
Backend: Flask REST API
Authentication: JWT
Database: SQLite
AI Model: Flash / Gemini API
Clean modular architecture


🏗️ Project Structure
AI/
│── backend/
│   ├── app.py
│   ├── ai_cache.db
│   ├── requirements.txt
│   ├── .env
│   ├── utils/
│   │   └── db_helper.py
│   └── routes/
│       ├── auth_routes.py
│       ├── admin_routes.py
│       └── ai_routes.py
│
│── frontend/
│   ├── package.json
│   ├── package-lock.json
│   ├── .gitignore
│   ├── public/
│   └── src/
│       ├── App.js
│       ├── App.css
│       ├── index.js
│       ├── components/
│       ├── styles/
│       └── pages/
│           ├── Login.js
│           ├── Signup.js
│           ├── Home.js
│           ├── Interview.js
│           ├── Feedback.js
│           ├── Profile.js
│           ├── MainInterface.js
│           └── Admin/



📦 Backend Setup (Flask)
1️⃣ Install dependencies
cd AI/backend
pip install -r requirements.txt


2️⃣ Create .env
GEMINI_API_KEY=your_key_here
JWT_SECRET=your_secret_here


3️⃣ Run server
python app.py


🎨 Frontend Setup (React)
1️⃣ Install packages
cd AI/frontend
npm install


2️⃣ Run UI
npm start


Frontend runs on: http://localhost:3000

Backend runs on: http://localhost:5000


🔌 API Endpoints (Quick Overview)
| Method | Endpoint         | Description       |
| ------ | ---------------- | ----------------- |
| POST   | /api/auth/signup | Register new user |
| POST   | /api/auth/login  | User login        |


AI Interview
| Method | Endpoint       | Description      |
| ------ | -------------- | ---------------- |
| POST   | /api/ai/start  | Start interview  |
| POST   | /api/ai/next   | Next AI question |
| POST   | /api/ai/finish | End interview    |


Admin
| Method | Endpoint            | Description         |
| ------ | ------------------- | ------------------- |
| GET    | /api/admin/users    | List all users      |
| GET    | /api/admin/sessions | List all interviews |


🧠 How the AI Works
User Upload Resume & Selects Domain
Backend sends prompt → Gemini/Flash model
Model returns:
 Question
 Follow-up question
 Evaluation
 Score (1–10)
Everything is stored in SQLite


🗄️ Database
Two SQLite databases:
| File                 | Purpose                 |
| -------------------- | ----------------------- |
| **your_database.db** | main user data          |
| **ai_cache.db**      | interview session cache |


🛡️ Why This Tech Stack?
Flask:
Lightweight
Perfect for custom AI workflows
Easy to extend

React:
Fast UI
Component reusability
Smooth interview interface

SQLite:
Zero-setup
Perfect for local/medium scale projects


🤝 Contribution
Pull requests are welcome!
For major changes, open an issue first.


Developed By:
Jotiba M Ugale
