// pages/admin.js
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(false)
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(()=> {
    const ok = document.cookie.split('; ').find(r => r.startsWith('pz_auth='))
    if (ok) setAuthorized(true)
  },[])

  async function askPassword() {
    const { value: input } = await Swal.fire({
      title: 'Masukkan password admin',
      input: 'password'
    })
    if (input) {
      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ action:'list', _serverPW: input }) // server will set secret
      })
      const j = await res.json()
      if (j.ok) {
        document.cookie = `pz_auth=1; path=/; max-age=${60*60*24}`
        setAuthorized(true)
        setList(j.data || [])
        Swal.fire('Berhasil','Login berhasil','success')
      } else {
        Swal.fire('Gagal', j.message || 'Password salah', 'error')
      }
    }
  }

  async function loadList() {
    setLoading(true)
    const res = await fetch('/api/shorten', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ action:'list' })
    })
    const j = await res.json()
    setLoading(false)
    if (j.ok) setList(j.data || [])
    else Swal.fire('Gagal', j.message || 'Gagal load', 'error')
  }

  async function doDelete(code) {
    const confirm = await Swal.fire({
      title: 'Hapus link?',
      text: `Hapus ${code} permanen.`,
      showCancelButton: true,
      icon: 'warning'
    })
    if (!confirm.isConfirmed) return;
    const res = await fetch('/api/shorten', {
      method: 'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ action:'delete', code })
    })
    const j = await res.json()
    if (j.ok) {
      Swal.fire('Terhapus','Link berhasil dihapus','success')
      setList(list.filter(x=>x.code !== code))
    } else Swal.fire('Gagal', j.message || 'Error', 'error')
  }

  async function doEdit(item) {
    const { value: url } = await Swal.fire({
      title: 'Edit URL',
      input: 'url',
      inputLabel: item.code,
      inputValue: item.url,
      showCancelButton: true
    })
    if (url) {
      const res = await fetch('/api/shorten', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ action:'update', code: item.code, url })
      })
      const j = await res.json()
      if (j.ok) {
        Swal.fire('Berhasil','URL diupdate','success')
        setList(list.map(l => l.code === item.code ? {...l, url } : l))
      } else Swal.fire('Gagal', j.message || 'Error', 'error')
    }
  }

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-6 rounded-2xl shadow-lg">
          <h1 className="text-2xl font-bold" style={{color:"#FF6B00"}}>Admin MerakitZAM v2</h1>
          <p className="mt-3 text-sm">Login untuk melihat & mengelola link.</p>
          <button onClick={askPassword} className="mt-6 w-full py-2 rounded-lg text-white" style={{background:"#FF6B00"}}>Login</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow">
        <h1 className="text-2xl font-bold" style={{color:"#FF6B00"}}>Admin Dashboard</h1>
        <div className="mt-4 flex gap-3">
          <button onClick={loadList} className="py-2 px-4 rounded" style={{background:"#FF6B00", color:'#fff'}}>Refresh</button>
        </div>

        <div className="mt-6">
          {loading ? <div>Loading...</div> :
            <table className="w-full table-auto">
              <thead>
                <tr className="text-left">
                  <th>ShortCode</th><th>URL</th><th>CreatedAt</th><th>Clicks</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {list.map(item => (
                  <tr key={item.code} className="border-t">
                    <td className="py-2 font-mono">{item.code}</td>
                    <td className="py-2 break-all"><a href={item.url} target="_blank" rel="noreferrer">{item.url}</a></td>
                    <td className="py-2">{item.createdAt}</td>
                    <td className="py-2">{item.clicks}</td>
                    <td className="py-2 flex gap-2">
                      <button onClick={()=>doEdit(item)} className="py-1 px-3 rounded bg-yellow-400">Edit</button>
                      <button onClick={()=>doDelete(item.code)} className="py-1 px-3 rounded bg-red-500 text-white">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          }
          {list.length === 0 && <div className="mt-4 text-sm text-gray-500">Tidak ada data.</div>}
        </div>
      </div>
    </div>
  )
    }
