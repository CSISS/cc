/**
* 
*  CyberConnector Exhibitor Functionality
*  @author Ziheng Sun
*  @date 2016.7.2
*
*/

cc.exhibitor = {
		
	map: null,
	
	init: function(){
		if($("#view").length){
			$("#check").click(function(){
				cc.exhibitor.query($("#ordernumber").val());
			});
		};
		
		cc.exhibitor.map = new ol.Map({
	        layers: [
	          new ol.layer.Tile({
	            source: new ol.source.OSM()
	          })
	        ],
	        target: 'map',
	        controls: ol.control.defaults({
	          attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
	            collapsible: false
	          })
	        }),
	        view: new ol.View({
	          center: [0, 0],
	          zoom: 2
	        })
	      });
		
		//only for demonstration
		cc.exhibitor.addARectangle();
		//cc.exhibitor.addAMarker();
		cc.exhibitor.addAImageToMap();
	},
	
	addAImageToMap: function(){
		//var epsgProjection = new ol.proj.EPSG4326();

	    var imgProjection = new ol.proj.Projection({
	        code: 'pixel',
	        units: 'pixels',
	        extent: [-180, -90, 180, 90]
	    });

	    var vectorSrc = new ol.source.Vector();
	    
	    var imageExtent = [-180, -60, 180, 60];
	    
	    var image  = new ol.layer.Image({
            source: new ol.source.ImageStatic({
                url: 'images/dynamo_map_pss-1.png',
                imageExtent: imgProjection.getExtent(),
                projection: "EPSG:4326" ,
                imageExtent: imageExtent
            })
        });
	    
		cc.exhibitor.map.addLayer(image);
	},
	
	addAMarker: function(){
		var vectorSource = new ol.source.Vector({
		      //create empty vector
	    });
		    
	    //create a bunch of icons and add to source vector
	   
	        var iconFeature = new ol.Feature({
	          geometry: new  
	            ol.geom.Point(ol.proj.transform([Math.random()*360-180, Math.random()*180-90], 'EPSG:4326',   'EPSG:3857')),
	        name: 'Null Island ' + i,
	        population: 4000,
	        rainfall: 500
	        });
	        vectorSource.addFeature(iconFeature);
	        
	        var iconFeature1 = new ol.Feature({
		          geometry: new  
		            ol.geom.Point(ol.proj.transform([Math.random()*360-180, Math.random()*180-90], 'EPSG:4326',   'EPSG:3857')),
		        name: 'Null Island ' + i,
		        population: 4000,
		        rainfall: 500
		        });
	        vectorSource.addFeature(iconFeature1);
	
	    //create the style
	    var iconStyle = new ol.style.Style({
	      image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
	        anchor: [0.5, 46],
	        anchorXUnits: 'fraction',
	        anchorYUnits: 'pixels',
	        opacity: 0.75,
	        src: 'http://openlayers.org/en/v3.9.0/examples/data/icon.png'
	      }))
	    });
	
	
	
	    //add the feature vector to the layer vector, and apply a style to whole layer
	    var vectorLayer = new ol.layer.Vector({
		      source: vectorSource,
		      style: iconStyle
		    });
		
		cc.exhibitor.map.addLayer(vectorLayer);
	},
	
	addARectangle: function(){
		
		var wgs84Proj = new ol.proj.Projection({ code : "EPSG:4326" });
		var origProj = new ol.proj.Projection({ code : "EPSG:900913" });

		
		var convertedCoordinates = [];            
		//var unformattedCoordinates = [[175, 70], [175, 60], [-160, 60], [-160, 70]];
		var unformattedCoordinates =  [ [-98.947, 17.224], [ -98.947,30.676 ], [-75.480,  30.676], [-75.480, 17.224], [-98.947, 17.224] ];
		
		$(unformattedCoordinates).each(function(index, coordinate){
		    var lat = coordinate[0];
		    var lon = coordinate[1];

		    var circle = new ol.geom.Circle([lat, lon])
		    circle.transform(wgs84Proj, origProj);

		    convertedCoordinates.push(circle.getCenter());
		});
		
		
		
		
		var polygonGeometry = new ol.geom.Polygon([convertedCoordinates])
		var polygonFeature = new ol.Feature({ geometry : polygonGeometry });

		var vectorSource = new ol.source.Vector();
		vectorSource.addFeature(polygonFeature);

		var vectorLayer = new ol.layer.Vector({
		    source: vectorSource
		}); 
		
		cc.exhibitor.map.addLayer(vectorLayer);
	},
	
	done: function(){
		
	},
	
	fail: function(){
		
	},
	
	query: function(ordernumber){
		var req = "ordernumber="+ordernumber;
		cc.util.sendPostRequest(cc.util.getServletURL(5), req ,cc.exhibitor.done, cc.exhibitor.fail);
	}
	
};