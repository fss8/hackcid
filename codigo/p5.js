

        var trail, cic2;
        var bairrson = false

        var ODBiketrab = new Array();
        var ODPetrab = new Array();
        var ODBikeesc = new Array();
        var ODPeesc = new Array();
        var ODCONSIDERADA = new Array()

        var validadortrab = {}
        var validadorpetrab = {}

        var validadoresc = {}
        var validadorpeesc = {}

        var tamanhoodbiketrab = 0;
        var tamanhoodpetrab = 0;
        var tamanhoodbikeesc = 0;
        var tamanhoodpeesc = 0;
        var tamanhoconsiderado = 0;

        var dicionario = new Map();
        //xmlhttp.open("GET", "OD/arq.csv", true);
        //xmlhttp.send();
        var odcarregado = 0
        var zona = 0

        $.ajax({
            type:"GET",
            url: 'http://dados.recife.pe.gov.br/dataset/667cb4cf-fc93-4687-bb8f-431550eeb2db/resource/a76b2f7a-1431-4db6-ac13-d4c6afd43d01/download/qualquenome.geojson',
            //data: data,
            dataType: 'json',
            success: function(data) { 
                malhaciclo = data;

                $.ajax({
                    type: "GET",
                    url: 'http://dados.recife.pe.gov.br/dataset/667cb4cf-fc93-4687-bb8f-431550eeb2db/resource/095843ff-cfbb-46c8-88ad-b3e9d20f9229/download/rotasoperacionais.geojson',
                    dataType: 'json'
                }).done(function (data) {
                rotaoperacional = data; 
                    
                trail = L.geoJSON(malhaciclo, {
                    color: '#0f0000',
                    weight: 2,
                    opacity: 1,
                    dashArray: '12 8 12',
                });
                //trail.addTo(map);
        
                cic2 = L.geoJSON(rotaoperacional, {
                    color: '#0000ff',
                    weight: 2,
                    opacity: 1,
                    dashArray: '12 8 12',
                });

                });
            }
        });

        $(document).ready(function() {
        // AJAX in the data file

        var string5 = "{\"MODO_TRANSP_TRAB\": \"SOMENTE BICICLETA\"}"
        var dadosbuscabiketrab = {
            resource_id: 'fead29a3-3719-48c4-93c2-fab63db5d12b', // the resource id
            fields: 'MODO_TRANSP_TRAB, ZONA_RES, ZONA_TRAB, EXPANSAO',
            q: string5,
            limit: 100000 // get 5 results 
        };
        var string4 = "{\"MODO_TRANSP_TRAB\": \"SOMENTE A PE\"}"
        var dadosbuscaapetrab = {
            resource_id: 'fead29a3-3719-48c4-93c2-fab63db5d12b', // the resource id
            fields: 'MODO_TRANSP_TRAB, ZONA_RES, ZONA_TRAB, EXPANSAO',
            q: string4,
            limit: 100000 // get 5 results 
        };
        $.ajax({
            url: 'http://dados.recife.pe.gov.br/api/3/action/datastore_search',
            data: dadosbuscaapetrab,
            dataType: "json",
            success: function(data) {

                var pesquisaodpetrab = data.result.records

                var tratadoodpetrab = pesquisaodpetrab.filter(function(item){
                    //console.log(item)
                    // Mesma zona, não deve ser contabilizado??

                    return item["ZONA_RES"] != 'X' && item['ZONA_TRAB'] != 'X' && item["ZONA_RES"] != item['ZONA_TRAB'];
                })
                tratadoodpetrab.map(function(item){
                    var valor1 = item["ZONA_RES"]
                    var valor2 = item["ZONA_TRAB"]
                    var str = valor1 + "-" + valor2
                    //console.log(str)
                    if(validadorpetrab[str] == undefined){
                        vet = [Number(valor1), Number(valor2), parseFloat(item["EXPANSAO"].replace(",","."))]
                        var indiceatual = ODPetrab.length
                        ODPetrab.push(vet);
                        validadorpetrab[str] = indiceatual
                    }else{
                        index = validadorpetrab[str]
                        ODPetrab[index][2] += parseFloat(item["EXPANSAO"].replace(",","."))
                    }
                    //vet = [Number(item["ZONA_RES"]), Number(item["ZONA_TRAB"]), parseFloat(item["EXPANSAO"].replace(",","."))]
                    //ODBike.push(vet);
                })
                //var tamanhodoresultadoodpe = tratadoodpe.length

                //console.log(ODPetrab)

                tamanhoodpetrab = ODPetrab.length
                
                
                $.ajax({
                    url: 'http://dados.recife.pe.gov.br/api/3/action/datastore_search',
                    data: dadosbuscabiketrab,
                    dataType: "json",
                    success: function(data) {

                        var pesquisaodtrab = data.result.records

                        var tratadotrab = pesquisaodtrab.filter(function(item){
                            //console.log(item)
                            // Mesma zona, não deve ser contabilizado??

                            return item["ZONA_RES"] != 'X' && item['ZONA_TRAB'] != 'X' && item["ZONA_RES"] != item['ZONA_TRAB'];
                        })
                        tratadotrab.map(function(item){
                            var valor1 = item["ZONA_RES"]
                            var valor2 = item["ZONA_TRAB"]
                            var str = valor1 + "-" + valor2
                            //console.log(str)
                            if(validadortrab[str] == undefined){
                                vet = [Number(valor1), Number(valor2), parseFloat(item["EXPANSAO"].replace(",","."))]
                                var indiceatual = ODBiketrab.length
                                ODBiketrab.push(vet);
                                validadortrab[str] = indiceatual
                            }else{
                                index = validadortrab[str]
                                ODBiketrab[index][2] += parseFloat(item["EXPANSAO"].replace(",","."))
                            }
                            //vet = [Number(item["ZONA_RES"]), Number(item["ZONA_TRAB"]), parseFloat(item["EXPANSAO"].replace(",","."))]
                            //ODBike.push(vet);
                        })
                        //var tamanhodoresultado = tratado.length

                        //console.log(ODBiketrab)

                        tamanhoodbiketrab = ODBiketrab.length
                        tamanhoconsiderado = tamanhoodbiketrab
                        ODCONSIDERADA = ODBiketrab


                        // ===============================sdads==============================dsdsa ===========================///

                        //0230-23293920392

                        var string3 = "{\"MODO_TRANSP_AULA\": \"SOMENTE BICICLETA\"}"
                        var dadosbuscabikeesc = {
                            resource_id: 'fead29a3-3719-48c4-93c2-fab63db5d12b', // the resource id
                            fields: 'MODO_TRANSP_AULA, ZONA_RES, ZONA_EDU, EXPANSAO',
                            q: string3,
                            limit: 100000 // get 5 results 
                        };
                        var string2 = "{\"MODO_TRANSP_AULA\": \"SOMENTE A PE\"}"
                        var dadosbuscaapeesc = {
                            resource_id: 'fead29a3-3719-48c4-93c2-fab63db5d12b', // the resource id
                            fields: 'MODO_TRANSP_AULA, ZONA_RES, ZONA_EDU, EXPANSAO',
                            q: string2,
                            limit: 100000 // get 5 results 
                        };
                        $.ajax({
                            url: 'http://dados.recife.pe.gov.br/api/3/action/datastore_search',
                            data: dadosbuscaapeesc,
                            dataType: "json",
                            success: function(data) {
                
                                var pesquisaodpeesc = data.result.records
                
                                var tratadoodpeesc = pesquisaodpeesc.filter(function(item){
                                    //console.log(item)
                                    // Mesma zona, não deve ser contabilizado??
                
                                    return item["ZONA_RES"] != 'X' && item['ZONA_TRAB'] != 'X' && item["ZONA_RES"] != item['ZONA_TRAB'];
                                })
                                tratadoodpeesc.map(function(item){
                                    var valor1 = item["ZONA_RES"]
                                    var valor2 = item["ZONA_TRAB"]
                                    var str = valor1 + "-" + valor2
                                    //console.log(str)
                                    if(validadorpeesc[str] == undefined){
                                        vet = [Number(valor1), Number(valor2), parseFloat(item["EXPANSAO"].replace(",","."))]
                                        var indiceatual = ODPeesc.length
                                        ODPeesc.push(vet);
                                        validadorpeesc[str] = indiceatual
                                    }else{
                                        index = validadorpeesc[str]
                                        ODPeesc[index][2] += parseFloat(item["EXPANSAO"].replace(",","."))
                                    }
                                    //vet = [Number(item["ZONA_RES"]), Number(item["ZONA_TRAB"]), parseFloat(item["EXPANSAO"].replace(",","."))]
                                    //ODBike.push(vet);
                                })
                                //var tamanhodoresultadoodpe = tratadoodpe.length
                
                                //console.log(ODPeesc)
                
                                tamanhoodpeesc = ODPeesc.length
                        
                                
                                $.ajax({
                                    url: 'http://dados.recife.pe.gov.br/api/3/action/datastore_search',
                                    data: dadosbuscabikeesc,
                                    dataType: "json",
                                    success: function(data) {
                
                                        var pesquisaodesc = data.result.records
                
                                        var tratadoesc = pesquisaodesc.filter(function(item){
                                            //console.log(item)
                                            // Mesma zona, não deve ser contabilizado??
                
                                            return item["ZONA_RES"] != 'X' && item['ZONA_TRAB'] != 'X' && item["ZONA_RES"] != item['ZONA_TRAB'];
                                        })
                                        tratadoesc.map(function(item){
                                            var valor1 = item["ZONA_RES"]
                                            var valor2 = item["ZONA_TRAB"]
                                            var str = valor1 + "-" + valor2
                                            //console.log(str)
                                            if(validadoresc[str] == undefined){
                                                vet = [Number(valor1), Number(valor2), parseFloat(item["EXPANSAO"].replace(",","."))]
                                                var indiceatual = ODBikeesc.length
                                                ODBikeesc.push(vet);
                                                validadoresc[str] = indiceatual
                                            }else{
                                                index = validadoresc[str]
                                                ODBikeesc[index][2] += parseFloat(item["EXPANSAO"].replace(",","."))
                                            }
                                            //vet = [Number(item["ZONA_RES"]), Number(item["ZONA_TRAB"]), parseFloat(item["EXPANSAO"].replace(",","."))]
                                            //ODBike.push(vet);
                                        })
                                        //var tamanhodoresultado = tratado.length
                
                                        //console.log(ODBikeesc)
                
                                        tamanhoodbikeesc = ODBikeesc.length
                                        //tamanhoconsiderado = tamanhoodbike
                                        //ODCONSIDERADA = ODBike


                                var urlZonasGeoJSON = "http://dados.recife.pe.gov.br/dataset/pesquisa-origemdestino-metropolitana-2018/resource/96bc3fdd-4907-4e0a-8a10-a8b20665a457/download/zonas.geojson";
                                var urlBairrosGeoJSON = "http://dados.recife.pe.gov.br/dataset/c1f100f0-f56f-4dd4-9dcc-1aa4da28798a/resource/e43bee60-9448-4d3d-92ff-2378bc3b5b00/download/bairros.geojson";

                                $.support.cors = true;

                                $.getJSON(urlBairrosGeoJSON, function(data) {
                                    //console.log(data);
                                    var dadosbairros = data
                                    
                                    $.getJSON(urlZonasGeoJSON, function(data) {

                                    
                                        var zonastrafego = data
                                        //console.log(zonastrafego);
                                        //var bairro2 = L.geoJson(data);
                                        //var zonas4 = zonas
                                        //console.log(zonas4)
                                        zona = L.geoJSON(zonastrafego, {
                                            style: style,
                                            onEachFeature: onEachFeature
                                        });
                                        //zona.addTo(map);

                                        bairros = L.geoJson(dadosbairros, {
                                            style: {color: '#000020',
                                            weight: 1.2,
                                            opacity: 0.6, },
                                            onEachFeature: onEachFeature2
                                        })
                                        //bairros.addTo(map)
                                        zona.addTo(map);

                                        var baselayers = {
                                            //
                                        };
                                        var overlays = {
                                            'Rede Cicloviária': trail,
                                            'Ciclovias operacionais': cic2
                                        }

                                        
                                        L.control.layers(baselayers,overlays).addTo(map);

                                        var command = L.control({position: 'topright'});
                                        //var command2 = L.control({position: 'topright'});

                                        command.onAdd = function (map) {
                                            var div = L.DomUtil.create('div');

                                            div.innerHTML = '<div class="bodycheckbox"><label class="container">Mostrar Bairros<input id="command" type="checkbox" class="inputclass"/><span class="checkmark"></span></label></div>';
                                                                
                                            return div;
                                        };
                                        command.addTo(map);
                                                            // add the event handler
                                        function handleCommand() {
                                            bairrson = !bairrson
                                            if(bairrson == true){
                                                bairros.addTo(map)
                                                info2.addTo(map)
                                            }else{
                                                map.removeLayer(bairros)
                                                info2.remove(map)
                                            }
                                            //remove do mapa
                                        }
                                        document.getElementById ("command").addEventListener ("click", handleCommand, false);

                                        dicionario = new Map();
                                        
                                        var i = zona._leaflet_id-1
                                        while (i) {
                                            if(i==zona._leaflet_id){
                                                //console.log('MesmoID');
                                            }else if(zona._layers[i] == undefined){
                                                //Não faz nada;
                                                //console.log(emp._layers[i-1]._leaflet_id);
                                                //console.log(itera);
                                                break;
                                            }else{
                                                //Qual chave e código
                            
                                                dicionario.set(zona._layers[i].feature.properties.CODIGOZONA, i);
                                                
                                            }
                                            i++;
                                        }

                                        var selecao = L.control({position: 'topright'});
                                            selecao.onAdd = function (map) {
                                            var div = L.DomUtil.create('div');
                                            div.innerHTML = '<select id="mySelect"><option value="1">Transporte por bicicleta - Trabalho</option><option value="2">Transporte a pé - Trabalho</option><option value="3">Transporte por bicicleta - Escola</option> <option value="4">Transporte a pé - Escola</option></select>';
                                            div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
                                            return div;
                                        };
                                        selecao.addTo(map);

                                        $('select').change(function(){
                                            var x=document.getElementById("mySelect").value;
                                            if(x != undefined){
                                                funcaoMudaModo(x)
                                            }
                                        });
                                    })
                                })
                            } });
                                
                             
                        } });


                        //======================================||==============================||===============================//
                        
                    } });
                } });

            

            
        });

        //var dicionario = new Map();
        var map = L.map('mapid').setView([-8.0525, -34.921], 13);

        var cartodbAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>';

        var positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
            attribution: cartodbAttribution
        }).addTo(map);

        //L.esri.basemapLayer('Imagery').addTo(map);
        //L.esri.basemapLayer('ImageryLabels').addTo(map);
        
        // Add scalebar, A escala está em metros e em milhas

        var scale = L.control.scale()
        scale.addTo(map);

        //var zona = L.geoJSON(zonas, {
        //    style: style,
        //    onEachFeature: onEachFeature
        //});

        function funcaoMudaModo(entrada){
            dicionario = new Map(); 
            if(entrada==2){
                ODCONSIDERADA = ODPetrab
                tamanhoconsiderado = tamanhoodpetrab
            }else if(entrada == 3){
                ODCONSIDERADA = ODBikeesc
                tamanhoconsiderado = tamanhoodbikeesc
            }else if(entrada == 4){
                ODCONSIDERADA = ODPeesc
                tamanhoconsiderado = tamanhoodpeesc
            }
            else{
                ODCONSIDERADA = ODBiketrab
                tamanhoconsiderado = tamanhoodbiketrab
            }

            zona.resetStyle();
            info.update()
        }

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
            var codzona = feature.properties.CODIGOZONA;
            //zonaclicada = codzona;
            var deslocs = 0;

            //console.log(ODBike[k][0])
            var i = 0
            for(;i < tamanhoconsiderado; i++){
                var num  = ODCONSIDERADA[i][0];
                //if(num + 50 < codzona && num+50 < 1200){
                //    i = i + 50
                //}
                
                if(num == codzona){
                    //console.log('achou');
                    var tradu = ODCONSIDERADA[i][1];
                    if(num != tradu){
                        deslocs = deslocs+ODCONSIDERADA[i][2];
                    }
                }
                
            }
            dicionario.set(codzona, deslocs);
            return {
                fillColor: getColor(deslocs),
                weight: 2,
                opacity: 0.5,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
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

            /*if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                layer.bringToFront();
            }*/

            info.update(layer.feature.properties);
        }

        function resetHighlight(e) {
            zona.resetStyle(e.target);
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

        //========================================||==============================//
        function highlightFeature2(e) {
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
        
            info2.update(layer.feature.properties);
        }
        
        function resetHighlight2(e) {
            bairros.resetStyle(e.target);
            info2.update();
        }
        
        function zoomToFeature2(e) {
            map.fitBounds(e.target.getBounds());
        }
        
        function onEachFeature2(feature, layer) {
            layer.on({
                mouseover: highlightFeature2,
                mouseout: resetHighlight2,
                click: zoomToFeature2
            });
            //console.log(layer);
        }
        //================================||////=============================//
        
        var info = L.control();
        info.onAdd = function (map) {
            this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
            this.update();
            return this._div;
        };

        info.update = function (props) {
            this._div.innerHTML = '<h4>Zonas e deslocamento no recife</h4>' +  (props ?
                '<b>' + 'Zona de número: ' +props.CODIGOZONA + '</b><br />'  
                + 'Quantidade total de deslocamentos:' + dicionario.get(props.CODIGOZONA).toLocaleString('pt-BR')
                 : 'Selecione uma zona');
        };

        info.addTo(map);

        var info2 = L.control({position: 'topleft'});
        info2.onAdd = function (map) {
            this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
            this.update();
            return this._div;
        };
        
        info2.update = function (props) {
            this._div.innerHTML = '<h4>Bairro do Recife</h4>' +  (props ?
                '<b>' + props.bairro_nome + '</b><br />' +
                ' ' 
                : 'Selecione um bairro');
        };
        
        var legend = L.control({position: 'bottomright'});

        legend.onAdd = function (map) {

            var div = L.DomUtil.create('div', 'info legend'),
                grades = [0, 10, 20, 50, 100, 200, 500, 1000],
                labels = [];

                div.innerHTML = '<div class="textopequeno">Número de Viagens</div>'
            // loop through our density intervals and generate a label with a colored square for each interval
            for (var i = 0; i < grades.length; i++) {
                div.innerHTML +=
                    '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                    grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
            }

            return div;
        };

        legend.addTo(map);