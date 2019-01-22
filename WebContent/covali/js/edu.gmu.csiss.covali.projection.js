/**
 * Projection Selector Control
 * @author Ziheng Sun
 * @date 05/31/2018
 */

edu.gmu.csiss.covali.projection = {
		
	extent: null,
	
	leftmap: null,
	
	leftmap3d: null,
	
	rightmap: null,
	
	rightmap3d: null,
		
	init: function(){
		
		this.leftmap = edu.gmu.csiss.gpkg.cmapi.openlayers.getMap("openlayers1");
		
		this.rightmap = edu.gmu.csiss.gpkg.cmapi.openlayers.getMap("openlayers2");
		
		$("#projectionselector").change(function() {
			
			var option = $( "#projectionselector option:selected" ).val();
			
			if(option!="3D"){
				
				edu.gmu.csiss.covali.projection.disable3D();
				
				edu.gmu.csiss.covali.projection.search(option);
				
			}else{
				
				edu.gmu.csiss.covali.projection.enable3D();
				
			}
			 
//			edu.gmu.csiss.covali.projection.setProjection(option, null, null, null, edu.gmu.csiss.covali.projection.leftmap);
//			
//			edu.gmu.csiss.covali.projection.setProjection(option, null, null, null, edu.gmu.csiss.covali.projection.rightmap);
			
		});
		
	},
	
	disable3D: function(){
		
		if(this.leftmap3d!=null){
			
			this.leftmap3d.setEnabled(false);
			
			this.leftmap3d = null;
			
		}
		
		if(this.rightmap3d != null){
			
			this.rightmap3d.setEnabled(false);
			
			this.rightmap3d = null;
			
		}
		
	},
	
	enable3D: function(){
		
		if(this.leftmap3d==null){
			
			this.leftmap3d = new olcs.OLCesium({map: this.leftmap}); // map is the ol.Map instance
			
		}
		
		this.leftmap3d.setEnabled(true);
		
		if(this.rightmap3d==null){
			
			this.rightmap3d = new olcs.OLCesium({map: this.rightmap});
			
		}
		
		this.rightmap3d.setEnabled(true);
		
	},
	
	search: function (query) {
//        resultSpan.innerHTML = 'Searching ...';
        
		fetch('http://epsg.io/?format=json&q=' + query).then(function(response) {
         
			return response.json();
        
		}).then(function(json) {
         
			var results = json['results'];
          
			if (results && results.length > 0) {
            
				for (var i = 0, ii = results.length; i < ii; i++) {
              
					var result = results[i];
              
					if (result) {
                
						var code = result['code'], name = result['name'],
						
						proj4def = result['proj4'], bbox = result['bbox'];
						
						if (code && code.length > 0 
								&& proj4def && proj4def.length > 0 
								&&bbox && bbox.length == 4) {
                  
							edu.gmu.csiss.covali.projection.setProjection(code, name, proj4def, bbox);
                  
							return;
                
						}
					}
				}
				
			}
          
			edu.gmu.csiss.covali.projection.setProjection(null, null, null, null);
		  
        });
		
    },
	
	setProjection: function (code, name, proj4def, bbox) {
        
		if (code === null || name === null || proj4def === null || bbox === null) {
		
//          resultSpan.innerHTML = 'Nothing usable found, using EPSG:3857...';
          
			var defaultview = new ol.View({
	            
	        	  projection: 'EPSG:3857',
	            
	        	  center: [0, 0],
	          
	        	  zoom: 1
	          
	          });
			
			edu.gmu.csiss.covali.projection.leftmap.setView(defaultview);
        	
			edu.gmu.csiss.covali.projection.rightmap.setView(defaultview);
        
        	return;
        
        }

//        resultSpan.innerHTML = '(' + code + ') ' + name;

		var newProjCode = 'EPSG:' + code;
        
		proj4.defs(newProjCode, proj4def);
		
		ol.proj.proj4.register(proj4);
        
        var newProj = ol.proj.get(newProjCode);
        
        var fromLonLat = ol.proj.getTransform('EPSG:4326', newProj);

        // very approximate calculation of projection extent
        var extent = ol.extent.applyTransform(
            [bbox[1], bbox[2], bbox[3], bbox[0]], fromLonLat);
        
        var center = fromLonLat([0, 0], newProj);
        
        if(code == "5041"){
        	
        	var destLoc = [-3965419,-3965419];
        	var currentLoc = [7893955,7865419];
        	
//        	var destLoc = [-3980000,-3980000];
//        	var currentLoc = [79800000,79890000];
        	
        	extent = ol.extent.boundingExtent([destLoc,currentLoc]);
        	
        	center = fromLonLat([0, 89.1], newProj);
        	
        }else if(code == "5042"){
        	
//        	var destLoc = [-4000000,-4000000];
//        	var currentLoc = [8000000,8000000];
        	
        	var destLoc = [-3965419,-3965419];
        	var currentLoc = [7893955,7865419];
        	
        	extent = ol.extent.boundingExtent([destLoc,currentLoc]);
        	
        	center = fromLonLat([0, -89.1], newProj);
        	
        }
        
        newProj.setExtent(extent);
        
        var newView = new ol.View({
        
        	projection: newProj,
        	
        	center: center
        
        });
        
        edu.gmu.csiss.covali.projection.leftmap.setView(newView);
        
        edu.gmu.csiss.covali.projection.rightmap.setView(newView);
        
        var size = edu.gmu.csiss.covali.projection.leftmap.getSize();
        
        if (size) {
        
        	newView.fit(extent, size);
        
        }
        
        edu.gmu.csiss.covali.map.refreshAllWMSLayers();
        
      }
		
};
