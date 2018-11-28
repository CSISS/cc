/**
 * This file is created by Gil Heo on 6/2/2016
 * 
 */

edu.gmu.csiss.gpkg.cmapi.map_feature_plot_url = {

    responders : {

        googlemaps : function(sender, message, channel) 
        {
            if (sender != "googlemaps")
            {
                var map = edu.gmu.csiss.gpkg.cmapi.googlemap.map;
                var value = {
                    "message": message
                };
                
                if ( !("format" in message) )
                    message.format = "kml";

                if ( message.format == "geojson" ) 
                {
//                    message.feature.id = message.featureId;
                    var featureArray = map.data.loadGeoJson(message.url);
                    
                    value.featureArray = featureArray; 
                }
                else if ( message.format == "kml" )
                {
                    var layer = new google.maps.KmlLayer({
                        url: message.url,
                        map: map
                      });                        
                    
                    value.layer = layer
                }
                else if ( message.format == "wms" )
                {
                    // to do
                }
                
                edu.gmu.csiss.gpkg.cmapi.map_feature_common.setProperty( 
                        "googlemaps", message.featureId, value );
                
                console.log( "[" + channel + ":googlemaps] is done" );
            }
            else {
                // sent by itself, ignore it.
            }

        },

        openlayers : function(sender, message, channel)
        {
            if (sender != "openlayers") 
            {
                console.log( "[" + channel + ":openlayers] is called" );
                
                var map = edu.gmu.csiss.gpkg.cmapi.openlayers.map;
                var value = {
                    "message": message
                };
                
                if ( !("format" in message) )
                    message.format = "kml";

                if ( message.format == "geojson" ) 
                {
//                    message.feature.id = message.featureId;
                    var featureArray = map.data.loadGeoJson(message.url);
                    
                    value.featureArray = featureArray; 
                }
                else if ( message.format == "kml" )
                {
                    var vectorSource = new ol.source.Vector({
                        featureProjection : 'EPSG:3857',
                        dataProjection : 'EPSG:4326',
                        url: message.url,
                        format: new ol.format.KML()
                    });
                    value.vectorSource = vectorSource;                    

                    var vectorLayer = new ol.layer.Vector({
                        "source" : vectorSource,
                        "id" : message.featureId
                    });
                    value.vectorLayer = vectorLayer;

                    map.addLayer(vectorLayer);
                }
                else if ( message.format == "wms" )
                {
                    // to do
                }
                
                edu.gmu.csiss.gpkg.cmapi.map_feature_common.setProperty( 
                        "openlayers", message.featureId, value );
                
                console.log( "[" + channel + ":openlayers] is done" );
            } 
            else {
                // sent by itself, ignore it.
            }

        }

    },
    
    subscribe : function() 
    {
        cmajs.runtimes.browser.mediator.subscribe( 
        {
            channel : "map.feature.plot.url",
            callback : function(sender, message, channel)
            {
                edu.gmu.csiss.gpkg.cmapi.map_feature_plot_url.responders.googlemaps(sender, message, channel);
                edu.gmu.csiss.gpkg.cmapi.map_feature_plot_url.responders.openlayers(sender, message, channel);
            }
        });
    },

    register : function()
    {
    },

    init : function()
    {
        edu.gmu.csiss.gpkg.cmapi.map_feature_plot_url.subscribe();
        edu.gmu.csiss.gpkg.cmapi.map_feature_plot_url.register();

        console.log("[map_feature_plot_url] initialized");
    }
};
