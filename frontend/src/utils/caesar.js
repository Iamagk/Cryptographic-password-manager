export const DEFAULT_SHIFT = 3

function shiftChar(c, shift){
  if(c >= 'a' && c <= 'z'){
    return String.fromCharCode((c.charCodeAt(0) - 'a'.charCodeAt(0) + shift + 26) % 26 + 'a'.charCodeAt(0))
  }
  if(c >= 'A' && c <= 'Z'){
    return String.fromCharCode((c.charCodeAt(0) - 'A'.charCodeAt(0) + shift + 26) % 26 + 'A'.charCodeAt(0))
  }
  return c
}

export function decrypt(text, shift = DEFAULT_SHIFT){
  // reverse the Caesar shift
  return String(text).split('').map(c => shiftChar(c, -shift)).join('')
}

export function encrypt(text, shift = DEFAULT_SHIFT){
  return String(text).split('').map(c => shiftChar(c, shift)).join('')
}
