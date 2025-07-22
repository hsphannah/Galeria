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

  // <<< MUDANÇA PRINCIPAL AQUI >>>
  // URL base da nossa API online na Render. Todas as chamadas usarão esta variável.
  const BASE_API_URL = 'https://galeria-utk7.onrender.com';


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
    // Usamos a nova constante para montar a URL completa
    fetch(`${BASE_API_URL}/api/obras`)
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
    // Usamos a nova constante para montar a URL completa
    fetch(`${BASE_API_URL}/api/artistas`)
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
      // Usamos a nova constante para montar a URL completa
      const response = await fetch(`${BASE_API_URL}/api/register`, {
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

      // Usamos a nova constante para montar a URL completa
      const response = await fetch(`${BASE_API_URL}/api/login`, {
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
  // --- LÓGICA PARA ADICIONAR AO CARRINHO (PÁGINA DE DETALHES) ---

  // 1. Encontrar o botão e o container da obra na página
  const btnComprar = document.querySelector('#btn-comprar-detalhe');
  const detalheContainer = document.querySelector('.detalhe-container');

  // 2. SÓ executa este código se o botão de comprar existir na página atual
  if (btnComprar && detalheContainer) {
    btnComprar.addEventListener('click', async function() {

      // 3. Verifica se o utilizador está logado (procurando a sessão no localStorage)
      const sessionData = localStorage.getItem('supabase.session');

      if (!sessionData) {
        alert('Por favor, faça login para adicionar obras ao carrinho.');
        window.location.href = 'login.html'; // Redireciona para a página de login
        return;
      }

      // 4. Se estiver logado, pega as informações necessárias
      const session = JSON.parse(sessionData);
      const token = session.access_token; // O "crachá" do utilizador
      const obraId = detalheContainer.dataset.obraId; // Pega o ID da obra do data-attribute

      // 5. Envia a requisição para a nossa API do back-end
      try {
        // Usamos a nova constante para montar a URL completa
        const response = await fetch(`${BASE_API_URL}/api/cart/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Envia o "crachá" para autorização
          },
          body: JSON.stringify({ obra_id: obraId })
        });

        const result = await response.json();

        if (response.ok) {
          alert('Obra adicionada ao carrinho com sucesso!');
          // No futuro, poderíamos atualizar o ícone do carrinho aqui
        } else {
          // Mostra o erro que veio do nosso back-end
          throw new Error(result.error || 'Não foi possível adicionar a obra ao carrinho.');
        }
      } catch (error) {
        console.error('Erro ao adicionar ao carrinho:', error);
        alert(error.message);
      }
    });
  }
  /* =============================================== */
/* --- LÓGICA DO MENU HAMBÚRGUER ---             */
/* =============================================== */

// Seleciona os elementos que acabamos de criar no HTML
const btnAbrir = document.querySelector('#btn-abrir-menu');
const btnFechar = document.querySelector('#btn-fechar-menu');
const menuLateral = document.querySelector('.menu-lateral');
const overlay = document.querySelector('#overlay-menu');

// Função para abrir o menu
function abrirMenu() {
    menuLateral.classList.add('ativo');
    overlay.classList.add('ativo');
}

// Função para fechar o menu
function fecharMenu() {
    menuLateral.classList.remove('ativo');
    overlay.classList.remove('ativo');
}

// Adiciona os "ouvintes" de evento aos botões e ao overlay
// Só adiciona se os botões existirem na página
if (btnAbrir && menuLateral && overlay && btnFechar) {
    btnAbrir.addEventListener('click', abrirMenu);
    btnFechar.addEventListener('click', fecharMenu);
    overlay.addEventListener('click', fecharMenu);
}
});