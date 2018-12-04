/**
 * 
 * All the methods related to OGC WMS
 * 
 * Author: Ziheng Sun
 * 
 * Date: 06/19/2018
 * 
 */

edu.gmu.csiss.covali.wms = {
		
		currentWMSCapabilities: null,
		
		layerlist: [],
		
		layerjson: {},
		
		init: function(){
			
			this.showInputDialog();
			
		},
		
		showInputDialog: function(){
			
			BootstrapDialog.closeAll();
			
			BootstrapDialog.show({
				
				title: "Add WMS",
				
	            message: function(dialog){
	            	
	            	$content = $("<div class=\"row\" style=\"padding:10px;\">"+
	            			
	            			"<div class=\"input-group col-md-12\">"+
	            			
	            			"    <form> "+
							"	    <label class=\"radio-inline\"> "+
							"	      <input type=\"radio\" name=\"wms_source\" value=\"Custom\" checked > Other WMS"+
							"	    </label> "+
							"	    <label class=\"radio-inline\"> "+
							"	      <input type=\"radio\" name=\"wms_source\" value=\"Builtin\"> Built-in ncWMS "+
							"	    </label> "+
							"	 </form>"+
	            			
	            			"</div>"+
	            			
	            			"<div class=\"input-group col-md-12\">"+
	            			
	            			"    <input type=\"text\" id=\"wms_capa_url\"  class=\"form-control\" placeholder=\"Please input the complete WMS capabilities URL..\">"+
	            			
	            			"    <span class=\"input-group-btn\"><button type=\"button\" onclick=\"edu.gmu.csiss.covali.wms.addWMS();\" class=\"btn btn-default\">Add</button></span>"+
	            			
	            			"</div>"+
	            			
	            			"<div class=\"col-md-1\"></div></div>"
	            	);
	            	
	            	return $content;
	            	
	            },
	            
	            onshown: function(){
	            	
	            	$('input[type=radio][name=wms_source]').change(function() {
	            		
	            		$("#wms_capa_url").val(""); //clear the existing text
	            		
	            	    if (this.value == 'Custom') {
	            	        
	            	    	console.log("customized wms source");
	            	    	
	            	    }else if (this.value == 'Builtin') {
	            	        
	            	    	console.log("built-in ncwms source");
	            	    	
	            	    	$("#wms_capa_url").val(edu.gmu.csiss.covali.wms.getBuiltinNCWMS());
	            	        
	            	    }
	            	});
	            	
	            },
	            
	            cssClass: 'dialog-vertical-center',
	            
	            buttons: [{
	                
	            	label: 'Close',
	                
	            	action: function(dialogItself){
	                	
	                    dialogItself.close();
	                    
	                }
	            
	            }]
	        
			});
			
		},
		
		/**
		 * add for the file uploading dialog
		 */
		showLayerSelector : function(datasetid){
			
			var capability_url = this.getBuiltinNCWMS();
			
			this.parse(datasetid, capability_url);
			
		},
		
		/**
		 * Get layer in original WMS hierarchy
		 */
		getAllLayers: function(callback){
			
			var capa_url = this.getBuiltinNCWMS();
			
			this.parseAll(capa_url, callback);
			
		},
		
		
		/**
		 * Get built-in ncWMS getcapabilities
		 */
		getBuiltinNCWMS: function(){

			//the built-in ncWMS URL is final
			//http://whateverdomain/ncWMS2/wms?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0
			
			var capability_url = "../../ncWMS2/wms?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0";
			
			return capability_url;
			
		},
		
		/**
		 * The onclick function of AddWMS panel
		 */
		addWMS: function(){
			
			var capability_url = $("#wms_capa_url").val();
			
			if(!(capability_url.startsWith("http")
					||capability_url.startsWith("HTTP")
					||capability_url.startsWith("../../ncWMS2"))){
				
				capability_url = "http://"+capability_url;
				
			}
			
			if(capability_url!=null){
				
				//get the list of layers for users to chosen
				
				this.parse(null, capability_url);
				
			}else{
				
				BootstrapDialog.alert('The inputted WMS capabilities URL is invalid!');
				
			}
			
		},
		
		parseAll: function(capa_url, callback){

			var parser = new ol.format.WMSCapabilities();
			
		    fetch(capa_url).then(function(response) {
		      
		    	  return response.text();
		    
		      }).then(function(text) {
		    	  
		    	  try{
		    		  
		    		  var result = parser.read(text);
				    	
				      edu.gmu.csiss.covali.wms.currentWMSCapabilities = result;
				    	
				      var toppest_layer = result.Capability.Layer;
				      
				      edu.gmu.csiss.covali.wms.layerlist = []; //have to update the layerlist at the same time, this should be improved in future
				      
				      edu.gmu.csiss.covali.wms.layerjson = edu.gmu.csiss.covali.wms.getLayerJSON(toppest_layer);
				      
				      callback(edu.gmu.csiss.covali.wms.layerjson);
		    		  
		    	  }catch(error){
		    		  
		    		  	alert("Please try again.");
		    		  	
		    		  	console.error(error);
		    		  	
		    	  }
		    	  
		    });
			
		},
		

		getLayerJSON: function(layer){
			
			var json = {
		    		  
				text: layer.Title
		    		  
		    };
			
			if(layer.Layer==null){
				
				//get time dimension
				
				json = layer;
				
				json.text = layer.Title;
				
				edu.gmu.csiss.covali.wms.layerlist.push(layer); //update the layerlist as well. It means once layerjson is updated, layerlist must be updated. The reverse will not happen. 
				
			}else{
				
				if(layer.Layer.constructor === Array){
					
					json.nodes = [];
					
					json.selectable = false;
					
					for(var i=0; i<layer.Layer.length; i++){
						
						var newjson = edu.gmu.csiss.covali.wms.getLayerJSON(layer.Layer[i]);
						
						json.nodes.push(newjson);
						
					}
					
				}else{
					
					var newjson = edu.gmu.csiss.covali.wms.getLayerJSON(layer.Layer);
					
					json.nodes.push(newjson);
					
				}
				
			}
			
			return json;
			
		},
		
		getLayerList: function(layer){
			
			if(layer.constructor === Array){
				
				for(var i=0; i<layer.length; i++){
					
					if(layer[i].constructor != Array && layer[i].Layer==null){
						
						edu.gmu.csiss.covali.wms.layerlist.push(layer[i]);
						
					}else if(layer[i].constructor == Array){
						
						edu.gmu.csiss.covali.wms.getLayerList(layer[i]);
						
					}else{
						
						edu.gmu.csiss.covali.wms.getLayerList(layer[i].Layer);
						
					}
					
				}
				
				
			}else{
				
				if(layer.Layer==null){
					
					edu.gmu.csiss.covali.wms.layerlist.push(layer);
					
				}else{
					
					edu.gmu.csiss.covali.wms.getLayerList(layer.Layer);
					
				}
				
			}
			
			//parse the nested layer
			
			
			
			return edu.gmu.csiss.covali.wms.layerlist;
			
		},
		
		
		
		/**
		 * parsing the layers in WMS capabilities 
		 */
		parse: function(layername, capability_url){
			
			var parser = new ol.format.WMSCapabilities();
			
		    fetch(capability_url).then(function(response) {
		      
		    	  return response.text();
		    
		      }).then(function(text) {
		    	  
		    	  try{
		    		  
		    		  var result = parser.read(text);
				    	
				    	edu.gmu.csiss.covali.wms.currentWMSCapabilities = result;
				    
//				        var capa = JSON.stringify(result, null, 2);
				    	
				        var layer;
				        
				        if(layername==null){
				        
				        	layer = result.Capability.Layer;
				        	
				        }else{
				        	
				        	/**
				        	 * get the child layers of one specified layer
				        	 */
				        	layer = edu.gmu.csiss.covali.wms.getLayerListByTitle(result.Capability.Layer.Layer, layername);
				        	
				        }
				        
				        edu.gmu.csiss.covali.wms.layerlist = [];
				        
				        var layerlist = edu.gmu.csiss.covali.wms.getLayerList(layer);
				        
				        console.log(layerlist);
				        
				        if(layerlist.length==0){
				        	
				        	BootstrapDialog.alert('Cannot find layers in the WMS!');
				        	
				        }else{
				        
				        	edu.gmu.csiss.covali.wms.showLayerDialog(layerlist);
				        	
				        }
		    		  
		    	  }catch(error){
		    		  
		    		  	console.error(error);
		    		  
		    		  	alert("Something goes wrong. Please try again.");
		    		  	
		    	  }
		    	  
		    });
			
		},
		
		getLayerByTitle: function(title){

			var layer = null;
			
			for(var i=0;i<edu.gmu.csiss.covali.wms.layerlist.length;i++){
				
				if(edu.gmu.csiss.covali.wms.layerlist[i].Title==title){
					
					layer = edu.gmu.csiss.covali.wms.layerlist[i];
					
					break;
					
				}
				
			}
			
			return layer;
			
		},
		
		getLayerByName: function(name){
			
			var layer = null;
			
			for(var i=0;i<edu.gmu.csiss.covali.wms.layerlist.length;i++){
				
				if(edu.gmu.csiss.covali.wms.layerlist[i].Name==name){
					
					layer = edu.gmu.csiss.covali.wms.layerlist[i];
					
					break;
					
				}
				
			}
			
			return layer;
			
		},
		
		getStyleByName: function(stylename, layer){
			
			var style = "default";
			
			if(layer.Style!=null){
				
				for(var i=0;i<layer.Style.length;i++){
					
					if(layer.Style[i].Name==stylename){
						
						style = layer.Style[i];
						
						break;
						
					}
					
				}
				
			}
			
			return style;
			
		},
		
		showLayerDialog: function(layerlist){
			
			BootstrapDialog.closeAll();
			
			$layerselector = "";
			
			for(var i=0; i<layerlist.length; i++){
				
				$styles = " <p>Styles: <select name=\"styleselect_"+i+"\" class=\"js-example-basic-hide-search wms-layer-style\">";
				
				if(layerlist[i].Style!=null){
					
					for(var j=0; j<layerlist[i].Style.length; j++){
						
						$styles += "<option value=\""+layerlist[i].Style[j].Name+"\">"+layerlist[i].Style[j].Name+"</option>";
						
					}
					
				}
				
				$styles += "</select></p>";
				
				$layerselector += "	<a href=\"javascript:void(0)\" class=\"list-group-item wms-layer\">"+
					
					"		<div class=\"checkbox pull-right col-md-1\"> <label> <input type=\"checkbox\" class=\"layer-checkbox\" value=\"\"> </label> </div> "+
					
					"       <div class=\"pull-left form-control-inline col-md-11\">"+
					
					"			<h4 class=\"list-group-item-heading wms-layer-name\" style=\"word-wrap:break-word;\">"+layerlist[i].Name+"</h4> "+
					
					$styles + 
					
					"		</div><div class=\"clearfix\"></div>            </a>";
				
			}
			
			$content = $("<div class=\"list-group\">"+
					
					$layerselector + 
					
					"</div>");
			
			BootstrapDialog.show({
				
	            message: $content,
	            
	            title: "Layer Selector",
	            
	            cssClass: 'dialog-vertical-center',
	            
	            buttons: [{
	                
	            	label: 'Add to Left',
	                
	            	action: function(dialogItself){
	                	
	            		edu.gmu.csiss.covali.wms.loadLayer("left");
	            	}
	            
	            },{
	                
	            	label: 'Add to Right',
	                
	            	action: function(dialogItself){
	                	
	            		edu.gmu.csiss.covali.wms.loadLayer("right");
	            		
	                }
	            
	            },{
	            	
	            	label: "Unselect All",
	            	
	            	action: function(dialogItself){
	            		
	            		$(".layer-checkbox").prop('checked', false); 
	            		
	            	}
	            	
	            },{
	            	
	            	label: "Select All",
	            	
	            	action: function(dialogItself){
	            		
	            		$(".layer-checkbox").prop('checked', true); 
	            		
	            	}
	            	
	            },{
	                
	            	label: 'Close',
	                
	            	action: function(dialogItself){
	                	
	                    dialogItself.close();
	                    
	                }
	            
	            }]
	        
			});
			
		},
		
		getCurrentEndPoint:function(){
			
			return edu.gmu.csiss.covali.wms.currentWMSCapabilities
				.Capability.Request.GetMap.DCPType[0].HTTP.Get.OnlineResource;
			
		},
		
		getDefaultStyle: function(){
			
			
			
		},
		
		getTimeDimension: function(dims){
			
			var dim = null;
			
			for(var i=0;i<dims.length;i++){
				
				if(dims[i].name == "time"){
					
					dim = dims[i];
					
					break;
					
				}
				
			}
			
			return dim;
		},
		
		loadAnimation: function(layername, side, starttime, endtime, framerate){
			
			var map = edu.gmu.csiss.covali.map.getMapBySide(side);
			
			var endpointurl = edu.gmu.csiss.covali.wms.getCurrentEndPoint();
			
			var stylename = "default";
			
			edu.gmu.csiss.covali.map.addWMSAnimationLayer(map, endpointurl, layername, starttime, endtime, framerate, stylename);
			
			edu.gmu.csiss.covali.map.addWMSLegend(side, endpointurl, layername, stylename);
			
		},
		
		loadLayer: function(side){
			
			var checknum = 0;
			
			$(".wms-layer").each(function(i, obj){	            			
    			
    			if($(obj).find("input").is(':checked')){
    				
    				checknum ++ ;
    				
    				//get layer name and style name
    				
    				var layername = $(obj).find(".wms-layer-name").text();
    				
    				console.log("checked layer: " + layername);
    				
    				var stylename = $(obj).find(".wms-layer-style").find(":selected").text();
    				
    				console.log("checked layer style: " + stylename);
    				
    				var map = edu.gmu.csiss.covali.map.getMapBySide(side);
    				
    				var endpointurl = edu.gmu.csiss.covali.wms.currentWMSCapabilities
    					.Capability.Request.GetMap.DCPType[0].HTTP.Get.OnlineResource;
    				
    				edu.gmu.csiss.covali.map.addWMSLayer(map, endpointurl, layername, stylename);
    				
    				edu.gmu.csiss.covali.map.addWMSLegend(side, endpointurl, layername, stylename);
    				
    			}
    			
    		});
			
			if(checknum==0){
				
				alert("You must check a layer!!!");
				
			}
			
		},
		
		/**
		 * Only can get the first-level layer by title 
		 */
		getLayerListByTitle: function(capalayer, title){
			
			var thelayer = null;
			
			for(var i=0; i<capalayer.length; i++){
				
				if(capalayer[i].Title == title){
					
					thelayer = capalayer[i];
					
					break;
					
				}
				
			}
			
			return thelayer;
			
		},
		
		geonas : function(){
			
			$("#reset").click(function(){
				//clear the content of the field
				$("#capaurl").val('');
			});
			
			//add by Ziheng Sun on 5/4/2016
			$("#back").click(function(){
				window.history.back();
			});
			
			//for page 2
			$("#download").click(function(){
				//get the selected radio
				var selectedradionum = $('input[name=layer]:checked').val();
				console.log("Selected Radio: " + selectedradionum);
				var cid = $("#name" + selectedradionum).html();
				var url = "<%=wms_getmap_url%>";
				//var format = $("#outformat").val();

				var crs = "epsg:4326"
				var bbox = "49.8639,-8.6476,60.8622,1.76943";
				var format = "image/gif"; 
				
				var getcoveragereq = url + "service=wms&version=1.3.0&request=getmap&layers="+ cid + "&CRS=" + crs + "&BBOX=" + bbox + "&styles=default" + "&width=500" + "&height=500" + "&format=" + format;
				window.open(getcoveragereq,'_blank');
			});
			
			$("#d").click(function(){
				//send a describe coverage request
				var cid = $("#cid").html();
				var dcurl = "<%=wms_getfeatureinfo_url%>";
				var describecoveragereq = dcurl + "service=wms&version=2.0.0&request=describecoverage&coverageid=" + cid;
				window.open(describecoveragereq,'_blank');
				//var req = "o=details&coverageid=" + cid + "&url=" + dcurl;
				//geonas.tool.post("/OnAS/WMSClient", req, geonas.wms.getCoverageDescription);
			});
			
		},
		
		getCoverageDescription: function(){
			//pop up a new window to list the coverage descriptions
			if(geonas.tool.xhr.readyState == 4) {
					if (geonas.tool.xhr.status == 200) {
	  						var resp = geonas.tool.xhr.responseText;
	  						console.log(resp);
					} else{
						var errortext = "HTTP code: " + geonas.tool.xhr.status 
							+ "HTTP errorText: " + geonas.tool.xhr.statusText
							+ "Message: " + geonas.tool.xhr.responseText;
						$("#response").val(errortext);
					}
				}
			
		},
		
		getCapabilityResults: function(){
			
			if(geonas.tool.xhr.readyState == 4) {
					if (geonas.tool.xhr.status == 200) {
						var resp = geonas.tool.xhr.responseText;
						console.log(resp);
					} else{
						var errortext = "HTTP code: " + geonas.tool.xhr.status 
							+ "HTTP errorText: " + geonas.tool.xhr.statusText
							+ "Message: " + geonas.tool.xhr.responseText;
						$("#response").val(errortext);
					}
			}
			
		}
		
}
