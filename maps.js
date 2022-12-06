GetWeatherMap("dallas tx");

let gMarker;

function GetWeatherMap(address){
    console.log(address);
    $('#container-1').empty();
    $('#container-2').empty();
    $('#container-3').empty();
    $('#container-4').empty();
    $('#container-5').empty();
    let lonG;
    let latG;
    mapboxgl.accessToken = mapboxKey;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/outdoors-v11', // style URL
        center: [0,0], // starting position [lng, lat]
        zoom: 9, // starting zoom
    });
    geocode(address, mapboxKey).then(function(result) {
        console.log(result);
        map.setCenter(result);
        map.setZoom(10);
        lonG = result[0];
        latG = result[1];
        return result;
    }).then(function(result){

        const marker = new mapboxgl.Marker({
            draggable: true
        })
            .setLngLat([result[0], result[1]])
            .addTo(map);
        gMarker = marker;
        gMarker.on('dragend', onDragEnd);

    }).then(function(){
        $.get("http://api.openweathermap.org/data/2.5/weather", {
            APPID: weatherKey,
            lat: latG,
            lon: lonG,
            units: 'imperial'
        }).done(function(data) {
            console.log(data);
            console.log(`humidity is ${data.main.humidity}`);
            $('#container-1').append(`<p>Humidity: ${data.main.humidity}%</p>`);
            $('#container-1').append(`<p>Wind Speed: ${data.wind.speed} mph</p>`);
            $('#container-1').append(`<p>Pressure: ${data.main.pressure} h/Pa</p>`);
            $('#container-1').append(`<p>Low: ${data.main.temp_min} <span>&#176;</span></p>`);
            $('#container-1').append(`<p>High: ${data.main.temp_max} <span>&#176;</span></p>`);
        }).then($.get("http://api.openweathermap.org/data/2.5/forecast", {
            APPID: weatherKey,
            lat: latG,
            lon: lonG,
            units: 'imperial'
        }).done(function(data){
            console.log(data);
            let count = 2
            let checker = true;
            while (count <= 5){
                for (let i = 0 ; i < data.list.length; i++){
                    if (checker){
                        if (data.list[i].dt_txt.includes("00:00:00")){
                            checker = false;
                        }
                    }
                    else if (data.list[i].dt_txt.includes("12:00:00")){
                        $(`#container-${count}`).append(`<p>Humidity: ${data.list[i].main.humidity}%</p>`);
                        $(`#container-${count}`).append(`<p>Wind Speed: ${data.list[i].wind.speed} mph</p>`);
                        $(`#container-${count}`).append(`<p>Pressure: ${data.list[i].main.pressure} h/Pa</p>`);
                        $(`#container-${count}`).append(`<p>Low: ${data.list[i].main.temp_min}<span>&#176;</span></p>`);
                        $(`#container-${count}`).append(`<p>High: ${data.list[i].main.temp_max}<span>&#176;</span></p>`);

                        count ++;
                    }
                }
            }
        }));
    })
}

    function onDragEnd() {
        const lngLat = gMarker.getLngLat();
        console.log(lngLat.lng, lngLat.lat);
        reverseGeocode(lngLat, mapboxKey).then(function(r){
            GetWeatherMap(r,weatherKey);
        })
    }

function reverseGeocode(coordinates, token) {
    var baseUrl = 'https://api.mapbox.com';
    var endPoint = '/geocoding/v5/mapbox.places/';
    return fetch(baseUrl + endPoint + coordinates.lng + "," + coordinates.lat + '.json' + "?" + 'access_token=' + token)
        .then(function(res) {
            return res.json();
        })
        // to get all the data from the request, comment out the following three lines...
        .then(function(data) {
            return data.features[0].place_name;
        })
}

    $("#btnSearch").click(function(){
    GetWeatherMap($(`#locaSearch`).val());

});
    $('#locaSearch').keyup(function(e){
    if (e.key === 'Enter') {
    GetWeatherMap($(`#locaSearch`).val());
}});











