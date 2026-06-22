const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const loadingMessage = document.getElementById('loadingMessage');
const errorMessage = document.getElementById('errorMessage');

let isCelsius = true; // Default to Celsius
let savedTemp = 0;

//Fetch coordinates for the city name
async function getCoordinates (city) {
   const url = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.results) {
        throw new Error('City not found');
    }
// Return the first result
    return data.results[0]; 
}

//Fetch weather data for the coordinates
async function getWeather(lat, lon) {
    const url =
`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,uv_index&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`;

const response = await fetch(url);
return await response.json();
}

//Convert WMO weather code into description and emojis
function getWeatherDescription(code) {
    const weatherMap = {
        0: ["Clear sky", "☀️"],
        1: ["Partly cloudy", "⛅"],
        2: ["Partly cloudy", "⛅"],
        3: ["Partly cloudy", "⛅"],
        45: ["Foggy", "🌫️"],
        48: ["Foggy", "🌫️"],
        51: ["Drizzle", "🌦️"],
        53: ["Drizzle", "🌦️"],
        55: ["Drizzle", "🌦️"],
        61: ["Rain", "🌧️"],
        63: ["Rain", "🌧️"],
        65: ["Rain", "🌧️"],
        71: ["Snow", "❄️"],
        73: ["Snow", "❄️"],
        75: ["Snow", "❄️"],
        80: ["Rain showers", "🌦️"],
        81: ["Rain showers", "🌦️"],
        82: ["Rain showers", "🌦️"],
        95: ["Thunderstorm", "⛈️"],
        96: ["Sunny", "☀️"],
    };

    return weatherMap[code] || ["Unknown", "❔"];
}

//Display current weather in hero section
function displayCurrentWeather(data, city, country) {
    const [description, icon] = getWeatherDescription(data.current.weather_code);

    savedTemp = data.current.temperature_2m; 

    document.getElementById("weatherIcon").textContent = icon;
    document.getElementById("description").textContent = description;
    document.getElementById("temperature").textContent = `${savedTemp}°C`;
    document.getElementById("cityName").textContent = `${city}, ${country}`;
    document.getElementById("humidity").innerHTML = `

  <div class="value">${data.current.relative_humidity_2m}%</div>
`;
   document.getElementById("windSpeed").innerHTML = `
  <div class="value">${data.current.wind_speed_10m} km/h</div>
`;
    document.getElementById("uvIndex").innerHTML = `
  <div class="value">${getUVLevel(data.current.uv_index)}</div>
`;
    
}
    
//Fetch 5-day current forecast dynamically
function displayForecast(daily) {
  if (!daily || !daily.time) {
    showError("Forecast data unavailable");
    return;
  }

  const forecastContainer = document.getElementById("forecastContainer");
  forecastContainer.innerHTML = "";

  for (let i = 0; i < 5; i++) {
    const date = new Date(daily.time[i]);
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

    const [description, icon] = getWeatherDescription(daily.weather_code[i]);

    forecastContainer.innerHTML += `
        <div class="grid-day">${dayName}</div>
        <div class="grid-icon">${icon}</div>
        <div class="grid-temp">${daily.temperature_2m_max[i]}° <br>${daily.temperature_2m_min[i]}°</div>
    `;
  }
}

//Show error message on the page to the user 
function showError(message) {
    errorMessage.textContent = message;
}

//Save search history in localStorage
function saveSearch(city) {
    let history = JSON.parse(localStorage.getItem('weatherHistory')) || [];

    history.unshift(city);

    // Keep only the last 5 unique searches
    history = [...new Set(history)].slice(0, 5); 
    localStorage.setItem('weatherHistory', JSON.stringify(history));
    displaySearchHistory();
}

//Display search histrory buttons
function displaySearchHistory() {
    const container = document.getElementById('historyContainer');
    const history = JSON.parse(localStorage.getItem('weatherHistory')) || [];

    container.innerHTML = '';

    history.forEach(city => {
        const btn = document.createElement('button');
        btn.textContent = city;
        btn.classList.add("history-btn");

        btn.onclick = () => {
            cityInput.value = city;
            handleSearch();
        };
        
        container.appendChild(btn);
    });
}     

//UV Index return label
function getUVLevel(uv) {
  if (uv <= 2) return "Low";
  if (uv <= 5) return "Moderate";
  if (uv <= 7) return "High";
  return "Very High";
}


//Main search function triggered by the search button
async function handleSearch() {
  const city = cityInput.value.trim();
  if (!city) return;

  try {
    loadingMessage.textContent = "Loading...";
    errorMessage.textContent = "";

    const location = await getCoordinates(city);

    const weather = await getWeather(
      location.latitude,
      location.longitude
    );

    displayCurrentWeather(
      weather,
      location.name,
      location.country
    );

    displayForecast(weather.daily);

    saveSearch(location.name);

    loadingMessage.textContent = "";
  } catch (error) {
    loadingMessage.textContent = "";
    showError(error.message);
  }
}

    //Toggle between Celsius and Fahrenheit
    const unitToggle = document.getElementById("unitToggle");

    if (unitToggle) {
    unitToggle.addEventListener("click", () => {
        const tempElement = document.getElementById("temperature");

        if (isCelsius) {
            const fahrenheit = (savedTemp * 9/5) + 32;
            tempElement.textContent = `${fahrenheit.toFixed(1)}°F`;
            document.getElementById("unitToggle").textContent = "Switch to °C";
            isCelsius = false;
        } else {
            tempElement.textContent = `${savedTemp}°C`;
            document.getElementById("unitToggle").textContent = "Switch to °F";
        }

        isCelsius = !isCelsius;
    });
}

    searchBtn.addEventListener('click', handleSearch);

    //Load local weather using browser geolocation
    window.onload = () => {
    displaySearchHistory();

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const weather = await getWeather(
                position.coords.latitude, 
                position.coords.longitude
            );

            displayCurrentWeather(weather, "Your Location", "");
            displayForecast(weather.daily);
        });
    }
};

