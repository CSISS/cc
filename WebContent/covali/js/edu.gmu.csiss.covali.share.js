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
		shareOnShown: function(snapshotId){
        	$("#social-btns").jsSocials({
                shares: ["email", "twitter", "facebook", "linkedin", "pinterest", "stumbleupon", "whatsapp"],
                text: "COVALI: a web system for comparison and validation of atmospheric models",
                showLabel: true,
                showCount: true,
                shareIn: "popup",
				url: window.location.href + '?snapshot=' + snapshotId
            });
        	
        },
        
		init: function(){
			var snapshotId = edu.gmu.csiss.covali.snapshot.saveSnapshot();

			var content = "<div class=\"row\">"+
			"	<div class=\"col-md-10\" id=\"social-btns\">"+
			"	</div>"+
			"</div><br/>";

			content += '	<label class="col-md-1 control-label" style="padding-top:8px;padding-left:2px" for="share-link">Link:</label>';
			content += '	<div class="col-md-9">';
			content += '		<input id="share-link" name="share-link" class="form-control" value="' + window.location.href + '?snapshot=' + snapshotId + '">';
			content += '	</div>';

			var dialogName = 'edu.gmu.csiss.covali.share.jsframe.Share';
			var dialogTitle = 'Share';
			var content = "<div class=\"modal-body\"><dl class=\"row\" style=\"font-size: 12px; padding: 5px; margin:0px\">"+
				content+
				"</dl></div>"+
				"<div class=\"modal-footer\">" +
				"<p><span class=\"btn btn-primary\" onclick=\'edu.gmu.csiss.covali.menu.closeDialog(\""+dialogName+"\")\'>Close</span></p>"+
				"</div>";
			edu.gmu.csiss.covali.menu.createDialog(dialogName, dialogTitle, content, 400);
			edu.gmu.csiss.covali.share.shareOnShown(snapshotId);
		}
}