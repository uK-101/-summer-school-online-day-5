let btn = document.getElementById("btn");
let result = document.getElementById("result");
let error = document.getElementById("error");
let toggle = document.getElementById("toggle");

let isFahrenheit = false;
let weatherData = null;
const API_KEY = "5ae4ea6b74794d27b35bfa4a746491b8"

btn.addEventListener("click", () => {
    result.innerHTML = "";
    error.innerHTML = "";
    result.classList.add("loading");

    if(!navigator.geolocation) {
        error.innerHTML = "Problem with geolocation.";
        result.classList.remove("loading");
        return;
    }
    navigator.geolocation.getCurrentPosition(handleResponse, errorMsg);
});

toggle.addEventListener("change", () => {
    isFahrenheit = toggle.checked;
    if (weatherData) {
        displayWeather(weatherData);
    }
});

function handleResponse (position) {
    let { latitude, longitude } = position.coords;

    let unit = "metric";
    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=${unit}`;

    let p = fetch(url)
        p.then(response => {
            if (!response.ok) throw new Error("Data not available");
            return response.json();
        })
        .then(data => {
            weatherData = data;
            displayWeather(data);
        })
        .catch(() => {
            showError("Data not available.");
        })
}

function displayWeather(data) {
    let city = data.name;
    let condition = data.weather[0].main;
    let tempC = data.main.temp;
    let temp = isFahrenheit ? celToFahrenheit(tempC) : tempC;
    let maxTemp = isFahrenheit ? celToFahrenheit(data.main.temp_max) : data.main.temp_max;
    let minTemp = isFahrenheit ? celToFahrenheit(data.main.temp_min) : data.main.temp_min;
    let unit = isFahrenheit ? "°F" : "°C";
    let windSpeed = data.wind.speed;

    result.classList.remove("loading");
    result.innerHTML = `
        <strong>City: </strong>${city}<br><br>
        <strong>Temperature: </strong>${temp.toFixed(1)} ${unit}<br><br>
        <strong>Current Condition: </strong>${condition}
        <br><br>
        <strong>Min Temperature: </strong>${minTemp.toFixed(1)} ${unit
        }<br><br>
        <strong>Max Temperature: </strong>${maxTemp.toFixed(1)} ${unit
        }<br><br>
        <strong>Wind Speed: </strong>${windSpeed} m/s
    `;
    document.querySelector(".container").style.height = "450px";
}

function celToFahrenheit(celsius) {
    return (celsius * 9) / 5 + 32;
}

function errorMsg(err) {
    showError("Please allow location access.");
}

function showError(msg) {
    result.classList.remove("loading");
    error.textContent = msg;
}