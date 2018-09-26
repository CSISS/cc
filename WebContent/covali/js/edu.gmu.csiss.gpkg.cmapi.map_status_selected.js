/**
* This file is created by Chen Zhang on 6/6/2016
* 
* This is an implementation of channel: map_status_selected
*/
edu.gmu.csiss.gpkg.cmapi.map_status_selected = 
{
    // ------------------------------------------------------
    /**
     * Responder of each map to the received messages
     **/
    responder: {
        
        googlemaps: function( sender, message, channel )
        {
            if ( sender != "googlemaps" ) {

                var selected = edu.gmu.csiss.gpkg.cmapi.map_feature_common.getSelected();
                
                if ( selected.length == 1 ) {
                     var msg = selected[0];  // 1 payload object
                }                   
                else {
                    var msg = selected;   // array of payloads
                }                    
                
            } else {
                //sent by itself, ignore it.
            }
        },
        
        openlayers: function( sender, message, channel )
        {
            if ( sender != "openlayers" ) {
                var selected = edu.gmu.csiss.gpkg.cmapi.map_feature_common.getSelected();

                if ( selected.length == 1 ) {
                    var msg = selected[0];  // 1 payload object
                }                    
                else {
                    var msg = selected;   // array of payloads
                }                    

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
            channel: "map.status.selected",
            callback: function( sender, message, channel ) {
                edu.gmu.csiss.gpkg.cmapi.map_status_selected.responder.googlemaps( sender, message, channel );
                edu.gmu.csiss.gpkg.cmapi.map_status_selected.responder.openlayers( sender, message, channel );
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
        //         channel: "map.status.selected",
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
        //         channel: "map.status.selected",
        //         message: {
                    
        //         }
        //     });
        // });
    },
    
    
    // ------------------------------------------------------
    init : function() 
    {
        edu.gmu.csiss.gpkg.cmapi.map_status_selected.subscribe();
        edu.gmu.csiss.gpkg.cmapi.map_status_selected.register();
    }
        
};
