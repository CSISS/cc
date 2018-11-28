/**
* This file is created by Chen Zhang on 7/10/2016
* 
* This is an implementation of channel: map_view_mouseup
*/

edu.gmu.csiss.gpkg.cmapi.map_view_mouseup = 
{
    // ------------------------------------------------------
    /**
     * Responder of each map to the received messages
     **/
    responder: {
        
//        googlemaps: function( sender, message, channel )
//        {
//            if ( sender != "googlemaps" ) {
//
//                console.log("mouseup");
//                        
//
//            } else {
//                //sent by itself, ignore it.
//            }
//        },
        
        openlayers: function( sender, message, channel )
        {
        	for(var idx in edu.gmu.csiss.gpkg.cmapi.openlayers.maplist){
	        	
        		var olmap = edu.gmu.csiss.gpkg.cmapi.openlayers.maplist[idx];
        		
	        	if ( sender != olmap.getTarget() ) {
	        		
	                console.log("mouseup");
	                
	                if(message.button == "left" && message.type == "single"){
	                	
	                	olmap.getView().setCenter([message.location.lon, message.location.lat]);
		                
	                }
	                
	            }
	        	
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
            channel: "map.view.mouseup",
            callback: function( sender, message, channel ) {
//                edu.gmu.csiss.gpkg.cmapi.map_view_mouseup.responder.googlemaps( sender, message, channel );
                edu.gmu.csiss.gpkg.cmapi.map_view_mouseup.responder.openlayers( sender, message, channel );
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
//        edu.gmu.csiss.gpkg.cmapi.googlemap.map.addListener('mouseup', function()
//        {
//            var mouseEvent = edu.gmu.csiss.gpkg.cmapi.googlemap.MouseEvent;
//            console.log(mouseEvent);
//            cmajs.runtimes.browser.mediator.publish({
//                sender: "googlemaps",
//                channel: "map.view.mouseup",
//                message: {
//                    "lat": mouseEvent,
//                    "lon": mouseEvent,
//                    "button": "left",
//                    "type": "single",
//                    "keys": "none"
//                }
//            });
//        });

        // register openlayers event
    	
    	for(var idx in  edu.gmu.csiss.gpkg.cmapi.openlayers.maplist){
    		
    		var olmap = edu.gmu.csiss.gpkg.cmapi.openlayers.maplist[idx];
    		
    		olmap.on( "mouseup", function () 
	        {
	            var map = olmap;
//	            var lonlat = ol.proj.transform( map.getView().getCenter(), 'EPSG:3857', 'EPSG:4326');
	            var lon = map.getView().getCenter()[0];
	            var lat = map.getView().getCenter()[1];
	            
	            cmajs.runtimes.browser.mediator.publish({
	                sender: "openlayers",
	                channel: "map.view.mouseup",
	                message: {
	                    "lat": lat,
	                    "lon": lon,
	                    "button": "left",
	                    "type": "single",
	                    "keys": "none"
	                }
	            });
	        });
    	}
        
    },
    
    
    // ------------------------------------------------------
    init : function() 
    {
        edu.gmu.csiss.gpkg.cmapi.map_view_mouseup.subscribe();
        edu.gmu.csiss.gpkg.cmapi.map_view_mouseup.register();
    }
        
};
