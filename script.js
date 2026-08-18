let weatherBlock = document.querySelector(".weather");
let cityInput = document.querySelector(".city");
let searchButton = document.querySelector(".searchButton");
let suggestions = document.querySelector(".suggestions");


searchButton.addEventListener("click", function() {
    weatherBlock.innerHTML = "";
    suggestions.innerHTML = "";
    let city = cityInput.value.trim();
    if (city === "") {
        return;
    }
    cityInput.value = "";

    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`)
        .then(function(response) {
            return response.json();
    })
        .then(function(data) {
            if (!data.results || data.results.length === 0) {
            weatherBlock.textContent = "City not found";
            return;
            }
            let container = document.createElement("div");
            container.classList.add("weatherCard");
            let mainWeather = document.createElement("div");
            mainWeather.classList.add("mainWeather");
            let details = document.createElement("div");
            details.classList.add("details");
            let place = document.createElement("h2");
            let temp = document.createElement("p");
            temp.classList.add("temperature")
            let humid = document.createElement("p");
            let appar = document.createElement("p");
            let wind = document.createElement("p");
            let humidnum = document.createElement("p");
            let apparnum = document.createElement("p");
            let windnum = document.createElement("p");
            let weatherCode = document.createElement("p");
            let weatherIcon = document.createElement("p");
            weatherIcon.classList.add("weatherIcon");
            let conthum = document.createElement("div");
            conthum.classList.add("conthum");
            let contapp = document.createElement("div");
            contapp.classList.add("contapp");
            let contwind = document.createElement("div");
            contwind.classList.add("contwind");
            weatherBlock.append(container);
            container.append(mainWeather);
            container.append(details);
            mainWeather.append(place);
            mainWeather.append(weatherIcon);
            mainWeather.append(temp);
            mainWeather.append(weatherCode);
            details.append(conthum);
            details.append(contapp);
            details.append(contwind);
            conthum.append(humid);
            contapp.append(appar);
            contwind.append(wind);
            conthum.append(humidnum);
            contapp.append(apparnum);
            contwind.append(windnum);
            humidnum.classList.add("detailNumber");
            apparnum.classList.add("detailNumber");
            windnum.classList.add("detailNumber");
            let latitude = data.results[0].latitude;
            let longitude = data.results[0].longitude;
            let cityName = data.results[0].name;
            let country = data.results[0].country;
            fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code`)
                .then(function(response) {
                    return response.json();
                })
                .then(function(weatherData) {
                    let weather = weatherData.current.temperature_2m; 
                    let humidity = weatherData.current.relative_humidity_2m;
                    let aprnt = weatherData.current.apparent_temperature;
                    let wnd = weatherData.current.wind_speed_10m;
                    let code = weatherData.current.weather_code;
                    place.textContent = `${cityName}, ${country}`;
                    temp.textContent = `${weather} °C`;
                    humid.textContent = `Humidity:`;
                    humidnum.textContent = `${humidity}%`;
                    appar.textContent = `Feels like: `;
                    apparnum.textContent = `${aprnt}°C`;
                    wind.textContent = `Wind: `;
                    windnum.textContent = `${wnd} km/h`;

                    let icon;
                    let weatherDescription;
                    if (code === 0) {
                        weatherDescription = "Clear sky";
                        icon = "☀️";
                    }
                    else if (code === 1) {
                        weatherDescription = "Mainly clear";
                        icon = "🌤️";
                    }
                    else if (code === 2) {
                        weatherDescription = "Partly cloudy";
                        icon = "⛅";
                    }
                    else if (code === 3) {
                        weatherDescription = "Overcast";
                        icon = "☁️";
                    }
                    else if (code === 45 || code === 48) {
                        weatherDescription = "Fog";
                        icon = "🌫️";
                    }
                    else if (code === 51 || code === 53 || code === 55) {
                        weatherDescription = "Drizzle";
                        icon = "🌦️";
                    }
                    else if (code === 56 || code === 57) {
                        weatherDescription = "Freezing drizzle";
                        icon = "🌨️";
                    }
                    else if (code === 61 || code === 63 || code === 65) {
                        weatherDescription = "Rain";
                        icon = "🌧️";
                    }
                    else if (code === 66 || code === 67) {
                        weatherDescription = "Freezing rain";
                        icon = "🌧️";
                    }
                    else if (code === 71 || code === 73 || code === 75) {
                        weatherDescription = "Snow";
                        icon = "❄️";
                    }
                    else if (code === 77) {
                        weatherDescription = "Snow grains";
                        icon = "🌨️";
                    }
                    else if (code === 80 || code === 81 || code === 82) {
                        weatherDescription = "Rain showers";
                        icon = "🌦️";
                    }
                    else if (code === 85 || code === 86) {
                        weatherDescription = "Snow showers";
                        icon = "🌨️";
                    }
                    else if (code === 95 || code === 96 || code === 99) {
                        weatherDescription = "Thunderstorm";
                        icon = "⛈️";
                    }
                    else {
                        weatherDescription = "Unknown";
                        icon = "🌡️";
                    }
                    weatherCode.textContent = weatherDescription;
                    weatherIcon.textContent = icon;
                })
    });
});

cityInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        searchButton.click();
    }
})

cityInput.addEventListener("input", function() {
    let city = cityInput.value.trim();

    if (city.length < 3) {
        suggestions.innerHTML = "";
        return;
    }
    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=5&language=en&format=json`)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        suggestions.innerHTML = "";

        if (!data.results) {
            return;
        }

        data.results.forEach(function(cityData) {
            let suggestion = document.createElement("p");
            suggestion.classList.add("suggestion");

            suggestion.textContent = `${cityData.name}, ${cityData.country}`;
            suggestions.append(suggestion);
            suggestion.addEventListener("click", function() {
                cityInput.value = cityData.name;
                suggestions.innerHTML = "";
                searchButton.click();
            });
        });
    });
});