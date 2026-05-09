import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom' // useParams serve para pegar o ID do curso na URL
import axios from 'axios'

function Aulas() {
  const { id } = useParams() // Pega o ID do curso que veio lá da Dashboard
  const navigate = useNavigate()
  
  // Criando as listas e variaveis que vao mudar na tela
  const [aulas, setAulas] = useState([]) // Aqui vao ficar as aulas que o Python mandar
  const [novaAula, setNovaAula] = useState({ title: '', video_url: '' }) // Guarda o que voce digita para criar aula
  
  // Variavel para guardar o instrutor que vem da API externa (Requisito do PDF)
  const [instrutor, setInstrutor] = useState({ nome: '', foto: '' })

  // O useEffect roda assim que a tela abre
  useEffect(() => {
    const userId = localStorage.getItem('userId')
    
    // PROTEÇÃO: Se não tiver logado (sem ID no crachá), manda para o login
    if (!userId) {
      navigate('/')
    } else {
      buscarAulas()
      buscarInstrutorAleatorio() // Chama a API de terceiros que o PDF pede
    }
  }, [id])

  // FUNÇÃO DA API EXTERNA: Busca uma pessoa aleatória para ser o instrutor (Requisito Pág 4 do PDF)
  const buscarInstrutorAleatorio = async () => {
    try {
      const res = await axios.get('https://randomuser.me/api/')
      const pessoa = res.data.results[0]
      setInstrutor({
        nome: `${pessoa.name.first} ${pessoa.name.last}`,
        foto: pessoa.picture.medium
      })
    } catch (err) {
      console.log("Erro ao buscar instrutor externo")
    }
  }

  // Função que busca as aulas desse curso no nosso Python
  const buscarAulas = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/lessons/${id}`)
      setAulas(res.data)
    } catch (err) {
      console.log("Nenhuma aula encontrada para este curso")
    }
  }

  // Função para salvar uma aula nova no banco
  const adicionarAula = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://127.0.0.1:8000/lessons/', {
        title: novaAula.title,
        video_url: novaAula.video_url,
        course_id: id // Vincula a aula ao curso atual
      })
      alert("Aula adicionada com sucesso!")
      setNovaAula({ title: '', video_url: '' }) // Limpa os campos
      buscarAulas() // Atualiza a lista na tela
    } catch (err) {
      alert("Erro ao adicionar aula")
    }
  }

  // FUNÇÃO DE DELETAR: Remove a aula do banco (Completa o CRUD de aulas)
  const deletarAula = async (aulaId) => {
    if (window.confirm("Tem certeza que deseja excluir esta aula?")) {
      try {
        await axios.delete(`http://127.0.0.1:8000/lessons/${aulaId}`)
        buscarAulas() // Remove da tela na hora
      } catch (err) {
        alert("Erro ao remover a aula")
      }
    }
  }

  return (
    <div style={{ backgroundColor: '#111827', color: 'white', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* Botão simples para voltar */}
      <button onClick={() => navigate('/dashboard')} style={{ color: '#60a5fa', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '20px', fontSize: '16px' }}>
        ← Voltar para o Dashboard
      </button>

      {/* Título e Bloco do Instrutor (API Externa) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px', flexWrap: 'wrap', gap: '10px' }}>
        <h1>Conteúdo do Curso #{id}</h1>
        
        {instrutor.foto && (
          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#1f2937', padding: '10px 20px', borderRadius: '50px', border: '1px solid #374151' }}>
            <img src={instrutor.foto} alt="Instrutor" style={{ borderRadius: '50%', width: '40px', marginRight: '10px' }} />
            <span style={{ fontSize: '14px' }}>Instrutor Convidado: <strong>{instrutor.nome}</strong></span>
          </div>
        )}
      </div>

      {/* Formulário para criar aula nova */}
      <section style={{ backgroundColor: '#1f2937', padding: '20px', borderRadius: '10px', marginBottom: '30px' }}>
        <h3>➕ Adicionar Nova Aula</h3>
        <form onSubmit={adicionarAula} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            placeholder="Título da Aula" 
            value={novaAula.title}
            onChange={e => setNovaAula({...novaAula, title: e.target.value})} 
            style={{ padding: '10px', flex: 1, minWidth: '200px' }} 
            required 
          />
          <input 
            type="text" 
            placeholder="Link do Vídeo (URL do YouTube)" 
            value={novaAula.video_url}
            onChange={e => setNovaAula({...novaAula, video_url: e.target.value})} 
            style={{ padding: '10px', flex: 1, minWidth: '200px' }} 
            required 
          />
          <button type="submit" style={{ backgroundColor: '#10b981', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}>
            Salvar Aula
          </button>
        </form>
      </section>

      {/* Listagem das aulas que estão no banco */}
      <div style={{ display: 'grid', gap: '15px' }}>
        {aulas.length === 0 ? <p style={{ color: '#9ca3af' }}>Nenhuma aula cadastrada ainda.</p> : null}
        
        {aulas.map(aula => (
          <div key={aula.id} style={{ backgroundColor: '#1f2937', padding: '20px', borderRadius: '8px', border: '1px solid #374151', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ margin: 0, fontSize: '18px' }}>{aula.title}</h4>
              <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#9ca3af' }}>ID da Aula: {aula.id}</p>
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <a href={aula.video_url} target="_blank" rel="noreferrer" style={{ backgroundColor: '#3b82f6', color: 'white', textDecoration: 'none', padding: '10px 15px', borderRadius: '4px', fontSize: '14px', fontWeight: 'bold' }}>
                Assistir
              </a>
              
              <button 
                onClick={() => deletarAula(aula.id)} 
                style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '4px', cursor: 'pointer' }}
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Aulas