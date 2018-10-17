/**
 * Author: ZIheng Sun
 * Date: 4 Oct 2018
 */

edu.gmu.csiss.geoweaver.menu = {
		
		types: ["host", "process", "workflow"],
		
		init : function(){
			
			for(var i=0;i<this.types.length;i++){

				edu.gmu.csiss.geoweaver.menu.list(this.types[i]);
				
				edu.gmu.csiss.geoweaver.menu.listen(this.types[i]);
				
			}
			
		},
		
		getPanelIdByType: function(type){
			
			return type + "s";
			
		},
		
		openssh: function(hostid){
			
			//get the host information
			
			
			//open the login page
			
			
			
		},
		
		list: function(type){
			
			$.ajax({
				
				url: "list",
				
				method: "POST",
				
				data: "type="+type
				
			}).done(function(msg){
				
				msg = $.parseJSON(msg);
				
				for(var i=0;i<msg.length;i++){
					
					$("#"+edu.gmu.csiss.geoweaver.menu.getPanelIdByType(type)).append("<li><a href=\"javascript:void(0)\" onclick=\"edu.gmu.csiss.geoweaver.menu.detals('"+msg[i].id+"', '" + type + "')\">" + 
            				
            				msg[i].name + "</a> <i class=\"arrow fa fa-minus\" onclick=\"edu.gmu.csiss.geoweaver.menu.del('"+
		                				
            				msg[i].id+"','"+type+"')\"></i> <i class=\"arrow fa fa-external-link-square\" onclick=\"edu.gmu.csiss.geoweaver.menu.openssh('"+
		                				
            				msg[i].id+"','"+type+"')\" data-toggle=\"tooltip\" data-original-title=\"Connect SSH\"></i> </li>");
					
				}
				
				
			}).fail(function(jxr, status){
				
				console.error("fail to list hosts " + status);
				
			});
			
			
		},
		
		del: function(id, type){
			
			BootstrapDialog.show({
	            
				title: 'Alert',
	            
	            message: 'Are you sure to remove this '+type+'?',
	            
	            buttons: [{
	                
	            	label: 'Yes',
	                
	                action: function(dialog) {
	                	
	                	$.ajax({
	        				
	        				url: "del",
	        				
	        				method: "POST",
	        				
	        				data: "id="+id + "&type=" + type
	        				
	        			}).done(function(msg){
	        				
	        				if(msg=="done"){
	        					
	        					$("#"+type+"-" + id).remove();
	        					
	        				}else{
	        					
	        					console.error("fail to remove " + id);
	        					
	        				}
	        				
	        			}).fail(function(jxr, status){
	        				
	        				console.error("fail to delete " + status);
	        				
	        			});
	                	
	                	dialog.close();
	                	
	                }
	            }, {
	            	
	                label: 'Cancel',
	                
	                action: function(dialog) {
	                
	                	dialog.close();
	                
	                }
	            
	            }]
	        
			});
			
		},
		
		newHostDialog: function(){
			
			BootstrapDialog.show({
				
				title: "Add new host",
				
	            message: '<form>'+
				       '   <div class="form-group row required">'+
				       '     <label for="hostname" class="col-sm-2 col-form-label control-label">Host Name </label>'+
				       '     <div class="col-sm-10">'+
				       '       <input type="text" class="form-control" id="hostname" value="New Host">'+
				       '     </div>'+
				       '   </div>'+
				       '   <div class="form-group row required">'+
				       '     <label for="hostip" class="col-sm-2 col-form-label control-label">Hose IP</label>'+
				       '     <div class="col-sm-10">'+
				       '       <input type="text" class="form-control" id="hostip" placeholder="Host IP">'+
				       '     </div>'+
				       '   </div>'+
				       '   <div class="form-group row required">'+
				       '     <label for="hostport" class="col-sm-2 col-form-label control-label">Port</label>'+
				       '     <div class="col-sm-10">'+
				       '       <input type="text" class="form-control" id="hostport" placeholder="">'+
				       '     </div>'+
				       '   </div>'+
				       '   <div class="form-group row required">'+
				       '     <label for="username" class="col-sm-2 col-form-label control-label">User Name</label>'+
				       '     <div class="col-sm-10">'+
				       '       <input type="text" class="form-control" id="username" placeholder="">'+
				       '     </div>'+
				       '   </div>'+
				       ' </form>',
	            
	            cssClass: 'dialog-vertical-center',
	            
	            buttons: [{
	            	
	                label: 'Add',
	                
	                action: function(dialogItself){
	                	
	                	var req = "hostname="+$("#hostname").val() + 
	                		
	                		"&hostip=" + $("#hostip").val() +
	                		
	                		"&hostport=" + $("#hostport").val() + 
	                		
	                		"&username=" + $("#username").val();
	                	
	                	$.ajax({
	                		
	                		url: "add",
	                		
	                		method: "POST",
	                		
	                		data: req
	                		
	                	}).done(function(msg){
	                		
	                		msg = $.parseJSON(msg);
	                		
	                		var hostid = msg.hostid;
	                		
	                		var hostname = msg.hostname;
	                		
	                		$("#hosts").append("<li id=\"host-"+hostid+
	                				
	                				"\"><a href=\"javascript:void(0)\" onclick=\"edu.gmu.csiss.geoweaver.menu.detals('"+
	                				
	                				hostid+"','host')\">" + 
	                				
	                				hostname + "</a> <i class=\"arrow fa fa-minus\" onclick=\"edu.gmu.csiss.geoweaver.menu.del('"+
	                				
	                				hostid+"','host')\"></i> <i class=\"arrow fa fa-external-link-square\" onclick=\"edu.gmu.csiss.geoweaver.menu.openssh('"+
		                				
	                				hostid+"')\" data-toggle=\"tooltip\" data-original-title=\"Connect SSH\"></i> </li>");
	                		
	                	}).fail(function(jqXHR, textStatus){
	                		
	                		alert("Fail to add the host.");
	                		
	                	});
	                	
	                    dialogItself.close();
	                    
	                }
	            
	            },{
	            
	            	label: 'Close',
	                
	                action: function(dialogItself){
	                	
	                    dialogItself.close();
	                    
	                }
	        
	            }]
			
	        });
			
		},
		
		listen: function(type){
			
			$("#new" + type).click(function(){
				
				if(type=="host"){
					
					edu.gmu.csiss.geoweaver.menu.newHostDialog();
					
				}
				
			});
			
		}
		
};