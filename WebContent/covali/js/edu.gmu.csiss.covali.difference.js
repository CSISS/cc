/**
 * 
 * Dialog for calculating difference between two maps
 * 
 * @author Ziheng Sun
 * 
 */

edu.gmu.csiss.covali.difference = {
	
	showDialog: function(){
		
		BootstrapDialog.closeAll();
		
		BootstrapDialog.show({
			
			title: "Calculate Difference",
			
			message: function(){
				
				var content = "under construction";
				
				return content;
				
			},
			
			buttons: [{
				
            	icon: 'glyphicon glyphicon-ok',
                
                label: 'Calculate',
                
                cssClass: 'btn-warning',
                
                action: function(dialogItself){
                	
                	dialogItself.close();
                	
                }
                
			}, {

            	icon: 'glyphicon glyphicon-ok',
                
                label: 'Cancel',
                
                cssClass: 'btn-warning',
                
                action: function(dialogItself){
                	
                	dialogItself.close();
                	
                }
                
			}]
			
		});
		
	}
		
}
