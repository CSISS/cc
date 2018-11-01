/**
*
* Geoweaver Process
* 
* @author Ziheng Sun
*
*/     

edu.gmu.csiss.geoweaver.workflow = {
		
	loaded_workflow: null,
		
	newDialog: function(createandrun){
		
		//check if there is more than one processes in the workspace
		
		if(edu.gmu.csiss.geoweaver.workspace.checkIfWorkflow()){
			
			var content = '<form>'+
		       '   <div class="form-group row required">'+
		       '     <label for="processcategory" class="col-sm-4 col-form-label control-label">Input Workflow Name : </label>'+
		       '     <div class="col-sm-8">'+
		       '		<input type="text" class="form-control" id="workflow_name" placeholder="New Workflow Name" />'+
		       '     </div>'+
		       '   </div>'+
		       '</form>';
			
			BootstrapDialog.show({
				
				title: "New workflow",
				
				message: content,
				
				buttons: [{
					
					label: "Confirm",
					
					action: function(dialog){
						
						//save the new workflow
						
						var workflow = {
							
							"name": $("#workflow_name").val(), 
							
							"type": "workflow",
							
							"nodes": JSON.stringify(edu.gmu.csiss.geoweaver.workspace.theGraph.nodes), 
							
							"edges": JSON.stringify(edu.gmu.csiss.geoweaver.workspace.theGraph.edges)
							
						};
						
						$.ajax({
							
							url: "add",
				    		
				    		method: "POST",
				    		
				    		data: workflow
				    		
						}).done(function(msg){
							
							msg = $.parseJSON(msg);
							
							edu.gmu.csiss.geoweaver.workflow.addMenuItem(msg);
							
							console.log("the workflow is added");
							
							if(createandrun){
								
								edu.gmu.csiss.geoweaver.workflow.run(msg.id);
								
							}
							
						}).fail(function(jqXHR, textStatus){
							
							console.error("fail to add workflow");
							
						});
						
					}
					
				},{
					
					label: "Close",
					
					action: function(dialog){
						
						dialog.close();
						
					}
					
				}]
				
				
			});
			
		}else{
			
			alert("There are no adequate processes in the workspace!");
			
		}
		
		
		
	},
	
	/**
	 * render the workflow as a new process
	 */
	showProcess: function(wid){
		
		
		
	},
	
	/**
	 * render the original processes in the workflow
	 */
	showWorkflow: function(wid){
		
		
		
	},
	
	/**
	 * Allow users to choose how to add the workflow into the workspace in two ways: 
	 * one process or the original workflow of processes
	 */
	add: function(wid){
		
		//pop up a dialog to ask which they would like to show it
		
		
		
	},
	
	run: function(id){
		
		BootstrapDialog.show({
			
			title: "Select host",
			
			message: "",
			
			buttons: [{
				
				label: "Run",
				
				action: function(dialog){
					
					dialog.close();
					
				}
				
			}]
			
		});
		
		$.ajax({
			
			url: "executeWorkflow",
			
			data: ""
			
		}).done(function(msg){
			
			console.log("the workflow execution is started " + id);
			
		}).fail(function(jxr, status){
			
			console.error("fail to run workflow " + id);
			
		});
		
	},
	
	addMenuItem: function(one){
		
		$("#"+edu.gmu.csiss.geoweaver.menu.getPanelIdByType("workflow")).append("<li id=\"workflow-" + one.id + "\"><a href=\"javascript:void(0)\" onclick=\"edu.gmu.csiss.geoweaver.menu.details('"+one.id+"', 'workflow')\">" + 
	    		
				one.name + "</a><i class=\"fa fa-plus subalignicon\" data-toggle=\"tooltip\" title=\"Show/Add this workflow\" onclick=\"edu.gmu.csiss.geoweaver.workflow.add('"+
	        	
				one.id+"')\"></i> <i class=\"fa fa-minus subalignicon\" data-toggle=\"tooltip\" title=\"Delete this workflow\" onclick=\"edu.gmu.csiss.geoweaver.menu.del('"+
	        	
				one.id+"','workflow')\"></i> <i class=\"fa fa-play subalignicon\" onclick=\"edu.gmu.csiss.geoweaver.workflow.run('"+
	        	
				one.id+"')\" data-toggle=\"tooltip\" title=\"Run Workflow\"></i> </li>");
		
	},
	
	list: function(msg){
		
		for(var i=0;i<msg.length;i++){
			
			this.addMenuItem(msg[i]);
			
			//this.addWorkspace(msg[i]);
			
		}
		
		$('#workflows').collapse("show");
		
	}
		
}