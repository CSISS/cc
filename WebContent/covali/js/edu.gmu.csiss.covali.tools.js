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
			
			var $content = "  <button type=\"button\" onclick=\"edu.gmu.csiss.covali.nco.showDialog()\" class=\"btn btn-primary\"><i class='fa fa-calculator'></i> Difference Map </button>"+
			
			"  <button type=\"button\" onclick=\"edu.gmu.csiss.covali.statistics.showDialog()\" class=\"btn btn-primary\"><i class='fa fa-chart-bar'></i> Statistics Report </button>"+
			
			"  <button type=\"button\" onclick=\"edu.gmu.csiss.covali.animation.showDialog()\" class=\"btn btn-primary\"><i class='fa fa-film'></i> Create Animation </button>"+

			"  <button type=\"button\" onclick=\"edu.gmu.csiss.covali.regrid.showDialog()\" class=\"btn btn-primary\"><i class='fa fa-border-none'></i> Regrid </button>"+

			"  <button type=\"button\" onclick=\"edu.gmu.csiss.covali.print.showDialog()\" class=\"btn btn-primary\"><i class='fa fa-print'></i> Print </button>";
			
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