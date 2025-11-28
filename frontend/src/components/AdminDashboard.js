import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Admin.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch users from the backend
  const fetchUsers = async () => {
    try {
        // Fetch users from the backend API endpoint
        const res = await fetch("http://127.0.0.1:5000/api/admin/users");
        const data = await res.json();
        if (res.ok) {
            setUsers(data.users); 
        } else {
            console.error("Failed to fetch users:", data.message);
        }
    } catch (error) {
        console.error("Network error fetching users:", error);
    } finally {
        setLoading(false);
    }
  };


  useEffect(() => {
    // 1. Check Admin Session
    if (!sessionStorage.getItem("adminLoggedIn")) {
      navigate("/admin", { replace: true });
      return;
    }
    
    // 2. Fetch Users from API
    fetchUsers();

  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("adminLoggedIn");
    navigate("/admin", { replace: true });
  };

  const handleDelete = async (userEmail) => {
    if (!window.confirm(`Are you sure you want to delete user ${userEmail}?`)) {
        return;
    }
    
    try {
        // Call the backend DELETE API
        const res = await fetch(`http://127.0.0.1:5000/api/admin/users/${userEmail}`, {
            method: 'DELETE',
        });

        if (res.ok) {
            alert(`User ${userEmail} deleted successfully.`);
            // Refresh the user list after successful deletion
            fetchUsers(); 
        } else {
            const data = await res.json();
            alert(`Failed to delete user: ${data.message}`);
        }
    } catch (error) {
        alert("Network error during deletion.");
    }
  };

  if (loading) {
    return <div className="admin-dashboard">Loading users...</div>;
  }

  return (
    <div className="admin-dashboard">
      <nav className="navbar">
        <h2 className="logo">Admin Dashboard</h2>
        <button className="nav-btn logout" onClick={handleLogout}>Logout</button>
      </nav>
      <div className="dashboard-content">
        <h2>Registered Users</h2>
        <p className="subtitle">View all users who have registered</p>
        <div className="table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                {/* REMOVED: Domain Header <th>Domain</th> */}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.length ? users.map((u, i) => (
                <tr key={u.email}> 
                  <td>{i+1}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  
                  <td>
                    {/* The action still uses user email for deletion */}
                    <button className="delete-btn" onClick={() => handleDelete(u.email)}>Delete</button>
                  </td>
                </tr>
              )) : <tr><td colSpan="4">No users found</td></tr>} {/* Note: Colspan is now 4 */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;