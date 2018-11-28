/**
*
* All the methods related to the tools panel
*
* Author : Ziheng Sun
* 
* Date: 06/19/2018
*
*/

edu.gmu.csiss.covali.tools = {
		
		list: function(){
			
			var $content = "  <button type=\"button\" class=\"btn btn-primary\"><i class='fa fa-calculator'></i> Difference Map </button>"+
			
			"  <button type=\"button\" class=\"btn btn-primary\"><i class='fa fa-file-excel-o'></i> Statistics Report </button>"+
			
			"  <button type=\"button\" class=\"btn btn-primary\"><i class='fa fa-film'></i> Create Animation </button>"+
			
			"  <button type=\"button\" class=\"btn btn-primary\"><i class='fa fa-print'></i> Print </button>";
			
			return $content;
			
		},
		
		init: function(){
			
			BootstrapDialog.show({
	            
				message: edu.gmu.csiss.covali.tools.list(),
	            
				cssClass: 'dialog-vertical-center',
				
				title: "Tools",
	            
				buttons: [{
	            
					label: 'Close',
	                
					action: function(dialogItself){
	                
						dialogItself.close();
	                
					}
	            
				}]
	        
			});
			
		}
		
}