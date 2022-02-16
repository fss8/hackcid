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
var tam;
var select = 1;
var parkson = true
var equipspublion = false
var equipsprefon = false
var equipssaudeon = false
var escolason = false;

var teste = true
var teste2 = false

var vetorgrades1 = [0,1,2,4,6,10,15,20]
var vetorgrades2 = [0,1,2,3,4,5,6,7]
var vetorgrades = vetorgrades2;

function getDistance(Origin, destination) {
    // return distance in meters
    var lon1 = toRadian(Origin[1]),
        lat1 = toRadian(Origin[0]),
        lon2 = toRadian(destination[1]),
        lat2 = toRadian(destination[0]);

    var deltaLat = lat2 - lat1;
    var deltaLon = lon2 - lon1;

    var a = Math.pow(Math.sin(deltaLat/2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon/2), 2);
    var c = 2 * Math.asin(Math.sqrt(a));
    var EARTH_RADIUS = 6371;
    return c * EARTH_RADIUS * 1000;
}
function toRadian(degree) {
    return degree*Math.PI/180;
}


function FuncaoPreencheCoordenadas(variavel, tamanho){
    var retorno = []
    //console.log(variavel)
    //var variavel = parks
    var i = variavel._leaflet_id-1
    var id = variavel._leaflet_id;
    tamanho = tamanho+id;
    //console.log(tamanho)
    while (i < tamanho) {
        if(i==id){
            //console.log('MesmoID');
            //console.log("nao chega")
            //console.log(variavel._layers[i])
        }else if(variavel._layers[i] == undefined){
            //faz nada??
        }else{
            retorno.push(variavel._layers[i]._bounds.getCenter())
        }
        i++;
    }
    //console.log(retorno)
    return retorno;
}

function VerificaRestantes(bar, tamanho, vetorzin, dicio){
    idempresa = bar._leaflet_id-1;
    //console.log(bar)
    var atualdist = 100000
    var atualcodigo = 0;
    for(i = 0; i < vetorzin.length; i++){
        atualdist = 100000
        atualcodigo = 0;
        for( r = 0; r< tamanho; r++){
            var id1 = idempresa+r
            if(id1==idempresa+1){
                //faz nada
                //console.log(bairro._layers[id-1])
            }else{
                //console.log(id1)
                var p1 = bar._layers[id1]._bounds.getCenter()
                var p2 = vetorzin[i]
                var distanciacalc = getDistance([p1.lat, p1.lng], [p2.lat, p2.lng])
                if(distanciacalc < atualdist){
                    atualdist = distanciacalc
                    atualcodigo = bar._layers[id1].feature.properties.bairro_codigo;
                    
                }
            }
        }
        if(dicio[atualcodigo] == undefined){
            dicio[atualcodigo] = 1
        }else{
            dicio[atualcodigo] = dicio[atualcodigo] + 1;
        }
        
        //vetorzin.splice(i,1)
    }
}

function FuncaoMudaCorBairro(seletor){
    bairro.resetStyle();
    var iddazona = bairro._leaflet_id;
    tamanho = tam+iddazona;
    //console.log(bairro)
    if(seletor == 1){
        valor = bairroParks
        select = 1
        vetorgrades = vetorgrades1
        legend.update()
    }else if(seletor == 2){
        valor = bairroEquipsp
        valor2 = bairroEquipspref
        select = 2
        vetorgrades = vetorgrades2
        legend.update()
    }else if(seletor == 3){
        valor = bairroEquipsaude
        select = 3
        vetorgrades = vetorgrades2
        legend.update()
    }else if(seletor == 4){
        valor = bairroEscolasmuni
        select = 4
        vetorgrades = vetorgrades2
        legend.update()
    }

    for(i = iddazona-1; i < tamanho; i++){
        if(i != iddazona){
            // faz nada
        
            codigo = bairro._layers[i].feature.properties.bairro_codigo
            if(seletor == 2){
                //console.log(valor[codigo], valor2[codigo])
                resultado = 0
                if(valor[codigo] != undefined){
                    resultado += valor[codigo]
                }
                if(valor2[codigo] != undefined){
                    resultado += valor2[codigo]
                }
                bairro._layers[i].options.fillColor = getColor(resultado);
            }else{
                bairro._layers[i].options.fillColor = getColor(valor[codigo]);
            }
            
            bairro.setStyle();
        }
    }
}

var urlEmpresasCSV = {
    resource_id: 'e7beb70e-6298-43b0-9917-19c1458e924c' // the resource id
    //limit: 10000 // get 5 results
    //q: 'Prefeitura' // query for 'jones'
};
var bairro;
var bairroParks = {}
var bairroEquipsp = {};
var bairroEquipspref = {}
var bairroEquipsaude = {}
var bairroEscolasmuni = {}
$.support.cors = true;



    $.getJSON(urlBairrosGeoJSON, function(data) {
        //console.log(data);
        //var bairro2 = L.geoJson(data);
        //console.log(bairro2);
        var bairrosjson = data;
        numbairros = data.features.length;
        //pegar os indices dos bairros;
        //var dados = data.features;
        tam = data.features.length;
        //var desblock = 0;

        bairro = L.geoJson(data, {
            style: style,
            onEachFeature: onEachFeature    
        }).addTo(map)


        //map.spin(false);
        //console.log(data.features.length)
        var idempresa = bairro._leaflet_id-1;
        var indexlayer = bairro._leaflet_id;

        $.getJSON({
            url: 'http://dados.recife.pe.gov.br/dataset/ca9c19af-03f8-426f-ac0b-afec82a28533/resource/de34c4c7-f8cb-42f5-b5fe-bf5e9a99cdd9/download/parquespracas.geojson',
            //data: data,
            success: function(data) {
                parquesepracas = data;
                //console.log(parquesepracas)
                var qtdparks = data.features.length
                parks = L.geoJSON(parquesepracas, {
                    color: '#0f0000',
                    weight: 3,
                    opacity: 1,
                    //dashArray: '12 8 12',
                })
        
                //console.log(parks)

                $.getJSON({
                    url: 'http://dados.recife.pe.gov.br/dataset/e599f7cc-e441-4950-9314-8fdf3952b96f/resource/4206f194-0c86-4bd1-92fa-20a040adf6af/download/equipamentos-publicos.geojson',
                    //data: data,
                    success: function(data) {
                        equippublicos = data;
                        //console.log(equippublicos)
                
                        var qtdequippubli = data.features.length;
                        eqpubli = L.geoJSON(equippublicos, {
                            color: '#ff0fb0',
                            weight: 5,
                            opacity: 1,
                            //dashArray: '12 8 12',
                        })
            
                        $.getJSON({
                            url: 'http://dados.recife.pe.gov.br/dataset/e599f7cc-e441-4950-9314-8fdf3952b96f/resource/a74a444f-0b15-4827-8ea8-4e87168a57e2/download/equipamentos-publicos-prefeitura-recife.geojson',
                            //data: data,
                            success: function(data) {
                                equipprefeitura = data;
                                //console.log(equipprefeitura)
                                var qtdequipprefeitura = data.features.length;
                        
                                eqpref = L.geoJSON(equipprefeitura, {
                                    color: '#0b00b0',
                                    weight: 10,
                                    opacity: 1,
                                    //dashArray: '12 8 12',
                                })
                    
                                $.getJSON({
                                    url: 'http://dados.recife.pe.gov.br/dataset/08a65119-e0a1-4e70-9276-b975034980a0/resource/b309d41b-6eb2-4bdd-af6e-581be5f8e239/download/saudemunicipalestadual.geojson',
                                    //data: data,
                                    success: function(data) {
                                        equipsaude = data;
                                        //console.log(equipsaude)
                                        var qtdequipsaude = data.features.length;
                                
                                        eqsaude = L.geoJSON(equipsaude, {
                                            color: '#ff00bf',
                                            weight: 8,
                                            opacity: 1,
                                            //dashArray: '12 8 12',
                                        })
                            
                                        $.getJSON({
                                            url: 'http://dados.recife.pe.gov.br/dataset/4d3a3b39-9ea9-46ed-bf21-a2670de519c1/resource/41f377fc-8b36-4115-acbc-0f4645f7a6ff/download/educacaomunicipal.geojson',
                                            //data: data,
                                            success: function(data) {
                                                escolasmunicipais = data;
                                                //console.log(escolasmunicipais)
                                                var qtdescolasmunicipais = data.features.length;
                                        
                                                escolasmuni = L.geoJSON(escolasmunicipais, {
                                                    color: '#f00f00',
                                                    weight: 8,
                                                    opacity: 1,
                                                    //dashArray: '12 8 12',
                                                })
                                                //var teste = parks._layers
                                                //console.log(parquesepracas)

                                                for(i = 0; i < qtdparks; i++){
                                                    var codigo = parquesepracas.features[i].properties.CBAIRRCODI;
                                                    if(bairroParks[codigo] == undefined){
                                                        bairroParks[codigo] = 1
                                                    }else{
                                                        bairroParks[codigo] = bairroParks[codigo]+1
                                                    }
                                                }
                                                //console.log(qtdequippubli)
                                                var vetorequippublicoord = FuncaoPreencheCoordenadas(eqpubli, qtdequippubli)
                                                var vetorequipprefeituracoord = FuncaoPreencheCoordenadas(eqpref, qtdequipprefeitura)
                                                var vetorequipsaudecoord = FuncaoPreencheCoordenadas(eqsaude, qtdequipsaude)
                                                var vetorescolasmunicipaiscoord = FuncaoPreencheCoordenadas(escolasmuni, qtdescolasmunicipais)
                                                
                                                /*console.log(vetorequippublicoord)
                                                console.log(vetorequipprefeituracoord)
                                                console.log(vetorequipsaudecoord)
                                                console.log(vetorescolasmunicipaiscoord)*/

                                                //var varredura1 = equippublicos.features
                                                //console.log(varredura1)

                                                for( i = 0; i< tam; i++){
                                                    var id = idempresa+i
                                                    if(id==indexlayer){
                                                        //faz nada
                                                        //console.log(bairro._layers[id-1])
                                                    }else{
                                                        //varre o 1º
                                                        var codigo = bairro._layers[id].feature.properties.bairro_codigo;
                                                        for(j = 0; j < vetorequippublicoord.length; j++){
                                                            var local = vetorequippublicoord[j]
                                                            
                                                            if(bairro._layers[id]._bounds.contains(local)){
                                                                if(bairroEquipsp[codigo] == undefined){
                                                                    bairroEquipsp[codigo] = 1
                                                                }else{
                                                                    bairroEquipsp[codigo] = bairroEquipsp[codigo]+1
                                                                }
                                                                vetorequippublicoord.splice(j,1)
                                                            }
                                                        }

                                                        //codigo = bairro._layers[id].feature.properties.bairro_codigo;
                                                        for(j = 0; j < vetorequipprefeituracoord.length; j++){
                                                            var local = vetorequipprefeituracoord[j]
                                                            //var local2 = [coordenadas2[1], coordenadas2[0]]
                                                            if(bairro._layers[id]._bounds.contains(local)){
                                                                if(bairroEquipspref[codigo] == undefined){
                                                                    bairroEquipspref[codigo] = 1
                                                                }else{
                                                                    bairroEquipspref[codigo] = bairroEquipspref[codigo]+1
                                                                }
                                                                vetorequipprefeituracoord.splice(j,1)
                                                            }
                                                        }

                                                        //codigo = bairro._layers[id].feature.properties.bairro_codigo;
                                                        for(j = 0; j < vetorequipsaudecoord.length; j++){
                                                            var local = vetorequipsaudecoord[j]
                                                            //var local2 = [coordenadas2[1], coordenadas2[0]]
                                                            if(bairro._layers[id]._bounds.contains(local)){
                                                                if(bairroEquipsaude[codigo] == undefined){
                                                                    bairroEquipsaude[codigo] = 1
                                                                }else{
                                                                    bairroEquipsaude[codigo] = bairroEquipsaude[codigo]+1
                                                                }
                                                                vetorequipsaudecoord.splice(j,1)
                                                            }
                                                        }

                                                        for(j = 0; j < vetorescolasmunicipaiscoord.length; j++){
                                                            var local = vetorescolasmunicipaiscoord[j]
                                                            //var local2 = [coordenadas2[1], coordenadas2[0]]
                                                            if(bairro._layers[id]._bounds.contains(local)){
                                                                if(bairroEscolasmuni[codigo] == undefined){
                                                                    bairroEscolasmuni[codigo] = 1
                                                                }else{
                                                                    bairroEscolasmuni[codigo] = bairroEscolasmuni[codigo]+1
                                                                }
                                                                vetorescolasmunicipaiscoord.splice(j,1)
                                                            }
                                                        }

                                                        //baixar os dados e fazer calculo com drop.
                                                    }
                                            
                                                    //baixar dados aqui e ir dropando quando pertencer a um bairro
                                                }

                                                if(vetorequippublicoord.length >= 1){
                                                    //verifica o mais proximo
                                                    VerificaRestantes(bairro, tam, vetorequippublicoord, bairroEquipsp)
                                                }
                                                if(vetorequipprefeituracoord.length >= 1){
                                                    //verifica o mais proximo
                                                    VerificaRestantes(bairro, tam, vetorequipprefeituracoord, bairroEquipspref)
                                                }
                                                if(vetorequipsaudecoord.length >= 1){
                                                    //verifica o mais proximo
                                                    VerificaRestantes(bairro, tam, vetorequipsaudecoord, bairroEquipsaude)
                                                }
                                                if(vetorescolasmunicipaiscoord.length >= 1){
                                                    //verifica o mais proximo
                                                    VerificaRestantes(bairro, tam, vetorescolasmunicipaiscoord, bairroEscolasmuni)
                                                }


                                                /*console.log(vetorequippublicoord)
                                                console.log(bairroEquipsp)

                                                console.log(vetorequipsaudecoord)
                                                console.log(bairroEquipsaude)
                                                

                                                console.log(equippublicos) //tem q passar na varredura;
                                                console.log(equipprefeitura) // tambem

                                                console.log(equipsaude)
                                                console.log(escolasmunicipais)*/

                                                FuncaoMudaCorBairro(1)

                                                
                                                //var equipspublion = true
                                                //var equipsprefon = true
                                                //var equipssaudeon = true 
                                                //var escolason = true;

                                                var selecao = L.control({position: 'topright'});
                                                selecao.onAdd = function (map) {
                                                    var div = L.DomUtil.create('div');
                                                    div.innerHTML = '<select id="mySelect"><option value="1">Parques e praças</option><option value="2">Prédios publicos</option><option value="3">Clinicas de saúde</option><option value="4">Escolas municipais</option></select>';
                                                    div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
                                                    return div;
                                                };
                                                selecao.addTo(map);

                                                $('select').change(function(){
                                                    var x=document.getElementById("mySelect").value;
                                                    if(x != undefined){
                                                        FuncaoMudaCorBairro(x)
                                                    }
                                                });

                                                // create the control
                                                var command = L.control({position: 'topright'});
                                                //var command2 = L.control({position: 'topright'});

                                                command.onAdd = function (map) {
                                                    var div = L.DomUtil.create('div');

                                                    div.innerHTML = '<div class="bodycheckbox2">'+
                                                    '<label class="container2"><input id="command" type="checkbox" class="inputclass2" checked/>Parques e praças<span class="checkmark2"></span></label>'+
                                                    '<label class="container2"><input id="command2" type="checkbox" class="inputclass2"/>Prédios públicos<span class="checkmark2"></span></label>'+
                                                    '<label class="container2"><input id="command3" type="checkbox" class="inputclass2"/>Clínicas de saúde<span class="checkmark2"></span></label>'+
                                                    '<label class="container2"><input id="command4" type="checkbox" class="inputclass2"/>Escolas municipais<span class="checkmark2"></span></label></div>';
                                                    
                                                    return div;
                                                };

                                                command.addTo(map);


                                                // add the event handler
                                                function handleCommand() {
                                                    parkson = !parkson
                                                }
                                                function handleCommand2() {
                                                    equipspublion = !equipspublion
                                                    equipsprefon = !equipsprefon
                                                }
                                                function handleCommand3() {
                                                    equipssaudeon = !equipssaudeon
                                                }
                                                function handleCommand4() {
                                                    escolason = !escolason
                                                }

                                                document.getElementById ("command").addEventListener ("click", handleCommand, false);
                                                document.getElementById ("command2").addEventListener ("click", handleCommand2, false);
                                                document.getElementById ("command3").addEventListener ("click", handleCommand3, false);
                                                document.getElementById ("command4").addEventListener ("click", handleCommand4, false);

                                                map.spin(false);

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
        //map.spin(false);
        //funcaoEmpresas(bairro2);
    });

/*function funcaoEmpresas(codigo, lck){
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

}*/


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
    if(select == 1){
        return d > 20 ? '#800026' :
        d > 15  ? '#BD0026' :
        d > 10  ? '#E31A1C' :
        d > 6  ? '#FC4E2A' :
        d > 4   ? '#FD8D3C' :
        d > 2   ? '#FEB24C' :
        d > 1   ? '#FED976' :
                    '#FFEDA0';
    }else if(select == 2 || select == 3){
        return d > 6 ? '#800026' :
        d > 5  ? '#BD0026' :
        d > 4  ? '#E31A1C' :
        d > 3  ? '#FC4E2A' :
        d > 2   ? '#FD8D3C' :
        d > 1   ? '#FEB24C' :
        d > 0   ? '#FED976' :
                    '#FFEDA0';
    }else if(select == 4){
        return d > 6 ? '#800026' :
        d > 5  ? '#BD0026' :
        d > 4  ? '#E31A1C' :
        d > 3  ? '#FC4E2A' :
        d > 2   ? '#FD8D3C' :
        d > 1   ? '#FEB24C' :
        d > 0   ? '#FED976' :
                    '#FFEDA0';
    }
    else{
        return d > 100 ? '#E31A1C' :
        d > 80  ? '#E31A1C' :
        d > 60  ? '#E31A1C' :
        d > 40  ? '#E31A1C' :
        d > 20   ? '#E31A1C' :
        d > 10   ? '#E31A1C' :
        d > 5   ? '#E31A1C' :
                    '#E31A1C';
    }
}

function style(feature) {
    //console.log(bairroEmpresas)
    //console.log(bairroEquipsaude)
    if(select == 1){ valor = bairroParks}
    else if(select == 2){ 
        valor = bairroEquipsp
        valor2 = bairroEquipspref

        resultado = 0
        if(valor[feature.properties.bairro_codigo] != undefined){
            resultado += valor[feature.properties.bairro_codigo]
        }
        if(valor2[feature.properties.bairro_codigo] != undefined){
            resultado += valor2[feature.properties.bairro_codigo]
        }
        
        //console.log(resultado)
        return {
            //fillColor: getColor(feature.properties.NUMPOINTS),
            
            fillColor: getColor(resultado),
            weight: 2,
            opacity: 0.5,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.5
        };
    }else if( select == 3){ valor = bairroEquipsaude }
    else if( select == 4){ valor = bairroEscolasmuni }
    else{ valor = bairroParks}
    return {
        //fillColor: getColor(feature.properties.NUMPOINTS),
        fillColor: getColor(valor[feature.properties.bairro_codigo]),
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
function print(codigo){
    if(codigo != undefined){
        return codigo;
    }else{
        return "*";
    }
}

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

var info = L.control();
info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

info.update = function (props) {
    this._div.innerHTML = '<h4>Quantidade de estabelecimentos por bairro no recife</h4>' +  (props ?
        '<b>' + props.bairro_nome + '</b>' + (parkson ? '<br />' + 'Quantidade de Parques e Praças: ' + print(bairroParks[props.bairro_codigo]) : '') + 
        (equipspublion ? '<br />' + 'Prédios publicos no bairro: ' + print(bairroEquipsp[props.bairro_codigo]) : '') +
        (equipsprefon ? '<br />' + 'Prédios publicos da prefeitura: ' + print(bairroEquipspref[props.bairro_codigo]) : '') + 
        (equipssaudeon ? '<br />' + 'Clínicas de saúde no bairro: ' + print(bairroEquipsaude[props.bairro_codigo]) : '') +
        (escolason ? '<br />' + 'Quantidade de Escolas municipais: ' + print(bairroEscolasmuni[props.bairro_codigo]) : '')
        : 'Selecione um bairro');
};

//emp.addTo(map);
info.addTo(map);

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    this._div = L.DomUtil.create('div', 'info legend'),
    this.update()
    return this._div;
};

legend.update = function(){
    grades = vetorgrades,
    labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    this._div.innerHTML = '';
    for (var i = 0; i < grades.length; i++) {
        this._div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
}

legend.addTo(map);