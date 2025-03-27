const API_KEY = 'f87bca82a27a75fbbd5ab67d9c72cdbe';
const MAX_HISTORY_ITEMS = 5;

const cityInput = document.getElementById('cityInput');
const searchButton = document.getElementById('searchButton');
const weatherInfo = document.getElementById('weatherInfo');
const forecastInfo = document.getElementById('forecastInfo');
const searchHistoryContainer = document.getElementById('searchHistory');

let isCelsius = true;

searchButton.addEventListener('click', buscarClima);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        buscarClima();
    }
});

document.addEventListener('DOMContentLoaded', carregarHistorico);

function celsiusToFahrenheit(celsius) {
    return ((celsius * 9/5) + 32).toFixed(1);
}

async function buscarClima() {
    const cidade = cityInput.value.trim();

    if (!cidade) {
        alert('Por favor, digite o nome de uma cidade');
        return;
    }

    try {
        const respostaAtual = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${API_KEY}&lang=pt_br&units=metric`);
        
        if (!respostaAtual.ok) {
            throw new Error('Cidade não encontrada');
        }

        const dadosAtual = await respostaAtual.json();

        const respostaPrevisao = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cidade}&appid=${API_KEY}&lang=pt_br&units=metric`);
        const dadosPrevisao = await respostaPrevisao.json();

        salvarHistorico(dadosAtual, dadosPrevisao);
        renderizarClima(dadosAtual, dadosPrevisao);

    } catch (erro) {
        weatherInfo.innerHTML = `
            <p class="text-red-400 text-center">${erro.message}</p>
        `;
        forecastInfo.innerHTML = '';
    }
}

function renderizarClima(dadosAtual, dadosPrevisao) {
    const temperatura = isCelsius 
        ? dadosAtual.main.temp.toFixed(1) 
        : celsiusToFahrenheit(dadosAtual.main.temp);
    const descricao = dadosAtual.weather[0].description;
    const icone = dadosAtual.weather[0].icon;
    const umidade = dadosAtual.main.humidity;
    const velocidadeVento = dadosAtual.wind.speed.toFixed(1);
    const sensacaoTermica = isCelsius 
        ? dadosAtual.main.feels_like.toFixed(1) 
        : celsiusToFahrenheit(dadosAtual.main.feels_like);
    const pressao = dadosAtual.main.pressure;
    const tempMinima = isCelsius 
        ? dadosAtual.main.temp_min.toFixed(1) 
        : celsiusToFahrenheit(dadosAtual.main.temp_min);
    const tempMaxima = isCelsius 
        ? dadosAtual.main.temp_max.toFixed(1) 
        : celsiusToFahrenheit(dadosAtual.main.temp_max);

    weatherInfo.innerHTML = `
        <div class="text-center">
            <img 
                src="https://openweathermap.org/img/wn/${icone}@4x.png" 
                alt="Ícone do clima" 
                class="mx-auto w-40 h-40 filter drop-shadow-lg"
            >
            <h2 class="text-3xl font-bold text-cyan-400">${dadosAtual.name}, ${dadosAtual.sys.country}</h2>
            <p 
                id="temperatureDisplay" 
                class="text-5xl font-bold text-white mt-2 cursor-pointer hover:text-gray-400 transition-all"
            >
                ${temperatura}°${isCelsius ? 'C' : 'F'}
            </p>
            <p class="text-xl text-gray-300 capitalize">${descricao}</p>
        </div>

        <div class="grid grid-cols-2 gap-4 mt-6 text-center">
            <div class="bg-gray-700 rounded-xl p-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mx-auto text-cyan-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m3.343-5.657l-.707-.707m12.728 12.728l.707.707" />
                </svg>
                <p class="text-gray-300">Sensação: ${sensacaoTermica}°${isCelsius ? 'C' : 'F'}</p>
            </div>
            <div class="bg-gray-700 rounded-xl p-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mx-auto text-cyan-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9a4 4 0 00-4-4h-1.172a2 2 0 01-1.414-.586l-.828-.828A2 2 0 0010.172 3H7a4 4 0 00-4 4v4a4 4 0 004 4h6z" />
                </svg>
                <p class="text-gray-300">Umidade: ${umidade}%</p>
            </div>
            <div class="bg-gray-700 rounded-xl p-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mx-auto text-cyan-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 01-4.553-4.553l-.477-2.387a2 2 0 00-.547-1.022L6 5m8 8l-3.236-3.236a2 2 0 00-2.606-.02L2.837 9.837a1 1 0 00-.186 1.208 9.967 9.967 0 005.314 5.314c.511.223 1.09.09 1.447-.336L10 12" />
                </svg>
                <p class="text-gray-300">Vento: ${velocidadeVento} m/s</p>
            </div>
            <div class="bg-gray-700 rounded-xl p-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mx-auto text-cyan-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                <p class="text-gray-300">Pressão: ${pressao} hPa</p>
            </div>
        </div>
    `;

    const previsoesFiltradas = dadosPrevisao.list.filter((previsao, index) => 
        index % 8 === 0
    );

    const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    forecastInfo.innerHTML = previsoesFiltradas.slice(0, 3).map((previsao) => {
        const data = new Date(previsao.dt * 1000);
        const diaSemana = diasSemana[data.getDay()];
        const tempMedia = isCelsius 
            ? previsao.main.temp.toFixed(1) 
            : celsiusToFahrenheit(previsao.main.temp);
        const iconePrevisao = previsao.weather[0].icon;

        return `
            <div class="bg-gray-700 rounded-xl p-4 text-center hover:bg-gray-600 transition">
                <p class="text-cyan-400 font-bold">${diaSemana}</p>
                <img 
                    src="https://openweathermap.org/img/wn/${iconePrevisao}@2x.png" 
                    alt="Ícone do clima" 
                    class="mx-auto w-20 h-20 filter drop-shadow-md"
                >
                <p class="text-white text-lg">${tempMedia}°${isCelsius ? 'C' : 'F'}</p>
            </div>
        `;
    }).join('');

    // Add click event listener to toggle temperature
    document.getElementById('temperatureDisplay').addEventListener('click', () => {
        isCelsius = !isCelsius;
        renderizarClima(dadosAtual, dadosPrevisao);
    });
}

function salvarHistorico(dadosAtual, dadosPrevisao) {
    let historico = JSON.parse(localStorage.getItem('weatherHistory')) || [];
    const cidade = dadosAtual.name;
    const pais = dadosAtual.sys.country;
    const cidadeExistente = historico.find(item => item.nome === cidade);
    
    if (!cidadeExistente) {
        const dadosHistorico = {
            nome: cidade,
            pais: pais,
            dadosAtual: dadosAtual,
            dadosPrevisao: dadosPrevisao
        };

        historico.unshift(dadosHistorico);

        if (historico.length > MAX_HISTORY_ITEMS) {
            historico = historico.slice(0, MAX_HISTORY_ITEMS);
        }

        localStorage.setItem('weatherHistory', JSON.stringify(historico));
    }

    carregarHistorico();
}

function carregarHistorico() {
    const historico = JSON.parse(localStorage.getItem('weatherHistory')) || [];

    searchHistoryContainer.innerHTML = historico.map((item) => `
        <div 
            class="bg-gray-700 p-4 rounded-xl cursor-pointer hover:bg-gray-600 transition flex justify-between items-center"
            data-cidade="${item.nome}"
        >
            <div>
                <p class="font-bold text-cyan-400">${item.nome}</p>
                <p class="text-gray-400 text-sm">${item.pais}</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
        </div>
    `).join('');

    const historicoItens = searchHistoryContainer.querySelectorAll('div');
    historicoItens.forEach(item => {
        item.addEventListener('click', (event) => {
            const cidade = event.currentTarget.getAttribute('data-cidade');
            const historico = JSON.parse(localStorage.getItem('weatherHistory')) || [];
            const dadosHistorico = historico.find(item => item.nome === cidade);
            
            if (dadosHistorico) {
                renderizarClima(dadosHistorico.dadosAtual, dadosHistorico.dadosPrevisao);
            }
        });
    });
}