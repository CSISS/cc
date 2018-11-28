/**
* This file is created by Chen Zhang on 5/27/2016
* 
* This is an implementation of channel: map_view_center_bounds
*/

edu.gmu.csiss.gpkg.cmapi.map_view_center_bounds = 
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
                var sw = edu.gmu.csiss.gpkg.cmapi.googlemap.LatLng(message.bounds.southWest.lat, message.bounds.southWest.lon);
                var ne = edu.gmu.csiss.gpkg.cmapi.googlemap.LatLng(message.bounds.northEast.lat, message.bounds.northEast.lon);
                var latLngBounds = edu.gmu.csiss.gpkg.cmapi.googlemap.map.LatLngBounds(sw, ne);
                map.panToBounds(latLngBounds);                
            } 
            else {
                //sent by itself, ignore it.
            }
        },
        
        openlayers: function( sender, message, channel )
        {
            if ( sender != "openlayers" ) {
                var map = edu.gmu.csiss.gpkg.cmapi.openlayers.map;                               
                var lat = (message.bounds.northEast.lat+message.bounds.southWest.lat)/2;                
                var lon = (message.bounds.northEast.lon+message.bounds.southWest.lon)/2;
                map.getView().setCenter(
                    ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857') );                
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
            channel: "map.view.center.bounds",
            callback: function( sender, message, channel ) {
                edu.gmu.csiss.gpkg.cmapi.map_view_center_bounds.responder.googlemaps( sender, message, channel );
                edu.gmu.csiss.gpkg.cmapi.map_view_center_bounds.responder.openlayers( sender, message, channel );
            }
        });
    },
    

    wrapLon: function(value)
    {
        var worlds = Math.floor((value + 180) / 360);
        return value - (worlds * 360);
    },


    // ------------------------------------------------------
    /**
     * register googlemaps and openlayers event
     **/
    register: function()
    {
        // register googlemaps event
    	edu.gmu.csiss.gpkg.cmapi.googlemap.event.registerEvent("map.view.center.bounds");
        edu.gmu.csiss.gpkg.cmapi.googlemap.event.addListener("map.view.center.bounds", function(bds)
        {
            //var map = edu.gmu.csiss.gpkg.cmapi.googlemap.map;
            //var bounds = edu.gmu.csiss.gpkg.cmapi.googlemap.map,getBounds();
        	var bounds = bds;
            cmajs.runtimes.browser.mediator.publish({                
                sender: "googlemaps",
                channel: "map.view.center.bounds",
                message: {
                    "bounds": {
                        "southWest": {
                            "lat": bounds.getSouthWest().lat(),
                            "lon": bounds.getSouthWest().lng()
                        },
                        "northEast": {
                            "lat": bounds.getNorthEast().lat(),
                            "lon": bounds.getNorthEast().lng()
                        }
                    },
                }
            });
        });
        
        // register openlayers event
        edu.gmu.csiss.gpkg.cmapi.openlayers.event.registerEvent("map.view.center.bounds");
        edu.gmu.csiss.gpkg.cmapi.openlayers.event.addListener( "map.view.center.bounds", function (bds) 
        {
            //var map = edu.gmu.csiss.gpkg.cmapi.openlayers.map;
            var extent = edu.gmu.csiss.gpkg.cmapi.openlayers.map.getView().calculateExtent(map.getSize());
            var bottomLeft = ol.proj.transform(ol.extent.getBottomLeft(extent), 'EPSG:4326', 'EPSG:3857');
            //var topRight = ol.proj.transform(ol.extent.getTopRight(extent), 'EPSG:4326', 'EPSG:3857');
            cmajs.runtimes.browser.mediator.publish({
                sender: "openlayers",
                channel: "map.view.center.bounds",
                message: {
                    "bounds": {
                        "southWest": {
                            "lat": ol.extent.getBottomLeft(extent)[1],
                            "lon": ol.extent.getBottomLeft(extent)[0]
                        },
                        "northEast": {
                            "lat": ol.extent.getTopRight(extent)[1],
                            "lon": ol.extent.getTopRight(extent)[0]
                        }
                    },
                }
            });            
        });
    },
    
    
    // ------------------------------------------------------
    init : function() 
    {
        edu.gmu.csiss.gpkg.cmapi.map_view_center_bounds.subscribe();
        edu.gmu.csiss.gpkg.cmapi.map_view_center_bounds.register();
    }
        
};
