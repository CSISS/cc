/**
 * Last updated by Gil Heo on 7/5/2016
 * 
 */

edu.gmu.csiss.gpkg.cmapi.map_feature_unplot = {

    responders : {

        googlemaps : function(sender, message, channel) 
        {
            if (sender != "googlemaps") {
                edu.gmu.csiss.gpkg.cmapi.map_feature_unplot.remove( 
                        "googlemaps", message.featureId );
            }
            else {
                // sent by itself, ignore it.
            }

        },

        openlayers : function(sender, message, channel)
        {
            if (sender != "openlayers") 
            {
                edu.gmu.csiss.gpkg.cmapi.map_feature_unplot.remove( 
                        "openlayers", message.featureId );
            } 
            else {
                // sent by itself, ignore it.
            }

        }

    },
    
    remove: function( target, featureId ) 
    {
        if ( target == "googlemaps" )
        {
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
            
            if ( overlay != null ) {
                for ( var i=0; i < overlay.features.length; i++ ) {
                    if ( overlay.features[i].featureId == message.featureId ) {
                        overlay.features.splice(i, 1);
                        break;
                    }
                }
            }

            var map = edu.gmu.csiss.gpkg.cmapi.googlemap.map;
            
//            var feature = map.data.getFeatureById( featureId );
//
//            map.data.remove(feature);
            
            var value = edu.gmu.csiss.gpkg.cmapi.map_feature_common.getProperty( 
                    "googlemaps", featureId );
            
            for ( var i=0; i < value.featureArray.length; i++ ) {
                map.data.remove( value.featureArray[i] );
            }

            edu.gmu.csiss.gpkg.cmapi.map_feature_common.removeProperty( 
                    "googlemaps", featureId );            
        }
        else if ( target == "openlayers" )
        {
            var map = edu.gmu.csiss.gpkg.cmapi.openlayers.map;
            var value = edu.gmu.csiss.gpkg.cmapi.map_feature_common.getProperty( 
                    "openlayers", featureId );

            map.removeLayer(value.vectorLayer);
            
            edu.gmu.csiss.gpkg.cmapi.map_feature_common.removeProperty( 
                    "openlayers", featureId );
        }
    },
    
    subscribe : function() 
    {
        cmajs.runtimes.browser.mediator.subscribe( 
        {
            channel : "map.feature.unplot",
            callback : function(sender, message, channel)
            {
                edu.gmu.csiss.gpkg.cmapi.map_feature_unplot.responders.googlemaps(sender, message, channel);
                edu.gmu.csiss.gpkg.cmapi.map_feature_unplot.responders.openlayers(sender, message, channel);
            }
        });
    },

    register : function()
    {
        // do nothing
    },

    init : function()
    {
        edu.gmu.csiss.gpkg.cmapi.map_feature_unplot.subscribe();
        edu.gmu.csiss.gpkg.cmapi.map_feature_unplot.register();

        console.log("[map_feature_unplot] initialized");
    }
};
