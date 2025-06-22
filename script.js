document.addEventListener('DOMContentLoaded', function() {
  
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

        // **AGORA SIM, ativamos os eventos que dependem dos dados**

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
                <a href="#" class="btn-ver-obras">Ver Obras</a>
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
});