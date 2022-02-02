const apiKey = '7f18634c0f8ab52c9c31e83595e4f3b8';
let city = 'denver';

const apiUrl = 'api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey;



fetch(apiUrl)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
  });