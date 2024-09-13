// Function to fetch country data
async function fetchCountryData() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching country data:', error);
        return []; // Return an empty array in case of error
    }
}

// Function to fetch weather data
async function fetchWeatherData(lat, lon) {
    const apiKey = '880c87d2809e3ae07cb121152b2de075'; // Replace with your OpenWeatherMap API key
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return {
            description: data.weather?.[0]?.description || 'N/A',
            temp: data.main?.temp || 'N/A'
        };
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return {
            description: 'N/A',
            temp: 'N/A'
        };
    }
}

// Function to create cards for each country
async function createCountryCards() {
    const countries = await fetchCountryData();
    const countryCardsContainer = document.getElementById('countryCards');

    if (!countryCardsContainer) {
        console.error('Country cards container not found');
        return;
    }

    countries.forEach(async country => {
        const capital = (country.capital && country.capital[0]) || 'N/A';
        const latlng = country.latlng || ['N/A', 'N/A'];
        const flag = country.flags?.png || 'https://via.placeholder.com/150x100';
        const region = country.region || 'N/A';
        const name = country.name?.common || 'N/A';
        const countryCode = country.cca2 || 'N/A';

        // Create card HTML
        const card = `
            <div class="col-lg-4 col-sm-12 mb-4">
                <div class="card">
                    <div class="flag-container">
                        <img src="${flag}" class="flag-img" alt="${name} flag">
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${name}</h5>
                        <p class="card-text">Capital: ${capital}</p>
                        <p class="card-text">Lat/Lng: ${latlng.join(', ')}</p>
                        <p class="card-text">Region: ${region}</p>
                        <p class="card-text">Country Code: ${countryCode}</p>
                        <div class="weather-info" id="weather-${countryCode}">
                            <button class="btn btn-primary" onclick="checkWeather('${countryCode}', ${latlng[0]}, ${latlng[1]})">Check Weather</button>
                            <p id="weather-details-${countryCode}" class="mt-3">Weather: N/A</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Append card to container
        countryCardsContainer.innerHTML += card;
    });
}

// Function to update weather information when the button is clicked
async function checkWeather(countryCode, lat, lon) {
    const weatherElement = document.getElementById(`weather-details-${countryCode}`);
    if (weatherElement) {
        const weather = await fetchWeatherData(lat, lon);
        weatherElement.innerHTML = `Weather: ${weather.description} | Temperature: ${weather.temp} °C`;
    } else {
        console.error('Weather element not found');
    }
}

// Call the function to create country cards when the page loads
window.onload = createCountryCards;
