/**
* CyberConnector
*/
/**
 * Uploading image to the server
 * @author Ziheng Sun
 * @date 2015.8.27
 */
cc.upload = {
		
		loadLocalImage: function(buttonid){
			
			console.log("The button id is : " + buttonid);
			
			var fileurlid = buttonid.replace(/upload_/i, 'input_');
			
            var winUp = window.open("","","width=400,height=150");
            
            var docUp = winUp.document;
            
            docUp.open();
            
            docUp.writeln("<html><head><title>Image Uploader</title>");
            
            docUp.writeln("<body  style=\"text-align: center;\">");
    //        docUp.writeln("<script type=\"text/javascript\" src=\"js/TaskGridTool.js\"><\/script>");
            
            var script = "      function load(){" +
		    
            "        var fl = document.getElementById('filelink');" +
		    //"        var oRequest = new XMLHttpRequest();" +
		    
            "        var sURL = fl.href;" +
		    
            "        var winMain=window.opener;" +
		    
            "        var imgurlele = winMain.document.getElementById('"+fileurlid+"');"+
		    
            "        imgurlele.value = sURL;"+
		    
            "        window.close();" +
		    
            "}";
		    
            var cont = "<form name=\"uploadForm\" method=\"POST\"        enctype=\"MULTIPART/FORM-DATA\"        action=\"../FileUploadServlet\">                  \n" +
		    
            "            <!--User Name:<input type=\"text\" name=\"username\" size=\"30\"/><br>--><br>\n" +
            
		    "            Upload File: <input type=\"file\" name=\"file1\"><br><br>\n" +
		    
		    "            <input type=\"hidden\" name=\"script\" value=\""+script+"\">"+
		    
		    "        <input type=\"submit\" name=\"submit\" value=\"submit\"> &nbsp; <input type=\"reset\" name=\"reset\" value=\"reset\">\n" +
		    
		    "      </form>";
            
            docUp.writeln(cont);
            
            docUp.writeln("<script>"+"function ret(){var winMain=window.opener;}"+"<\/script></body>");
        
		}
		
};