import axios from 'axios'

const BASE = 'http://localhost:8000'

const client = axios.create({
  baseURL: BASE,
  headers: { 'Content-Type': 'application/json' },
})

export async function getCredentials() {
  try {
    const res = await client.get('/credentials')
    return res.data
  } catch (err) {
    const msg = err?.response?.data || err.message || 'Failed to fetch credentials'
    throw new Error(msg)
  }
}

export async function createCredential({ site, username, password }) {
  try {
    const res = await client.post('/credentials', { site, username, password })
    return res.data
  } catch (err) {
    const msg = err?.response?.data || err.message || 'Failed to create credential'
    throw new Error(msg)
  }
}

export async function deleteCredential(id) {
  try {
    const res = await client.delete(`/credentials/${id}`)
    return res.data
  } catch (err) {
    const msg = err?.response?.data || err.message || 'Failed to delete credential'
    throw new Error(msg)
  }
}

export async function searchCredentials(site) {
  try {
    const res = await client.get('/credentials/search', { params: { site } })
    return res.data
  } catch (err) {
    const msg = err?.response?.data || err.message || 'Failed to search credentials'
    throw new Error(msg)
  }
}
