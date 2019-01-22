/**
 * @author Ziheng Sun
 * @date 2018.06.01
 */

edu.gmu.csiss.covali.map = {
		
		legend_layername: null,
		
		layer_details: null,
		
		legend_url: null,
		
		palette_dialog: null,
		
		style_dialog: null,
		
		init: function(){
			
			this.addBoundaryWMS();
			
		},
		
		getMapStatus: function(side){
			
			var id = this.getMapContainerIdBySide(side);
			
			return $("#"+id).is(":visible");
			
		},
		
		/**
		 * This function controls the show/hide of the left/right map panel
		 */
		mapSwitch: function(side, status){
			
			var id = this.getMapContainerIdBySide(side);
			
			var otherside = this.getOtherSide(side);
			
			var otherid = this.getMapContainerIdBySide(otherside);
			
			var othermap = this.getMapBySide(otherside);
			
			if(status){
				
				//show map
				
				$("#"+id).show();
				
				$("#"+otherid).removeClass("col-xs-12");
				
				$("#"+otherid).addClass("col-xs-6");
				
				othermap.updateSize();
				
			}else{
				
				//hide map
				
				$("#"+id).hide();
				
				$("#"+otherid).removeClass("col-xs-6");
				
				$("#"+otherid).addClass("col-xs-12");
				
				othermap.updateSize();
				
			}
			
		},
		
		getOtherSide: function(side){
			
			var otherside = "";
			
			if(side=="left"){
				
				otherside = "right";
				
			}else{
				
				otherside = "left";
				
			}
			
			return otherside;
			
		},
		
		getSideByMapContainerId: function(id){
			
			var side = "";
			
			if(id=="openlayers1"){
				
				side = "left";
				
			}else if(id=="openlayers2"){
				
				side = "right";
				
			}
			
			return side;
			
		},
		
		getMapContainerIdBySide: function(side){
			
			var id = "";
			
			if(side=="left"){
				
				id = "openlayers1";
				
			}else if(side=="right"){
				
				id = "openlayers2";
				
			}
			
			return id;
			
		},
		
		getLegendIdBySide: function(side){
			
			var id = "";
			
			if(side == "left"){
				
				id = "legend1";
				
			}else if(side == "right"){				
				
				id = "legend2";
				
			}
			
			return id;
			
		},
		
		getSideByLegendId: function(id){
			
			var side = "";
			
			if(id == "legend1"){
				
				side = "left";
				
			}else if(id == "legend2"){
				
				side = "right";
				
			}
			
			return side;
			
		},
		
		isValue: function(v){
			
			var is = false;
			
			if(typeof v != 'undefined'&&v!=null&&v!="")
				
				is = true;
			
			return is;
			
		},
		
		/**
		 * only used for updating the legend div element and the current legend layer variable
		 */
		updateLegend: function(side,layername, legendurl, palette, style){
			
			var lid = edu.gmu.csiss.covali.map.getLegendIdBySide(side);
			
//			var mapid = edu.gmu.csiss.covali.map.getMapContainerIdBySide(side);
			
//			var map = edu.gmu.csiss.covali.map.getMapBySide(side);
			
//			if(edu.gmu.csiss.covali.map.isValue(layername))
			
			edu.gmu.csiss.covali.map.legend_layername = layername;
			
//			var layer = edu.gmu.csiss.covali.map.getWMSLayerByName(map, edu.gmu.csiss.covali.map.legend_layername);
			
			if(edu.gmu.csiss.covali.map.isValue(legendurl)){
				
				if(edu.gmu.csiss.covali.map.isValue(palette)){
					
					legendurl = edu.gmu.csiss.covali.map.setParameterByName("PALETTE", palette, legendurl);
					
//					$('#'+lid).attr("palette", palette);
					
				}
				
				var height = 100;
				
				if($("#"+lid).height()!=0){
					
					height = $("#"+lid).height();
					
				}
			
				$('#'+lid).css("background-image", "url(" + legendurl + "&COLORBARONLY=true&width=20&height=" + height + ")");  
				
				$('#'+lid).attr("legendurl", legendurl);
				
//				layer.getSource().getParams()["LEGEND"] = legendurl;
				
			}else{
				
				$('#'+lid).css("background-image", "url('')");  
				
				$('#'+lid).attr("legendurl", null);
				
			}
			
			console.log("the legend div height: " + $("#"+lid).height());
			
		},
		
		getMapBySide: function(side){
			
			var id = this.getMapContainerIdBySide(side);
			
			return edu.gmu.csiss.gpkg.cmapi.openlayers.getMap(id);
			
		},
		
		choosePalette: function(obj){
			
			var palettename = $(obj).val();
			
			//switch palette in the style manager
			
			$("#paletteselector").attr("src", edu.gmu.csiss.covali.map.legend_url+ "&palette=" + palettename +"&height=1&VERTICAL=FALSE&COLORBARONLY=True");
			
			$("#paletteselector").attr("alt", palettename);
			
			edu.gmu.csiss.covali.map.palette_dialog.close();
			
		},
		
		paletteselector: function(){
			
			var $content = "";
			
			for(var i=0; i<edu.gmu.csiss.covali.map.layerdetails.palettes.length; i++){
				
				var palettename = edu.gmu.csiss.covali.map.layerdetails.palettes[i];
				
				var paletteurl = edu.gmu.csiss.covali.map.legend_url+ "&palette=" + palettename +"&height=1&VERTICAL=FALSE&COLORBARONLY=True";
				
				var checked = "";
				
				if(palettename==$("#paletteselector").attr("alt")){
					
					checked = "checked=\"checked\"";
					
				}
				
				$content += "<div class=\"row\">"+
				
				"	  <div class=\"col-md-9\"><img id=\"paletteselector\" src=\""+ paletteurl + "\"" +
				
				" 		style=\"width:100%;height:30px;\" alt=\"Palette\"></div>" +

				"	  <div class=\"col-md-3\"><span><input type=\"radio\" onclick=\"edu.gmu.csiss.covali.map.choosePalette(this);\" name=\"palette\" value=\"" + palettename + "\" " + checked + " />" + palettename + "</span></div>" +
				
				"	</div>";
				
			}
			
			edu.gmu.csiss.covali.map.palette_dialog = new BootstrapDialog({
				
				message: $content,
				
				title: "Palette Selector",
	            
	            cssClass: 'dialog-vertical-center',
	            
	            buttons: [{
	            	
	            	label: "Apply",
	            	
	            	action: function(dialogItself){
	            		
	            		dialogItself.close();
	            		
	            	}
	            	
	            },{
	                
	            	label: 'Close',
	                
	            	action: function(dialogItself){
	                	
	                    dialogItself.close();
	                    
	                }
	            
	            }]
				
			});
			
			edu.gmu.csiss.covali.map.palette_dialog.open();
			
			
		},
		
		setParameterByName: function(name, value, url){
			
			if (!url) url = window.location.href;
		    
			name = name.replace(/[\[\]]/g, '\\$&');
		    
			var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
		    
				results = regex.exec(url);
		    
			if (!results){
				
				url += "&" + name + "=" + value;
				
			}else if(!results[2]){
				
				url = url.replace(name+"=", name+"="+value);
				
			}else{
				
				url = url.replace(name+"="+results[2], name+"="+value);
				
			}
			
			return url;
			
		},
		
		getParameterByName: function (name, url) {
		
			if (!url) url = window.location.href;
		    
			name = name.replace(/[\[\]]/g, '\\$&');
		    
			var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
		    
				results = regex.exec(url);
		    
			if (!results) return null;
		    
			if (!results[2]) return '';
		    
			return decodeURIComponent(results[2].replace(/\+/g, ' '));
		
		},
		
		/**
		 * show style manager. all information comes from the legend element object and the global variable
		 */
		showStyleManager: function(legendid, legendurl, palettename, min, max, currentstyle, belowcolor, abovecolor){
			
			$stylelist = "<select class=\"form-control\" id=\"stylelist\" style=\"width:auto;\"> ";
			
			for(var i=0;i<edu.gmu.csiss.covali.map.layerdetails.supportedStyles.length;i++){
				
				var selected = "";
				
				if(currentstyle == edu.gmu.csiss.covali.map.layerdetails.supportedStyles[i]){
					
					selected = " selected=\"selected\"";
					
				}
				
				$stylelist += "    <option value=\""+edu.gmu.csiss.covali.map.layerdetails.supportedStyles[i] +"\" "+ selected +" >" + edu.gmu.csiss.covali.map.layerdetails.supportedStyles[i] + "</option> ";
				
			}
			
			$stylelist += "  </select>";
			
			var bc = belowcolor.slice(-6);
			
			var ac = abovecolor.slice(-6);
			
			$content = "<div class=\"row\" style=\"padding: 10px;\">" +
			
			"<p>Layer: "+edu.gmu.csiss.covali.map.legend_layername+"</p>"+
			
			"</div>"+
				
			"<div class=\"row\">" +
			
			"	<div class=\"col-md-1\">  " +
			
			"		<div id=\"colorbelowblock\" style=\"width:100%;height:30px;background-color:#"+bc+";\" alt=\""+ belowcolor +"\"></div>"+
			
			"	</div>" +
			
			"	<div class=\"col-md-10\">  " +
			
			"		<img id=\"paletteselector\" onclick=\"edu.gmu.csiss.covali.map.paletteselector()\" src=\""+
			
			legendurl + "&palette=" + palettename + "&height=1&VERTICAL=False&COLORBARONLY=True\"" +
			
			" 		style=\"width:100%;height:30px;\" alt=\""+palettename+"\" />" +
			
			"	</div>" +
			
			"	<div class=\"col-md-1\">  " +
			
			"		<div id=\"coloraboveblock\" style=\"width:100%;height:30px;background-color:#"+ac+";\" alt=\""+ abovecolor +"\" ></div>"+
			
			"	</div>" +
			
			"</div>" +
			
			"<br/>" + 
			
			"<div class=\"row\">" +
			
			"	<div class=\"col-md-12\">" +
			
			"		<span class=\"pull-left\">Min: <input id=\"min\" type=\"text\"  style=\"width:60px\" value=\""+
			
			min + "\" /></span> " +

			"		<span class=\"pull-right\">Max: <input id=\"max\" type=\"text\" style=\"width:60px\" value=\""+
			
			max + "\" /></span>"+
			
			"	</div>"+
			
			"</div>"+
			
			"<br/>" + 
			
			"<div class=\"row\">" +
			
			"	<div class=\"col-md-12\">"+
			
			"		<span class=\"col-centered\">Style: "+$stylelist+"</span> " +
			
			"	</div>"+
			
			"</div>"+
			
			"<br/>" + 

			"<div class=\"row\">" +
			
			"	<div class=\"col-md-6\">"+
			
			"		<div class=\"input-group colorpicker-component\">Color Below Min: <input id=\"colorbelowpicker\" type=\"text\" value=\""+
			
			bc +"\" class=\"form-control\"/></div> " +
			
			"	</div>"+
			
			"	<div class=\"col-md-6\">"+
			
			"		<div class=\"input-group colorpicker-component\">Color Above Max: <input id=\"colorabovepicker\" type=\"text\" value=\""+
			
			ac +"\" class=\"form-control\"/></div> " +
			
			"	</div>"+
			
			"</div>";
			
			
			edu.gmu.csiss.covali.map.style_dialog = new BootstrapDialog({
				
	            message: $content,
	            
	            title: "Style Manager",
	            
	            cssClass: 'dialog-vertical-center',
	            
	            onshown: function(dialog){
	            	
	            	$('#colorbelowpicker').colorpicker({"color":bc}).on('changeColor', function(){
	            		
	            		//change the color block as well
	            		
	            		$("#colorbelowblock").css("background-color", $("#colorbelowpicker").val());
	            		
	            	});
	            	
	            	$('#colorabovepicker').colorpicker({"color":ac}).on('changeColor', function(){
	            		
	            		$("#coloraboveblock").css("background-color", $("#colorabovepicker").val());
	            		
	            	});
	            	
	            },
	            
	            buttons: [{
	            	
	            	label: "Apply",
	            	
	            	action: function(dialogItself){
	            		
	            		var style = $("#stylelist").val()
	            		
	            		var palette = $("#paletteselector").attr("alt");
	            		
	            		var minv = $("#min").val();
	            		
	            		var maxv = $("#max").val();
	            		
	            		var newbelowcolor = belowcolor.replace(bc, $("#colorbelowpicker").val().slice(-6));
	            		
	            		var newabovecolor = abovecolor.replace(ac, $("#colorabovepicker").val().slice(-6));
	            		
	            		//change the color bar
	            		
	            		var side = edu.gmu.csiss.covali.map.getSideByLegendId(legendid);
	            		
//	            		$("#"+legendid).attr("src", $(legendobj).attr("legendurl")+"&height=1&VERTICAL=FALSE&COLORBARONLY=True");
	            		
	            		edu.gmu.csiss.covali.map.updateLegend(side, edu.gmu.csiss.covali.map.legend_layername, 
	            				legendurl, palette, style);
	            		
//	            		function(side,layername, legendurl, palette, min, max, style){
	            		
	            		//change the layer source
	            		
	            		var map = edu.gmu.csiss.covali.map.getMapBySide(side);
	            		
	            		var layer = edu.gmu.csiss.covali.map.getWMSLayerByName(map, edu.gmu.csiss.covali.map.legend_layername);
	            		
	            		layer.setSource(new ol.source.TileWMS({
	            			
		  					url: layer.getSource().getUrls()[0],
		  				    
		  					params: {
		  						
		  						'LAYERS': edu.gmu.csiss.covali.map.legend_layername, 
		  				    	
		  				    	'TILED': true, 
		  				    	
		  				    	'VERSION': '1.3.0',
		  				    	
		  				    	'COLORSCALERANGE': minv+","+maxv,
		  				    	
		  				    	'LEGEND': $("#"+legendid).attr("legendurl"),
		  				    	
		  				    	'STYLES':style+"/"+palette,
		  				    	
		  				    	'ABOVEMAXCOLOR': newabovecolor,
		  				    	
		  				    	'BELOWMINCOLOR': newbelowcolor
		  				    	
		  					}
	            			
	  				    }));
	            		
	            	}
	            	
	            },{
	                
	            	label: 'Close',
	                
	            	action: function(dialogItself){
	                	
	                    dialogItself.close();
	                    
	                }
	            
	            }]
	        
			});
			
			edu.gmu.csiss.covali.map.style_dialog.open();
			
		},
		
		/**
		 * The event listener to legend click
		 */
		legendclick: function(legendobj, side){
			
			var layer = edu.gmu.csiss.covali.map.getVisibleTopWMSLayer(side);
			
			edu.gmu.csiss.covali.map.legend_layername = layer.get('name');
				
			$.ajax({
				
				contentType: "application/x-www-form-urlencoded", //this is by default
				
				type: "GET",
				
				url: "../../ncWMS2/wms?request=GetMetadata&item=layerDetails&layerName=" + edu.gmu.csiss.covali.map.legend_layername,
				
				success: function(obj, text, jxhr){
					
					edu.gmu.csiss.covali.map.layerdetails = obj;
					
					edu.gmu.csiss.covali.map.legend_url = $(legendobj).attr("legendurl");
					
					var palettename = edu.gmu.csiss.covali.map.getParameterByName("PALETTE", edu.gmu.csiss.covali.map.legend_url);
					
					if(palettename == null){
						
						palettename = edu.gmu.csiss.covali.map.getParameterByName("palette", edu.gmu.csiss.covali.map.legend_url);
						
					}
					
					var map = edu.gmu.csiss.covali.map.getMapBySide(side);
					
					var layer = edu.gmu.csiss.covali.map.getWMSLayerByName(map, edu.gmu.csiss.covali.map.legend_layername);
					
//					console.log("current palette name: " + palettename);
					
					var sp = [null, null];
					
					if(edu.gmu.csiss.covali.map.isValue(layer.getSource().getParams()["STYLES"])){
						
						sp = layer.getSource().getParams()["STYLES"].split("/");
						
					}else{
						
						sp = [obj.supportedStyles[0],palettename];
						
					}
					
					var minmax = [null,null];
					
					if(edu.gmu.csiss.covali.map.isValue(layer.getSource().getParams()["COLORSCALERANGE"])){
						
						minmax = layer.getSource().getParams()["COLORSCALERANGE"].split(",");
						
					}else{
						
						minmax = [Number(obj.scaleRange[0]).toFixed(2), Number(obj.scaleRange[1]).toFixed(2)];
						
					}
					
					var belowabove = [null, null];
					
					if(edu.gmu.csiss.covali.map.isValue(layer.getSource().getParams()["ABOVEMAXCOLOR"])){
						
						belowabove[0] = layer.getSource().getParams()["BELOWMINCOLOR"];
						
						belowabove[1] = layer.getSource().getParams()["ABOVEMAXCOLOR"];
						
					}else{
						
						belowabove[0] = obj.belowMinColor;
						
						belowabove[1] = obj.aboveMaxColor;
						
					}
					
					edu.gmu.csiss.covali.map.showStyleManager($(legendobj).attr("id"), 
							edu.gmu.csiss.covali.map.legend_url, 
							sp[1],
							minmax[0], 
							minmax[1], 
							sp[0],
							belowabove[0],
							belowabove[1]
					);
					
				},
				
				error: function(msg){
					
					console.log("Fail to get layers details: " + msg);
					
				}
				
			});
				
		},
		
		getWMSLegend: function(side, layername, stylename){
			
			var legendurl = null;
			
			var layer = edu.gmu.csiss.covali.wms.getLayerByName(layername); //get WMS capabilities layer, not openlayer layer
			
			var style = edu.gmu.csiss.covali.wms.getStyleByName(stylename, layer);
			
			if(style!=null && typeof style.LegendURL != 'undefined'){
				
				legendurl = style.LegendURL[0].OnlineResource;
				
				console.log("legendurl:" + legendurl);
				
			}
			
			return legendurl;
		},
		/**
		 * only used when first adding the layer
		 */
		addWMSLegend: function(side, url, layername, stylename){
			
			var legendurl = edu.gmu.csiss.covali.map.getWMSLegend(side, layername, stylename);
			
			edu.gmu.csiss.covali.map.updateLegend(side, layername, legendurl);
			
		},
		
		getWMSLayerByName: function(map, layername){
			
			var layer = null;
			
			map.getLayers().forEach(function (lyr) {
				
	            if (layername == lyr.get('name')) {
	            	
	                layer = lyr;
	                
	                return false;
	                
	            }            
	        
			});
	        
			return layer;
			
		},
		
		getVisibleTopWMSLayer: function(side){
			
			var map = edu.gmu.csiss.covali.map.getMapBySide(side);
			
			var layer = null;
			
			for(var i=map.getLayers().getLength()-1;i>=0;i--){
				
				var l = map.getLayers().item(i);
				
				if(l.getVisible() && l.getSource() instanceof ol.source.TileWMS){

					layer = l;
					
					console.log("the first visible layer is : " + l.get('name'));
					
					break;
					
				}
				
			}
			
			return layer;
			
		},
		
		addWMSAnimationLayer: function(map, url, layername, starttime, endtime, framerate, stylename){
			
			//add code to check if the WMS has already been added
			
			var mapid = map.get('target');
			
			var side = edu.gmu.csiss.covali.map.getSideByMapContainerId(mapid);
			
			var legendurl = edu.gmu.csiss.covali.map.getWMSLegend(side, layername, stylename);
			
			console.log(url);
			
			var myLayer1303 = new ol.layer.Image({
				  //extent: [2033814, 6414547, 2037302, 6420952],
				  //preload: Infinity,
				  name: layername,
				  title: layername,
				  visible: true,
				  source: new ol.source.ImageWMS({
//					  LAYERS=IR&ELEVATION=0&TIME=2018-05-31T02%3A00%3A19.000Z&TRANSPARENT=true&STYLES=boxfill%2Frainbow&COLORSCALERANGE=-50%2C50&NUMCOLORBANDS=20&LOGSCALE=false&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image%2Fpng&SRS=EPSG%3A4326&BBOX=-101.47971029369,19.92840558883,-85.775652352431,35.632463530092&WIDTH=256&HEIGHT=256
//				    url: 'http://thredds.ucar.edu/thredds/wms/grib/NCEP/GEFS/Global_1p0deg_Ensemble/members-analysis/GEFS_Global_1p0deg_Ensemble_ana_20180520_0600.grib2',
					url: url,
				    params: {
				    	'LAYERS': layername, 
				    	'TILED': false, 
				    	'FORMAT': 'image/gif',
				    	'VERSION': '1.3.0',
				    	'STYLES':stylename,
				    	'FRAMERATE': framerate,
				    	'LEGEND': legendurl,
				    	'ANIMATION': true,
				    	'TIME': starttime + "/" + endtime
				    },
				    
				    imageLoadFunction: function (image, src) {
				    	
				    	console.log(image);
				    	
				    	console.log(image.getImage());
				    	
//				    	window.open(src,"_blank");
				    	
				    	image.getImage().src = src;

//			            var client = new XMLHttpRequest();
//			            client.open('GET', src, true);
//			            client.setRequestHeader('Authorization', "Basic " + btoa("login:password"));
//			            client.responseType = "arraybuffer";
//
//			            client.onload = function () {
//
//			                var byteArray = new Uint8Array(this.response);
//			                var blob = new Blob([byteArray], {type: "image/png"});
//			                var urlCreator = window.URL || window.webkitURL;
//			                var imageUrl = urlCreator.createObjectURL(blob);
//
//			                gifler(imageUrl)
//			                    .get()
//			                    .then(function(animator) {
//			                        var BufferCanvas = animator.constructor.createBufferCanvas(animator._frames[0], animator.width, animator.height);
//			                        animator.animateInCanvas(BufferCanvas);
//			                        image.setImage(BufferCanvas);
//			                        image.load();
//			                    });
//			            };
//
//			            client.send();
			            
			        }
				    
				  })
			});
			
			console.log(myLayer1303.getSource());
			
			myLayer1303.on("change:visible", function(event){
				
				//change the legend accordingly
				
				var layer = event.target;
				
				var parentmapid = map.get('target');
				
				console.log("this layer belongs to map " + parentmapid);
				
				var side = edu.gmu.csiss.covali.map.getSideByMapContainerId(parentmapid);
				
				if(layer.getVisible()){
					
					console.log("The layer " + layer.get('name') + " is visible.");
					
					edu.gmu.csiss.covali.map.updateLegend(side, layer.get('name'), layer.getSource().getParams()["LEGEND"], null, null);
					
				}else{
					
					console.log("The layer " + layer.get('name') + " is invisible.");
					
					console.log("show the current top layer's legend");
					
					edu.gmu.csiss.covali.map.showNextAvailableLegend(side);
					
				}
				
			});
			
			map.addLayer(myLayer1303);
			
		},
		
		addWMSLayer: function(map, url, layername, stylename){
			
			//add code to check if the WMS has already been added
			
			var mapid = map.get('target');
			
			var side = edu.gmu.csiss.covali.map.getSideByMapContainerId(mapid);
			
			var legendurl = edu.gmu.csiss.covali.map.getWMSLegend(side, layername, stylename);
			
			var myLayer1303 = new ol.layer.Tile({
				  //extent: [2033814, 6414547, 2037302, 6420952],
				  //preload: Infinity,
				  name: layername,
				  title: layername,
				  visible: true,
				  source: new ol.source.TileWMS({
//					  LAYERS=IR&ELEVATION=0&TIME=2018-05-31T02%3A00%3A19.000Z&TRANSPARENT=true&STYLES=boxfill%2Frainbow&COLORSCALERANGE=-50%2C50&NUMCOLORBANDS=20&LOGSCALE=false&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image%2Fpng&SRS=EPSG%3A4326&BBOX=-101.47971029369,19.92840558883,-85.775652352431,35.632463530092&WIDTH=256&HEIGHT=256
//				    url: 'http://thredds.ucar.edu/thredds/wms/grib/NCEP/GEFS/Global_1p0deg_Ensemble/members-analysis/GEFS_Global_1p0deg_Ensemble_ana_20180520_0600.grib2',
					url: url,
				    params: {'LAYERS': layername, 
				    	'TILED': true, 'VERSION': '1.3.0',
				    	'STYLES':stylename,
				    	'LEGEND': legendurl
				    }
				  })
			});
			
			myLayer1303.on("change:visible", function(event){
				
				//change the legend accordingly
				
				var layer = event.target;
				
				var parentmapid = map.get('target');
				
				console.log("this layer belongs to map " + parentmapid);
				
				var side = edu.gmu.csiss.covali.map.getSideByMapContainerId(parentmapid);
				
				if(layer.getVisible()){
					
					console.log("The layer " + layer.get('name') + " is visible.");
					
					edu.gmu.csiss.covali.map.updateLegend(side, layer.get('name'), layer.getSource().getParams()["LEGEND"], null, null);
					
				}else{
					
					console.log("The layer " + layer.get('name') + " is invisible.");
					
					console.log("show the current top layer's legend");
					
					edu.gmu.csiss.covali.map.showNextAvailableLegend(side);
					
				}
				
			});
			
			map.addLayer(myLayer1303);
			
		},
		
		showNextAvailableLegend: function(side){
			
			var nextlayer = edu.gmu.csiss.covali.map.getVisibleTopWMSLayer(side);
			
			if(nextlayer!=null){
				
				edu.gmu.csiss.covali.map.updateLegend(side, nextlayer.get('name'), nextlayer.getSource().getParams()["LEGEND"], null, null);
				
			}else{
				
				edu.gmu.csiss.covali.map.updateLegend(side, null, null, null, null);
				
			}
			
		},
		
		refreshWMSOneMap: function(map){
			
			for(var i=map.getLayers().getLength()-1;i>=0;i--){
				
				var l = map.getLayers().item(i);
				
				var source  = l.getSource();
				
				if(source instanceof ol.source.TileWMS){
					
					console.log("layer " + l.get('name') + " is reloaded");
					
//					source.setTileLoadFunction(source.getTileLoadFunction());
					
//					l.redraw(true);
//					l.load();
					source.tileCache.expireCache({});
				    source.tileCache.clear();
				    source.refresh();
					
				}
				
				
			}
			
		},
		
		refreshAllWMSLayers: function(){
			
			var leftmap = edu.gmu.csiss.gpkg.cmapi.openlayers.getMap("openlayers1");
			
			var rightmap = edu.gmu.csiss.gpkg.cmapi.openlayers.getMap("openlayers2");
			
			this.refreshWMSOneMap(leftmap);
			
			this.refreshWMSOneMap(rightmap);
			
		},
		
		addBoundaryWMS: function(){
			
			var leftmap = edu.gmu.csiss.gpkg.cmapi.openlayers.getMap("openlayers1");
			
			var rightmap = edu.gmu.csiss.gpkg.cmapi.openlayers.getMap("openlayers2");
			
			var myLayer1303 = new ol.layer.Image({
				  name: "World Boundary",
				  title: "World Boundary",	
				  zIndex: 99,
		          source: new ol.source.ImageWMS({
		            url: 'http://gis.csiss.gmu.edu/cgi-bin/wms_world_modissin',
		            params: {
		            	'LAYERS': 'world_countries_sin,world_state_provinces_sin',
		            	'VERSION': '1.3.0'
		            },
		            serverType: 'mapserver',
		            crossOrigin: null
		          })
	        });
			
			leftmap.addLayer(myLayer1303);
			var myLayer1304 = new ol.layer.Image({
				  name: "World Boundary",
				  title: "World Boundary",				  
				  zIndex: 99,
				  source: new ol.source.ImageWMS({
		            url: 'http://gis.csiss.gmu.edu/cgi-bin/wms_world_modissin',
		            params: {
		            	'LAYERS': 'world_countries_sin,world_state_provinces_sin',
		            	'VERSION': '1.3.0'
		            },
		            serverType: 'mapserver',
		            crossOrigin: null
		          })
	        });
			
			rightmap.addLayer(myLayer1304);
			
		}
		
}