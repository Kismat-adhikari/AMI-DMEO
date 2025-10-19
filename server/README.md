Flask backend for AMI project

Setup

1. Create a virtual environment and activate it:

   python -m venv venv
   # Windows
   venv\Scripts\activate

2. Install dependencies:

   pip install -r requirements.txt

3. Copy `.env.example` to `.env` and update `MONGO_URI` if needed.

4. Run the app:

   python app.py

API

- POST /api/auth/signup
  - body: { name, email, password }
  - creates user in MongoDB

- GET /api/health
  - returns { status: 'ok' }

