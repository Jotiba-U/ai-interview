import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Admin.css";

function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://127.0.0.1:5000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        sessionStorage.setItem("adminLoggedIn", "true");
        navigate("/admin/dashboard", { replace: true });
      } else setError(data.message || "Invalid username or password");
    } catch {
      setError("Cannot connect to server");
    }
  };

  const goHome = () => navigate("/");

  return (
    <div className="admin-container">
      <button className="home-btn-top" onClick={goHome}>Home</button>
      <div className="admin-box">
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin} autoComplete="off">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            name="adminPassword"           // dummy name
            autoComplete="new-password"    // prevents browser check
          />
          <button type="submit" className="login-btn">Login</button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}

export default AdminLogin;
