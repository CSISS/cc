/**
* This file is created by Chen Zhang on 6/6/2016
* 
* This is an implementation of channel: map_status_request
*/
edu.gmu.csiss.gpkg.cmapi.map_status_request = 
{
    // ------------------------------------------------------
    /**
     * Responder of each map to the received messages
     **/
    responder: {
        
        googlemaps: function( sender, message, channel )
        {
            if ( sender != "googlemaps" ) {
                var status = [
                    "view", 
                    "ready", 
                    "teardown",
                    "mapswapinprogress"
                ];
            } else {
                //sent by itself, ignore it.
            }
        },
        
        openlayers: function( sender, message, channel )
        {
            if ( sender != "openlayers" ) {
                var status = [
                    "view", 
                    "ready", 
                    "teardown",
                    "mapswapinprogress"
                ];
                
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
            channel: "map.status.request",
            callback: function( sender, message, channel ) {
                edu.gmu.csiss.gpkg.cmapi.map_status_request.responder.googlemaps( sender, message, channel );
                edu.gmu.csiss.gpkg.cmapi.map_status_request.responder.openlayers( sender, message, channel );
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
        edu.gmu.csiss.gpkg.cmapi.googlemap.event.registerEvent("map_status_request");
        edu.gmu.csiss.gpkg.cmapi.googlemap.event.addListener('map_status_request', function()
        {                        
            cmajs.runtimes.browser.mediator.publish({
                sender: "googlemaps",
                channel: "map.status.request",
                message: {
                    "types": ["view", "format", "selected", "about", "initialization"]
                }
            });
        });
        
        // register openlayers event
        edu.gmu.csiss.gpkg.cmapi.openlayers.map.registerEvent("map_status_request");
        edu.gmu.csiss.gpkg.cmapi.openlayers.map.on( "map_status_request", function () 
        {                        
            cmajs.runtimes.browser.mediator.publish({
                sender: "openlayers",
                channel: "map.status.request",
                message: {
                    "types": ["view", "format", "selected", "about", "initialization"]
                }
            });
        });
    },
    
    
    // ------------------------------------------------------
    init : function() 
    {
        edu.gmu.csiss.gpkg.cmapi.map_status_request.subscribe();
        edu.gmu.csiss.gpkg.cmapi.map_status_request.register();
    }
            
};
