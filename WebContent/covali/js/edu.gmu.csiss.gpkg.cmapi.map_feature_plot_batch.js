/**
 * This file is created by Gil Heo on 6/2/2016
 * 
 */

edu.gmu.csiss.gpkg.cmapi.map_feature_plot_batch = {

    responders : {

        googlemaps : function(sender, message, channel) 
        {
            if (sender != "googlemaps")
            {
                for ( var i=0; i < message.features.length; i++ )
                {
                    message.features[i].format = message.format;
                    message.features[i].overlayId = message.overlayId;

                    edu.gmu.csiss.gpkg.cmapi.map_feature_plot.responders.googlemaps(
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
                for ( var i=0; i < message.features.length; i++ )
                {
                    message.features[i].format = message.format;
                    message.features[i].overlayId = message.overlayId;

                    edu.gmu.csiss.gpkg.cmapi.map_feature_plot.responders.openlayers(
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
            channel : "map.feature.plot.batch",
            callback : function(sender, message, channel)
            {
                edu.gmu.csiss.gpkg.cmapi.map_feature_plot_batch.responders.googlemaps(sender, message, channel);
                edu.gmu.csiss.gpkg.cmapi.map_feature_plot_batch.responders.openlayers(sender, message, channel);
            }
        });
    },

    register : function()
    {
    },

    init : function()
    {
        edu.gmu.csiss.gpkg.cmapi.map_feature_plot_batch.subscribe();
        edu.gmu.csiss.gpkg.cmapi.map_feature_plot_batch.register();

        console.log("[map_feature_plot_batch] initialized");
    }
};
