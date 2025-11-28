from flask import Blueprint, request, jsonify
from google import genai
import os
import uuid
import json
import time
import PyPDF2

ai_bp = Blueprint("ai", __name__)

# -----------------------------------------------------------
# GEMINI INIT
# -----------------------------------------------------------
try:
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    QUESTION_MODEL = "gemini-2.5-flash"   
    FEEDBACK_MODEL = "gemini-2.5-pro"    
except:
    client = None


# -----------------------------------------------------------
# INTERVIEW STATE
# -----------------------------------------------------------
INTERVIEWS = {}

QUESTION_LIMIT = 7

FLOW_STAGES = [
    "introduction",
    "hr",
    "technical",
    "project",
    "scenario",
    "softskill",
    "closing"
]

CLOSING_QUESTIONS = [
    "Before we wrap up, do you have any questions for me?",
    "Is there anything else you would like to share before we end the interview?"
]


# -----------------------------------------------------------
# EXTRACT RESUME TEXT
# -----------------------------------------------------------
def extract_resume_text(file):
    try:
        reader = PyPDF2.PdfReader(file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text.strip()
    except:
        return ""


# -----------------------------------------------------------
# CALL GEMINI (GENERIC)
# -----------------------------------------------------------
def call_gemini(prompt, model_name):
    if not client:
        return None, "Gemini not initialized"

    for attempt in range(3):
        try:
            resp = client.models.generate_content(
                model=model_name,
                contents=prompt
            )

            if hasattr(resp, "candidates"):
                parts = resp.candidates[0].content.parts
                text = parts[0].text.strip() if parts else ""
            else:
                text = getattr(resp, "text", "").strip()

            if text:
                return text, None

        except Exception:
            time.sleep(1 + attempt)

    return None, "AI failed"


# -----------------------------------------------------------
# HISTORY BUILDER
# -----------------------------------------------------------
def build_short_history(session, limit=6):
    qs = session["questions"][-limit:]
    ans = session["answers"][-limit:]
    out = ""
    for q, a in zip(qs, ans):
        out += f"Q: {q}\nA: {a}\n\n"
    return out


# -----------------------------------------------------------
# PROMPTS 
# -----------------------------------------------------------
INTERVIEWER_PROMPT = """
You are a professional interviewer conducting a realistic job interview.
You must behave like a human interviewer:
- Ask natural follow-up questions.
- Switch topics smoothly.
- React to the candidate’s answer quality.
- Use resume details when appropriate.

Rules:
1. If the candidate’s latest answer is notably strong, optionally add ONE short appreciation line (e.g. “Good explanation.” “Nice clarity.”). Only when deserved.
2. Then immediately ask ONE realistic interview question.
3. Question should match the current stage but natural transitions are allowed.
4. Include resume-based, project-based or skill-based questions when relevant.
5. Keep it short, human-like, not robotic.
6. Do NOT repeat previous questions.
7. Do NOT include explanations or meta-comments.
"""


FEEDBACK_PROMPT = """
You are an expert interviewer evaluating the candidate.

Return ONLY JSON. No text outside JSON.

Your evaluation must consider:
- Resume content
- All questions & answers
- Technical strength
- Communication
- Problem solving
- Confidence
- Professionalism

The 'suggestions' field MUST NOT include:
- hiring decisions
- next-round recommendations
- internal HR notes
- statements like "move to next round" or "hire them"

Suggestions MUST be:
- practical
- skill-focused
- actionable
- related to technical improvement, deployment, databases, CI/CD, communication, or real-world project experience.

Return ONLY this JSON:

{
  "score": number (1-10),
  "summary": "Short summary.",
  "what_worked": ["", "", ""],
  "how_to_improve": ["", "", ""],
  "suggestions": ["", "", ""]
}
"""


# -----------------------------------------------------------
# START INTERVIEW
# -----------------------------------------------------------
@ai_bp.route("/start_interview", methods=["POST"])
def start_interview():
    resume = request.files.get("resume")
    domain = request.form.get("domain")

    if not resume or not domain:
        return jsonify({"error": "Resume and domain required"}), 400

    resume_text = extract_resume_text(resume)

    first_q = "Welcome to the interview! Could you please introduce yourself?"

    session_id = str(uuid.uuid4())
    INTERVIEWS[session_id] = {
        "domain": domain,
        "resume_text": resume_text,
        "questions": [first_q],
        "answers": [],
        "stage_index": 0,
        "closing_step": 0,
        "count": 1,
        "intelligence_score": 0
    }

    return jsonify({"interview_id": session_id, "question": first_q})


# -----------------------------------------------------------
# NEXT QUESTION
# -----------------------------------------------------------
@ai_bp.route("/next_question", methods=["POST"])
def next_question():
    data = request.json
    session_id = data.get("interview_id")
    answer = data.get("answer", "").strip()

    if session_id not in INTERVIEWS:
        return jsonify({"error": "Invalid session"}), 400

    session = INTERVIEWS[session_id]
    session["answers"].append(answer)

    # Early end detection
    if len(answer.split()) > 40:
        session["intelligence_score"] += 1

    if session["intelligence_score"] >= 4 and session["count"] > 12:
        return end_interview(session, session_id)

    if session["count"] >= QUESTION_LIMIT:
        return end_interview(session, session_id)

    # ---------------- CLOSING ----------------
    if session["stage_index"] == len(FLOW_STAGES) - 1:
        if session["closing_step"] == 0:
            q = CLOSING_QUESTIONS[0]
            session["questions"].append(q)
            session["closing_step"] = 1
            return jsonify({"question": q, "end": False})

        if session["closing_step"] == 1:
            q = CLOSING_QUESTIONS[1]
            session["questions"].append(q)
            session["closing_step"] = 2
            return jsonify({"question": q, "end": False})

        return end_interview(session, session_id)

    # ---------------- NORMAL FLOW ----------------
    stage = FLOW_STAGES[session["stage_index"]]
    history = build_short_history(session)

    prompt = f"""
{INTERVIEWER_PROMPT}

Role: {session['domain']}
Stage: {stage}

Candidate Resume:
{session['resume_text']}

Recent Questions to avoid:
{session['questions'][-6:]}

Recent conversation:
{history}

Latest answer:
{answer}

Generate:
(Optional appreciation)
Next question
"""

    #  Use FLASH here
    next_q, err = call_gemini(prompt, QUESTION_MODEL)

    if not next_q:
        next_q = "Let's continue — can you explain something you recently learned?"

    if session["count"] % 3 == 0:
        session["stage_index"] += 1

    session["questions"].append(next_q)
    session["count"] += 1

    return jsonify({"question": next_q, "end": False})


# -----------------------------------------------------------
# END INTERVIEW + FEEDBACK
# -----------------------------------------------------------
def end_interview(session, sid):
    history = ""
    for q, a in zip(session["questions"], session["answers"]):
        history += f"Q: {q}\nA: {a}\n\n"

    prompt = f"""
{FEEDBACK_PROMPT}

Role: {session['domain']}
Resume:
{session['resume_text']}

All Interview Responses:
{history}
"""

    # Try PRO first
    raw, err = call_gemini(prompt, FEEDBACK_MODEL)

    # If PRO fails → fallback to FLASH
    if err or not raw:
        raw, err = call_gemini(prompt, QUESTION_MODEL)

    # If both fail → return safe default
    if err or not raw:
        fb = {
            "score": 7,
            "summary": "Basic feedback generated due to model limits.",
            "what_worked": [
                "Good communication throughout the interview.",
                "Answered questions with clarity.",
                "Showed understanding of the domain."
            ],
            "how_to_improve": [
                "Give more structured examples.",
                "Elaborate more on technical reasoning.",
                "Improve depth in project explanation."
            ],
            "suggestions": [
                "Work on full-stack projects.",
                "Practice more real interview mock sessions.",
                "Strengthen deployment and database skills."
            ]
        }

        INTERVIEWS.pop(sid, None)
        return jsonify({"question": "Here is your final feedback.", "feedback": fb, "end": True})

    # Otherwise parse JSON normally
    try:
        clean = raw.replace("```json", "").replace("```", "").strip()
        fb = json.loads(clean)
    except:
        return jsonify({"error": "Invalid JSON", "raw": raw, "end": True})

    INTERVIEWS.pop(sid, None)

    return jsonify({"question": "Here is your final feedback.", "feedback": fb, "end": True})
