/*import {Spinner} from 'dist/spin.js';*/
var urlBairrosGeoJSON = "http://dados.recife.pe.gov.br/dataset/c1f100f0-f56f-4dd4-9dcc-1aa4da28798a/resource/e43bee60-9448-4d3d-92ff-2378bc3b5b00/download/bairros.geojson";
//var urlEmpresasCSV = "http://dados.recife.pe.gov.br/api/3/action/datastore_search?resource_id=e7beb70e-6298-43b0-9917-19c1458e924c";


var urlEmpCSV = "http://dados.recife.pe.gov.br/datastore/dump/e7beb70e-6298-43b0-9917-19c1458e924c?bom=True&format=csv";

var bairroEmpresas = {}
var bairroIndex = {}
var bairrosEstatis = {}
var TradutorBairroArea = {}
var numbairros = 0 ;
var codbrr;

$.get("../arquivos/arqbairros.json", function(data){
    //console.log(data)
    var superHeroes = data;
    bairrosEstatis = superHeroes["bairros"];
    //console.log(data)

    for(var i = 0; i < 94; i++){
        TradutorBairroArea[bairrosEstatis[i].CBAIRRCODI] = bairrosEstatis[i].Areakm2;                    
    }
});

/*$.ajax({
    type: "GET",
    url: 'arquivos/arqbairros.json',
    dataType: 'json'
}).done(function (data) {
    console.log(data)
    var superHeroesText = arqbairros; // get the string from the response
    var superHeroes = JSON.parse(superHeroesText); // convert it to an object
    //var linhas = superHeroesText.split(/\r\n|\n/);
    //var abc = superHeroesText.split(",{")
    bairrosEstatis = superHeroes["bairros"];
    console.log(data)

    for(var i = 0; i < 94; i++){
        TradutorBairroArea[bairrosEstatis[i].CBAIRRCODI] = bairrosEstatis[i].Areakm2;                    
    }
})*/

/*var requestURL = 'arquivos/arqbairros.json';
var request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'text'; // now we're getting a string!
request.send();

request.onload = function() {
    console.log(request.response)
    var superHeroesText = request.response; // get the string from the response
    var superHeroes = JSON.parse(superHeroesText); // convert it to an object
    //var linhas = superHeroesText.split(/\r\n|\n/);
    //var abc = superHeroesText.split(",{")
    bairrosEstatis = superHeroes["bairros"];

    for(var i = 0; i < 94; i++){
        TradutorBairroArea[bairrosEstatis[i].CBAIRRCODI] = bairrosEstatis[i].Areakm2;                    
    }
    //console.log(superHeroes);
}*/

var urlEmpresasCSV = {
    resource_id: 'e7beb70e-6298-43b0-9917-19c1458e924c' // the resource id
    //limit: 10000 // get 5 results
    //q: 'Prefeitura' // query for 'jones'
};
var bairro;
$.support.cors = true;
$.getJSON(urlBairrosGeoJSON, function(data) {
    //console.log(data);
    var bairro2 = L.geoJson(data);
    //console.log(bairro2);
    numbairros = data.features.length;
    //pegar os indices dos bairros;
    //var dados = data.features;
    var tam = data.features.length;
    var desblock = 0;
    for(var j = 0; j < tam; j++){
        if(j == tam-1){
            desblock = 1;
        }
        funcaoEmpresas(data.features[j].properties.bairro_codigo, desblock);
    }
    
    //funcaoEmpresas(bairro2);
});
function funcaoEmpresas(codigo, lck){
    $(document).ready(function() {
        // AJAX in the data file
        var string = '{"cod_bairro":' + codigo + '}';
        urlEmpresasCSV = {
            resource_id: 'e7beb70e-6298-43b0-9917-19c1458e924c', // the resource id
            limit: 1, // get 5 results
            filters: string // query for 'jones'
        };
        $.ajax({
            type: "GET",
            url: 'http://dados.recife.pe.gov.br/api/3/action/datastore_search',
            data: urlEmpresasCSV,
            dataType: "json",
            success: function(data) {
                total = data.result.total;
                bairroEmpresas[codigo] = total;
                if(lck == 1){
                    $.getJSON(urlBairrosGeoJSON, function(data) {
                        //console.log(data);
                        bairro = L.geoJson(data, {
                            style: style,
                            onEachFeature: onEachFeature    
                        }).addTo(map);
                        map.spin(false);
                    });
                }
            }
        });  
        });

}


var map = L.map(document.getElementById('mapid'), {
center: [-8.0525, -34.921],
zoom: 13
});

var cartodbAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>';

var positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: cartodbAttribution
}).addTo(map);
var myStyle = {
    "color": "#ff7800",
    "weight": 5,
    "opacity": 0.65
};
map.spin(true,  {lines: 13, length: 20, width: 6, // The line thickness
    radius:25,
    scale: 1, // Scales overall size of the spinner
    corners: 0.5, // Corner roundness (0..1)
    speed: 1.4, // Rounds per second
    rotate: 0, // The rotation offset
    animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#FC4E2A', // CSS color or array of colors
    fadeColor: 'transparent', // CSS color or array of colors
    top: '50%', // Top position relative to parent
    left: '50%', // Left position relative to parent
    shadow: '0 0 0px transparent', // Box-shadow for the lines
    zIndex: 20000});

function getColor(d) {
    return d > 1000 ? '#800026' :
        d > 500  ? '#BD0026' :
        d > 200  ? '#E31A1C' :
        d > 100  ? '#FC4E2A' :
        d > 50   ? '#FD8D3C' :
        d > 20   ? '#FEB24C' :
        d > 10   ? '#FED976' :
                    '#FFEDA0';
}

function style(feature) {
    return {
        //fillColor: getColor(feature.properties.NUMPOINTS),
        fillColor: getColor(bairroEmpresas[feature.properties.bairro_codigo]),
        weight: 2,
        opacity: 0.5,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.5
    };
}

function highlightFeature(e) {
    var layer = e.target;
    
    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties);
}

function resetHighlight(e) {
    bairro.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
    //console.log(layer);
}

//bairro.addTo(map);

function funcbairroempresas(codigo){
    if(bairroEmpresas[codigo] != undefined){
        return bairroEmpresas[codigo];
    }else{
        return "Mensagem aleatoria";
    }
}

function calculaArea(codigo){
    if(TradutorBairroArea[codigo] == undefined){
        return "Ainda não foi calculado";
    }else{
        return TradutorBairroArea[codigo];
    }
}

function calculaDensidade(codigo){
    var valor = bairroEmpresas[codigo];
    var area = TradutorBairroArea[codigo];
    if(valor != undefined && area != undefined){
        return valor/area;
    }else{
        return "Ainda não foi calculado"
    }
}

var info = L.control();
info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

info.update = function (props) {
    this._div.innerHTML = '<h4>Densidade de Empresas por bairro no recife</h4>' +  (props ?
        '<b>' + props.bairro_nome + '</b><br />' + calculaArea(props.bairro_codigo) + ' km<sup>2</sup> : ' + funcbairroempresas(props.bairro_codigo) + 
        ' Empresas,  <br/> Densidade de empresas: ' + (calculaDensidade(props.bairro_codigo)).toLocaleString('pt-BR') + ' por km<sup>2</sup>' 
        : 'Selecione um bairro');
};

//emp.addTo(map);
info.addTo(map);

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 10, 20, 50, 100, 200, 500, 1000],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);