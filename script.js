document.addEventListener('DOMContentLoaded', function() {
  // --- LÓGICA DE VERIFICAÇÃO DE LOGIN E LOGOUT ---

function checarEstadoLogin() {
  const user = localStorage.getItem('supabase.user');
  const userActionsDiv = document.querySelector('.user-actions');

  if (user && userActionsDiv) {
    // Se encontrou um usuário no localStorage, mostra "Minha Conta" e "Sair"
    userActionsDiv.innerHTML = `
      <a href="minha-conta.html" class="action-link">Minha Conta</a>
      <a href="#" id="logout-btn" class="action-link">Sair</a>
      <a href="carrinho.html" class="action-link">Carrinho (0)</a>
    `;
  }
}

// "Ouvinte" de evento para o botão de logout
document.addEventListener('click', function(event) {
  // Verifica se o elemento clicado foi o nosso botão de "Sair"
  if (event.target.id === 'logout-btn') {
    event.preventDefault(); // Impede que o link '#' faça a página pular

    // Limpa os dados do usuário da "memória" do navegador
    localStorage.removeItem('supabase.user');
    localStorage.removeItem('supabase.session');

    alert('Você saiu da sua conta.');
    window.location.reload(); // Recarrega a página para atualizar o cabeçalho
  }
});

// Executa a verificação de login assim que a página carrega
checarEstadoLogin();
  
  // --- LÓGICA DINÂMICA DO CATÁLOGO E API ---

  // URL da nossa API
  const API_URL = 'http://localhost:3000/api/obras';

  // --- Seleção de todos os elementos que vamos usar ---
  const gradeObras = document.querySelector('.grade-obras');
  const linksFiltro = document.querySelectorAll('.menu-lateral a[data-filtro]');
  const formBusca = document.querySelector('.busca-lateral');
  const inputBusca = document.querySelector('.busca-lateral input[type="search"]');

  // Variável que vai guardar nossa lista de obras principal
  let todasAsObras = [];

  // --- Funções ---

  // Função para desenhar os cards na tela
 function exibirObras(listaDeObras) {
    if (!gradeObras) return; // Se não encontrar a grade, para a execução

    gradeObras.innerHTML = ''; // Limpa a grade antes de adicionar
    if (listaDeObras.length === 0) {
        gradeObras.innerHTML = '<p>Nenhuma obra encontrada para este filtro.</p>';
        return;
    }
    listaDeObras.forEach(obra => {
      const cardHTML = `
        <a href="${obra.detalhes_url}" class="obra-card" target="_blank">
            <div class="obra-imagem-container">
                <img src="${obra.imagem_url}" alt="${obra.titulo}">
            </div>
            <div class="obra-info">
                <h3 class="obra-titulo">${obra.titulo}</h3>
                <p class="obra-artista">${obra.artista}</p>
                <p class="obra-preco">R$ ${parseFloat(obra.preco).toFixed(2).replace('.', ',')}</p>
            </div>
        </a>
      `;
      gradeObras.innerHTML += cardHTML;
    });
  }

  // --- Lógica Principal ---

  // Só tentamos buscar os dados se a grade de obras existir na página
  if (gradeObras) {
    fetch(API_URL)
      .then(response => {
        if (!response.ok) {
            throw new Error('Erro de rede ao buscar os dados.');
        }
        return response.json();
      })
      .then(data => {
        // SUCESSO! Os dados chegaram do servidor.
        todasAsObras = data; // Agora a variável 'todasAsObras' existe e tem conteúdo.
        exibirObras(todasAsObras); // Exibimos todas as obras na tela.

        // Evento para os links de filtro (categoria/artista)
        linksFiltro.forEach(link => {
          link.addEventListener('click', function(event) {
            event.preventDefault();
            const filtro = this.dataset.filtro;
            const valor = this.dataset.valor;
            
            let obrasFiltradas;
            if (filtro === 'todos') {
              obrasFiltradas = todasAsObras;
            } else {
              obrasFiltradas = todasAsObras.filter(obra => obra[filtro] === valor);
            }
            exibirObras(obrasFiltradas);
          });
        });

        // Evento para o formulário de busca
        if (formBusca && inputBusca) {
          formBusca.addEventListener('submit', function(event) {
            event.preventDefault();
            const termoBusca = inputBusca.value.trim().toLowerCase();

            const resultadosBusca = todasAsObras.filter(obra => {
              const titulo = obra.titulo.toLowerCase();
              const artista = obra.artista.toLowerCase();
              return titulo.includes(termoBusca) || artista.includes(termoBusca);
            });
            exibirObras(resultadosBusca);
          });
        }
      })
      .catch(error => {
        console.error('Erro ao buscar ou processar dados da API:', error);
        gradeObras.innerHTML = '<p>Não foi possível carregar as obras. Verifique se o servidor back-end está rodando.</p>';
      });
  }
  // --- LÓGICA PARA A PÁGINA DE ARTISTAS (DINÂMICA) ---

// 1. Encontrar a grade de artistas na página
const artistasGrid = document.querySelector('.artistas-grid');

// 2. SÓ executa este código se a grade de artistas existir na página atual
if (artistasGrid) {
  // A URL da nossa API de artistas
  const ARTISTAS_API_URL = 'http://localhost:3000/api/artistas';

  // 3. Função para desenhar os cards dos artistas
  function exibirArtistas(listaDeArtistas) {
    artistasGrid.innerHTML = ''; // Limpa a grade antes de adicionar

    listaDeArtistas.forEach(artista => {
      // Usamos os dados que vêm do banco de dados (artista.nome, artista.bio, etc.)
      const cardHTML = `
        <div class="artista-card-novo">
            <div class="artista-card-imagem-link">
                <img src="${artista.imagem_url}" alt="${artista.nome}">
            </div>
            <div class="artista-card-info">
                <h3>${artista.nome}</h3>
                <p class="artista-card-bio">${artista.bio}</p>
                <a href="${artista.detalhe_url}" class="btn-ver-obras">Ver Obras</a>
            </div>
        </div>
      `;
      artistasGrid.innerHTML += cardHTML;
    });
  }

  // 4. Busca os dados dos artistas na nossa API e os exibe
  artistasGrid.innerHTML = '<p>Carregando artistas...</p>';
  fetch(ARTISTAS_API_URL)
    .then(response => response.json())
    .then(data => {
      // Usa a função para desenhar os cards com os dados recebidos
      exibirArtistas(data);
    })
    .catch(error => {
      console.error('Erro ao buscar artistas da API:', error);
      artistasGrid.innerHTML = '<p>Não foi possível carregar os artistas.</p>';
    });
}
// --- LÓGICA DO FORMULÁRIO DE CADASTRO ---

const formCadastro = document.querySelector('#form-cadastro');

if (formCadastro) {
  formCadastro.addEventListener('submit', async function(event) {
    event.preventDefault(); // Impede o recarregamento da página

    // Pega os valores dos campos
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#senha').value;

    // Envia os dados para a API de registro no nosso back-end
    const response = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }), // Converte os dados para JSON
    });

    const data = await response.json();

    if (response.ok) {
      alert('Usuário criado com sucesso! Você já pode fazer o login.');
      // Redireciona o usuário para a página de login após o sucesso
      window.location.href = 'login.html';
    } else {
      // Mostra a mensagem de erro que veio do Supabase/back-end
      alert('Erro ao criar usuário: ' + data.error);
    }
  });
}


// --- LÓGICA DO FORMULÁRIO DE LOGIN (ATUALIZADA) ---

const formLogin = document.querySelector('#form-login');

if (formLogin) {
  formLogin.addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.querySelector('#email').value;
    const password = document.querySelector('#senha').value;

    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Salva os dados do usuário e a sessão na "memória" do navegador
      localStorage.setItem('supabase.user', JSON.stringify(data.user));
      localStorage.setItem('supabase.session', JSON.stringify(data.session));
      
      alert('Login realizado com sucesso!');
      window.location.href = 'index.html'; // Redireciona para a página inicial
    } else {
      alert('Erro no login: ' + data.error);
    }
  });
}
});