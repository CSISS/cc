/**
* This file is created by Chen Zhang on 6/6/2016
* 
* This is an implementation of channel: map_status_about
*/
edu.gmu.csiss.gpkg.cmapi.map_status_about = 
{
    // ------------------------------------------------------
    /**
     * Responder of each map to the received messages
     **/
    responder: {
        
        googlemaps: function( sender, message, channel )
        {
            if ( sender != "googlemaps" ) {
                
            } else {
                //sent by itself, ignore it.
            }
        },
        
        openlayers: function( sender, message, channel )
        {
            if ( sender != "openlayers" ) {
                
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
            channel: "map.status.about",
            callback: function( sender, message, channel ) {
                edu.gmu.csiss.gpkg.cmapi.map_status_about.responder.googlemaps( sender, message, channel );
                edu.gmu.csiss.gpkg.cmapi.map_status_about.responder.openlayers( sender, message, channel );
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
        // edu.gmu.csiss.gpkg.cmapi.googlemap.map.addListener('', function()
        // {
        //     var map = edu.gmu.csiss.gpkg.cmapi.googlemap.map;
                        
        //     cmajs.runtimes.browser.mediator.publish({
        //         sender: "googlemaps",
        //         channel: "map.status.about",
        //         message: {
                    
        //         }
        //     });
        // });
        
        // // register openlayers event
        // edu.gmu.csiss.gpkg.cmapi.openlayers.map.on( "", function () 
        // {
        //     var map = edu.gmu.csiss.gpkg.cmapi.openlayers.map;
                        
        //     cmajs.runtimes.browser.mediator.publish({
        //         sender: "openlayers",
        //         channel: "map.status.about",
        //         message: {
                    
        //         }
        //     });
        // });
    },
    
    
    // ------------------------------------------------------
    init : function() 
    {
        edu.gmu.csiss.gpkg.cmapi.map_status_about.subscribe();
        edu.gmu.csiss.gpkg.cmapi.map_status_about.register();
    }
        
};
