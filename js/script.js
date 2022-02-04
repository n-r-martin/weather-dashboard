///// VARIABLES /////

const searchBtn = $('#city-search-btn');
const cityInput = $('#city-input');
const cityElement = $('#city-name');
const recentCitiesList = $('#recent-cities-list');

const todayDate = $('#today-date');
const currentDate = new Date().toJSON().slice(0, 10).replace(/-/g, '/');
todayDate.text(currentDate);

const todayWeatherIcon = $('#today-weather-icon');
const currentWeatherIcon = document.createElement('img');

const tempElement = $('#temp-value');
const windElement = $('#wind-value');
const humidityElement = $('#humidity-value');
const uvIndexElement = $('#uv-index-value');

var apiKey = '7f18634c0f8ab52c9c31e83595e4f3b8';

let recentCities = [];


///// FUNCTIONS /////

function init() {
    // Checking to see if the key already exists, if not, set an empty array converted to a string to localstorage
    if (localStorage.getItem('recentCities') === null) {
        localStorage.setItem('recentCities', JSON.stringify(recentCities));
    };

    // Immediately parse that array so we can push to it as cities are searched
    recentCities = JSON.parse(localStorage.getItem('recentCities'));

    // If there are any cities that have been pulled down from localStorage, run the function to append a button for each
    updateRecentsUI(recentCities);
}

// This function run when either a city is searched for via the input, or when a recent city button has been clicked
function updateCity() {
    let city = cityInput.val();
    let geoCodeApiUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&appid=' + apiKey;
    fetch(geoCodeApiUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);

            cityElement.text(data[0].name);

            let lat = data[0].lat;
            let long = data[0].lon;
            console.log(lat);
            console.log(long);

            // If the city entered does not already exist in the recentCities array, push that city to the array
            if (recentCities.includes(city) === false) {
                recentCities.push(city);
            }

            // Uodating the recentCities array in localStorage
            localStorage.setItem('recentCities', JSON.stringify(recentCities));

            updateRecentsUI(recentCities);

            // Setting the API URL with the coordinates extracted from the geoCode API call
            let oneCallUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + long + '&units=imperial&appid=' + apiKey;

            // Fetching data with the oneCall API with lat & long coordinates entered in the URL defined above
            fetch(oneCallUrl)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data);

                    todayWeatherIcon.remove(currentWeatherIcon);
                    let iconcode = data.current.weather[0].icon;
                    iconUrl = "http://openweathermap.org/img/w/" + iconcode + ".png";

                    currentWeatherIcon.src = iconUrl

                    todayWeatherIcon.append(currentWeatherIcon);

                    tempElement.text(data.current.temp + ' \u00B0F');
                    windElement.text(data.current.wind_speed + ' mph');
                    humidityElement.text(data.current.humidity + ' %');
                    uvIndexElement.text(data.current.uvi);

                    if (data.current.uvi <= 2) {
                        uvIndexElement.attr('class', 'low-risk');
                    } else if (data.current.uvi > 2 && data.current.uvi < 5) {
                        uvIndexElement.attr('class', 'moderate-risk');
                    } else if (data.current.uvi > 5) {
                        uvIndexElement.attr('class', 'high-risk');
                    }
                })
        });
}

// Function to create buttons for each city that exists in the recent cities array
function updateRecentsUI(array) {
    recentCitiesList.empty();

    for (let i = 0; i < array.length; i++) {
        let recentCityItem = document.createElement('li');
        let recentCityButton = document.createElement('button');
        recentCityButton.classList.add('btn');
        recentCityButton.classList.add('btn-info');
        recentCityButton.textContent = array[i];

        recentCityItem.append(recentCityButton);
        recentCitiesList.append(recentCityItem);
    }
}



///// APPLICATION GO BRRRRRR >>>>>>
init();



///// EVENT LISTENERS /////

// Event listener for the search button
searchBtn.on('click', function (event) {
    event.preventDefault();
    updateCity();
});

// Adding an event listener for buttons that are not yet recognized by the DOM
// This way we can listen for clicks on the recent cities buttons
// JavaScript dark magic
document.addEventListener('click', recentCityListener);

function recentCityListener(event) {
    var element = event.target;
    if (element.tagName == 'BUTTON' && element.classList.contains("btn-info")) {
        console.log("hi");
        cityInput.val(element.textContent);
        updateCity();
    }
}