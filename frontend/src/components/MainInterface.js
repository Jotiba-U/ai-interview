import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/MainInterface.css";

function MainInterface() {
  const [resumeFile, setResumeFile] = useState(null);
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleStartInterview = async (e) => {
    e.preventDefault();

    if (!resumeFile || !domain) {
      alert("Please upload your resume and select a domain.");
      return;
    }

    if (resumeFile.type !== "application/pdf") {
      alert("Please upload a PDF file only.");
      return;
    }

    // Navigate to Interview page with resume file object and domain
    navigate("/interview", {
      state: { domain, resumeFile },
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token"); // Note: Token is not used elsewhere but retained for safety
    navigate("/login");
  };

  // FIX: Robustly retrieve user name for menu display
  const user = JSON.parse(localStorage.getItem("user"));
  const userName = user?.name || "My Profile";

  return (
    <div className="main-page">
      <header className="main-header">
        <h1 className="logo">AI Interview System</h1>
        <div className="profile-menu">
          <span className="menu-text">{userName} ▼</span>
          <div className="menu-dropdown">
            <Link to="/profile" className="dropdown-link">
              Profile
            </Link>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="upload-box">
        <h2 className="glow-title">Start AI Interview</h2>
        <p className="subtitle">Upload your resume and select your domain</p>

        <form onSubmit={handleStartInterview} className="form">
          <label className="label">Upload Resume (PDF only)</label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setResumeFile(e.target.files[0])}
          />

          <label className="label">Select Domain</label>
          <select value={domain} onChange={(e) => setDomain(e.target.value)}>
            <option value="">-- Choose Domain --</option>
            <option value="Web Development">Web Development</option>
            <option value="Data Science">Data Science</option>
            <option value="Cybersecurity">Cybersecurity</option>
            <option value="AI/ML">AI/ML</option>
          </select>

          <button type="submit" className="start-btn" disabled={loading}>
            {loading ? "Loading..." : "Start AI Interview"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default MainInterface;