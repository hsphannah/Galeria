document.addEventListener('DOMContentLoaded', function() {
  
  // --- LÓGICA DINÂMICA DO CATÁLOGO E API ---

  // URL base da nossa API
  const API_BASE_URL = 'http://localhost:3000/api/obras';

  // Referências aos elementos da página
  const gradeObras = document.querySelector('.grade-obras');
  const linksFiltro = document.querySelectorAll('.menu-lateral a');

  // Função que desenha os cards na tela (não muda)
  function exibirObras(listaDeObras) {
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
                <p class="obra-preco">R$ ${obra.preco.toFixed(2).replace('.', ',')}</p>
            </div>
        </a>
      `;
      gradeObras.innerHTML += cardHTML;
    });
  }

  // NOVA FUNÇÃO REUTILIZÁVEL para buscar e exibir os dados
  function buscarEExibirObras(url) {
    gradeObras.innerHTML = '<p>Carregando obras...</p>'; // Mensagem de carregando

    fetch(url)
      .then(response => response.json())
      .then(data => {
        exibirObras(data); // Usa nossa função para desenhar as obras recebidas
      })
      .catch(error => {
        console.error('Erro ao buscar dados da API:', error);
        gradeObras.innerHTML = '<p>Não foi possível carregar as obras. Tente novamente mais tarde.</p>';
      });
  }

  // --- EVENTOS E EXECUÇÃO ---

  // 1. Ao carregar a página, busca e exibe TODAS as obras
  buscarEExibirObras(API_BASE_URL);

  // 2. Adiciona o evento de clique para CADA link de filtro
  linksFiltro.forEach(link => {
    link.addEventListener('click', function(event) {
      event.preventDefault(); // Impede que a página recarregue

      const filtro = this.dataset.filtro;
      const valor = this.dataset.valor;
      
      let novaUrl;

      // Monta a URL correta com base no filtro clicado
      if (filtro === 'todos') {
        novaUrl = API_BASE_URL;
      } else {
        // Usamos encodeURIComponent para tratar espaços e caracteres especiais com segurança
        novaUrl = `${API_BASE_URL}?${filtro}=${encodeURIComponent(valor)}`;
      }
      
      // Chama a função para buscar os dados da nova URL filtrada
      buscarEExibirObras(novaUrl);
    });
  });
  // --- LÓGICA DA BARRA DE BUSCA LATERAL ---

// 1. Selecionar o formulário de busca e o campo de input
const formBusca = document.querySelector('.busca-lateral');
const inputBusca = document.querySelector('.busca-lateral input[type="search"]');

// 2. Adicionar um "ouvinte" para o evento de 'submit' do formulário
//    'submit' funciona tanto com o clique no botão quanto com a tecla "Enter"
if (formBusca && inputBusca) {
  formBusca.addEventListener('submit', function(event) {
    // Impede o comportamento padrão do formulário (que é recarregar a página)
    event.preventDefault();

    // 3. Pega o termo digitado, remove espaços em branco e converte para minúsculas
    //    Isso torna a busca não sensível a maiúsculas/minúsculas
    const termoBusca = inputBusca.value.trim().toLowerCase();

    // 4. Filtra a lista 'todasAsObras' (que já temos em memória vinda da API)
    const resultadosBusca = todasAsObras.filter(obra => {
      const titulo = obra.titulo.toLowerCase();
      const artista = obra.artista.toLowerCase();

      // Retorna verdadeiro se o título OU o artista incluírem o termo buscado
      return titulo.includes(termoBusca) || artista.includes(termoBusca);
    });

    // 5. Usa nossa função existente para exibir os resultados na tela
    exibirObras(resultadosBusca);
  });
}
});