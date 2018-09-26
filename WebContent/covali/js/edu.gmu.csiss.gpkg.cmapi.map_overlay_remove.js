/**
* This file is created by Ziheng Sun on 3/15/2016
* 
*/

edu.gmu.csiss.gpkg.cmapi.map_overlay_remove = {
		
		responders: {
			
			googlemaps: function(sender, message, channel){
				
				if ( sender != "googlemaps" ) {
					var map = edu.gmu.csiss.gpkg.cmapi.googlemap;
					map.removeOverlay(message);
					//map.setCenter( {lat:message.location.lat, lng:message.location.lon} );
				} else {
					//sent by itself, ignore it.
				}
				
			},
			
			openlayers: function(sender, message, channel){
				
				if ( sender != "openlayers" ) {
					//var onelayer = edu.gmu.csiss.gpkg.cmapi.openlayers.getOverlayById(message.overlayId);
					//onelayer.setVisible(false);
					var map = edu.gmu.csiss.gpkg.cmapi.openlayers;
					map.removeOverlay(message);
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
				channel: "map.overlay.remove",
				callback: function( sender, message, channel ) {
					edu.gmu.csiss.gpkg.cmapi.map_overlay_remove.responder.googlemaps( sender, message, channel );
					edu.gmu.csiss.gpkg.cmapi.map_overlay_remove.responder.openlayers( sender, message, channel );
				}
			});
		},
		
		register: function(){
			// register googlemaps event
			edu.gmu.csiss.gpkg.cmapi.googlemap.event.registerEvent("map_overlay_remove");
			edu.gmu.csiss.gpkg.cmapi.googlemap.event.addListener('map_overlay_remove', function(overlayId)
			{
				console.log("The Google Map external event map_overlay_remove is triggered.");
				//var map = edu.gmu.csiss.gpkg.cmapi.googlemap.map;
				var guid = overlayId; //create an unique overlay Id
				cmajs.runtimes.browser.mediator.publish({
					sender: "googlemaps",
					channel: "map.overlay.remove",
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
				
				layergroup.on("change:layers", function(e){
					var layers = e.target;
					layers.forEach("remove", function(e){
						var layer = e.target; //supposed to be the remove layer
						console.log("The layer is set visible. Trigger a Pub/Sub event.");
						var guid = layer.overlayId; //create an unique overlay Id
						cmajs.runtimes.browser.mediator.publish({
							sender: "openlayers",
							channel: "map.overlay.remove",
							message: {
								"overlayId" : guid
							}
						});
					});
				});
			});
		},
		
		init: function(){
			edu.gmu.csiss.gpkg.cmapi.map_overlay_remove.subscribe();
			edu.gmu.csiss.gpkg.cmapi.map_overlay_remove.register();	
		},
};
