import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom' // useParams serve para pegar o ID do curso na URL
import axios from 'axios'

function Aulas() {
  const { id } = useParams() // Pega o ID do curso que veio da Dashboard
  const navigate = useNavigate()
  const [aulas, setAulas] = useState([]) // Lista de aulas que buscaremos no Python
  const [novaAula, setNovaAula] = useState({ title: '', video_url: '' }) // Para cadastrar aula nova

  // Assim que a tela abre, ele busca as aulas desse curso
  useEffect(() => {
    buscarAulas()
  }, [])

  const buscarAulas = async () => {
    try {
      // Chama a rota nova que você acabou de criar no main.py!
      const res = await axios.get(`http://127.0.0.1:8000/lessons/${id}`)
      setAulas(res.data)
    } catch (err) {
      console.log("Nenhuma aula encontrada para este curso")
    }
  }

  const adicionarAula = async (e) => {
    e.preventDefault()
    try {
      // Envia a nova aula ligada ao ID deste curso
      await axios.post('http://127.0.0.1:8000/lessons/', {
        title: novaAula.title,
        video_url: novaAula.video_url,
        course_id: id
      })
      alert("Aula adicionada!")
      setNovaAula({ title: '', video_url: '' }) // Limpa os campos após salvar
      buscarAulas() // Atualiza a lista na tela na mesma hora
    } catch (err) {
      alert("Erro ao adicionar aula")
    }
  }

  return (
    <div style={{ backgroundColor: '#111827', color: 'white', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* Botão para voltar com estilo simples */}
      <button onClick={() => navigate('/dashboard')} style={{ color: '#60a5fa', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '20px' }}>
        ← Voltar para os Cursos
      </button>

      <h1>Conteúdo do Curso #{id}</h1>

      {/* Formulário para o professor adicionar aulas */}
      <section style={{ backgroundColor: '#1f2937', padding: '20px', borderRadius: '10px', marginBottom: '30px' }}>
        <h3>➕ Adicionar Nova Aula</h3>
        <form onSubmit={adicionarAula} style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="Título da Aula" 
            value={novaAula.title}
            onChange={e => setNovaAula({...novaAula, title: e.target.value})} 
            style={{ padding: '8px', flex: 1 }} 
            required 
          />
          <input 
            type="text" 
            placeholder="Link do Vídeo (URL)" 
            value={novaAula.video_url}
            onChange={e => setNovaAula({...novaAula, video_url: e.target.value})} 
            style={{ padding: '8px', flex: 1 }} 
            required 
          />
          <button type="submit" style={{ backgroundColor: '#10b981', color: 'white', border: 'none', padding: '8px 15px', cursor: 'pointer', borderRadius: '4px' }}>
            Adicionar
          </button>
        </form>
      </section>

      {/* Lista de Aulas que aparecem na tela */}
      <div style={{ display: 'grid', gap: '15px' }}>
        {aulas.length === 0 ? <p>Nenhuma aula cadastrada ainda.</p> : null}
        
        {aulas.map(aula => (
          <div key={aula.id} style={{ backgroundColor: '#1f2937', padding: '15px', borderRadius: '8px', border: '1px solid #374151', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ margin: 0 }}>{aula.title}</h4>
              <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#9ca3af' }}>ID da Aula: {aula.id}</p>
            </div>
            {/* Link para abrir o vídeo em outra aba */}
            <a href={aula.video_url} target="_blank" rel="noreferrer" style={{ backgroundColor: '#3b82f6', color: 'white', textDecoration: 'none', padding: '5px 10px', borderRadius: '4px', fontSize: '14px' }}>
              Assistir Vídeo →
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Aulas