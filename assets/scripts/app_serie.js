// Configurações da API do TMDB
const API_KEY = '78f71ba151dd160faef4de8ca7196a41'; 
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Elementos do DOM
const seriesTitle = document.querySelector('.series-title');
const platformInfo = document.querySelector('.platform-info');
const description = document.querySelector('.description');
const banner = document.querySelector('.series-banner');
const genresInfo = document.querySelector('.genres-info');
const releaseDate = document.querySelector('.release-date');
const popularity = document.querySelector('.popularity');
const originalLanguage = document.querySelector('.original-language');
const seasonsInfo = document.querySelector('.seasons-info');
const episodesInfo = document.querySelector('.episodes-info');
const elencoContainer = document.querySelector('.elenco-container'); // Container do elenco

var data;

// Função para pegar o ID da série da URL
function getSeriesIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id'); // Retorna o valor do parâmetro "id"
}

// Função para buscar detalhes da série
async function fetchSeriesDetails(seriesId) {
    try {
        const response = await fetch(`${BASE_URL}/tv/${seriesId}?api_key=${API_KEY}&language=pt-BR`);
        
        // Verifica se a requisição foi bem-sucedida
        if (!response.ok) {
            throw new Error('Erro ao buscar os detalhes da série');
        }
        
        const data = await response.json();
        console.log(data);

        // Preencher elementos do DOM / Adicionando mais detalhes:
        seriesTitle.textContent = data.name;
        platformInfo.innerHTML =  data.networks.map(network => network.name).join(', ');
        description.innerHTML = data.overview;
        banner.src = `${IMG_BASE_URL}${data.poster_path}`; 
        genresInfo.textContent = data.genres.map(genre => genre.name).join(', '); // Gêneros
        releaseDate.textContent = data.first_air_date; 
        popularity.textContent = data.popularity.toFixed(2);
        originalLanguage.textContent = data.original_language;
        seasonsInfo.textContent = data.number_of_seasons; 
        episodesInfo.textContent = data.number_of_episodes; 
        

    } catch (error) {
        console.error('Erro:', error);
    }
}

// Função para buscar elenco
async function fetchSeriesElenco(seriesId) {
    try {
        const response = await fetch(`${BASE_URL}/tv/${seriesId}/credits?api_key=${API_KEY}&language=pt-BR`);
        
        // Verifica se a requisição foi bem-sucedida
        if (!response.ok) {
            throw new Error('Erro ao buscar elenco');
        }

        const data = await response.json();
        console.log(data);

        // Limitar o elenco aos primeiros 6 membros
        const topCast = data.cast.slice(0, 6);

        // Limpar elenco anterior (caso haja algum conteúdo carregado previamente)
        elencoContainer.innerHTML = '';

        // Renderizar elenco no DOM
        topCast.forEach(member => {
            const castCard = `
                <div class="col-md-2">
                    <div class="card">
                        <img src="${member.profile_path ? IMG_BASE_URL + member.profile_path : 'default-image.jpg'}" class="card-img-top" alt="${member.name}">
                        <div class="card-body">
                            <h5 class="card-title">${member.name}</h5>
                            <p class="card-text">${member.character}</p>
                        </div>
                    </div>
                </div>
            `;

            elencoContainer.innerHTML += castCard;
        });
    } catch (error) {
        console.error('Erro:', error);
    }
}




// Função para obter os favoritos do localStorage
const obterFavoritos = () => {
    return JSON.parse(localStorage.getItem('favoritos')) || [];
};

// Função para salvar os favoritos no localStorage
const salvarFavoritos = (favoritos) => {
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
};

// Função para adicionar ou remover uma série dos favoritos
const alternarFavorito = (id) => {
    const favoritos = obterFavoritos();
    const indice = favoritos.indexOf(id);

    if (indice === -1) {
        // Adicionar aos favoritos
        favoritos.push(id);
        //alert('Série adicionada aos favoritos!');
    } else {
        // Remover dos favoritos
        favoritos.splice(indice, 1);
        //alert('Série removida dos favoritos!');
    }

    salvarFavoritos(favoritos);
    atualizarBotao(id);
};

// Função para atualizar o texto do botão
const atualizarBotao = (id) => {
    const favoritos = obterFavoritos();
    const botao = document.querySelector('.favoritar-serie');

    if (favoritos.includes(id)) {
        botao.textContent = 'Remover dos Favoritos';
        botao.classList.add('btn-danger'); // Estiliza o botão como vermelho
        botao.classList.remove('btn-primary'); // Remove o estilo azul
    } else {
        botao.textContent = 'Favoritar Série';
        botao.classList.add('btn-primary'); // Estiliza o botão como azul
        botao.classList.remove('btn-danger'); // Remove o estilo vermelho
    }
};


// Pegar o ID da série da URL
const seriesId = getSeriesIdFromURL();

// Inicializar funções com o ID da série obtido
if (seriesId) {
    fetchSeriesDetails(seriesId);
    fetchSeriesElenco(seriesId);
    
    // Adicionar evento ao botão "Favoritar Série"
    document.addEventListener('DOMContentLoaded', function () {
        const serieId = getSeriesIdFromURL();

        if (serieId) {
            atualizarBotao(serieId); // Atualiza o botão com base no estado atual
            const botao = document.querySelector('.favoritar-serie');
            botao.addEventListener('click', function () {
                alternarFavorito(serieId); // Alterna o estado de favorito ao clicar
            });
        } else {
            console.error('ID da série não encontrado na URL!');
        }
    });

} else {
    console.error('ID da série não encontrado na URL');
}



