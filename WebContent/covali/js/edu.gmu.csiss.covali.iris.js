edu.gmu.csiss.covali.iris = {
    features: new Array(),

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
                var features = edu.gmu.csiss.covali.iris.features;

                stations.forEach(function (s) {
                    var lon = parseFloat(s.lon);
                    var lat = parseFloat(s.lat);

                    // var feature = new ol.Feature(new ol.geom.Point(ol.proj.fromLonLat([lon, lat])));
                    var feature = new ol.Feature(new ol.geom.Point([lon, lat]));
                    feature['station'] = s;
                    feature['lonlat'] = [lon, lat];

                    features.push(feature);
                })

                var source = new ol.source.Vector({
                    features: features,
                });

                var clusterSource = new ol.source.Cluster({
                    distance: 70,
                    source: source,
                });

                var styleCache = {};
                var clusters = new ol.layer.Vector({
                    name: 'IRIS',
                    title: 'IRIS Layer',
                    source: clusterSource,
                    style: function (feature) {
                        var size = (feature.get('features') || [1]).length;

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

                var currentProj = edu.gmu.csiss.covali.projection.leftmap.getView().projection_.code_;
                edu.gmu.csiss.covali.projection.reprojectPointsLayers(currentProj);

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
            offset: [0, -15],
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
                    '<div class="row"><a onclick="edu.gmu.csiss.covali.iris.showStationDialog(\''+ station.networkcode + '\', \'' + station.code + '\')"><b>' + data.length +  ' channels</b></a>';

                    target.append($(detailsHtml));

            }
        });

    },

    channelQueryString: function(dl) {
        var day = dl.find('.iris-day').val();

        var nextDay = new Date(day);
        nextDay.setDate(nextDay.getDate() + 1);

        var dd = nextDay.getUTCDate();
        var mm = nextDay.getUTCMonth() + 1;
        var y = nextDay.getUTCFullYear();

        if(mm < 10) mm = '0' + mm;
        if(dd < 10) dd = '0' + dd;

        nextDay = y + '-' + mm + '-' + dd;

        return 'net=' + dl.data('networkcode') +
        '&sta=' + dl.data('stationcode') +
        '&cha=' + dl.data('code') +
        '&loc=' + dl.data('location') +
        '&start=' + day + 'T00:00:00' +
        '&end=' + nextDay + 'T01:00:00';
    },

    showStationDialog: function(network, station) {
        // alert(network+station);
        $.ajax({
            dataType: 'json',
            url: '../web/iris/channels?network=' + network + '&station=' + station,
            success: function (data) {
                //
                // networkcode
                // code
                // jpegurl
                // geocsvurl
                // start
                // end
                // location
                // stationcode

                var html = '<div class="modal-body iris-station">';

                data.forEach(function(c, i) {
                    html += '<dl class="row" style="font-size: 14px; padding: 5px; margin:0px;" ' +
                            'data-networkcode="' + c['networkcode'] + '" ' +
                            'data-stationcode="' + c['stationcode'] + '" ' +
                            'data-code="' + c['code'] + '" ' +
                            'data-location="' + c['location'] + '"' +
                            '>';
                    html += '<span>' + c['code'] + ' (' + c['location'] + ')</span> ';

                    var id = c['networkcode'] + '-' + c['stationcode'] + '-' + c['code'] + '-' + c['location'];
                    // console.log(c['location']);
                    // var firstDay = c['start'].replace(/T\d\d:\d\d:\d\d/,'T23:59:59');
                    var firstDay = c['start'].replace(/T\d\d:\d\d:\d\d/,'');
                    html += '<input class="iris-day" size="10" value="' + firstDay + '" id="' + id + '-day"/> ';
                    html += '<a class="iris-cal" href="#"><img src="../images/cal.gif" width="16" height="16" border="0" alt="Pick a date"></a> ';
                    html += '<a class="iris-jpeg" href="#">[jpeg]' + '</a> ';
                    html += '<a class="iris-geocsv" href="#">[geocsv]' + '</a> ';

                    html += '</dl>';
                });

                html += '</div>';

                var dialogName = 'edu.gmu.csiss.covali.statistics.jsframe.Iris';
                var dialogTitle = 'IRIS Network ' + network + ' Station ' + station;
                edu.gmu.csiss.covali.menu.createDialog(dialogName, dialogTitle, html, 500, 1200, null, 100);

                $('.iris-cal').click(function(e){
                    var dl = $(this).parents('dl');
                    var inputId = dl.find('.iris-day').attr('id');
                    NewCal(inputId, 'yyyymmdd',false);
                });

                $('.iris-jpeg').click(function(e) {
                    var dl = $(this).parents('dl');
                    var src = 'http://service.iris.edu/irisws/timeseriesplot/1/query?';
                    src += edu.gmu.csiss.covali.iris.channelQueryString(dl);

                    var dialog = $(this).parents('.iris-station');
                    dialog.replaceWith('<img style="background: url(\'../images/loading1.gif\') no-repeat;min-height: 50px;min-width: 50px;" src="' + src + '"/>');
                });

                $('.iris-geocsv').click(function(e){
                    var dl = $(this).parents('dl');
                    var src = 'http://service.iris.edu/fdsnws/dataselect/1/query?';
                    src += edu.gmu.csiss.covali.iris.channelQueryString(dl);
                    src += '&format=geocsv.zip&nodata=404';

                    window.location = src;
                });

            }
        });
    }


}