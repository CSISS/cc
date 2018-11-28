/**
* This file is created by Chen Zhang on 6/6/2016
* 
* This is an implementation of channel: map_status_view
*/
edu.gmu.csiss.gpkg.cmapi.map_status_view = 
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

                //bounds                
                var bounds = map.getBounds();
                //console.log("google map bounds: ", bounds);

                //center
                var center = map.getCenter();

                //range
                var range = map.getZoom();

                //requester (optional)

                //time (optional)

               
            } else {
                //sent by itself, ignore it.
            }
        },
        
        openlayers: function( sender, message, channel )
        {
            if ( sender != "openlayers" ) {
                var map = edu.gmu.csiss.gpkg.cmapi.openlayers.map;

                //bounds     
                var extent = map.getView().calculateExtent(map.getSize());
                var bottomLeft = ol.proj.transform(ol.extent.getBottomLeft(extent),
                    'EPSG:3857', 'EPSG:4326');
                var topRight = ol.proj.transform(ol.extent.getTopRight(extent),
                    'EPSG:3857', 'EPSG:4326');           
                var bounds = {
                    "southWest": {
                        "lat": bottomLeft[1],
                        "lon": bottomLeft[0]
                    },
                    "northEast": {
                        "lat": topRight[1],
                        "lon": topRight[0]
                    }
                }
                //console.log("ol bounds: ", bounds);
                
                //center
                var center = map.getView().getCenter();

                //range
                var range = map.getView().getZoom();

                //requester (optional)


                //time (optional)


                
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
            channel: "map.status.view",
            callback: function( sender, message, channel ) {
                edu.gmu.csiss.gpkg.cmapi.map_status_view.responder.googlemaps( sender, message, channel );
                edu.gmu.csiss.gpkg.cmapi.map_status_view.responder.openlayers( sender, message, channel );
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
        // edu.gmu.csiss.gpkg.cmapi.googlemap.map.addListener("center_changed", function()
        // {
        //     var map = edu.gmu.csiss.gpkg.cmapi.googlemap.map;
                        
        //     cmajs.runtimes.browser.mediator.publish({
        //         sender: "googlemaps",
        //         channel: "map.status.view",
        //         message: {
                    
        //         }
        //     });
        // });
        
        // // register openlayers event
        // edu.gmu.csiss.gpkg.cmapi.openlayers.map.on( "moveend", function () 
        // {
        //     var map = edu.gmu.csiss.gpkg.cmapi.openlayers.map;
                        
        //     cmajs.runtimes.browser.mediator.publish({
        //         sender: "openlayers",
        //         channel: "map.status.view",
        //         message: {
                    
        //         }
        //     });
        // });
    },
    
    
    // ------------------------------------------------------
    init : function() 
    {
        edu.gmu.csiss.gpkg.cmapi.map_status_view.subscribe();
        edu.gmu.csiss.gpkg.cmapi.map_status_view.register();
    }
        
};
