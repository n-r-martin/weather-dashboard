const searchBtn = $('#city-search-btn');
const cityInput = $('#city-input');

const apiKey = '7f18634c0f8ab52c9c31e83595e4f3b8';


function updateCity(){
    let city = cityInput.val();
    let geoCodeApiUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&appid=' + apiKey;
    fetch(geoCodeApiUrl)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);

    let lat = data[0].lat;
    let long = data[0].lon;
    console.log(lat);
    console.log(long);

    let oneCallUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + long + '&appid=' + apiKey;
    
    fetch(oneCallUrl)
        .then( function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
        })
  });
}

  searchBtn.on('click', function (event) {
      event.preventDefault();
      updateCity();
  })


  