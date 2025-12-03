import React, { useEffect, useState, useCallback } from 'react'
import Header from './components/Header'
import CredentialForm from './components/CredentialForm'
import CredentialList from './components/CredentialList'
import Loader from './components/Loader'
import { getCredentials, createCredential, deleteCredential, searchCredentials } from './services/api'

export default function App(){
  const [credentials, setCredentials] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const load = useCallback(async ()=>{
    setLoading(true)
    setError(null)
    try{
      const data = await getCredentials()
      setCredentials(data)
    }catch(err){
      setError(err.message)
    }finally{
      setLoading(false)
    }
  }, [])

  useEffect(()=>{ load() }, [load])

  const handleAdd = async (payload) =>{
    setLoading(true)
    try{
      await createCredential(payload)
      await load()
    }catch(err){
      setError(err.message)
    }finally{ setLoading(false) }
  }

  const handleDelete = async (id) =>{
    if(!confirm('Delete this credential?')) return
    setLoading(true)
    try{
      await deleteCredential(id)
      await load()
    }catch(err){
      setError(err.message)
    }finally{ setLoading(false) }
  }

  const handleSearch = async (q) =>{
    if(!q) return load()
    setLoading(true)
    try{
      const res = await searchCredentials(q)
      setCredentials(res)
    }catch(err){
      setError(err.message)
    }finally{ setLoading(false) }
  }

  return (
    <div className="container">
      <div className="card">
        <Header />
      </div>

      <CredentialForm onAdd={handleAdd} />

      {error && <div className="card" style={{marginTop:12,color:'red'}}>{error}</div>}

      {loading ? <Loader /> : (
        <CredentialList credentials={credentials} onDelete={handleDelete} onSearch={handleSearch} />
      )}
    </div>
  )
}
