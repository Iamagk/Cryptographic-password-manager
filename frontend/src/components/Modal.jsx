import React from 'react'

export default function Modal({ title, children, onClose, onConfirm, confirmLabel = 'Confirm', error }){
  return (
    <div style={styles.backdrop} onClick={onClose}>
      <div style={styles.modal} onClick={(e)=>e.stopPropagation()}>
        <div style={styles.header}>{title}</div>
        <div style={styles.body}>{children}</div>
        {error && <div style={styles.error}>{error}</div>}
        <div style={styles.footer}>
          <button style={styles.cancel} onClick={onClose}>Cancel</button>
          <button style={styles.confirm} onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  backdrop: {
    position: 'fixed', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(2,6,23,0.45)', zIndex:2000
  },
  modal: {
    width: 'min(520px, 92%)', background:'#fff', borderRadius:12, padding:18, boxShadow:'0 12px 40px rgba(2,6,23,0.2)'
  },
  header: { fontSize:18, fontWeight:700, marginBottom:8 },
  body: { marginBottom:12 },
  footer: { display:'flex', justifyContent:'flex-end', gap:8 },
  cancel: { background:'#f3f4f6', border:'none', padding:'8px 12px', borderRadius:8, cursor:'pointer' },
  confirm: { background:'#2563eb', color:'#fff', border:'none', padding:'8px 12px', borderRadius:8, cursor:'pointer' },
  error: { color:'#b91c1c', marginBottom:8 }
}
