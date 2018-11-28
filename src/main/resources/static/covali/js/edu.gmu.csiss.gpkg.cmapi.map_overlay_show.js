/**
* This file is created by Ziheng Sun on 3/15/2016
* 
*/

edu.gmu.csiss.gpkg.cmapi.map_overlay_show = {
		
		responders: {
			
			googlemaps: function(sender, message, channel){
				
				if ( sender != "googlemaps" ) {
					//do nothing
					var map = edu.gmu.csiss.gpkg.cmapi.googlemap;
					map.showOverlay(message);
					//map.setCenter( {lat:message.location.lat, lng:message.location.lon} );
				} else {
					//sent by itself, ignore it.
				}
				
			},
			
			openlayers: function(sender, message, channel){
				
				if ( sender != "openlayers" ) {
					//do nothing
					var map = edu.gmu.csiss.gpkg.cmapi.openlayers;
					map.showOverlay(message);
					//map.getView().setCenter(
					//	ol.proj.transform( [message.location.lon, message.location.lat],
					//			'EPSG:4326', 'EPSG:3857') );
				} else {
					//sent by itself, ignore it.
				}
				
			}
			
		},
		
		subscribe: function(){
			cmajs.runtimes.browser.mediator.subscribe( 
			{ 
				channel: "map.overlay.show",
				callback: function( sender, message, channel ) {
					edu.gmu.csiss.gpkg.cmapi.map_overlay_show.responder.googlemaps( sender, message, channel );
					edu.gmu.csiss.gpkg.cmapi.map_overlay_show.responder.openlayers( sender, message, channel );
				}
			});
		},
		
		register: function(){
			// register googlemaps event
			edu.gmu.csiss.gpkg.cmapi.googlemap.event.registerEvent("map_overlay_show");
			edu.gmu.csiss.gpkg.cmapi.googlemap.event.addListener('map_overlay_show', function(overlayId)
			{
				console.log("The Google Map external event map_overlay_show is triggered.");
				//var map = edu.gmu.csiss.gpkg.cmapi.googlemap.map;
				var guid = overlayId; //create an unique overlay Id
				cmajs.runtimes.browser.mediator.publish({
					sender: "googlemaps",
					channel: "map.overlay.show",
					message: {
						"overlayId" : guid
					}
				});
			});
			
			// register openlayers event
			edu.gmu.csiss.gpkg.cmapi.openlayers.map.on( "change:layergroup", function (e) 
			{
				console.log("A new layer changing event on OpenLayers is triggered.");
				//for each layer in the group, add this listener
				var layergroup = e.target;
				layergroup.on("change:visible", function(e){
					var layer = e.target;
					var newvalue = layer.get(e.key);
					if(newvalue=="true"||newvalue=="TRUE"){
						console.log("The layer is set visible. Trigger a Pub/Sub event.");
						var guid = layer.overlayId; //create an unique overlay Id
						cmajs.runtimes.browser.mediator.publish({
							sender: "openlayers",
							channel: "map.overlay.show",
							message: {
								"overlayId" : guid
							}
						});
					}
				});
			});
		},
		
		init: function(){
			edu.gmu.csiss.gpkg.cmapi.map_overlay_show.subscribe();
			edu.gmu.csiss.gpkg.cmapi.map_overlay_show.register();	
		},
};
