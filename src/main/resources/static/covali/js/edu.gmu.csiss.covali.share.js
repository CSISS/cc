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
		
		init: function(){
			
			var content = "<div class=\"row\">"+
			"	<div class=\"col-md-10\" id=\"social-btns\">"+
			"	</div>"+
			"</div>";
			
			BootstrapDialog.show({
	            
				message: content,
	            
	            title: "Share",
	            
	            cssClass: 'dialog-vertical-center',
	            
	            onshown: function(){
	            	
	            	$("#social-btns").jsSocials({
	                    shares: ["email", "twitter", "facebook", "googleplus", "linkedin", "pinterest", "stumbleupon", "whatsapp"],
	                    text: "COVALI: a web system for comparison and validation of atmospheric models",
	                    showLabel: true,
	                    showCount: true,
	                    shareIn: "popup"
	                });
	            	
	            },
	            
	            buttons: [{
	            
	            	label: 'Close',
	            	
	                action: function(dialogItself){
	                	
	                    dialogItself.close();
	                    
	                }
	            
	            }]
	        
			});
			
			
		}
		
}