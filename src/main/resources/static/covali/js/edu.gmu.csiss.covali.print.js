/**
 * 
 * Print the maps
 * 
 * @author Ziheng Sun
 * 
 */

edu.gmu.csiss.covali.print = {
		
	showDialog: function(){
		
		BootstrapDialog.closeAll();
		
//		$('.main').printThis();
		
		window.print();
		
//		BootstrapDialog.closeAll();
//		
//		BootstrapDialog.show({
//			
//			title: "Print View",
//			
//			message: $content,
//			
//			buttons: [{
//				
//            	icon: 'glyphicon glyphicon-ok',
//                
//                label: 'Print',
//                
//                cssClass: 'btn-warning',
//                
//                action: function(dialogItself){
//                	
//                	dialogItself.close();
//                	
//                }
//                
//			}, {
//
//            	icon: 'glyphicon glyphicon-ok',
//                
//                label: 'Cancel',
//                
//                cssClass: 'btn-warning',
//                
//                action: function(dialogItself){
//                	
//                	dialogItself.close();
//                	
//                }
//                
//			}]
//			
//		});
		
	}
		
}
