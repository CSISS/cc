/**
 * Menu listeners
 * @author Ziheng Sun
 * @date 2018.05.31
 */
edu.gmu.csiss.covali.menu = {
		
		init: function(){
			
			$("#add").click(edu.gmu.csiss.covali.add.init);
			
			$("#tools").click(edu.gmu.csiss.covali.tools.init);
			
			$("#settings").click(edu.gmu.csiss.covali.settings.init);
			
			$("#search").click(edu.gmu.csiss.covali.search.init);
			
			$("#share").click(edu.gmu.csiss.covali.share.init);
			
		}
		
		
}