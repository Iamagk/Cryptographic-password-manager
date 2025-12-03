from pydantic import BaseModel
from typing import Optional


class CredentialIn(BaseModel):
    site: str
    username: str
    password: str


class CredentialOut(BaseModel):
    id: str
    site: str
    username: str
    password: str
    encrypted_id: Optional[str] = None
