/**
* This file is created by Chen Zhang on 4/19/2016
* 
* This is an implementation of channel: map_view_zoom
*/
edu.gmu.csiss.gpkg.cmapi.map_view_zoom = {
    // ------------------------------------------------------
    /**
     * Responder of each map to the received messages
     **/
    responder: {
        
//        googlemaps: function( sender, message, channel )
//        {
//            if ( sender != "googlemaps" ) {
//                var map = edu.gmu.csiss.gpkg.cmapi.googlemap.map;
//                map.setZoom(message.range);
//            } else {
//                //sent by itself, ignore it.
//            }
//        },
        
        openlayers: function( sender, message, channel )
        {
        	
        	for(var idx in edu.gmu.csiss.gpkg.cmapi.openlayers.maplist){
        		var olmap = edu.gmu.csiss.gpkg.cmapi.openlayers.maplist[idx];
        		if ( sender != olmap.getTarget() ) {
                    var map = olmap;
                    map.getView().setZoom(message.range);
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
            channel: "map.view.zoom",
            callback: function( sender, message, channel ) {
//            	console.log("the map.view.zoom event is subscribed.");
//                edu.gmu.csiss.gpkg.cmapi.map_view_zoom.responder.googlemaps( sender, message, channel );
                edu.gmu.csiss.gpkg.cmapi.map_view_zoom.responder.openlayers( sender, message, channel );
            }
        });
    },
    
    unregister: function(){
    	
    	for(var idx in edu.gmu.csiss.gpkg.cmapi.openlayers.maplist){
    		
//    		console.log("unregister map.view.zoom");
    	
    		var olmap = edu.gmu.csiss.gpkg.cmapi.openlayers.maplist[idx];
    		// register openlayers event
    		olmap.un( "moveend", edu.gmu.csiss.gpkg.cmapi.map_view_zoom.callback);
    		
    	}
    	
    },
    
    callback: function () 
    {
        cmajs.runtimes.browser.mediator.publish({
            sender: this.getTarget(),
            channel: "map.view.zoom",
            message: {
                "range": this.getView().getZoom()
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
//        edu.gmu.csiss.gpkg.cmapi.googlemap.map.addListener('zoom_changed', function()
//        {
//            var map = edu.gmu.csiss.gpkg.cmapi.googlemap.map;
//                        
//            cmajs.runtimes.browser.mediator.publish({
//                sender: "googlemaps",
//                channel: "map.view.zoom",
//                message: {
//                    "range": map.getZoom()
//                }
//            });
//        });
    	
    	for(var idx in edu.gmu.csiss.gpkg.cmapi.openlayers.maplist){
    		var olmap = edu.gmu.csiss.gpkg.cmapi.openlayers.maplist[idx];
    		// register openlayers event
    		olmap.on( "moveend", edu.gmu.csiss.gpkg.cmapi.map_view_zoom.callback);
            
    	}
        
    },
    
    
    // ------------------------------------------------------
    init : function() 
    {
        edu.gmu.csiss.gpkg.cmapi.map_view_zoom.subscribe();
        edu.gmu.csiss.gpkg.cmapi.map_view_zoom.register();
    }
        
};
