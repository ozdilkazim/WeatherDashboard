// Create cities array
var city = `London`;
var cities = [];
var apiKey = `71311474f5b26fb7bbfa0bc1985b90cd`;

// Fetch weather info for London (default city)
fetchWeatherInfo();
//var city = `London`;
$("#search-button").on("click", function (event) {
  $("#forecast").empty();
  event.preventDefault();
  // This line grabs the input from the textbox
  city = toTitleCase($("#search-input").val().trim());
  fetchWeatherInfo();
});


function fetchWeatherInfo() {
    // Convert city name to coordtinats using geo api
    var queryUrlGeo = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`
    fetch(queryUrlGeo)
      .then(function (response) {

        if (response.ok) {
          response.json().          
          then(function (data) {
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
              if (response.ok) {
                newResponse.json()
                .then(function (newData) {
                currentWeather(newData);
                console.log(newData);
                });
              }
            });
          });

        } else {

          alert(`Error, please enter correct city name!`);

        }
      });
    }

function currentWeather(data) {
  var temp = data.current.temp.toFixed(`2`);
  var wind = data.current.wind_speed.toFixed(`2`);
  var humidity = data.current.humidity.toFixed();
  var date = dayjs.unix(data.current.dt).format(`D[/]MM[/]YYYY`);  
  var iconUrl = `http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`;
  $(`#city-name`).text(`${city} (${date})`);
  $(`#temperature`).text(`Temperature : ${temp} °C`);
  $(`#wind`).text(`Wind : ${wind} kph`);
  $(`#humidity`).text(`Humidity : ${humidity}%`);
  $(`#icon`).attr(`src`, iconUrl);
  futureWeather(data);
}

// Future Weather Information 
function futureWeather(data) {
  for (var i = 0; i< 5 ; i++) {
    var temp5 = data.daily[i+1].temp.day.toFixed(`2`);
    var wind5 = data.daily[i+1].wind_speed.toFixed(`2`);
    var humidity5 = data.daily[i+1].humidity.toFixed();
    var date5 = dayjs.unix(data.daily[i+1].dt).format(`D[/]MM[/]YYYY`);  
    var iconUrl5 = `http://openweathermap.org/img/wn/${data.daily[i+1].weather[0].icon}@2x.png`;
    var futureWeatherUl = $(`<ul class='col list-group list-group-flush'>`);
    var dateLi = $(`<li class='list-group-item date'>`);
    var temperatureLi = $(`<li class='list-group-item tempetature'>`);
    var windLi = $(`<li class='list-group-item wind'>`);
    var humidityLi = $(`<li class='list-group-item humidity'>`);
    dateLi.text(date5);
    temperatureLi.text(`Temperature : ${temp5} °C`);
    windLi.text(`Wind : ${wind5} kph`);
    humidityLi.text(`Humidity : ${humidity5}%`);
    var d5ayicon = $(`<img>`)
    d5ayicon.attr(`src`, iconUrl5);
    $(`#forecast`).append(futureWeatherUl);
    futureWeatherUl.append(dateLi,temperatureLi,windLi,humidityLi);
    dateLi.append(d5ayicon)
  } 
}

// Function to uppercase first letters
function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}