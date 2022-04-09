var apiKey = "2fba4a1671bedcc3d7eb87766d0af9e8";
var storedCities = localStorage.getItem("cities");
var searchedCities = document.getElementById("cityResults");

document.getElementById("searchForm").addEventListener("submit", function(event) {
    event.preventDefault();
    var city = document.getElementById("cityInput").value;
    var storedCities = localStorage.getItem("cities");
    var li = document.createElement('li');
    // clear out input field
    document.getElementById("cityInput").value = '';

    //create a li item displaying the most recent search
    li.innerText = city;
    searchedCities.appendChild(li);

    //save items to localstorage
    if (!storedCities) {
        localStorage.setItem("cities", JSON.stringify([{city: city}]));
        return;
    }
    storedCities = JSON.parse(storedCities);
    storedCities.push({city: city});
    localStorage.setItem("cities", JSON.stringify(storedCities));
});

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

displaySearches();

//get coordinates of searched city
// function getLocation(city)