/**
 * This file is created by Gil Heo on 7/5/2016
 * 
 */

edu.gmu.csiss.gpkg.cmapi.map_feature_deselected = {

    responders : {

        googlemaps : function(sender, message, channel) 
        {
            if (sender != "googlemaps")
            {
                var map = edu.gmu.csiss.gpkg.cmapi.googlemap.map;
                var selected = edu.gmu.csiss.gpkg.cmapi.map_feature_common.properties.selectedFeatures;
                
                var value = edu.gmu.csiss.gpkg.cmapi.map_feature_common.getProperty( 
                        "googlemaps", message.featureId );

                var style = edu.gmu.csiss.gpkg.cmapi.map_feature_common.getProperty( 
                        "googlemaps", "normalStyle" );
                
                if ( "featureArray" in value ) 
                {
                    for ( var i=0; i < value.featureArray.length; i++ )
                        map.data.overrideStyle( value.featureArray[i], style );
                }
                else if ( "layer" in value ) {
                    map.data.overrideStyle( value.layer, style );
                }

//                console.log( "[" + channel + ":googlemaps] is done" );            
            }
            else {
                // sent by itself, ignore it.
            }

        },

        openlayers : function(sender, message, channel)
        {
            if (sender != "openlayers") 
            {
                var map = edu.gmu.csiss.gpkg.cmapi.openlayers.map;
                
                var value = edu.gmu.csiss.gpkg.cmapi.map_feature_common.getProperty( 
                        "openlayers", message.featureId );

                var style = edu.gmu.csiss.gpkg.cmapi.map_feature_common.getProperty( 
                        "openlayers", "normalStyle" );

                value.vectorLayer.setStyle( style );
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
            channel : "map.feature.deselected",
            callback : function(sender, message, channel)
            {
                edu.gmu.csiss.gpkg.cmapi.map_feature_deselected.responders.googlemaps(sender, message, channel);
                edu.gmu.csiss.gpkg.cmapi.map_feature_deselected.responders.openlayers(sender, message, channel);
            }
        });
    },

    register : function()
    {
    },

    init : function()
    {
        edu.gmu.csiss.gpkg.cmapi.map_feature_deselected.subscribe();
        edu.gmu.csiss.gpkg.cmapi.map_feature_deselected.register();

        console.log("[map_feature_deselected] initialized");
    }
};
