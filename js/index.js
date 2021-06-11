// info
const key = "1983ca32f2957b79efcb516781e37ea0";

// SELECTING HTML TAGS

const targetCityWeatherElement = document.querySelector("#targetCityWeather");
const weatherIconElement = document.querySelector("#weatherIcon");
  // uv index element
const uvIndexSpan = document.querySelector("#currentUv");
const uvIndexElement = document.querySelector("#currentUvIndex");

const allDates = document.querySelectorAll(".fiveDay");
const forecastDate = document.querySelector("#forecastDate");
const historyLinks = document.querySelector("#history");
const currentCity = document.querySelector("#currentCity");
const userFormEl = document.querySelector("#user-form");
const userCityNameElement = document.querySelector("#city-name");
const searchBtnElement = document.querySelector("#searchBtn");

// small functions 
const today = moment().format("MMM Do, YYYY");  //function for formatting the date


const searchCity = (e) => {
  e.preventDefault(); //Prevent default behaviour of the search input field

  //Get city name from form input
  const selectCity = userCityNameElement.value.trim(); //function for removing whitespaces

  //Require user to type in a city name
  selectCity
    ? getUserWeather(selectCity, false)
    : alert("input field cannot be blank");  // alert if the field is blank
};


// custom function for fetching data and returning it to store in variables
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

  //Change current weather elements using data extracted from response
  currentCity.textContent = cityName;
  currentTemp.textContent = temp + " °F";
  currentWind.textContent = speed + " mph";
  currentHumid.textContent = humidity + " %";
  currentDate.textContent = today;

  //create button for search history
  let btn = document.createElement("button");

  btn.classList = "historyCityBtn";
  btn.textContent = cityName;

  let cities = JSON.parse(localStorage.getItem("cities"));
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
  const apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${key}&units=imperial`;
  //API request

  const fiveDaysData = await fetchData(apiURL);



  //Getting UV index for current weather.
  let uvIndex = fiveDaysData.current.uvi;
  uvIndex = Math.ceil(uvIndex); //Round a number upward to its nearest integer
  uvIndexSpan.textContent = uvIndex; //showing uv index

  // changing color based on uv-index by using switch statement
  switch (true) {
    case uvIndex >= 0 && uvIndex <= 3:
      uvIndexSpan.setAttribute("style", "background-color: green");
      break;
    case uvIndex > 3 && uvIndex <= 6:
      uvIndexSpan.setAttribute("style", "background-color: lightyellow");
      break;
    case uvIndex > 6 && uvIndex <= 7:
      uvIndexSpan.setAttribute("style", "background-color: orange");
      break;
    case uvIndex > 7 && uvIndex <= 10:
      uvIndexSpan.setAttribute("style", "background-color: lightcoral");
      break;
    case uvIndex >= 11:
      uvIndexSpan.setAttribute("style", "background-color: violet");
      break;
  }

  //5-day forecast loop for getting info from indexes 1 - 5 as they contain the forecast. Index 0 is the current day's weather.
  for (index = 1; index < 6; index++) {
    let day = fiveDaysData.daily[index];
    let temp = parseFloat(day.temp.max);
    temp = Math.ceil(temp);
    //clear the forecast elements
    allDates[index - 1].innerHTML = "";
    //create the forecast elements
    let p = document.createElement("p");
    let p2 = document.createElement("img");
    let p3 = document.createElement("p");
    let p4 = document.createElement("p");
    p.textContent = moment.unix(day.dt).format("MM/DD/YYYY");

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

//funciton to access local storage so that history buttons will show weather
function getHistoryWeather() {

  const cities = JSON.parse(localStorage.getItem("cities")); //getting recent cities
  

  // displaying recent cities as buttons
  if (cities) {
    for (let index = 0; index < cities.length; index++) {
      let btn = document.createElement("button");
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

getHistoryWeather();
