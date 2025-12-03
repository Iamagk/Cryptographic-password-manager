import React, { useState } from 'react'

export default function CredentialForm({ onAdd }){
  const [site, setSite] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const handleSubmit = async (e) =>{
    e.preventDefault()
    setError(null)
    setSuccess(null)
    if(!site || !username || !password){
      setError('Please fill all fields')
      return
    }
    try{
      await onAdd({ site, username, password })
      setSite('')
      setUsername('')
      setPassword('')
      setSuccess('Credential added')
      setTimeout(()=>setSuccess(null), 2500)
    }catch(err){
      console.error(err)
      setError(err.message || 'Failed to add credential')
    }
  }

  return (
    <form className="card" onSubmit={handleSubmit} style={{marginBottom:12}}>
      {error && <div style={{color:'#b91c1c',marginBottom:8}}>{error}</div>}
      {success && <div style={{color:'#065f46',marginBottom:8}}>{success}</div>}
      <input placeholder="Site" value={site} onChange={e=>setSite(e.target.value)} />
      <input placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <div style={{textAlign:'right'}}>
        <button type="submit">Add Credential</button>
      </div>
    </form>
  )
}
