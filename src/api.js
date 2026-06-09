// API base: empty in dev (Vite proxy) and in prod when served from the same
// origin as the backend. Override with VITE_API_BASE if you host them separately.
const BASE = import.meta.env.VITE_API_BASE ?? ''

export function decodeJwt(token) {
  try {
    const part = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(decodeURIComponent(escape(atob(part))))
  } catch {
    return null
  }
}

export async function api(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = 'Bearer ' + token
  let res
  try {
    res = await fetch(BASE + path, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch (e) {
    return { ok: false, status: 0, data: { error: 'Cannot reach the server. Is the backend running?' } }
  }
  let data = null
  try { data = await res.json() } catch { data = null }
  return { ok: res.ok, status: res.status, data }
}

export async function uploadCsv(file, table, token) {
  const form = new FormData()
  form.append('file', file)
  if (table) form.append('table', table)
  const headers = {}
  if (token) headers['Authorization'] = 'Bearer ' + token
  // NOTE: do not set Content-Type — the browser adds the multipart boundary.
  let res
  try {
    res = await fetch(BASE + '/api/upload', { method: 'POST', headers, body: form })
  } catch (e) {
    return { ok: false, status: 0, data: { error: 'Cannot reach the server. Is the backend running?' } }
  }
  let data = null
  try { data = await res.json() } catch { data = null }
  return { ok: res.ok, status: res.status, data }
}
