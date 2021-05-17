var malhaciclo;
        var rotaoperacional;
        var faixaazul;
        var trail, cic2, faixbus = 0;
        var modobike = false;
        var tamanhodoraio = 900;

        var empresasReal = {
            "type": "FeatureCollection",
            "name": "empresasReal",
            "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
            "features": []
        }

        var tamanhonumempresas = 0;
        var circle;
        var sualocal;
        var clicado = 0;
        //console.log(sualocal);
        var itera = 0;


        var urlEmpresasCSV = {
            resource_id: 'e7beb70e-6298-43b0-9917-19c1458e924c' // the resource id
            //limit: 10000 // get 5 results
            //q: 'Prefeitura' // query for 'jones'
        };
        var emp;
        var empresul;

        var baselayers = {};

        var muxiIconProperties = {
            iconUrl: "img/map-locator.png", 
            iconSize: [30, 30]
            };
    
        var muxiIcon = L.icon(muxiIconProperties);

        urlEmpresasCSV = {
            resource_id: 'e7beb70e-6298-43b0-9917-19c1458e924c', // the resource id
            limit: 1000000 // get 1000000 results se possível
            //filters: string // query for 'jones'
        };
        
        $.ajax({
            type: "GET",
            url: 'http://dados.recife.pe.gov.br/api/3/action/datastore_search',
            data: urlEmpresasCSV,
            dataType: "json",
        }).done(function (data) {
            //console.log(data)
            var emp1 = data.result.records; 
            //console.log(emp1)
            //estbike = data.result.records
                            //console.log(estbike)
            var tamanho = data.result.total;
            var j = 0
            var objeto = {}
            //console.log(bikes.features)
            for (j=0; j<tamanho; j++) {
                var geometria;
                if(emp1[j].longitude == "" || emp1[j].latitude == "" || emp1[j].longitude == null || emp1[j].latitude == null){
                    geometria = null
                }else{
                    geometria = {
                        "type":'Point',
                        "coordinates": [ emp1[j].longitude , emp1[j].latitude, emp1[j].latitude]
                        }
                    objeto = {
                        "type": "Feature",
                        "properties": {
                        "codempresa": emp1[j].cod_empresa,
                        "nomebairro": emp1[j].nome_bairro,
                        "codbairro": emp1[j].cod_bairro
                    },
                        "geometry": geometria
                    }
                //console.log(bikes)
                    empresasReal["features"].push(objeto)
                }
            }
            tamanhonumempresas = empresasReal.features.length;
            //console.log(empresasReal)
            //console.log(emp1real)

            empresul = L.geoJSON(empresasReal, 
                      {pointToLayer: function(feature, latlng){
                          return L.marker(latlng, {icon: muxiIcon});
                      }
                     });

            var markers = L.markerClusterGroup(
                    { 
                        spiderfyOnMaxZoom : false , 
                        showCoverageOnHover : true , 
                        zoomToBoundsOnClick : false,
                        removeOutsideVisibleBounds: true,
                        //singleMarkerMode:true
                        maxClusterRadius: 55,
                        chunkedLoading: true
                    }
                );
            markers.addLayer(empresul);
            map.addLayer(markers);
            map.spin(false);

            $.getJSON({
                url: 'http://dados.recife.pe.gov.br/dataset/60d87881-2fbe-42b0-89b7-b079a4e9a737/resource/991dc857-e152-46fb-924b-e8a34351a726/download/faixaazul.geojson',
                //data: data,
                success: function(data) {
                    faixaazul = data;
                }
            });

            $.getJSON({
                url: 'http://dados.recife.pe.gov.br/dataset/667cb4cf-fc93-4687-bb8f-431550eeb2db/resource/095843ff-cfbb-46c8-88ad-b3e9d20f9229/download/rotasoperacionais.geojson',
            }).done(function (data) {

            rotaoperacional = data;

            $.getJSON({
                url: 'http://dados.recife.pe.gov.br/dataset/667cb4cf-fc93-4687-bb8f-431550eeb2db/resource/a76b2f7a-1431-4db6-ac13-d4c6afd43d01/download/qualquenome.geojson',
                //data: data,
                success: function(data) { 
                    malhaciclo = data;
                    // Add scalebar

                    var trail = L.geoJSON(malhaciclo, {
                        color: '#0f0000',
                        weight: 3,
                        opacity: 1,
                        dashArray: '12 8 12',
                    });
                    trail.addTo(map);
            
                    var cic2 = L.geoJSON(rotaoperacional, {
                        color: '#0000ff',
                        weight: 3,
                        opacity: 1,
                        dashArray: '12 8 12',
                    });
            
                    var faixbus = L.geoJSON(faixaazul, {
                        color: '#0000ff',
                        weight: 2,
                        opacity: 0.55,
                    });

                    var overlays = {
                        'Rede cicloviária': trail,
                            'Ciclovias operacionais': cic2
                            //'Empresas(arquivo grande)': empresul
                        };
                    L.control.layers(baselayers, overlays).addTo(map);
                    }
                })
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
                    var result = CalculaEmpresas();
                    info.update(result);
    
                }else{
                    sualocal._latlng.lat = lat
                    sualocal._latlng.lng = lon
                    circle._latlng.lat = lat;
                    circle._latlng.lng = lon;
                    //console.log(sualocal);
                    circle._reset(); 
                    sualocal.update();
                    //CalculaEmpresas();
                    var result = CalculaEmpresas();
                    info.update(result);
                }
                //circle._renderer._events.update();
                //map.fitBounds(circle.getBounds());
            });

            /*var baselayers = {};
            // Add scalebar

            var overlays = {
                'Rede cicloviária': malhaciclo,
                    'Ciclovias operacionais': rotaoperacional,
                    'Empresas(arquivo grande)': empresul
                };
            L.control.layers(baselayers, overlays).addTo(map);*/

        });
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
        
        /*var map = L.map(document.getElementById('mapid'), {
            center: [-8.0525, -34.921],
            zoom: 13,
            minZoom: 2,
            maxZoom: 17
        });

        //L.esri.basemapLayer('Streets').addTo(map);
        var baserelief = L.tileLayer('https://tile.opentopomap.org/{z}/{x}/{y}.png', {});
        //L.esri.basemapLayer('Streets').addTo(map);
        baserelief.addTo(map);*/

        /*var trail = L.geoJSON(malha, {
            color: '#0f0000',
            weight: 3,
            opacity: 1,
            dashArray: '12 8 12',
        });
        trail.addTo(map);

        var cic2 = L.geoJSON(ciclo2, {
            color: '#0000ff',
            weight: 3,
            opacity: 1,
            dashArray: '12 8 12',
        });

        var faixbus = L.geoJSON(faixaazul, {
            color: '#0000ff',
            weight: 2,
            opacity: 0.55,
        });*/
        //console.log(emp1real)
        /*emp = L.geoJSON(emp1real, 
                      {pointToLayer: function(feature, latlng){
                          return L.circle(latlng, {radius: 0.0000000001});
                      }
                     });*/

        /*var coordDIV = document.createElement('div');
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
        });*/

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

        var info = L.control();
        info.onAdd = function (map) {
            this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
            this.update();
            return this._div;
        };

        info.update = function (valor) {
            this._div.innerHTML = '<h4>' + "Empresas em um raio de 15 minutos" + (modobike ? "(Modo bike)" : "(A pé)") + '</h4>' + ((clicado!=0) ? '' + 
                (valor > 0 ? '<b>' + 'Número de empresas: ' + valor + '</b><br />'  + '</sup>' 
                : 'Não foi encontrado nenhuma empresa nessa região' )
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
            var result = CalculaEmpresas();
            info.update(result)
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
                tamanhodoraio = 5000
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