import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch("http://127.0.0.1:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // FIX: Ensure name is extracted from the new server structure: data.user.name
      const userDetails = data.user;
      const userName = userDetails?.name || "Guest"; 
      
      localStorage.setItem("user", JSON.stringify({ name: userName, email: userDetails?.email }));
      navigate("/main");
    } else {
      alert(data.message || "Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <div className="top-bar">
        <Link to="/" className="home-link">Home</Link>
      </div>

      <div className="login-box">
        <h2 className="glow-text">User Login</h2>
        <p className="subtitle">Access your AI Interview Dashboard</p>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-btn">Login</button>
        </form>

        <p className="signup-link">
          Don’t have an account? <Link to="/signup">Sign up here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;