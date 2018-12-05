
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
		
	showDialog: function(){
		
		BootstrapDialog.closeAll();
		
		var content = "<div class=\"row\" style=\"padding:10px;\"><select id=\"mapsideselect\">"+
			"<option value=\"left\">left</option>"+
			"<option value=\"right\">right</option>"+
			"</select><select id=\"typeselect\">"+
			"<option value=\"point\">point</option>"+
			"<option value=\"linestring\">linestring</option>"+
			"</select></div>";
		
		//only support the build-in ncWMS
		
		BootstrapDialog.show({
			
			title: "Statistics",
			
			message: content,
			
			buttons: [{
				
				label: "Start Draw",
				
				action: function(thedialog){
					
					var side = $("#mapsideselect").val();

			        var map = edu.gmu.csiss.covali.map.getMapBySide(side);
					
					console.log("chosen map: " + side);
					
					var type = $("#typeselect").val();
					
					if(type=="point"){
						
						//add a click pop-up function
						
						if(!$("#popup").length)
							$('body').append('<div id="popup" class="ol-popup">'+
								'      <a href="#" id="popup-closer" class="ol-popup-closer"></a>'+
								'      <div id="popup-content"></div>'+
								'    </div>'); 
						
						var container = document.getElementById('popup');
						var closer = document.getElementById('popup-closer');
						
						
						
						edu.gmu.csiss.covali.statistics.popup = new ol.Overlay({
					        element: container,
					        autoPan: true,
					        autoPanAnimation: {
					          duration: 250
					        }
					    });
						
						closer.onclick = function() {
							edu.gmu.csiss.covali.statistics.popup.setPosition(undefined);
					        closer.blur();
					        return false;
					    };
						
					    map.addOverlay(edu.gmu.csiss.covali.statistics.popup);
					    
					    map.on('singleclick', edu.gmu.csiss.covali.statistics.singleClickListener);
					    
					    //double click to end
					    
					    map.on('dblclick', function(evt){
					    	if($("#popup").length){
					    		var element = edu.gmu.csiss.covali.statistics.popup.getElement();
					    		$(element).popover('destroy');
					    		$("#popup").remove();
					    		map.un('singleclick', edu.gmu.csiss.covali.statistics.singleClickListener);
					    	}
					    });
						
					}else if(type=="linestring"){
						
						//add a line drawing function
						
						var geometryFunction, maxPoints;
						
						var source = new ol.source.Vector({wrapX: false});
						
				        edu.gmu.csiss.covali.statistics.draw = new ol.interaction.Draw({
				            source: source,
				            type: /** @type {ol.geom.GeometryType} */ ("LineString"),
				            geometryFunction: geometryFunction,
				            maxPoints: maxPoints
				        });
				        
				        edu.gmu.csiss.covali.statistics.draw.on('drawend',
				                function(evt) {
				        	
				        	try{
				        		
				        		var line_geom = evt.feature.getGeometry().transform('EPSG:3857','EPSG:4326')

					        	linestring_coords = line_geom.getCoordinates();
					        	
					        	//use the coordinates to send a wms GetTransect request to the ncWMS
					        	
					        	var coords = "";
					        	
//					        	var newProjCode = 'EPSG:' + code;
//					            proj4.defs(newProjCode, proj4def);
//					            var newProj = ol.proj.get(newProjCode);
//					            var fromLonLat = ol.proj.getTransform('EPSG:4326', newProj);
//					            var extent = ol.extent.applyTransform(
//					                [bbox[1], bbox[2], bbox[3], bbox[0]], fromLonLat);
//					            newProj.setExtent(extent);
//					            var newView = new ol.View({
//					              projection: newProj
//					            });
					        	
					        	for(var i=0;i<linestring_coords.length;i++){
					        		if(i!=0){
					        			coords += ",";
					        		}
					        		var coordinates = linestring_coords[i];
//					        		var coordinates = ol.proj.transform([linestring_coords[i][0], linestring_coords[i][1]], source.getProjection(), 'EPSG:4326');
					        		coords += coordinates[0] + " " + coordinates[1];
					        	}
					        	
					        	console.log(coords);
				        	
				        		edu.gmu.csiss.covali.statistics.getLineStatistics(side, coords);
				        		
				        	}catch(e){
				        		
				        		console.error(e);
				        		
				        		alert("fail to generate the report " + e);
				        		
				        	}
				        	
				        	map.removeInteraction(edu.gmu.csiss.covali.statistics.draw);

				        	
				        }, this);
				        
				        map.addInteraction(edu.gmu.csiss.covali.statistics.draw);
				        
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
        var content = document.getElementById('popup-content');
        content.innerHTML = '<p>You clicked here:</p><code>' + hdms +
            '</code>';
        edu.gmu.csiss.covali.statistics.popup.setPosition(coordinate);
    },
	
	getPointStatistics:function(side){
		
		
	},
	

	getLineStatistics: function(side, linestring){
		
//    	http://godiva.rdg.ac.uk/ncWMS2/wms?REQUEST=GetTransect&LAYERS=cci/analysed_sst&CRS=CRS:84&LINESTRING=62.04%2018,%2064.56%204.56,%2076.56%201.08&FORMAT=image/png&TIME=2010-12-31T12:00:00.000Z&COLORSCALERANGE=269,306&NUMCOLORBANDS=250&LOGSCALE=false&ABOVEMAXCOLOR=0x000000&BELOWMINCOLOR=0x000000&BGCOLOR=transparent&PALETTE=psu-inferno
		
		var layer = edu.gmu.csiss.covali.map.getVisibleTopWMSLayer(side);
		
		var req = edu.gmu.csiss.covali.wms.getCurrentEndPoint() + "?REQUEST=GetTransect&LAYERS=" + layer.get('name') + "&CRS=CRS:84&LINESTRING=" + 
		
			linestring + "&FORMAT=image/png&LOGSCALE=false&BGCOLOR=transparent";
		
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
            buttons: [{
                label: 'Download',
                action: function(dialogRef){
                	console.log("start to download the report");
                	dialogRef.enableButtons(false);
//                    dialogRef.setClosable(false);
                	$("body").append("<a id='hiddenLink' href='" + req + "' style='display:none;' download>Download Image</a>");
                	$("#hiddenLink")[0].click();
                	$("#hiddenLink").remove();
                	dialogRef.enableButtons(true);
//                    dialogRef.setClosable(true);
                }
            }, {
                label: 'Close',
                action: function(dialogRef){
                    dialogRef.close();
                }
            }]
        });
		
	},
	
		
}
