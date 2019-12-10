/**
 * 
 * Create animation of netCDF/GRIB
 * 
 * @author Ziheng Sun
 * 
 */

edu.gmu.csiss.covali.animation = {
		
	layer_tree : null,
	
	starttime : null,
	
	endtime : null,
	
	mapside : null,
	
	framerate : null,
	
	/**
	 *  show a select list to choose the rendered layer list
	 */
	layerSelectCallback: function(layerjson){
		
		console.log(layerjson);
		
		edu.gmu.csiss.covali.animation.layer_tree = $('#layer-select-tree').treeview({data: [layerjson]});
    	
	},
	
	showTimeStepSelect: function(layername, timesteps){
		
		console.log("show me time series");
		
		var content = "<div class=\"row\" style=\"margin: 10px;\" id=\"frame-select\">"+
    	"  <div class=\"form-group\">"+
		"    <label for=\"first-select\">Choose first time step </label>"+
		"    <select class=\"form-control\" id=\"first-select\">"+
		"    </select>"+
		"  </div>"+
		"  <div class=\"form-group\">"+
		"    <label for=\"last-select\">Choose last time step </label>"+
		"    <select class=\"form-control \" id=\"last-select\">"+
		"    </select>"+
		"  </div>"+
		"  <div class=\"form-group\">"+
		"    <label for=\"last-select\">Frame Rate </label>"+
		"    <select class=\"form-control \" id=\"frame-rate\">"+
		"		<option value=\"1\">1fps</option>"+
		"		<option value=\"2\">2fps</option>"+
		"		<option value=\"5\">5fps</option>"+
		"		<option value=\"10\">10fps</option>"+
		"		<option value=\"15\">15fps</option>"+
		"		<option value=\"24\">24fps</option>"+
		"		<option value=\"30\">30fps</option>"+
		"    </select>"+
		"  </div>"+
		"	<p>Which side of map you want to load the animation:</p>"+
		"	<form>"+
	    "		<label class=\"radio-inline\">"+
	    "  			<input type=\"radio\" name=\"mapside\" value=\"left\" checked>Left"+
	    "		</label>"+
	    "		<label class=\"radio-inline\">"+
	    "  			<input type=\"radio\" name=\"mapside\" value=\"right\" >Right"+
	    "		</label>"+
	    "   </form>"+
	    
		//future work
		/*"  <div class=\"form-group\"> "+
		"       <label for=\"time-resolution-select\" style=\"float:left;padding: 6px 12px 2px 12px;\">Select time resolution:</label>"+
		"       <select id=\"time-resoltuion-select\" style=\"width:auto;\" class=\"form-control col-md-6\">"+
		"       </select>"+
		"  </div>"+*/
	    
		"</div>";
		
		BootstrapDialog.show({
			
            title: "Create Animation",
            
            message: content,
            
            onshown: function(){
            	
            	for(var i=0;i<timesteps.length;i++){
    				
    				var o1 = new Option("value", timesteps[i]);
    				
    				$(o1).html(timesteps[i]);
    				
    				$("#first-select").append(o1);
    				
    				var o2 = new Option("value", timesteps[i]);
    				
    				$(o2).html(timesteps[i]);
    				
    				$("#last-select").append(o2);
    				
    			}
            	
            },
            	
            buttons: [{
            
            	label: "Create",
            	
            	action: function(dialogItself){
            		
        			//overlay the animation on the maps. show buttons in the map area to stop the animation.
        			
                	starttime = $("#first-select").val();
                	
                	endtime = $("#last-select").val();
                	
                	mapside = $("input[name='mapside']:checked").val();
                	
                	framerate = $("#frame-rate").val();
                	
                	edu.gmu.csiss.covali.wms.loadAnimation(layername, mapside, starttime, endtime, framerate);
            		
            		//dialogItself.close();
                	BootstrapDialog.closeAll();
            		
            	}
            
            },{
            	
            	label: "Cancel",
            	
            	action: function(dialogItself){
            		
            		dialogItself.close();
            		
            	}
            	
            }]
       
		});
		
	},
		
	showDialog: function(){
		
		BootstrapDialog.closeAll();
		
		BootstrapDialog.show({
			
            title: "Layer Selector",
            
            message: "<label for=\"layer-select-tree\" >Select A Layer</label>"+
            	
            	"<div id=\"layer-select-tree\">"+
				
				"  </div>"+
				
            	"<div class=\"row\" id=\"\"></div>",
            
            onshown: function(dialog) {
            	
            	edu.gmu.csiss.covali.wms.getAllLayers(edu.gmu.csiss.covali.animation.layerSelectCallback);
            	
            },
            
            buttons: [{
                
            	icon: 'glyphicon glyphicon-ok',
                
                label: 'Select',
                
                cssClass: 'btn-warning',
                
                action: function(dialogItself){
                	
                	var nodes = $('#layer-select-tree').treeview('getSelected');
        			
                	if(nodes.length!=0){

                		var layername = nodes[0].Name;
                		
                		var timedim = edu.gmu.csiss.covali.wms.getTimeDimension(nodes[0].Dimension);
            			
                		// check if the layer has time range
            			if(timedim.multipleValues){
            				                			
                			// if it has, show a select dialog for users to select the first and last frame to create an animation
                			
                			var timerange = timedim.values;
                			
                			var timesteps = [];
                			
                			if(timerange.split(",").length>1){
                				
                				timesteps = timerange.split(",");
                				
                			}else if(timerange.split("/").length>1){
                				
                				//iso 8601 duration
//                				2018-08-12T06:00:00.000Z/2018-08-17T00:00:00.000Z/PT6H
                				
                				timerange = timerange.split("/");
                				
                				start_time = moment(timerange[0]);
                				
                				end_time = moment(timerange[1]);
                				
                				interval = moment.duration(timerange[2]);
                				console.log("INTERVAL: "+timerange[2]);
                				
                				for(current_time = start_time; current_time.isBefore(end_time); current_time = current_time.add(interval)){
                					
                					timesteps.push(current_time.toISOString());
                					
                				}
                				
                			}
                			
                			edu.gmu.csiss.covali.animation.showTimeStepSelect(layername, timesteps);
                			
            			}else{
            				
            				alert("the layer doesn't have multiple time steps!");
            				
            			}
            			
            			
                	}else{
                		
                		alert("Please select a layer");
                		
                	}
                	
                	
//                	dialogItself.close();
                	
                }
                
            }, {
                
            	label: 'Cancel',
                
                action: function(dialogItself){
                	
                    dialogItself.close();
                    
                }
            
            }]
			
		});
		
		
		
		
	}
		
}
