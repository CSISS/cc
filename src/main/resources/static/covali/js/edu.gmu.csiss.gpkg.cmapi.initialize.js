/**
* This file is created by Ziheng Sun on 3/30/2016
* This file is used to integrate all the js files together and initialize the interface of the mobile app.
*/

edu.gmu.csiss.gpkg.cmapi.initialize = {
	
	unregister: function(){
		
		console.log("unsubscribe listeners..");
		
		edu.gmu.csiss.gpkg.cmapi.map_view_zoom.unregister();
		
		edu.gmu.csiss.gpkg.cmapi.map_view_center_location.unregister();
		
	},
		
	init: function(){
		
		console.log("subscribe listener..");
		//alert("Begin to initialize the app.");
		//edu.gmu.csiss.gpkg.cmapi.googlemap.init("googlemap");
		//edu.gmu.csiss.gpkg.cmapi.openlayers.init("openlayers");

		/*----------------map.overlay Channels, added by Ziheng Sun begin ----------------*/
//		edu.gmu.csiss.gpkg.cmapi.settings.init();
//		edu.gmu.csiss.gpkg.cmapi.map_overlay_create.init();
//		edu.gmu.csiss.gpkg.cmapi.map_overlay_hide.init();
//		edu.gmu.csiss.gpkg.cmapi.map_overlay_show.init();
//		edu.gmu.csiss.gpkg.cmapi.map_overlay_remove.init();
//		edu.gmu.csiss.gpkg.cmapi.map_overlay_update.init();
		
		/*----------------map.overlay Channels, added by Ziheng Sun end----------------*/
		
        /*----------------map.feature Channels, added by Gil Heo----------------*/        
//        edu.gmu.csiss.gpkg.cmapi.map_overlay_common.init();
//        edu.gmu.csiss.gpkg.cmapi.map_feature_common.init();
//        edu.gmu.csiss.gpkg.cmapi.map_feature_plot.init();
//        edu.gmu.csiss.gpkg.cmapi.map_feature_plot_batch.init();
//        edu.gmu.csiss.gpkg.cmapi.map_feature_plot_url.init();
//        edu.gmu.csiss.gpkg.cmapi.map_feature_unplot.init();
//        edu.gmu.csiss.gpkg.cmapi.map_feature_unplot_batch.init();
//        edu.gmu.csiss.gpkg.cmapi.map_feature_hide.init();
//        edu.gmu.csiss.gpkg.cmapi.map_feature_show.init();
//        edu.gmu.csiss.gpkg.cmapi.map_feature_selected.init();
//        edu.gmu.csiss.gpkg.cmapi.map_feature_selected_batch.init();
//        edu.gmu.csiss.gpkg.cmapi.map_feature_deselected.init();
//        edu.gmu.csiss.gpkg.cmapi.map_feature_deselected_batch.init();
//        edu.gmu.csiss.gpkg.cmapi.map_feature_update.init();
		
		/*----------------map.view Channels, added by Chen Zhang----------------*/
		edu.gmu.csiss.gpkg.cmapi.map_view_zoom.init();
//		edu.gmu.csiss.gpkg.cmapi.map_view_center_overlay.init();
//		edu.gmu.csiss.gpkg.cmapi.map_view_center_feature.init();
		edu.gmu.csiss.gpkg.cmapi.map_view_center_location.init();
//		edu.gmu.csiss.gpkg.cmapi.map_view_center_bounds.init();
//		edu.gmu.csiss.gpkg.cmapi.map_view_clicked.init();
//		edu.gmu.csiss.gpkg.cmapi.map_view_mousedown.init();
//		edu.gmu.csiss.gpkg.cmapi.map_view_mouseup.init();
		
		/*----------------map.status Channels, added by Chen Zhang----------------*/
//		edu.gmu.csiss.gpkg.cmapi.map_status_about.init();
//		edu.gmu.csiss.gpkg.cmapi.map_status_format.init();
//		edu.gmu.csiss.gpkg.cmapi.map_status_initialization.init();
//		//edu.gmu.csiss.gpkg.cmapi.map_status_request.init();
//		edu.gmu.csiss.gpkg.cmapi.map_status_selected.init();
//		edu.gmu.csiss.gpkg.cmapi.map_status_view.init();
		
		/*----------------map.error Channel, added by Chen Zhang----------------*/
//		edu.gmu.csiss.gpkg.cmapi.map_error.init();
		
        /*----------------test menu items, added by Gil Heo ----------------*/
//        edu.gmu.csiss.gpkg.cmapi.geopackage_test.init();
//        edu.gmu.csiss.gpkg.cmapi.channel_test.init();


        //this.testGeoJSON();
	},
	/**
	 * Deprecated by Ziheng Sun on 6/7/2016
	 */
	testGeoJSON: function(){
		//write a function to transform wkb to geojson
		//add by Ziheng Sun on 5/6/2016
		alert("Come inside");
		// Required imports (works in browser, too)
		var wkx = require('wkx');
		var buffer = require('buffer');

		// Sample data to convert
		var wkbLonlat = '010100000072675909D36C52C0E151BB43B05E4440';

		// Split WKB into array of integers (necessary to turn it into buffer)
		var hexAry = wkbLonlat.match(/.{2}/g);
		var intAry = [];
		for (var i in hexAry) {
		  intAry.push(parseInt(hexAry[i], 16));
		}

		// Generate the buffer
		var buf = new buffer.Buffer(intAry);

		// Parse buffer into geometric object
		var geom = wkx.Geometry.parse(buf);
		
		// Should log '-73.700380647'
		console.log(geom.x)

		// Should log '40.739754168'
		console.log(geom.y)
		
		var geojsonobj = geom.toGeoJSON();
		
		//$("#result").val( geojsonobj );
		
		//add GeoJSON to OpenLayers
		var s = new OpenLayers.Style({
		  'pointRadius': 10
		});
		var geojsonlayer = new ol.layer.Vector({
			title: 'Test geojson Layer',
			style: s,
			source: new ol.source.Vector({
				features: (new ol.format.GeoJSON()).readFeatures(geojsonobj)
			})
		});
		
		edu.gmu.csiss.gpkg.cmapi.openlayers.map.addLayer(geojsonlayer);
		
		alert("The geojson layer is added.");
	}
};
