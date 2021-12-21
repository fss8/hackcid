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


    $.getJSON({
        url: 'http://dados.recife.pe.gov.br/dataset/ca9c19af-03f8-426f-ac0b-afec82a28533/resource/de34c4c7-f8cb-42f5-b5fe-bf5e9a99cdd9/download/parquespracas.geojson',
        //data: data,
        success: function(data) {
            parquesepracas = data;
            //console.log(parquesepracas)

            $.getJSON({
                url: 'http://dados.recife.pe.gov.br/dataset/e599f7cc-e441-4950-9314-8fdf3952b96f/resource/4206f194-0c86-4bd1-92fa-20a040adf6af/download/equipamentos-publicos.geojson',
                //data: data,
                success: function(data) {
                    equippublicos = data;
                    //console.log(equippublicos)

                    $.getJSON({
                        url: 'http://dados.recife.pe.gov.br/dataset/e599f7cc-e441-4950-9314-8fdf3952b96f/resource/a74a444f-0b15-4827-8ea8-4e87168a57e2/download/equipamentos-publicos-prefeitura-recife.geojson',
                        //data: data,
                        success: function(data) {
                            equipprefeitura = data;
                            //console.log(equipprefeitura)

                            $.getJSON({
                                url: 'http://dados.recife.pe.gov.br/dataset/08a65119-e0a1-4e70-9276-b975034980a0/resource/b309d41b-6eb2-4bdd-af6e-581be5f8e239/download/saudemunicipalestadual.geojson',
                                //data: data,
                                success: function(data) {
                                    equipsaude = data;
                                    //console.log(equipsaude)

                                    $.getJSON({
                                        url: 'http://dados.recife.pe.gov.br/dataset/4d3a3b39-9ea9-46ed-bf21-a2670de519c1/resource/41f377fc-8b36-4115-acbc-0f4645f7a6ff/download/educacaomunicipal.geojson',
                                        //data: data,
                                        success: function(data) {
                                            escolasmunicipais = data;
                                            //console.log(escolasmunicipais)

                                            
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
                                                            //markers.addTo(map);
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
                                        
                                                            parks = L.geoJSON(parquesepracas, {
                                                                color: '#008000',
                                                                weight: 3,
                                                                opacity: 1,
                                                                //dashArray: '12 8 12',
                                                                onEachFeature: function( feature, layer){
                                                                    var tipodepraca = feature.properties.CDTIPO;
                                                                    var nomelocal = feature.properties.NMNOME;
                                                                    var enderecopraca = feature.properties.ED;
                                                                    var nomebairro = feature.properties.NOMEBAIRR
                                                                    var capacidade = feature.properties.AREA
                                                                    var perimetro = feature.properties.PERIMETER
                                                                    layer.bindPopup(
                                                                                tipodepraca + ' - ' + print(nomelocal) +
                                                                                   '<br/> ' +  'Localização: ' +  enderecopraca + ' - ' +  nomebairro 
                                                                                   + '<br/> ' +  'Espaço: ' + (capacidade.toFixed(0)) + 'm<sup>2</sup>' + (perimetro!=undefined ? ' Perímetro: ' + (perimetro).toFixed(0) + 'm' : ' ') );
                                                                    layer.on('mouseover', function() {layer.openPopup();});
                                                                    layer.on('mouseout', function() {layer.closePopup();});
                                                                }
                                                            }).addTo(map)
                                                            eqpubli = L.geoJSON(equippublicos, {
                                                                color: '#0b00b0',
                                                                weight: 3,
                                                                opacity: 1,
                                                                //dashArray: '12 8 12',
                                                                onEachFeature: function( feature, layer){
                                                                    
                                                                    var predio = feature.properties.NOME
                                                                    layer.bindPopup(
                                                                                'Prédio: ' + ' - ' + print(predio) );
                                                                    layer.on('mouseover', function() {layer.openPopup();});
                                                                    layer.on('mouseout', function() {layer.closePopup();});
                                                                }
                                                            }).addTo(map)
                                                            eqpref = L.geoJSON(equipprefeitura, {
                                                                color: '#0b00b0',
                                                                weight: 3,
                                                                opacity: 1,
                                                                //dashArray: '12 8 12',
                                                                onEachFeature: function( feature, layer){
                                                                    
                                                                    var predio = feature.properties.NOME
                                                                    layer.bindPopup(
                                                                                'Prédio: ' + ' - ' + print(predio) );
                                                                    layer.on('mouseover', function() {layer.openPopup();});
                                                                    layer.on('mouseout', function() {layer.closePopup();});
                                                                }
                                                            }).addTo(map);
                                                            eqsaude = L.geoJSON(equipsaude, {
                                                                color: '#ff00bf',
                                                                weight: 3,
                                                                opacity: 1,
                                                                //dashArray: '12 8 12',
                                                                onEachFeature: function( feature, layer){
                                                                    
                                                                    var nome = feature.properties.NMUNIDAD
                                                                    var tipo = feature.properties.CDTIPO
                                                                    var endereco = feature.properties.NMENDUNID
                                                                    layer.bindPopup(
                                                                                '' + ' - ' + print(nome)  +
                                                                                '<br/> ' + print(tipo) +
                                                                                '<br/> ' + 'Endereço: ' + endereco );
                                                                    layer.on('mouseover', function() {layer.openPopup();});
                                                                    layer.on('mouseout', function() {layer.closePopup();});
                                                                }
                                                            }).addTo(map);
                                                            escolasmuni = L.geoJSON(escolasmunicipais, {
                                                                color: '#f00f00',
                                                                weight: 3,
                                                                opacity: 1,
                                                                //dashArray: '12 8 12',
                                                                onEachFeature: function( feature, layer){
                                                                    
                                                                    var nome = feature.properties.escola_nome
                                                                    var endereco = feature.properties.endereco
                                                                    var qtdalunos = feature.properties.qtd_atendidos
                                                                    //var programa = feature.properties.prog
                                                                    var biblioteca = feature.properties.existe_biblioteca
                                                                    var quadra = feature.properties.existe_quadra
                                                                    var laboratioinfo = feature.properties.laboratorio_informatica
                                                                    var atendimespecial = feature.properties.atendimento_especial
                                                                    layer.bindPopup(
                                                                                'Escola' + ' - ' + print(nome)  +
                                                                                '<br/> ' + 'Endereço: ' + print(endereco) +
                                                                                '<br/> ' + 'Quantidade de Alunos: ' + print(qtdalunos) +
                                                                                '<br/> ' + 'Recursos:' + 'Atendimento especial - ' + print(atendimespecial) +
                                                                                '<br/> ' + 'Possui:' + 'biblioteca - ' + print(biblioteca) + ', quadra: ' + print(quadra) +
                                                                                '<br/> ' + 'Laboratório de Informática: ' + print(laboratioinfo) );
                                                                    layer.on('mouseover', function() {layer.openPopup();});
                                                                    layer.on('mouseout', function() {layer.closePopup();});
                                                                }
                                                            }).addTo(map);
                                        
                                                            /*faixbus = L.geoJSON(faixaazul, {
                                                                color: '#0000ff',
                                                                weight: 2,
                                                                opacity: 0.55,
                                                            });*/
                                                            var baselayers = {
                                                                'Esri Streets': mapa2,
                                                                'Shared Relief': baserelief
                                                            };
                                                            var overlays = {
                                                                'Parques e Praças': parks,
                                                                'Prédios públicos': eqpubli,
                                                                'Prédios da prefeitura': eqpref,
                                                                'Clínicas de saúde': eqsaude,
                                                                'Escolas municipais': escolasmuni,
                                                                'Malha cicloviaria': trail,
                                                                'Rota Operacional': cic2,
                                                                'Estacoes Bike PE': markers
                                                                //'Rotas a implementar - PDC': aimplementar,
                                                                //'Rotas a implementar - Complementar': aimplementar2,
                                                                //'Faixa Azul': faixaazul, 
                                                            };
                                                            L.control.layers(baselayers,overlays).addTo(map)
                                                            
                                                        }
                                                    });
                                                    //trail.addTo(map);
                                                }
                                            });
                                        
                                            });
                                            


                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });

    

    

    

    
    /*.getJSON({
        url: 'http://dados.recife.pe.gov.br/dataset/60d87881-2fbe-42b0-89b7-b079a4e9a737/resource/991dc857-e152-46fb-924b-e8a34351a726/download/faixaazul.geojson',
        //data: data,
        success: function(data) {
            faixaazul = data;
        }
    });*/

    
});

function print(codigo){
    if(codigo != undefined){
        return codigo;
    }else{
        return "*";
    }
}
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
/*map.on('mousemove', function(e){
    var lat = e.latlng.lat.toFixed(3);
    var lon = e.latlng.lng.toFixed(3);
    document.getElementById('mapCoordDIV').innerHTML = lat + ' , ' + lon;
});*/

/*var baselayers = {
    'Esri Streets': mapa2,
    'Shared Relief': baserelief
};*/

// Add scalebar

var scale = L.control.scale()
//console.log(scale)
//scale.addTo(map)