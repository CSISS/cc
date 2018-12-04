
/**
 * 
 * Statistics analysis
 * 
 * @author Ziheng Sun
 * 
 */

edu.gmu.csiss.covali.statistics = {
		
	draw: null,
		
	showDialog: function(){
		
		BootstrapDialog.closeAll();
		
		var content = "<div class=\"row\" style=\"padding:10px;\"><select id=\"mapsideselect\">"+
			"<option value=\"left\">left</option>"+
			"<option value=\"right\">right</option>"+
			"</select></div>";
		
		BootstrapDialog.show({
			
			title: "Line-based Statistics",
			
			message: content,
			
			buttons: [{
				
				label: "Start Draw",
				
				action: function(thedialog){
					
					var side = $("#mapsideselect").val();
					
					console.log("chosen map: " + side);
					
					//add a interaction
					
					var geometryFunction, maxPoints;
//			          if (value === 'Square') {
//			            value = 'Circle';
//			            geometryFunction = ol.interaction.Draw.createRegularPolygon(4);
//			          } else if (value === 'Box') {
//			            value = 'LineString';
//			            maxPoints = 2;
//			            geometryFunction = function(coordinates, geometry) {
//			              if (!geometry) {
//			                geometry = new ol.geom.Polygon(null);
//			              }
//			              var start = coordinates[0];
//			              var end = coordinates[1];
//			              geometry.setCoordinates([
//			                [start, [start[0], end[1]], end, [end[0], start[1]], start]
//			              ]);
//			              return geometry;
//			            };
//			          }
					var source = new ol.source.Vector({wrapX: false});
					
			        edu.gmu.csiss.covali.statistics.draw = new ol.interaction.Draw({
			            source: source,
			            type: /** @type {ol.geom.GeometryType} */ ("LineString"),
			            geometryFunction: geometryFunction,
			            maxPoints: maxPoints
			        });
			        
			        var map = edu.gmu.csiss.covali.map.getMapBySide(side);
			          
			        map.addInteraction(edu.gmu.csiss.covali.statistics.draw);
					
				    thedialog.close();
					
				}
				
			},{
				
				label: "Close",
				
				action: function(thedialog){
					
					thedialog.close();
					
				}
				
			}]
			
		});
		
		
	}
		
}
