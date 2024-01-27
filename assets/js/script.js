// Create cities array
var cities = [];
var apiKey = "9a6989cdb2e9dde02696b2a7a395afa3";


// Convert city name to coordinats
// function cityName2coordinats() {

//   var city = $(this).attr("id", "search-input");
//   var queryCityURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + " &limit=5&appid=" + apiKey;

//   // Creates a Fetch call for the specific movie button being clicked
//   fetch(queryCityURL)
//     .then(function (response) {
//       return response.json();
//     })
//     .then(function (data) {
//       console.log(data);
//       return;
//     });
// }

// Fetch weather info 
$("#search-button").on("click", function() {
    preventDefault();
    var city = $("#search-input").val().trim();
    console.log(city)
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey;

    


    // Creates a Fetch call for the specific movie button being clicked
    fetch(queryURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
        return;
        // Creating a div to hold the movie
        var movieDiv = $("<div class='movie'>");
  
        // Storing the rating data
        var rating = data.Rated;
  
        // Creating an element to have the rating displayed
        var pOne = $("<p>").text("Rating: " + rating);
  
        // Displaying the rating
        movieDiv.append(pOne);
  
        // Storing the release year
        var released = data.Released;
  
        // Creating an element to hold the release year
        var pTwo = $("<p>").text("Released: " + released);
  
        // Displaying the release year
        movieDiv.append(pTwo);
  
        // Storing the plot
        var plot = data.Plot;
  
        // Creating an element to hold the plot
        var pThree = $("<p>").text("Plot: " + plot);
  
        // Appending the plot
        movieDiv.append(pThree);
  
        // Retrieving the URL for the image
        var imgURL = data.Poster;
  
        // Creating an element to hold the image
        var image = $("<img>").attr("src", imgURL);
  
        // Appending the image
        movieDiv.append(image);
  
        // Putting the entire movie above the previous movies
        $("#movies-view").prepend(movieDiv);
      });
  });