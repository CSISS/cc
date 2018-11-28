/**
 * This file is created by Gil Heo on 6/2/2016
 * 
 */

edu.gmu.csiss.gpkg.cmapi.map_feature_unplot_batch = {

    responders : {

        googlemaps : function(sender, message, channel) 
        {
            console.log( "[map.feature.unplot.batch] called " );
            
            if (sender != "googlemaps")
            {
                var overlayId = ( "overlayId" in message ) ? true : false;
                        
                for ( var i=0; i < message.features.length; i++ )
                {
                    if ( overlayId )
                        message.features[i].overlayId = message.overlayId;

                    edu.gmu.csiss.gpkg.cmapi.map_feature_unplot.responders.googlemaps(
                            sender, 
                            message.features[i],
                            channel);
                }
            }
            else {
                // sent by itself, ignore it.
            }

        },

        openlayers : function(sender, message, channel)
        {
            if (sender != "openlayers") 
            {
                var overlayId = ( "overlayId" in message ) ? true : false;
                
                for ( var i=0; i < message.features.length; i++ )
                {
                    if ( overlayId )
                        message.features[i].overlayId = message.overlayId;

                    edu.gmu.csiss.gpkg.cmapi.map_feature_unplot.responders.openlayers(
                            sender, 
                            message.features[i],
                            channel);
                }
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
            channel : "map.feature.unplot.batch",
            callback : function(sender, message, channel)
            {
                edu.gmu.csiss.gpkg.cmapi.map_feature_unplot_batch.responders.googlemaps(sender, message, channel);
                edu.gmu.csiss.gpkg.cmapi.map_feature_unplot_batch.responders.openlayers(sender, message, channel);
            }
        });
    },

    register : function()
    {
    },

    init : function()
    {
        edu.gmu.csiss.gpkg.cmapi.map_feature_unplot_batch.subscribe();
        edu.gmu.csiss.gpkg.cmapi.map_feature_unplot_batch.register();

        console.log("[map_feature_unplot_batch] initialized");
    }
};
