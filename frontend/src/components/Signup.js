import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Signup.css";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    const response = await fetch("http://127.0.0.1:5000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // FIX: Save user info returned by the server (which includes the name)
      const userName = data.user.name || name || "Guest";
      
      localStorage.setItem("user", JSON.stringify({ name: userName, email: data.user.email }));
      navigate("/main");
    } else {
      alert(data.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="signup-page">
      <div className="top-bar">
        <Link to="/" className="home-link">Home</Link>
      </div>

      <div className="signup-box">
        <h2 className="glow-text">Create Account</h2>
        <p className="subtitle">Join the AI-powered interview revolution</p>
        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Create Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="signup-btn">Sign Up</button>
        </form>

        <p className="login-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;