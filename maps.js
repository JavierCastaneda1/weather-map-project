GetWeatherMap("dallas tx");

function GetWeatherMap(address){
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
        style: 'mapbox://styles/mapbox/streets-v12', // style URL
        center: [0,0], // starting position [lng, lat]
        zoom: 9, // starting zoom
    });
    geocode(address, mapboxKey).then(function(result) {
        console.log(result);
        map.setCenter(result);
        map.setZoom(20);
        lonG = result[0];
        latG = result[1];
        return result;
    }).then(function(result){

        placeMarkerAndPopup(address, mapboxKey, map);

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
            // console.log(data.list[3].main.temp_max);
            // $('#container-1').append(`<p>Low: ${data.list[3].main.temp_min}<span>&#176;</span></p>`);
            // $('#container-1').append(`<p>High: ${data.list[3].main.temp_max}<span>&#176;</span></p>`);
            // let counter = 0;
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



function placeMarkerAndPopup(info, token, map) {
    geocode(info, token).then(function(coordinates) {
        var popup = new mapboxgl.Popup()
        var marker = new mapboxgl.Marker({
            draggable: true
        })
            .setLngLat(coordinates)
            .addTo(map)
            .setPopup(popup);
        popup.addTo(map);
    });
}






