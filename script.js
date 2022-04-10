var apiKey = "2fba4a1671bedcc3d7eb87766d0af9e8";
var storedCities = localStorage.getItem("cities");
var searchedCities = document.getElementById("cityResults");

document.getElementById("searchForm").addEventListener("submit", function(event) {
    event.preventDefault();
    document.getElementById("currentData").innerHTML="";
    var city = document.getElementById("cityInput").value;
    var storedCities = localStorage.getItem("cities");
    var li = document.createElement('li');
    // clear out input field
    document.getElementById("cityInput").value = '';

    //create a li item displaying the most recent search
    li.innerText = city;
    searchedCities.appendChild(li);

    getLocation(city);

    //save items to localstorage
    if (!storedCities) {
        localStorage.setItem("cities", JSON.stringify([{city: city}]));
        return;
    }
    storedCities = JSON.parse(storedCities);
    storedCities.push({city: city});
    localStorage.setItem("cities", JSON.stringify(storedCities));

});

document.getElementById("cityResults").addEventListener("click", function(event){
    var city = event.target.innerText;
    document.getElementById("currentData").innerHTML="";
    getLocation(city);
})

// display previous searches on page load
function displaySearches() {
    storedCities = JSON.parse(storedCities);
    if (storedCities) {
        for (var i=0; i<storedCities.length; i++) {
            var li = document.createElement('li');
            li.innerText = storedCities[i].city;
            searchedCities.appendChild(li);
        }
    }
};

//get coordinates of searched city
function getLocation(city) {
    var locationUrl = "https://api.openweathermap.org/geo/1.0/direct?q="+ city + "&limit=1&appid=" + apiKey;
    fetch(locationUrl)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        if (data.length !== 0) {
            var lat = data[0].lat;
            var lon = data[0].lon;
            var weatherUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="+ lat +"&lon="+ lon +"&exclude=minutely,hourly,alerts&appid=" + apiKey + "&units=imperial";
            getWeather(weatherUrl, city);
        } else {
            alert("City not found. Please try another search");
        }
    })
};

function getWeather(weatherUrl, city) {
    fetch(weatherUrl)
    .then(function(response){
        return response.json();
    })
    .then(function(data) {
        var date = moment().format("MMMM DD, YYYY");
        var temperature = data.current.temp;
        var humidity = data.current.humidity;
        var wind = data.current.wind_speed;
        var uvi = data.current.uvi;
        var icon = data.current.weather[0];
        var currentBox = document.getElementById('currentData');
        document.getElementById('cityName').textContent = city + " (" + date + ")";
        //append temp to current data list
        var temp = document.createElement('li');
        temp.textContent = "Temp: " + temperature + "\u00B0F"
        currentBox.appendChild(temp);
        //append wind to current data
        var windSpeed = document.createElement('li');
        windSpeed.textContent = "Wind: " + wind + " MPH";
        currentBox.appendChild(windSpeed);
        //append humidity to current data
        var hum = document.createElement('li');
        hum.textContent = "Humidity: " + humidity + "%";
        currentBox.appendChild(hum);
        //append UV to current data
        var uvIndex = document.createElement('li');
        uvIndex.innerHTML = "UV Index: <span id='test'> " + uvi + " </span>";
        var test = uvIndex.querySelector("span");
        if (uvi > 5) {
            test.style.backgroundColor = "red";
            test.style.color = "white";
        } else if (uvi > 2) {
            test.style.backgroundColor = "yellow";
        } else {
            test.style.backgroundColor = "green";
            test.style.color = "white";
        }
        currentBox.appendChild(uvIndex);
        //calls 5 day forecast function
        futureWeather(data);
    })
};

//get 5 day forecast
function futureWeather(data) {
    console.log("we in");
    var forecast = data.daily;
    var futureBox = document.getElementById("fiveDays");
    //clear out previous data
    futureBox.innerHTML = "";
    console.log(forecast);
    for (var i=1; i<6; i++) {
        var card = document.createElement("div");
        card.setAttribute("class", "card");
        var futureDate = document.createElement("h4");
        var futureTemp = document.createElement("p");
        var futureWind = document.createElement("p");
        var futureHum = document.createElement("p");
        futureDate.innerText = moment().add(i, 'd').format("MM DD, YYYY");
        console.log(forecast[i].temp.day);
        futureTemp.innerText = "Temp: " + forecast[i].temp.day;
        futureWind.innerText = "Wind: " + forecast[i].wind_speed + " MPH";
        futureHum.innerText = "Humidity: " + forecast[i].humidity + "%";
        card.appendChild(futureDate);
        card.appendChild(futureTemp);
        card.appendChild(futureWind);
        card.appendChild(futureHum);
        //appends entire card to 5 day forecast section
        futureBox.appendChild(card);
    }
    
}

//call standalone functions
displaySearches();