/**
* This file is created by Chen Zhang on 5/22/2016
* 
* This is an implementation of channel: map_view_center_overlay
*/

edu.gmu.csiss.gpkg.cmapi.map_view_center_overlay = 
{
    // ------------------------------------------------------
    /**
     * Responder of each map to the received messages
     **/
    responder: {
        
        googlemaps: function( sender, message, channel )
        {
            if ( sender != "googlemaps" ) {
                var map = edu.gmu.csiss.gpkg.cmapi.googlemap.map;
                var overlay = map.data.getFeatureById(message.overlayId);
                var lon = overlay.getCenter().lng();
                var lat = overlay.getCenter().lat();
                map.setCenter([lat,lng]);        
            } else {
                //sent by itself, ignore it.
            }
        },
        
        openlayers: function( sender, message, channel )
        {
            if ( sender != "openlayers" ) {
                var map = edu.gmu.csiss.gpkg.cmapi.openlayers.map;                               
                var overlay = edu.gmu.csiss.gpkg.cmapi.openlayers.map.getOverlayById(message.overlayId);                
                var lon = overlay.getPosition[0];
                var lat = overlay.getPosition[1];
                map.getView().setCenter(
                    ol.proj.transform( [lon, lat], 'EPSG:4326', 'EPSG:3857') );
                
            } else {
                //sent by itself, ignore it.
            }
        }
    },
    
    // ------------------------------------------------------
    /**
     * Subscribe the two maps to CMAPI
     **/
    subscribe: function()
    {
        cmajs.runtimes.browser.mediator.subscribe( 
        { 
            channel: "map.view.center.overlay",
            callback: function( sender, message, channel ) {
                edu.gmu.csiss.gpkg.cmapi.map_view_center_overlay.responder.googlemaps( sender, message, channel );
                edu.gmu.csiss.gpkg.cmapi.map_view_center_overlay.responder.openlayers( sender, message, channel );
            }
        });
    },
    
    // ------------------------------------------------------
    /**
     * register googlemaps and openlayers event
     **/
    register: function()
    {
        // register googlemaps event
        edu.gmu.csiss.gpkg.cmapi.googlemap.event.registerEvent("map.view.center.overlay");
        edu.gmu.csiss.gpkg.cmapi.googlemap.event.addListener("map.view.center.overlay", function(ol)
        {
            var map = edu.gmu.csiss.gpkg.cmapi.googlemap.map;
            
            cmajs.runtimes.browser.mediator.publish({                
                sender: "googlemaps",
                channel: "map.view.center.overlay",
                message: {
                     "overlayId": ol.getId()
                }
            });
        });
        
        // register openlayers event
        edu.gmu.csiss.gpkg.cmapi.openlayers.event.registerEvent("map.view.center.overlay");
        edu.gmu.csiss.gpkg.cmapi.openlayers.event.addListener( "map.view.center.overlay", function (ol)
        {
            // var overlay = edu.gmu.csiss.gpkg.cmapi.openlayers.overlay;
            // var id = overlay.id;
            
            cmajs.runtimes.browser.mediator.publish({
                sender: "openlayers",
                channel: "map.view.center.overlay",
                message: {
                     "overlayId": ol.getId()
                }
            });
        });
    },
    
    
    // ------------------------------------------------------
    init : function() 
    {
        edu.gmu.csiss.gpkg.cmapi.map_view_center_overlay.subscribe();
        edu.gmu.csiss.gpkg.cmapi.map_view_center_overlay.register();
    }
        
};
