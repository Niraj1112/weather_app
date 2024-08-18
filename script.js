function getWeather() {
    const apiKey = 'b4df77539d7a4c7a8d4125102241808'; // Replace with your actual API key
    const city = document.getElementById('city').value;

    if (!city) {
        alert('Please enter a city');
        return;
    }

    // Construct URLs for WeatherAPI
    const currentWeatherUrl = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
    const forecastUrl = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=1`;

    // Fetch current weather
    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            console.log('Current weather data:', data); // Log the response data
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert('Error fetching current weather data. Please try again.');
        });

    // Fetch hourly forecast
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            console.log('Forecast data:', data); // Log the response data
            displayHourlyForecast(data.forecast.forecastday[0].hour);
        })
        .catch(error => {
            console.error('Error fetching hourly forecast data:', error);
            alert('Error fetching hourly forecast data. Please try again.');
        });
}

function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    // Clear previous content
    weatherInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    if (data.error) {
        weatherInfoDiv.innerHTML = `<p>${data.error.message}</p>`;
    } else {
        const cityName = data.location.name;
        const temperature = Math.round(data.current.temp_c); // Temperature in Celsius
        const description = data.current.condition.text;
        const iconCode = data.current.condition.icon;
        const iconUrl = `http:${iconCode}`;

        const temperatureHTML = `
            <p>${temperature}°C</p>
        `;

        const weatherHtml = `
            <p>${cityName}</p>
            <p>${description}</p>
        `;

        tempDivInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHtml;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;

        showImage();
    }
}

function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    const next24Hours = hourlyData.slice(0, 8); // Display the next 24 hours (1-hour intervals)

    hourlyForecastDiv.innerHTML = ''; // Clear previous content

    next24Hours.forEach(item => {
        const hour = new Date(item.time_epoch * 1000).getHours(); // Convert timestamp to milliseconds
        const temperature = Math.round(item.temp_c); // Temperature in Celsius
        const iconCode = item.condition.icon;
        const iconUrl = `http:${iconCode}`;

        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°C</span>
            </div>
        `;

        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}

function showImage() {
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block'; // Make the image visible once it's loaded
}
