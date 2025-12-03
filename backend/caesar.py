from typing import Optional

DEFAULT_SHIFT = 3

def _shift_char(c: str, shift: int) -> str:
    if 'a' <= c <= 'z':
        return chr((ord(c) - ord('a') + shift) % 26 + ord('a'))
    if 'A' <= c <= 'Z':
        return chr((ord(c) - ord('A') + shift) % 26 + ord('A'))
    return c

def encrypt(text: str, shift: Optional[int] = None) -> str:
    """Encrypt using a Caesar cipher (simple shift)."""
    if shift is None:
        shift = DEFAULT_SHIFT
    return ''.join(_shift_char(c, shift) for c in text)

def decrypt(text: str, shift: Optional[int] = None) -> str:
    """Decrypt a Caesar-ciphered string."""
    if shift is None:
        shift = DEFAULT_SHIFT
    return ''.join(_shift_char(c, -shift) for c in text)
