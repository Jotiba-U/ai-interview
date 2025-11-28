from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Import Blueprints
from routes.auth_routes import auth_bp
from routes.admin_routes import admin_bp
from routes.ai_routes import ai_bp  # make sure this path is correct

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Register blueprints with prefixes
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(admin_bp, url_prefix="/api/admin")
app.register_blueprint(ai_bp, url_prefix="/api/ai")  # ✅ This is important

# Health check
@app.route("/")
def home():
    return jsonify({"message": "✅ Backend Running"})

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
