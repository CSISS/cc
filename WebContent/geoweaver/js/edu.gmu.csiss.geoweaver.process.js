/**
*
* Geoweaver Process
* 
* @author Ziheng Sun
*
*/ 

edu.gmu.csiss.geoweaver.process = {
		
		editor: null,
		
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
		       '	 <div id="codeeditor"></div>'+
		       '   </div>'+
		       ' </form>';
			
			var dialog = new BootstrapDialog.show({
				
				title: "Add new process",
				
				closable: false,
				
	            message: content,
	            
	            cssClass: 'dialog-vertical-center',
	            
	            onshown: function(){
	            	
	            	//initiate the code editor
	            	
	            	edu.gmu.csiss.geoweaver.process.editor = CodeMirror(document.getElementById("codeeditor"), {
	            		
	            		lineNumbers: true
	            		
	            	});
	            	
	            },
	            
	            buttons: [{
	            
	            	label: 'Add',
	                
	                action: function(dialogItself){
	                	
	                	edu.gmu.csiss.geoweaver.process.add();
	                	
	                    dialogItself.close();
	                    
	                }
	        
	            },{
	            
	            	label: 'Run',
	                
	                action: function(dialogItself){
	                	
	                	//select a host to run the process
	                	
	                    dialogItself.close();
	                    
	                }
	        
	            }, {
	            
	            	label: 'Close',
	                
	                action: function(dialogItself){
	                	
	                    dialogItself.close();
	                    
	                }
	        
	            }]
				
			});
			
			edu.gmu.csiss.geoweaver.menu.setFullScreen(dialog);
			
		},
		
		list: function(msg){
			
			
		},
		
		add: function(){
			
			var req = "type=process&lang="+$("#processcategory").val() + 
			
				"&name=" + $("#processname").val() + 
    			
	    		"&code=" + edu.gmu.csiss.geoweaver.process.editor.getValue();
	    	
	    	$.ajax({
	    		
	    		url: "add",
	    		
	    		method: "POST",
	    		
	    		data: req
	    		
	    	}).done(function(msg){
	    		
	    		msg = $.parseJSON(msg);
	    		
	    		var processid = msg.id;
	    		
	    		
	    		
	    		
	    	}).fail(function(jqXHR, textStatus){
	    		
	    		alert("Fail to add the process.");
	    		
	    	});
			
		},
		
		run: function(pid){
			
			
			
		}
		
}