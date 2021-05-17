

        var trail, cic2;

        var ODBike = new Array();
        var tamanhoodbike = 0;
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

        $(document).ready(function() {
        // AJAX in the data file
            $.ajax({
                type: "GET",
                url: "arquivos/OD/arq.csv",
                dataType: "text",
                success: function(data) {processData(data);}
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
            odcarregado = 1
            //console.log(ODBike)

            zona = L.geoJSON(zonas, {
                style: style,
                onEachFeature: onEachFeature
            });
            zona.addTo(map);

            // For display
            }
        });

        var dicionario = new Map();
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
            for(;i < tamanhoodbike; i++){
                var num  = ODBike[i][0];
                //if(num + 50 < codzona && num+50 < 1200){
                //    i = i + 50
                //}
                if(num > codzona){
                    break;
                }else{
                    if(num == codzona){
                        //console.log('achou');
                        var tradu = ODBike[i][1];
                        if(num != tradu){
                            deslocs = deslocs+ODBike[i][2];
                        }
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
        
        var info = L.control();
        info.onAdd = function (map) {
            this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
            this.update();
            return this._div;
        };

        info.update = function (props) {
            this._div.innerHTML = '<h4>Zonas e deslocamento no recife</h4>' +  (props ?
                '<b>' + 'Zona de número: ' +props.CODIGOZONA + '</b><br />'  
                + 'Quantidade total de deslocamentos:' + dicionario.get(props.CODIGOZONA).toFixed(3).toLocaleString('pt-BR')
                 : 'Selecione uma zona');
        };

        info.addTo(map);
        
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