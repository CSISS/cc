/**
* This file is created by Ziheng Sun on 3/15/2016
* 
*/
edu.gmu.csiss.gpkg.cmapi.map_overlay_create = {
		
		responders: {
			
			googlemaps: function(sender, message, channel){
				if ( sender != "googlemaps" ) {
					var map = edu.gmu.csiss.gpkg.cmapi.googlemap.map;

                    // ------------------------------------------
                    // modified by Gil Heo (07/04/2016)
                    
//					map.createOverlay(message);
					edu.gmu.csiss.gpkg.cmapi.googlemap.createOverlay(message);

//					console("A new overlay is added to google map.");
					console.log("A new overlay is added to google map.");

                    // end of modification
                    // ------------------------------------------
                    
					//map.setCenter( {lat:message.location.lat, lng:message.location.lon} );
				} else {
					//sent by itself, ignore it.
				}
				
			},
			
			openlayers: function(sender, message, channel){
				if ( sender != "openlayers" ) {
					var map = edu.gmu.csiss.gpkg.cmapi.openlayers.map;
					map.createOverlay(message);
					console("A new overlay is added to OpenLayers.");
				} else {
					//sent by itself, ignore it.
				}
			}
			
		},
		
		subscribe: function(){
			cmajs.runtimes.browser.mediator.subscribe( 
			{ 
				channel: "map.overlay.create",
				callback: function( sender, message, channel ) {
					edu.gmu.csiss.gpkg.cmapi.map_overlay_create.responders.googlemaps( sender, message, channel );
					edu.gmu.csiss.gpkg.cmapi.map_overlay_create.responders.openlayers( sender, message, channel );
				}
			});
		},
		
		register: function(){
			// register googlemaps event
			//no corresponding googlemaps event is found. Create a new one.
			edu.gmu.csiss.gpkg.cmapi.googlemap.event.registerEvent("map_overlay_create");
			edu.gmu.csiss.gpkg.cmapi.googlemap.event.addListener('map_overlay_create', function(msg)
			{
				console.log("The Google Map external event map_overlay_create is triggered.");
				var guid = msg.overlayId; //create an unique overlay Id
				cmajs.runtimes.browser.mediator.publish({
					sender: "googlemaps",
					channel: "map.overlay.create",
					message: {
						"name": msg.name,
						"overlayId" : guid
					}
				});
			});
			
			// register openlayers event - a new layer is added
			edu.gmu.csiss.gpkg.cmapi.openlayers.map.on( "change:layergroup", function (e) 
			{
				var layergroup = e.target;
				layergroup.on("change:layers", function(e){
					console.log("A new layer adding event on OpenLayers is triggered.");
					//var map = edu.gmu.csiss.gpkg.cmapi.openlayers.map;
					var layers = e.target; 
					layers.on("add", function(e){
						var layer = e.target; //not sure the target is the layer - check it later
						var guid = layer.overlayId; //create an unique overlay Id
						console.log("A new layer is added in OpenLayers. A Pub/Sub event is triggered.");
						cmajs.runtimes.browser.mediator.publish({
							sender: "openlayers",
							channel: "map.overlay.create",
							message: {
								"name": layer.name,
								"overlayId" : guid
							}
						});
					});
					
				});
			});
		},
		
		init: function(){
			edu.gmu.csiss.gpkg.cmapi.map_overlay_create.subscribe();
			edu.gmu.csiss.gpkg.cmapi.map_overlay_create.register();
		},
};
