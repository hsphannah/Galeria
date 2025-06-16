// Aguarda o carregamento do DOM (boa prática)
document.addEventListener('DOMContentLoaded', function() {
  
  // --- LÓGICA DO MENU HAMBÚRGUER (se você o adicionou neste projeto) ---
  // (Pode colar o código do seu menu hambúrguer aqui se ele estava neste arquivo)


  // --- LÓGICA DINÂMICA DO CATÁLOGO ---

  // A URL da nossa nova API que está rodando localmente
  const API_URL = 'http://localhost:3000/api/obras';

  // Referência à grade de obras no HTML
  const gradeObras = document.querySelector('.grade-obras');
  // Referência a todos os links de filtro
  const linksFiltro = document.querySelectorAll('.menu-lateral a');

  // Variável para guardar todas as obras que vêm da API
  let todasAsObras = [];

  // Função que desenha os cards na tela (a mesma que já tínhamos)
  function exibirObras(listaDeObras) {
    gradeObras.innerHTML = ''; // Limpa a grade antes de adicionar
    listaDeObras.forEach(obra => {
      const cardHTML = `
        <a href="${obra.detalhes_url}" class="obra-card" target="_blank">
            <div class="obra-imagem-container">
                <img src="${obra.imagem_url}" alt="${obra.titulo}">
            </div>
            <div class="obra-info">
                <h3 class="obra-titulo">${obra.titulo}</h3>
                <p class="obra-artista">${obra.artista}</p>
                <p class="obra-preco">R$ ${obra.preco.toFixed(2).replace('.', ',')}</p>
            </div>
        </a>
      `;
      gradeObras.innerHTML += cardHTML;
    });
  }

  // Função para filtrar as obras
  function filtrarObras(filtro, valor) {
    let obrasFiltradas;
    if (filtro === 'todos') {
      obrasFiltradas = todasAsObras;
    } else {
      obrasFiltradas = todasAsObras.filter(obra => obra[filtro] === valor);
    }
    exibirObras(obrasFiltradas);
  }

  // --- A MÁGICA DA CONEXÃO: FETCH API ---

  // 1. Usamos o 'fetch' para buscar os dados na nossa API
  fetch(API_URL)
    .then(response => response.json()) // 2. Converte a resposta para o formato JSON
    .then(data => {
      // 3. 'data' agora é a nossa lista de obras vinda do servidor!
      todasAsObras = data; // Guardamos os dados na nossa variável
      exibirObras(todasAsObras); // Exibimos todas as obras na tela pela primeira vez
      
      // 4. Agora que temos os dados, ativamos os filtros
      linksFiltro.forEach(link => {
        link.addEventListener('click', function(event) {
          event.preventDefault();
          const filtro = this.dataset.filtro;
          const valor = this.dataset.valor;
          filtrarObras(filtro, valor);
        });
      });
    })
    .catch(error => {
      console.error('Erro ao buscar dados da API:', error);
      gradeObras.innerHTML = '<p>Não foi possível carregar as obras. Tente novamente mais tarde.</p>';
    });
});