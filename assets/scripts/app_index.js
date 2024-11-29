// Definindo as variáveis
const API_KEY = '78f71ba151dd160faef4de8ca7196a41'; // Substitua com sua chave da API
const BASE_URL = 'https://api.themoviedb.org/3';

var serieFavoritas = [94605,1668,236994,65334, 65334];

// Função para buscar séries populares e exibir no carrossel
async function fetchSeriesPopulares() {
    try {
        // Buscar Séries Populares
        const popularResponse = await fetch(`${BASE_URL}/trending/tv/week?api_key=${API_KEY}&language=pt-BR`);
        const popularData = await popularResponse.json();

        // Preencher o carrossel de séries populares
        const popularSeriesContainer = document.getElementById('seriesPopularesCarousel');
        popularData.results.slice(0, 3).forEach((series, index) => {
            const seriesItem = document.createElement('div');
            seriesItem.classList.add('carousel-item');
            
            // Marca a primeira como ativa
            if (index === 0) {
                seriesItem.classList.add('active');
            }

            seriesItem.innerHTML = `
                <a href="serie.html?id=${series.id}">
                    <img src="https://image.tmdb.org/t/p/w500${series.backdrop_path}" class="d-block w-100" alt="${series.name}">
                    <div class="carousel-caption d-none d-md-block">
                        <h5>${series.name}</h5>
                        <p>${series.overview}</p>
                    </div>
                </a>
            `;
            popularSeriesContainer.appendChild(seriesItem);
        });
    } catch (error) {
        console.error('Erro ao buscar séries:', error);
    }
}

async function fetchNovasSeries() {
    try {
        // Buscar Séries !
        // Obtém o mês atual e o primeiro dia
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth() - 3 , 1).toISOString().split('T')[0]; // Primeiro dia do mês
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]; // Último dia do mês

        // Consulta para séries lançadas nos ultimos 3 meses
        const Response = await fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&language=pt-BR&sort_by=popularity.desc&first_air_date.gte=${firstDayOfMonth}`);
        const Data = await Response.json();

        // Preencher com 4 séries 
        const novasSeriesContainer = document.getElementById('novasSeries');
        Data.results.slice(0, 4).forEach((series, index) => {
            const seriesItem = document.createElement('div');
            seriesItem.classList.add('col-md-3');
            
            seriesItem.innerHTML = `
                <a href="serie.html?id=${series.id}">
                    <div class="card">
                        <img src="https://image.tmdb.org/t/p/w500${series.backdrop_path}" class="card-img-top" alt="${series.name}">
                        <div class="card-body">
                            <p class="card-text"> <strong>${series.name}</strong></p>
                            <p class="card-text"> Lançamento: ${series.first_air_date}</p>

                            </div>
                    </div>
                </a>
            
            `;


            //console.log(series);
            novasSeriesContainer.appendChild(seriesItem);
        });
    } catch (error) {
        console.error('Erro ao buscar séries:', error);
    }
}

// Função para obter os favoritos do localStorage
const obterFavoritos = () => {
    return JSON.parse(localStorage.getItem('favoritos')) || [];
};


// Função para buscar os detalhes das séries favoritas
async function fetchFavoritos() {
    const favoritos = obterFavoritos();

    console.log(favoritos);

    const container = document.getElementById('favoritos');

    if (favoritos.length == 0) {
        document.querySelector('favoritos').innerHTML = '<p>Você ainda não tem séries favoritas.</p>';
        return;
    }

    container.innerHTML = ''; // Limpa o conteúdo inicial

    

    // Itera sobre os IDs de séries favoritas e busca os detalhes
    for (const id of favoritos) {
        try {
            const response = await fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=pt-BR`);
            const serie = await response.json();

            // Adiciona o cartão da série ao container
            container.innerHTML += `
                <div class="col-md-3">              
                    <a href="serie.html?id=${serie.id}">
                        <div class="card">
                            <img src="https://image.tmdb.org/t/p/w500${serie.backdrop_path}" class="card-img-top" alt="${serie.name}">
                            <div class="card-body">
                                <h5 class="card-title">${serie.name}</h5>
                                <p class="card-text">Lançamento: ${serie.first_air_date}</p>
                            </div>
                        </div>
                    </a>
                </div>
            `;
        } catch (error) {
            console.error(`Erro ao buscar série com ID ${id}:`, error);
        }
    }
}

// Carregar os favoritos ao iniciar a página
document.addEventListener('DOMContentLoaded', fetchFavoritos);
document.addEventListener('DOMContentLoaded', fetchSeriesPopulares);
document.addEventListener('DOMContentLoaded', fetchNovasSeries);


// Chama a função para carregar as séries assim que a página carregar
//document.addEventListener('DOMContentLoaded', fetchSeries);

//fetchSeriesPopulares();
//fetchNovasSeries();
