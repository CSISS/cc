/**
*
* Author: Ziheng Sun
* 
* Date: 7/2/2018
*
*/

edu.gmu.csiss.covali.uri = {
		
		cached: false,
		
		cached_url: "",
		
		init: function(){
			
			this.dialog();
			
		},
		
		change: function(){
			
			$("#cachebtn").prop('disabled', false);
			
			this.cached = false;
			
			this.cached_url = "";
			
		},
		 
		cache: function(){
			
			$("#cachebtn").html("<i class='fa fa-circle-o-notch fa-spin'></i> Processing");
			
			var postresp = $.ajax({
				
				contentType: "application/x-www-form-urlencoded", //this is by default
				
				type: "POST",
				
				url: "../web/cachecasual",
				
				data: "data=" + $("#file_url").val(), 
				
				success: function(obj, text, jxhr){
					
					var obj = jQuery.parseJSON( obj );
					
					console.info("the new relative path is : " + obj.file_url);
					
					edu.gmu.csiss.covali.uri.cached_url = obj.file_url;
					
					$("#cachebtn").prop('disabled', true);
					
					edu.gmu.csiss.covali.uri.cached = true;
					
					$("#cachebtn").html('Cached');
					
				}, error: function(){
					
					alert("Fail to process the request.");
					
					$("#cachebtn").prop('disabled', false);
					
					edu.gmu.csiss.covali.uri.cached = false;
					
					$("#cachebtn").html('Cache');
					
				} 
				
			});
			
		},
		
		checkDignity: function(){
			
			var dignity = true;
			
			if(!$("#file_url").val()){
        		
        		alert("Please input a file url.");
        		
        		dignity = false;
        		
        	}
			
			return dignity;
			
		},
		
		dialog: function(){
			
			this.cached = false;
			
			this.cached_url = "";
			
			BootstrapDialog.closeAll();
			
			BootstrapDialog.show({
				
				title: "Add data from URL",
				
	            message: function(dialog){
	            	
	            	$content = $("<div class=\"row\"><div class=\"col-xs-12\"> <div class=\"input-group\">"+
					"    <input type=\"text\" class=\"form-control\" id=\"file_url\">"+
					"    <span class=\"input-group-btn\">"+
					"		<button id=\"cachebtn\" class=\"btn btn-default\" "+
					"			onchange=\"edu.gmu.csiss.covali.uri.change();\" "+
					"			onclick=\"edu.gmu.csiss.covali.uri.cache();\" "+
					"		type=\"button\">Cache</button>"+
					"	</span>"+
					"</div></div></div>"+
					"<div class=\"row\"><div class=\"col-xs-12\">"+
					"e.g. https://www.unidata.ucar.edu/software/netcdf/examples/sresa1b_ncar_ccsm3-example.nc"+
					"</div></div>");
	            	
	            	return $content;
	            	
	            },
	            
	            cssClass: 'dialog-vertical-center',
	            
	            buttons: [{
		                
	            		label: 'Load Map',
		                
		                action: function(dialogItself){
		                	
		                	if(edu.gmu.csiss.covali.uri.checkDignity()){
		                		
		                		if(edu.gmu.csiss.covali.uri.cached){
			                		
				                	edu.gmu.csiss.covali.upload.load(edu.gmu.csiss.covali.uri.cached_url);
			                		
			                	}else{
			                		
			                		alert("The file must be cached before being loaded onto the maps.");
			                		
			                	}
		                		
		                	}
		                	
		                }
	            	},{
		                
	            		label: 'Close',
		                
		                action: function(dialogItself){
		                	
		                    dialogItself.close();
		                    
		                }
	            }]
	        });
			
		}
		
}