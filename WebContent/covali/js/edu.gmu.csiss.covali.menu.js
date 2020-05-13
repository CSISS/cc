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

	setSize: function(dialogName, height, width) {
		const dialog = edu.gmu.csiss.covali.menu.jsframe.getWindowByName(dialogName);
		if(!height) {
			height = dialog.getSize().height;
		}

		if(!width) {
			width = dialog.getSize().width
		}
		dialog.setSize(width, height);
	},

	closeDialog: function(dialogName){
		const dialog = edu.gmu.csiss.covali.menu.jsframe.getWindowByName(dialogName);
		if(dialog){
			dialog.closeFrame();
		}
	},

	closeOnTopDialog: function() {
		var topObject = edu.gmu.csiss.covali.menu.jsframe.windowManager.onTopObject;
		if(topObject) {
			topObject.closeFrame();
		}
	},

	closeAllDialogs: function(){
		var jsFrameBeans = edu.gmu.csiss.covali.menu.jsframe.windowManager.beanNameId;
		for (var bName in jsFrameBeans) {
			// this is a covali window
			if(bName.indexOf('covali') != -1) {
				edu.gmu.csiss.covali.menu.closeDialog(bName);
			}
		}
	},

	createDialog: function(dialogName, dialogTitle, content, height, width, x, y){

		if (!width) { width = 800; }
		if (!height) { height = 500; }

		content = '<div id = "jsframeInnerHtml" style="padding:10px; font-size: 12px;">' + content + '</div>';

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
		if(!x) {
			x = window.innerWidth/2;
		}

		if(!y) {
			y = window.innerHeight*0.05;
		}
		frame.setPosition(x, y, 'CENTER_TOP');
	},

	setFrameDimensionsToInnerHTML: function(dialogName){

		const dialog = edu.gmu.csiss.covali.menu.jsframe.getWindowByName(dialogName);
		//var $dialogInnterHtml = //$(dialog.htmlElement).find('jsframeInnerHtml').context;

		//$dialog = $($dialogInnterHtml);
		//$dialog.height($dialogInnterHtml);

/*			console.log($dialogInnterHtml);
		console.log($('.modal-body').height());
		console.log($('.modal-footer').height());
		console.log("IFRAME HEIGHT: "+$("iframe").height());

		console.log("MODAL BODY HEIGHT: "+$('.modal-body').height());
		console.log("MODAL FOOTER HEIGHT: "+$('.modal-footer').height());
		console.log("JSFRAME INNER HTML HEIGHT: "+$('#jsframeInnerHtml').height());
		console.log("IFRAME HEIGHT: "+$("iframe").height());
		$("iframe").height(500);
		console.log("IFRAME HEIGHT: "+$("iframe").height());*/
	}
}