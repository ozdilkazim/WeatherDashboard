// Create cities array
var cities = [];
var apiKey = `9a6989cdb2e9dde02696b2a7a395afa3`;

// Fetch weather info 
// var city = $(`#search-input`).val();
var city = `London`;
console.log(city);

function fetchWeatherInfo() {
    // Convert city name to coordtinats using geo api
    var queryUrlGeo = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`
    fetch(queryUrlGeo)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        // Coordinates
        var lat = data[0].lat;
        var lon = data[0].lon;
        
        // Save city name and coordinates to local storage
        var coordinates = lat + ` ` + lon;
        localStorage.setItem(city, coordinates);

        // Fetch new data due to coordinates we have
        var queryUrl = `https://api.openweathermap.org/data/2.5/forecast?units=metric&lat=${lat}&lon=${lon}&appid=${apiKey}`
        fetch(queryUrl)
        .then(function (newResponse) {
          return newResponse.json();
        })
        .then(function (newData) {
          console.log(newData);
          currentWeather(newData);
          futureWeather(newData);

        });
      })
}

fetchWeatherInfo() 

// Current Weather Information 
var currentTime = dayjs().format(`HH`);
var timeOfTheDay = ``;
console.log(currentTime);
if (currentime > 17) {
  timeOfTheDay === 5;
} else {
  timeOfTheDay === 3;
}
// 0 = 06:00 
// 1 = 09:00 
// 2 = 12:00 
// 3 = 15:00 
// 4 = 18:00 
// 5 = 21:00 
// 6 = 00:00 
// 7 = 03:00 
function currentWeather(newData) {
  var temp = newData.list[timeOfTheDay].main.temp.toFixed(`2`);
  var wind = newData.list[timeOfTheDay].wind.speed.toFixed(`2`);
  var humidity = newData.list[timeOfTheDay].main.humidity.toFixed();
  var date = dayjs.unix(newData.list[timeOfTheDay].dt).format(`D[/]MM[/]YYYY`);  
  var iconUrl = `http://openweathermap.org/img/wn/${newData.list[timeOfTheDay].weather[0].icon}@2x.png`;
  $(`#city-name`).text(`${city} (${date})`);
  $(`#temperature`).text(`Temperature : ${temp} °C`);
  $(`#wind`).text(`Wind Speed : ${wind} kmh`);
  $(`#humidity`).text(`Humidity : ${humidity}%`);
  $(`#icon`).attr(`src`, iconUrl);
}


$(`#search-button`).on(`click`, function () {
  fetchWeatherInfo();
})

// Future Weather Information 
function futureWeather(newData) {
  for (var i = timeOfTheDay; i<= 30 ; i++) {
    var temp5 = newData.list[i].main.temp.toFixed(`2`);
    var wind5 = newData.list[i].wind.speed.toFixed(`2`);
    var humidity5 = newData.list[i].main.humidity.toFixed();
    var date5 = newData.list[i].dt_txt;
    
    var iconUrl5 = `http://openweathermap.org/img/wn/${newData.list[i].weather[0].icon}@2x.png`;
    var futureWeatherDiv = $(`<div>`);
    var futureWeatherUl = $(`<ul>`);
    var cityNameLi = $(`<li class='city-name 5dayforecast'>`);
    var temperatureLi = $(`<li class='tempetature 5dayforecast'>`);
    var windLi = $(`<li class='wind 5dayforecast'>`);
    var humidityLi = $(`<li class='humidity 5dayforecast'>`);
    var dateFormatted = dayjs(newData.list[i].dt_txt, "YYYY-MM-DD HH:mm:ss").format(`D MM YYYY`);
    cityNameLi.text(dateFormatted);
    temperatureLi.text(`Temperature : ${temp5} °C`);
    windLi.text(`Wind Speed : ${wind5} kmh`);
    humidityLi.text(`Humidity : ${humidity5}%`);
    var d5ayicon = $(`<img>`)
    d5ayicon.attr(`src`, iconUrl5);
    $(`#forecast`).append(futureWeatherDiv);
    futureWeatherDiv.append(futureWeatherUl);
    futureWeatherUl.append(cityNameLi,temperatureLi,windLi,humidityLi);
  } // dayjs.unix(newData.list[i].dt).format(`D[/]MM[/]YYYY`);  
}
$(`#search-button`).on(`click`, function () {
  fetchWeatherInfo();
})