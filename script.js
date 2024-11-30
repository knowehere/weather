const apiKey = '415d23a1a85e9a21e9daf60d97fc4e89';

document.getElementById('getWeather').addEventListener('click', async () => {
    const latitude = document.getElementById('latitude').value;
    const longitude = document.getElementById('longitude').value;

    if (!isValidCoordinates(latitude, longitude)) {
        alert('Введите корректные координаты');
        return;
    }

    try {
        const weatherData = await fetchWeather(latitude, longitude);
        displayWeather(weatherData, latitude, longitude);
    } catch (error) {
        console.error('Ошибка получения погоды:', error);
        alert('Не удалось получить данные о погоде');
    }
});

function isValidCoordinates(lat, lon) {
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);
    return !isNaN(latNum) && !isNaN(lonNum) && latNum >= -90 && latNum <= 90 && lonNum >= -180 && lonNum <= 180;
}

async function fetchWeather(lat, lon) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=ru`);
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
}

function displayWeather(data, lat, lon) {
    const weatherWidgets = document.getElementById('weatherWidgets');
    const widget = createWeatherWidget(data, lat, lon);
    weatherWidgets.appendChild(widget);
    initializeMap(lat, lon, `map${weatherWidgets.children.length - 1}`);
}

function createWeatherWidget(data, lat, lon) {
    const widget = document.createElement('div');
    widget.classList.add('widget');
    const weatherDescription = data.weather[0].description;
    const temperature = data.main.temp;
    const windSpeed = data.wind.speed;
    const localTime = getLocalTime(data.dt, data.timezone);
    const clouds = data.clouds.all;
    const humidity = data.main.humidity;

    widget.innerHTML = `
        <div>
            <p>Температура: ${temperature}°</p>
            <p>Описание: ${weatherDescription}</p>
            <p>Скорость ветра: ${windSpeed} м/с</p>
            <p>Местное время: ${localTime}</p>
            <p>Облачность: ${clouds}%</p>
            <p>Влажность: ${humidity}%</p>
            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" width="110px" alt="${weatherDescription}">
        </div>
        <div id="map${document.getElementById('weatherWidgets').children.length}" style="height: 300px;"></div>
    `;
    return widget;
}

function initializeMap(lat, lon, mapId) {
    const map = L.map(mapId).setView([lat, lon], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    L.marker([lat, lon]).addTo(map).openPopup();
}


function getLocalTime(timestamp, timezoneOffset) {
    const date = new Date((timestamp + timezoneOffset) * 1000);
    return date.toLocaleString();
}
