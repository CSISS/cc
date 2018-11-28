/**
* This file is created by Gil Heo on 6/21/2016, edited by Chen Zhang on 5/27/16
* 
* This is an implementation of channel: map_view_center_location
*/

edu.gmu.csiss.gpkg.cmapi.map_view_center_location = 
{
    // ------------------------------------------------------
    /**
     * Responder of each map to the received messages
     **/
    responder: {
        
//        googlemaps: function( sender, message, channel )
//        {
//            if ( sender != "googlemaps" ) 
//            {
//                var map = edu.gmu.csiss.gpkg.cmapi.googlemap.map;
//                map.setCenter( {lat:message.location.lat, lng:message.location.lon} );
//                
//                if ( "zoom" in message )
//                {
//                    if ( typeof message.zoom == "number" ) {
//                        var level = edu.gmu.csiss.gpkg.cmapi.map_feature_common.scaleToLevel(message.zoom);
//                        map.setZoom( level );
//                    }
//                }
//            } else { 
//                //sent by itself, ignore it.
//            }
//        },
        
        openlayers: function( sender, message, channel )
        {
        	for(var idx in edu.gmu.csiss.gpkg.cmapi.openlayers.maplist){
	        	
        		var olmap = edu.gmu.csiss.gpkg.cmapi.openlayers.maplist[idx];
        		
        		if ( sender != olmap.getTarget()) {
                	
        			olmap.getView().setCenter([message.location.lon, message.location.lat]);
                    
//                    if ( "zoom" in message )
//                    {
//                        if ( typeof message.zoom == "number" ) {
//                            var level = edu.gmu.csiss.gpkg.cmapi.map_feature_common.scaleToLevel(message.zoom);
//                            map.getView().setZoom( level );
//                        }
//                    }
                    
                } else {
                    //sent by itself, ignore it.
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
            channel: "map.view.center.location",
            callback: function( sender, message, channel ) {
//            	console.log("the map location event is subscribed");
//                edu.gmu.csiss.gpkg.cmapi.map_view_center_location.responder.googlemaps( sender, message, channel );
                edu.gmu.csiss.gpkg.cmapi.map_view_center_location.responder.openlayers( sender, message, channel );
            }
        });
    },
    
    unregister: function(){
    	
    	for(var idx in edu.gmu.csiss.gpkg.cmapi.openlayers.maplist){
    		
//    		console.log("unregister map.view.center.location");
        	
    		var olmap = edu.gmu.csiss.gpkg.cmapi.openlayers.maplist[idx];
    		// register openlayers event
    		olmap.un( "moveend", edu.gmu.csiss.gpkg.cmapi.map_view_center_location.callback);
    		
    	}
    	
    },
    
    callback: function () 
    {
    	
//        var lonlat = ol.proj.transform( map.getView().getCenter(), 'EPSG:3857', 'EPSG:4326');
        var lon = this.getView().getCenter()[0];
        var lat = this.getView().getCenter()[1];

        cmajs.runtimes.browser.mediator.publish({
            sender: this.getTarget(),
            channel: "map.view.center.location",
            message: {
                "location": {
                    "lat": lat,
                    "lon": lon
                }
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
//        edu.gmu.csiss.gpkg.cmapi.googlemap.map.addListener('center_changed', function()
//        {
//            var map = edu.gmu.csiss.gpkg.cmapi.googlemap.map;
//            
//            cmajs.runtimes.browser.mediator.publish({
//                sender: "googlemaps",
//                channel: "map.view.center.location",
//                message: {
//                    "location": {
//                        "lat": map.getCenter().lat(),
//                        "lon": map.getCenter().lng()
//                    }
//                }
//            });
//        });
    	
    	
        
        // register openlayers event
    	for(var idx in  edu.gmu.csiss.gpkg.cmapi.openlayers.maplist){
    		
//    		console.log("register map.view.center.location");
    		
    		var olmap = edu.gmu.csiss.gpkg.cmapi.openlayers.maplist[idx];
    		
    		olmap.on( "moveend", edu.gmu.csiss.gpkg.cmapi.map_view_center_location.callback);
    		
    	}
        
    },
    
    
    // ------------------------------------------------------
    init : function() 
    {
        edu.gmu.csiss.gpkg.cmapi.map_view_center_location.subscribe();
        edu.gmu.csiss.gpkg.cmapi.map_view_center_location.register();
    }
        
};
