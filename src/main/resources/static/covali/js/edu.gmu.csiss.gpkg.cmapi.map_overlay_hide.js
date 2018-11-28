/**
* This file is created by Ziheng Sun on 3/15/2016
* 
*/

edu.gmu.csiss.gpkg.cmapi.map_overlay_hide = {
		
		responders: {
			
			googlemaps: function(sender, message, channel){
				
				if ( sender != "googlemaps" ) {
					var map = edu.gmu.csiss.gpkg.cmapi.googlemap;
					map.hideOverlay(message);
					//map.setCenter( {lat:message.location.lat, lng:message.location.lon} );
				} else {
					//sent by itself, ignore it.
				}
				
			},
			
			openlayers: function(sender, message, channel){
				
				if ( sender != "openlayers" ) {
					var map = edu.gmu.csiss.gpkg.cmapi.openlayers;
					map.hideOverlay(message);
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
				channel: "map.overlay.hide",
				callback: function( sender, message, channel ) {
					edu.gmu.csiss.gpkg.cmapi.map_overlay_hide.responder.googlemaps( sender, message, channel );
					edu.gmu.csiss.gpkg.cmapi.map_overlay_hide.responder.openlayers( sender, message, channel );
				}
			});
		},
		
		register: function(){
			// register googlemaps event
			//no corresponding googlemaps event is found. Create a new one.
			edu.gmu.csiss.gpkg.cmapi.googlemap.event.registerEvent("map_overlay_hide");
			edu.gmu.csiss.gpkg.cmapi.googlemap.event.addListener('map_overlay_hide', function(overlayId)
			{
				console.log("The Google Map external event map_overlay_hide is triggered.");
				var guid = overlayId; //create an unique overlay Id
				cmajs.runtimes.browser.mediator.publish({
					sender: "googlemaps",
					channel: "map.overlay.hide",
					message: {
						"overlayId" : guid
					}
				});
			});
			
			// register openlayers event - a new layer is added
			edu.gmu.csiss.gpkg.cmapi.openlayers.map.on( "change:layergroup", function (e) 
			{
				console.log("A new layer changing event on OpenLayers is triggered.");
				//for each layer in the group, add this listener
				var layergroup = e.target;
				layergroup.on("change:visible", function(e){
				var layer = e.target;
//					layers.forEach(function(ele, index, array){
//						var layer = ele;
//						layer.on("change:visible",  function(e){
						var newvalue = layer.get(e.key);
						if(newvalue=="false"||newvalue=="FALSE"){
							console.log("The layer is set invisible. Trigger a Pub/Sub event.");
							var guid = layer.overlayId; //create an unique overlay Id
							cmajs.runtimes.browser.mediator.publish({
								sender: "openlayers",
								channel: "map.overlay.hide",
								message: {
									"overlayId" : guid
								}
							});
						}
//						});
//					});
				//var map = edu.gmu.csiss.gpkg.cmapi.openlayers.map;
					
					
				});
				
				
			});
		},
		
		
		init: function(){
			edu.gmu.csiss.gpkg.cmapi.map_overlay_hide.subscribe();
			edu.gmu.csiss.gpkg.cmapi.map_overlay_hide.register();	
		},
};
