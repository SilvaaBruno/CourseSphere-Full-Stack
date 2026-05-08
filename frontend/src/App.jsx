// Importando as ferramentas necessárias para o site ter várias páginas
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Importando as telas que nós criamos dentro da pasta pages
import Cadastro from './pages/Cadastro'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Aulas from './pages/Aulas' 

function App() {
  return (
    /* O BrowserRouter é como o GPS do site, ele controla o endereço na barra do navegador */
    <BrowserRouter>
      
      {/* O Routes é a lista de caminhos possíveis que o usuário pode seguir */}
      <Routes>
        
        {/* ROTA 1: Quando o site abre (barra vazia), ele mostra a tela de Login */}
        <Route path="/" element={<Login />} />

        {/* ROTA 2: Quando o link for /cadastro, ele troca a tela para o formulário de cadastro */}
        <Route path="/cadastro" element={<Cadastro />} />

        {/* ROTA 3: Esta é a rota da área interna. Só chegamos aqui se o login der certo! */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* ROTA 4: Rota para ver as aulas. O ":id" é um código que muda para cada curso clicado */}
        <Route path="/curso/:id" element={<Aulas />} />

      </Routes>
      
    </BrowserRouter>
  )
}

// Exportando para que o arquivo main.jsx consiga ler e rodar tudo isso
export default App