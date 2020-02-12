/**
* 
* A selector panel for data input
* 
* Author: Ziheng Sun
* 
* Date: 06/19/2018
* 
*/

edu.gmu.csiss.covali.add= {
		
		getContent: function(){
			
        	$content = "<div class=\"alert alert-info\">\n        <a href=\"javascript:void(0)\"  onclick=\"edu.gmu.csiss.covali.local.init();\" class=\"btn btn-primary pull-right\">Choose</a>\n        <strong>Public:</strong> Data folder on this COVALI host\n    </div>\n\n    "+
        			"<div class=\"alert alert-info\">\n        <a href=\"javascript:void(0)\"  onclick=\"edu.gmu.csiss.covali.wms.init();\" class=\"btn btn-primary pull-right\">Choose</a>\n        <strong>OGC WMS:</strong> Web Mapping Service Capabilities URL\n    </div>\n\n    "+
        			"<div class=\"alert alert-info\">\n        <a href=\"javascript:void(0)\" onclick=\"edu.gmu.csiss.covali.upload.init();\" class=\"btn btn-primary pull-right\">Choose</a>\n        <strong>Upload:</strong> NetCDF, GRIB or GeoJSON files\n    </div>\n\n    "+
        			"<div class=\"alert alert-info\">\n        <a href=\"javascript:void(0)\" onclick=\"edu.gmu.csiss.covali.uri.init();\" class=\"btn btn-primary pull-right\">Choose</a>\n        <strong>File URL:</strong> The URL of an online data file\n    </div>"+
        			"<div class=\"alert alert-info\">\n        <a href=\"javascript:void(0)\" onclick=\"edu.gmu.csiss.covali.chords.init();\" class=\"btn btn-primary pull-right\">Choose</a>\n        <strong>CHORDS URL:</strong> The URL of a CHORDS instance\n    </div>" +
           			"<div class=\"alert alert-info\">\n        <a href=\"javascript:void(0)\" onclick=\"edu.gmu.csiss.covali.iris.init();\" class=\"btn btn-primary pull-right\">Choose</a>\n        <strong>IRIS:</strong> IRIS seismology stations\n    </div>";
        	
            return $content;
			
		},
		
		init: function(){
			
			//give a dialog for users to choose the way to add data
			
			edu.gmu.csiss.covali.menu.closeAllDialogs();
			var dialogName = 'edu.gmu.csiss.covali.add.jsframe.AddingDataMethods';
			var dialogTitle = 'Adding Data Methods';
			
			var content = "<div class=\"modal-body\"><dl class=\"row\" style=\"font-size: 12px; padding: 5px; margin:0px;\">"+
			edu.gmu.csiss.covali.add.getContent()+
			"</dl></div>";

			edu.gmu.csiss.covali.menu.createDialog(dialogName, dialogTitle, content, 500, 600);
			
/*			BootstrapDialog.show({
				
				title: "Adding Data Methods",
				
	            message: function(dialog){
	            	
	            	$content = $("<div class=\"alert alert-info\">\n        <a href=\"javascript:void(0)\"  onclick=\"edu.gmu.csiss.covali.local.init();\" class=\"btn btn-primary pull-right\">Choose</a>\n        <strong>Public:</strong> Data folder on this COVALI host\n    </div>\n\n    "+
	            			"<div class=\"alert alert-info\">\n        <a href=\"javascript:void(0)\"  onclick=\"edu.gmu.csiss.covali.wms.init();\" class=\"btn btn-primary pull-right\">Choose</a>\n        <strong>OGC WMS:</strong> Web Mapping Service Capabilities URL\n    </div>\n\n    "+
	            			"<div class=\"alert alert-info\">\n        <a href=\"javascript:void(0)\" onclick=\"edu.gmu.csiss.covali.upload.init();\" class=\"btn btn-primary pull-right\">Choose</a>\n        <strong>Upload:</strong> NetCDF, GRIB or GeoJSON files\n    </div>\n\n    "+
	            			"<div class=\"alert alert-info\">\n        <a href=\"javascript:void(0)\" onclick=\"edu.gmu.csiss.covali.uri.init();\" class=\"btn btn-primary pull-right\">Choose</a>\n        <strong>File URL:</strong> The URL of an online data file\n    </div>"+
	            			"<div class=\"alert alert-info\">\n        <a href=\"javascript:void(0)\" onclick=\"edu.gmu.csiss.covali.chords.init();\" class=\"btn btn-primary pull-right\">Choose</a>\n        <strong>CHORDS URL:</strong> The URL of a CHORDS instance\n    </div>" +
                   			"<div class=\"alert alert-info\">\n        <a href=\"javascript:void(0)\" onclick=\"edu.gmu.csiss.covali.iris.init();\" class=\"btn btn-primary pull-right\">Choose</a>\n        <strong>IRIS:</strong> IRIS seismology stations\n    </div>");
	            	
                    return $content;
	            	
	            },
	            
	            title: "Select Your Data",
	            
	            cssClass: 'dialog-vertical-center',
	            
	            buttons: [{
	            
	            	label: 'Close',
	                
	            	action: function(dialogItself){
	                
	            		dialogItself.close();
	                
	            	}
	            
	            }]
	            
	        });*/
			
		}
		
}
