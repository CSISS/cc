/**
 * Main file of COVALI
 * @author Ziheng Sun
 * @date 2018.05.29
 */
edu.gmu.csiss.covali.main = {
	
	init: function(){
		
		$("#menuheader").val("Covali v" + edu.gmu.csiss.covali.version);

        this.initheight();

        edu.gmu.csiss.gpkg.cmapi.openlayers.init("openlayers1"); //left

        edu.gmu.csiss.gpkg.cmapi.openlayers.init("openlayers2"); //right

        edu.gmu.csiss.gpkg.cmapi.initialize.init();

        edu.gmu.csiss.covali.map.init();

        edu.gmu.csiss.covali.projection.init();

        edu.gmu.csiss.covali.menu.init();

        edu.gmu.csiss.covali.toolbar.init();

        edu.gmu.csiss.covali.about.init();

        // edu.gmu.csiss.covali.automate.loadExampleData();
		// edu.gmu.csiss.covali.search.init();

    },
	
	
	initheight: function(){
		
		edu.gmu.csiss.covali.main.htmlbodyHeightUpdate()
		
		$( window ).resize(function() {
		
			edu.gmu.csiss.covali.main.htmlbodyHeightUpdate()
		
		});
		
		$( window ).scroll(function() {
		
			height2 = $('.main').height()
			
			edu.gmu.csiss.covali.main.htmlbodyHeightUpdate()
		
		});
		
		
	},
	
	htmlbodyHeightUpdate: function (){
		
		var height3 = $( window ).height()
		
		var height1 = $('.nav').height()+50
		
		height2 = $('.main').height()
		
		if(height2 > height3){
		
			$('html').height(Math.max(height1,height3,height2)+10);
			
			$('body').height(Math.max(height1,height3,height2)+10);
		
		}
		else
		{
		
			$('html').height(Math.max(height1,height3,height2));
			
			$('body').height(Math.max(height1,height3,height2));
			
		}
		
	}
	
}

$(document).ready(function () {
		edu.gmu.csiss.covali.main.init();

	$(document).on('keydown', function(event) {
		if (event.key == "Escape") {
			edu.gmu.csiss.covali.menu.closeOnTopDialog();
		}
	});

});



