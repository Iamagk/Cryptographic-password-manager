import json
import uuid
from pathlib import Path
from typing import List

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from models import CredentialIn, CredentialOut
from caesar import encrypt, decrypt

VAULT_PATH = Path(__file__).parent / "vault.json"

app = FastAPI(title="Toy Password Manager (Caesar Cipher)")

app.add_middleware(
    CORSMiddleware,
    # Allow common dev ports used by Vite/CRA and the backend docs
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:3000", "http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def load_vault() -> List[dict]:
    if not VAULT_PATH.exists():
        VAULT_PATH.write_text('[]', encoding='utf-8')
    with VAULT_PATH.open('r', encoding='utf-8') as f:
        return json.load(f)


def save_vault(data: List[dict]):
    with VAULT_PATH.open('w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)


@app.get('/credentials', response_model=List[CredentialOut])
def get_credentials():
    """Return all credentials with passwords decrypted for display."""
    data = load_vault()
    # Decrypt passwords before returning
    for item in data:
        item['password'] = decrypt(item.get('password', ''))
        # include an encrypted version of the id for frontend display
        item['encrypted_id'] = encrypt(item.get('id', ''))
    return data


@app.get('/credentials/search', response_model=List[CredentialOut])
def search_credentials(site: str = Query(..., min_length=1)):
    """Search credentials by site (case-insensitive substring)."""
    data = load_vault()
    site_lower = site.lower()
    results = []
    for item in data:
        if site_lower in item.get('site', '').lower():
            # return decrypted password
            results.append({**item, 'password': decrypt(item.get('password', '')), 'encrypted_id': encrypt(item.get('id', ''))})
    return results


@app.post('/credentials', response_model=CredentialOut)
def create_credential(cred: CredentialIn):
    """Create a credential; password is stored encrypted in the JSON vault."""
    data = load_vault()
    new_id = str(uuid.uuid4())
    encrypted_pw = encrypt(cred.password)
    item = {
        'id': new_id,
        'site': cred.site,
        'username': cred.username,
        'password': encrypted_pw,
    }
    data.append(item)
    save_vault(data)
    # Return decrypted password for UI convenience
    return {**item, 'password': cred.password, 'encrypted_id': encrypt(new_id)}


@app.delete('/credentials/{cred_id}')
def delete_credential(cred_id: str):
    data = load_vault()
    new_data = [c for c in data if c.get('id') != cred_id]
    if len(new_data) == len(data):
        raise HTTPException(status_code=404, detail='Credential not found')
    save_vault(new_data)
    return {'ok': True}


if __name__ == '__main__':
    import uvicorn

    uvicorn.run('main:app', host='127.0.0.1', port=8000, reload=True)
