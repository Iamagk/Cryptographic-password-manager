import React, { useState } from 'react'
import { decrypt as caesarDecrypt } from '../utils/caesar'
import Modal from './Modal'

export default function CredentialList({ credentials = [], onDelete, onSearch }){
  const [revealed, setRevealed] = useState({})
  const [modalOpen, setModalOpen] = useState(false)
  const [modalCredential, setModalCredential] = useState(null)
  const [masterPassword, setMasterPassword] = useState('')
  const [modalError, setModalError] = useState(null)

  function openDecryptModal(c){
    setModalError(null)
    setMasterPassword('')
    setModalCredential(c)
    setModalOpen(true)
  }

  function handleHide(c){
    setRevealed(prev => {
      const copy = { ...prev }
      delete copy[c.id]
      return copy
    })
  }

  function handleModalClose(){
    setModalOpen(false)
    setModalCredential(null)
    setModalError(null)
  }

  function handleModalConfirm(){
    if(!modalCredential) return
    if(masterPassword !== 'password'){
      setModalError('Incorrect master password')
      return
    }
    const enc = modalCredential.encrypted_id || modalCredential.id
    const dec = caesarDecrypt(enc)
    setRevealed(prev => ({ ...prev, [modalCredential.id]: dec }))
    handleModalClose()
  }

  return (
    <div className="card">
      <div className="search">
        <input placeholder="Search by site" onChange={(e)=>onSearch && onSearch(e.target.value)} />
      </div>

      <table>
        <thead>
          <tr>
            <th>Site</th>
            <th>Encrypted ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {credentials.length === 0 && (
            <tr><td colSpan={3} style={{padding:'12px'}}>No credentials</td></tr>
          )}

          {credentials.map(c => (
            <React.Fragment key={c.id}>
              <tr>
                <td>{c.site}</td>
                <td style={{fontFamily:'monospace',fontSize:'12px',color:'#374151'}}>
                  {revealed[c.id] ? revealed[c.id] : (c.encrypted_id || c.id)}
                </td>
                <td>
                  <div className="actions">
                    {revealed[c.id]
                      ? <button onClick={()=>handleHide(c)}>Hide</button>
                      : <button onClick={()=>openDecryptModal(c)}>Decrypt</button>
                    }
                    <button className="delete" onClick={()=>onDelete(c.id)}>Delete</button>
                  </div>
                </td>
              </tr>

              {revealed[c.id] && (
                <tr>
                  <td colSpan={3} style={{padding:'8px 16px',background:'#fbfbfd'}}>
                    <div style={{display:'flex',gap:20,alignItems:'center'}}>
                      <div><strong>Username:</strong> <span style={{fontFamily:'monospace'}}>{c.username}</span></div>
                      <div><strong>Password:</strong> <span style={{fontFamily:'monospace'}}>{c.password}</span></div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <Modal title="Unlock credential" onClose={handleModalClose} onConfirm={handleModalConfirm} error={modalError} confirmLabel="Unlock">
          <div style={{marginBottom:8}}>Enter master password to reveal username and password for <strong>{modalCredential?.site}</strong></div>
          <input autoFocus value={masterPassword} onChange={(e)=>{setMasterPassword(e.target.value); setModalError(null)}} type="password" placeholder="Master password" style={{width:'100%',padding:8,borderRadius:8,border:'1px solid #e6eefb'}} />
        </Modal>
      )}
    </div>
  )
}
