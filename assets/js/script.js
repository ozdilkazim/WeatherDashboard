// Create cities array
var cities = [];
var apiKey = `71311474f5b26fb7bbfa0bc1985b90cd`;

// Get past searches if applicaple
getPastSearches();

// Fetch informatin for default city
city = `London`;
fetchWeatherInfo();

$("#search-button").on("click", function (event) {
  $("#forecast").empty();
  $("#history").empty();
  event.preventDefault();
  // This line grabs the input from the textbox
  city = toTitleCase($("#search-input").val().trim());
  addPastSeachList(city);
  fetchWeatherInfo();
  getPastSearches();
});

function addPastSeachList(arr) {
  if (arr =``) {
    alert=`City name cannot be blank!`;
  } else {
    var addToList = $("<button type='button' class='btn btn-light past-search' data-name='"+ arr +"'>");
    addToList.text(arr);
    $("#history").append(addToList);
  }
}

function fetchWeatherInfo() {
  // Convert city name to coordtinats using geo api
  var queryUrlGeo = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`
  fetch(queryUrlGeo).then(function (response) {
    console.log(response);
      return response.json();
  }).then(function (data) {
    // Coordinates
    var lat = data[0].lat;
    var lon = data[0].lon;
    
    // Save city name and coordinates to local storage
    var storage = {
      cityName : city,
      latitude : lat,
      longitude : lon,
    }
    localStorage.setItem(city, JSON.stringify(storage));

    // Fetch new data due to coordinates we have
    var queryUrl = `https://api.openweathermap.org/data/2.5/onecall?units=metric&exclude=minutely,hourly&lat=${lat}&lon=${lon}&appid=${apiKey}`
    fetch(queryUrl).then(function (newResponse) {
      console.log(newResponse);
      if (newResponse.ok) {
        newResponse.json()
        .then(function (newData) {
        currentWeather(newData);
        console.log(newData);
        });
      } else {
        alert(`Please enter a valid city name!`);
      }
    });
  });  
};

function currentWeather(data) {
  var temp = data.current.temp.toFixed(`2`);
  var wind = data.current.wind_speed.toFixed(`2`);
  var humidity = data.current.humidity.toFixed();
  var iconUrl = `http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`;
  var date = dayjs.unix(data.current.dt).format(`D[/]MM[/]YYYY`);  
  $("#city-name").text(`${city} (${date})`);
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

// Get past searches from local storage
function getPastSearches() {
  // Get city keys first
  var cityKeys = Object.keys(localStorage);
  console.log(removeItemOnce(cityKeys,`bugsnag-anonymous-id`)) 
  console.log(cityKeys)
  //Get coordinates by city names
  for (var i=0; i < localStorage.length; i++) {
    cities[i] = JSON.parse(localStorage.getItem(cityKeys[i]));
    var pastSearchButton = $("<button type='button' class='btn btn-light past-search' data-name='"+ cityKeys[i] +"'>");
    pastSearchButton.text(cityKeys[i]);
    $("#history").append(pastSearchButton);
  }
}

// Get past search information from local storage
function getPastSearchInfo(event) {
  event.preventDefault();
  $("#forecast").empty();
  $("#history").empty();
  city = $(this).attr("data-name");
  var pastLat = JSON.parse(localStorage.getItem(city)).latitude;
  var pastLon = JSON.parse(localStorage.getItem(city)).longitude;
  // Fetch new data due to coordinates we have
  var queryUrl = `https://api.openweathermap.org/data/2.5/onecall?units=metric&exclude=minutely,hourly&lat=${pastLat}&lon=${pastLon}&appid=${apiKey}`
    fetch(queryUrl)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    currentWeather(data);
  });
  getPastSearches();
}

// Get past searches information when clicked
$(document).on("click", ".past-search", getPastSearchInfo);

function removeItemOnce(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

function removeItemAll(arr, value) {
  var i = 0;
  while (i < arr.length) {
    if (arr[i] === value) {
      arr.splice(i, 1);
    } else {
      ++i;
    }
  }
  return arr;
}