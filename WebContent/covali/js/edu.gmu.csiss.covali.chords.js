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
		
		showInstrumentDetails: function(id){
			
			var url = this.current_chords + "instruments/" + id + ".csv";
			
			BootstrapDialog.show({
				
	            title: "Instrument Details",
	            
	            size: BootstrapDialog.SIZE_WIDE,

	            message: function (dialog) {
	            	
	                var cont =  '<div id="instrument-container"></div> ';
	                
	                return cont;

	            },
	            onshown: function(){
	            	
	            	$.ajax({
	            		
	            		url: url,
	            		
	            		success: function(data){
	            			
	            			var cont = "<table>";
	            			
	            			var allLines = data.split(/\r\n|\n/);
	            			
	            			for (var i=0; i<allLines.length; i++) {
	            				
	            				cont += "<tr>";
	            		        
	            				var cols = allLines[i].split(',');
	            		        
	            		        for(var j=0;j<cols.length;j++){
	            		        	
	            		        	cont += "<td style=\"border: 1px solid black;\">" + cols[j] + "</td>";
	            		        	
	            		        }
	            		        
	            		        cont+= "</tr>";
	            		    }
	            			
	            			cont += "</table>";
	            			
	            			$("#instrument-container").html(cont);
	    	                    
	            		}
	            	});
	            	
	            },
	            buttons: [{
	                label: 'Close',
	                action: function(dialogItself){
	                    dialogItself.close();
	                }
	            }]
	        });
					
		},
		
		/**
		 * show details of the instrument
		 */
		showSiteDetails: function(feature) {
			
			var url = feature.getProperties().url;
			
			$.ajax({

	        	dataType: 'json',
	        	
	            url: url + ".json", //get site details
	            
	            success: function(data){
	            	
	            	BootstrapDialog.closeAll();

	    	        BootstrapDialog.show({

	    	            cssClass: 'dialog-vertical-center size-large',

	    	            title: "Site: " + feature.getProperties().name,

	    	            message: function (dialog) {
//	    	            	{"id":2,"name":"NCAR Foothills Lab","lat":"40.037399292","lon":"-105.240997314","created_at":"2017-01-23T16:54:21.000Z","updated_at":"2017-08-16T03:48:22.000Z"}
//	    	            	return "<iframe src=\""+url+"\"></iframe>"; //iframe is disallowed by CHORDS
	    	                var cont =  '<div class="row"><div class="col-md-12"><h4><b>From:</b> '+url+'</h4></div></div>'+
	    	                		'<div class="row"><div class="col-md-12"><h4><b>Site Id:</b> '+data.id+'</h4></div></div>'+
	    	                        '<div class="row"><div class="col-md-12"><h4><b>Site:</b> '+data.name+'</h4></div></div>'+
	    	                        '<div class="row"><div class="col-md-12"><h4><b>Latitude:</b> '+data.lat+'</h4></div></div>'+
	    	                        '<div class="row"><div class="col-md-12"><h4><b>Longitude:</b> '+data.lon+'</h4></div></div>'+
	    	                        '<div class="row"><div class="col-md-12"><h4><b>Created:</b> '+data.created_at+'</h4></div></div>'+
	    	                        '<div class="row"><div class="col-md-12"><h4><b>Updated:</b> '+data.updated_at+'</h4></div></div>'+
	    	                       ' <div class="row"><div class="col-md-12"><h4 id="instruments"><b>Instruments:</b> </h4></div></div> ';
	    	                
	    	                
	    	                
	    	                return cont;

	    	            },
	    	            onshown: function(){
	    	            	
	    	            	$.ajax({
	    	                	
	    	                	url: edu.gmu.csiss.covali.chords.current_chords + "instruments.json",
	    	                	
	    	                	dataType:"json",
	    	                	
	    	                	success: function(instruments){
	    	                		
//	    	                		[{"id":1,"sensor_id":null,"name":"FL Wx Station","site_id":2,"url":"http://portal.chordsrt.com/instruments/1.json"},{"id":2,"sensor_id":null,"name":"ML Wx Station","site_id":3,"url":"http://portal.chordsrt.com/instruments/2.json"},{"id":3,"sensor_id":null,"name":"NWSC Wx Station","site_id":4,"url":"http://portal.chordsrt.com/instruments/3.json"},{"id":5,"sensor_id":null,"name":"RAF Wx Station","site_id":6,"url":"http://portal.chordsrt.com/instruments/5.json"},{"id":6,"sensor_id":null,"name":"ML Sonic","site_id":3,"url":"http://portal.chordsrt.com/instruments/6.json"}]
	    	                		
	    	                		var inslist = [];
	    	                		
	    	                		for(var i=0; i<instruments.length; i+=1){
	    	                			
	    	                			if(data.id == instruments[i].site_id){
	    	                				
	    	                				inslist.push(instruments[i]);
	    	                				
	    	                			}
	    	                			
	    	                		}
	    	                		
	    	                		var insLinkList = "";
	    	                		
	    	                		for(var j=0;j<inslist.length;j+=1){
	    	                			
	    	                			insLinkList += '<a href="javascript:void(0)" onclick="edu.gmu.csiss.covali.chords.showInstrumentDetails('+inslist[j].id+')">'+inslist[j].name+'</a> ';
	    	                			
	    	                		}
	    	                		
	    	                		$("#instruments").html("<b>Instrument:</b> " + insLinkList);
	    	                		
	    	                	}
	    	                	
	    	                });
	    	            	
	    	            },
	    	            buttons: [{
	    	                label: 'Close',
	    	                action: function(dialogItself){
	    	                    dialogItself.close();
	    	                }
	    	            }]
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
			
//			edu.gmu.csiss.covali.geojson.testAddIcon();
			
//			$.ajax({
//				  
//				dataType: 'json',
//				  
//				url: this.current_chords + "/sites/map_markers_geojson",
//				
//				success: function(data){
//					  
//					  data = $.parseJSON(data);
//					  
//					  
//					  
//				}
//				
//			});

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
