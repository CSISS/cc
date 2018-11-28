/**
* 
* Google Map Manager 
*
* Created by Ziheng Sun on 3/31/2016
* 
*/
edu.gmu.csiss.gpkg.cmapi.googlemap = {

	map: {},
	
	overlaylist: [],

	init: function(divid){
		this.loadMap(divid);
	},
	/**
	 * Center to Bounds
	 */
	centerBounds: function(bounds){
		//call google api to center to bounds
		
		//trigger the event
		edu.gmu.csiss.gpkg.cmapi.googlemap.event.triggerEvent("map.view.center.bounds", bounds);
	},
	/**
	 * Center to Bounds
	 */
	centerFeature: function(feature){
		//call google api to center feature
		//.....
		
		//trigger event
		edu.gmu.csiss.gpkg.cmapi.googlemap.event.triggerEvent("map.view.center.feature", feature);
	},
	/**
	 * Center to Bounds
	 */
	centerOverlay: function(overlay){
		//call google api to center overlay
		//.....
		
		//trigger event
		edu.gmu.csiss.gpkg.cmapi.googlemap.event.triggerEvent("map.view.center.overlay", overlay);
	},
	/**
	 * Get Overlay By ID
	 */
	getOverlayByID: function(overlayId){
		//fill this later
		var o = null;
		for(var i=0;i<overlaylist.length;i++){
			var so = overlaylist[i];
			if(overlayId == so.overlayId){
				o = so;
				break;
			}
		}
		return o;
	},
	
	resize: function(){
		//resize the map
    	//var map = this.map;
    	google.maps.event.trigger(this.map, 'resize');
	},
	
	/**
	 * add a CMAPI overlay to this object for outside
	 */
	oAddOverlay: function(o){
		//push a new overlay
		overlaylist.push(o);
		//trigger an event
		edu.gmu.csiss.gpkg.cmapi.googlemap.event.triggerEvent("map_overlay_create", {
			"name":o.name,
			"overlayId":o.overlayId
		});
	},
	/**
	 * For outside
	 */
	oHideOverlay: function(o){
		//trigger an event
		edu.gmu.csiss.gpkg.cmapi.googlemap.event.triggerEvent("map_overlay_hide", {"overlayId": o.overlayId});
	},
	/**
	 * For outside
	 */
	oRemoveOverlay: function(o){
		for(var f in o.features){
			edu.gmu.csiss.gpkg.cmapi.map_feature_common.remove(f.id);
		}
		//trigger an event
		edu.gmu.csiss.gpkg.cmapi.googlemap.event.triggerEvent("map_overlay_remove", {"overlayId": o.overlayId});
	},
	
	/**
	 * For outside
	 */
	oShowOverlay: function(o){
		for(var f in o.features){
			edu.gmu.csiss.gpkg.cmapi.map_feature_common.show(f.id);
		}
		//trigger an event
		edu.gmu.csiss.gpkg.cmapi.googlemap.event.triggerEvent("map_overlay_show", {"overlayId": o.overlayId});
	},
	/**
	 * For out side
	 */
	oUpdateOverlay: function(o, name, parentId){
		o.name = name;
		o.parentId = parentId;
		//trigger an event
		edu.gmu.csiss.gpkg.cmapi.googlemap.event.triggerEvent("map_overlay_update", {
			"overlayId":o.overlayId,
			"name":name,
			"parentId": parentId
		});
	},
	/***************************************************************************/
	
	loadMap: function(divid){
	
		// Create a map object and specify the DOM element for display.
		var mapOptions = {
		  zoom: 4,
		  center: new google.maps.LatLng(36.380028,-95.067385),
		  mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		this.map = new google.maps.Map(document.getElementById(divid), mapOptions);
	},
	
	/***********************************************************************************/
	/**add these methods for overlay channels**/
	/***********************************************************************************/
	hideOveraly: function(message){
		var overlay = this.getOverlayByID(message.overlayId);
		for(var f in overlay.features){
			edu.gmu.csiss.gpkg.cmapi.map_feature_common.hide(f.id);
		}
	},
	
	showOverlay: function(message){
		var overlay = edu.gmu.csiss.gpkg.cmapi.googlemap.getOverlayByID(message.overlayId);
		for(var f in overlay.features){
			edu.gmu.csiss.gpkg.cmapi.map_feature_common.show(f.id);
		}
	},
	
	createOverlay: function(message){

        // ------------------------------------------
        // modified by Gil Heo (07/04/2016)

//		var newoverlay = new edu.gmu.csiss.gpkg.cmapi.googlemap.overlay(this, message.name, message.overlayId, []);
		var newoverlay = new edu.gmu.csiss.gpkg.cmapi.googlemap.overlay(this, message.name, message.overlayId, null, []);

//		overlaylist.push(newoverlay);
		edu.gmu.csiss.gpkg.cmapi.googlemap.overlaylist.push(newoverlay);

        // end of modification
        // ------------------------------------------
        
	},
	
	removeOverlay: function(message){
		var overlay = edu.gmu.csiss.gpkg.cmapi.googlemap.getOverlayByID(message.overlayId);
		for(var f in overlay.features){
			edu.gmu.csiss.gpkg.cmapi.map_feature_common.remove(f.id);
		}
	},
	
	updateOverlay: function(message){
		var overlay = edu.gmu.csiss.gpkg.cmapi.googlemap.getOverlayByID(message.overlayId);
		overlay.name = message.name;
		overlay.parentId = message.parentId;
	}
	
}
