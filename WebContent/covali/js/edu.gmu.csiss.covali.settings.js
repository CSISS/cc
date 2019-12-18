/**
*
* All the methods related to the settings panel
*
* Author: Ziheng Sun
* 
* Date: 06/19/2018
*
*/

edu.gmu.csiss.covali.settings = {
		
		isSync: true,

		checkLayer: function(side, layername, checked){
			
			var olmap = edu.gmu.csiss.covali.map.getMapBySide(side);
			
//			var checked = this.checked;
			
			olmap.getLayers().forEach(function (layer) {
			    
				if (layer.get('name') == layername) {
			    	
					layer.setVisible(checked);
					edu.gmu.csiss.covali.statistics.changePopupVisibility(side, checked);
					edu.gmu.csiss.covali.map.changeLegendVisibility(side, checked);
					
			    }
				
			});
			
		},
		
		changeOpacity: function(sliderinput, side, layername){
			
			var opacityval = Number($(sliderinput).val())/100;
			
			$(sliderinput).parent().find(".opacity-value").text(opacityval);
			
			var olmap = edu.gmu.csiss.covali.map.getMapBySide(side);
			
			olmap.getLayers().forEach(function (layer) {
			    
				if (layer.get('name') == layername) {
			    	
//					layer.setVisible(checked);
					
					layer.setOpacity(opacityval);
					
			    }
				
			});
			
		},
		
		
		changeLegendVisibility: function(side, checked){
			
			var legendId = edu.gmu.csiss.covali.map.getLegendIdBySide(side);
			
			if($("#"+legendId).length){
	    		if(checked==false){
	    			$("#"+legendId).hide();
	    		}else{
	    			$("#"+legendId).show();
	    		}
	    	}
		},
		
		delLayer: function(side, layername, noquestion){
			
			if(noquestion||confirm("Do you really want to delete this layer?")){
				
				//var legendId = edu.gmu.csiss.covali.map.getLegendIdBySide(side);
				//$("#"+legendId).remove();
				//$("#scale"+side).remove();
				
				var olmap = edu.gmu.csiss.covali.map.getMapBySide(side);
				
				var layersToRemove = [];
				
				olmap.getLayers().forEach(function (layer) {
				    
					if (layer.get('name') == layername) {
						
						layersToRemove.push(layer);
						
				    }
					
				});
				
				var len = layersToRemove.length;
				
//				for(var i = 0; i < len; i++) {
					
					olmap.removeLayer(layersToRemove[len-1]);
				
//				}
				edu.gmu.csiss.covali.statistics.clearAllPopupsOnAMap(side);
				
				edu.gmu.csiss.covali.map.showNextAvailableLegend(side);
				
			}
			
		},
		
		removeLayerName: function(ele){
			
			var layername = $(ele);
			
			layername.parent().parent().remove();
			
		},
		
		addLayerName: function(side, layername, opacity){
			
			var id = side + "-settings";
			
			$("#" + id).append(this.getOneLayerControl(side, layername, opacity));
			
		},
		
		/**
		 * Move back
		 */
		moveBack: function(side,layername){
			
			var olmap = edu.gmu.csiss.covali.map.getMapBySide(side);
			
			zIndex = 1;
			
			olmap.getLayers().forEach(function (layer) {
				
				if(isNaN(layer.getZIndex())||layer.getZIndex()==99){
					layer.setZIndex(zIndex);
					layer.set("id", side + zIndex);
					zIndex++;
				}
				
			});
			
			var previous_layer = null;
			
			olmap.getLayers().forEach(function (layer){
				
				if (layer.get('name') == layername)  {
			    	
					layernum = layer.getZIndex();
					
					console.log("the zindex :" + layer.getZIndex());
					
					layer.setZIndex(layer.getZIndex()-1);
					
					previous_layer.setZIndex(layer.getZIndex()+1);
					
					layer.getSource().changed();
					
					previous_layer.getSource().changed();
					
			    }else{
			    	
			    	previous_layer = layer;
			    	
			    }
				
			});
			
			
			
		},
		
		/**
		 * Move front
		 */
		moveFront: function(side, layername){

			var olmap = edu.gmu.csiss.covali.map.getMapBySide(side);
			
			zIndex = 1;
			
			olmap.getLayers().forEach(function (layer) {
				
				if(isNaN(layer.getZIndex())||layer.getZIndex()==99){
					layer.setZIndex(zIndex);
					layer.set("id", side + zIndex);
					zIndex++;
				}
				
			});
			
			var previous_layer = null;
			
			olmap.getLayers().forEach(function (layer){
				
				if (layer.get('name') == layername)  {
			    	
					layernum = layer.getZIndex();
					
					console.log("the zindex :" + layer.getZIndex());
					
					layer.setZIndex(layer.getZIndex()+1);
					
					previous_layer.setZIndex(layer.getZIndex()-1);
					
					layer.getSource().changed();
					
					previous_layer.getSource().changed();
					
			    }else{
			    	
			    	previous_layer = layer;
			    	
			    }
				
			});
			
		},
		
		getOneLayerControl: function(side, layername, opacity){
			
			var opaval = Number(opacity);
    		
    		var onecontrol = "<div class=\"checkbox\">"+
					"<label>"+
					//check/uncheck layer
					"<input type=\"checkbox\" checked=\"checked\" onchange=\"edu.gmu.csiss.covali.settings.checkLayer('"+
					side + "', '"+ layername + "', this.checked)\" value=\"\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Layer visibility\"/>" + 
					//layer name
					"<span style=\"word-wrap:break-word;\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Layer name\">" + layername + "</span>" +
					//delete button
					"<a href=\"javascript:void(0)\" onclick=\"edu.gmu.csiss.covali.settings.delLayer('"+
					side + "', '" + layername + 
					"'); edu.gmu.csiss.covali.settings.removeLayerName(this);\" class=\"btn btn-inverse\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Remove layer\"><i class=\"glyphicon glyphicon-trash\"></i></a>"+
					//up button
					"<a href=\"javascript:void(0)\" onclick=\"edu.gmu.csiss.covali.settings.moveBack('"+
					side + "', '" + layername + 
					"'); \" class=\"btn btn-inverse\"><i class=\"glyphicon glyphicon-chevron-up\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Move layer up!\"></i></a>"+
					//down button
					"<a href=\"javascript:void(0)\" onclick=\"edu.gmu.csiss.covali.settings.moveFront('"+
					side + "', '" + layername + 
					"'); \" class=\"btn btn-inverse\"><i class=\"glyphicon glyphicon-chevron-down\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Move layer down!\"></i></a>";
					
					if(layername!="osm-basemap" && layername != "World Boundary"){
						
						//switch button
						onecontrol += "<a href=\"javascript:void(0)\" onclick=\"edu.gmu.csiss.covali.settings.switchMap('"+
						side + "', '" + layername + 
						"'); edu.gmu.csiss.covali.settings.removeLayerName(this);\" class=\"btn btn-inverse\"><i class=\"glyphicon glyphicon-transfer\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Move layer to the other map!\"></i></a>"+
						//add more button
						"<a href=\"javascript:void(0)\" onclick=\"edu.gmu.csiss.covali.wms.addMore('"+
						side + "', '" + layername + 
						"'); \" class=\"btn btn-inverse\"><i class=\"glyphicon glyphicon-plus\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Add another layer!\"></i></a>";
						
					}
					
					//opacity slider bar
					onecontrol += "<input oninput=\"edu.gmu.csiss.covali.settings.changeOpacity(this, '"+
					side + "', '" + layername +
					"');\" type=\"range\" class=\"slider\" min=\"0\" max=\"100\" value=\""+opaval*100+"\" /><p>Opacity: <span class=\"opacity-value\">"+opaval+"</span></p>"+
				"</label> "+
			"</div>";
    		
    		return onecontrol;
    		
		},
		
		switchMap: function(side, layername){
			
			edu.gmu.csiss.covali.map.legend_layername = layername;
			
			var target_side = null;
			
			if(side=="left"){
			
				target_side = "right";
				
			}else{
				
				target_side = "left";
				
			}
			
			var map = edu.gmu.csiss.covali.map.getMapBySide(side);
			
			var layer = edu.gmu.csiss.covali.map.getWMSLayerByName(map, layername);
			
			var othermap = edu.gmu.csiss.covali.map.getMapBySide(target_side);
			
			if (layer.values_.enableLocalCache == true){//I didn't really know how to differentiate a static layer from the animation layer so I used this
				edu.gmu.csiss.covali.wms.loadAnimation(layername, target_side, starttime, endtime, framerate);
			}
			else{
				othermap.addLayer(layer);
				layer = edu.gmu.csiss.covali.map.getVisibleTopWMSLayer(target_side);
				edu.gmu.csiss.covali.map.updateLegend(target_side, layer.get('name'), layer.getSource().getParams()["LEGEND"], null, null, 
						layer.getSource().getParams()["TIME"], layer.getSource().getParams()["ELEVATION"]);
			}
			//add to the settings menu
			this.addLayerName(target_side, layer.get('name'), layer.getOpacity());
			//add a parent map parameter to the layer object. Used in layer visibility change event handler
			var params = layer.getSource().getParams();
			if (target_side=='left'){
				params.parentMapId = 'openlayers1';
			}else{
				params.parentMapId = 'openlayers2';
			}
			layer.getSource().updateParams(params);
			this.delLayer(side, layername, true);

			
		},
		
		/**
		 * Get layer control of either left or right side
		 */
		getLayerControl: function(side){
			
			var id = "treeview-checkable-"+side;
        
        	$tree = $("<div id=\""+id+"\"></div>");
        	
        	var olmap = edu.gmu.csiss.covali.map.getMapBySide(side);
        	
        	olmap.getLayers().forEach(function(layer,idx){
        		
        		var onecontrol = edu.gmu.csiss.covali.settings.getOneLayerControl(side, layer.get("name"), layer.getOpacity());
        		
        		$tree.append(onecontrol);
        		
        	});
        	
        	
        	return $tree;
        	
		},
		
		checkMap: function(side, checkstatus){
			
			edu.gmu.csiss.covali.map.mapSwitch(side, checkstatus);
			
		},
		
		/**
		 * Disconnect or Reconnect the two maps
		 */
		switchSync: function(checked){
			
			edu.gmu.csiss.covali.settings.isSync = checked;
			
			if(edu.gmu.csiss.covali.settings.isSync){
				
				edu.gmu.csiss.gpkg.cmapi.initialize.init();
				
			}else{
				
				edu.gmu.csiss.gpkg.cmapi.initialize.unregister();
				
			}
			
			
		},
		
		init: function(){
			
			BootstrapDialog.show({
				
				cssClass: 'dialog-vertical-center',
	            
	            title: "Settings",
	            
	            message: function(dialog) {
	            	
	            	var $lefttree = edu.gmu.csiss.covali.settings.getLayerControl("left");
	            	
	            	var $righttree = edu.gmu.csiss.covali.settings.getLayerControl("right");
	            	
	            	var leftstatus = "";
	            	
	            	if(edu.gmu.csiss.covali.map.getMapStatus("left")){
	            		
	            		leftstatus = "checked=\"checked\"";
	            		
	            	}
	            		
	            	var rightstatus = ""; 
	            	
	            	if(edu.gmu.csiss.covali.map.getMapStatus("right")){
	            		
	            		rightstatus = "checked=\"checked\"";
	            		
	            	} 
	            	
	            	console.log("left status: " + leftstatus + " - right status: " + rightstatus );
	            	
	            	var synccheck = "";
	            	
	            	if(edu.gmu.csiss.covali.settings.isSync){
	            		
	            		synccheck = "checked=\"checked\"";
	            		
	            	}
	            	
	                var $content = $('<div class=\"row\">'+
	    			
					'<div class=\"col-md-12\"><h2>Map Control</h2></div>'+
					
					'<div class=\"col-md-12\"><span>Enable Map Synchronization:</span> <input type=\"checkbox\" id=\"map-sync\" onchange=\"edu.gmu.csiss.covali.settings.switchSync(this.checked)\" '+synccheck+' ></div>'+
					
					'<div class=\"col-md-6\" id=\"left-settings\">'+
					
					'	<h4>Left Map '+
					
					'	<input type=\"checkbox\" '+leftstatus+' id=\"left-map-switch\" onchange=\"edu.gmu.csiss.covali.settings.checkMap(\'left\', this.checked)\" value=\"\">'+
					
					'</h4>'+
					
					$lefttree.html()+
					
					'</div>' +
					
					'<div class=\"col-md-6\" id=\"right-settings\" >'+
					
					'<h4>Right Map'+
					
					'	<input type=\"checkbox\" '+rightstatus+' id=\"left-map-switch\" onchange=\"edu.gmu.csiss.covali.settings.checkMap(\'right\', this.checked)\" value=\"\">'+
					
					'</h4>'+
					
					$righttree.html()+
					
					'</div>');
	                
	                return $content;
	                
	            },
	            
	            buttons: [{
	                
	            	icon: 'glyphicon glyphicon-ok',
	                
	                label: 'OK',
	                
	                title: 'OK',
	                
	                cssClass: 'btn-warning',
	                
	                action: function(dialogItself){
	                	
	                	dialogItself.close();
	                	
	                }
	                
	            }, {
	                
	            	label: 'Close',
	                
	                action: function(dialogItself){
	                	
	                    dialogItself.close();
	                    
	                }
	            
	            }]
	            
	        });
			
		}
		
};