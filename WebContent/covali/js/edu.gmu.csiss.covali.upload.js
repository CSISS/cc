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

		//load the uploaded file to the maps
		
		load: function(path){
			edu.gmu.csiss.covali.local.showFileLoadingDialog(path);
			edu.gmu.csiss.covali.local.loadWMSFile(path);
		},
		
		popUpWindow: function(){
			
			if($(".agreebtn").prop('checked')){

				edu.gmu.csiss.covali.menu.closeDialog('edu.gmu.csiss.covali.upload.jsframe.DataUploader');
				
				var winUp = window.open("","","width=400,height=150");
	            
	            var docUp = winUp.document;
	            
	            docUp.open();
	            
	            docUp.writeln("<html><head><title>Data Uploader</title>");
	            
	            docUp.writeln("<body  style=\"text-align: center;\">");
	        	
	        	var script = "      function load(){" +
			    
	            "        var fl = document.getElementById('filelink');" +
			    //"        var oRequest = new XMLHttpRequest();" +
			    
	            "        var path = fl.dataset.path;" +
			    
	            "        var winMain=window.opener;" +
			    
	            "		 winMain.edu.gmu.csiss.covali.upload.load(path);"+

	            "        window.close();" +
			    
	            "}";
	        	
	        	var cont = "<form name=\"uploadForm\" method=\"POST\"        enctype=\"MULTIPART/FORM-DATA\"        action=\"../FileUploadServlet\">                  \n" +
			    
	            "            <!--User Name:<input type=\"text\" name=\"username\" size=\"30\"/><br>--><br>\n" +
	            
			    "            Upload File: <input type=\"file\" name=\"file1\"><br><br>\n" +

				"<p>Max file size: 4GB</p>" +
			    
			    "            <input type=\"hidden\" name=\"script\" value=\""+script+"\">"+
			    
			    "        <input type=\"submit\" class=\"btn btn-primary\" name=\"submit\" value=\"Upload\"> &nbsp; <input type=\"reset\" class=\"btn btn-primary\" name=\"reset\" value=\"Reset\">\n" +
			    
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