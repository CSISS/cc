edu.gmu.csiss.covali.iris = {
    calculateStyle: function(size) {
        var radius = Math.min(25, Math.log(size) * 5);
        radius = Math.max(10, radius);
        // console.log(feature.get('features')[0].station);

        if(size > 1) {
            // cluster circles
            var style = new ol.style.Style({
                image: new ol.style.Circle({
                    radius: radius,
                    stroke: new ol.style.Stroke({
                        color: '#909',
                        width: 1

                    }),
                    fill: new ol.style.Fill({
                        color: '#3399CC'
                    })
                }),
                text: new ol.style.Text({
                    text: size.toString(),
                    fill: new ol.style.Fill({
                        color: '#fff'
                    })
                })
            });
        } else {
            // single station
            var style = new ol.style.Style({
                image: new ol.style.RegularShape({
                    radius: 10,
                    points: 3,
                    stroke: new ol.style.Stroke({
                        color: '#000',
                        width: 1
                    }),
                    fill: new ol.style.Fill({
                        color: '#909'
                    })
                })

            });

        }

        return style;
    },

    init: function() {
        $.ajax({

            dataType: 'json',

            url: '../web/iris/stations',

            success: function(stations, text, jxhr) {
                BootstrapDialog.closeAll();

                var features = new Array();

                stations.forEach(function (s) {
                    var lon = parseFloat(s.lon);
                    var lat = parseFloat(s.lat);

                    var feature = new ol.Feature(new ol.geom.Point(ol.proj.fromLonLat([lon, lat])))
                    feature['station'] = s;

                    features.push(feature);
                })

                var source = new ol.source.Vector({
                    features: features
                });

                var clusterSource = new ol.source.Cluster({
                    distance: 70,
                    source: source
                });

                var styleCache = {};
                var clusters = new ol.layer.Vector({
                    name: 'IRIS',
                    title: 'IRIS Layer',
                    source: clusterSource,
                    style: function (feature) {
                        var size = feature.get('features').length;

                        var style = styleCache[size];
                        if (!style) {
                            style = edu.gmu.csiss.covali.iris.calculateStyle(size);
                            styleCache[size] = style;
                        }
                        return style;
                    }
                });

                var map1 = edu.gmu.csiss.covali.map.getMapBySide('left');
                var map2 = edu.gmu.csiss.covali.map.getMapBySide('right');


                map1.addLayer(clusters);
                map2.addLayer(clusters);

                edu.gmu.csiss.covali.map.updateCaption('left', 'IRIS Layer');
                edu.gmu.csiss.covali.map.updateCaption('right', 'IRIS Layer');

                var select1 = new ol.interaction.Select();
                var select2 = new ol.interaction.Select();

                var selectedFeatures1 = select1.getFeatures();
                var selectedFeatures2 = select2.getFeatures();

                selectedFeatures1.on('add', function(){
                    var feature = selectedFeatures1.pop();
                    edu.gmu.csiss.covali.iris.featureClicked(feature, 'left');

                });

                selectedFeatures2.on('add', function(){
                    var feature = selectedFeatures2.pop();
                    edu.gmu.csiss.covali.iris.featureClicked(feature, 'right');
                });


                map1.addInteraction(select1);
                map2.addInteraction(select2);

            }
        });
    },

    featureClicked: function(feature, mapside) {
        var size = feature.get('features').length;
        if(size == 1) {
            edu.gmu.csiss.covali.iris.showPopup(feature, mapside);
        }
    },

    showPopup: function(feature, side) {
        var station = feature.get('features')[0].station;
        var map = edu.gmu.csiss.covali.map.getMapBySide(side);

        var popupElement = $('<div class="ol-popup"></div>');
        var popupCloser = $('<a href="#" class="ol-popup-closer"></a>');
        var popupContent = $('<div class="popup-content"></div>');

        popupCloser.appendTo(popupElement);
        popupContent.appendTo(popupElement);

        popupElement.appendTo($('body'));


        var popupOverlay = new ol.Overlay({
            element: popupElement[0],
            insertFirst: false,
            autoPan: true,
            offset: [-18, -50],
            autoPanAnimation: {
                duration: 250
            }
        });

        var coords = feature.getGeometry().getCoordinates();
        popupOverlay.setPosition(coords);
        map.addOverlay(popupOverlay);

        popupCloser.click(function() {
            popupElement.remove();
            map.removeOverlay(popupOverlay);
        });

        edu.gmu.csiss.covali.iris.loadStationDetails(station, popupContent);

    },

    loadStationDetails: function(station, target) {
        var urlquery = 'station=' + station.code + '&network=' + station.networkcode;
        $.ajax({
            dataType: 'json',

            url: '../web/iris/channels?' + urlquery,

            success: function(data) {
                var numstations = data.length;

                var detailsHtml =
                    '<div class="row"><h5><b>Network:</b> ' + station.networkcode + '</h5></div>' +
                    '<div class="row"><h5><b>Station:</b> ' + station.code + '</h5></div>' +
                    '<div class="row"><a href="../web/iris/channelsdetails?' + urlquery + '"><b>' + data.length +  ' channels</b></a>';

                    target.append($(detailsHtml));

            }
        });

    }


}