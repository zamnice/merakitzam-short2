// pages/index.js
import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'

export default function Home() {
  const [authorized, setAuthorized] = useState(false)
  const [url, setUrl] = useState('')
  const [code, setCode] = useState('')

  useEffect(()=> {
    const ok = document.cookie.split('; ').find(r => r.startsWith('pz_auth='))
    if (ok) setAuthorized(true)
  },[])

  async function askPassword() {
    const { value: input } = await Swal.fire({
      title: 'Masukkan password',
      input: 'password',
      inputPlaceholder: 'Password',
      showCancelButton: true
    })
    if (input) {
      // verify via API
      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ action:'checkpw', pw: input })
      })
      const j = await res.json()
      if (j.ok) {
        document.cookie = `pz_auth=1; path=/; max-age=${60*60*24}`
        setAuthorized(true)
        Swal.fire('Berhasil','Password benar','success')
      } else {
        Swal.fire('Gagal', j.message || 'Password salah','error')
      }
    }
  }

  function genCode(len=5) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let out = "";
    for (let i=0;i<len;i++) out += chars[Math.floor(Math.random()*chars.length)];
    return out;
  }

  async function doShorten() {
    if (!url) return Swal.fire('Oops','Masukkan URL','warning')
    const c = code || genCode(5)
    // call server API to create
    const res = await fetch('/api/shorten', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ action:'create', code: c, url })
    })
    const j = await res.json()
    if (j.ok) {
      const short = `${location.origin}/${c}`
      Swal.fire({
        title: 'Short link dibuat',
        html: `Short URL: <a href="${short}" target="_blank">${short}</a>`,
        icon: 'success'
      })
      setUrl(''); setCode('')
    } else {
      Swal.fire('Gagal', j.message || 'Error', 'error')
    }
  }

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-6 rounded-2xl shadow-lg">
          <h1 className="text-2xl font-bold" style={{color:"#FF6B00"}}>MerakitZAM Shortener v2</h1>
          <p className="mt-3 text-sm">Halaman terproteksi — masukkan password untuk lanjut.</p>
          <button onClick={askPassword} className="mt-6 w-full py-2 rounded-lg text-white" style={{background:"#FF6B00"}}>Masuk</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6 flex items-start justify-center">
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold" style={{color:"#FF6B00"}}>MerakitZAM Shortener v2</h1>
        <p className="mt-2 text-sm text-gray-600">Preview page + Admin dashboard tersedia. Daily limit: 100 links.</p>

        <div className="mt-6 grid gap-4">
          <input className="p-3 border rounded-lg" placeholder="https://contoh.com/..." value={url} onChange={e=>setUrl(e.target.value)} />
          <input className="p-3 border rounded-lg" placeholder="Custom path (opsional)" value={code} onChange={e=>setCode(e.target.value)} />
          <div className="flex gap-3">
            <button onClick={doShorten} className="flex-1 py-3 rounded-lg text-white" style={{background:"#FF6B00"}}>Shorten</button>
            <a className="py-3 px-4 rounded-lg border" href="/admin">Admin</a>
          </div>
        </div>
      </div>
    </div>
  )
    }
