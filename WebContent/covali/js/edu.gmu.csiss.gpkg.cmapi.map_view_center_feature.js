/**
* This file is created by Chen Zhang on 5/27/2016
* 
* This is an implementation of channel: map_view_center_feature
*/

edu.gmu.csiss.gpkg.cmapi.map_view_center_feature = 
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
                var feature = map.data.getFeatureById(message.featureId);
                var lon = feature.getCenter().lng();
                var lat = feature.getCenter().lat();
                map.setCenter([lat,lng]);                
            } else {
                //sent by itself, ignore it.
            }
        },
        
        openlayers: function( sender, message, channel )
        {
            if ( sender != "openlayers" ) {
                var map = edu.gmu.csiss.gpkg.cmapi.openlayers.map;                               
                var feature = map.data.getFeatureById(message.featureId);
                var lon = feature.getCenter().lng();
                var lat = feature.getCenter().lat();
                map.getView().setCenter(
                    ol.proj.transform( [lon, lat], 'EPSG:4326', 'EPSG:3857') );                
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
            channel: "map.view.center.feature",
            callback: function( sender, message, channel ) {
                edu.gmu.csiss.gpkg.cmapi.map_view_center_feature.responder.googlemaps( sender, message, channel );
                edu.gmu.csiss.gpkg.cmapi.map_view_center_feature.responder.openlayers( sender, message, channel );
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
        edu.gmu.csiss.gpkg.cmapi.googlemap.event.registerEvent("map.view.center.feature");
        edu.gmu.csiss.gpkg.cmapi.googlemap.event.addListener("map.view.center.feature", function(ft)
        {
            var feature = ft;

            var map = edu.gmu.csiss.gpkg.cmapi.googlemap.map;
            
            cmajs.runtimes.browser.mediator.publish({                
                sender: "googlemaps",
                channel: "map.view.center.overlay",
                message: {
                    "overlayId": feature.getId()
                }
            });
        });
        
        // register openlayers event
        edu.gmu.csiss.gpkg.cmapi.openlayers.event.registerEvent("map.view.center.feature");
        edu.gmu.csiss.gpkg.cmapi.openlayers.event.addListener( "map.view.center.feature", function (ft) 
        {
            // var overlay = edu.gmu.csiss.gpkg.cmapi.openlayers.overlay;
            // var id = overlay.id;
            
            cmajs.runtimes.browser.mediator.publish({
                sender: "openlayers",
                channel: "map.view.center.overlay",
                message: {
                     "overlayId": ft.getId()
                }
            });
        });
    },
    
    
    // ------------------------------------------------------
    init : function() 
    {
        edu.gmu.csiss.gpkg.cmapi.map_view_center_feature.subscribe();
        edu.gmu.csiss.gpkg.cmapi.map_view_center_feature.register();
    }
        
};
