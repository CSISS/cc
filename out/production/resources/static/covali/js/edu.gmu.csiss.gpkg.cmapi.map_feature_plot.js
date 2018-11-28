/**
 * Last updated by Gil Heo on 7/5/2016
 * 
 */

edu.gmu.csiss.gpkg.cmapi.map_feature_plot = {

    responders : {

        googlemaps : function(sender, message, channel)
        {

            if ( sender != "googlemaps" ) 
            {
                // execute once in all responders
                edu.gmu.csiss.gpkg.cmapi.map_feature_common.appendFeatureId( 
                        message.featureId );
                
                var map = edu.gmu.csiss.gpkg.cmapi.googlemap.map;
                var value = {
                    "message": message
                };

                if ( !("overlayId" in message) )
                    message.overlayId = edu.gmu.csiss.gpkg.cmapi.map_feature_common.properties.widgetId;

                var overlayList = edu.gmu.csiss.gpkg.cmapi.googlemap.overlaylist;
                var overlay = null;
                
                for ( var i=0; i < overlayList.length; i++ ) {
                    if ( overlayList[i].id == message.overlayId ) {
                        overlay = overlayList[i];
                        break;
                    }
                }
                
                if ( overlay == null ) {
                    edu.gmu.csiss.gpkg.cmapi.googlemap.createOverlay(
                        { "overlayId": message.overlayId, "name": "widgetID" }
                    );
                    
                    for ( var i=0; i < overlayList.length; i++ ) {
                        if ( overlayList[i].id == message.overlayId ) {
                            overlay = overlayList[i];
                            break;
                        }
                    }                        
                }

                if ( overlay != null )
                    overlay.features.push( message );
                
                if ( !("format" in message) )
                    message.format = "kml";
                    
                if ( message.format == "geojson" ) 
                {
//                    message.feature.id = message.featureId;
                    var featureArray = map.data.addGeoJson(message.feature);
                    var style = edu.gmu.csiss.gpkg.cmapi.map_feature_common.getProperty( 
                            "googlemaps", "normalStyle" );
                    
                    for ( var i=0; i < featureArray.length; i++ )
                    {
                        map.data.overrideStyle( featureArray[i], style );
                    }

                    value.featureArray = featureArray; 
                }
                else if ( message.format == "kml")
                {
                    // do something for KML
                }
                
                edu.gmu.csiss.gpkg.cmapi.map_feature_common.setProperty( 
                        "googlemaps", message.featureId, value );
                
//                console.log( "[" + channel + ":googlemaps] is done" );
            }
            else {
                // sent by itself, ignore it.
            }

        },

        openlayers : function(sender, message, channel)
        {

            if ( sender != "openlayers" ) 
            {
                var map = edu.gmu.csiss.gpkg.cmapi.openlayers.map;
                var value = {
                    "message": message
                };

                
                if ( !("overlayId" in message) )
                    message.overlayId = edu.gmu.csiss.gpkg.cmapi.map_feature_common.properties.widgetId;
/*
                var overlayList = map.getLayers().getArray();
                
                for ( var i=0; i < overlayList.length; i++ ) {
                    console.log( "overlayId=" + overlayList[i].get( "overlayId" ) );
                }
*/
                
                
                
                if ( !("format" in message) )
                    message.format = "kml";
                
                
                if ( message.format == "geojson" )
                {
                    message.feature.id = message.featureId;

                    var vectorSource = new ol.source.Vector({
                        features : (new ol.format.GeoJSON()).readFeatures(
                            message.feature,
                            {
                                featureProjection : 'EPSG:3857',
                                dataProjection : 'EPSG:4326'
                            })
                    });
                    value.vectorSource = vectorSource;

                    var vectorLayer = new ol.layer.Vector({
                        "source" : vectorSource,
                        "id" : message.featureId
                    });

                    map.addLayer(vectorLayer);
                    value.vectorLayer = vectorLayer;
                }
                else if ( message.format == "kml" ) 
                {
                    message.feature.id = message.featureId;

                    var vectorSource = new ol.source.Vector({
                        features: (new ol.format.KML()).readFeatures(
                            message.feature,
                            {
                                featureProjection : 'EPSG:3857',
                                dataProjection : 'EPSG:4326'
                            })
                    });
                    value.vectorSource = vectorSource;                    

                    var vectorLayer = new ol.layer.Vector({
                        "source" : vectorSource,
                        "id" : message.featureId
                    });
                    value.vectorLayer = vectorLayer;

                    map.addLayer(vectorLayer);
                }
                
                var style = edu.gmu.csiss.gpkg.cmapi.map_feature_common.getProperty( 
                        "openlayers", "normalStyle" );    
                value.vectorLayer.setStyle( style );
                
                edu.gmu.csiss.gpkg.cmapi.map_feature_common.setProperty( 
                    "openlayers", message.featureId, value );
                
//                console.log( "[" + channel + ":openlayers] is done" );
            }
            else {
                // sent by itself, ignore it.
            }

        }

    },

    subscribe : function()
    {
        cmajs.runtimes.browser.mediator.subscribe({
            channel : "map.feature.plot",
            callback : function(sender, message, channel)
            {
                edu.gmu.csiss.gpkg.cmapi.map_feature_plot.responders.googlemaps(sender, message, channel);
                edu.gmu.csiss.gpkg.cmapi.map_feature_plot.responders.openlayers(sender, message, channel);
            }
        });
    },

    register : function()
    {
    },

    init : function()
    {
        edu.gmu.csiss.gpkg.cmapi.map_feature_plot.subscribe();
        edu.gmu.csiss.gpkg.cmapi.map_feature_plot.register();
           
        console.log("[map_feature_plot] initialized");
    }
};
