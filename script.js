console.log("I'm in");
var apiKey = "2fba4a1671bedcc3d7eb87766d0af9e8";


document.getElementById("searchForm").addEventListener("submit", function(event) {
    event.preventDefault();
    var city = document.getElementById("cityInput").value;
    document.getElementById("cityInput").value = '';

    var storedCities = localStorage.getItem("cities");
    if (!storedCities) {
        console.log("yeah");
        localStorage.setItem("cities", JSON.stringify([{city: city}]));
        return;
    }
    storedCities = JSON.parse(storedCities);
    console.log (storedCities);
    storedCities.push({city: city});
    console.log(storedCities);
    localStorage.setItem("cities", JSON.stringify(storedCities));

})