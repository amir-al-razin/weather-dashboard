// info
const key = "0642f62247cd5fc4b4b2603fcde8ec95";

// html dom selector
const targetCityWeatherElement = document.querySelector("#targetCityWeather");
const weatherIconElement = document.querySelector("#weatherIcon");
const uvIndexSpan = document.querySelector("#currentUv");
const uvIndexElement = document.querySelector("#currentUvIndex");
const allDates = document.querySelectorAll(".fiveDay");
const forecastDate = document.querySelector("#forecastDate");
const historyLinks = document.querySelector("#history");
const currentCity = document.querySelector("#currentCity");
const userFormEl = document.querySelector("#user-form");
const userCityNameElement = document.querySelector("#city-name");
const searchBtnElement = document.querySelector("#searchBtn");

// helper function
const citySelect = userCityNameElement.value.trim();
const today = moment().format("MMM Do, YYYY");

//Prevent default on seach button
const searchCity = (e) => {
  e.preventDefault();

  //Get city name from form input
  const selectCity = userCityNameElement.value.trim();

  //Require user to type in a city name

  selectCity
    ? getUserWeather(selectCity, false)
    : alert("input field cannot be blank");
};

const fetchData = async (api) => {
  const res = await fetch(api);
  const data = await res.json();

  return data;
};

//function to fetch weather data for current day weather from API based
//on user form input
async function getUserWeather(cityName, isFromHistory) {
  //Take above parameter to build URL string
  let apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${key}&units=imperial`;
  //make API call
  const weatherData = await fetchData(apiURL);

  //extract needed data from the response
  let temp = weatherData.main.temp;
  let humidity = weatherData.main.humidity;
  let speed = weatherData.wind.speed;
  temp = Math.ceil(temp);

  weatherIconElement.innerHTML = "";
  let weatherIcon = document.createElement("img");
  weatherIcon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`
  );
  weatherIconElement.appendChild(weatherIcon);

  //Change current weather elements using data extract from response
  currentCity.textContent = cityName;
  currentTemp.textContent = temp + " °F";
  currentWind.textContent = speed + " mph";
  currentHumid.textContent = humidity + " %";
  //currentUv.textContent = getUvIndex()
  currentDate.textContent = today;

  //create button for search history
  var btn = document.createElement("button");

  btn.classList = "historyCityBtn";
  btn.textContent = cityName;

  var cities = JSON.parse(localStorage.getItem("cities"));
  if (!cities) {
    cities = [];
  }
  if (!isFromHistory) {
    cities.push(cityName);
    localStorage.setItem("cities", JSON.stringify(cities));
    historyLinks.appendChild(btn);
  }

  //passing lat and lon coordinates so next function/API call can get the
  //5 day forecast - previous call only provided current weather data.
  get5day(weatherData.coord.lat, weatherData.coord.lon);
}

//call to get 5 day forecast features
async function get5day(lat, lon) {
  var apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=0642f62247cd5fc4b4b2603fcde8ec95&units=imperial`;
  //API request

  const fiveDaysData = await fetchData(apiURL);

  console.log(fiveDaysData);

  //Getting UV index for current weather.
  var uvIndex = fiveDaysData.current.uvi;
  uvIndex = Math.ceil(uvIndex);
  uvIndexElement.textContent = "UV Index: " + uvIndex;

  if (uvIndex >= 0 && uvIndex <= 3) {
    uvIndexSpan.setAttribute("style", "background-color: green");
  } else if (uvIndex > 3 && uvIndex <= 6) {
    uvIndexSpan.setAttribute("style", "background-color: yellow");
  } else if (uvIndex > 6 && uvIndex <= 7) {
    uvIndexSpan.setAttribute("style", "background-color: orange");
  } else if (uvIndex > 7 && uvIndex <= 10) {
    uvIndexSpan.setAttribute("style", "background-color: red");
  } else if (uvIndex >= 11) {
    uvIndexSpan.setAttribute("style", "background-color: violet");
  }

  //5-day forecast loop for getting info from indexes 1 - 5 as they contain the forecast. Index 0 is the current day's weather.
  for (index = 1; index < 6; index++) {
    var day = fiveDaysData.daily[index];
    var temp = parseFloat(day.temp.max);
    temp = Math.ceil(temp);
    //clear the forecast elements
    allDates[index - 1].innerHTML = "";
    //create the forecast elements
    var p = document.createElement("p");
    var p2 = document.createElement("img");
    var p3 = document.createElement("p");
    var p4 = document.createElement("p");
    p.textContent = moment
      .unix(fiveDaysData.daily[index].dt)
      .format("MM/DD/YYYY");

    allDates[index - 1].appendChild(p);

    p2.setAttribute(
      "src",
      `https://openweathermap.org/img/wn/${fiveDaysData.daily[index].weather[0].icon}@2x.png`
    );

    allDates[index - 1].appendChild(p2);

    p3.textContent = "Temp: " + temp + " °F";

    allDates[index - 1].appendChild(p3);

    p4.textContent = "Humidity: " + fiveDaysData.daily[index].humidity + " %";

    allDates[index - 1].appendChild(p4);
  }
}

//funciton to access local storage so history buttons will show weather
function getHistoryWeather() {
  var cities = JSON.parse(localStorage.getItem("cities"));

  if (cities) {
    for (let index = 0; index < cities.length; index++) {
      var btn = document.createElement("button");
      btn.classList = "historyCityBtn";
      btn.textContent = cities[index];
      historyLinks.appendChild(btn);
    }
  }
}

//search  city based on form input
searchBtnElement.addEventListener("click", searchCity);

//get weather data for history buttons
historyLinks.addEventListener("click", (event) => {
  let cityName = event.target.textContent;
  getUserWeather(cityName, true);
});
