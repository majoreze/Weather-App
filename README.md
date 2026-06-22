# Weather App – Semester One Project

## Student Information

* **Name:** EZEKIEL AJAYI
* **Student ID:** ALT/SOE/BAR/026/0057
* **Course:** CLOUD ENGINEERING

---

## Project Description

This Weather App is a responsive web application built using HTML, CSS, and JavaScript. It allows users to search for any city worldwide and retrieve real-time weather information using the Open-Meteo API. The application first converts the city name into geographic coordinates using the Open-Meteo Geocoding API and then fetches current weather conditions and a 5-day forecast based on those coordinates. The weather data displayed includes temperature, weather description, humidity, wind speed, and UV index. The forecast section is dynamically generated using JavaScript and styled for clarity and ease of use. Additional features such as geolocation-based weather detection, search history using localStorage, and a Celsius/Fahrenheit unit toggle enhance the overall user experience. The interface is fully responsive and optimized for both desktop and mobile devices.

---

## Features

* Search weather by city name
* Real-time weather data using Open-Meteo API
* Current temperature and weather conditions
* Humidity, wind speed, and UV index display
* 5-day weather forecast
* Automatic location detection using Geolocation API
* Search history (last 5 searches)
* Celsius / Fahrenheit temperature toggle
* Responsive mobile-friendly design
* Error handling for invalid searches
* Loading state during data retrieval

---

## Technologies Used

* HTML (Semantic Structure)
* CSS (Flexbox, Grid, Responsive Design)
* JavaScript (Async/Await, DOM Manipulation)
* Fetch API
* Open-Meteo Geocoding API
* Open-Meteo Forecast API
* LocalStorage API
* Geolocation API

---

## How It Works

1. User enters a city name in the search field.
2. The application retrieves the city's coordinates using the Open-Meteo Geocoding API.
3. The coordinates are used to request weather information from the Open-Meteo Forecast API.
4. Current weather conditions and a 5-day forecast are displayed dynamically on the page.
5. Search history is stored locally for quick access to previously searched cities.
6. On page load, the application can detect the user's location and automatically display local weather information.

---

## Live Demo

**GitHub Pages:** https://majoreze.github.io/Weather-App/

---

## Repository

**GitHub Repository:** https://github.com/majoreze/Weather-App
