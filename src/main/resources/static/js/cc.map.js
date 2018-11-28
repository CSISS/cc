/**
 * CyberConnector Map for selecting spatial extent (bounding box)
 * Require cc.js
 * @author Ziheng Sun
 * @date 2015.8.4 
 */
cc.map = {
		hr : false,
		hr2 : false,
		map: null,
		infowindow : null,
		bGetBBox : false,
		BBoxNorth : '', 
		BBoxSouth : '',
		BBoxWest : '',
		BBoxEast : '',
		markerLatLon : "",
		
		daterangetype:null,
		editableGrid:null,
		buffersizemap:null,
		

		map:null,
		bounds: null,
		recs: [],

		
		getBBox: function(url) {	
			hr = false;
			if (window.XMLHttpRequest) { // Mozilla, Safari,...
				hr = new XMLHttpRequest();
			} else if (window.ActiveXObject) { // IE
				try {
					hr = new ActiveXObject("Msxml2.XMLHTTP");
				} catch (e) {
					try {
						hr = new ActiveXObject("Microsoft.XMLHTTP");
					} catch (e) {}
				}
			}
			if (!hr) {
				alert('Cannot create an XMLHTTP instance.');
				return false;
			}
			hr.onreadystatechange = gotbbox;
			hr.open('GET', url, true);
			hr.send(null);
		},
		
		getCounties: function(url) {
			hr2 = false;
			if (window.XMLHttpRequest) { // Mozilla, Safari,...
				hr2 = new XMLHttpRequest();
			} else if (window.ActiveXObject) { // IE
				try {
					hr2 = new ActiveXObject("Msxml2.XMLHTTP");
				} catch (e) {
					try {
						hr2 = new ActiveXObject("Microsoft.XMLHTTP");
					} catch (e) {}
				}
			}
			if (!hr2) {
				alert('Cannot create an XMLHTTP instance.');
				return false;
			}
			
			hr2.onreadystatechange = gotcounties;
			hr2.open('GET', url, true);
			hr2.send(null);
		},

		gotbbox : function() {
			if (hr.readyState == 4) {
				if (hr.status == 200) {
					var bbox=hr.responseText.split(":");
					if (bbox[0] == "Error") alert(hr.responseText);
					else {
						bGetBBox = true;
						getElement("crs").selectedIndex = 0;
						getElement("west").value = bbox[0];
						getElement("south").value = bbox[1];
						getElement("east").value = bbox[2];
						getElement("north").value = bbox[3];
						OnNewLatLng();				
					}
				} else {
					alert('There was a problem with the request.');
				}
			}
		},

		 OnMoved:function()
		{
			var maxy,miny,maxx,minx;
			if(bGetBBox){
				maxy = BBoxNorth;
				miny = BBoxSouth; 
				minx = BBoxWest;
				maxx = BBoxEast;
			}else{
				var curGBounds = infowindow.getBounds();
				maxy = curGBounds.getNorthEast().lat();
				miny = curGBounds.getSouthWest().lat();
				maxx = curGBounds.getNorthEast().lng();
				minx = curGBounds.getSouthWest().lng(); 
			}				
			getElement("north").value = maxy;
			getElement("south").value = miny;
			getElement("east").value = maxx;
			getElement("west").value = minx;								
			infowindow.clearOverlays();	
			var rectBounds = new google.maps.LatLngBounds(new google.maps.LatLng(miny, minx),new google.maps.LatLng(maxy, maxx));
			markerLatLon = new Rectangle(rectBounds);
			infowindow.addOverlay(markerLatLon);				
		},

		 OnNewLatLng:function()
		{
			/*
			3.1	Validation four screen inputs
			3.2	If pass
				3.2.1	set four script bbox parameters
				3.2.2	set token bBBoxFromStateCounty=false;
				3.2.3	Invoke updatebbox () 
				3.2.4	Set state list and county list (Section C) to default
			*/
			var northElement = get_element("north");
			var southElement = get_element("south");
			var eastElement = get_element("east");
			var westElement = get_element("west");
			var bError = false;
			if(northElement.value.length<=0){
				alert("North value is empty, please define one value between -90 and 90 and try again.");
				bError = true;
			}
			if(southElement.value.length<=0){
				alert("South value is empty, please define one value between -90 and 90 and try again.");
				bError = true;				
			}
			if(eastElement.value.length<=0){
				alert("East value is empty, please define one value between -180 and 180 and try again.");
				bError = true;				
			}
			if(westElement.value.length<=0){
				alert("West value is empty, please define one value between -180 and 180 and try again.");
				bError = true;				
			}
			
			if(bError){
				return;
			}
			
			var tmpBBoxNorth = parseFloat(northElement.value);
			var tmpBBoxSouth = parseFloat(southElement.value);
			var tmpBBoxEast = parseFloat(eastElement.value);
			var tmpBBoxWest = parseFloat(westElement.value);
			
			if(tmpBBoxNorth<tmpBBoxSouth){
				bError = true;
				alert("The North value should be greater than South value.\nHowever, I got: North="+tmpBBoxNorth+" and South="+tmpBBoxSouth+". \nPlease modify them and try again.");
			}
			if(bError){
				return;
			}
			
			//update these four parameters
			BBoxWest = tmpBBoxWest;
			BBoxEast = tmpBBoxEast;
			BBoxNorth = tmpBBoxNorth;
			BBoxSouth = tmpBBoxSouth;
			
			//update map view and summary view, with new bbox values
			cc.map.UpdateBBox();		
		},

		 UpdateBBox:function()
		{
			/*
				7	UpdateBBox
				Upon new four script bbox parameters, to update map view and summary message
				And may need to update four screen parameters
				7.1	If four script bbox parameters are not empty (length>0)
					7.1.1	Map Overlay
						7.1.1.1	clear all overlays
						7.1.1.2	Add a new map overlay
						7.1.1.3	Update zoom level
						7.1.1.4	Recenter
					7.1.2	Summary message(Section D)
						7.1.2.1	Define new message
					7.1.3	Screen display
						7.1.3.1	If bBBoxFromStateCounty is true,
							which means this updateBBox is invoked from server script which is triggered by selecting state and county, need to update screen display(Section A, and B)
							7.1.3.1.1	define new four values
							7.1.3.1.2	Uncheck the global checkbox
				7.2	Else (being cleared)
					7.2.1	Map overlay
						7.2.1.1	Clear all overlays
						7.2.1.2	Set to default zoom level and center point
					7.2.2	Summary message
						7.2.2.1	Set empty
					7.2.3	Set state list and county list (Section C) to default
			*/

			//four values may be empty, eg. being cleared
			if(BBoxWest.length<=0 && 
					BBoxEast.length<=0 && 
					BBoxNorth.length<=0 && 
					BBoxSouth.length<=0 )
			{
				infowindow.clearOverlays();
				//infowindow.centerAndZoom(new google.maps.Point(0, 0), 16);
				infowindow.setCenter(new google.maps.LatLng(0, 0), 1);
			}else{
				//add a new overlay in google map
				//found that google map lng [-85,85]
				var disBBoxNorth = BBoxNorth;
				var disBBoxSouth = BBoxSouth; 
				var disBBoxWest = BBoxWest;
				var disBBoxEast = BBoxEast;
				if(disBBoxNorth>85){
					disBBoxNorth=85;
				}
				if(disBBoxSouth<-85){
					disBBoxSouth=-85;
				}

				var n = getNewLevel(BBoxEast,BBoxWest,BBoxNorth,BBoxSouth);
				if(BBoxWest > BBoxEast)
					infowindow.setCenter(new google.maps.LatLng((BBoxNorth+BBoxSouth)*1.0/2.0, (0.5*BBoxWest+ 0.5*BBoxEast + 180)), 16-n);
				else
					infowindow.setCenter(new google.maps.LatLng((BBoxNorth+BBoxSouth)*1.0/2.0, (BBoxWest+BBoxEast)*1.0/2.0), 16-n);
				//infowindow.setCenter(new google.maps.LatLng(45, 180), 8);
				var rectBounds = new google.maps.LatLngBounds(new google.maps.LatLng(disBBoxSouth, disBBoxWest),new google.maps.LatLng(disBBoxNorth, disBBoxEast));
				markerLatLon = new Rectangle(rectBounds);
				infowindow.addOverlay(markerLatLon);
			}
		},

		// Added by Yaxing, 01/24/2008
		 validateBBox:function(){
			var c_west, c_south, c_east, c_north;					
			c_west = parseFloat(getElement('west').value);
			c_south = parseFloat(getElement('south').value);
			c_east = parseFloat(getElement('east').value);
			c_north = parseFloat(getElement('north').value);				
			if(isNaN(c_west) || isNaN(c_south) || isNaN(c_east) || isNaN(c_north)){
				alert('BoundingBox is not valid! ');
				return false;
			}
			if((c_south >= c_north)){
				alert('BoundingBox is not valid! ');
				return false;						
			}
			return true;				
		},

		 updateProjection:function() {
			var crsselect = document.queryform.crs;
			if(crsselect.value != 'EPSG:4326')
				return;
			
			var minx = document.queryform.west.value;
			var maxx = document.queryform.east.value;
			
			var minzone = parseInt((parseFloat(minx) + 180.0)/6) + 1;
			var maxzone = parseInt((parseFloat(maxx) + 180.0)/6) + 1;

			if(minzone > 60 || minzone < 1 || maxzone > 60 || maxzone < 1) {
				for(i=0; i<crsselect.length; i++) {
					if(crsselect.options[i].value != "EPSG:4326")
						crsselect.options[i].disabled = true;
				}
			} else {
				minzone = 32600 + minzone;
				maxzone = 32600 + maxzone;
				for(i=0; i<crsselect.length; i++) {
					crs = crsselect.options[i].value;
					if(crs != "EPSG:4326") {
						utmzone = parseInt(crs.substring(5));
						if(utmzone <= maxzone && utmzone >= minzone)
							crsselect.options[i].disabled = false;
						else
							crsselect.options[i].disabled = true;
					}
				}
			}
		},

		 onProjectionChange:function() {
			// Retrieve old crs and current bbox
			var scrs = document.queryform.scrs.value;
			var tcrs = document.queryform.crs.value;
			var minx = document.queryform.west.value;
			var miny = document.queryform.south.value;
			var maxx = document.queryform.east.value;
			var maxy = document.queryform.north.value;

			// Do convertion
			var tbbox = convert_bbox(scrs, tcrs, minx, miny, maxx, maxy);
			
			// Set new bbox
			setbbox(tbbox[0], tbbox[1], tbbox[2], tbbox[3]);
			document.queryform.scrs.value = tcrs;
		},

		 setbbox:function(minx, miny, maxx, maxy) {
			getElement('west').value = minx;
			getElement('south').value = miny;
			getElement('east').value = maxx;
			getElement('north').value = maxy;
			return true;
		},

		 showLoadImage:function(visible) {
			if(visible)
				getElement('loadimg_div').display = 'block';
			else
				getElement('loadimg_div').display = 'none';
		},
		
		addListener: function(){
			if (window.addEventListener)
				window.addEventListener("load", staticbar, false);
			else if (window.attachEvent)
				window.attachEvent("onload", staticbar);
			else if (getElement)
				window.onload=staticbar;
		},
		
		igfdsQuery: function() {
		        //check if all the required information are defined
		        //updated by ziheng - 4/4/2014 - add the consistency check for the query sentence
		        if(document.queryform.nlArea.value==""||document.queryform.nlArea.value=="Find"){
		            alert("The rule for feature discovery is null.");
		            return;
		        }
		        if( document.getElementById('north').value==""){
		            alert("North coordinate is null");
		            return;
		        }
		        if(document.getElementById('east').value==""){
		            alert("North coordinate is null");
		            return;
		        }
		        if(document.getElementById('west').value==""){
		            alert("West coordinate is null");
		            return;
		        }
		        if(document.getElementById('south').value==""){
		            alert("South coordinate is null");
		            return;
		        }
		        if(document.getElementById('bdtv').value==""){
		            alert("Begin time is null");
		            return;
		        }
		        if(document.getElementById('edtv').value==""){
		            alert("End time is null");
		            return;
		        }
			//setCookies();
			//alert(queryform.nlArea.value);
			//if (validation()) {
		       
//		        function postToURL(url, values) {
//		        values = values || {};
//		        var form = document.createElement("form");
//		        form.setAttribute("method", "POST");
//		        form.setAttribute("action",url);
//		        form.setAttribute("style","display: none")
//		        for (var i=0;i<values.length; i+=1) {
//		               var kvs = values[i].split("=>");
//		               var newinput = document.createElement("input" );
//		               newinput.setAttribute("type","hidden");
//		               newinput.setAttribute("name",kvs[0]);
//		               newinput.setAttribute("value",kvs[1]);
//		               form.appendChild(newinput);
//		        }
//		        document.body.appendChild(form);
//		        form.submit();
//		        document.body.removeChild(form);

		       //I'd best modify the request style from synchronous to asynchronous
		       //comment by ziheng - 12/2/2013

		        var form = getElement('queryform');
		         /**
		         * add the buffer size map
		         */
		        if(buffersizemap!=null){
		            var newinput = document.createElement("input" );
		            newinput.setAttribute("type","hidden");
		            newinput.setAttribute("name","buffersizemap");
		            newinput.setAttribute("value",buffersizemap.join(""));
		            form.appendChild(newinput);
		        }
		        
		        form.submit();
			//	getElement('inner_div').style.visibility='visible';
			//}
		},
		 

		onOrClick:function() {
		    var nlQuery = document.queryform.nlArea.value;
		    var nlQueryNew ;
		                   if(document.getElementById("feature2").disabled==true&&  document.getElementById("operator").disabled==true){
		                       nlQueryNew = "(" + document.queryform.feature1.value +")";
		                   }else{
		                       nlQueryNew = "(" + document.queryform.feature1.value + " " + document.queryform.operator.value + " " + document.queryform.feature2.value +")";
		                   }
		    if (nlQuery == "Find") {
		            nlQuery = nlQuery + " " + nlQueryNew;
		    }
		    else {
		            nlQuery = nlQuery + " OR " + nlQueryNew;
		    }
		    document.queryform.nlArea.value = nlQuery;
		},
		

		/**
		 * Show Google map window for bounding box selection.
		 * @author Ziheng
		 * @since 3/13/2013
		 */		
		init : function(){
		        var mapOptions = {
		          zoom: 4,
		          center: new google.maps.LatLng(36.380028,-95.067385),
		          mapTypeId: google.maps.MapTypeId.ROADMAP
		        };
		        cc.map.map = new google.maps.Map(document.getElementById('gmap'), mapOptions);
		       
		       var drawingManager = new google.maps.drawing.DrawingManager({
		            drawingMode: google.maps.drawing.OverlayType.MARKER,
		            drawingControl: true,
		            drawingControlOptions: {
		                  position: google.maps.ControlPosition.TOP_CENTER,
		                  drawingModes: [
		                    google.maps.drawing.OverlayType.RECTANGLE
		                  ]},
		             markerOptions: {
		                   icon: 'http://www.example.com/icon.png'
		             },
		             circleOptions: {
		                   fillColor: '#ffff00',
		                   fillOpacity: 1,
		                   strokeWeight: 5,
		                   clickable: false,
		                   zIndex: 1,
		                   editable: true
		               }
		        });
		        drawingManager.setMap(cc.map.map);
		        google.maps.event.addDomListener(drawingManager, 'rectanglecomplete', function(rectangle) {
		            //get the rectangle bounds
		            cc.map.recs.push(rectangle);
		            cc.map.bounds = rectangle.getBounds(); 
		            cc.map.fillinBoundingBox();
//		            //hide draw tool
//		            drawingManager.setOptions({
//		                   drawingControl: false
//		            });
//		            //disable draw tool 
//		            drawingManager.setDrawingMode(null);
		        });
		        
		        google.maps.event.addDomListener(document.getElementById('delete'), 'click', cc.map.deleteAllRecs);
		},
		
		deleteAllRecs: function(){
			for(var i=0;i<cc.map.recs.length;i++){
				cc.map.deleteOneRect(cc.map.recs[i]);
			}
			cc.map.recs = [];
		},
		
		deleteOneRect: function(rec){
			if(rec){
				rec.setMap(null);
			}
		},
		
		 fillinBoundingBox:function(){
		    if(cc.map.bounds==null){
		        alert("Please specify the bounding box by drawing rectangle..");
		    }else{
		        var ne = cc.map.bounds.getNorthEast();
		        var sw = cc.map.bounds.getSouthWest();
		        document.getElementById('north').value = ne.lat();
		        document.getElementById('east').value = ne.lng();
		        document.getElementById('west').value = sw.lng();
		        document.getElementById('south').value = sw.lat();
		    }
		}
}