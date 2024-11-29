// Definindo as variáveis
const API_KEY = '78f71ba151dd160faef4de8ca7196a41'; // Substitua com sua chave da API
const BASE_URL = 'https://api.themoviedb.org/3';

// Função para buscar séries pela pesquisa
async function buscarSeries(query) {
    // Formatação da URL da pesquisa
    const url = `${BASE_URL}/search/tv?api_key=${API_KEY}&language=pt-BR&query=${query}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.results.length > 0) {
            exibirResultados(data.results);
        } else {
            document.getElementById('itens-da-pesquisa').innerHTML = '<p>Nenhum resultado encontrado.</p>';
        }
    } catch (error) {
        console.error('Erro ao buscar séries:', error);
    }
}

// Função para exibir os resultados no HTML
function exibirResultados(series) {
    const container = document.getElementById('itens-da-pesquisa');
    container.innerHTML = ''; // Limpa os resultados antigos

    series.forEach(serie => {
        const cardHTML = `
            <div class="col-md-3">
                <div class="card bg-secondary">
                    <a href="serie.html?id=${serie.id}">
                        <img src="https://image.tmdb.org/t/p/w500${serie.poster_path}" class="card-img-top" alt="${serie.name}">
                    </a>
                    <div class="card-body">
                        <h5 class="card-title">${serie.name}</h5>
                        <p class="card-text">Plataforma: ${serie.origin_country.join(', ')}</p>
                        <p class="card-text">Ano: ${serie.first_air_date.slice(0, 4)}</p>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += cardHTML;
    });
}

// Função para buscar séries populares ou bem avaliadas
async function buscarSériesPopulares() {
    // Formatação da URL para séries populares ou bem avaliadas
    const url = `${BASE_URL}/discover/tv?api_key=${API_KEY}&language=pt-BR&sort_by=popularity.desc`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.results.length > 0) {
            exibirResultados(data.results);
        } else {
            document.getElementById('itens-da-pesquisa').innerHTML = '<p>Nenhum resultado encontrado.</p>';
        }
    } catch (error) {
        console.error('Erro ao buscar séries populares:', error);
    }
}

// Captura o formulário de pesquisa e executa a busca ao submeter
document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário

    const query = document.querySelector('input[type="search"]').value;
    if (query) {
        buscarSeries(query);
    }
});

// Chama a função ao carregar a página para mostrar séries populares (pra não fica tudo vazio)
document.addEventListener('DOMContentLoaded', buscarSériesPopulares);