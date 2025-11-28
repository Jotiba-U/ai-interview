import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Interview.css";

// Helper function for unique ID generation
const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

function Interview() {
  const location = useLocation();
  const navigate = useNavigate();
  const { domain, resumeFile } = location.state || {};

  const [interviewId, setInterviewId] = useState(null);
  const [answer, setAnswer] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState(null);

  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  // 🔥 Submission lock (prevents double submission)
  const submissionLock = useRef(false);

  // ------------------------------------------------------------------
  // HANDLE SUBMIT (fully protected from double-trigger)
  // ------------------------------------------------------------------
  const handleSubmit = async () => {
    if (submissionLock.current) return; // BLOCK double fire
    submissionLock.current = true;

    const userAnswer = answer;

    if (!userAnswer.trim() || loading || !interviewId || !userEmail) {
      submissionLock.current = false;
      return;
    }

    // Append user message
    setChat((prev) => [...prev, { sender: "user", text: userAnswer }]);
    setAnswer("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/api/ai/next_question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interview_id: interviewId, answer: userAnswer }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Server error");

      if (data.end) {
        // Save history in localStorage
        const newInterview = {
          id: generateUniqueId(),
          date: new Date().toLocaleDateString(),
          domain,
          resumeName: resumeFile.name,
          userEmail,
          feedback: data.feedback,
        };

        const storedInterviews =
          JSON.parse(localStorage.getItem("interviews")) || [];
        storedInterviews.push(newInterview);
        localStorage.setItem("interviews", JSON.stringify(storedInterviews));

        navigate("/feedback", {
          state: {
            feedback: data.feedback,
            domain,
          },
        });
      } else if (data.question) {
        setChat((prev) => [...prev, { sender: "ai", text: data.question }]);
      }
    } catch (err) {
      alert("Error: " + err.message);
      setAnswer(userAnswer); // restore
    } finally {
      setLoading(false);
      textareaRef.current?.focus();
      submissionLock.current = false; // 🔓 RELEASE LOCK
    }
  };

  // ------------------------------------------------------------------
  // ENTER KEY HANDLING
  // ------------------------------------------------------------------
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !submissionLock.current) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // ------------------------------------------------------------------
  // START INTERVIEW
  // ------------------------------------------------------------------
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/login");
      return;
    }
    setUserEmail(storedUser.email);

    if (!domain || !resumeFile) {
      navigate("/main");
      return;
    }

    const startInterview = async () => {
      try {
        const formData = new FormData();
        formData.append("domain", domain);
        formData.append("resume", resumeFile);

        const res = await fetch(
          "http://127.0.0.1:5000/api/ai/start_interview",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to start interview");

        setInterviewId(data.interview_id);
        setChat([{ sender: "ai", text: data.question }]);
      } catch (err) {
        alert("Error: Failed to start interview. " + err.message);
      } finally {
        setLoading(false);
        textareaRef.current?.focus();
      }
    };

    startInterview();
  }, []);

  // ------------------------------------------------------------------
  // AUTO SCROLL
  // ------------------------------------------------------------------
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  // ------------------------------------------------------------------
  // EXIT INTERVIEW
  // ------------------------------------------------------------------
  const handleEndInterview = () => {
    if (window.confirm("Are you sure you want to end the interview?")) {
      navigate("/main");
    }
  };

  // ------------------------------------------------------------------
  // RENDER UI
  // ------------------------------------------------------------------
  return (
    <div className="interview-page">
      <header className="interview-header">
        <h2>AI Interview - {domain}</h2>
        <button className="exit-btn" onClick={handleEndInterview}>
          End Interview ✖
        </button>
      </header>

      <div className="chat-box">
        {chat.map((msg, idx) => (
          <div key={idx} className={`chat-message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}

        {loading && chat.length > 0 && (
          <div className="loading-text chat-message ai">AI is thinking...</div>
        )}

        <div ref={chatEndRef}></div>
      </div>

      <div className="input-box">
        <textarea
          ref={textareaRef}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your answer (Shift + Enter for new line)..."
          disabled={loading} // disabled only while waiting for AI
        />

        <button
          onClick={() => {
            if (!submissionLock.current) handleSubmit();
          }}
          disabled={loading || !answer.trim() || !interviewId}
        >
          {loading ? "Thinking..." : "Submit"}
        </button>
      </div>
    </div>
  );
}

export default Interview;
