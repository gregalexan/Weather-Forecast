/*JavaScript file.*/
/*Start of the API URL, missing: Lat, Lon, Product, Output.*/
var apiUrl = "http://www.7timer.info/bin/api.pl?";
/*Keeps the data sorted.*/
var map = new Map();
/*Weather Cards div from html.*/
var weather_cards = document.querySelector(".weather-cards");
/*Mapping the Images, Helps to add the appropriate image depending the weather.*/
const weather_images = {
    clear: 'clear.png',
    cloudy: 'cloudy.png',
    fog: 'fog.png',
    humid: 'humid.png',
    ishower: 'ishower.png',
    lightrain: 'lightrain.png',
    lightsnow: 'lightsnow.png',
    mcloudy: 'mcloudy.png',
    oshower: 'oshower.png',
    pcloudy: 'pcloudy.png',
    rain: 'rain.png',
    rainsnow: 'rainsnow.png',
    snow: 'snow.png',
    tsrain: 'tsrain.png',
    tstorm: 'tstorm.png',
    windy: 'windy.png'
}
/*Does everything when user selects a city.*/
document.addEventListener("DOMContentLoaded", function () {
    /*Gets all the data from html.*/
    const csvScript = document.getElementById('csvData');
    /*Extracts the text context from html script.*/
    const csvData = csvScript.textContent;
    /*Gets the rows of the csv.*/
    const csvRows = csvData.trim().split('\n');
    /*Gets the headings.*/
    const headings = csvRows[0].split(',');
    /*Gets the data of each city.*/
    const cityData = csvRows.slice(1).map(row => {
        const values = row.split(','); //spliting with ',' because it's a csv file.
        return Object.fromEntries(headings.map((header, index) => [header, values[index]]));
    });
    /*Event listener to drop down menu.*/
    var cityDropdown = document.getElementById("cityMenu");
    if (cityDropdown) {
        cityDropdown.addEventListener("click", function (e) {
            /*Checks if an item is clicked.*/
            if (e.target && e.target.nodeName == "A") {
                /*Retrives the selected city and country.*/
                var selectedCity = e.target.textContent.trim();
                var c = selectedCity.split(", "); // Splits the selection
                /*Gets the selected city.*/
                var city = c[0];
                /*Displays to Console the city.*/
                console.log("Selected City:", city);
                /*Makes visible the weather cards.*/
                document.getElementById("weather-cards-container").style.visibility = "visible";
                /*Sends the HTTP Request to get the data.*/
                sendHttpRequest(city, cityData);
            }
        });
    } else {
        console.error("Element with ID 'cityMenu' not found");
    }
});
/*Function to send the HTTP Request.*/
function sendHttpRequest(city, cityData) {
    /*Gets the Latitude of the city.*/
    var lat = findLat(city, cityData);
    /*Gets the Longitude of the city*/
    var lon = findLon(city, cityData);
    /*Updates the API Url.*/
    apiUrl = apiUrl + "lon=" + lon + "&lat=" + lat.replace("    ", "") + "&product=civillight&output=json";
    /*Sends the Request using Fetch Method.*/
    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        },
    })
    .then(response => response.json())
    .then(response => {console.log(JSON.stringify(response)); // Prints in the console the output. 
        createWeatherCards(city, response); // Creates the Weather Cards.
    });
}
/*Function to find the Latitude of a City.*/
function findLat(city, cityData) {
    /*Searches in the data for the city and stores the data for the selected.*/
    var selectedCityData = cityData.find(data => data.city.trim() === city);
    if (selectedCityData) {
        return selectedCityData.latitude.trim(); // Returns the Latitude.
    } else {
        console.log('Latitude not found');
    }
}
function findLon(city, cityData) {
    /*Searches in the data for the city and stores the data for the selected.*/
    var selectedCityData = cityData.find(data => data.city.trim() === city);
    if (selectedCityData) {
        return selectedCityData.longitude.trim; // Returns the Longitude.
    } else {
        console.log('Longitude not found');
    }
}
/*Function to Create the Weather Cards.*/
function createWeatherCards(city, data) {
    if (data && data.dataseries) {
        /*Gets the weather cards from html.*/
        const weatherCardsContainer = document.querySelector(".weather-cards");
        /*Clears the cards.*/
        weatherCardsContainer.innerHTML = '';
        /*Formats the output date so the user can understand the date. Example: 20240126 -> Friday, 26 January, 2024*/
        const formatDate = (dateString) => {
            const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
            const date = new Date(dateString.slice(0, 4), dateString.slice(4, 6) - 1, dateString.slice(6, 8));
            return date.toLocaleDateString('en-US', options);
        };
        /*Iterates through the dataseries.*/
        data.dataseries.forEach((dayData, index) => {
            /*Extracts desired data.*/
            const date = formatDate(dayData.date.toString()); // Date
            const weather = dayData.weather || 'N/A'; // Weather
            const windSpeed = dayData.wind10m_max || 'N/A'; // Wind
            const maxTemperature = dayData.temp2m.max || 'N/A'; // Max Temperature
            const minTemperature = dayData.temp2m.min || 'N/A'; // Min Temperature
            const imageSrc = weather_images[weather]; // Sets the appropriate image depending on the weather
            /*Creates a new card element.*/            
            const card = document.createElement('li');
            card.classList.add('card');
            /*Adds the information to the card.*/
            card.innerHTML = `
                <img src="images/${imageSrc}" alt="${weather}">
                <h3>${date}</h3>
                <h6>Weather: ${weather}</h6>
                <h6>Wind: ${windSpeed} M/S</h6>
                <h6>Max Temp: ${maxTemperature}°C</h6>
                <h6>Min Temp: ${minTemperature}°C</h6>
            `;
            /*Appends the card to the weather card container.*/
            weatherCardsContainer.appendChild(card);
        });
    } else {
        console.error('No data received for weather cards.');
    }
}
