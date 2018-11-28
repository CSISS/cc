/**
 * This file is created by Gil Heo on 6/2/2016
 * 
 */

edu.gmu.csiss.gpkg.cmapi.map_feature_selected_batch = {

    responders : {

        googlemaps : function(sender, message, channel) 
        {
            if (sender != "googlemaps")
            {
                for ( var i=0; i < message.features.length; i++ )
                {
                    var msg = { "featureId": message.features[i].featureId };
                    
                    if ( "selectedId" in message.features[i] )
                        msg.selectedId = message.features[i].selectedId;
                    
                    if ( "selectedName" in message.features[i] )
                        msg.selectedName = message.features[i].selectedName;
                    
                    if ( "overlayId" in message.features[i] )
                        msg.overlayId = message.features[i].overlayId;
                    else if ( "overlayId" in message )
                        msg.overlayId = message.overlayId;
                    
                    edu.gmu.csiss.gpkg.cmapi.map_feature_selected.responders.googlemaps(
                            sender, msg, channel );
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
                var msg = { "featureId": message.features[i].featureId };
                
                if ( "selectedId" in message.features[i] )
                    msg.selectedId = message.features[i].selectedId;
                
                if ( "selectedName" in message.features[i] )
                    msg.selectedName = message.features[i].selectedName;
                
                if ( "overlayId" in message.features[i] )
                    msg.overlayId = message.features[i].overlayId;
                else if ( "overlayId" in message )
                    msg.overlayId = message.overlayId;
                
                edu.gmu.csiss.gpkg.cmapi.map_feature_selected.responders.openlayers(
                        sender, msg, channel );            } 
            else {
                // sent by itself, ignore it.
            }

        }

    },
    
    subscribe : function() 
    {
        cmajs.runtimes.browser.mediator.subscribe( 
        {
            channel : "map.feature.selected.batch",
            callback : function(sender, message, channel)
            {
                edu.gmu.csiss.gpkg.cmapi.map_feature_selected_batch.responders.googlemaps(sender, message, channel);
                edu.gmu.csiss.gpkg.cmapi.map_feature_selected_batch.responders.openlayers(sender, message, channel);
            }
        });
    },

    register : function()
    {
    },

    init : function()
    {
        edu.gmu.csiss.gpkg.cmapi.map_feature_selected_batch.subscribe();
        edu.gmu.csiss.gpkg.cmapi.map_feature_selected_batch.register();

        console.log("[map_feature_selected_batch] initialized");
    }
};
