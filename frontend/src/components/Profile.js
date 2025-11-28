import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/login");
      return;
    }
    setUser(storedUser);

    const storedInterviews = JSON.parse(localStorage.getItem("interviews")) || [];
    // Filter interviews based on the current user's email
    const userInterviews = storedInterviews.filter(i => i.userEmail === storedUser.email);
    setInterviews(userInterviews);
  }, [navigate]);

  const viewFeedback = (interviewId) => {
    // Find the interview object and pass its stored feedback data to the /feedback route
    const interviewItem = interviews.find(i => i.id === interviewId);
    if (interviewItem) {
        navigate(`/feedback`, {
            state: {
                feedback: interviewItem.feedback,
                domain: interviewItem.domain,
            }
        });
    } else {
        alert("Feedback details not found for this interview.");
    }
  };

  const deleteInterview = (interviewId) => {
    // FIX: Removed the window.confirm prompt. Deletion is now instant.
    
    // Update local state (UI)
    const updatedInterviews = interviews.filter(i => i.id !== interviewId);
    setInterviews(updatedInterviews);

    // Update localStorage (Persistence)
    const allInterviews = JSON.parse(localStorage.getItem("interviews")) || [];
    const updatedAll = allInterviews.filter(i => i.id !== interviewId);
    localStorage.setItem("interviews", JSON.stringify(updatedAll));
  };

  return (
    <div className="profile-page">
      {/* Back Button */}
      <div className="profile-header">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
      </div>

      {/* User Info */}
      <div className="card user-info">
        <h2 className="glow-title">{user?.name || "User"}'s Profile</h2>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Total Interviews:</strong> {interviews.length}</p>
      </div>

      {/* Interview Table */}
      <div className="card interview-table">
        <h3 className="glow-subtitle">Past Interviews</h3>
        {interviews.length === 0 ? (
          <p className="no-data">No interviews yet. Start practicing now!</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Domain</th>
                  <th>Resume</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {interviews.map((item) => (
                  <tr key={item.id}>
                    <td>{item.date}</td>
                    <td>{item.domain}</td>
                    <td>{item.resumeName}</td>
                    <td className="action-buttons">
                      <button className="view-btn" onClick={() => viewFeedback(item.id)}>View Feedback</button>
                      <button className="delete-btn" onClick={() => deleteInterview(item.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;