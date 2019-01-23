/**
 * 
 * author: Ziheng Sun
 * date: 1/23/2019
 * 
 */

edu.gmu.csiss.covali.toolbar = {
		
	init: function(){
		
		$("#toolbar-search").click(edu.gmu.csiss.covali.search.init);
		$("#toolbar-add").click(edu.gmu.csiss.covali.add.init);
		$("#toolbar-layer").click(edu.gmu.csiss.covali.settings.init);
		$("#toolbar-statistics").click(edu.gmu.csiss.covali.tools.init);
		$("#toolbar-difference").click(edu.gmu.csiss.covali.tools.init);
		$("#toolbar-print").click(edu.gmu.csiss.covali.print.showDialog);
		
	}	
		
}