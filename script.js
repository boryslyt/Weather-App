let weatherBlock = document.querySelector(".weather");
let cityInput = document.querySelector(".city");
let searchButton = document.querySelector(".searchButton");


searchButton.addEventListener("click", function() {
    weatherBlock.innerHTML = "";
    let city = cityInput.value;
    cityInput.value = "";
    console.log(city);

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
            let place = document.createElement("h2");
            let temp = document.createElement("p");
            let humid = document.createElement("p");
            let appar = document.createElement("p");
            let wind = document.createElement("p");
            let weatherCode = document.createElement("p");
            weatherBlock.append(container);
            container.append(place);
            container.append(temp);
            container.append(humid);
            container.append(appar);
            container.append(wind);
            container.append(weatherCode);
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
                    humid.textContent = `Humidity: ${humidity}%`;
                    appar.textContent = `Feels like:${aprnt}°C`;
                    wind.textContent = `Wind: ${wnd}`;

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
                })
    });
});