// --- LÓGICA PARA EXIBIR OBRAS DO CATÁLOGO ---

// 1. Encontrar o lugar na página onde vamos inserir os cards
const gradeObras = document.querySelector('.grade-obras');

// 2. Criar uma função que desenha os cards na tela
function exibirObras(listaDeObras) {
  // Limpa a grade antes de adicionar novos itens
  gradeObras.innerHTML = '';

  // 3. Para cada obra na lista, criar o HTML do card
  listaDeObras.forEach(obra => {
    const cardHTML = `
      <a href="${obra.detalhes_url}" class="obra-card">
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
    
    // 4. Inserir o HTML do card recém-criado dentro da grade
    gradeObras.innerHTML += cardHTML;
  });
}

// 5. Chamar a função pela primeira vez para exibir TODAS as obras
// A variável 'obrasDeArte' vem do nosso arquivo 'dados.js'
exibirObras(obrasDeArte);
// --- LÓGICA DOS FILTROS DO MENU LATERAL ---

// 1. Encontrar todos os links de filtro na página
const linksFiltro = document.querySelectorAll('.menu-lateral a');

// 2. Adicionar um "ouvinte" de clique para cada um dos links
linksFiltro.forEach(link => {
  link.addEventListener('click', function(event) {
    // Impede que o link recarregue a página
    event.preventDefault(); 

    // 3. Pegar as informações do filtro do link que foi clicado
    const filtro = this.dataset.filtro;   // ex: 'categoria'
    const valor = this.dataset.valor;     // ex: 'escultura'

    let obrasFiltradas;

    // 4. Filtrar a lista de obras
    if (filtro === 'todos') {
      // Se o filtro for 'todos', usamos a lista completa original
      obrasFiltradas = obrasDeArte;
    } else {
      // Senão, filtramos a lista com base no filtro e valor
      obrasFiltradas = obrasDeArte.filter(obra => obra[filtro] === valor);
    }

    // 5. Chamar nossa função já existente para exibir a nova lista filtrada
    exibirObras(obrasFiltradas);
  });
});