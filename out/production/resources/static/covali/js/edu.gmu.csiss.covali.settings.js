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
		
		delLayer: function(side, layername){
			
			if(confirm("You really want to delete this layer?")){
				
				var olmap = edu.gmu.csiss.covali.map.getMapBySide(side);
				
				var layersToRemove = [];
				
				olmap.getLayers().forEach(function (layer) {
				    
					if (layer.get('name') == layername) {
						
						layersToRemove.push(layer);
						
				    }
					
				});
				
				var len = layersToRemove.length;
				
				for(var i = 0; i < len; i++) {
					
					olmap.removeLayer(layersToRemove[i]);
				
				}
				
				edu.gmu.csiss.covali.map.showNextAvailableLegend(side);
				
			}
			
		},
		
		removeLayerName: function(ele){
			
			var layername = $(ele);
			
			layername.parent().parent().remove();
			
		},
		
		/**
		 * Get layer control of either left or right side
		 */
		getLayerControl: function(side){
			
			var id = "treeview-checkable-"+side;
        
        	$tree = $("<div id=\""+id+"\"></div>");
        	
        	var olmap = edu.gmu.csiss.covali.map.getMapBySide(side);
        	
        	olmap.getLayers().forEach(function(layer,idx){
        		
        		var opaval = Number(layer.getOpacity());
        		
        		$tree.append("<div class=\"checkbox\">"+
        					"<label>"+
        						//check/uncheck layer
        						"<input type=\"checkbox\" checked=\"checked\" onchange=\"edu.gmu.csiss.covali.settings.checkLayer('"+
        						side+
        						"', '"+
        						layer.get("name")+
        						"', this.checked)\" value=\"\">"+
        						layer.get("name")+
        						//delete button
        						"<a href=\"javascript:void(0)\" onclick=\"edu.gmu.csiss.covali.settings.delLayer('"+
        						side+
        						"', '"+
        						layer.get("name")+
        						"'); edu.gmu.csiss.covali.settings.removeLayerName(this);\" class=\"btn btn-inverse\"><i class=\"glyphicon glyphicon-trash\"></i></a>"+
        						//opacity slider bar
								"<input oninput=\"edu.gmu.csiss.covali.settings.changeOpacity(this, '"+
        						side+
        						"', '"+
        						layer.get("name")+"');\" type=\"range\" class=\"slider\" min=\"0\" max=\"100\" value=\""+opaval*100+"\"/><p>Opacity: <span class=\"opacity-value\">"+opaval+"</span></p>"+
        					"</label> "+
        				"</div>");
        		
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