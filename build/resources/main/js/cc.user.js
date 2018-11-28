/**
 * 
 * CyberConnector User Management
 * @author Ziheng Sun
 * @date 20170128
 * 
 */

cc.user = {
		
		init: function(){
			
			
			
		},
		
		logoutSubmit: function(){
			
			BootstrapDialog.show({
			    title: 'Alert',
			    message: 'Are you sure you want to quit all application and log out?',
			    buttons: [{
			        id: 'btn-cancel',   
			        icon: 'glyphicon glyphicon-remove',       
			        label: 'CANCEL',
			        cssClass: 'btn-primary', 
			        autospin: false,
			        action: function(dialogRef){    
			            dialogRef.close();
			        }
			    }, {
			        id: 'btn-ok',   
			        icon: 'glyphicon glyphicon-check',       
			        label: 'OK',
			        cssClass: 'btn-primary', 
			        autospin: false,
			        action: function(dialogRef){    
			        	var method = "post"; // Set method to post by default if not specified.

					    // The rest of this code assumes you are not using a library.
					    // It can be made less wordy if you use one.
					    var form = document.createElement("form");
					    form.setAttribute("method", method);
					    form.setAttribute("action", "logout");
					    document.body.appendChild(form);
					    form.submit();
			        }
			    }]
			});
			
		}
		
		
};

