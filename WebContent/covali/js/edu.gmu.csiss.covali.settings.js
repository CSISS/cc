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
		
		delLayer: function(side, layername, noquestion){
			
			if(noquestion||confirm("You really want to delete this layer?")){
				
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
					side + "', '"+ layername + "', this.checked)\" value=\"\" />" + 
					//layer name
					"<span style=\"word-wrap:break-word;\">" + layername + "</span>" +
					//delete button
					"<a href=\"javascript:void(0)\" onclick=\"edu.gmu.csiss.covali.settings.delLayer('"+
					side + "', '" + layername + 
					"'); edu.gmu.csiss.covali.settings.removeLayerName(this);\" class=\"btn btn-inverse\"><i class=\"glyphicon glyphicon-trash\"></i></a>"+
					//switch button
					"<a href=\"javascript:void(0)\" onclick=\"edu.gmu.csiss.covali.settings.switchMap('"+
					side + "', '" + layername + 
					"'); edu.gmu.csiss.covali.settings.removeLayerName(this);\" class=\"btn btn-inverse\"><i class=\"glyphicon glyphicon-transfer\"></i></a>"+
					//up button
					"<a href=\"javascript:void(0)\" onclick=\"edu.gmu.csiss.covali.settings.moveBack('"+
					side + "', '" + layername + 
					"'); \" class=\"btn btn-inverse\"><i class=\"glyphicon glyphicon-chevron-up\"></i></a>"+
					//down button
					"<a href=\"javascript:void(0)\" onclick=\"edu.gmu.csiss.covali.settings.moveFront('"+
					side + "', '" + layername + 
					"'); \" class=\"btn btn-inverse\"><i class=\"glyphicon glyphicon-chevron-down\"></i></a>"+
					//opacity slider bar
					"<input oninput=\"edu.gmu.csiss.covali.settings.changeOpacity(this, '"+
					side + "', '" + layername +
					"');\" type=\"range\" class=\"slider\" min=\"0\" max=\"100\" value=\""+opaval*100+"\" /><p>Opacity: <span class=\"opacity-value\">"+opaval+"</span></p>"+
				"</label> "+
			"</div>";
    		
    		return onecontrol;
    		
		},
		
		switchMap: function(side, layername){
			
			var target_side = null;
			
			if(side=="left"){
			
				target_side = "right";
				
			}else{
				
				target_side = "left";
				
			}
			
			var map = edu.gmu.csiss.covali.map.getMapBySide(side);
			
			var layer = edu.gmu.csiss.covali.map.getWMSLayerByName(map, layername);
			
			var othermap = edu.gmu.csiss.covali.map.getMapBySide(target_side);
			
			othermap.addLayer(layer);
			
			edu.gmu.csiss.covali.map.updateLegend(target_side, layer.get('name'), layer.getSource().getParams()["LEGEND"], null, null);
			
			this.addLayerName(target_side, layer.get('name'), layer.getOpacity());
			
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