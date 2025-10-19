from datetime import datetime
import os

# load .env if present
from dotenv import load_dotenv
load_dotenv()

from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash
from werkzeug.security import check_password_hash
from pymongo import MongoClient


def create_app():
    app = Flask(__name__)

    # Load configuration from environment
    MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/ami-demo')
    FRONTEND_ORIGIN = os.getenv('FRONTEND_ORIGIN', 'http://localhost:5173')

    # During local development be permissive about CORS so the frontend dev server
    # (which may run on different ports) can call the API without failing the preflight.
    # In production you should restrict origins appropriately (e.g. FRONTEND_ORIGIN).
    CORS(app)

    # Connect to MongoDB
    client = MongoClient(MONGO_URI)
    # get_default_database() may return None; don't use truth testing on Database objects
    db = client.get_default_database()
    if db is None:
        db = client['ami-demo']
    users = db.users

    # Ensure unique index on email
    try:
        users.create_index('email', unique=True)
    except Exception:
        # If index creation fails (e.g., already exists), ignore
        pass


    @app.route('/api/health', methods=['GET'])
    def health():
        return jsonify({'status': 'ok'})


    @app.route('/api/auth/signup', methods=['POST'])
    def signup():
        data = request.get_json(force=True)
        name = (data.get('name') or '').strip()
        email = (data.get('email') or '').strip().lower()
        password = data.get('password') or ''

        if not name or not email or not password:
            return jsonify({'error': 'name, email and password are required'}), 400

        # Check if user already exists
        existing = users.find_one({'email': email})
        if existing:
            return jsonify({'error': 'User with that email already exists'}), 409

        # Hash password (Werkzeug PBKDF2)
        password_hash = generate_password_hash(password)

        user = {
            'name': name,
            'email': email,
            'emailVerified': False,
            'passwordHash': password_hash,
            'providers': [],
            'signUpMethod': 'normal',
            'createdAt': datetime.utcnow(),
            'updatedAt': datetime.utcnow(),
            'isActive': True,
        }

        result = users.insert_one(user)

        return jsonify({'message': 'User created', 'userId': str(result.inserted_id)}), 201


    @app.route('/api/auth/login', methods=['POST'])
    def login():
        data = request.get_json(force=True)
        email = (data.get('email') or '').strip().lower()
        password = data.get('password') or ''

        if not email or not password:
            return jsonify({'error': 'email and password are required'}), 400

        user = users.find_one({'email': email})
        if not user:
            return jsonify({'error': 'Invalid email or password'}), 401

        pw_hash = user.get('passwordHash')
        if not pw_hash or not check_password_hash(pw_hash, password):
            return jsonify({'error': 'Invalid email or password'}), 401

        # login successful - in a real app return a token or session
        return jsonify({'message': 'Login successful', 'userId': str(user.get('_id'))}), 200


    return app


if __name__ == '__main__':
    app = create_app()
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
