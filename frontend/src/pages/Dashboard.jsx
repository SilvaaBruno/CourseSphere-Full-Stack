import { useState, useEffect } from 'react' // useEffect serve para rodar uma função assim que a tela abre
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Dashboard() {
  const navigate = useNavigate()
  
  // Criando as listas e variaveis que vao mudar na tela
  const [cursos, setCursos] = useState([]) // Aqui vao ficar os cursos que vem do banco
  const [nomeCurso, setNomeCurso] = useState('') // Guarda o que voce digita no campo de nome
  const [busca, setBusca] = useState('') // Guarda o termo de busca para filtrar a lista

  // NOVOS ESTADOS: Para controlar as datas do curso (Requisito da Pág 2 do PDF)
  const [dataInicio, setDataInicio] = useState('') 
  const [dataFim, setDataFim] = useState('')

  // Pegando as informações que salvamos no "crachá" (localStorage) lá no login
  const nomeUsuario = localStorage.getItem('userName') || 'Usuário'
  const userId = localStorage.getItem('userId')

  // O useEffect agora faz a PROTEÇÃO DA TELA (Requisito do PDF)
  useEffect(() => {
    if (!userId) {
      // Se não tem ID do usuário, manda de volta para o login (não deixa bisbilhotar)
      navigate('/')
    } else {
      buscarCursos()
    }
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

    // LÓGICA DE VALIDAÇÃO: Impede data de fim menor que a de início (Requisito do PDF)
    if (new Date(dataFim) < new Date(dataInicio)) {
      alert("Erro: A data de término não pode ser menor que a data de início!")
      return // Para a função aqui e não envia para o Python
    }

    try {
      await axios.post('http://127.0.0.1:8000/courses/', {
        name: nomeCurso,
        description: "Curso criado pelo painel", 
        start_date: dataInicio, // Usa a data digitada no calendário
        end_date: dataFim, // Usa a data digitada no calendário
        creator_id: userId // O ID do usuário que pegamos no login
      })
      
      alert("Curso cadastrado!")
      setNomeCurso('') // Limpa o campo de texto depois de salvar
      setDataInicio('') // Limpa a data
      setDataFim('') // Limpa a data
      buscarCursos() // Chama a lista de novo para o curso aparecer na hora
    } catch (err) {
      alert("Erro ao cadastrar curso")
    }
  }

  // NOVA FUNÇÃO: Deleta o curso (Requisito do PDF para ter CRUD completo)
  const deletarCurso = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este curso?")) {
      try {
        await axios.delete(`http://127.0.0.1:8000/courses/${id}`)
        buscarCursos() // Atualiza a lista na hora para o curso sumir da tela
      } catch (err) {
        alert("Erro ao remover curso")
      }
    }
  }

  // Função para deslogar
  const handleLogout = () => {
    localStorage.clear() // Limpa o crachá do navegador
    navigate('/') // Volta para a tela de login
  }

  // Lógica que filtra a lista de cursos de acordo com o que foi digitado na busca
  const cursosFiltrados = cursos.filter(curso => 
    curso.name.toLowerCase().includes(busca.toLowerCase())
  )

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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input 
                type="text" 
                placeholder="Digite o nome do curso..." 
                value={nomeCurso}
                onChange={(e) => setNomeCurso(e.target.value)}
                style={{ padding: '10px' }}
                required 
              />
              
              {/* Campos de data adicionados para cumprir a regra de negócio do PDF */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', display: 'block' }}>Início:</label>
                  <input 
                    type="date" 
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                    style={{ padding: '10px', width: '100%' }}
                    required 
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', display: 'block' }}>Término:</label>
                  <input 
                    type="date" 
                    value={dataFim}
                    onChange={(e) => setDataFim(e.target.value)}
                    style={{ padding: '10px', width: '100%' }}
                    required 
                  />
                </div>
              </div>

              <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#10b981', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                Salvar Curso
              </button>
            </div>
          </form>
        </section>

        {/* Campo de entrada para a busca/filtro (Requisito do PDF) */}
        <section style={{ marginBottom: '20px' }}>
          <input 
            type="text" 
            placeholder="🔍 Buscar curso por nome..." 
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={{ padding: '12px', width: '100%', borderRadius: '5px', border: '1px solid #374151', backgroundColor: '#1f2937', color: 'white' }} 
          />
        </section>

        {/* Seção que mostra os cursos cadastrados */}
        <section>
          <h3>📚 Meus Cursos Disponíveis</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {cursosFiltrados.length === 0 ? <p>Nenhum curso encontrado.</p> : null}
            
            {/* O .map agora usa a lista filtrada em vez da lista cheia */}
            {cursosFiltrados.map(curso => (
              <div key={curso.id} style={{ backgroundColor: '#1f2937', padding: '20px', borderRadius: '10px', border: '1px solid #374151' }}>
                <h4 style={{ margin: '0 0 10px 0' }}>{curso.name}</h4>
                <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '10px' }}>Termina em: {curso.end_date}</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => navigate(`/curso/${curso.id}`)} style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                    Acessar Aulas
                  </button>
                  
                  {/* BOTÃO NOVO: Deletar curso */}
                  <button onClick={() => deletarCurso(curso.id)} style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Dashboard