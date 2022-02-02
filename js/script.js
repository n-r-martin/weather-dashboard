const searchBtn = $('#city-search-btn');
const cityInput = $('#city-input');
const cityElement = $('#city-name');


const tempElement = $('#temp-value');
const windElement = $('#wind-value');
const humidityElement = $('#humidity-value');
const uvIndexElement = $('#uv-index-value');

var apiKey = config.apiKey;

function updateCity(){
    let city = cityInput.val();
    let geoCodeApiUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&appid=' + apiKey;
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

    let oneCallUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + long + '&units=imperial&appid=' + apiKey;
    
    fetch(oneCallUrl)
        .then( function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);

            

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

  searchBtn.on('click', function (event) {
      event.preventDefault();
      updateCity();
  })


  