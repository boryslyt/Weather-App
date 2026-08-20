let weatherBlock = document.querySelector(".weather");
let cityInput = document.querySelector(".city");
let searchButton = document.querySelector(".searchButton");
let suggestions = document.querySelector(".suggestions");
let forecast = document.querySelector(".forecast")


searchButton.addEventListener("click", function() {
    weatherBlock.innerHTML = "";
    suggestions.innerHTML = "";
    forecast.innerHTML = "";
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
            temp.classList.add("temperature");
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
            fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code`)
                .then(function(response) {
                    return response.json();
                })
                .then(function(weatherData) {
                    weatherData.daily.time.forEach(function(day, index) {
                        let date = new Date(day);
                        let shortDay = date.toLocaleDateString("en-US", {
                            weekday: "short"
                        });
                        let shortDate = date.toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "short"
                        });

                        console.log(shortDate);

                        let maxTemp = weatherData.daily.temperature_2m_max[index];
                        let minTemp = weatherData.daily.temperature_2m_min[index];
                        let code = weatherData.daily.weather_code[index];
                        let dailyIcon = getWeatherIcon(code);

                        let iconText = document.createElement("p");
                        iconText.textContent = dailyIcon;
                        iconText.classList.add("forecastIcon");

                        let forecastDay = document.createElement("div");
                        forecastDay.classList.add("forecastDay");

                        let dayText = document.createElement("p");
                        let maxText = document.createElement("p");
                        let minText = document.createElement("p");

                        dayText.textContent = `${shortDay}, ${shortDate}`;
                        maxText.textContent = `Max: ${maxTemp} °C`;
                        minText.textContent = `Min: ${minTemp} °C`;
                        dayText.classList.add("forecastDate");

                        forecastDay.append(dayText);
                        forecastDay.append(iconText);
                        forecastDay.append(maxText);
                        forecastDay.append(minText);
                        
                        forecast.append(forecastDay);
                    });
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

                    let icon = getWeatherIcon(code);
                    let weatherDescription;
                    if (code === 0) {
                        weatherDescription = "Clear sky";
                    }
                    else if (code === 1) {
                        weatherDescription = "Mainly clear";
                    }
                    else if (code === 2) {
                        weatherDescription = "Partly cloudy";
                    }
                    else if (code === 3) {
                        weatherDescription = "Overcast";
                    }
                    else if (code === 45 || code === 48) {
                        weatherDescription = "Fog";
                    }
                    else if (code === 51 || code === 53 || code === 55) {
                        weatherDescription = "Drizzle";
                    }
                    else if (code === 56 || code === 57) {
                        weatherDescription = "Freezing drizzle";
                    }
                    else if (code === 61 || code === 63 || code === 65) {
                        weatherDescription = "Rain";
                    }
                    else if (code === 66 || code === 67) {
                        weatherDescription = "Freezing rain";
                    }
                    else if (code === 71 || code === 73 || code === 75) {
                        weatherDescription = "Snow";
                    }
                    else if (code === 77) {
                        weatherDescription = "Snow grains";
                    }
                    else if (code === 80 || code === 81 || code === 82) {
                        weatherDescription = "Rain showers";
                    }
                    else if (code === 85 || code === 86) {
                        weatherDescription = "Snow showers";
                    }
                    else if (code === 95 || code === 96 || code === 99) {
                        weatherDescription = "Thunderstorm";
                    }
                    else {
                        weatherDescription = "Unknown";
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

function getWeatherIcon(code) {
    if (code === 0) {
        return "☀️";
    }
    else if (code === 1) {
        return "🌤️";
    }
    else if (code === 2) {
        return "⛅";
    }
    else if (code === 3) {
        return "☁️";
    }
    else if (code === 45 || code === 48) {
        return "🌫️";
    }
    else if (code === 51 || code === 53 || code === 55) {
        return "🌦️";
    }
    else if (code === 56 || code === 57) {
        return "🌨️";
    }
    else if (code === 61 || code === 63 || code === 65) {
        return "🌧️";
    }
    else if (code === 66 || code === 67) {
        return "🌧️";
    }
    else if (code === 71 || code === 73 || code === 75) {
        return "❄️";
    }
    else if (code === 77) {
        return "🌨️";
    }
    else if (code === 80 || code === 81 || code === 82) {
        return "🌦️";
    }
    else if (code === 85 || code === 86) {
        return "🌨️";
    }
    else if (code === 95 || code === 96 || code === 99) {
        return "⛈️";
    }
    else {
        return "🌡️";
    }
}