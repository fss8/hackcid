    var malhaciclo;
        var rotaoperacional;
        var faixaazul;
        var trail, cic2, faixbus = 0;
        var modobike = false;
        var tamanhodoraio = 900;
    var bairros;
        

        var tamanhonumempresas = 0;
        var circle;
        var sualocal;
        var clicado = 0;
        //console.log(sualocal);
        var itera = 0;

        var qtdparks, qtdequip, qtdeqref, qtdsaude, qtdescolas;
        var parkson = true
        var equipspublion = false
        var equipsprefon = false
        var equipssaudeon = false
        var escolason = false;  

        var valor1 = 0
        var valor2 = 0
        var valor3 = 0
        var valor4 = 0
        var valor5 = 0

        
        var baselayers = {};

        var muxiIconProperties = {
            iconUrl: "img/map-locator.png", 
            iconSize: [30, 30]
            };
    
        var muxiIcon = L.icon(muxiIconProperties);
            

        $(document).ready(function() {

            $.getJSON({
                url: 'http://dados.recife.pe.gov.br/dataset/ca9c19af-03f8-426f-ac0b-afec82a28533/resource/de34c4c7-f8cb-42f5-b5fe-bf5e9a99cdd9/download/parquespracas.geojson',
                //data: data,
                success: function(data) {
                    parquesepracas = data;
                    //console.log(parquesepracas)
                    qtdparks = data.features.length;

        
                    $.getJSON({
                        url: 'http://dados.recife.pe.gov.br/dataset/e599f7cc-e441-4950-9314-8fdf3952b96f/resource/4206f194-0c86-4bd1-92fa-20a040adf6af/download/equipamentos-publicos.geojson',
                        //data: data,
                        success: function(data) {
                            equippublicos = data;
                            //console.log(equippublicos)

                            qtdequip = data.features.length;
        
                            $.getJSON({
                                url: 'http://dados.recife.pe.gov.br/dataset/e599f7cc-e441-4950-9314-8fdf3952b96f/resource/a74a444f-0b15-4827-8ea8-4e87168a57e2/download/equipamentos-publicos-prefeitura-recife.geojson',
                                //data: data,
                                success: function(data) {
                                    equipprefeitura = data;
                                    //console.log(equipprefeitura)

                                    qtdeqref = data.features.length;
        
                                    $.getJSON({
                                        url: 'http://dados.recife.pe.gov.br/dataset/08a65119-e0a1-4e70-9276-b975034980a0/resource/b309d41b-6eb2-4bdd-af6e-581be5f8e239/download/saudemunicipalestadual.geojson',
                                        //data: data,
                                        success: function(data) {
                                            equipsaude = data;
                                            //console.log(equipsaude)

                                            qtdsaude = data.features.length;
        
                                            $.getJSON({
                                                url: 'http://dados.recife.pe.gov.br/dataset/4d3a3b39-9ea9-46ed-bf21-a2670de519c1/resource/41f377fc-8b36-4115-acbc-0f4645f7a6ff/download/educacaomunicipal.geojson',
                                                //data: data,
                                                success: function(data) {
                                                    escolasmunicipais = data;
                                                    //console.log(escolasmunicipais)
        
                                                    qtdescolas = data.features.length;
                                                    
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
                                                                    
                                                                }).addTo(map)
                                                                eqpubli = L.geoJSON(equippublicos, {
                                                                    color: '#0b00b0',
                                                                    weight: 3,
                                                                    opacity: 1,
                                                                    //dashArray: '12 8 12',
                                                                        
                                                                }).addTo(map)
                                                                eqpref = L.geoJSON(equipprefeitura, {
                                                                    color: '#0b00b0',
                                                                    weight: 3,
                                                                    opacity: 1,
                                                                    //dashArray: '12 8 12',
                                                                    
                                                                }).addTo(map);
                                                                eqsaude = L.geoJSON(equipsaude, {
                                                                    color: '#ff00bf',
                                                                    weight: 3,
                                                                    opacity: 1,
                                                                    //dashArray: '12 8 12',
                                                                        
                                                                }).addTo(map);
                                                                escolasmuni = L.geoJSON(escolasmunicipais, {
                                                                    color: '#f00f00',
                                                                    weight: 3,
                                                                    opacity: 1,
                                                                    //dashArray: '12 8 12',
                                                                        
                                                                }).addTo(map);

                                                                map.on('click', function(e){
                                                                    var lat = e.latlng.lat
                                                                    var lon = e.latlng.lng
                                                                    //console.log(lat + ' ' + lon);
                                                        
                                                                    if(clicado == 0){
                                                                        clicado = 1;
                                                                        sualocal = L.marker([lat, lon], 
                                                                            {title: 'Titulo da sua posição'});
                                                                        sualocal.bindPopup("Aqui está sua localização");
                                                                        sualocal.addTo(map);
                                                                        sualocal.openPopup();
                                                                            
                                                                        circle = L.circle([lat, lon], {
                                                                        color: 'red',
                                                                            fillColor: '#f03',
                                                                            fillOpacity: 0.35,
                                                                            radius: tamanhodoraio,
                                                                            opacity: 0.05
                                                                        }).addTo(map);
                                                                        //CalculaEmpresas();
                                                                        if(parkson){
                                                                            result1 = calculaparks()
                                                                            valor1 = result1
                                                                        }
                                                                        if(equipspublion || equipsprefon){
                                                                            result2 = calculaequip()
                                                                            valor2 = result2
                                                                            valor3 = calculaeqpref()
                                                                        }
                                                                        if(equipssaudeon){
                                                                            result4 = calculasaude()
                                                                            valor4 = result4
                                                                        }
                                                                        if(escolason){
                                                                            result5 = calculasaude()
                                                                            valor5 = result5
                                                                        }
                                                                        //var result = CalculaEmpresas();
                                                                        info.update(1);
                                                            
                                                                    }else{
                                                                        sualocal._latlng.lat = lat
                                                                        sualocal._latlng.lng = lon
                                                                        circle._latlng.lat = lat;
                                                                        circle._latlng.lng = lon;
                                                                        //console.log(sualocal);
                                                                        circle._reset(); 
                                                                        sualocal.update();
                                                                        //CalculaEmpresas();
                                                                        if(parkson){
                                                                            result1 = calculaparks()
                                                                            valor1 = result1
                                                                                
                                                                        }
                                                                        if(equipspublion || equipsprefon){
                                                                            result2 = calculaequip()
                                                                            valor2 = result2
                                                                            valor3 = calculaeqpref()
                                                                        }
                                                                        if(equipssaudeon){
                                                                            result4 = calculasaude()
                                                                            valor4 = result4
                                                                        }
                                                                        if(escolason){
                                                                            result5 = calculaescolas()
                                                                            valor5 = result5
                                                                        }
                                                                        //var result = CalculaEmpresas();
                                                                        info.update(1);
                                                                    }
                                                                    //circle._renderer._events.update();
                                                                    //map.fitBounds(circle.getBounds());
                                                                });
                                                        
                                                                    
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
                                                                    bairros.addTo(map)
                                                                    //bairros.remove(map)
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
        
            
        });

        
        
        

            //console.log(empresul);

            /*var emp5 = L.geoJSON(emp1real, 
                      {pointToLayer: function(feature, latlng){
                          return L.circle(latlng, {radius: 0.0000000001});
                      }
                     });*/

            //console.log(emp5)

            /*if('geolocation' in navigator){
                navigator.geolocation.getCurrentPosition(function(position) {
                    var lat = position.coords.latitude
                    var lon = position.coords.longitude
                    //console.log(position);
                    if(clicado == 0){
                        clicado = 1;
                        sualocal = L.marker([lat, lon], 
                            {title: 'Titulo da sua posição'});
                        sualocal.bindPopup("Aqui está sua localização<br> Seja Bem vindo");
                        sualocal.addTo(map);
                        sualocal.openPopup();
                        
                        circle = L.circle([lat, lon], {
                        color: 'red',
                            fillColor: '#f03',
                            fillOpacity: 0.35,
                            radius: tamanhodoraio,
                            opacity: 0.05
                        }).addTo(map);
                        //CalculaEmpresas();
                        var result = CalculaEmpresas();
                        info.update(result);
    
                    }else{
                        sualocal._latlng.lat = lat
                        sualocal._latlng.lng = lon
                        circle._latlng.lat = lat;
                        circle._latlng.lng = lon;
                        //console.log(sualocal);
                        sualocal.closePopup();
                        circle._reset(); 
                        sualocal.update();
                        //CalculaEmpresas();
                        var result = CalculaEmpresas();
                        info.update(result);
                    }
                }, function(error){
                    console.log(error)
                }, {enableHighAccuracy: true, maximumAge:10000, timeout:30000})
            }else{
                alert('Não foi possivel obter a localização')
            }*/

            
            /*var baselayers = {};
            // Add scalebar

            var overlays = {
                'Rede cicloviária': malhaciclo,
                    'Ciclovias operacionais': rotaoperacional,
                    'Empresas(arquivo grande)': empresul
                };
            L.control.layers(baselayers, overlays).addTo(map);*/

        
//        var map = L.map('mapid').setView([-8.0525, -34.921], 13);

  //      L.esri.basemapLayer('Streets').addTo(map);

        var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            //maxZoom: 19,
            minZoom: 2,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Points &copy 2012 LINZ'
        }),
        latlng = L.latLng(-37.89, 175.46);

        var map = L.map('mapid', {center: [-8.0525, -34.921], zoom: 13, layers: [tiles]});

        map.spin(true,  {lines: 13, length: 20, width: 6, // The line thickness
            radius:25,
            scale: 1, // Scales overall size of the spinner
            corners: 0.5, // Corner roundness (0..1)
            speed: 1.4, // Rounds per second
            rotate: 0, // The rotation offset
            animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
            direction: 1, // 1: clockwise, -1: counterclockwise
            color: '#8aaf5f', // CSS color or array of colors
            fadeColor: 'transparent', // CSS color or array of colors
            top: '50%', // Top position relative to parent
            left: '50%', // Left position relative to parent
            shadow: '0 0 0px transparent', // Box-shadow for the lines
            zIndex: 20000});
        
        

        function CalculaEmpresas(){
            itera = 0;
            var i = empresul._leaflet_id-1
            var id = empresul._leaflet_id;
            while (i < tamanhonumempresas) {
                if(i==id){
                    //console.log('MesmoID');
                }else if(empresul._layers[i] == undefined){
                    //console.log(emp._layers[i-1]._leaflet_id);
                    //console.log(itera);
                    //break;
                }else{
                    //Qual bairro pertence:
                var pontos = empresul._layers[i]._latlng.clone();
                    if(circle._latlng.distanceTo(pontos) <= tamanhodoraio){
                        itera++;      
                    }               
                }
                i++;
            }
            return itera;
        }

        function calculaparks(){
            itera = 0;
            var i = parks._leaflet_id-1
            var id = parks._leaflet_id;
            while (i < qtdparks + id) {
                if(i==id){
                    //console.log('MesmoID');
                }else if(parks._layers[i] == undefined){
                    //console.log(emp._layers[i-1]._leaflet_id);
                    //console.log(itera);
                    //break;
                }else{
                    //Qual bairro pertence:
                var pontos = parks._layers[i]._bounds.getCenter();
                    if(circle._latlng.distanceTo(pontos) <= tamanhodoraio){
                        itera++;      
                    }               
                }
                i++;
            }
            return itera;
        }

        function calculaequip(){
            itera = 0;
            var i = eqpubli._leaflet_id-1
            var id = eqpubli._leaflet_id;
            while (i < qtdequip + id) {
                if(i==id){
                    //console.log('MesmoID');
                }else if(eqpubli._layers[i] == undefined){
                    //console.log(emp._layers[i-1]._leaflet_id);
                    //console.log(itera);
                    //break;
                }else{
                    //Qual bairro pertence:
                var pontos = eqpubli._layers[i]._bounds.getCenter();
                    if(circle._latlng.distanceTo(pontos) <= tamanhodoraio){
                        itera++;      
                    }               
                }
                i++;
            }
            return itera;
        }

        function calculaeqpref(){
            itera = 0;
            var i = eqpref._leaflet_id-1
            var id = eqpref._leaflet_id;
            while (i < qtdeqref + id) {
                if(i==id){
                    //console.log('MesmoID');
                }else if(eqpref._layers[i] == undefined){
                    //console.log(emp._layers[i-1]._leaflet_id);
                    //console.log(itera);
                    //break;
                }else{
                    //Qual bairro pertence:
                var pontos = eqpref._layers[i]._bounds.getCenter();
                    if(circle._latlng.distanceTo(pontos) <= tamanhodoraio){
                        itera++;      
                    }               
                }
                i++;
            }
            return itera;
        }

        function calculasaude(){
            itera = 0;
            var i = eqsaude._leaflet_id-1
            var id = eqsaude._leaflet_id;
            while (i < qtdsaude + id) {
                if(i==id){
                    //console.log('MesmoID');
                }else if(eqsaude._layers[i] == undefined){
                    //console.log(emp._layers[i-1]._leaflet_id);
                    //console.log(itera);
                    //break;
                }else{
                    //Qual bairro pertence:
                var pontos = eqsaude._layers[i]._bounds.getCenter();
                    if(circle._latlng.distanceTo(pontos) <= tamanhodoraio){
                        itera++;      
                    }               
                }
                i++;
            }
            return itera;
        }

        function calculaescolas(){
            itera = 0;
            var i = escolasmuni._leaflet_id-1
            var id = escolasmuni._leaflet_id;
            while (i < qtdescolas + id) {
                if(i==id){
                    //console.log('MesmoID');
                }else if(escolasmuni._layers[i] == undefined){
                    //console.log(emp._layers[i-1]._leaflet_id);
                    //console.log(itera);
                    //break;
                }else{
                    //Qual bairro pertence:
                var pontos = escolasmuni._layers[i]._bounds.getCenter();
                    if(circle._latlng.distanceTo(pontos) <= tamanhodoraio){
                        itera++;      
                    }               
                }
                i++;
            }
            return itera;
        }



        var info = L.control();
        info.onAdd = function (map) {
            this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
            this.update();
            return this._div;
        };

        info.update = function (valor) {
            this._div.innerHTML = '<h4>' + "Equipamentos em um raio de 15 minutos" + (modobike ? "(Modo bike)" : "(A pé)") + '</h4>' + ((clicado!=0) ? '' + 
                (valor > 0 ?  
                (parkson ? 'Quantidade de Parques e Praças: ' + valor1 : '') + 
                (equipspublion ? '<br />' + 'Prédios publicos no bairro: ' + valor2 : '') +
                (equipsprefon ? '<br />' + 'Prédios publicos da prefeitura: ' + valor3 : '') + 
                (equipssaudeon ? '<br />' + 'Clínicas de saúde na região: ' + valor4 : '') +
                (escolason ? '<br />' + 'Quantidade de Escolas municipais: ' + valor5 : '')
                : 'Não foi encontrado nenhum valor nessa região' )
                : 'Clique em uma região do recife');
        };

        info.addTo(map);

        var botao = L.control({position: 'bottomright'});
        botao.onAdd = function (map) {
            this._div = this._createButton('<h4>Selecionar<br/> modo Bike</h4>', 'Botaozin', this._clicar)// create a div with a class "info"
            //this.update();
            //this.onclick();
            return this._div;
        };

        botao._clicar = function () {
            //console.log(e)
            modobike = !modobike
            this.update(modobike)
            //clicado = 0
            if(parkson){
                result1 = calculaparks()
                valor1 = result1
            }
            if(equipspublion || equipsprefon){
                result2 = calculaequip()
                valor2 = result2
                valor3 = calculaeqpref()
            }
            if(equipssaudeon){
                result4 = calculasaude()
                valor4 = result4
            }
            if(escolason){
                result5 = calculasaude()
                valor5 = result5
            }
            //var result = CalculaEmpresas();
            info.update(1)
            //this._map.zoomIn(e.shiftKey ? 3 : 1);
        }

        botao._createButton = function (html, title, fn) {
            var link = L.DomUtil.create('button', 'botao');
            link.innerHTML = html;
            link.href = '#';
            link.title = title;
    
            L.DomEvent.on(link, 'mousedown dblclick', L.DomEvent.stopPropagation)
                .on(link, 'click', L.DomEvent.stop)
                .on(link, 'click', fn, this)
                .on(link, 'click', this._refocusOnMap, this);
    
            return link;
        }

        botao.update = function(modo) {
            this._div.innerHTML = (modo ? '<h4>Selecionar<br/> modo a pé</h4>' : '<h4>Selecionar<br/> modo Bike</h4>') ;
            if(modo == true){
                //console.log(circle)
                tamanhodoraio = 4000
                circle.options.radius = tamanhodoraio
                circle._mRadius = tamanhodoraio
                circle._reset(); 
            }else{
                tamanhodoraio = 900
                circle.options.radius = tamanhodoraio
                circle._mRadius = tamanhodoraio
                circle._reset(); 
            }
        };
        botao.addTo(map);
        

        var scale = L.control.scale()
        scale.addTo(map)

        // Add attribution
        //map.attributionControl.addAttribution('OpenTopoMap');