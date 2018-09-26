/**
 * This file is created by Gil Heo on 6/1/2016
 * 
 */

edu.gmu.csiss.gpkg.cmapi.map_feature_show = {

    responders : {

        googlemaps : function(sender, message, channel) 
        {
            if (sender != "googlemaps") {
                var map = edu.gmu.csiss.gpkg.cmapi.googlemap.map;
                var feature = map.data.getFeatureById(message.featureId);
                feature.setVisible(true);
            }
            else {
                // sent by itself, ignore it.
            }

        },

        openlayers : function(sender, message, channel)
        {
            if (sender != "openlayers") 
            {
//                var map = edu.gmu.csiss.gpkg.cmapi.openlayers.map;
//                var value = edu.gmu.csiss.gpkg.cmapi.map_feature_common.getProperty( 
//                        "openlayers", message.featureId );
//
//                map.removeLayer(value.vectorLayer);
//                edu.gmu.csiss.gpkg.cmapi.map_feature_common.removeProperty( 
//                        "openlayers", message.featureId );
            } 
            else {
                // sent by itself, ignore it.
            }

        }

    },

    show: function( target, featureId ) 
    {
        if ( target == "googlemaps" )
        {
        }
        else if ( target == "openlayers" )
        {
        }
    },
    
    subscribe : function() 
    {
        cmajs.runtimes.browser.mediator.subscribe( 
        {
            channel : "map.feature.show",
            callback : function(sender, message, channel)
            {
                edu.gmu.csiss.gpkg.cmapi.map_feature_show.responders.googlemaps(sender, message, channel);
                edu.gmu.csiss.gpkg.cmapi.map_feature_show.responders.openlayers(sender, message, channel);
            }
        });
    },

    register : function()
    {
    },

    init : function()
    {
        edu.gmu.csiss.gpkg.cmapi.map_feature_show.subscribe();
        edu.gmu.csiss.gpkg.cmapi.map_feature_show.register();

        console.log("[map_feature_show] initialized");
    }
};
