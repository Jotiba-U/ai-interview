from flask import Blueprint, request, jsonify
import sqlite3

auth_bp = Blueprint("auth_bp", __name__)
DB_PATH = 'ai_cache.db'

# --- Database Helper Functions ---
def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    # Create users table if it doesn't exist
    conn.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            password TEXT NOT NULL,
            domain TEXT DEFAULT NULL
        )
    ''')
    conn.commit()
    conn.close()

# Ensure database table is ready when the blueprint initializes
init_db()
# ---------------------------------

# Signup route
@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    email = data.get("email")
    name = data.get("name")
    password = data.get("password")
    
    if not name or not email or not password:
        return jsonify({"error": "Missing required fields"}), 400

    try:
        conn = get_db_connection()
        conn.execute("INSERT INTO users (email, name, password) VALUES (?, ?, ?)",
                     (email, name, password))
        conn.commit()
        conn.close()
        
        return jsonify({"message": "Signup successful", "user": {"name": name, "email": email}}), 200
    except sqlite3.IntegrityError:
        return jsonify({"message": "User already exists"}), 409
    except Exception as e:
        print(f"Database error on signup: {e}")
        return jsonify({"message": "Server error during registration"}), 500

# Login route
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    
    conn = get_db_connection()
    # Retrieve user data
    user = conn.execute("SELECT name, email, password FROM users WHERE email = ?", (email,)).fetchone()
    conn.close()
    
    if user and user['password'] == password:
        # Return stored name upon successful login
        return jsonify({"message": "Login successful", "user": {"name": user["name"], "email": user["email"]}}), 200
    
    return jsonify({"message": "Invalid credentials"}), 401