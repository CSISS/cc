/**
* This file is created by Ziheng Sun on 6/2/2016
* This file is used as the main function in GMUGeopackageApp.
*/

edu.gmu.csiss.gpkg.cmapi.util = {
	
	guid: function() {
	  function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
		  .toString(16)
		  .substring(1);
	  }
	  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
		s4() + '-' + s4() + s4() + s4();
	}
	
};