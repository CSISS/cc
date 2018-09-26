/**
* This file is created by Chen Zhang on 7/10/2016
* 
* This is an implementation of channel: map_view_mousedown
*/

edu.gmu.csiss.gpkg.cmapi.map_view_mousedown = 
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
//                console.log("mousedown");
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
	        		
	                console.log("mousedown");
	                //move the map center to the location in the message
	                
	                
	                
	                
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
            channel: "map.view.mousedown",
            callback: function( sender, message, channel ) {
//                edu.gmu.csiss.gpkg.cmapi.map_view_mousedown.responder.googlemaps( sender, message, channel );
                edu.gmu.csiss.gpkg.cmapi.map_view_mousedown.responder.openlayers( sender, message, channel );
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
//        edu.gmu.csiss.gpkg.cmapi.googlemap.map.addListener('mousedown', function()
//        {
//            var mouseEvent = edu.gmu.csiss.gpkg.cmapi.googlemap.MouseEvent;
//            console.log(mouseEvent);
//            cmajs.runtimes.browser.mediator.publish({
//                sender: "googlemaps",
//                channel: "map.view.mousedown",
//                message: {
//                    "lat": mouseEvent,
//                    "lon": mouseEvent,
//                    "button": "left",
//                    "type": "single",
//                    "keys": "none"
//                }
//            });
//            
//        });

        // register openlayers event - updated by Z.S. on 05/30/2018 
    	
        for(var idx in edu.gmu.csiss.gpkg.cmapi.openlayers.maplist){
        	
        	var olmap = edu.gmu.csiss.gpkg.cmapi.openlayers.maplist[idx];
        	
        	olmap.on( "mousedown", function() {
        		
	            var map = olmap;
	            
	            var lonlat = ol.proj.transform( map.getView().getCenter(), 'EPSG:3857', 'EPSG:4326');
	            
	            var lon = lonlat[0];
	            
	            var lat = lonlat[1];

	            //var pos = edu.gmu.csiss.gpkg.cmapi.openlayers.control.MousePosition(map);
	            
	            cmajs.runtimes.browser.mediator.publish({
	            
	            	sender: map.getTarget(),
	                
	            	channel: "map.view.mousedown",
	                
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
        edu.gmu.csiss.gpkg.cmapi.map_view_mousedown.subscribe();
        edu.gmu.csiss.gpkg.cmapi.map_view_mousedown.register();
    }
        
};
