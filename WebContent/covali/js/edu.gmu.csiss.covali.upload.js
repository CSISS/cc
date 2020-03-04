/**
* 
* Author: Ziheng Sun
* 
* Date: 7/2/2018
*
*/

edu.gmu.csiss.covali.upload = {
		
		init: function(){
			
			this.dialog();
			
		},
		
		add2map: function(side){
			
		},
		
		//load the uploaded file to the maps
		
		load: function(sURL){
			
			var req = "location="+sURL;
			
			console.log("request is : " + req);

            edu.gmu.csiss.covali.local.showFileLoadingDialog(sURL);
			
			var posting = $.ajax({
				
				contentType: "application/x-www-form-urlencoded", //this is by default
				
				type: "POST",
				
				url: "../web/adddata",
				
				data: req, 
				
				success: function(obj, text, jxhr){
					
					var obj = $.parseJSON( obj );
					
					if(obj.output!="failure"){
						
						console.info("the new WMS layer name is : " + obj.id);
						
						BootstrapDialog.closeAll();
						
						const frame = edu.gmu.csiss.covali.menu.jsframe.create({
					    		title: 'Data Uploader',
					    	    left: 0, 
					    	    top: 0, 
					    	    width: 500, 
					    	    appearanceName: 'yosemite',
								style:{
					            	height: "auto",
					            	position: "relative",
						            overflow: "auto"
					            },
					    	    html: "<p class=\"text-success\">Your file has been uploaded. You can find it via the search function. Do you want to load it onto the map now?</p>"
				    	});
				    	
						frame.setControl({
				            styleDisplay:'inline',
				            maximizeButton: 'zoomButton',
				            demaximizeButton: 'dezoomButton',
				            minimizeButton: 'minimizeButton',
				            deminimizeButton: 'deminimizeButton',
				            hideButton: 'closeButton',
				            animation: true,
				            animationDuration: 150,
				
				        });
				    	
				    	frame.show();
				    	
				    	frame.setPosition((window.innerWidth - width) / 2, (window.innerHeight -height) / 2, 'LEFT_TOP');
						

					}else{
						
						alert("Fail to load the file into map. Check if it is CF-compliant netcdf." + obj.reason );
						
					}
					
					
					
				}, //success(result,status,xhr)
				error: function(xhr, status, error){
				
					alert("Fail to display the file " + error);
					
				} //error(xhr,status,error)
			});
			
		},
		
		popUpWindow: function(){
			
			if($(".agreebtn").prop('checked')){

				edu.gmu.csiss.covali.menu.closeDialog('edu.gmu.csiss.covali.upload.jsframe.DataUploader');
				
				var winUp = window.open("","","width=400,height=150");
	            
	            var docUp = winUp.document;
	            
	            docUp.open();
	            
	            docUp.writeln("<html><head><title>Image Uploader</title>");
	            
	            docUp.writeln("<body  style=\"text-align: center;\">");
	        	
	        	var script = "      function load(){" +
			    
	            "        var fl = document.getElementById('filelink');" +
			    //"        var oRequest = new XMLHttpRequest();" +
			    
	            "        var sURL = fl.href;" +
			    
	            "        var winMain=window.opener;" +
			    
	            "		 winMain.edu.gmu.csiss.covali.upload.load(sURL);"+
	            
//	            "        var imgurlele = winMain.document.getElementById('file1');"+
			    
//	            "        imgurlele.value = sURL;"+
			    
	            "        window.close();" +
			    
	            "}";
	        	
	        	var cont = "<form name=\"uploadForm\" method=\"POST\"        enctype=\"MULTIPART/FORM-DATA\"        action=\"../FileUploadServlet\">                  \n" +
			    
	            "            <!--User Name:<input type=\"text\" name=\"username\" size=\"30\"/><br>--><br>\n" +
	            
			    "            Upload File: <input type=\"file\" name=\"file1\"><br><br>\n" +

				"<p>Max file size: 4GB</p>" +
			    
			    "            <input type=\"hidden\" name=\"script\" value=\""+script+"\">"+
			    
			    "        <input type=\"submit\" class=\"btn btn-primary\" name=\"submit\" value=\"Upload\"> &nbsp; <input type=\"reset\" class=\"btn btn-primary\" name=\"reset\" value=\"reset\">\n" +
			    
			    "      </form>";
	        	
	        	docUp.writeln(cont);
	            
	            docUp.writeln("<script>"+"function ret(){var winMain=window.opener;}"+"<\/script></body>");
				
			}else{
				
				alert("Warning: You must agree the terms to proceed.");
				
			}
			
			
			
		},
		
		dialog: function(){
			
			//BootstrapDialog.closeAll();
			
			edu.gmu.csiss.covali.menu.closeAllDialogs();
			
			var content = "<div class=\"modal-body\"><dl class=\"row\" style=\"font-size: 12px; padding: 5px;\">"+
			"<p class=\"text-danger\">Checking the box below means you agree our terms and conditions for this service. If you haven't read them, please go to <a href=\"../web/terms\" target=\"_blank\">here</a> to read through them and make sure you agree with them before proceed. </p> " +
			"<p><input class=\"agreebtn\" type=\"checkbox\" value=\"\"> Agree </p> " +
			"<p><span class=\"btn btn-primary\" onclick=\"edu.gmu.csiss.covali.upload.popUpWindow()\" >Open Upload Window</span></p>"+
			"</dl></div>";
			
			edu.gmu.csiss.covali.menu.closeAllDialogs();
			var dialogName = 'edu.gmu.csiss.covali.upload.jsframe.DataUploader';
			var dialogTitle = 'Data Uploader';
			edu.gmu.csiss.covali.menu.createDialog(dialogName, dialogTitle, content);
			
		}
		
}