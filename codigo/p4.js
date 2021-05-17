var zona; var dicionario; var zonaclicada = 0;
var trail, cic2;
        var ODBike;
        var mododestino = false;

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
            
                var baselayers = {
                    //'Zonas do Recife': zona,
                    //'Faixa Azul - ônibus': faixbus
                };
                var overlays = {
                    'Rede Cicloviária': trail,
                    'Ciclovias operacionais': cic2
                    //'Rotas a implementar - PDC': aimplementar,
                    //'Rotas a implementar - Complementar': aimplementar2
                };
                L.control.layers(baselayers,overlays).addTo(map);

                });
            }
        });

        ODBike = new Array();
        var tamanhoodbike = 0;
        //xmlhttp.open("GET", "OD/arq.csv", true);
        //xmlhttp.send();

        $(document).ready(function() {
        // AJAX in the data file
            $.ajax({
                type: "GET",
                url: "arquivos/OD/arq.csv",
                dataType: "text",
                success: function(data) {processData(data);
                
                    zona = L.geoJSON(zonas, {
                        style: style,
                        onEachFeature: onEachFeature
                    });
                    zona.addTo(map);
        
                    dicionario = new Map();
                    //console.log(zona._leaflet_id);
                    //console.log(zona);
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
                
                }
            });

            // Let's process the data from the data file
            function processData(data) {
                var lines = data.split(/\r\n|\n/);

                var origem;
                var destino;
                var deslocamento;

                //Set up the data arrays
                for (var j=0; j<(lines.length-1); j++) {
                    var valores = lines[j].split(';'); // Split up the comma seperated values
                    // We read the key,1st, 2nd and 3rd rows 
                    origem = Number(valores[0]);
                    destino = Number(valores[1]);
                    deslocamento = parseFloat(valores[2].replace(",","."));

                    var vet = [origem, destino, deslocamento]
                    ODBike.push(vet);
                }
                tamanhoodbike = ODBike.length;
                //console.log(ODBike)

            //console.log(ODBike)

            // For display
            }
        });

        var map = L.map('mapid').setView([-8.0525, -34.921], 13);

        var cartodbAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>';

        var positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
            attribution: cartodbAttribution
        }).addTo(map);
        //L.esri.basemapLayer('Imagery').addTo(map);
        //L.esri.basemapLayer('ImageryLabels').addTo(map);

        // Add scalebar, A escala está em metros e em milhas

        //var scale = L.control.scale()
        /*scale.onAdd = function (map) {
            this._div = L.DomUtil.create('scale'); // create a div with a class "info"
            return this._div
        };*/
        //scale.addTo(map);

        // Add attribution
        //map.attributionControl.addAttribution('National Map Topo');
        //map.attributionControl.addAttribution('OpenTopoMap');
        
        function getColor(d) {
            return d > 500 ? '#800026' :
                d > 300  ? '#BD0026' :
                d > 150  ? '#E31A1C' :
                d > 100  ? '#FC4E2A' :
                d > 50   ? '#FD8D3C' :
                d > 20   ? '#FEB24C' :
                d > 10   ? '#FED976' :
                            '#FFEDA0';
        }

        function style(feature) {
            return {
                fillColor: '#ffffff',
                weight: 2,
                opacity: 0.5,
                color: 'blue',
                dashArray: '3',
                fillOpacity: 0.7
            };
        }

        var desloc = -1;

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

            desloc = MostrarNumeroDesloc(e.target.feature.properties.CODIGOZONA);

            info.update(layer.feature.properties);
        }

        //Varrer a zona e criar um dicionario pros ids e os númeors de objetos
        function MostrarNumeroDesloc(zonaatual){
            if(mododestino == false){
                var i = 0;
                for(;i < tamanhoodbike; i++){
                    var num  = ODBike[i][0];
                    //if(num + 50 < zonaclicada && num+50 < 1200){
                    //    i = i + 50
                    //}
                    if(num > zonaclicada){
                        return -1;
                    }else{
                        if(num == zonaclicada){
                            //console.log('achou');
                            var tradu = ODBike[i][1];
                            if(tradu == zonaatual){
                                var retorno = ODBike[i][2];
                                return retorno;
                            }
                        }
                    }
                }
                return -1;
            }else{
                var i = 0;
                for(;i < tamanhoodbike; i++){
                    var orig  = ODBike[i][0];
                    //if(num + 50 < zonaclicada && num+50 < 1200){
                    //    i = i + 50
                    //}
                    
                    if(orig == zonaatual){
                        //console.log('achou');
                        var dest = ODBike[i][1];
                        if(dest == zonaclicada){
                            var retorno = ODBike[i][2];
                            return retorno;
                        }
                    }
                }
                return -1;
            }
        }

        function tiramouse(e){
            
            e.target.setStyle({
                //fillColor: '#ffffff',
                weight: 2,
                opacity: 0.5,
                color: 'blue',
                dashArray: '3',
                fillOpacity: 0.7
            })
            info.update();
        }

        function resetHighlight(e) {
            zona.resetStyle();
            info.update();
        }

        function mudarcorregioes(e) {
            zona.resetStyle();
            e.target.setStyle({
                weight: 5,
                color: '#f00',
                dashArray: '',
                fillOpacity: 0.7,
                fillColor:'#0000ff'
            })
            //Agora percorrer todas as regiões
            var codzona = e.target.feature.properties.CODIGOZONA;
            zonaclicada = codzona;

            info.update(e.target.feature.properties)

            if(mododestino == false){
                var i = 0
                for(;i < tamanhoodbike; i++){
                    var num  = ODBike[i][0];
                    if(num + 50 < codzona){
                        i = i + 50
                    }
                    if(num > codzona){
                        break;
                    }else{
                        if(num == codzona){
                            var tradu = ODBike[i][1];
                            var regiao = dicionario.get(tradu);
                            var cor = getColor(ODBike[i][2]);
                            if(regiao == undefined){
                                //console.log(tradu)
                            }

                            if(num != tradu  && zona._layers[regiao] != undefined){
                                zona._layers[regiao].options.fillColor = cor;
                                //console.log(zona._layers[regiao])
                            }                    
                            zona.setStyle();
                        }
                    }
                }
            }else{
                var i = 0
                for(;i < tamanhoodbike; i++){
                    //
                    var dest = ODBike[i][1]; // destino
                    if(dest == codzona){
                        var orig = ODBike[i][0]; ///origem
                        var regiao = dicionario.get(orig);
                        var cor = getColor(ODBike[i][2]);
                        if(regiao == undefined){
                            //console.log(tradu)
                        }

                        if(dest != orig  && zona._layers[regiao] != undefined){
                            zona._layers[regiao].options.fillColor = cor;
                            //console.log(zona._layers[regiao])
                        }                    
                        zona.setStyle();
                    }
                }
            }
        }

        function onEachFeature(feature, layer) {
            layer.on({
                mouseover: highlightFeature,
                mouseout: tiramouse,
                click: mudarcorregioes
            });
            //console.log(layer);
        }

        //zona.addTo(map);
        
        var info = L.control();
        info.onAdd = function (map) {
            this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
            this.update();
            return this._div;
        };

        info.update = function (props) {
            this._div.innerHTML = '<h4>Deslocamento entre zonas de tráfego no recife</h4>' +  (props ?
                '<b>' + 'Zona de número: ' +props.CODIGOZONA + ((zonaclicada!=0) ? (mododestino ? " (Origem)" : " (Destino)") 
                    +'</b><br />' + 'Zona de tráfego selecionada: ' + zonaclicada + (mododestino ? " (Destino)" : " (Origem)") + 
                (zonaclicada!=props.CODIGOZONA ? '<br/>' + (desloc!=-1 ? 'Número de viagens: ' + desloc.toLocaleString('pt-BR') : 
                'Não foi registrado deslocamento') : '<br/> Mesma Zona') : (mododestino ? " (Destino)" : " (Origem)") +'</b><br />' + 
                'Clique em uma zona') + '</sup>' : 'Selecione uma zona');
        };

        info.addTo(map);

        var botao = L.control({position: 'bottomleft'});
        botao.onAdd = function (map) {
            this._div = this._createButton('<h4>Modo<br/>Destino</h4>', 'Botaozin2', this._clicar)// create a div with a class "info"
            //this.update();
            //this.onclick();
            return this._div;
        };

        botao._clicar = function () {
            //console.log(e)
            mododestino = !mododestino
            //this.update(modobike)
            //clicado = 0
            //var result = CalculaEmpresas();
            this.update(mododestino)
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
            this._div.innerHTML = (modo ? '<h4>Modo<br/> Origem</h4>' : '<h4>Modo<br/>Destino</h4>') ;
            if(modo == true){
                zonaclicada = 0
                zona.resetStyle();
                info.update()
                //Atualizar todos os layers??

                //console.log(circle)
                //mododestino = false;
            }else{
                zonaclicada = 0
                zona.resetStyle();
                info.update()
                
                //mododestino = true; 
            }
        };
        botao.addTo(map);
        
        var legend = L.control({position: 'bottomright'});

        legend.onAdd = function (map) {

            var div = L.DomUtil.create('div', 'info legend'),
                grades = [0, 10, 20, 50, 100, 150, 300, 500],
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