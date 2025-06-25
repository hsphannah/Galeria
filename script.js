document.addEventListener('DOMContentLoaded', function() {
  
  // --- PARTE 1: VERIFICAÇÃO DE LOGIN E ATUALIZAÇÃO DO CABEÇALHO ---
  // Este código corre em TODAS as páginas.
  
  function checarEstadoLogin() {
    const user = localStorage.getItem('supabase.user');
    const userActionsDiv = document.querySelector('.user-actions');

    if (user && userActionsDiv) {
      // Se encontrou um utilizador no localStorage, mostra "Minha Conta" e "Sair"
      userActionsDiv.innerHTML = `
        <a href="minha-conta.html" class="action-link">Minha Conta</a>
        <a href="#" id="logout-btn" class="action-link">Sair</a>
        <a href="carrinho.html" class="action-link">Carrinho (0)</a>
      `;
    }
  }

  // "Ouvinte" de evento para o botão de logout
  document.addEventListener('click', function(event) {
    if (event.target && event.target.id === 'logout-btn') {
      event.preventDefault();
      localStorage.removeItem('supabase.user');
      localStorage.removeItem('supabase.session');
      alert('Você saiu da sua conta.');
      window.location.reload();
    }
  });

  // Executa a verificação de login assim que a página carrega
  checarEstadoLogin();


  // --- PARTE 2: FUNCIONALIDADES DA PÁGINA PRINCIPAL (CATÁLOGO) ---

  const gradeObras = document.querySelector('.grade-obras');
  if (gradeObras) { // Este bloco só corre se estivermos na página do catálogo (index.html)
      const API_URL = 'http://localhost:3000/api/obras';
      let todasAsObras = [];

      function exibirObras(listaDeObras) {
          gradeObras.innerHTML = '';
          if (listaDeObras.length === 0) {
              gradeObras.innerHTML = '<p>Nenhuma obra encontrada.</p>';
              return;
          }
          listaDeObras.forEach(obra => {
              const cardHTML = `
                <a href="${obra.detalhes_url}" class="obra-card" target="_blank">
                    <div class="obra-imagem-container"><img src="${obra.imagem_url}" alt="${obra.titulo}"></div>
                    <div class="obra-info">
                        <h3 class="obra-titulo">${obra.titulo}</h3>
                        <p class="obra-artista">${obra.artista}</p>
                        <p class="obra-preco">R$ ${parseFloat(obra.preco).toFixed(2).replace('.', ',')}</p>
                    </div>
                </a>`;
              gradeObras.innerHTML += cardHTML;
          });
      }

      // Lógica de fetch, filtros e busca para a página principal...
      // (Este é o código que já tínhamos e que estava a funcionar)
      fetch(API_URL)
          .then(response => response.json())
          .then(data => {
              todasAsObras = data;
              exibirObras(todasAsObras);

              // Ativar filtros
              const linksFiltro = document.querySelectorAll('.menu-lateral a[data-filtro]');
              linksFiltro.forEach(link => {
                  link.addEventListener('click', function(e) {
                      e.preventDefault();
                      // ... (código do filtro)
                  });
              });

              // Ativar busca
              const formBusca = document.querySelector('.busca-lateral');
              if (formBusca) {
                  formBusca.addEventListener('submit', function(e) {
                      e.preventDefault();
                      // ... (código da busca)
                  });
              }
          })
          .catch(error => {
              console.error('Erro ao buscar obras:', error);
              gradeObras.innerHTML = '<p>Não foi possível carregar as obras.</p>';
          });
  }


  // --- PARTE 3: FUNCIONALIDADES DA PÁGINA DE ARTISTAS ---
  
  const artistasGrid = document.querySelector('.artistas-grid');
  if (artistasGrid) { // Este bloco só corre se estivermos na página de artistas
      // ... (código para buscar e exibir os artistas)
  }


  // --- PARTE 4: FUNCIONALIDADE DO BOTÃO COMPRAR (PÁGINA DE DETALHES) ---
  
  const btnComprar = document.querySelector('#btn-comprar-detalhe');
  if (btnComprar) { // Este bloco só corre se estivermos numa página de detalhe
      const detalheContainer = document.querySelector('.detalhe-container');
      const obraId = detalheContainer.dataset.obraId;

      btnComprar.addEventListener('click', async function() {
          const sessionData = localStorage.getItem('supabase.session');
          if (!sessionData) {
              alert('Por favor, faça login para adicionar obras ao carrinho.');
              window.location.href = 'login.html';
              return;
          }

          const session = JSON.parse(sessionData);
          const token = session.access_token;

          try {
              const response = await fetch('http://localhost:3000/api/cart/add', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`
                  },
                  body: JSON.stringify({ obra_id: obraId })
              });
              const result = await response.json();
              if (response.ok) {
                  alert('Obra adicionada ao carrinho com sucesso!');
              } else {
                  throw new Error(result.error);
              }
          } catch (error) {
              console.error('Erro ao adicionar ao carrinho:', error);
              alert('Erro: ' + error.message);
          }
      });
  }

  // --- PARTE 5: FORMULÁRIOS DE LOGIN E CADASTRO ---
  
  const formLogin = document.querySelector('#form-login');
  if (formLogin) {
      // ... (código do formulário de login)
  }

  const formCadastro = document.querySelector('#form-cadastro');
  if (formCadastro) {
      // ... (código do formulário de cadastro)
  }

});