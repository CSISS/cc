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
			"	<div class=\"col-md-10\">"+
			"	  <a href=\"javascript::;\"><div class=\"twitter-hover social-slide\"></div></a>"+
			"	  <a href=\"javascript::;\"><div class=\"facebook-hover social-slide\"></div></a>"+
			"	  <a href=\"javascript::;\"><div class=\"google-hover social-slide\"></div></a>"+
			"	  <a href=\"javascript::;\"><div class=\"linkedin-hover social-slide\"></div></a>"+
			"	  <a href=\"javascript::;\"><div class=\"pinterest-hover social-slide\"></div></a>"+
			"	  <a href=\"javascript::;\"><div class=\"instagram-hover social-slide\"></div></a>"+
			"	  <a href=\"javascript::;\"><div class=\"tumblr-hover social-slide\"></div></a>"+
			"	  <a href=\"javascript::;\"><div class=\"reddit-hover social-slide\"></div></a>"+
			"	  <a href=\"javascript::;\"><div class=\"stumbleupon-hover social-slide\"></div></a>"+
			"	</div>"+
			"</div>";
			
			BootstrapDialog.show({
	            
				message: content,
	            
	            title: "Share",
	            
	            cssClass: 'dialog-vertical-center',
	            
	            buttons: [{
	                icon: 'glyphicon glyphicon-ok',
	                label: 'Share',
	                title: 'Place the request',
	                cssClass: 'btn-warning'
	            
	            }, {
	            
	            	label: 'Close',
	                action: function(dialogItself){
	                	
	                    dialogItself.close();
	                    
	                }
	            
	            }]
	        
			});
			
			
		}
		
}