
/**
 * 
 * Statistics analysis
 * 
 * @author Ziheng Sun
 * 
 */

edu.gmu.csiss.covali.statistics = {
	
	draw: null,
	
	popup: null, 
	
	side: null,
	
	bothMapsPopupChecked: null,
	
	listenPoint: function(side){
		
			var map = edu.gmu.csiss.covali.map.getMapBySide(side);
			
			if(!$("#popup-"+side).length)
				$('body').append('<div id="popup-'+side+'" class="ol-popup">'+
					'      <a href="#" id="popup-closer-'+side+'" class="ol-popup-closer"></a>'+
					'      <div id="popup-content-'+side+'"></div>'+
					'    </div>'); 
			
			var container = document.getElementById('popup-'+side);
			var closer = document.getElementById('popup-closer-'+side);
			
			var popup = new ol.Overlay({
		        element: container,
		        id: "point-popup-" +side,
		        autoPan: true,
		        autoPanAnimation: {
		          duration: 250
		        }
		    });
			
			closer.onclick = function() {
				popup.setPosition(undefined);
		        closer.blur();
		        return false;
		    };
			
		    map.addOverlay(popup);
		    
		    //add single click
		    
		    if(bothMapsPopupChecked == true){
			    map.on('singleclick', function(evt) {
			    		edu.gmu.csiss.covali.statistics.showPopupsOnBothMapsSameXY(evt.coordinate);
			    });
		    }
		    else{
		    	map.on('singleclick', edu.gmu.csiss.covali.statistics.singleClickListener);
		    }
		    
		    //double click to close popups on both maps
		    
		    map.on('dblclick', function(){
		    	edu.gmu.csiss.covali.statistics.removePopupsFromBothMaps();
		    });	    
	},
	
	showPopupFunction: function(coordinate, map, side) {
		
		var hdms = ol.coordinate.toStringHDMS(ol.proj.toLonLat(coordinate));
        var popup = map.getOverlayById("point-popup-" + side);
        popup.setPosition(coordinate);
        var layer = edu.gmu.csiss.covali.map.getVisibleTopWMSLayer(side);
        var viewResolution = /** @type {number} */ (map.getView().getResolution());
        
        var wmssource = layer.getSource();
        
        var url = wmssource.getGetFeatureInfoUrl(coordinate, viewResolution, 'EPSG:3857', {'INFO_FORMAT': 'text/xml'});
        
        if (url) {
        	
        	fetch(url)
	        	.then(function(resp){
	        		return resp.text();
	        	})
	        	.then(function(data){
	        		parser = new DOMParser();
	        		xmlDoc = parser.parseFromString(data,"text/xml");
	        		
	        		var content = document.getElementById('popup-content-' + side);
	        		var LayerName = xmlDoc.getElementsByTagName("layer")[0].childNodes[0].nodeValue.split("/");
	        		
	        		content.innerHTML = //'X, Y: <code>' + hdms +'</code><pre>'+
	        		'<pre><div style="font-family: Arial, Helvetica, sans-serif">'+
	        		'<b>Layer:</b> '+LayerName[0]+
	        		//'<br>Layer: '+LayerName[1]+
	        		'<br><b>Feature id</b>: '+xmlDoc.getElementsByTagName("id")[0].childNodes[0].nodeValue+
	        		'<br><b>Clicked Lat:</b> '+xmlDoc.getElementsByTagName("latitude")[0].childNodes[0].nodeValue+
	        		'<br><b>Clicked Lon:</b> '+xmlDoc.getElementsByTagName("longitude")[0].childNodes[0].nodeValue+
	        		'<br><b>Time:</b> '+xmlDoc.getElementsByTagName("time")[0].childNodes[0].nodeValue+
	        		'<br><b>Value:</b> '+xmlDoc.getElementsByTagName("value")[0].childNodes[0].nodeValue+
	        		'</pre></div>';
	        	})        	
        }
    },
    
    showPopupsOnBothMapsSameXY: function(coordinates){
		var leftmap = edu.gmu.csiss.covali.map.getMapBySide("left");
		var rightmap = edu.gmu.csiss.covali.map.getMapBySide("right");
		edu.gmu.csiss.covali.statistics.showPopupFunction(coordinates, leftmap, "left");
		edu.gmu.csiss.covali.statistics.showPopupFunction(coordinates, rightmap, "right");
    },
    
	clearAllPopupsOnAMap: function(map,side){
		if($("#popup-" + side).length){
			var popup = map.getOverlayById("point-popup-" + side);
    		var element = popup.getElement();
    		$(element).popover('destroy');
    		$("#popup-" + side).remove();
    		map.un('singleclick', edu.gmu.csiss.covali.statistics.singleClickListener);
    	}
	},
	
	removePopupsFromBothMaps: function(){
		
		var leftmap = edu.gmu.csiss.covali.map.getMapBySide("left");
		var rightmap = edu.gmu.csiss.covali.map.getMapBySide("right");
		edu.gmu.csiss.covali.statistics.clearAllPopupsOnAMap(leftmap,"left");
		edu.gmu.csiss.covali.statistics.clearAllPopupsOnAMap(rightmap,"right");
		
	},

	listenLineString: function(side){
		
		var map = edu.gmu.csiss.covali.map.getMapBySide(side);
		
		var geometryFunction, maxPoints;
		
		var source = new ol.source.Vector({wrapX: false});
		
        edu.gmu.csiss.covali.statistics.draw = new ol.interaction.Draw({
            source: source,
            type: /** @type {ol.geom.GeometryType} */ ("LineString"),
            geometryFunction: geometryFunction,
            maxPoints: maxPoints
        });
        
        edu.gmu.csiss.covali.statistics.draw.on('drawend', function(evt) {
        	
        	try{
        		
        		var line_geom = evt.feature.getGeometry().transform('EPSG:3857','EPSG:4326')

	        	linestring_coords = line_geom.getCoordinates();
	        	
	        	//use the coordinates to send a wms GetTransect request to the ncWMS
	        	
	        	var coords = "";
	        	
//	        	var newProjCode = 'EPSG:' + code;
//	            proj4.defs(newProjCode, proj4def);
//	            var newProj = ol.proj.get(newProjCode);
//	            var fromLonLat = ol.proj.getTransform('EPSG:4326', newProj);
//	            var extent = ol.extent.applyTransform(
//	                [bbox[1], bbox[2], bbox[3], bbox[0]], fromLonLat);
//	            newProj.setExtent(extent);
//	            var newView = new ol.View({
//	              projection: newProj
//	            });
	        	
	        	for(var i=0;i<linestring_coords.length;i++){
	        		if(i!=0){
	        			coords += ",";
	        		}
	        		var coordinates = linestring_coords[i];
//	        		var coordinates = ol.proj.transform([linestring_coords[i][0], linestring_coords[i][1]], source.getProjection(), 'EPSG:4326');
	        		coords += coordinates[0] + " " + coordinates[1];
	        	}
	        	
	        	console.log(coords);
        	
        		edu.gmu.csiss.covali.statistics.getLineStatistics(side, coords);
        		
        	}catch(e){
        		
        		console.error(e);
        		
        		alert("fail to generate the report " + e);
        		
        	}
        	
        }, this);
        
        map.addInteraction(edu.gmu.csiss.covali.statistics.draw);
        
        map.on('dblclick', function(evt){
        	var map = evt.map;
        	map.getInteractions().forEach(function (interaction) {
        		  if(interaction instanceof ol.interaction.Draw) {
        			  map.removeInteraction(interaction);
        			  //remove the draw from the other map as well
        			  var theotherside = edu.gmu.csiss.covali.map.getOtherSide(side);
        			  var othermap = edu.gmu.csiss.covali.map.getMapBySide(theotherside);
        			  othermap.getInteractions().forEach(function (interaction) {
	                		  if(interaction instanceof ol.interaction.Draw) {
	                			  othermap.removeInteraction(interaction);
	                		  }
                		  }
        			  );
        		  }
    		});
        });
        
		
	},
	
	removeAllListeners: function(){
		
		var leftmap = edu.gmu.csiss.covali.map.getMapBySide("left");
		
		leftmap.un('singleclick', edu.gmu.csiss.covali.statistics.singleClickListener);
		
		var rightmap = edu.gmu.csiss.covali.map.getMapBySide("right");
		
		rightmap.un('singleclick', edu.gmu.csiss.covali.statistics.singleClickListener);
		
	},
	
	showDialog: function(){
		
		BootstrapDialog.closeAll();
		
		var content = "<div class=\"row\" style=\"padding:10px;\">"+
//			"<div class=\"form-group\"> "+
//			"<label for=\"mapsideselect\">Select Map Side</label><select id=\"mapsideselect\">"+
//			"<option value=\"left\">left</option>"+
//			"<option value=\"right\">right</option>"+
//			"</select></div>"+
			"<div class=\"form-group\">"+
			'<div><b>Activate pop-up on both maps:<b> <input type="checkbox" id="bothMapsPopupChk" name="bothMapsPopupChk"></div><br>'+
			"<label for=\"typeselect\">Select Statistics Type</label><select id=\"typeselect\">"+
			"<option value=\"point\">point</option>"+
			"<option value=\"linestring\">linestring</option><br>"+
			
			"</select></div></div><div class=\"row\" style=\"padding:10px;\">Note: Double click on the map to stop.</div>";
		
		//only support the build-in ncWMS
		
		BootstrapDialog.show({
			
			title: "Statistics",
			
			message: content,
			
			buttons: [{
				
				label: "Start Draw",
				
				action: function(thedialog){
					
					edu.gmu.csiss.covali.statistics.removeAllListeners();
										
					var type = $("#typeselect").val();
					//var bothMapsPopupChecked = $("#bothMapsPopupChk");
					bothMapsPopupChecked = document.getElementById("bothMapsPopupChk").checked;
					
					if(type=="point"){
						
						//add a click pop-up function
						
						edu.gmu.csiss.covali.statistics.listenPoint("left");
						edu.gmu.csiss.covali.statistics.listenPoint("right");
						
					}else if(type=="linestring"){
						
						//add a line drawing function
						
						edu.gmu.csiss.covali.statistics.listenLineString("left");
						edu.gmu.csiss.covali.statistics.listenLineString("right");
						
					}
					
				    thedialog.close();
					
				}
				
			},{
				
				label: "Close",
				
				action: function(thedialog){
					
					thedialog.close();
				}
			}]
		});
	},
	
	singleClickListener: function(evt) {
		
		var coordinate = evt.coordinate;
        
		var hdms = ol.coordinate.toStringHDMS(ol.proj.toLonLat(coordinate));
        
        var map = evt.map;
        //http://localhost:8080/ncWMS2/wms?LAYERS=22kuuxf9%2FBand1&QUERY_LAYERS=22kuuxf9%2FBand1&STYLES=default-scalar%2Fdefault&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&BBOX=-180%2C-129.000522%2C180%2C158.999478&FEATURE_COUNT=5&HEIGHT=600&WIDTH=750&FORMAT=image%2Fpng&INFO_FORMAT=text%2Fxml&SRS=EPSG%3A4326&X=179&Y=251
        
//        var map = edu.gmu.csiss.covali.map.getMapBySide(edu.gmu.csiss.covali.statistics.side);
//        
//        //send a GetFeatureInfo request
        
        var side = edu.gmu.csiss.covali.map.getSideByMapContainerId(map.getTarget());
        
        var popup = map.getOverlayById("point-popup-" + side);
        //var dialogModal = $("#showDialog");
        popup.setPosition(coordinate);
        
//        if(side=="left")
//        	edu.gmu.csiss.covali.statistics.popup.setPosition(coordinate);
//        else
//        	edu.gmu.csiss.covali.statistics.popup.setPosition(coordinate);
//        
        var layer = edu.gmu.csiss.covali.map.getVisibleTopWMSLayer(side);
//        
//        var bbox = "-180%2C-129.000522%2C180%2C158.999478";
//        
//        var size = map.getSize();
//        
//        var pixel = map.getPixelFromCoordinate(coordinate);
//        
//        var req = edu.gmu.csiss.covali.wms.getCurrentEndPoint() + "?LAYERS="+
//        	layer.get('name') +
//        	"&QUERY_LAYERS="+layer.get('name')+
//        	"&STYLES=default-scalar%2Fdefault&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&BBOX="+
//        	clickbbox+"&FEATURE_COUNT=5&HEIGHT=600&WIDTH=750&FORMAT=image%2Fpng&INFO_FORMAT=text%2Fxml&SRS=EPSG%3A4326&X=179&Y=251"
        

        var viewResolution = /** @type {number} */ (map.getView().getResolution());
        
        var wmssource = layer.getSource();
        
        var url = wmssource.getGetFeatureInfoUrl(evt.coordinate, viewResolution, 'EPSG:3857', {'INFO_FORMAT': 'text/xml'});
        
        if (url) {
        
//        	document.getElementById('info').innerHTML = '<iframe seamless src="' + url + '"></iframe>';

//            var content = document.getElementById('popup-content-' + side);
//            
//            content.innerHTML = '<p>You clicked here:</p><code>' + hdms +
//            
//                '</code><iframe seamless src="' + url + '"></iframe>';
        	
        	fetch(url)
	        	.then(function(resp){
	        		return resp.text();
	        	})
	        	.then(function(data){
	        		parser = new DOMParser();
	        		xmlDoc = parser.parseFromString(data,"text/xml");
	        		
	        		var content = document.getElementById('popup-content-' + side);
	        		var LayerName = xmlDoc.getElementsByTagName("layer")[0].childNodes[0].nodeValue.split("/");
	        		
	        		content.innerHTML = //'X, Y: <code>' + hdms +'</code><pre>'+
	        		'<pre><div style="font-family: Arial, Helvetica, sans-serif">'+
	        		'<b>Layer:</b> '+LayerName[0]+
	        		//'<br>Layer: '+LayerName[1]+
	        		'<br><b>Feature id</b>: '+xmlDoc.getElementsByTagName("id")[0].childNodes[0].nodeValue+
	        		'<br><b>Clicked Lat:</b> '+xmlDoc.getElementsByTagName("latitude")[0].childNodes[0].nodeValue+
	        		'<br><b>Clicked Lon:</b> '+xmlDoc.getElementsByTagName("longitude")[0].childNodes[0].nodeValue+
	        		'<br><b>Time:</b> '+xmlDoc.getElementsByTagName("time")[0].childNodes[0].nodeValue+
	        		'<br><b>Value:</b> '+xmlDoc.getElementsByTagName("value")[0].childNodes[0].nodeValue+
	        		'</pre></div>';
	        	})        	
        }
        
    },
	
	getLineStatistics: function(side, linestring){
		
//    	http://godiva.rdg.ac.uk/ncWMS2/wms?REQUEST=GetTransect&LAYERS=cci/analysed_sst&CRS=CRS:84&LINESTRING=62.04%2018,%2064.56%204.56,%2076.56%201.08&FORMAT=image/png&TIME=2010-12-31T12:00:00.000Z&COLORSCALERANGE=269,306&NUMCOLORBANDS=250&LOGSCALE=false&ABOVEMAXCOLOR=0x000000&BELOWMINCOLOR=0x000000&BGCOLOR=transparent&PALETTE=psu-inferno
		
		var layer = edu.gmu.csiss.covali.map.getVisibleTopWMSLayer(side);
		
		var timestep = layer.getSource().getParams()["TIME"];
		
		var elevation = layer.getSource().getParams()["ELEVATION"];
		
		var req = edu.gmu.csiss.covali.wms.getCurrentEndPoint() + "?REQUEST=GetTransect&LAYERS=" + layer.get('name') + "&CRS=CRS:84&LINESTRING=" +
		
			linestring + "&FORMAT=image/png&LOGSCALE=false&BGCOLOR=transparent&time=" + timestep + "&elevation=" + elevation;
		
		console.log(req);
		
		var $textAndPic = $('<div></div>');
        
		$textAndPic.append('<img src="'+req+'" />');
        
		BootstrapDialog.show({
            title: 'Line Statistics Result',
            size: BootstrapDialog.SIZE_WIDE,
            message: $textAndPic,
            onshown: function(){
//            	$("img").one("load", function() {
//        		  // do stuff
//            		$textAndPic.append("<p id=\"notice\">Report is loading..</p>");
//        		}).each(function() {
//        		  if(this.complete) {
//        		      $(this).load(); // For jQuery < 3.0 
//        		      $("#notice").remove();
//        		      // $(this).trigger('load'); // For jQuery >= 3.0 
//        		  }
//        		});
            },
            buttons: [
            	//since the image can be downloaded by right click, this button is not necessary.
//            	{
//                label: 'Download',
//                action: function(dialogRef){
//                	console.log("start to download the report");
//                	dialogRef.enableButtons(false);
////                    dialogRef.setClosable(false);
//                	$("body").append("<a id='hiddenLink' href='" + req + "' style='display:none;' download>Download Image</a>");
//                	$("#hiddenLink")[0].click();
//                	$("#hiddenLink").remove();
//                	dialogRef.enableButtons(true);
////                    dialogRef.setClosable(true);
//                }
//            }, 
            {
                label: 'Close',
                action: function(dialogRef){
                    dialogRef.close();
                }
            }]
        });
		
	},
	
		
}
