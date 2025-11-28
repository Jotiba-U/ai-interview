import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Feedback.css";

function Feedback() {
    const location = useLocation();
    const navigate = useNavigate();
    // Destructure using the new keys sent by ai_routes.py
    const { feedback, domain } = location.state || {};

    const handleExit = () => {
        navigate("/main");
    };

    // If feedback is missing or empty, render a helpful message.
    if (!feedback || Object.keys(feedback).length === 0) {
        return (
            <div className="feedback-page">
                <header className="feedback-header">
                    <h2>Interview Feedback</h2>
                    <button className="exit-btn" onClick={handleExit}>
                        Exit ✖
                    </button>
                </header>
                {/* Using a className for specific styling */}
                <h3 className="no-feedback">No feedback available. The interview may not have finished or the AI failed to generate data.</h3>
                <button className="back-to-main-btn" onClick={handleExit}>Back to Main</button>
            </div>
        );
    }
    
    // Define score and summary for clearer display
    const score = feedback.score || 'N/A';
    const summary = feedback.summary || 'Summary not provided by AI.';

    return (
        <div className="feedback-page">
            <header className="feedback-header">
                <h2>Interview Feedback - {domain}</h2>
                <button className="exit-btn" onClick={handleExit}>
                    Exit ✖
                </button>
            </header>

            <div className="feedback-container">
                {/* New: Score and Summary Display */}
                <div className="feedback-section feedback-score-summary">
                    <h3>🎯 Overall Performance</h3>
                    {/* Display score and summary */}
                    <p className="score">Score: <span>{score}/10</span></p>
                    <p className="summary-text">{summary}</p>
                </div>

                <div className="feedback-section strengths">
                    <h3>✅ What Worked (Strengths)</h3>
                    {/* Mapped to the correct backend key: what_worked */}
                    <ul>
                        {feedback.what_worked?.map((item, idx) => (
                            <li key={idx}>{item}</li>
                        ))}
                    </ul>
                </div>

                <div className="feedback-section improvements">
                    <h3>⚠️ How to Improve (Areas for Growth)</h3>
                    {/* Mapped to the correct backend key: how_to_improve */}
                    <ul>
                        {feedback.how_to_improve?.map((item, idx) => (
                            <li key={idx}>{item}</li>
                        ))}
                    </ul>
                </div>

                <div className="feedback-section suggestions">
                    <h3>💡 Next Steps (Suggestions)</h3>
                    {/* Mapped to the correct backend key: suggestions */}
                    <ul>
                        {feedback.suggestions?.map((item, idx) => (
                            <li key={idx}>{item}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Feedback;