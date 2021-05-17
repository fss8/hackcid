var muxiIconProperties = {
    iconUrl: "img/imgbikexs2.png", 
    iconSize: [50, 50]
    };

var muxiIcon = L.icon(muxiIconProperties);

var estbike = {}
var bike = 0
var malhaciclo;
var rotaoperacional;
//var faixaazul;
var trail, cic2, faixbus = 0;
var modobike = false;

var BikesAr = {
    "type": "FeatureCollection",
    "name": "BikesAr",
    "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
    "features": []
}

var dados = {
  resource_id: 'e6e4ac72-ff15-4c5a-b149-a1943386c031' // the resource id
  //limit: 5 // get 5 results
  //q: 'Prefeitura' // query for 'jones'
};

$(document).ready(function() {

    /*.getJSON({
        url: 'http://dados.recife.pe.gov.br/dataset/60d87881-2fbe-42b0-89b7-b079a4e9a737/resource/991dc857-e152-46fb-924b-e8a34351a726/download/faixaazul.geojson',
        //data: data,
        success: function(data) {
            faixaazul = data;
        }
    });*/

    $.getJSON({
        url: 'http://dados.recife.pe.gov.br/dataset/667cb4cf-fc93-4687-bb8f-431550eeb2db/resource/095843ff-cfbb-46c8-88ad-b3e9d20f9229/download/rotasoperacionais.geojson',
    }).done(function (data) {

    rotaoperacional = data;

    $.getJSON({
        url: 'http://dados.recife.pe.gov.br/dataset/667cb4cf-fc93-4687-bb8f-431550eeb2db/resource/a76b2f7a-1431-4db6-ac13-d4c6afd43d01/download/qualquenome.geojson',
        //data: data,
        success: function(data) {
            //console.log(data)
            //console.log(malha)
            malhaciclo = data;

            dados = {
                resource_id: 'e6e4ac72-ff15-4c5a-b149-a1943386c031' // the resource id
                //limit: 5 // get 5 results
                //q: 'Prefeitura' // query for 'jones'
            };

            $.ajax({
                type: "GET",
                url: 'http://dados.recife.pe.gov.br/api/3/action/datastore_search',
                data: dados,
                dataType: 'json',
                success: function(data) {
                    //console.log(data)
                    estbike = data.result.records
                    //console.log(estbike)
                    tamanho = estbike.length
                    var j = 0
                    var objeto = {}
                    //console.log(bikes.features)
                    for (j=0; j<tamanho; j++) {
                        objeto = {
                        "type": 'Feature',
                        "properties": {
                                "Id": estbike[j]._id,
                                "Nome": estbike[j].nome,
                                "Localizacao": estbike[j].localizacao,
                                "Capacidade": estbike[j].capacidade
                            },
                        "geometry": {
                            "type":'Point',
                            "coordinates": [ estbike[j].lon , estbike[j].lat, 0.0]
                            }
                        }
                        //console.log(bikes)
                        BikesAr["features"].push(objeto)
                        

                    }
                    //bikes.features
                    //console.log(BikesAr)

                    /*L.geoJSON(bikerr, {
                        color: 'ff0000',
                        weight: 1,
                        opacity: 1
                    }).addTo(map);*/
                    //console.log(EstacoesBikePE)
                    //console.log(BikesAr)
                    var bike = L.geoJSON(BikesAr, 
                      {pointToLayer: function(feature, latlng){
                          return L.marker(latlng, {icon: muxiIcon});
                      },
                      onEachFeature: function( feature, layer){
                          var nomeest = feature.properties.Nome;
                          var local = feature.properties.Localizacao
                          var capacidade = feature.properties.Capacidade
                          layer.bindPopup('Estação Bike PE: ' +
                                          nomeest + 
                                         '<br/> ' +  'Localização: ' +  local 
                                         + '<br/> ' +  'Capacidade: ' + capacidade + ' bicicleta(s)');
                          layer.on('mouseover', function() {layer.openPopup();});
                          layer.on('mouseout', function() {layer.closePopup();});
                      }
                     });

                     var markers = L.markerClusterGroup(
                        { 
                            spiderfyOnMaxZoom : false , 
                            showCoverageOnHover : false , 
                            zoomToBoundsOnClick : false,
                            removeOutsideVisibleBounds: true,
                            //singleMarkerMode:true
                            maxClusterRadius: 60,
                            chunkedLoading: true
                        }
                    );
                    markers.addLayer(bike);
                    map.addLayer(markers);
                    map.spin(false)
                    //bike.addTo(map);

                    //trail.addTo(map);

                    trail = L.geoJSON(malhaciclo, {
                        color: '#0f0000',
                        weight: 3,
                        opacity: 1,
                        dashArray: '12 8 12',
                    });

                    cic2 = L.geoJSON(rotaoperacional, {
                        color: '#0000ff',
                        weight: 3,
                        opacity: 1,
                        dashArray: '12 8 12',
                    });

                    /*faixbus = L.geoJSON(faixaazul, {
                        color: '#0000ff',
                        weight: 2,
                        opacity: 0.55,
                    });*/
                    var overlays = {
                        'Rede Cicloviária': trail,
                        'Ciclovias Operacionais': cic2
                        //'Rotas a implementar - PDC': aimplementar,
                        //'Rotas a implementar - Complementar': aimplementar2,
                        //'Faixa Azul': faixaazul, 
                    };
                    L.control.layers(baselayers, overlays).addTo(map);

                    //console.log(estbike)
                }
            });
            //trail.addTo(map);
        }
    });

    });
});
//var map = L.map('mapid').setView([-8.0525, -34.921], 13);

var map = L.map(document.getElementById('mapid'), {
center: [-8.0525, -34.921],
zoom: 13,
minZoom: 2,
maxZoom: 17
});

var baserelief = L.tileLayer('https://tile.opentopomap.org/{z}/{x}/{y}.png', {});
//baserelief.addTo(map);
map.attributionControl.addAttribution('OpenTopoMap');

var mapa2 = L.esri.basemapLayer('Streets');
mapa2.addTo(map)

/*document.getElementById('btn-spin').onclick = function () {
    console.log("clicado")
    //setTimeout(function() {map.spin(false);}, 3000);
};*/

map.spin(true,  {lines: 13, length: 20, width: 6, // The line thickness
    radius:25,
    scale: 1, // Scales overall size of the spinner
    corners: 0.5, // Corner roundness (0..1)
    speed: 1.4, // Rounds per second
    rotate: 0, // The rotation offset
    animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#FFFFFF', // CSS color or array of colors
    fadeColor: 'transparent', // CSS color or array of colors
    top: '50%', // Top position relative to parent
    left: '50%', // Left position relative to parent
    shadow: '0 0 0px transparent', // Box-shadow for the lines
    zIndex: 20000});

var coordDIV = document.createElement('div');
coordDIV.id = 'mapCoordDIV';
coordDIV.style.position = 'absolute';
coordDIV.style.bottom = '1px';
coordDIV.style.left = '150px';
coordDIV.style.zIndex = '900';
coordDIV.style.color = '#404040';
coordDIV.style.fontFamily = 'Georgia';
coordDIV.style.fontSize = '10pt';
coordDIV.style.backgroundColor = '#fff';

document.getElementById('mapid').appendChild(coordDIV);

// Setup the event to capture and display mouse movements
map.on('mousemove', function(e){
    var lat = e.latlng.lat.toFixed(3);
    var lon = e.latlng.lng.toFixed(3);
    document.getElementById('mapCoordDIV').innerHTML = lat + ' , ' + lon;
});

var baselayers = {
    'Esri Streets': mapa2,
    'Shared Relief': baserelief
};

// Add scalebar

var scale = L.control.scale()
scale.addTo(map)