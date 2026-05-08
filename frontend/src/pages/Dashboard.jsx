import { useState, useEffect } from 'react' // useEffect serve para rodar uma função assim que a tela abre
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Dashboard() {
  const navigate = useNavigate()
  
  // Criando as listas e variaveis que vao mudar na tela
  const [cursos, setCursos] = useState([]) // Aqui vao ficar os cursos que vem do banco
  const [nomeCurso, setNomeCurso] = useState('') // Guarda o que voce digita no campo de nome
  
  // Pegando as informações que salvamos no "crachá" (localStorage) lá no login
  const nomeUsuario = localStorage.getItem('userName') || 'Usuário'
  const userId = localStorage.getItem('userId')

  // O useEffect roda a função de buscar cursos assim que o componente aparece na tela
  useEffect(() => {
    buscarCursos()
  }, [])

  // Função que vai no Python (Backend) buscar os cursos que ja existem
  const buscarCursos = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/courses/')
      setCursos(res.data) // Coloca os cursos que o Python mandou dentro da nossa lista
    } catch (err) {
      console.log("Erro ao buscar cursos ou banco vazio")
    }
  }

  // Função que envia o novo curso para o banco de dados
  const salvarCurso = async (e) => {
    e.preventDefault() // Nao deixa a pagina recarregar sozinha
    try {
      await axios.post('http://127.0.0.1:8000/courses/', {
        name: nomeCurso,
        description: "Curso criado pelo painel", 
        start_date: "2024-01-01", // Datas padrão para o Python não reclamar
        end_date: "2024-12-31",
        creator_id: userId // O ID do usuário que pegamos no login
      })
      
      alert("Curso cadastrado!")
      setNomeCurso('') // Limpa o campo de texto depois de salvar
      buscarCursos() // Chama a lista de novo para o curso aparecer na hora
    } catch (err) {
      alert("Erro ao cadastrar curso")
    }
  }

  // Função para deslogar
  const handleLogout = () => {
    localStorage.clear() // Limpa o crachá do navegador
    navigate('/') // Volta para a tela de login
  }

  return (
    <div style={{ backgroundColor: '#111827', color: 'white', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* Barra de cima com o nome e botão sair */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #374151', paddingBottom: '15px' }}>
        <h2 style={{ color: '#60a5fa' }}>CourseSphere</h2>
        <div>
          <span style={{ marginRight: '15px' }}>Olá, <strong>{nomeUsuario}</strong></span>
          <button onClick={handleLogout} style={{ color: '#f87171', background: 'none', border: 'none', cursor: 'pointer' }}>Sair</button>
        </div>
      </nav>

      {/* Seção para criar um curso novo */}
      <div style={{ maxWidth: '800px', margin: '40px auto' }}>
        <section style={{ backgroundColor: '#1f2937', padding: '20px', borderRadius: '10px', marginBottom: '30px' }}>
          <h3>➕ Adicionar Novo Curso</h3>
          <form onSubmit={salvarCurso}>
            <input 
              type="text" 
              placeholder="Digite o nome do curso..." 
              value={nomeCurso}
              onChange={(e) => setNomeCurso(e.target.value)}
              style={{ padding: '10px', width: '70%', marginRight: '10px' }}
              required 
            />
            <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#10b981', color: 'white', border: 'none', cursor: 'pointer' }}>
              Salvar
            </button>
          </form>
        </section>

        {/* Seção que mostra os cursos cadastrados */}
        <section>
          <h3>📚 Meus Cursos Disponíveis</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {cursos.length === 0 ? <p>Nenhum curso cadastrado ainda.</p> : null}
            
            {/* O .map percorre a lista de cursos e cria um quadradinho para cada um */}
            {cursos.map(curso => (
              <div key={curso.id} style={{ backgroundColor: '#1f2937', padding: '20px', borderRadius: '10px', border: '1px solid #374151' }}>
                <h4 style={{ margin: '0 0 10px 0' }}>{curso.name}</h4>
                
                {/* ADIÇÃO: Agora o botão usa o navigate para ir para a tela de aulas usando o ID do curso */}
                <button 
                  onClick={() => navigate(`/curso/${curso.id}`)} 
                  style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Acessar Aulas
                </button>

              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Dashboard