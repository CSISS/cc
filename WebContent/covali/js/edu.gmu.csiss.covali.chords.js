/**
 * EarthCube CHORDS related function
 */

edu.gmu.csiss.covali.chords = {
		
		current_chords: null,
		
		init: function(){
			
			// pop up a dialog to input a CHORDS URL or select the default CHORDS (http://portal.chordsrt.com)
			// after a chords is selected, automatically show all the instruments on the maps.
			// click on each instrument will show a dialog with the last measurements of that instrument
			// users can check out the historical measurements by changing the time period in the dialog
			
			this.showInitialDialog();
			
		},
		
		getOfficialAddr: function(){
			
			return "http://portal.chordsrt.com/";
			
		},
		
		showInstrumentDetails: function(id, aElementClicked){
			
			var jsonUrl = this.current_chords + "/api/v1/data/" + id + ".json";
            var csvUrl = this.current_chords + "/api/v1/data/" + id + ".csv";
			var popupContent = $(aElementClicked).closest('.popup-content');


			$.ajax({

				url: jsonUrl,

				success: function(result){
					var properties = result.features[0].properties;
					var data = properties.data;

					var lastReading = data.slice(-1)[0]

					var dateStart = data[0].time;
	        		var dateEnd = lastReading.time;

                    var detailsHtml =
                        '<div class="row"><h5> ' + properties.instrument + ' - ' + properties.site + '</h5></div>';

                    detailsHtml += '<div class="row"><h5>Last Reading ' + dateEnd + ':</h5></div>';

                    properties.variables.forEach(function (v){
                    	var lastValue = lastReading.measurements[v.shortname];

                        detailsHtml += '<div class="row"><b> ' + v.name + ' (' + v.shortname + ')' + ': </b> ' + lastValue + '</div>';

                    });

                    detailsHtml += '<div class="row"><a target="_blank" href="' + csvUrl + '">'+ properties.measurements_in_feature +' total measurements</a></div>';

                    popupContent.html(detailsHtml);
				}
			});
					
		},

		showSitePopup: function(feature, side) {
            var map = edu.gmu.csiss.covali.map.getMapBySide(side);

            var popupElement = $('<div class="ol-popup"></div>');
            var popupCloser = $('<a href="#" class="ol-popup-closer"></a>');
            var popupContent = $('<div class="popup-content"></div>');

            popupCloser.appendTo(popupElement);
            popupContent.appendTo(popupElement);

            popupElement.appendTo($('body'));


            var popupOverlay = new ol.Overlay({
                element: popupElement[0],
				insertFirst: false,
                autoPan: true,
				offset: [-18, -50],
                autoPanAnimation: {
                    duration: 250
                }
            });

            var coords = feature.getGeometry().getCoordinates();
            popupOverlay.setPosition(coords);
            map.addOverlay(popupOverlay);

            popupCloser.click(function() {
                popupElement.remove();
                map.removeOverlay(popupOverlay);
            });

            edu.gmu.csiss.covali.chords.loadSiteDetails(feature, popupContent);
        },

		/**
		 * load instrument details into target jQuery element
		 */
        loadSiteDetails: function(feature, target) {
			var url = feature.getProperties().url;
			
			$.ajax({

                dataType: 'json',

                url: url + ".json", //get site details

                success: function (data) {
                    var detailsHtml =
                        '<div class="row"><h5><b>From:</b> ' + url + 				'</h5></div>' +
                        '<div class="row"><h5><b>Site Id:</b> ' + data.id +			'</h5></div>' +
                        '<div class="row"><h5><b>Site:</b> ' + data.name + 			'</h5></div>' +
                        '<div class="row"><h5><b>Latitude:</b> ' + data.lat +		'</h5></div>' +
                        '<div class="row"><h5><b>Longitude:</b> ' + data.lon + 		'</h5></div>' +
                        '<div class="row"><h5><b>Created:</b> ' + data.created_at + '</h5></div>' +
                        '<div class="row"><h5><b>Updated:</b> ' + data.updated_at + '</h5></div>' +
                        '<div class="row"><h5 class="instruments"><b>Instruments:</b> </h5></div>';

                    var detailsElement = $(detailsHtml);

                    target.append(detailsElement);

                    // Load the list of instruments
                    $.ajax({

                        url: edu.gmu.csiss.covali.chords.current_chords + "/instruments.json",

                        dataType: "json",

                        success: function (instruments) {
                            // [{"id":1,"sensor_id":null,"name":"FL Wx Station","site_id":2,"url":"http://portal.chordsrt.com/instruments/1.json"},{"id":2,"sensor_id":null,"name":"ML Wx Station","site_id":3,"url":"http://portal.chordsrt.com/instruments/2.json"},{"id":3,"sensor_id":null,"name":"NWSC Wx Station","site_id":4,"url":"http://portal.chordsrt.com/instruments/3.json"},{"id":5,"sensor_id":null,"name":"RAF Wx Station","site_id":6,"url":"http://portal.chordsrt.com/instruments/5.json"},{"id":6,"sensor_id":null,"name":"ML Sonic","site_id":3,"url":"http://portal.chordsrt.com/instruments/6.json"}]

                            var inslist = [];

                            for (var i = 0; i < instruments.length; i += 1) {
                                if (data.id == instruments[i].site_id) {
                                    inslist.push(instruments[i]);
                                }
                            }

                            var insLinkList = "";

                            for (var j = 0; j < inslist.length; j += 1) {
                                insLinkList += '<a href="javascript:void(0)" onclick="edu.gmu.csiss.covali.chords.showInstrumentDetails(' + inslist[j].id + ', this)">' + inslist[j].name + '</a> ';
                            }

                            target.find(".instruments").html("<b>Instrument:</b> " + insLinkList);
                        }
                    });
                }
            });

//	        var ps = feature.getProperties();
//
//	        var readings = ps.geojson.measurements_in_file;
//	        var date_start = ps.geojson.data[0].time;
//	        var date_end = ps.geojson.data.slice(-1)[0].time
//
//	        var variable_names = ps.geojson.data[0].vars.map(a => a.variable_name);
	        
	        
	    },
		
		add: function(){
			
			this.current_chords = $("#chords_ins_url").val();
			
			//load all the instruments on the map
			
			edu.gmu.csiss.covali.geojson.addGeoJSONFeature(this.current_chords + "/sites/map_markers_geojson", "CHORDS instruments");

			BootstrapDialog.closeAll();

		},
		
		showInitialDialog: function(){
			
			BootstrapDialog.closeAll();
			
			BootstrapDialog.show({
				
				title: "Add CHORDS",
				
	            message: function(dialog){
	            	
	            	$content = $("<div class=\"row\" style=\"padding:10px;\">"+
	            			
	            			"<div class=\"input-group col-md-12\">"+
	            			
	            			"    <form> "+
							"	    <label class=\"radio-inline\"> "+
							"	      <input type=\"radio\" name=\"chords_source\" value=\"Custom\" checked > Other CHORDS instances"+
							"	    </label> "+
							"	    <label class=\"radio-inline\"> "+
							"	      <input type=\"radio\" name=\"chords_source\" value=\"Builtin\"> CHORDS official instance "+
							"	    </label> "+
							"	 </form>"+
	            			
	            			"</div>"+
	            			
	            			"<div class=\"input-group col-md-12\">"+
	            			
	            			"    <input type=\"text\" id=\"chords_ins_url\"  class=\"form-control\" placeholder=\"Please input the portal URL..\">"+
	            			
	            			"    <span class=\"input-group-btn\"><button type=\"button\" onclick=\"edu.gmu.csiss.covali.chords.add();\" class=\"btn btn-default\">Add</button></span>"+
	            			
	            			"</div>"+
	            			
	            			"<div class=\"col-md-1\"></div></div>"
	            	);
	            	
	            	return $content;
	            	
	            },
	            
	            onshown: function(){
	            	
	            	$('input[type=radio][name=chords_source]').change(function() {
	            		
	            		$("#chords_ins_url").val(""); //clear the existing text
	            		
	            	    if (this.value == 'Custom') {
	            	        
	            	    	console.log("customized CHORDS source");
	            	    	
	            	    }else if (this.value == 'Builtin') {
	            	        
	            	    	console.log("built-in CHORDS source");
	            	    	
	            	    	$("#chords_ins_url").val(edu.gmu.csiss.covali.chords.getOfficialAddr());
	            	        
	            	    }
	            	});
	            	
	            },
	            
	            cssClass: 'dialog-vertical-center',
	            
	            buttons: [{
	                
	            	label: 'Close',
	                
	            	action: function(dialogItself){
	                	
	                    dialogItself.close();
	                    
	                }
	            
	            }]
	        
			});
			
		}
		
}
