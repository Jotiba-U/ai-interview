import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

export default function Home() {

  useEffect(() => {
    const canvas = document.getElementById("ai-bg");
    const ctx = canvas.getContext("2d");
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    class Node {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = 3;
      }
      move() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }
      draw() {
        ctx.fillStyle = "#4facfe";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const nodes = [];
    const nodeCount = 70;
    for (let i = 0; i < nodeCount; i++) nodes.push(new Node());

    function animate() {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.strokeStyle = `rgba(79,172,254,${1 - dist / 140})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      nodes.forEach(node => {
        node.move();
        node.draw();
      });

      requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });
  }, []);

  return (
    <div className="homepage">
      <canvas id="ai-bg"></canvas>
      <div className="gradient-overlay"></div>

      

      <header className="hero fade-in">
        <h1 className="glow-text">AI-Powered Interview System</h1>
        <p>
          Upload your resume, choose your domain, and experience smart AI-driven mock interviews.  
          Get personalized feedback and insights to sharpen your interview performance.
        </p>
        <div className="cta-buttons">
          <Link to="/login"><button className="btn login">Login</button></Link>
          <Link to="/signup"><button className="btn signup">Sign Up</button></Link>
          <Link to="/admin"><button className="admin-btn">Admin</button></Link>
        </div>
      </header>

      <section className="features-section">
        <div className="feature fade-up">
          <h2>📄 Resume Analysis</h2>
          <p>AI scans your resume to extract skills and experience, building custom interview questions.</p>
        </div>
        <div className="feature fade-up">
          <h2>🧠 Smart Interview</h2>
          <p>Get realistic, AI-generated interview sessions based on your career domain.</p>
        </div>
        <div className="feature fade-up">
          <h2>📈 Instant Feedback</h2>
          <p>AI evaluates your answers and provides instant performance feedback.</p>
        </div>
        <div className="feature fade-up">
          <h2>💼 Personalized Growth</h2>
          <p>Receive insights on weak areas and improvement suggestions for better results.</p>
        </div>
      </section>

      <footer className="footer fade-in">
        <p>© 2025 AI Interview System</p>
        <p>Empowering smarter interviews through Artificial Intelligence</p>
      </footer>
    </div>
  );
}
