/**
 * This file is created by Gil Heo on 6/1/2016
 * 
 */

edu.gmu.csiss.gpkg.cmapi.map_feature_hide = {

    responders : {

        googlemaps : function(sender, message, channel) 
        {
            if (sender != "googlemaps") 
            {
                edu.gmu.csiss.gpkg.cmapi.map_feature_hide.hide( 
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
                edu.gmu.csiss.gpkg.cmapi.map_feature_hide.hide( 
                    "openlayers", message.featureId );
            } 
            else {
                // sent by itself, ignore it.
            }

        }

    },

    hide: function( target, featureId ) 
    {
        console.log( "[map_feature_hide:" + target + "] called" );

        var value = edu.gmu.csiss.gpkg.cmapi.map_feature_common.getProperty( 
                target, featureId );

        edu.gmu.csiss.gpkg.cmapi.map_feature_unplot.responders[target](
                "", value.message, "map.feature.hide" );
/*        
        if ( target == "googlemaps" )
        {
            var value = edu.gmu.csiss.gpkg.cmapi.map_feature_common.getProperty( 
                    target, featureId );
            
            edu.gmu.csiss.gpkg.cmapi.map_feature_unplot.responders.googlemaps(
                    sender, 
                    value.message,
                    channel);            
        }
        else if ( target == "openlayers" )
        {
            var value = edu.gmu.csiss.gpkg.cmapi.map_feature_common.getProperty( 
                    "openlayers", featureId );
            
            edu.gmu.csiss.gpkg.cmapi.map_feature_unplot.responders.openlayers(
                    sender, 
                    value.message,
                    channel);            
        }
*/
    },
    
    subscribe : function() 
    {
        cmajs.runtimes.browser.mediator.subscribe( 
        {
            channel : "map.feature.hide",
            callback : function(sender, message, channel)
            {
                edu.gmu.csiss.gpkg.cmapi.map_feature_hide.responders.googlemaps(sender, message, channel);
                edu.gmu.csiss.gpkg.cmapi.map_feature_hide.responders.openlayers(sender, message, channel);
            }
        });
    },

    register : function()
    {
    },

    init : function()
    {
        edu.gmu.csiss.gpkg.cmapi.map_feature_hide.subscribe();
        edu.gmu.csiss.gpkg.cmapi.map_feature_hide.register();

        console.log("[map_feature_hide] initialized");
    }
};
