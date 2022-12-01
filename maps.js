
    mapboxgl.accessToken = mapboxKey;
    const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: [-98.4916, 29.4252], // starting position [lng, lat]
    zoom: 9, // starting zoom
});

    $.get("http://api.openweathermap.org/data/2.5/weather", {
    APPID: weatherKey,
    q:     "San Antonio, US",
    units: 'imperial'
}).done(function(data) {
    console.log(data);
    console.log(`humidity is ${data.main.humidity}`);
    $('.container-1').append(`<p>Humidity: ${data.main.humidity}%</p>`);
    $('.container-1').append(`<p>Wind Speed: ${data.wind.speed} mph</p>`);
    $('.container-1').append(`<p>Pressure: ${data.main.pressure} h/Pa</p>`);
}).then($.get("http://api.openweathermap.org/data/2.5/forecast", {
    APPID: weatherKey,
    q: "San Antonio, US",
    units: 'imperial'
}).done(function(data){
    console.log(data);
    console.log(data.list[3].main.temp_max);
    $('.container-1').append(`<p>High: ${data.list[3].main.temp_max}<span>&#176;</span></p>`);

}));

