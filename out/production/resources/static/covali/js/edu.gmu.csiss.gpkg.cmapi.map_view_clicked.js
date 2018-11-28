/**
* This file is created by Chen Zhang on 5/22/2016
* 
* This is an implementation of channel: map_view_clicked
*/

edu.gmu.csiss.gpkg.cmapi.map_view_clicked = 
{
    // ------------------------------------------------------
    /**
     * Responder of each map to the received messages
     **/
    responder: {
        
        googlemaps: function( sender, message, channel )
        {
            if ( sender != "googlemaps" ) {

                if (message.type == "single") {
                    console.log("ol single clicked");
                }
                else if (message.type == "double") {
                    console.log("ol double clicked");
                }                            
                //map.setCenter( {lat:message.location.lat, lng:message.location.lon} );
            } else {
                //sent by itself, ignore it.
            }
        },
        
        openlayers: function( sender, message, channel )
        {
            if ( sender != "openlayers" ) {

                if (message.type == "single") {
                    console.log("googlemap single clicked");
                }
                else if (message.type == "double") {
                    console.log("googlemap double clicked");
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
            channel: "map.view.clicked",
            callback: function( sender, message, channel ) {
                edu.gmu.csiss.gpkg.cmapi.map_view_clicked.responder.googlemaps( sender, message, channel );
                edu.gmu.csiss.gpkg.cmapi.map_view_clicked.responder.openlayers( sender, message, channel );
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
        edu.gmu.csiss.gpkg.cmapi.googlemap.map.addListener('dblclick', function()
        {
            var mouseEvent = edu.gmu.csiss.gpkg.cmapi.googlemap.MouseEvent;
            console.log(mouseEvent);
            cmajs.runtimes.browser.mediator.publish({
                sender: "googlemaps",
                channel: "map.view.clicked",
                message: {
                    "lat": mouseEvent,
                    "lon": mouseEvent,
                    "button": "left",
                    "type": "single",
                    "keys": "none"
                }
            });
        });

        edu.gmu.csiss.gpkg.cmapi.googlemap.map.addListener('dblclick', function()
        {
            var map = edu.gmu.csiss.gpkg.cmapi.googlemap.map;
            cmajs.runtimes.browser.mediator.publish({
                sender: "googlemaps",
                channel: "map.view.clicked",
                message: {
                    "lat": map.getCenter().lat(),
                    "lon": map.getCenter().lng(),
                    "button": "left",
                    "type": "double",
                    "keys": "none"
                }
            });
        });
        
        // register openlayers event
        edu.gmu.csiss.gpkg.cmapi.openlayers.map.on( "click", function () 
        {
            var map = edu.gmu.csiss.gpkg.cmapi.openlayers.map;
            var lonlat = ol.proj.transform( map.getView().getCenter(), 'EPSG:3857', 'EPSG:4326');
            var lon = lonlat[0];
            var lat = lonlat[1];

            //var pos = edu.gmu.csiss.gpkg.cmapi.openlayers.control.MousePosition(map);
            
            cmajs.runtimes.browser.mediator.publish({
                sender: "openlayers",
                channel: "map.view.clicked",
                message: {
                    "lat": lat,
                    "lon": lon,
                    "button": "left",
                    "type": "single",
                    "keys": "none"
                }
            });
        });

        edu.gmu.csiss.gpkg.cmapi.openlayers.map.on( "dblclick", function () 
        {
            var map = edu.gmu.csiss.gpkg.cmapi.openlayers.map;
            var lonlat = ol.proj.transform( map.getView().getCenter(), 'EPSG:3857', 'EPSG:4326');
            var lon = lonlat[0];
            var lat = lonlat[1];
            
            cmajs.runtimes.browser.mediator.publish({
                sender: "openlayers",
                channel: "map.view.clicked",
                message: {
                    "lat": lat,
                    "lon": lon,
                    "button": "left",
                    "type": "double",
                    "keys": "none"
                }
            });
        });
    },
    
    
    // ------------------------------------------------------
    init : function() 
    {
        edu.gmu.csiss.gpkg.cmapi.map_view_clicked.subscribe();
        edu.gmu.csiss.gpkg.cmapi.map_view_clicked.register();
    }
        
};
