// Create cities array
var cities = [];
var apiKey = `71311474f5b26fb7bbfa0bc1985b90cd`;

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
        var queryUrl = `https://api.openweathermap.org/data/2.5/onecall?units=metric&exclude=minutely,hourly&lat=${lat}&lon=${lon}&appid=${apiKey}`
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
function currentWeather(newData) {
  var temp = newData.current.temp.toFixed(`2`);
  var wind = newData.current.wind_speed.toFixed(`2`);
  var humidity = newData.current.humidity.toFixed();
  var date = dayjs.unix(newData.current.dt).format(`D[/]MM[/]YYYY`);  
  var iconUrl = `http://openweathermap.org/img/wn/${newData.current.weather[0].icon}@2x.png`;
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
  for (var i = 0; i< 5 ; i++) {
    var temp5 = newData.daily[i+1].temp.day.toFixed(`2`);
    var wind5 = newData.daily[i+1].wind_speed.toFixed(`2`);
    var humidity5 = newData.daily[i+1].humidity.toFixed();
    var date5 = dayjs.unix(newData.daily[i+1].dt).format(`D[/]MM[/]YYYY`);  
    var iconUrl5 = `http://openweathermap.org/img/wn/${newData.daily[i+1].weather[0].icon}@2x.png`;
    var futureWeatherDiv = $(`<div>`);
    var futureWeatherUl = $(`<ul>`);
    var cityNameLi = $(`<li class='city-name 5dayforecast'>`);
    var temperatureLi = $(`<li class='tempetature 5dayforecast'>`);
    var windLi = $(`<li class='wind 5dayforecast'>`);
    var humidityLi = $(`<li class='humidity 5dayforecast'>`);
    cityNameLi.text(date5);
    temperatureLi.text(`Temperature : ${temp5} °C`);
    windLi.text(`Wind Speed : ${wind5} kmh`);
    humidityLi.text(`Humidity : ${humidity5}%`);
    var d5ayicon = $(`<img>`)
    d5ayicon.attr(`src`, iconUrl5);
    $(`#forecast`).append(futureWeatherDiv);
    futureWeatherDiv.append(futureWeatherUl);
    futureWeatherUl.append(cityNameLi,temperatureLi,windLi,humidityLi);
  } 
  
  
  
  // dayjs.unix(newData.list[i].dt).format(`D[/]MM[/]YYYY`);  
}
$(`#search-button`).on(`click`, function () {
  fetchWeatherInfo();
})