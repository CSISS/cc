/**
*
* Geoweaver Process
* 
* @author Ziheng Sun
*
*/ 

edu.gmu.csiss.geoweaver.process = {
		
		editor: null,
		
		precheck: function(){
			
			var valid = false;
			
			if($("#processname").val()&&this.editor.getValue()){
				
				valid = true;
				
			}
			
			return valid;
			
		},
		
		newDialog: function(){
			
			var content = '<form>'+
		       '   <div class="form-group row required">'+
		       '     <label for="processcategory" class="col-sm-4 col-form-label control-label">Your Process Type </label>'+
		       '     <div class="col-sm-8">'+
		       '		<select class="form-control" id="processcategory">'+
			   '    		<option>Shell</option>'+
			   /*'    		<option>Python</option>'+
			   '    		<option>R</option>'+
			   '    		<option>Matlab</option>'+*/
			   '  		</select>'+
		       '     </div>'+
		       '   </div>'+
		       '   <div class="form-group row required">'+
		       '     <label for="processname" class="col-sm-4 col-form-label control-label">Process Name </label>'+
		       '     <div class="col-sm-8">'+
		       '		<input class="form-control" id="processname"></input>'+
		       '     </div>'+
		       '   </div>'+
		       '   <div class="form-group row required" >'+
		       '	 <textarea  id="codeeditor" placeholder="Code goes here..."></textarea>'+
		       '   </div>'+
		       ' </form>';
			
			var dialog = new BootstrapDialog.show({
				
				title: "Add new process",
				
				closable: false,
				
	            message: content,
	            
	            cssClass: 'dialog-vertical-center',
	            
	            onshown: function(){
	            	
	            	//initiate the code editor
	            	
	            	edu.gmu.csiss.geoweaver.process.editor = CodeMirror.fromTextArea(document.getElementById("codeeditor"), {
	            		
	            		lineNumbers: true
	            		
	            	});
	            	
	            },
	            
	            buttons: [{
	            
	            	label: 'Add',
	                
	                action: function(dialogItself){
	                	
	                	edu.gmu.csiss.geoweaver.process.add(false);
	                	
	                    dialogItself.close();
	                    
	                }
	        
	            },{
//	            
//	            	label: 'Run',
//	                
//	                action: function(dialogItself){
//	                	
//	                	edu.gmu.csiss.geoweaver.process.add(true);
//	                	
//	                    dialogItself.close();
//	                    
//	                }
//	        
//	            }, {
	            
	            	label: 'Close',
	                
	                action: function(dialogItself){
	                	
	                    dialogItself.close();
	                    
	                }
	        
	            }]
				
			});
			
			edu.gmu.csiss.geoweaver.menu.setFullScreen(dialog);
			
		},
		
		/**
		 * add a new item under the process menu
		 */
		addMenuItem: function(one){
			
			$("#"+edu.gmu.csiss.geoweaver.menu.getPanelIdByType("process")).append("<li id=\"process-" + one.id + "\"><a href=\"javascript:void(0)\" onclick=\"edu.gmu.csiss.geoweaver.menu.details('"+one.id+"', 'process')\">" + 
    		
				one.name + "</a> <i class=\"fa fa-minus subalignicon\" data-toggle=\"tooltip\" title=\"Delete this process\" onclick=\"edu.gmu.csiss.geoweaver.menu.del('"+
	        	
				one.id+"','process')\"></i><i class=\"fa fa-plus subalignicon\" data-toggle=\"tooltip\" title=\"Add an instance\" onclick=\"edu.gmu.csiss.geoweaver.workspace.theGraph.addProcess('"+
	        	
				one.id+"','"+one.name+"')\"></i><i class=\"fa fa-edit subalignicon\" onclick=\"edu.gmu.csiss.geoweaver.process.edit('"+
	        	
				one.id+"')\" data-toggle=\"tooltip\" title=\"Edit Process\"></i> <i class=\"fa fa-play subalignicon\" onclick=\"edu.gmu.csiss.geoweaver.process.run('"+
	        	
				one.id+"')\" data-toggle=\"tooltip\" title=\"Run Process\"></i> </li>");
			
		},
		
		/**
		 * add process object to workspace
		 */
		addWorkspace: function(one){
			
			//randomly put a new object to the blank space
			
			var instanceid = edu.gmu.csiss.geoweaver.workspace.theGraph.addProcess(one.id, one.name);
			
		},
		
		list: function(msg){
			
			for(var i=0;i<msg.length;i++){
				
				this.addMenuItem(msg[i]);
				
				//this.addWorkspace(msg[i]);
				
			}
			
			$('#processs').collapse("show");
			
		},
		
		add: function(run){
			
			if(this.precheck()){
				
				var req = "type=process&lang="+$("#processcategory").val() + 
				
					"&name=" + $("#processname").val() + 
	    			
		    		"&code=" + edu.gmu.csiss.geoweaver.process.editor.getValue();
		    	
		    	$.ajax({
		    		
		    		url: "add",
		    		
		    		method: "POST",
		    		
		    		data: req
		    		
		    	}).done(function(msg){
		    		
		    		msg = $.parseJSON(msg);
		    		
		    		edu.gmu.csiss.geoweaver.process.addMenuItem(msg);
		    		
		    		if(run)
		    				
		    			edu.gmu.csiss.geoweaver.process.run(msg.id);
		    				
		    		
		    	}).fail(function(jqXHR, textStatus){
		    		
		    		alert("Fail to add the process.");
		    		
		    	});
				
			}else{
				
				alert("Process name and code must be non-empty!");
				
			}
			
		},
		
		execute: function(pid, hid){
			
			var html = "";
			
			
			
		},
		
		run: function(pid){
			
			//select a host
			
			var content = '<form>'+
		       '   <div class="form-group row required">'+
		       '     <label for="hostselector" class="col-sm-4 col-form-label control-label">Your Process Type </label>'+
		       '     <div class="col-sm-8">'+
		       '		<select class="form-control" id="hostselector">'+
		       '  		</select>'+
		       '     </div>'+
		       '   </div>';
			
			BootstrapDialog.show({
				
				title: "Select a host",
				
				closable: false,
				
	            message: content,
	            
	            onshown: function(){
	            	
	            	$.ajax({
	            		
	            		url: "list",
	            		
	            		method: "POST",
	            		
	            		data: "type=host"
	            		
	            	}).done(function(msg){
	            		
	            		for(var i=0;i<msg.length;i++){
	            			
	            			$("#hostselector").append("<option id=\""+msg[i].id+"\">"+msg[i].name+"</option>");
	            			
	            		}
	            		
	            	}).fail(function(jxr, status){
	    				
	    				console.error("fail to list host");
	    				
	    			});
	            	
	            },
	            
	            buttons: [{
		            
	            	label: 'Confirm',
	                
	                action: function(dialogItself){
	                	
	                	var hostid = $("#hostlist").children(":selected").attr("id");
	                	
	                	console.log("selected host: " + hostid);
	                	
	                	edu.gmu.csiss.geoweaver.process.execute(pid, hostid);
	                	
	                    dialogItself.close();
	                    
	                }
	        
	            },{
		            
	            	label: 'Cancel',
	                
	                action: function(dialogItself){
	                	
	                    dialogItself.close();
	                    
	                }
	        
	            }]
	            
			});
			
		}
		
}