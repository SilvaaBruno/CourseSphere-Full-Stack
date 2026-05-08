import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

function Login() {
  // Criando as 'caixinhas' para guardar o que o usuário digita
  const [dados, setDados] = useState({ email: '', password: '' })
  const [msg, setMsg] = useState('')
  const navigate = useNavigate() // Ferramenta para mudar de página

  // Função que roda quando clicamos no botão 'Entrar'
  const handleLogin = async (e) => {
    e.preventDefault() // Impede a página de recarregar do jeito antigo
    try {
      // Chama o Python lá na rota de login que criamos
      const res = await axios.post('http://127.0.0.1:8000/login', dados)
      
      // Se o Python responder OK, guardamos o nome no navegador (localStorage)
      localStorage.setItem('userName', res.data.name)
      localStorage.setItem('userId', res.data.user_id)

      alert('Login feito com sucesso!')
      
      // Manda o usuário para a tela de Dashboard automaticamente
      navigate('/dashboard') 
    } catch (err) {
      // Se o Python der erro 401, cai aqui e avisa o usuário
      setMsg('❌ E-mail ou senha incorretos')
    }
  }

  return (
    // Visual da tela (CSS dentro do JS)
    <div style={{ backgroundColor: '#111827', color: 'white', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ backgroundColor: '#1f2937', padding: '30px', borderRadius: '8px', width: '300px', textAlign: 'center' }}>
        <h2 style={{ color: '#60a5fa' }}>CourseSphere - Login</h2>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* O onChange atualiza nossa caixinha toda vez que digitamos uma letra */}
          <input type="email" placeholder="E-mail" style={{ padding: '10px' }} 
            onChange={e => setDados({...dados, email: e.target.value})} required />
          
          <input type="password" placeholder="Senha" style={{ padding: '10px' }} 
            onChange={e => setDados({...dados, password: e.target.value})} required />
          
          <button type="submit" style={{ backgroundColor: '#2563eb', color: 'white', padding: '10px', cursor: 'pointer', border: 'none' }}>Entrar</button>
        </form>

        <p style={{ color: '#f87171', fontSize: '13px' }}>{msg}</p>
        
        {/* Link que muda a rota para /cadastro sem dar refresh no site */}
        <p style={{ fontSize: '14px' }}>Não tem conta? <Link to="/cadastro" style={{ color: '#60a5fa' }}>Cadastre-se</Link></p>
      </div>
    </div>
  )
}

export default Login