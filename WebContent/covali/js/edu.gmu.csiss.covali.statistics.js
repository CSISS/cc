
/**
 * 
 * Statistics analysis
 * 
 * @author Ziheng Sun
 * 
 */

edu.gmu.csiss.covali.statistics = {

	draw: null,

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
		var bothMaps = $("#bothMapsPopupChk").prop('checked');
		map.on('singleclick', function(evt) {
			if(bothMaps) {
				edu.gmu.csiss.covali.statistics.showFeatureInfo(evt.coordinate, 'left');
				edu.gmu.csiss.covali.statistics.showFeatureInfo(evt.coordinate, 'right');
			} else {
				edu.gmu.csiss.covali.statistics.showFeatureInfo(evt.coordinate, side);
			}
		});


		//double click to close popups on both maps
		map.on('dblclick', function(){
			edu.gmu.csiss.covali.statistics.removePopupsFromBothMaps();
		});
	},

	listenTimeseries: function(side){
        var map = edu.gmu.csiss.covali.map.getMapBySide(side);
        var bothMaps = $("#bothMapsPopupChk").prop('checked');
        map.on('singleclick', function(evt) {
            if(bothMaps) {
                edu.gmu.csiss.covali.statistics.showTimeseries(evt.coordinate, 'left');
                edu.gmu.csiss.covali.statistics.showTimeseries(evt.coordinate, 'right');
            } else {
                edu.gmu.csiss.covali.statistics.showTimeseries(evt.coordinate, side);
            }
        });


        //double click to close popups on both maps
        map.on('dblclick', function(){
            edu.gmu.csiss.covali.statistics.removePopupsFromBothMaps();
        });
	},

    listenVerticalProfile: function(side){
        var map = edu.gmu.csiss.covali.map.getMapBySide(side);
        var bothMaps = $("#bothMapsPopupChk").prop('checked');
        map.on('singleclick', function(evt) {
            if(bothMaps) {
                edu.gmu.csiss.covali.statistics.showVerticalProfile(evt.coordinate, 'left');
                edu.gmu.csiss.covali.statistics.showVerticalProfile(evt.coordinate, 'right');
            } else {
                edu.gmu.csiss.covali.statistics.showVerticalProfile(evt.coordinate, side);
            }
        });


        //double click to close popups on both maps
        map.on('dblclick', function(){
            edu.gmu.csiss.covali.statistics.removePopupsFromBothMaps();
        });
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
        var bothMaps = $("#bothMapsPopupChk").prop('checked');
        edu.gmu.csiss.covali.statistics.draw.on('drawend', function(evt) {

            try{

                var line_geom = evt.feature.getGeometry().transform(map.getView().getProjection().getCode(),'EPSG:4326')

                linestring_coords = line_geom.getCoordinates();

                //use the coordinates to send a wms GetTransect request to the ncWMS
                var coords = "";


                for(var i=0;i<linestring_coords.length;i++){
                    if(i!=0){
                        coords += ",";
                    }
                    var coordinates = linestring_coords[i];
//	        		var coordinates = ol.proj.transform([linestring_coords[i][0], linestring_coords[i][1]], source.getProjection(), 'EPSG:4326');
                    coords += coordinates[0] + " " + coordinates[1];
                }
                if(bothMaps) {
                    edu.gmu.csiss.covali.statistics.getLineStatistics('left', coords);
                    edu.gmu.csiss.covali.statistics.getLineStatistics('right', coords);
                }
                else {
                    edu.gmu.csiss.covali.statistics.getLineStatistics(side, coords);
                }

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



    showFeatureInfo: function(coordinate, side) {
	        
		var layer = edu.gmu.csiss.covali.map.getVisibleTopWMSLayer(side);
        var map = edu.gmu.csiss.covali.map.getMapBySide(side);

        
        if(layer && layer.getVisible()==true){
            var popup = map.getOverlayById("point-popup-" + side);
            popup.setPosition(coordinate);
        	var viewResolution = /** @type {number} */ (map.getView().getResolution());
            
            var wmssource = layer.getSource();
            var epsg = map.getView().getProjection().getCode();
            
            var url = wmssource.getGetFeatureInfoUrl(coordinate, viewResolution, epsg, {'INFO_FORMAT': 'text/xml'});
    		var content = document.getElementById('popup-content-' + side);
    		var layerName = params.LayerName.split("/")[0];
    		var featureId = params.LayerName.split("/")[1];
    		console.log("ncWMS2 request:")
    		console.log(url);
            if (url && content) {

    		if (url && content) {
            	fetch(url)
    	        	.then(function(resp){
    	        		return resp.text();
    	        	})
    	        	.then(function(data){
                        var params = {
                            SERVICE: 'WMS',
                            VERSION: '1.3.0',
                            REQUEST: 'GetMetadata',
                            outputFormat: 'application/json',
                            ITEM: 'layerDetails',
                            LayerName: wmssource.params_.LAYERS,
                            TIME: wmssource.params_.TIME
                        };
                        //console.log(params);
                        var esc = encodeURIComponent;
                        var layerMetaDataUrl = 'http://localhost:8080/ncWMS2/wms?';
                        layerMetaDataUrl += Object.keys(params)
                            .map(k => esc(k) + '=' + esc(params[k]))
                            .join('&');
                        var layerName = params.LayerName.split("/")[0];
                        var featureId = params.LayerName.split("/")[1];

    	        		var parser = new DOMParser();
    	        		var xmlDoc = parser.parseFromString(data,"text/xml");
    	        		
    	        		var clickWithinTheLayer = xmlDoc.getElementsByTagName("layer").length;

    	        		
    	        		if(clickWithinTheLayer>0){
    	        			
	    	        		content.innerHTML = 
	    	        		'<div style="font-family: Arial, Helvetica, sans-serif">'+
	    	        		'<b>Layer:</b> '+layerName+
	    	        		'<br><b>Feature Id</b>: '+featureId+
	    	        		'<br><b>Clicked Lat:</b> '+xmlDoc.getElementsByTagName("latitude")[0].childNodes[0].nodeValue+
	    	        		'<br><b>Clicked Lon:</b> '+xmlDoc.getElementsByTagName("longitude")[0].childNodes[0].nodeValue+
	    	        		'<br><b>Time:</b> '+xmlDoc.getElementsByTagName("time")[0].childNodes[0].nodeValue+
	    	        		'<br><b>Value:</b> '+xmlDoc.getElementsByTagName("value")[0].childNodes[0].nodeValue;
	    	        	    $.ajax({
	    	        	        url: layerMetaDataUrl,
	    	        	        contentType: "application/json",
	    	        	        dataType: 'json',
	    	        	        success: function(result){
	    	        	        	var content1 = document.getElementById('popup-content-' + side);
	    	        	        	//console.log(content1);
	    	        	        	content1.innerHTML= '<pre>'+content1.innerHTML+'<b>Units:</b> '+result.units+'</pre></div>';
	    	        	        },
	    	    				error: function(msg){
	    	    					//var content1 = document.getElementById('popup-content-' + side);
	    	    					//content1.innerHTML= '<pre>'+content1.innerHTML+'</pre></div>';
	    	    					console.log("Failed to get layers details: " + msg);	    					
	    	    				}
	    	        	    })
    	        		}
    	        		else{	        		
    	        			content.innerHTML = '<pre><div style="font-family: Arial, Helvetica, sans-serif">'+
	    	        			'<b>Layer:</b> '+layerName+
	    	        			'<br><b>Feature Id</b>: '+featureId+
    	    	        		'<br><b>Clicked Lat:</b> '+xmlDoc.getElementsByTagName("latitude")[0].childNodes[0].nodeValue+
    	    	        		'<br><b>Clicked Lon:</b> '+xmlDoc.getElementsByTagName("longitude")[0].childNodes[0].nodeValue+
    	    	        		'</div></pre>';
    	        		}
    	        	})        	
            }
        }

    },

    showTimeseries: function(coordinate, side) {
        var layer = edu.gmu.csiss.covali.map.getVisibleTopWMSLayer(side);
        var map = edu.gmu.csiss.covali.map.getMapBySide(side);

        if(layer && layer.getVisible() != true){
        	return;
        }

        var layerInfo =  edu.gmu.csiss.covali.wms.getLayerByName(layer.values_.name);
        var startTime, endTime;

        for(var j=0; j<layerInfo.Dimension.length; j++) {
            if (layerInfo.Dimension[j].name == "time" || layerInfo.Dimension[j].name == "Time") {
                var timevalues = layerInfo.Dimension[j].values;

                if(timevalues.split(",").length>1){
                    var timesteps  = timevalues.split(",");
                    startTime = timesteps[0];
                    endTime = timesteps[timesteps.length - 1];

                }else if(timevalues.indexOf("/")!=-1) {

                    var timesplit = timevalues.split("/");

                    if (timesplit.length != 3) {
                        console.error("The time dimension definition is not supported yet.");
                        return;
                    }

                    startTime = timesplit[0];
                    endTime = timesplit[1];
                }
            }
        }

        var wmssource = layer.getSource();

		var viewResolution = (map.getView().getResolution());
		var epsg = map.getView().getProjection().getCode();
		var url = wmssource.getGetFeatureInfoUrl(coordinate, viewResolution, epsg,
			{'INFO_FORMAT': 'image/png', 'REQUEST': 'GetTimeseries', 'TIME': startTime + '/' + endTime});

        var dialogName = 'edu.gmu.csiss.covali.statistics.jsframe.TimeseriesResult';
        var dialogTitle = 'Timeseries: ' + layer.values_.name + ' from '+startTime + ' to ' + endTime;
        var content = '<div><img style="background: url(\'../images/loading1.gif\') no-repeat;min-height: 50px;min-width: 50px;" src="'+url+'" /></div>';

        edu.gmu.csiss.covali.statistics.showResultsDialog(dialogName, dialogTitle, content, side);
    },

	showVerticalProfile: function(coordinate, side) {
        var layer = edu.gmu.csiss.covali.map.getVisibleTopWMSLayer(side);
        var map = edu.gmu.csiss.covali.map.getMapBySide(side);


        if(layer && layer.getVisible() != true){
            return;
        }

        var wmssource = layer.getSource();
        var time = wmssource.params_.TIME;
        var elevStart, elevEnd;

        var layerInfo =  edu.gmu.csiss.covali.wms.getLayerByName(layer.values_.name);
        for(var j=0; j<layerInfo.Dimension.length; j++) {
            if (layerInfo.Dimension[j].name == "elevation" || layerInfo.Dimension[j].name == "Elevation") {
                var evalues = layerInfo.Dimension[j].values.split(/,\s+/);
                elevStart = evalues[0];
                elevEnd = evalues[evalues.length - 1];
            }
        }

        if(elevStart == null) {
        	alert('No elevation information in the layer ' + layer.values_.name);
        	return;
		}

        var viewResolution = (map.getView().getResolution());
        var epsg = map.getView().getProjection().getCode();
        var url = wmssource.getGetFeatureInfoUrl(coordinate, viewResolution, epsg,
            {'INFO_FORMAT': 'image/png', 'REQUEST': 'GetVerticalProfile', 'TIME': time, 'ELEVATION': elevStart + '/' + elevEnd});

        var dialogName = 'edu.gmu.csiss.covali.statistics.jsframe.VerticalProfileResult';
        var dialogTitle = 'Vertical Profile: ' + layer.values_.name;
        var content = '<div><img style="background: url(\'../images/loading1.gif\') no-repeat;min-height: 50px;min-width: 50px;" src="'+url+'" /></div>';

        edu.gmu.csiss.covali.statistics.showResultsDialog(dialogName, dialogTitle, content, side);
	},

	clearAllPopupsOnAMap: function(side){
		var map = edu.gmu.csiss.covali.map.getMapBySide(side);
		if($("#popup-" + side).length){
			var popup = map.getOverlayById("point-popup-" + side);
    		var element = popup.getElement();
    		$(element).popover('destroy');
    		$("#popup-" + side).remove();
    		//map.removeEventListener('singleclick');
    		map.un('singleclick', edu.gmu.csiss.covali.statistics.singleClickListener);
    	}
	},
	
	changePopupVisibility: function(side, checked){
		var map = edu.gmu.csiss.covali.map.getMapBySide(side);
		if($("#popup-" + side).length){
			var popup = map.getOverlayById("point-popup-" + side);
    		var element = popup.getElement();
    		if(checked==false){
    			$("#popup-" + side).hide();
    		}else{
    			$("#popup-" + side).show();
    		}

    	}
	},
	
	removePopupsFromBothMaps: function(){
		var sides = ["left", "right"];
		for (i=0; i<sides.length; i++){
			var map = edu.gmu.csiss.covali.map.getMapBySide(sides[i]);
			edu.gmu.csiss.covali.statistics.clearAllPopupsOnAMap(sides[i]);				
		}

	},


	removeAllListeners: function(){
		
		var leftmap = edu.gmu.csiss.covali.map.getMapBySide("left");
		

		var rightmap = edu.gmu.csiss.covali.map.getMapBySide("right");
		

		rightmap.removeEventListener('singleclick');
		leftmap.removeEventListener('singleclick');
		
	},
	
	startDrawing: function(thedialog){
		
		
		edu.gmu.csiss.covali.statistics.removeAllListeners();
							
		var type = $("#typeselect").val();

		if(type=="point"){
			edu.gmu.csiss.covali.statistics.listenPoint("left");
			edu.gmu.csiss.covali.statistics.listenPoint("right");
        } else if(type=="pointtimeseries"){
            edu.gmu.csiss.covali.statistics.listenTimeseries("left");
            edu.gmu.csiss.covali.statistics.listenTimeseries("right");
    	} else if(type=="pointverticalprofile"){
            edu.gmu.csiss.covali.statistics.listenVerticalProfile("left");
            edu.gmu.csiss.covali.statistics.listenVerticalProfile("right");
		} else if(type=="linestring"){

			edu.gmu.csiss.covali.statistics.listenLineString("left");
			edu.gmu.csiss.covali.statistics.listenLineString("right");
			
		}
		edu.gmu.csiss.covali.menu.closeAllDialogs();
	},
	
	showDialog: function(){
		
		//BootstrapDialog.closeAll();
		edu.gmu.csiss.covali.statistics.removePopupsFromBothMaps();
		
		var content = "<div class=\"row\" style=\"padding:10px;margin:0;\">"+
//			"<div class=\"form-group\"> "+
//			"<label for=\"mapsideselect\">Select Map Side</label><select id=\"mapsideselect\">"+
//			"<option value=\"left\">left</option>"+
//			"<option value=\"right\">right</option>"+
//			"</select></div>"+
			"<div class=\"form-group\">"+
			'<div><b>Activate pop-up on both maps:<b> <input type="checkbox" id="bothMapsPopupChk" name="bothMapsPopupChk"></div><br>'+
			"<label for=\"typeselect\">Select Statistics Type</label><select id=\"typeselect\">"+
			"<option value=\"point\">point value</option>"+
            "<option value=\"pointtimeseries\">point timeseries</option>"+
            "<option value=\"pointverticalprofile\">point vertical profile</option>"+
			"<option value=\"linestring\">linestring value</option><br>"+

			"</select></div></div><div class=\"row\" style=\"padding:10px;margin:0;\">Note: Double click on the map to stop.</div>";
		
		//only support the build-in ncWMS
	

		var content = "<div class=\"modal-body\"><dl class=\"row\" style=\"font-size: 12px; padding: 5px; margin:0px\">"+
			content+
			"</div></div>"+
			"<div class=\"modal-footer\">" +
			"<p style=\"margin:0;\"><span class=\"btn btn-primary\" onclick=\"edu.gmu.csiss.covali.statistics.startDrawing();\">Start</span></p>"+
			"</div>";			
		
		edu.gmu.csiss.covali.menu.closeAllDialogs();
		var dialogName = 'edu.gmu.csiss.covali.statistics.jsframe.Statistics';
		var dialogTitle = 'Statistics';
		edu.gmu.csiss.covali.menu.createDialog(dialogName, dialogTitle, content, 260);

	},
	

	getLineStatistics: function(side, linestring){
		var layer = edu.gmu.csiss.covali.map.getVisibleTopWMSLayer(side);
		//console.log(layer.getSource().getParams());

		var timestep = layer.getSource().getParams()["TIME"];

		var elevation = layer.getSource().getParams()["ELEVATION"];

		// var projection = map.getView().getProjection();

		var req = edu.gmu.csiss.covali.wms.getCurrentEndPoint() + "?REQUEST=GetTransect&LAYERS=" +

			layer.get('name') + "&CRS=EPSG:4326&LINESTRING=" +

			linestring + "&FORMAT=image/png&LOGSCALE=false&BGCOLOR=transparent&time=" + timestep;

		if(elevation != "" && elevation != null && typeof elevation !== 'undefined'){


			req += "&elevation=" + elevation;
		}


		var dialogName = 'edu.gmu.csiss.covali.statistics.jsframe.LineStatisticsResult';
		var dialogTitle = 'Line Statistics Result';
        var content = '<div><img style="background: url(\'../images/loading1.gif\') no-repeat;min-height: 50px;min-width: 50px;" src="'+req+'" /></div>';

		edu.gmu.csiss.covali.statistics.showResultsDialog(dialogName, dialogTitle, content, side);
	},

	showResultsDialog: function(name, title, content, side) {
        var x;
        if(side == 'left') {
            x = 420;
        } else {
            x = window.innerWidth/2 + 410;
        }
        edu.gmu.csiss.covali.menu.closeAllDialogs();
        edu.gmu.csiss.covali.menu.createDialog(name, title, content, 650, 740, x);
	}
	
		
}
