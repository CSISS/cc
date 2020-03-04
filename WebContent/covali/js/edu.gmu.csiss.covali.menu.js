/**
 * Menu listeners
 * @author Ziheng Sun
 * @date 2018.05.31
 */
edu.gmu.csiss.covali.menu = {
		jsframe: new JSFrame({parentElement: $('#jsframe-container')[0]}),

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
				'edu.gmu.csiss.covali.animation.jsframe.LayerSelector','edu.gmu.csiss.covali.search.jsframe.SearchDialog',
				'edu.gmu.csiss.covali.map.jsframe.PaletteSelector','edu.gmu.csiss.covali.animation.jsframe.CreateAnimation',
				'edu.gmu.csiss.covali.map.jsframe.StyleManager','edu.gmu.csiss.covali.local.jsframe.ParsingFile',
				'edu.gmu.csiss.covali.local.jsframe.PublicFolder','edu.gmu.csiss.covali.filebrowser.jsframe.LocalFiles',
				'edu.gmu.csiss.covali.multifilebrowser.jsframe.LocalFiles','edu.gmu.csiss.covali.share.jsframe.Share',
				'edu.gmu.csiss.covali.nco.jsframe.NCOProcessing', 'edu.gmu.csiss.covali.regrid.jsframe.RegridData',
                'edu.gmu.csiss.covali.statistics.jsframe.Iris'];
			
			jsframeNames.forEach(function(jsframeName){
				edu.gmu.csiss.covali.menu.closeDialog(jsframeName);
			})
		},
		
		createDialog: function(dialogName, dialogTitle, content, height, width, x, y){
			
			//edu.gmu.csiss.covali.menu.closeAllDialogs();

            if(width == null) {
                width = 700;
            }

			if(height == null) {
                $content = $('<div>' + content + '</div>').css("display", "inline-block");
                $('body').append($content);

                var height = $content.height() + 40;
                $content.remove();
                if(height > 1000) {
                    height = 1000;
				}
            }
			
//			if(x==null) x = 0;
//			
//			if(y==null) y = 0;
			
			var frame = edu.gmu.csiss.covali.menu.jsframe.create({
		    		title: dialogTitle,
		    		name: dialogName,
		    	    left: 0, 
		    	    top: 0, 
		    	    width: width,
		    	    height: height,
		    	    appearanceName: 'yosemite',
		            movable: true,
		            resizable: true,
		    
		            style:{
		            	overflow: "auto",
		            	maxHeight: Number(height) + 300
//		            	position: "absolute",
//			            overflowX: "auto",
//			            overflowY: "scroll",
//			            height: "600px",
			            //minHeight: "400px",
//			            resize: "both"
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
			frame.setResizable(true);
	    	
	    	frame.show();

	    	if(x == null) {
                x = window.innerWidth/2;
            }

            if(y == null) {
                y = window.innerHeight*0.05;
            }
	    	
	    	frame.setPosition(x, y, 'CENTER_TOP');

			frame.control.on('hid', (frame, info) => {
				edu.gmu.csiss.covali.menu.closeDialog(dialogName);
			});
		},
		
		setFrameDimensionsToInnerHTML: function(dialogName){
			
			const dialog = edu.gmu.csiss.covali.menu.jsframe.getWindowByName(dialogName);
			var $dialogInnterHtml = $(dialog.htmlElement);//.find('modal-body');
			
			$dialog = $(dialog);
			$dialog.height($dialogInnterHtml.height());
			
			console.log($dialogInnterHtml);
			console.log($dialogInnterHtml.height());
		}		
}