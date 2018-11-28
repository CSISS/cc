/**
 * CyberConnector Order
 * @author Ziheng Sun 
 * @date 9/2/2015
 */
cc.order = {
		
        isReviewed : false,

		isConfirmed : false,
		
		north: null,
		
		south: null,
		
		east: null,
		
		west: null,
		
		productid : null,
		
		valueList : [],
		
		selectorMap: null,
		
		paramMapList:[],
		
		initStatusCheck: function(){
			
			if($("#check").length){
				
				$("#check").click(function(){
				
					cc.order.query($("#ordernumber").val());
				
				});
			
			}
		},
		
		init: function(productinputlist, north, east, south, west, productid){
			
			cc.order.initStatusCheck();
			
			if($('.btnNext').length){

				cc.order.east = east;
				
				cc.order.west = west;
				
				cc.order.north = north;
				
				cc.order.south = south;
				
				cc.order.productid = productid;
		    	
				cc.order.initNavButton();
				
				cc.order.initializeMap();
				
				cc.order.initParamPage();
				
				cc.order.initCronPage();
		    	
				cc.order.theList = productinputlist;
		    	
		        //if the input url tab is visible, resize all the map divs.
		        
//		        $(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
//		            
//		        	alert('TAB CHANGED');
//		        	
//		        	var link = $('.bootstrapWizard > .active').find('a').attr("href");
//		        	
//		        	if(link=="#tab2"){
//		        		
//		        		alert("enter to right place");
//		        		
//		        		console.log("delay the initialization of maps by 1 seconds to give the DOM more time to stablize.");
//		        		
//		        		setTimeout(function(){ 
//
//		        			for (var i = 0; i < cc.order.theList.length; i++) {
//					        	
//					        	console.log("Map Id is : mapid_" + cc.order.theList[i].ename);
//					        	
//					        	if(cc.order.theList[i].format == "boundingbox" || cc.order.theList[i].format == "bbox"){
//						        	
//					        		console.log("begin to initialize the parameter map..");
//					        		
//						        	cc.order.initializeMap2("mapid_" + cc.order.theList[i].ename);
//						        	
//						        	console.log("map is rendered.");
//					        		
//					        	}
//					        
//					        }
//					        
//				        	
//				        	for(var i=0; i< cc.order.paramMapList.length; i++){
//				        		
//				        		cc.order.paramMapList[i].invalidateSize(true);
//				        		
//				        	}
//		        		
//		        		
//		        		}, 1000);
//		        		
//		        	}
//		        	
//		        })
		        
		        //disable the cron on first appearance
		        
		        cc.order.disableCron();
				
			}
		
		},
		
		/**
		 * Get current bounding box
		 */
		getBoundingBox: function(inputfieldid){
			
			var bounds = cc.order.selectorMap.getBounds();
			
			var sw = bounds.getSouthWest().wrap();
			
			var ne = bounds.getNorthEast().wrap();
			
			var lowlat = sw.lat;
			
			var lowlon = sw.lng;
			
			var toplat = ne.lat;
			
			var toplon = ne.lng;
			
			var bbox = lowlon + "," + lowlat + "," + toplon + "," + toplat;
			
			//alert("get bounding box is : " + bbox);
			
			inputfieldid = inputfieldid.replace(/\mapid/g, 'input');
			
			//need do a projection check and transformation if the destination projection is not 4326.
			
			$("#"+inputfieldid).val(bbox);
			
			//alert("input field id : " + inputfieldid);
			
		},
		
//		onMapClick: function (e) {
//			
//			var bounds = [[X, Y], [X, Y]];
//
//			// create an orange rectangle
//			var boundingBox = L.rectangle(bounds, {color: "#ff7800", weight: 1});
//			
//			map.addLayer(boundingBox);
//			
//			alert("You clicked the map at " + e.latlng);
//	    
//		},
 		
		
		/**
		 * 
		 * @param inputfieldid
		 */
		popUpBoundingBoxSelector: function(inputfieldid){
			
			//alert("The button id is : " + inputfieldid );
			
			if($.trim($("#mapWindow").text())==''){
				
				//alert("The div is empty");
				
				var html =  ' <div id="mapModal" class="modal">'+
				
				'	<div class="modal-dialog">'+
				      
				'      <div class="modal-content">'+
				        
				'        <div class="modal-header">'+
				        
				'          <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>'+
				        
				'          <h4 class="modal-title">BoundingBox Selector</h4>'+
				        
				'        </div>'+
				        
				'        <div class="modal-body">'+
				        
				'          <div class="modal-body" id="map-canvas"></div>'+
				          
				'         <select id="selectprojection" name="selectprojection" class="form-control">'+
							
				'			      <option value="wgs84">WGS84</option>'+
								  
				'			      <option value="sinusoidal">MODIS Sinusoidal</option>'+
								  
				'		    </select>'+
				          
				'        </div>'+
				    
				'        <div class="modal-footer">'+
				    
				'          <button type="button" class="btn" data-dismiss="modal" aria-hidden="true" onclick="cc.order.getBoundingBox(\''+inputfieldid+'\');" >OK</button>'+
				    
				'        </div>'+
				    
				'      </div>'+
				    
				'    </div>'+
				
				'</div>';  // modalWindow
			    
			    $("#mapWindow").html(html);
			    
			    $("#mapModal").modal();
			    
			    setTimeout(function(){
			    	
			    	//initialize the map in the modal
			    	
			    	cc.order.selectorMap = L.map("map-canvas").setView([36, -78], 13);
			    	
//			    	cc.order.selectorMap.on('click', onMapClick);
			    	
		    		var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
		    		
		    		var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
		    		
		    		var osm = new L.TileLayer(osmUrl, {attribution: osmAttrib});		
		    		
//		    		var southWest = new L.LatLng(cc.order.north, cc.order.east),
//		    		
//						    northEast = new L.LatLng(cc.order.south, cc.order.west),
//					
//						    bounds = new L.LatLngBounds(southWest, northEast);
			
//					mymap.fitBounds(bounds);
		    		
		    		cc.order.selectorMap.addLayer(osm);
		    		
		    		cc.order.selectorMap.fitWorld();
		    		
//		    		// define rectangle geographical bounds
//		    		var bounds = [[54.559322, -5.767822], [56.1210604, -3.021240]];
//
//		    		// create an orange rectangle
//		    		L.rectangle(bounds, {color: "#ff7800", weight: 1}).addTo(cc.order.selectorMap);
		    		
		    		console.log("Resize the leaflet map of parameters.");
		    		
		    		cc.order.selectorMap.invalidateSize(true);
			    	
			    }, 500);
				
			}else{
				
				//alert("The map is already initialized.");
				
			    $("#mapModal").modal();
				
			}
			
		},
		
		hideModal:function()
		{
		    // Using a very general selector - this is because $('#modalDiv').hide
		    // will remove the modal window but not the mask
		    $('.modal.in').modal('hide');
		},
		
		initParamPage: function(){
			
			$(".day_in_month").each(function(i, obj){				
				
				var id = obj.getAttribute('id');
				
				for(var i=1; i<=31 ;i++){
					
					$('#'+id).append($("<option></option>").attr("value",i).text(i));
					
				}
				
			});
			
			$(".day_in_year").each(function(i, obj){				
				
				var id = obj.getAttribute('id');
				
				for(var i=1; i<=366 ;i++){
					
					$('#'+id).append($("<option></option>").attr("value",i).text(i));
					
				}
				
			});
			
			$(".year").each(function(i, obj){				
				
				var id = obj.getAttribute('id');
				
				var currentyear = new Date().getFullYear();
				
				for(var i=1900; i<=currentyear;i++){
					
					$('#'+id).append($("<option></option>").attr("value",i).text(i));
					
				}
				
			});
			
			$(".hour").each(function(i, obj){				
				
				var id = obj.getAttribute('id');
				
				var currentyear = new Date().getFullYear();
				
				for(var i=0; i<=23;i++){
					
					$('#'+id).append($("<option></option>").attr("value",i).text(i));
					
				}
				
			});
			
			$(".bool").each(function(i, obj){				
				
				var id = obj.getAttribute('id');
				
				var currentyear = new Date().getFullYear();
				
				$('#'+id).append($("<option></option>").attr("value","true").text("true"));
				
				$('#'+id).append($("<option></option>").attr("value","false").text("false"));
				
			});
			
			$(".daylist").each(function(i, obj){				
				
				var id = obj.getAttribute('id'); //multiselect id
				
			    var inputid = id.replace(/\multiselect_/g, 'input_'); //input id
				
				for(var i=1; i<=366;i++){
					
					$('#'+id).append($("<option></option>").attr("value",i).text(i));
					
				}
				
				$('#'+id).multiselect({
				    numberDisplayed: 1,
				    includeSelectAllOption: true,
				    allSelectedText: 'All Days selected',
				    nonSelectedText: 'No Days selected',
				    selectAllValue: 'all',
				    selectAllText: 'Select all',
				    unselectAllText: 'Unselect all',
				    onSelectAll: function(checked) {
					      var all = $('#'+id+' ~ .btn-group .dropdown-menu .multiselect-all .checkbox');
					      all
					      // get all child nodes including text and comment
					        .contents()
					        // iterate and filter out elements
					        .filter(function() {
					          // check node is text and non-empty
					          return this.nodeType === 3 && this.textContent.trim().length;
					          // replace it with new text
					        }).replaceWith(checked ? this.unselectAllText : this.selectAllText);
				    },
				    onChange: function() {
//				        debugger;
					      
					      var select = $(this.$select[0]);
					      
					      var dropdown = $(this.$ul[0]);
					      
					      
					      var options = select.find('option').length;
					      
					      var selected = select.find('option:selected').length;
					      
					      var all = dropdown.find('.multiselect-all .checkbox');
					      
					      all
					      // get all child nodes including text and comment
					        .contents()
					        // iterate and filter out elements
					        .filter(function() {
					          // check node is text and non-empty
					          return this.nodeType === 3 && this.textContent.trim().length;
					          // replace it with new text
					        }).replaceWith(options === selected ? this.options.unselectAllText : this.options.selectAllText);
					      
					      //organize the selected year and write them into the input box
					      //alert(id);
					      
					      //empty the input box first
					      
					      $("#" + inputid).val("");
					      
					      //add the selected 
					      
					      var finalstr = "";
					      
					      var brands = $('#'+id+' option:selected');
					        
					      console.log(selected);
					      
					      $(brands).each(function(i, obj){
					    	  
					      	  console.log("selected day " + i +" : " + $(this).val());
					      	  
					      	  if(i!=0){
					    		  
					    		  finalstr += ",";
					    		  
					    	  }
					    	  
					    	  finalstr += $(this).val();
					    	  
					      });
					      
					      //set the string to input box
					      
					      $("#"+inputid).val(finalstr);
					      
				    }
				    
				  });
				
			});
			
			$(".yearlist").each(function(i, obj){				
				
				var id = obj.getAttribute('id'); //multiselect id
				
			    var inputid = id.replace(/\multiselect_/g, 'input_'); //input id
				
				var currentyear = new Date().getFullYear();
				
				for(var i=currentyear; i>=1900;i--){
					
					$('#'+id).append($("<option></option>").attr("value",i).text(i));
					
				}
				
				$('#'+id).multiselect({
				    numberDisplayed: 1,
				    includeSelectAllOption: true,
				    allSelectedText: 'All Years selected',
				    nonSelectedText: 'No Years selected',
				    selectAllValue: 'all',
				    selectAllText: 'Select all',
				    unselectAllText: 'Unselect all',
				    onSelectAll: function(checked) {
					      var all = $('#'+id+' ~ .btn-group .dropdown-menu .multiselect-all .checkbox');
					      all
					      // get all child nodes including text and comment
					        .contents()
					        // iterate and filter out elements
					        .filter(function() {
					          // check node is text and non-empty
					          return this.nodeType === 3 && this.textContent.trim().length;
					          // replace it with new text
					        }).replaceWith(checked ? this.unselectAllText : this.selectAllText);
				    },
				    onChange: function() {
//				        debugger;
					      
					      var select = $(this.$select[0]);
					      
					      var dropdown = $(this.$ul[0]);
					      
					      
					      var options = select.find('option').length;
					      
					      var selected = select.find('option:selected').length;
					      
					      var all = dropdown.find('.multiselect-all .checkbox');
					      
					      all
					      // get all child nodes including text and comment
					        .contents()
					        // iterate and filter out elements
					        .filter(function() {
					          // check node is text and non-empty
					          return this.nodeType === 3 && this.textContent.trim().length;
					          // replace it with new text
					        }).replaceWith(options === selected ? this.options.unselectAllText : this.options.selectAllText);
					      
					      //organize the selected year and write them into the input box
					      //alert(id);
					      
					      //empty the input box first
					      
					      $("#" + inputid).val("");
					      
					      //add the selected 
					      
					      var finalstr = "";
					      
					      var brands = $('#'+id+' option:selected');
					        
					      console.log(selected);
					      
					      $(brands).each(function(i, obj){
					    	  
					      	  console.log("selected year " + i +" : " + $(this).val());
					      	  
					      	  if(i!=0){
					    		  
					    		  finalstr += ",";
					    		  
					    	  }
					    	  
					    	  finalstr += $(this).val();
					    	  
					      });
					      
					      //set the string to input box
					      
					      $("#"+inputid).val(finalstr);
					      
				    }
				    
				  });
				
			});
			
//			date_julian, date_georgia, timestamp, year, month, day_in_year, day_in_month, hour, yearlist, datelist, hourlist, projection_in_epsg, projection_in_wkt, projection_in_proj4, boundingbox, x, y, latitude, longitude, point_coordinate, polygon, polyline, fileurl, urllist, stationid, station_name, place_name, place_id, river_name, river_id, bool, integer, string, double_number
			
		},
		
		initCronPage: function(){
			
			//initialize the minute page
			
			var selectValuesMins = {};
			
			selectValuesMins["*"] = "Every Minute (*)";
			
			for(var i=0; i<60; i++){
				
				selectValuesMins[i] = ""+ i + "th minute of the hour"; 
				
			}
			
			
			$.each(selectValuesMins, function(key, value) {   
				
			     $('#selectMinutes').append($("<option></option>").attr("value",key).text(value));
			     
			});
			
			//initialize the hour select
			
			var selectValuesHours = {};
			
			for(var i=0; i<24; i++){
				
				selectValuesHours[i] = "" + i + "th hour of the day"; 
				
			}
			
			selectValuesHours["*"] = "Every Hour (*)";
			
			$.each(selectValuesHours, function(key, value) {   
				
			     $('#selectHours').append($("<option></option>").attr("value",key).text(value)); 
			
			});
			
			//initialize the day select
			
			var selectValuesDays = {};
			
			for(var i=1; i<32; i++){
				
				selectValuesDays[i] = "" + i + "th day of the month"; 
				
			}
			
			selectValuesDays["*"] = "EveryDay (*) ";
			
			$.each(selectValuesDays, function(key, value) {   
				
			     $('#selectDay').append($("<option></option>").attr("value",key).text(value)); 
			
			});
			
			var timesList = {};
			
			for(var i=1; i<50; i++){
				
				timesList[i] = i; 
				
			}
			
			$.each(timesList, function(key, value) {   
				
			     $('#stoptimes').append($("<option></option>").attr("value",key).text(value)); 
			
			});
			
			//add listeners to the select comboboxes
			
			$('#selectMinutes').on('change', function (e) {
			    
				var optionSelected = $("option:selected", this);
			    
				var valueSelected = this.value;
			    
			    $("#minute").val(valueSelected);
				
			});
			
			$("#selectHours").on('change', function (e) {
			    
				var optionSelected = $("option:selected", this);
			    
				var valueSelected = this.value;
			    
			    $("#hour").val(valueSelected);
				
			});
			
			$("#selectDay").on('change', function (e) {
			    
				var optionSelected = $("option:selected", this);
			    
				var valueSelected = this.value;
			    
			    $("#day").val(valueSelected);
				
			});
			
			$("#selectMonth").on('change', function (e) {
			    
				var optionSelected = $("option:selected", this);
			    
				var valueSelected = this.value;
			    
			    $("#month").val(valueSelected);
				
			});
			
			$("#selectWeekday").on('change', function (e) {
			    
				var optionSelected = $("option:selected", this);
			    
				var valueSelected = this.value;
			    
			    $("#weekday").val(valueSelected);
				
			});
			
			
			
			//add change listeners to the common setting select
			
			$("#selectcommon").on("change", function(e){
				
				var optionSelected = $("option:selected", this);
			    
				var valueSelected = this.value;
			    
				if("onetime" == valueSelected){
					
					cc.order.disableCron();
					
				}else if("everyday" == valueSelected){
					
					cc.order.enableCron();
					
					//2:30 am every day
					
					$("#minute").val("30");
					
					$("#hour").val("2");
					
					$("#day").val("*");
					
					$("#month").val("*");
					
					$("#weekday").val("*");
					
				}else if("everyweek" == valueSelected){
					
					cc.order.enableCron();

					//8:05 am every Saturday
					
					//5 8 * * 6 
					
					$("#minute").val("5");
					
					$("#hour").val("8");
					
					$("#day").val("*");
					
					$("#month").val("*");
					
					$("#weekday").val("6");
					
				}else if("everymonth" == valueSelected){
					
					cc.order.enableCron();
					
					//2:00 am every first day in a month
					
					//0 2 1 * * 
					
					$("#minute").val("0");
					
					$("#hour").val("2");
					
					$("#day").val("1");
					
					$("#month").val("*");
					
					$("#weekday").val("*");
					
				}
				
			});
			
		},
		
		disableCron: function(){
			
			$("#minute").val("");
			
			$("#minute").attr('disabled','disabled');
			
			$("#hour").val("");
			
			$("#hour").attr('disabled', 'disabled');
			
			$("#day").val("");
			
			$("#day").attr("disabled", "disabled");
			
			$("#month").val("");
			
			$("#month").attr("disabled", "disabled");
			
			$("#weekday").val("");
			
			$("#weekday").attr("disabled", "disabled");
			
			$("#selectMinutes").val("");
			
			$("#selectMinutes").attr("disabled", "disabled");
			
			$("#selectHours").val("");	
			
			$("#selectHours").attr("disabled", "disabled");
			
			$("#selectDay").val("");	
			
			$("#selectDay").attr("disabled", "disabled");
			
			$("#selectMonth").val("");	
			
			$("#selectMonth").attr("disabled", "disabled");
			
			$("#selectWeekday").val("");	
			
			$("#selectWeekday").attr("disabled", "disabled");
			
		},
		
		enableCron: function(){
			
			$("#minute").removeAttr('disabled');
			
			$("#hour").removeAttr('disabled');
			
			$("#day").removeAttr('disabled');
			
			$("#month").removeAttr('disabled');
			
			$("#weekday").removeAttr('disabled');
			
			$("#selectMinutes").removeAttr('disabled');
			
			$("#selectHours").removeAttr('disabled');
			
			$("#selectDay").removeAttr('disabled');
			
			$("#selectMonth").removeAttr('disabled');
			
			$("#selectWeekday").removeAttr('disabled');
			
		},
		
		getTerminationStr: function(){
	  		
			var str = [];
			
			var term =  $("input[name='termination']:checked").val();
			
			str.push(term);
			
			if(term==1){
				
				var date = $("#bdtv").val();
				
				str.push(date);
				
			}else if(term==2){
				
				var times = $("#stoptimes").val();
				
				str.push(times);
				
			}else if(term==3){
				
				//never stop, add nothing
				
			}
			
	  		var astr = str.join(" ");
	  		
	  		return astr;
	  		
	  	},
		
		getCronStr: function(){
			
			var selectedValue = $( "#selectcommon option:selected" ).text();
			
			console.log("The selected ratio value is : " + selectedValue);
			
			var cronconfig = "";
			
			if("onetime" == selectedValue){
				
				//do nothing
				
				cronconfig = null;
				
			}else{
				
				cronconfig += $("#minute").val();
				
				cronconfig += " " + $("#hour").val();
				
				cronconfig += " " + $("#day").val();
				
				cronconfig += " " + $("#month").val();
				
				cronconfig += " " + $("#weekday").val();
				
			}
			
			console.log("The generated string is : " + cronconfig);
			
			return cronconfig;
			
		},
		
		//**********************************************//
    	// Initialize Leaflet Map
		
		initializeMap: function(){
	  		
    		var mymap = L.map('mapid').setView([36, -78], 13);
    		
    		var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    		
    		var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
    		
    		var osm = new L.TileLayer(osmUrl, {attribution: osmAttrib});		

    		// start the map in South-East England
    		//mymap.setView(new L.LatLng(-78, 36),9);
    		
    		var southWest = new L.LatLng(cc.order.north, cc.order.east),
    		
				    northEast = new L.LatLng(cc.order.south, cc.order.west),
			
				    bounds = new L.LatLngBounds(southWest, northEast);
	
			mymap.fitBounds(bounds);
			
			var boundingBox = L.rectangle(bounds, {color: "#ff7800", weight: 1});
    		
    		mymap.addLayer(boundingBox);
	
    		mymap.addLayer(osm);
	  		
	  	},
	  	
	  	
    	
		initializeMap2: function(divid){
	  		
    		var mymap = L.map(divid).setView([36, -78], 13);
    		
    		var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    		
    		var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
    		
    		var osm = new L.TileLayer(osmUrl, {attribution: osmAttrib});		
    		
//    		var southWest = new L.LatLng(cc.order.north, cc.order.east),
//    		
//				    northEast = new L.LatLng(cc.order.south, cc.order.west),
//			
//				    bounds = new L.LatLngBounds(southWest, northEast);
	
//			mymap.fitBounds(bounds);
    		
    		mymap.addLayer(osm);
    		
    		mymap.fitWorld();
    		
    		cc.order.paramMapList.push(mymap);
    		
    		console.log("Resize the leaflet map of parameters.");
    		
    		mymap.invalidateSize(true);
	  		
	  	},
	  	
	  	
        
        initNavButton: function(){
        	
        	$('.btnNext').click(function(){
            	
            	//alert("next page is activated");
            	
            	var link = $('.bootstrapWizard > .active').find('a').attr("href");
            	
            	//alert("Link : " + link);
            	
            	if(link == "#tab2"){
            		 
            		//check if the input is null
            		
            		for (var i = 0; i < cc.order.theList.length; i++) {
            			
            			var ename = cc.order.theList[i].ename;
            			
            			console.log("Name : " + ename);
            			
            			var inputfield = $("#input_" + ename);
            			
            			console.log("Input field value : " + inputfield.val());
            			
            			if(inputfield.val().length < 1){
            				
            				alert("The input parameter " + name + " needs value. ");
            				
            				inputfield.focus();
            				
            				cc.order.isReviewed = false;
            				
            				return;
            				
            			}
            			
            		}
            		
            		//set the input values to the fields on the tab3
            		
            		for (var i = 0; i < cc.order.theList.length; i++) {
            			
            			var ename = cc.order.theList[i].ename;
            			
            			var inputfield = $("#input_" + ename);
            			
            			var reviewfield = $("#value_" + ename);
            			
            			reviewfield.text(inputfield.val());
            			
            			cc.order.valueList.push(inputfield.val());
            			
            		}
            		
    	        	cc.order.isReviewed = true;
            		
            	}else if(link == "#tab3"){
            		
            		var reviewfield1 = $("#cron");
        			
            		var cronconfig = cc.order.getCronStr();
            		
            		console.log(cronconfig);
            		
        			reviewfield1.text(cronconfig);
        			
        			var reviewfield2 = $("#termination");
        			
        			var term = cc.order.getTerminationStr();
        			
        			console.log(term);
        			
        			reviewfield2.text(term);
            		
            	}else if(link == "#tab4"){
            		
            		if(cc.order.isReviewed){
            			
            			cc.order.isConfirmed = true;
            			
            		}else{
            			
            			return;
            			
            		}
            		
            	}else if(link == "#tab5"){
            		
            		//alert("enter the tab4");
            		
            		if(cc.order.isReviewed&&cc.order.isConfirmed){
            			
            			//go ahead, submit the order
            			
            			BootstrapDialog.show({
            			    
            				title: 'Alert',
            			    
            			    message: 'Are you sure to submit this order?',
            			    
            			   	buttons: [{
            			        
            			    	id: 'btn-cancel',   
            			        
            			        icon: 'glyphicon glyphicon-remove',       
            			        
            			        label: 'NO',
            			        
            			        cssClass: 'btn-primary', 
            			        
            			        autospin: false,
            			        
            			        action: function(dialogRef){    
            			        
            			        	dialogRef.close();
            			        
            			        }
            			    
            			    }, {
            			        
            			    	id: 'btn-ok',   
            			        
            			        icon: 'glyphicon glyphicon-check',       
            			        
            			        label: 'Yes',
            			        
            			        cssClass: 'btn-primary', 
            			        
            			        autospin: false,
            			        
            			        action: function(dialogRef){
            			        	
            			        	this.prop("disabled", true); //prevent multiple times of submit
            			        	
            			        	var method = "post"; // Set method to post by default if not specified.
    								
            					    // The rest of this code assumes you are not using a library.
            					    // It can be made less wordy if you use one.
            					    
            					    var form = document.createElement("form");
            					    
            			        	form.setAttribute("method", method);
            					    
            					    form.setAttribute("action", "placeorder");
            					    
            					    for(var i=0; i<cc.order.theList.length; i++){
            					    	
            					    	var inparameter = cc.order.theList[i];
            					    	
            					    	var inputele = document.createElement("input");
    	        					    
            					    	inputele.type = "hidden";
    	        		                
            					    	inputele.name = inparameter.key;
    	        		                
            					    	inputele.value = cc.order.valueList[i];
            					    	
            					    	//inputele.value = $("#input_" + name).val();
            					    	
            					    	console.log("Final value for parameter" + name + " is : " + inputele.value);
    	        		                
    	        		                form.appendChild(inputele);
            					    	
            					    }
            					    
            					    //add product id 
            					    
            					    var inputele = document.createElement("input");
    	        					    
        					    	inputele.type = "hidden";
            		                
        					    	inputele.name = "productid";
            		                
        					    	inputele.value = cc.order.productid;
        					    	
        					    	console.log("Final value for productid is : " + inputele.value);
            		                
            		                form.appendChild(inputele);
            		                
            		                var cronele = document.createElement("input");
    	        					    
            		                cronele.type = "hidden";
            		                
            		                cronele.name = "cron";
            		                
            		                cronele.value = cc.order.getCronStr();
        					    	
        					    	console.log("Cron Configuration is : " + cronele.value);
            		                
            		                form.appendChild(cronele);
            		                
            		                var termele = document.createElement("input");
	        					    
            		                termele.type = "hidden";
            		                
            		                termele.name = "termination";
            		                
            		                termele.value = cc.order.getTerminationStr();
        					    	
        					    	console.log("Termination Configuration is : " + termele.value);
            		                
            		                form.appendChild(termele);
            		                
            		                //the form is ready
            					    
            					    document.body.appendChild(form);
            					    
            					    form.submit();
            					    
            			        }
            			    }]
            			});
            			
            		}else{
            			
            			BootstrapDialog.show({
            			
            				title: 'Alert',
            			    
            				message: 'You order is incomplete.',
            			    
            				buttons: [{
            			    
            					id: 'btn-cancel',   
            			        
            					icon: 'glyphicon glyphicon-check',       
            			        
            					label: 'OK',
            			        
            					cssClass: 'btn-primary', 
            			        
            					autospin: false,
            			        
            					action: function(dialogRef){    
            			        
            						dialogRef.close();
            			    
            					}
            				
            			    }]
            			
            			});
            			
            			return;
            			
            		}
            		
            	}
            	
            	$('.bootstrapWizard > .active').next('li').find('a').trigger('click');

            	
            });
            
        	$('.btnPrevious').click(function(){
        			
        		//alert("previous page is activated.");
        		
        		$('.bootstrapWizard > .active').prev('li').find('a').trigger('click');
        	
        	});
        	
        },
    	
		done: function(result,status,xhr){
			
			console.log("The request is processed.");
			
			if(!result){
//				result = result.trim();
			
				alert("The result is null.");
				
				return;
			
			}else{
			
				result = result.trim();
			
			}
			
			if(result.indexOf("Failure")==0){
				//failed
			
				console.log("Failed");
				
				$("#checkresult").html("<tr><td>Error</td><td><p>"+result+"</p></td></tr>");
				
				if(!cc.util.isVisible("tablecontainer"))
				
					$("#tablecontainer").toggleClass('show')
			
			}else{
				//real success
				var status = JSON.parse(result);
//				<tr>
	//		        <td>John</td>
	//		        <td>Doe</td>
	//		      </tr>
				console.log("Succeed");
				$("#checkresult").html("<tr><td>Status</td><td>"+status.status+"</td></tr>"+
							"<tr><td>Message</td><td>"+status.message+"</td></tr>"+
							"<tr><td>Order Time</td><td>"+status.ordertime+"</td></tr>"+
							"<tr><td>Updated Time</td><td>"+status.updatetime+"</td></tr>"+
							"<tr><td>Process Begin Time</td><td>"+status.begintime+"</td></tr>"+
							"<tr><td>Process End Time</td><td>"+status.endtime+"</td></tr>"
							);
				if(!cc.util.isVisible("tablecontainer"))
					$("#tablecontainer").toggleClass('show');
//				$("#status").html(result.status);
//				$("#message").html(result.message);
			}
			//cc.button.pageRecover();
		},
		
		fail: function(xhr, status, error){
			$("#checkresult").html("<p>Error: "+error+"</p>");
		},
		
		query: function(ordernumber){
			var req = "ordernumber="+ordernumber;
			cc.util.sendPostRequest(cc.util.getServletURL(5), req ,cc.order.done, cc.order.fail);
		}
		
}