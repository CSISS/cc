/**
 * Juozas
 */
edu.gmu.csiss.covali.geojson = {
	
    
    
    testAddIcon: function(){
    
//    	var style = new ol.style.Style({
//            fill: new ol.style.Fill({
//              color: 'rgba(255, 255, 255, 0.6)'
//            }),
//            stroke: new ol.style.Stroke({
//              color: '#319FD3',
//              width: 1
//            }),
//            text: new ol.style.Text({
//              font: '12px Calibri,sans-serif',
//              fill: new ol.style.Fill({
//                color: '#000'
//              }),
//              stroke: new ol.style.Stroke({
//                color: '#fff',
//                width: 3
//              })
//            })
//      });
    	
    	var image = new ol.style.Circle({
            radius: 5,
            fill: null,
            stroke: new ol.style.Stroke({color: 'red', width: 1})
          });
    	
    	var styles = {
    	        'Point': new ol.style.Style({
    	          image: image
    	        }),
    	        'LineString': new ol.style.Style({
    	          stroke: new ol.style.Stroke({
    	            color: 'green',
    	            width: 1
    	          })
    	        }),
    	        'MultiLineString': new ol.style.Style({
    	          stroke: new ol.style.Stroke({
    	            color: 'green',
    	            width: 1
    	          })
    	        }),
    	        'MultiPoint': new ol.style.Style({
    	          image: image
    	        }),
    	        'MultiPolygon': new ol.style.Style({
    	          stroke: new ol.style.Stroke({
    	            color: 'yellow',
    	            width: 1
    	          }),
    	          fill: new ol.style.Fill({
    	            color: 'rgba(255, 255, 0, 0.1)'
    	          })
    	        }),
    	        'Polygon': new ol.style.Style({
    	          stroke: new ol.style.Stroke({
    	            color: 'blue',
    	            lineDash: [4],
    	            width: 3
    	          }),
    	          fill: new ol.style.Fill({
    	            color: 'rgba(0, 0, 255, 0.1)'
    	          })
    	        }),
    	        'GeometryCollection': new ol.style.Style({
    	          stroke: new ol.style.Stroke({
    	            color: 'magenta',
    	            width: 2
    	          }),
    	          fill: new ol.style.Fill({
    	            color: 'magenta'
    	          }),
    	          image: new ol.style.Circle({
    	            radius: 10,
    	            fill: null,
    	            stroke: new ol.style.Stroke({
    	              color: 'magenta'
    	            })
    	          })
    	        }),
    	        'Circle': new ol.style.Style({
    	          stroke: new ol.style.Stroke({
    	            color: 'red',
    	            width: 2
    	          }),
    	          fill: new ol.style.Fill({
    	            color: 'rgba(255,0,0,0.2)'
    	          })
    	        })
    	      };
    	
    	var styleFunction = function(feature) {
            return styles[feature.getGeometry().getType()];
          };
    	
      var vectorLayer = new ol.layer.Vector({
	    	title: "worldmap",
	    	name: "worldmap",
	        source: new ol.source.Vector({
	          url: "https://openlayers.org/en/latest/examples/data/geojson/countries.geojson",
//	          url: "http://portal.chordsrt.com/sites/map_markers_geojson",
	          format: new ol.format.GeoJSON()
	        }),
	        style: styleFunction
	        	
//	        	function(feature) {
//	        	
//	        	style.getText().setText(feature.get('name'));
//	            return style;
//	            
//	//          return new ol.style.Style({
//	//              image: new ol.style.Icon(/** @type {module:ol/style/Icon~Options} */ ({
//	//                  anchor: [40, 52],
//	//                  anchorXUnits: 'pixels',
//	//                  anchorYUnits: 'pixels',
//	//                  src: 'covali/img/chords-marker.png'
//	//              }))
//	//          });
//	        }
	    });
      
      
      var rome = new ol.Feature({
          geometry: new ol.geom.Point(ol.proj.fromLonLat([12.5, 41.9]))
        });

        var london = new ol.Feature({
          geometry: new ol.geom.Point(ol.proj.fromLonLat([-0.12755, 51.507222]))
        });

        var madrid = new ol.Feature({
          geometry: new ol.geom.Point(ol.proj.fromLonLat([-3.683333, 40.4]))
        });

        rome.setStyle(new ol.style.Style({
          image: new ol.style.Icon(/** @type {module:ol/style/Icon~Options} */ ({
            color: '#8959A8',
            crossOrigin: 'anonymous',
            src: '../images/chords-marker.png'
          }))
        }));

        london.setStyle(new ol.style.Style({
          image: new ol.style.Icon(/** @type {module:ol/style/Icon~Options} */ ({
            color: '#4271AE',
            crossOrigin: 'anonymous',
            src: '../images/chords-marker.png'
          }))
        }));

        madrid.setStyle(new ol.style.Style({
          image: new ol.style.Icon(/** @type {module:ol/style/Icon~Options} */ ({
            color: [113, 140, 0],
            crossOrigin: 'anonymous',
            src: '../images/chords-marker.png'
          }))
        }));


        var vectorSource2 = new ol.source.Vector({
          features: [rome, london, madrid]
        });

        var vectorLayer2 = new ol.layer.Vector({
          source: vectorSource2
        });
        
      var map1 = edu.gmu.csiss.covali.map.getMapBySide('left');
//      map1.addLayer(vectorLayer);
//      map1.addLayer(vectorLayer2);
      
      map1.getLayers().extend([vectorLayer, vectorLayer2]);
//      map2.addLayer(vectorLayer);
      
    },
    
    addGeoJSONFeature: function(url, layertitle) {
    	
        $.ajax({

//            contentType: "application/json",
        	dataType: 'json',

//            type: "GET",

            url: url,

            success: function(obj, text, jxhr)
            {
                // var gs = JSON.parse(obj);
//            	obj = $.parseJSON(obj);
            	
                var gs = (new ol.format.GeoJSON()).readFeatures(obj);
                var features = [];
                
                var style = new ol.style.Style({
                    image: new ol.style.Icon(/** @type {module:ol/style/Icon~Options} */ ({
                        anchor: [40, 52],
                        anchorXUnits: 'pixels',
                        anchorYUnits: 'pixels',
//                    	color: "#4271AE",
                        crossOrigin: 'anonymous',
                        src: '../images/chords-marker.png'
                    }))
                });
                
                for(var i=0;i<gs.length;i+=1){
                	
                	var feature = gs[i];
                    var point = feature.getGeometry();

                    var coords = ol.proj.fromLonLat(point.getCoordinates().map(parseFloat));
//                    var coords = ol.proj.fromLonLat(point.getCoordinates());
                    point.setCoordinates(coords);

//                    var name = feature.getProperties().name;
//                    
//                    var feature = new ol.Feature({
//                        geometry: point,
//                        name: feature.getProperties().name,
//                        url: url
//                    });
                    
                    feature.setStyle(style);
                    
                    features.push(feature);
                	
                }
                
                var vectorSource = new ol.source.Vector({
                	format: new ol.format.GeoJSON(),
                	features: features,
                	projection: 'EPSG:4326',
                	name: layertitle,
                	title: layertitle
//                    features: features[0]
//                	features: gs
//                	url: url,
                });
                
//                var vectorLayer = new ol.layer.Vector({
//                	title: layertitle,
//                    source: new ol.source.Vector({
//                      url: url,
//                      format: new ol.format.GeoJSON()
//                    }),
//                    style: function(feature) {
//                    	
//                    	style.getText().setText(feature.get('name'));
//                        return style;
//                        
////                      return new ol.style.Style({
////                          image: new ol.style.Icon(/** @type {module:ol/style/Icon~Options} */ ({
////                              anchor: [40, 52],
////                              anchorXUnits: 'pixels',
////                              anchorYUnits: 'pixels',
////                              src: 'covali/img/chords-marker.png'
////                          }))
////                      });
//                    }
//                });

                var vectorLayer = new ol.layer.Vector({
                    source: vectorSource,
                    style: style,
                    name: name,
                    title: layertitle
                });

                var select = new ol.interaction.Select();
                
                var selectedFeatures = select.getFeatures();
                selectedFeatures.on('add', function(){
                    var feature = selectedFeatures.pop();
                    edu.gmu.csiss.covali.chords.showSiteDetails(feature);
                });

                var map1 = edu.gmu.csiss.covali.map.getMapBySide('left');
                var map2 = edu.gmu.csiss.covali.map.getMapBySide('right');

                map1.addInteraction(select);
                map2.addInteraction(select);


                map1.addLayer(vectorLayer);
                map2.addLayer(vectorLayer);


                map1.on('pointermove', function(evt) {
                    map1.getTargetElement().style.cursor =
                        map1.hasFeatureAtPixel(evt.pixel) ? 'pointer' : '';
                });

                map2.on('pointermove', function(evt) {
                    map2.getTargetElement().style.cursor =
                        map2.hasFeatureAtPixel(evt.pixel) ? 'pointer' : '';
                });

            }
        });
    }
}

