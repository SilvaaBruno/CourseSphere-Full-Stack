import { useState } from 'react'
import axios from 'axios'

function cadastro() {
  const [usuario, setUsuario] = useState({ name: '', email: '', password: '' })
  const [msg, setMsg] = useState('')

  const cadastrar = async (e) => {
    e.preventDefault()
    try {
      // Envia os dados para o seu Backend Python
      const res = await axios.post('http://127.0.0.1:8000/users/', usuario)
      setMsg(`✅ Usuário criado! ID: ${res.data.id}`)
    } catch (err) {
      setMsg('❌ Erro: Servidor offline ou e-mail repetido')
    }
  }

  return (
    <div style={{ backgroundColor: '#111827', color: 'white', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ backgroundColor: '#1f2937', padding: '30px', borderRadius: '8px', width: '300px' }}>
        <h2 style={{ textAlign: 'center', color: '#60a5fa' }}>CourseSphere</h2>
        <form onSubmit={cadastrar} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input type="text" placeholder="Nome" style={{ padding: '8px' }} onChange={e => setUsuario({...usuario, name: e.target.value})} required />
          <input type="email" placeholder="E-mail" style={{ padding: '8px' }} onChange={e => setUsuario({...usuario, email: e.target.value})} required />
          <input type="password" placeholder="Senha" style={{ padding: '8px' }} onChange={e => setUsuario({...usuario, password: e.target.value})} required />
          <button type="submit" style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '10px', cursor: 'pointer' }}>Criar Conta</button>
        </form>
        <p style={{ textAlign: 'center' }}>{msg}</p>
      </div>
    </div>
  )
}

export default cadastro