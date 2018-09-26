/**
 * 
 * Search in CSW
 * 
 * @author Z.S.
 * 
 * @date 2017-06-21
 * 
 */
cc.search={

		init: function(){
			
		},
		
		// Initialize Leaflet Map
		
		initializeMap: function(mapid, west, east, south, north){
    		
    		//if(!$("#"+mapid).length)
    		//	return;
    		
    		$("#"+mapid).height("150px");
	  		
    		//render the leaflet maps of all the products 
    		
    		var mymap = L.map(mapid).setView([36, -78], 13);
    		
    		var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    		
    		var osmAttrib='© <a href="http://openstreetmap.org">OSM</a>';
    		
    		var osm = new L.TileLayer(osmUrl, {attribution: osmAttrib});	
				    		
    		mymap.addLayer(osm);
			
    		// start the map in South-East England
    		//mymap.setView(new L.LatLng(-78, 36),9);
    		
    		if(north-south==0 && east-west==0){
    			
    			//var newpoint = L.circle(ne, {radius: 5});
    			
    			//mymap.addLayer(newpoint);
    			
    			L.marker([north, east]).addTo(mymap);
    			
    			mymap.setView([north, west], 13);
    			
    		}else{
    			
    			var southWest = new L.LatLng(north, east),
    			
			    northEast = new L.LatLng(south, west),
			    
			    bounds = new L.LatLngBounds(southWest, northEast);
		
	    		mymap.fitBounds(bounds);
	    		
	    		var boundingBox = L.rectangle(bounds, {color: "#ff7800", weight: 1});
	    		
	    		mymap.addLayer(boundingBox);
    			
    		}
	  		
	  	},
    	
	  	like: function (id){
    		
    		var btnid = id;
    		
    		console.log("Like button is clicked :" + btnid );
    		
    		var cid = btnid.split("_")[1];
    		
    		$.ajax({ 
				
				async: true, 
				
				type : "POST", 
				
				url : "productlike", 
				
				dataType : 'json', 
				
				data: {"pid" : cid},
				
				success : function(data) {
					 
					console.log("Get response" + data.likes);
					
					console.log("likes_" + cid);
					
					$("#likes_" + cid).html(data.likes);
					
				},
				
				error: function(xhr, msg, e){
					
					console.error("get wrong response" + msg + " " + e);
					
					BootstrapDialog.show({
						
						title: 'Alert',
	    			    
	    				message: "Sorry you are unable to like this product right now",
	    			    
	    				buttons: [{
	    			        
	    			    	id: 'btn-cancel',   
	    			        
	    			        icon: 'glyphicon glyphicon-remove',       
	    			        
	    			        label: 'CANCEL',
	    			        
	    			        cssClass: 'btn-primary', 
	    			        
	    			        autospin: false,
	    			        
	    			        action: function(dialogRef){    
	    			        
	    			        	dialogRef.close();
	    			        
	    			        }
	    			    
	    			    },{
	    			    
	    					id: 'btn-ok',   
	    			        
	    					icon: 'glyphicon glyphicon-check',       
	    			        
	    					label: 'OK',
	    			        
	    					cssClass: 'btn-primary', 
	    			        
	    					autospin: false,
	    			        
	    					action: function(dialogRef){    
	    			        
	    						dialogRef.close();
	    						
	    					}
	    				
	    			    }]
						
					});
					
				}
				
			});
			
    	},
		
    	view: function (theproduct){
			
			var tablecontent = "<div>";
			
			tablecontent += "  <div class=\"form-group\">\n";
		    
		    tablecontent += "    <label class=\"col-md-4 control-label\" >Name</label>";
		    
		    tablecontent += "    <label class=\"col-md-8 control-content\" style=\"word-wrap: break-word;word-break: break-all;\" >"+theproduct.name+"</label>";
		    
		    tablecontent += "  </div>";
		    
			tablecontent += "  <div class=\"form-group\">\n";
		    
		    tablecontent += "    <label class=\"col-md-4 control-label\" >Description</label>";
		    
		    tablecontent += "    <label class=\"col-md-8 control-content\" style=\"word-wrap: break-word;word-break: break-all;\"  >"+theproduct.desc+"</label>";
		    
		    tablecontent += "  </div>";
		    
            tablecontent += "  <div class=\"form-group\">\n";
		    
		    tablecontent += "    <label class=\"col-md-4 control-label\" >Keywords</label>";
		    
		    tablecontent += "    <label class=\"col-md-8 control-content\"  >"+theproduct.keywords+"</label>";
		    
		    tablecontent += "  </div>";
		    
            tablecontent += "  <div class=\"form-group\">\n";
		    
		    tablecontent += "    <label class=\"col-md-4 control-label\" >Identifier</label>";
		    
		    tablecontent += "    <label class=\"col-md-8 control-content\" style=\"word-wrap: break-word;word-break: break-all;\"  >"+theproduct.id+"</label>";
		    
			tablecontent += "  <div class=\"form-group\">\n";
		    
		    tablecontent += "    <label class=\"col-md-4 control-label\" >Begin Time</label>";
		    
		    tablecontent += "    <label class=\"col-md-8 control-content\" style=\"word-wrap: break-word;word-break: break-all;\"  >"+theproduct.begintime+"</label>";
		    
		    tablecontent += "  </div>";
		    
			tablecontent += "  <div class=\"form-group\">\n";
		    
		    tablecontent += "    <label class=\"col-md-4 control-label\" >End Time</label>";
		    
		    tablecontent += "    <label class=\"col-md-8 control-content\" style=\"word-wrap: break-word;word-break: break-all;\"  >"+theproduct.endtime+"</label>";
		    
		    tablecontent += "  </div>";
		    
		    if(theproduct.isspatial == "1"){
		    	
		    	tablecontent += "  <div class=\"form-group\">\n";
			    
			    tablecontent += "    <label class=\"col-md-4 control-label\" >East</label>";
			    
			    tablecontent += "    <label class=\"col-md-8 control-content\" style=\"word-wrap: break-word;word-break: break-all;\"  >"+theproduct.east+"</label>";
			    
			    tablecontent += "  </div>";
			    
				tablecontent += "  <div class=\"form-group\">\n";
			    
			    tablecontent += "    <label class=\"col-md-4 control-label\" >West</label>";
			    
			    tablecontent += "    <label class=\"col-md-8 control-content\" style=\"word-wrap: break-word;word-break: break-all;\"  >"+theproduct.west+"</label>";
			    
			    tablecontent += "  </div>";
			    
				tablecontent += "  <div class=\"form-group\">\n";
			    
			    tablecontent += "    <label class=\"col-md-4 control-label\" >North</label>";
			    
			    tablecontent += "    <label class=\"col-md-8 control-content\" style=\"word-wrap: break-word;word-break: break-all;\"  >"+theproduct.north+"</label>";
			    
			    tablecontent += "  </div>";
			    
			    tablecontent += "  <div class=\"form-group\">\n";
			    
			    tablecontent += "    <label class=\"col-md-4 control-label\" >South</label>";
			    
			    tablecontent += "    <label class=\"col-md-8 control-content\" style=\"word-wrap: break-word;word-break: break-all;\"  >"+theproduct.south+"</label>";
			    
			    tablecontent += "  </div>";
		    	
		    }
		    
            tablecontent += "  <div class=\"form-group\">\n";
		    
		    tablecontent += "    <label class=\"col-md-4 control-label\" >Projection</label>";
		    
		    tablecontent += "    <label class=\"col-md-8 control-content\" >"+theproduct.srs+"</label>";
		    
		    tablecontent += "  </div>";
		    
            tablecontent += "  <div class=\"form-group\">\n";
		    
		    tablecontent += "    <label class=\"col-md-4 control-label\" >If Virtual</label>";
		    
		    tablecontent += "    <label class=\"col-md-8 control-content\" >"+theproduct.ifvirtual+"</label>";
		    
		    tablecontent += "  </div>";
		    
            tablecontent += "  <div class=\"form-group\">\n";
		    
		    tablecontent += "    <label class=\"col-md-4 control-label\" >Format</label>";
		    
		    tablecontent += "    <label class=\"col-md-8 control-content\" >"+theproduct.format+"</label>";
		    
		    tablecontent += "  </div>";
		    
            tablecontent += "  <div class=\"form-group\">\n";
		    
		    tablecontent += "    <label class=\"col-md-4 control-label\" >Last Update</label>";
		    
		    tablecontent += "    <label class=\"col-md-8 control-content\" >"+theproduct.lastupdate+"</label>";
		    
		    tablecontent += "  </div>";
			
			tablecontent += "</div>";
			
			BootstrapDialog.show({
				
				title: 'Information',
			    
				message: $(tablecontent),
			    
				buttons: [{
			        
			    	id: 'btn-cancel',   
			        
			        icon: 'glyphicon glyphicon-remove',       
			        
			        label: 'CANCEL',
			        
			        cssClass: 'btn-primary', 
			        
			        autospin: false,
			        
			        action: function(dialogRef){    
			        
			        	dialogRef.close();
			        
			        }
			    
			    },{
			    
					id: 'btn-ok',   
			        
					icon: 'glyphicon glyphicon-check',       
			        
					label: 'OK',
			        
					cssClass: 'btn-primary', 
			        
					autospin: false,
			        
					action: function(dialogRef){    
			        
						dialogRef.close();
						
					}
				
			    }]
				
			});
			
        },
        
        cache: function(id, name, accessurl){
        	
        	$("#cachebtn_"+id).button("loading");
        	
        	cc.util.sendPostRequest(
        			
        			"cache",
        			
        			"id="+name+"&data="+ accessurl,
        			
        			function(data, status){
        				
//        				var dataobj = $.parseJSON(data);
        				
        				//$("#cachebtn_"+id).button("reset");
        				
        				alert("Cached. The new link is updated in CSW");
        				
    					$("#cachebtn_"+id).button('reset');
    				    
    					setTimeout(function() {//  short delay after reset
    				    	
    				    	$("#cachebtn_"+id).prop('disabled', true);

    				    }, 200);
        				
        			},
        			
        			function(){
        				
        				alert("Cache failed.");
        				
        				$("#cachebtn_"+id).button("reset");
        				
        			},
        			
        			function(){
        				
        			}
        			
        	);
        	
        },
        /**
         * Jump to advanced order page
         */
        advancedOrder: function(){
        	
        	
        	if(cc.product.fileinputnum==0){
        		
        		if (confirm("Warning: you haven't chosen any parameter to use the search data. Your order on this VDP will have nothing related to the searched data. Are you sure to proceed?")) {
        		    
        			// continue
        			
        		} else {
        		    
        			return;
        			
        		}
        		
        	}
        	
        	var loc = "productorder?pid="+cc.product.selected_productid;
        	
			var keylist = [], valuelist = []; 
			
			$("#otherparams :input[type=text]").each(function(){
				
				if($(this).val() ){
					
					keylist.push($(this).attr("key"));
					
					valuelist.push($(this).val());
					
				}
				
			});
			
			//construct a hidden order URL 
			
        	for(var i = 0, len = keylist.length; i < len; i++) {
        	    
        		var k = keylist[i];
        	    
        		var val = valuelist[i];
        	    
        		loc += "&" + k + "=" + val;
        	
        	}
        	
        	window.open(loc, '_blank');
        	
        },
        
        /**
         * Transform data to VDP
         * @param id
         * @param accessurl
         */
        transform: function(id, accessurl){
        	
        	cc.product.current_data_url = accessurl;
        	
        	var check = cc.util.checklog();
        	
        	if(check!=null&&check.login){
        		
        		//pop up a dialog to select VDP
            	
            	var vdpselect =  "<div class=\"row\">";
    			
            	vdpselect +=  "<div class=\"col-md-1\"></div>";
            	
            	vdpselect += "  <div class=\"form-group col-md-10\">\n";
    		    
            	vdpselect += "<div class=\"row\">";
            	
            	vdpselect += "<label class=\"col-md-3 control-label pull-left\" for=\"product_list\">select a VDP : </label>";
            	
            	vdpselect += "<select class=\"col-md-9\"  class=\"form-control\" id=\"product_list\" >";
            	
            	vdpselect += "<option></option>";
            	
            	vdpselect += "</select>";
            	
            	vdpselect += "</div>";
            	
            	vdpselect += "<hr/>";
            	
            	vdpselect += "<div class=\"row\" id=\"otherparams\">";
            	
            	vdpselect += " </div>";
    		    
            	vdpselect += "</div>";
            	
            	vdpselect +=  "<div class=\"col-md-1\"></div>";
            	
            	vdpselect += "</div>";
            	
            	BootstrapDialog.show({
        			
    				title: 'Select Target VDP to Transform',
    			    
    				message: vdpselect,
    				
    				onshown: function(dialogRef){
    					
    					//once the dialog is rendered, fetch the product list
    		        	
    					cc.product.initSelector4Dialog();
    					
    	            },
    			    
    				buttons: [{
    			        
    			    	id: 'btn-cancel',   
    			        
    			        icon: 'glyphicon glyphicon-remove',       
    			        
    			        label: 'Cancel',
    			        
    			        cssClass: 'btn-primary', 
    			        
    			        autospin: false,
    			        
    			        action: function(dialogRef){    
    			        
    			        	dialogRef.close();
    			        
    			        }
    			    
    			    },{
    			    	
    			    	id: 'btn-advanced',   
    			        
    			        icon: 'glyphicon glyphicon-check',       
    			        
    			        label: 'Advanced',
    			        
    			        cssClass: 'btn-primary', 
    			        
    			        autospin: false,
    			        
    			        action: function(dialogRef){    

    			        	if(cc.product.selected_productid==null){
    			        		
    			        		alert("You must select a VDP first!");
    			        		
    			        		return;
    			        		
    			        	}
    			        	
    			        	cc.search.advancedOrder();
    			        	
    			        	dialogRef.close();
    			        	
    			        	cc.product.reset();
    			        
    			        }
    			    	
    			    },{
    			    
    					id: 'btn-ok',   
    			        
    					icon: 'glyphicon glyphicon-check',       
    			        
    					label: 'Instant Order',
    			        
    					cssClass: 'btn-primary', 
    			        
    					autospin: false,
    			        
    					action: function(dialogRef){    
    			        
    						if(cc.product.selected_productid==null){
    			        		
    			        		alert("You must select a VDP first!");
    			        		
    			        		return;
    			        		
    			        	}
    						
    						//make sure the values are filled
    						
    						var iscomplete = true;
    						
    						var keylist = [], valuelist = []; 
    						
    						$("#otherparams :input[type=text]").each(function(){
    							
    							if(!$(this).val() ){
    								
    								iscomplete = false;
    								
    								return;
    								
    							}
    							
    							keylist.push($(this).attr("key"));
    							
    							valuelist.push($(this).val());
    							
    						});
    						
    						if(!iscomplete){
    							
    							alert("The parameter values are incomplete!");
    							
    							return;
    							
    						}
    						
    						dialogRef.close();
    						
    						//construct a order request and send 
    						
    						var req = [];
    						
    		            	for(var i = 0, len = keylist.length; i < len; i++) {
    		            	    
    		            		var k = keylist[i];
    		            	    
    		            		var val = valuelist[i];
    		            	    
    		            		if(i!=0){
    		            	    
    		            			req.push("&");
    		            	    
    		            		}
    		            	    
    		            		req.push(k);
    		            	    
    		            		req.push("=");
    		            	    
    		            		req.push(val);
    		            	
    		            	}
    		            	
    		            	req.push("&productid=");
    		            	
    		            	req.push(cc.product.selected_productid);
    		            	
    		            	cc.product.retrievedata(req);
    			    
    					}
    				
    			    }]
    			
    			});
        		
        	}else{
        		
        		BootstrapDialog.show({
        			
    				title: 'Alert',
    			    
    				message: "You must log in to use this button.",
    				
    				buttons: [{
    			    
    					id: 'btn-ok',   
    			        
    					icon: 'glyphicon glyphicon-check',       
    			        
    					label: 'Got it',
    			        
    					cssClass: 'btn-primary', 
    			        
    					autospin: false,
    			        
    					action: function(dialogRef){    
    			        
    						dialogRef.close();
    			    
    					}
    				
    			    }]
    			
    			});
        		
        	}
        	
        },
        
        //initialized the table
        
        initTable: function(request){
        	
        	//var currentRecList = [];
            
            $('#producttable').DataTable({
            	
                "processing": true,
                
                "serverSide": true,
                
                "ajax": {
                
                	//{'begindatetime':'1900-01-01T00:00:00','csw':'1','desc':false,'distime':false,'east':-16.875,'enddatetime':'2017-06-15T00:00:00','formats':null,'isvirtual':'0','keywords':false,'name':true,'north':57.326521225217064,'pageno':1,'recordsperpage':5,'searchtext':'bufr','south':7.013667927566642,'west':-154.3359375};
                	
                	"url": "search",
                    
                	"type": "POST",
                	
                	"data": request,
                	
                	"dataSrc" : "products"
                
                },
                
                "columnDefs": [
                 
                         { "width": "60%", "targets": 0 },
                         
                         { "width": "15%", "targets": 1 },
                         
                         { "width": "25%", "targets": 2 }
                         
                 ],
                
                "columns": [
                
                    { 
                    	
                    	"data": "id",
                        
                    	"render": function ( data, type, full, meta ) {
                        	
                    		var idcolcontent = "<h4> "+
    						"	<a href=\"#\" id=\"name_"+full.id+"\" "+
    						"		 style=\"word-wrap: break-word;word-break: break-all;\">"+full.name+"</a>"+
    						"</h4>"+
    						"<p>"+full.desc+"</p>"+
    						"<p>"+
    						"	<span text=\"\">"+full.begintime+"</span> - <span>"+full.endtime+"</span>"+
    						"</p>"+
    						"<p>"+
    						"	<button type=\"button\" id=\"likebtn_"+full.id+"\""+
    						"		class=\"btn btn-danger btn-circle\">"+
    						"		<i class=\"glyphicon glyphicon-heart\"></i><span"+
    						"			id=\"likes_"+full.id+"\" >"+full.likes+"</span>"+
    						"	</button>"+
    						"	<button type=\"button\" id=\"viewbtn_"+full.id+"\""+
    						"		class=\"btn btn-primary btn-circle\">"+
    						"		<i class=\"glyphicon glyphicon-list\"></i>"+
    						"	</button>"+
    						"</p>";
                    		
                        	return idcolcontent;
                        	
                        },
                        
                    	"target" : 0
                    	
                    },
                    
                    { 
                    	
                    	"data": "accessurl",
                        
                    	"render": function ( data, type, full, meta ) {
                        	
                    		var content =  '<p>';
    						
                    		if(full.ifvirtual=="1"){
    							
    							content += '	<a href="productorder?pid='+full.id+'" class="btn btn-default"> <span '+
    							'		class="glyphicon glyphicon-shopping-cart pull-left"></span> '+
    							'		Order '+
    							'	</a> ';
    							
    						}else{
    							
    							var escapeid = full.id.replace(/\./g, '_');
    							
    							content += '	<div class="btn-group-vertical"> '+
    							'		<a href="'+full.accessurl+'" class="btn btn-default" '+
    							'			target="_blank"> <span '+
    							'			class="glyphicon glyphicon-download-alt pull-left"></span> '+
    							'			Download '+
    							'		</a> ';

    							if(!full.cached){
    								
    								content += '<button onclick="cc.search.cache(\''+escapeid+'\', \''+full.name+'\', \''+full.accessurl+'\')" id="cachebtn_'+escapeid+'" class="btn btn-default" > '+
        							'			<i class="glyphicon glyphicon-save-file pull-left" ></i> '+
        							'			DataCache '+
        							'		</button> ';
    								
    							}
    							
    							content +='<button onclick="cc.search.transform(\''+full.name+'\', \''+full.accessurl+'\')" class="btn btn-default"> '+
    							'			<span class="glyphicon glyphicon-wrench pull-left"></span> '+
    							'			Transform '+
    							'		</button> '+
    							'	</div> '+	
    							'</p>';
    							
    						}
    						
                    		return content;
                        
                    	},
                    	
                    	"target" : 1 
                    
                    },
                    
                    { 
    					"data": "east",
                        
                    	"render": function ( data, type, full, meta ) {
                        
                    		var content;
                    		
                    		if(full.isspatial=="1"){
                    			
                    			content = '<div id="recordmap_' + full.id + '" style="height: 150px;"></div>';
                    			
                    		}else{
                    			
                    			content = '<a href="#"> <img src="../images/na.png"  class="img-responsive img-box img-thumbnail" /></a>';
                    			
                    		}
                    		
                    		return content;
                        
                    	},
                    	
                    	"target" : 2 
                    	
                   	}
                    
                ],
                
                "drawCallback": function( settings ) {
                	
                	var api = new $.fn.dataTable.Api( settings );
                	
                    console.log( 'this is a call on drawcallback' );
                    
                    //the use of aoData is dangerous and is not supported. Watch out!
                    
                    for(var i=0; i< settings.aoData.length; i++){
    	        		
    	        		var full = settings.aoData[i]._aData;
    	        		
    	        		cc.search.initializeMap("recordmap_" + full.id, full.west, full.east, full.south, full.north);
    	        		
    	        		var escapeid = full.id.replace(/\./g, '\\.');
    	        		
    	        		$("#viewbtn_" + escapeid + ", #name_" + escapeid ).click(function(){
    	        			
    	        			cc.search.view(full);
    	        			
    	        		});
    	        		
    	        		$("#likebtn_" + escapeid).click(function(){
    	        		
    	        			cc.search.like(this.id);
    	        			
    	        		});
    	        		
    	        	}
    	        	
                },
                
                "iDisplayLength": request.recordsperpage,
                
                "bLengthChange": false
            
            })
        }
        
		
}