/**
*
* Author: Ziheng Sun
* 
* Date: 7/2/2018
*
*/

edu.gmu.csiss.covali.uri = {
		
		cached: false,
		
		cached_path: "",
		
		init: function(){
			
			this.dialog();
			
		},
		
		change: function(){
			
			$("#cachebtn").prop('disabled', false);
			
			this.cached = false;
			
			this.cached_path = "";
			
		},
		 
		cache: function(){

			var url = $("#file_url").val();
			
			if(!url){
				
				alert("Please input data url!");
				
				return;
				
			}
			
			$("#cachebtn").html("<i class='fa fa-circle-o-notch fa-spin'></i> Processing");

			$.ajax({
				
				contentType: "application/x-www-form-urlencoded", //this is by default
				
				type: "POST",
				
				url: "../web/cache",
				
				data: "downloadurl=" + url,
				
				success: function(obj, text, jxhr){
					
					var obj = $.parseJSON( obj );
					
					if(obj.output != "failure"){
						
						console.info("the new  path is : " + obj.filepath);
						
						edu.gmu.csiss.covali.uri.cached_path = obj.filepath;
						
						$("#cachebtn").prop('disabled', true);
						
						edu.gmu.csiss.covali.uri.cached = true;
						
						$("#cachebtn").html('Cached');
						
					}else{
						
						alert("failed to cache")
						
						$("#cachebtn").prop('disabled', false);
						
						edu.gmu.csiss.covali.uri.cached = false;
						
						$("#cachebtn").html('Cache');
						
					}
					
					
					
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
		
		
		loadMapAction: function(){
        	
        	if(edu.gmu.csiss.covali.uri.checkDignity()){
        		
        		if(edu.gmu.csiss.covali.uri.cached){
        			var path = edu.gmu.csiss.covali.uri.cached_path;
					edu.gmu.csiss.covali.local.showFileLoadingDialog(path);
					edu.gmu.csiss.covali.local.loadWMSFile(path);
            	}else{
            		
            		alert("The file must be cached before being loaded onto the maps.");
            		
            	}
        		
        	}
        	
        },
		
		dialog: function(){
			this.cached = false;
			this.cached_path = "";

			edu.gmu.csiss.covali.menu.closeAllDialogs();
			
			var content = "<div class=\"modal-body\"><dl class=\"row\" style=\"font-size: 12px; padding: 5px;\">"+
							 
							"<div class=\"row\"><div class=\"col-xs-12\"> <div class=\"input-group\">"+
							"    <input type=\"text\" class=\"form-control\" id=\"file_url\">"+
							"    <span class=\"input-group-btn\">"+
							"		<button id=\"cachebtn\" class=\"btn btn-default\" "+
							"			onchange=\"edu.gmu.csiss.covali.uri.change();\" "+
							"			onclick=\"edu.gmu.csiss.covali.uri.cache();\" "+
							"		type=\"button\">Cache</button>"+
							"	</span>"+
							"</div></div></div>"+
							"<p>e.g. https://www.unidata.ucar.edu/software/netcdf/examples/sresa1b_ncar_ccsm3-example.nc"+
							"<div class=\"modal-footer\">"+
							"<span class=\"btn btn-primary\" onclick=\"edu.gmu.csiss.covali.uri.loadMapAction()\">Load Map</span></p>"
							"</dl></div>";
			
			var dialogName = 'edu.gmu.csiss.covali.uri.jsframe.AddDataFromURL';
			var dialogTitle = 'Add data from URL';
			edu.gmu.csiss.covali.menu.createDialog(dialogName, dialogTitle, content);
		}
		
}