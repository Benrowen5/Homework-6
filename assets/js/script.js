var apiKey = "43df6994375e5f73cac2fff37be7d8b5";
var submitBtn = document.getElementById("submit");

var previousSearchesEl = document.getElementById("previousSearches");
var cityListEl = document.getElementById("city-list");
var savedCities = JSON.parse(localStorage.getItem("cities")) || [];

var currentConditionsEl = document.getElementById("current-conditions");

var displayDate = function() {
    var currentDay = document.createElement("h3");
    currentDay.textContent = moment().format("MMM Do YY");
    currentConditionsEl.appendChild(currentDay);
};

var displayConditions = function(data) {
    var currentTemp = document.createElement("p");
    currentTemp.textContent = "temperature: " + data.main.temp +"F";
    currentConditionsEl.appendChild(currentTemp);
    var currentHumidity = document.createElement("p");
    currentHumidity.textContent = "Humidity: " + data.main.humidity + "%";
    currentConditionsEl.appendChild(currentHumidity);
    var currentWindSpeed = document.createElement("p");
    currentWindSpeed.textContent = "Wind Speed: " + data.wind.speed + " MPH";
    currentConditionsEl.appendChild(currentWindSpeed);
    var currentUV = document.createElement("p");
    currentUV.textContent = "UV Index: " + data.avi;
    currentConditionsEl.appendChild(currentUV);
}

var displayCityInfo = function(data) {
    var cityHeader = document.createElement("h3");
    cityHeader.textContent = data.name;
    currentConditionsEl.appendChild(cityHeader);
    displayDate();
    displayConditions(data);
};

var getWeather = function(cityName) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" + apiKey;
    fetch(apiUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                console.log(data);
                console.log(data.name);
                displayCityInfo(data);
                })
            }
            if (response.status === 400) {
                alert("bad request");
            }
        });
}


var getCity = function (event) {
    event.preventDefault();
    var cityName = document.querySelector("#city").value;
    
    // call save City to save city into local storage array
    saveCity(cityName);
    createCityEl(cityName);
    getWeather(cityName);
}

var createCityEl = function(city) {
    var cityEl = document.createElement("li");
    cityEl.setAttribute("id", "city");
    cityEl.textContent = (city);
    cityEl.innerHTML = "<h3>" + city +"</h3>";
    cityListEl.appendChild(cityEl);
};

var saveCity = function(cityName){
    // set searched city into savedCities array
    savedCities.push(cityName);
    console.log(savedCities);
    // check if search city has already been saved, if not, save it.
    localStorage.setItem('cities', JSON.stringify(savedCities));
};

var loadCities = function() {
    // search local storage for "cities" and break if nothing is saved.
    var savedCities = JSON.parse(localStorage.getItem("cities")) || [];
    console.log(savedCities);
    if (!savedCities) {
        savedCities = [];
    };
    
    // loop through saved cities array
    for (i=0; i<savedCities.length; i++) {
        // pass each city into the createCityEl function
        createCityEl(savedCities[i]);                
    }    
};

loadCities();
submitBtn.addEventListener("click", getCity);

// psuedo code:
// on page load, load in any previous searches in a section below the search bar.
// on click of any previous searches, app shows weather data for that city
// on submission of a new city name, app shows city weather info and saves to the list of previous searches
