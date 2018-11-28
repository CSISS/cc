/**
 * Last updated by Gil Heo on 7/5/2016
 * 
 */

edu.gmu.csiss.gpkg.cmapi.map_feature_update = {

    responders : {

        googlemaps : function(sender, message, channel) 
        {
            if (sender != "googlemaps")
            {
                edu.gmu.csiss.gpkg.cmapi.map_feature_update.update( 
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
                edu.gmu.csiss.gpkg.cmapi.map_feature_update.update( 
                        "openlayers", message.featureId );
            } 
            else {
                // sent by itself, ignore it.
            }

        }

    },

    update: function( target, featureId ) 
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
            
            var feature = null;
            var index = -1;
            if ( overlay != null ) {
                for ( var i=0; i < overlay.features.length; i++ ) {
                    if ( overlay.features[i].featureId == message.featureId ) {
                        feature = overlay.features[i];
                        index = i;
                        break;
                    }
                }
            }

            if ( feature == null )
                return;


            if ( "name" in message )
                feature.name = name;

            if ( "newOverlayId" in message ) {
                var newOverlay = null;
                for ( var i=0; i < overlayList.length; i++ ) {
                    if ( overlayList[i].id == message.newOverlayId ) {
                        newOverlay = overlayList[i];
                        break;
                    }
                }
                
                if ( newOverlay == null ) {
                    edu.gmu.csiss.gpkg.cmapi.googlemap.createOverlay(
                        { "overlayId": message.newOverlayId }
                    );
                    
                    for ( var i=0; i < overlayList.length; i++ ) {
                        if ( overlayList[i].id == message.newOverlayId ) {
                            newOverlay = overlayList[i];
                            break;
                        }
                    }                        
                }
                
                if ( newOverlay != null ) {
                    overlay.features.splice( index, 1 );
                    newOverlay.features.push( feature );
                }
            }
        }
        else if ( target == "openlayers" )
        {
            // do nothing
        }
    },
    
    subscribe : function() 
    {
        cmajs.runtimes.browser.mediator.subscribe( 
        {
            channel : "map.feature.update",
            callback : function(sender, message, channel)
            {
                edu.gmu.csiss.gpkg.cmapi.map_feature_update.responders.googlemaps(sender, message, channel);
                edu.gmu.csiss.gpkg.cmapi.map_feature_update.responders.openlayers(sender, message, channel);
            }
        });
    },

    register : function()
    {
    },

    init : function()
    {
        edu.gmu.csiss.gpkg.cmapi.map_feature_update.subscribe();
        edu.gmu.csiss.gpkg.cmapi.map_feature_update.register();

        console.log("[map_feature_update] initialized");
    }
};
