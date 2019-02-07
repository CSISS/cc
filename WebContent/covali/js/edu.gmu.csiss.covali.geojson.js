edu.gmu.csiss.covali.geojson = {
    showGeoJSONFeatureData: function(feature) {
        var ps = feature.getProperties();

        var readings = ps.geojson.measurements_in_file;
        var date_start = ps.geojson.data[0].time;
        var date_end = ps.geojson.data.slice(-1)[0].time

        var variable_names = ps.geojson.data[0].vars.map(a => a.variable_name);



        BootstrapDialog.closeAll();

        BootstrapDialog.show({

            cssClass: 'dialog-vertical-center size-large',

            title: ps.name,

            message: function (dialog) {
                return `<div class="row"><div class="col-md-12"><h4><b>From:</b> ${ps.url}</h4></div></div>
                        <div class="row"><div class="col-md-12"><h4><b>Site:</b> ${ps.geojson.site}</h4></div></div>
                        <div class="row"><div class="col-md-12"><h4><b>Instrument:</b> ${ps.geojson.instrument}</h4></div></div>                    
                        <div class="row"><div class="col-md-12"><h4><b>Date Range:</b> ${date_start} -- ${date_end}</h4></div></div>
                        <div class="row"><div class="col-md-12"><h4><b>Variables:</b> </br>${variable_names.join("</br>")}</h4></div></div>`;

            },
            buttons: [{
                label: 'Close',
                action: function(dialogItself){
                    dialogItself.close();
                }
            }]
        });
    },

    addGeoJSONFeature: function(url) {
        $.ajax({

            contentType: "application/json",

            type: "GET",

            url: url,

            success: function(obj, text, jxhr)
            {
                // var gs = JSON.parse(obj);
                var gs = (new ol.format.GeoJSON()).readFeatures(obj)
                var feature = gs[0];
                var point = feature.getGeometry();

                var coords = ol.proj.fromLonLat(point.getCoordinates().map(parseFloat));
                point.setCoordinates(coords);

                var name = feature.getProperties().site;

                var feature = new ol.Feature({
                    geometry: point,
                    name: feature.getProperties().site,
                    geojson: feature.getProperties(),
                    url: url
                });

                var style = new ol.style.Style({
                    image: new ol.style.Icon(/** @type {module:ol/style/Icon~Options} */ ({
                        anchor: [40, 52],
                        anchorXUnits: 'pixels',
                        anchorYUnits: 'pixels',
                        src: 'http://localhost:8080/CyberConnector/covali/img/chords-marker.png'
                    }))
                });

                feature.setStyle(style);

                var vectorSource = new ol.source.Vector({
                    features: [feature]
                });

                var vectorLayer = new ol.layer.Vector({
                    source: vectorSource,
                    name: name
                });

                var select = new ol.interaction.Select();


                var selectedFeatures = select.getFeatures();
                selectedFeatures.on('add', function(){
                    var feature = selectedFeatures.pop();
                    edu.gmu.csiss.covali.geojson.showGeoJSONFeatureData(feature);
                });

                var map1 = edu.gmu.csiss.covali.map.getMapBySide('left');
                var map2 = edu.gmu.csiss.covali.map.getMapBySide('right');

                map1.addInteraction(select);
                map2.addInteraction(select);


                map1.addLayer(vectorLayer);
                map2.addLayer(vectorLayer);


                map1.on('pointermove', function(evt) {
                    map1.getTargetElement().style.cursor =
                        map1.hasFeatureAtPixel(evt.pixel) ? 'pointer' : '';
                });

                map2.on('pointermove', function(evt) {
                    map2.getTargetElement().style.cursor =
                        map2.hasFeatureAtPixel(evt.pixel) ? 'pointer' : '';
                });

            }
        });
    }
}

