var apiKey = "43df6994375e5f73cac2fff37be7d8b5";
var submitBtn = document.getElementById("submit");

var previousSearchesEl = document.getElementById("previousSearches");
var savedCities = JSON.parse(localStorage.getItem("cities")) || [];
var currentConditionsEl = document.getElementById("current");
var forecastEl = document.getElementById("forecast");
var currentEl = document.getElementById("current");

var displayDate = function() {
    var currentDay = document.createElement("h4");
    currentDay.textContent = moment().format("MMM Do YY");
    currentConditionsEl.prepend(currentDay);
};

var displayConditions = function(data) {
    let iconCode = data.current.weather[0].icon;
    let iconUrl = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png"; 
    currentConditionsEl.innerHTML = "<img src=" + iconUrl + ">";
    var currentTemp = document.createElement("p");
    currentTemp.innerHTML = "temperature: " + data.current.temp +" &#176F";
    currentConditionsEl.appendChild(currentTemp);
    var currentHumidity = document.createElement("p");
    currentHumidity.textContent = "Humidity: " + data.current.humidity + "%";
    currentConditionsEl.appendChild(currentHumidity);
    var currentWindSpeed = document.createElement("p");
    currentWindSpeed.textContent = "Wind Speed: " + data.current.wind_speed + " MPH";
    currentConditionsEl.appendChild(currentWindSpeed);
    var currentUV = document.createElement("p");
    var currentUVspan = document.createElement("span");
    currentUVspan.textContent = data.current.uvi;
    currentUV.textContent = "UV Index: ";
    currentConditionsEl.appendChild(currentUV);
    currentUV.appendChild(currentUVspan);
    if (currentUVspan.textContent < 3){
        currentUVspan.setAttribute("style", "background-color: green");
    } if (currentUVspan.textContent >= 3 && currentUVspan.textContent < 7) {
        currentUVspan.setAttribute("style", "background-color: yellow");
    } if (currentUVspan.textContent >= 7) {
        currentUVspan.setAttribute("style", "background-color: red");
    }
}

var get5Day = function(data){
    var fiveDay = document.getElementById("5-day");
    fiveDay.innerHTML = "<h3>5-Day Forecast</h3>";
// loop that gets the data for each day and displays it
    for (i=0; i<5; i++) {
        var forecastDate = moment().add(i+1, 'days').format("MMM Do YY");;
        var forecastTemp = data.daily[i+1].temp.day;
        var forecastWind = data.daily[i+1].wind_speed;
        var forecastHumidity = data.daily[i+1].humidity;
        var iconCode = data.daily[i+1].weather[0].icon;
        var iconUrl = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png";       
        var forecastDay = document.createElement("div")
        forecastDay.setAttribute("id", "day-"+[i+1], "class", "card col-sm-2");
        forecastDay.innerHTML = "<p>" + forecastDate + "</br> <img src=" + iconUrl + "></br>Temp: " + forecastTemp + " &#176F </br> Wind: " + forecastWind + " MPH </br> Humidity: " + forecastHumidity + " % </p>";
        forecastEl.appendChild(forecastDay);
    }
};

var displayCityName = function(data) {
    var cityName = document.createElement("h3");
    cityName.textContent = data.name;
    currentEl.innerHTML = "Current Conditions for: </br>" + cityName;
    currentEl.prepend(cityName);
};

var displayCityInfo = function(data) {
    displayConditions(data);
    displayDate();
};

var getWeather = function(cityName) {
    // api call to get lat and long of city.
    var apiUrl1 = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey;
    fetch(apiUrl1).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                console.log(data);
                displayCityName(data);
                // api call to get weather data based on lat and long coordinates.
                var apiUrl2 = "https://api.openweathermap.org/data/2.5/onecall?lat=" + data.coord.lat + "&lon=" + data.coord.lon + "&units=imperial&exclude=hourly,minutely&appid=" + apiKey;
                fetch(apiUrl2).then(function(response) {
                    if(response.ok){
                        response.json().then(function(data){
                            console.log(data);
                            displayCityInfo(data);
                            get5Day(data);
                            displayCityName();
                        })
                    }
                })
                })
            }
            if (response.status === 400) {
                alert("bad request");
            }
        });
}


var getCity = function (event) {
    
    var cityName = document.querySelector("#city").value;
    
    // call save City to save city into local storage array
    saveCity(cityName);
    createCityEl(cityName);
    getWeather(cityName);
}

var createCityEl = function(city) {
    var cityEl = document.createElement("a");
    cityEl.setAttribute("class", "list-group-item", "href", "#");
    cityEl.textContent = (city);
    cityEl.innerHTML = "<h3>" + city +"</h3>";
    previousSearchesEl.appendChild(cityEl);
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
