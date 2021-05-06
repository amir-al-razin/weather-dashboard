const targetCityWeatherElement = document.getElementById("targetCityWeather");
const uvIndexSpan = document.getElementById("currentUv");
const uvIndexElement = document.getElementById("currentUvIndex");
const allDates = document.querySelectorAll(".fiveDay");
const forecastDate = document.getElementById("forecastDate");
const userFormEl = document.getElementById("user-form");


//call to get 5 day forecast features


export default function get5day(lat, lon) {
    var apiURL =
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=0642f62247cd5fc4b4b2603fcde8ec95&units=imperial`;
    //API request

    fetch(apiURL)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data);

            //Getting UV index for current weather. 
            var uvIndex = data.current.uvi;
            uvIndex = Math.ceil(uvIndex);
            uvIndexElement.textContent = "UV Index: " + uvIndex;

            if (uvIndex >= 0 && uvIndex <= 3) {
                uvIndexElement.setAttribute("style", "background-color: green")
            } else if (uvIndex > 3 && uvIndex <= 6) {
                uvIndexElement.setAttribute("style", "background-color: yellow")
            } else if (uvIndex > 6 && uvIndex <= 7) {
                uvIndexElement.setAttribute("style", "background-color: orange")
            } else if (uvIndex > 7 && uvIndex <= 10) {
                uvIndexElement.setAttribute("style", "background-color: red")
            } else if (uvIndex >= 11) {
                uvIndexElement.setAttribute("style", "background-color: violet")
            };


            //5-day forecast loop for getting info from indexes 1 - 5 as they contain the forecast. Index 0 is the current day's weather.
            for (index = 1; index < 6; index++) {
                var day = data.daily[index];
                var temp = parseFloat(day.temp.max);
                temp = Math.ceil(temp);
                //clear the forecast elements
                allDates[index - 1].innerHTML = "";
                //create the forecast elements
                var p = document.createElement("p");
                var p2 = document.createElement("img");
                var p3 = document.createElement("p");
                var p4 = document.createElement("p");
                p.textContent = moment.unix(data.daily[index].dt).format("MM/DD/YYYY");

                allDates[index - 1].appendChild(p);

                p2.setAttribute("src", `https://openweathermap.org/img/wn/${data.daily[index].weather[0].icon}@2x.png`);

                allDates[index - 1].appendChild(p2);

                p3.textContent = "Temp: " + temp + " °F";

                allDates[index - 1].appendChild(p3);

                p4.textContent = "Humidity: " + data.daily[index].humidity + " %";

                allDates[index - 1].appendChild(p4);
            }
        })
};
