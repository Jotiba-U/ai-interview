from flask import Blueprint, request, jsonify
import sqlite3

admin_bp = Blueprint("admin", __name__)
DB_PATH = 'ai_cache.db' # Same database path

# --- Database Helper Functions ---
def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn
# ---------------------------------

# Hardcoded admin credentials (plain text)
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "5569"

# Admin login route
@admin_bp.route("/login", methods=["POST"])
def admin_login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
        return jsonify({"message": "Admin login successful"}), 200
    return jsonify({"message": "Invalid username or password"}), 401

# FIX 1: New route to update user domain (called from MainInterface.js)
@admin_bp.route("/user/domain", methods=["POST"])
def update_user_domain():
    data = request.get_json()
    email = data.get("email")
    domain = data.get("domain")

    conn = get_db_connection()
    # Update the user's domain in the database
    cursor = conn.execute("UPDATE users SET domain = ? WHERE email = ?", (domain, email))
    conn.commit()
    
    if cursor.rowcount == 0:
        conn.close()
        return jsonify({"message": "User not found"}), 404
        
    conn.close()
    return jsonify({"message": f"Domain updated for {email}"}), 200

# FIX 2: Get all users (Reads live data from SQLite)
@admin_bp.route("/users", methods=["GET"])
def get_users():
    conn = get_db_connection()
    # Select all fields needed for the Admin Dashboard table
    users_data = conn.execute("SELECT id, name, email, domain FROM users").fetchall()
    conn.close()
    
    # Convert Row objects to dictionaries
    formatted_users = [dict(user) for user in users_data]

    # Set 'Not selected' default if domain is NULL
    for user in formatted_users:
        if user['domain'] is None:
             user['domain'] = 'Not selected'
    
    return jsonify({"users": formatted_users}), 200

# FIX 3: Delete a user by email (Called from AdminDashboard.js)
@admin_bp.route("/users/<string:email>", methods=["DELETE"])
def delete_user(email):
    conn = get_db_connection()
    cursor = conn.execute("DELETE FROM users WHERE email = ?", (email,))
    conn.commit()
    
    if cursor.rowcount == 0:
        conn.close()
        return jsonify({"message": "User not found"}), 404
        
    conn.close()
    return jsonify({"message": f"User {email} deleted"}), 200