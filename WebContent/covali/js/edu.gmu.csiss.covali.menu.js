/**
 * Menu listeners
 * @author Ziheng Sun
 * @date 2018.05.31
 */
edu.gmu.csiss.covali.menu = {
		
		jsframe: new JSFrame(),
		
		init: function(){
			
			$("#add").click(edu.gmu.csiss.covali.add.init);
			
			$("#tools").click(edu.gmu.csiss.covali.tools.init);
			
			$("#settings").click(edu.gmu.csiss.covali.settings.init);
			
			$("#search").click(edu.gmu.csiss.covali.search.init);
			
			$("#share").click(edu.gmu.csiss.covali.share.init);
			
		},
		
		
		closeDialog: function(dialogName){
			const dialog = edu.gmu.csiss.covali.menu.jsframe.getWindowByName(dialogName);
			if(dialog){
				dialog.closeFrame();
			}
		},
		
		closeAllDialogs: function(){
			var jsframeNames = ['edu.gmu.csiss.covali.add.jsframe.AddingDataMethods','edu.gmu.csiss.covali.wms.jsframe.AddWMS',
				'edu.gmu.csiss.covali.upload.jsframe.DataUploader', 'edu.gmu.csiss.covali.wms.jsframe.LayerSelector',
				'edu.gmu.csiss.covali.uri.jsframe.AddDataFromURL','edu.gmu.csiss.covali.chords.jsframe.AddCHORDS',
				'edu.gmu.csiss.covali.settings.jsframe.Settings','edu.gmu.csiss.covali.statistics.jsframe.Statistics',
				'edu.gmu.csiss.covali.animation.jsframe.LayerSelector','edu.gmu.csiss.covali.search.jsframe.SearchDialog']
			
			jsframeNames.forEach(function(jsframeName){
				edu.gmu.csiss.covali.menu.closeDialog(jsframeName);
			})
		},
		
		createDialog: function(dialogName, dialogTitle, content){
			
			edu.gmu.csiss.covali.menu.closeAllDialogs();
		
			var width = 700; var height = 250;
			
			const frame = edu.gmu.csiss.covali.menu.jsframe.create({
		    		title: dialogTitle,
		    		name: dialogName,
		    	    left: 0, 
		    	    top: 0, 
		    	    width: width,
		    	    appearanceName: 'yosemite',
		            movable: true,
		            resizable: true,
		            style:{
		            	width: "auto",
		            	height: "auto",
		            	position: "relative",
		            	overflow: "auto",
			            //overflowX: "auto",
			            //overflowY: "scroll",
			            maxHeight: "500px"
		            },
		    	    html: content
	    	});
	    	
			frame.setControl({
	            styleDisplay:'inline',
	            maximizeButton: 'zoomButton',
	            demaximizeButton: 'dezoomButton',
	            minimizeButton: 'minimizeButton',
	            deminimizeButton: 'deminimizeButton',
	            hideButton: 'closeButton',
	            animation: true,
	            animationDuration: 150,
	
	        });
	    	
	    	frame.show();
	    	frame.setPosition(window.innerWidth/2, window.innerHeight*0.05, 'CENTER_TOP');
		}
		
		
}