/**
* This file is created by Ziheng Sun on 3/15/2016
* 
*/

edu.gmu.csiss.gpkg.cmapi.map_overlay_update = {
		
		responders: {
			
			googlemaps: function(sender, message, channel){
				
				if ( sender != "googlemaps" ) {
					//do nothing
					var map = edu.gmu.csiss.gpkg.cmapi.googlemap;
					map.updateOverlay(message);
					//map.setCenter( {lat:message.location.lat, lng:message.location.lon} );
				} else {
					//sent by itself, ignore it.
				}
				
			},
			
			openlayers: function(sender, message, channel){
				
				if ( sender != "openlayers" ) {
					//do nothing
					var map = edu.gmu.csiss.gpkg.cmapi.openlayers;
					map.updateOverlay(message);
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
				channel: "map.overlay.update",
				callback: function( sender, message, channel ) {
					edu.gmu.csiss.gpkg.cmapi.map_overlay_update.responder.googlemaps( sender, message, channel );
					edu.gmu.csiss.gpkg.cmapi.map_overlay_update.responder.openlayers( sender, message, channel );
				}
			});
		},
		/**
		 * Register
		 */
		register: function(){
			// register googlemaps event
			edu.gmu.csiss.gpkg.cmapi.googlemap.event.registerEvent("map_overlay_update");
			edu.gmu.csiss.gpkg.cmapi.googlemap.event.addListener('map_overlay_update', function(msg)
			{
				console.log("The Google Map external event map_overlay_update is triggered.");
				var guid = msg.overlayId; //create an unique overlay Id
				cmajs.runtimes.browser.mediator.publish({
					sender: "googlemaps",
					channel: "map.overlay.update",
					message: {
						"name": msg.name,
						"overlayId" : guid,
						"parentId": msg.parentId
					}
				});
			});
			
			// register openlayers event
			edu.gmu.csiss.gpkg.cmapi.openlayers.map.on( "change:layergroup", function (e) 
			{
				var layergroup = e.target;
				layergroup.on("change:layers", function(e){
					console.log("The name of layer updating event on OpenLayers is triggered.");
					//var map = edu.gmu.csiss.gpkg.cmapi.openlayers.map;
					var layers = e.target; 
					layers.forEach(function(ele, index, array){
						var layer = ele;
						layer.on("propertychange", function(e){
							var msg = null;
							if("name" == e.key){
								msg = {"name":e.target.get(e.key)};
							}
							
							if("parentId" == e.key){
								if(msg==null){
									msg = {"parentId": e.target.get(e.key)};
								}else{
									msg.parentId = e.target.get(e.key);
								}
							}
							if(msg!=null){
								console.log("The name of layer is updated in OpenLayers. A Pub/Sub event is triggered.");
								msg.overlayId = layer.overlayId;
								cmajs.runtimes.browser.mediator.publish({
									sender: "openlayers",
									channel: "map.overlay.update",
									message: msg
								});
							}
						});
					});
				});
			});
		},
		/**
		 * Initialize the object
		 */
		init: function(){
			edu.gmu.csiss.gpkg.cmapi.map_overlay_update.subscribe();
			edu.gmu.csiss.gpkg.cmapi.map_overlay_update.register();	
		},
};
