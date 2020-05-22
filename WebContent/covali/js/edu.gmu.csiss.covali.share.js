/**
*
* All the methods related to share function
*
* Author: Ziheng Sun
* 
* Date: 06/19/2018
*
*/

edu.gmu.csiss.covali.share = {
		
		
		shareOnShown: function(){
        	
        	$("#social-btns").jsSocials({
                shares: ["email", "twitter", "facebook", "googleplus", "linkedin", "pinterest", "stumbleupon", "whatsapp"],
                text: "COVALI: a web system for comparison and validation of atmospheric models",
                showLabel: true,
                showCount: true,
                shareIn: "popup"
            });
        	
        },
        
		init: function(){
			
			var content = "<div class=\"row\">"+
			"	<div class=\"col-md-10\" id=\"social-btns\">"+
			"	</div>"+
			"</div>";
			
			var dialogName = 'edu.gmu.csiss.covali.share.jsframe.Share';
			var dialogTitle = 'Share';
			var content = "<div class=\"modal-body\"><dl class=\"row\" style=\"font-size: 12px; padding: 5px; margin:0px\">"+
				content+
				"</dl></div>"+
				"<div class=\"modal-footer\">" +
				"<p><span class=\"btn btn-primary\" onclick=\'edu.gmu.csiss.covali.menu.closeDialog(\""+dialogName+"\")\'>Close</span></p>"+
				"</div>";
			edu.gmu.csiss.covali.menu.createDialog(dialogName, dialogTitle, content);
			edu.gmu.csiss.covali.share.shareOnShown();
		}
		
}