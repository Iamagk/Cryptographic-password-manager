# Toy Password Manager (backend)

This is a small FastAPI backend for the toy password manager demo. It stores credentials in a local `vault.json` using a Caesar cipher for the password.

Quick start:

1. Create a Python virtual environment and install dependencies:
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2. Run the server:
```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.
