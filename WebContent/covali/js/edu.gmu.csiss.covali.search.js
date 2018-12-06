/**
* 
* All the methods related to search
* 
* Author: Ziheng Sun
* Date: 06/19/2018
* 
*/

edu.gmu.csiss.covali.search = {
		
		searchdialog: null,
		
		resultdialog: null,
		
		resultDialog: function(request){
			
			this.resultdialog = BootstrapDialog.show({
				
				title: "Search Results",
				
				size: BootstrapDialog.SIZE_WIDE,
				
	            message: '<table id="producttable"'+
	            	
					'			class="table table-striped table-bordered table-list">'+
			
					'		<thead>'+
			
					'			<tr>'+
			
					'				<th class="hidden-xs col-md-7" style="word-wrap: break-word; word-break: break-all;">Product</th>'+
			
					'				<th class="col-text">Operation</th>'+
			
					'				<th class="col-text col-sm-3">Map</th>'+
			
					'			</tr>'+
			
					'		</thead>'+
			
					'		<tbody>'+
			
					'		</tbody>'+
			
					'	</table>',
	            
	            cssClass: 'dialog-vertical-center',
	            
	            onshown: function(dialog) {
	            	
	            	edu.gmu.csiss.covali.search.initTable(request);
	    	    	
	            },
	            
	            buttons: [{
	                
	                label: 'Back',
	                
	                cssClass: 'btn-warning',
	                
	                action: function(dialogItself){
	                	
	                	//go back to the search dialog
	                	
	                	dialogItself.close();
	                	
//	                	if(edu.gmu.csiss.covali.search.searchdialog==null){

		                	edu.gmu.csiss.covali.search.init();
	                		
//	                	}else{
//	                		
//		                	edu.gmu.csiss.covali.search.searchdialog.open();
//	                		
//	                	}
	                	
	                }
	            	
	            },
	            {
	                label: 'Close',
	                
	                action: function(dialogItself){
	                	
	                    dialogItself.close();
	                    
	                }
	            }]
	        });
			
		},
		
		/**
		 * Check whether the file format is supported
		 */
		checkfileformat: function(filename){
			
			return edu.gmu.csiss.covali.local.filterFormats(filename);
			
		},
		
		goto: function(url){
			
			window.open(url,'_blank');
			
		},
		
		initTable: function(request){
        	
        	//var currentRecList = [];
            
            $('#producttable').DataTable({
            	
                "processing": true,
                
                "serverSide": true,
                
                "ajax": {
                	
                	//{'begindatetime':'1900-01-01T00:00:00','csw':'1','desc':false,'distime':false,'east':-16.875,'enddatetime':'2017-06-15T00:00:00','formats':null,'isvirtual':'0','keywords':false,'name':true,'north':57.326521225217064,'pageno':1,'recordsperpage':5,'searchtext':'bufr','south':7.013667927566642,'west':-154.3359375};
                	
                	"url": "../web/search",
                    
                	"type": "POST",
                	
                	"data": request,
                	
                	"dataSrc" : "products"
                
                },
                
                "columnDefs": [
                 
                         { "width": "60%", "targets": 0 },
                         
                         { "width": "20%", "targets": 1 },
                         
                         { "width": "20%", "targets": 2 }
                         
                ],
                
                "columns": [
                
                    { 
                    	
                    	"data": "id",
                        
                    	"render": function ( data, type, full, meta ) {
                    		
                    		var desc = " ", btime = " ", etime = " ";
                    		
                    		if(full.desc!=null) desc = full.desc;
                    		
                    		if(full.begintime!=null) btime = full.begintime;
                    		
                    		if(full.endtime!=null) etime = full.endtime;
                        	
                    		var idcolcontent = "<h4> "+
    						"	<a href=\"#\" id=\"name_"+full.id+"\" "+
    						"		 style=\"word-wrap: break-word;word-break: break-all;\">"+full.name+"</a>"+
    						"</h4>"+
    						"<p>"+desc+"</p>"+
    						"<p>"+
    						"	<span text=\"\">"+btime+"</span> - <span>"+etime+"</span>"+
    						"</p>"+
    						"<p>"+
    						"	<button type=\"button\" id=\"viewbtn_"+full.id+"\""+
    						"		class=\"btn btn-primary btn-circle\">"+
    						"		<i class=\"glyphicon glyphicon-list\" title=\"View Details\"></i>"+
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
    							'		class="glyphicon glyphicon-shopping-cart pull-left" title="Order"></span> '+
//    							'		Order '+
    							'	</a> ';
    							
    						}else{
    							
    							var escapeid = full.id.replace(/\./g, '_');
    							
								content += '	<div class="btn-group-vertical"> ';
    							
    							if(full.accessurl.startsWith("http")||full.accessurl.startsWith("HTTP")){
    								
        							content += '		<button onclick="edu.gmu.csiss.covali.search.goto(\''+full.accessurl+'\')" class="btn btn-default" '+
        							' id="downbtn_'+escapeid+'"> <span '+
        							'			class="glyphicon glyphicon-download-alt pull-left" title="Download"></span> '+
        							'		</button>';
    								
    							}
    							
    							//add a button to load map
    							
    							if(edu.gmu.csiss.covali.search.checkfileformat(full.accessurl)){
    								
    								content += '		<button onclick="edu.gmu.csiss.covali.search.load(\''+escapeid+'\', \''+
        							escape(full.accessurl)+
        							'\')" class="btn btn-default" id="loadbtn_'+escapeid+'"> <span '+
        							'			class="glyphicon glyphicon-film pull-left" title="Load Map"></span> '+
        							'		</button> ';
    								
    							}
    							
    							if(!full.cached){
    								
    								content += '<button onclick="edu.gmu.csiss.covali.search.cache(\''+escapeid+'\', \''+full.name+'\', \''+full.accessurl+'\')" id="cachebtn_'+escapeid+'" class="btn btn-default" > '+
        							'			<span class="glyphicon glyphicon-save-file pull-left" title="Cache Data"></span> '+
//        							'			DataCache '+
        							'		</button> ';
    								
    							}
    							
    							content += '	</div> ';
    							
    							//disabled for now, will be enabled later when Geoweaver is online.
    							
//    							content +='<button onclick="edu.gmu.csiss.covali.search.transform(\''+full.name+'\', \''+full.accessurl+'\')" class="btn btn-default"> '+
//    							'			<span class="glyphicon glyphicon-wrench pull-left"></span> '+
//    						  //'			Transform '+
//    							'		</button> '+
//    							'	</div> '+	
//    							'</p>';
    							
    						}
                    		
                    		content += '</p>';
    						
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
                    			
                    			content = '<a href="javascript:void(0)"> <!--<img src="../images/na.png"  class="img-responsive img-box img-thumbnail" />--></a>';
                    			
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
    	        		
    	        		if ( $( "#recordmap_" + full.id ).length ) {
    	        			
    	        			edu.gmu.csiss.covali.search.initializeResultMap("recordmap_" + full.id, full.west, full.east, full.south, full.north);
    	        			
    	        		}
    	        		
    	        		var escapeid = full.id.replace(/\./g, '\\.');
    	        		
    	        		$("#viewbtn_" + escapeid + ", #name_" + escapeid ).click(function(){
    	        			
    	        			edu.gmu.csiss.covali.search.view(full);
    	        			
    	        		});
    	        		
//    	        		$("#likebtn_" + escapeid).click(function(){
//    	        		
//    	        			edu.gmu.csiss.covali.search.like(this.id);
//    	        			
//    	        		});
    	        		
    	        	}
    	        	
                },
                
                "iDisplayLength": request.recordsperpage,
                
                "bLengthChange": false
            
            })
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
        	
        	$.ajax({
				
				contentType: "application/x-www-form-urlencoded", //this is by default
				
				type: "POST",
				
				url: "../web/cachecasual",
				
				data: "id="+name+"&data="+ accessurl, 
				
				success: function(obj, text, jxhr){
					
					var resp = $.parseJSON(obj);
					
					if(resp.output=="success"){
						
						alert("Cached.");
						
						console.log("cached url is:" + resp.file_url);
						
						//change the link of the download and loading map to the new link. 
						
						var escapeid = id.replace(/\./g, '_');
						
						$('#loadbtn_' + escapeid).attr('onclick', 'edu.gmu.csiss.covali.search.load(\''+
								escapeid+'\',\''+
    							escape(resp.file_url)+'\')');
						
						$('#downbtn_' + escapeid).attr('onclick', 'edu.gmu.csiss.covali.search.goto(\''+
								escape(resp.file_url)+'\')');
					}					
					
					$("#cachebtn_"+id).button('reset');
				    
					setTimeout(function() {//  short delay after reset
				    	
				    	$("#cachebtn_"+id).prop('disabled', true);
	
				    }, 200);
					
				},
				
				fail: function(jxhr, status, error){
					
					alert("Cache failed." + error);
					
					$("#cachebtn_"+id).button("reset");
					
				}
        			
        	});
        	
        	
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
//        transform: function(id, accessurl){
//        	
//        	cc.product.current_data_url = accessurl;
//        	
//        	var check = cc.util.checklog();
//        	
//        	if(check!=null&&check.login){
//        		
//        		//pop up a dialog to select VDP
//            	
//            	var vdpselect =  "<div class=\"row\">";
//    			
//            	vdpselect +=  "<div class=\"col-md-1\"></div>";
//            	
//            	vdpselect += "  <div class=\"form-group col-md-10\">\n";
//    		    
//            	vdpselect += "<div class=\"row\">";
//            	
//            	vdpselect += "<label class=\"col-md-3 control-label pull-left\" for=\"product_list\">select a VDP : </label>";
//            	
//            	vdpselect += "<select class=\"col-md-9\"  class=\"form-control\" id=\"product_list\" >";
//            	
//            	vdpselect += "<option></option>";
//            	
//            	vdpselect += "</select>";
//            	
//            	vdpselect += "</div>";
//            	
//            	vdpselect += "<hr/>";
//            	
//            	vdpselect += "<div class=\"row\" id=\"otherparams\">";
//            	
//            	vdpselect += " </div>";
//    		    
//            	vdpselect += "</div>";
//            	
//            	vdpselect +=  "<div class=\"col-md-1\"></div>";
//            	
//            	vdpselect += "</div>";
//            	
//            	BootstrapDialog.show({
//        			
//    				title: 'Select Target VDP to Transform',
//    			    
//    				message: vdpselect,
//    				
//    				onshown: function(dialogRef){
//    					
//    					//once the dialog is rendered, fetch the product list
//    		        	
//    					cc.product.initSelector4Dialog();
//    					
//    	            },
//    			    
//    				buttons: [{
//    			        
//    			    	id: 'btn-cancel',   
//    			        
//    			        icon: 'glyphicon glyphicon-remove',       
//    			        
//    			        label: 'Cancel',
//    			        
//    			        cssClass: 'btn-primary', 
//    			        
//    			        autospin: false,
//    			        
//    			        action: function(dialogRef){    
//    			        
//    			        	dialogRef.close();
//    			        
//    			        }
//    			    
//    			    },{
//    			    	
//    			    	id: 'btn-advanced',   
//    			        
//    			        icon: 'glyphicon glyphicon-check',       
//    			        
//    			        label: 'Advanced',
//    			        
//    			        cssClass: 'btn-primary', 
//    			        
//    			        autospin: false,
//    			        
//    			        action: function(dialogRef){    
//
//    			        	if(cc.product.selected_productid==null){
//    			        		
//    			        		alert("You must select a VDP first!");
//    			        		
//    			        		return;
//    			        		
//    			        	}
//    			        	
//    			        	cc.search.advancedOrder();
//    			        	
//    			        	dialogRef.close();
//    			        	
//    			        	cc.product.reset();
//    			        
//    			        }
//    			    	
//    			    },{
//    			    
//    					id: 'btn-ok',   
//    			        
//    					icon: 'glyphicon glyphicon-check',       
//    			        
//    					label: 'Instant Order',
//    			        
//    					cssClass: 'btn-primary', 
//    			        
//    					autospin: false,
//    			        
//    					action: function(dialogRef){    
//    			        
//    						if(cc.product.selected_productid==null){
//    			        		
//    			        		alert("You must select a VDP first!");
//    			        		
//    			        		return;
//    			        		
//    			        	}
//    						
//    						//make sure the values are filled
//    						
//    						var iscomplete = true;
//    						
//    						var keylist = [], valuelist = []; 
//    						
//    						$("#otherparams :input[type=text]").each(function(){
//    							
//    							if(!$(this).val() ){
//    								
//    								iscomplete = false;
//    								
//    								return;
//    								
//    							}
//    							
//    							keylist.push($(this).attr("key"));
//    							
//    							valuelist.push($(this).val());
//    							
//    						});
//    						
//    						if(!iscomplete){
//    							
//    							alert("The parameter values are incomplete!");
//    							
//    							return;
//    							
//    						}
//    						
//    						dialogRef.close();
//    						
//    						//construct a order request and send 
//    						
//    						var req = [];
//    						
//    		            	for(var i = 0, len = keylist.length; i < len; i++) {
//    		            	    
//    		            		var k = keylist[i];
//    		            	    
//    		            		var val = valuelist[i];
//    		            	    
//    		            		if(i!=0){
//    		            	    
//    		            			req.push("&");
//    		            	    
//    		            		}
//    		            	    
//    		            		req.push(k);
//    		            	    
//    		            		req.push("=");
//    		            	    
//    		            		req.push(val);
//    		            	
//    		            	}
//    		            	
//    		            	req.push("&productid=");
//    		            	
//    		            	req.push(cc.product.selected_productid);
//    		            	
//    		            	cc.product.retrievedata(req);
//    			    
//    					}
//    				
//    			    }]
//    			
//    			});
//        		
//        	}else{
//        		
//        		BootstrapDialog.show({
//        			
//    				title: 'Alert',
//    			    
//    				message: "You must log in to use this button.",
//    				
//    				buttons: [{
//    			    
//    					id: 'btn-ok',   
//    			        
//    					icon: 'glyphicon glyphicon-check',       
//    			        
//    					label: 'Got it',
//    			        
//    					cssClass: 'btn-primary', 
//    			        
//    					autospin: false,
//    			        
//    					action: function(dialogRef){    
//    			        
//    						dialogRef.close();
//    			    
//    					}
//    				
//    			    }]
//    			
//    			});
//        		
//        	}
//        	
//        },
        
        load: function(escapeid, accessurl){
        	
        	accessurl = unescape(accessurl);

        	console.log("the accessurl: " + accessurl);
        	
        	if( $("#cachebtn_"+escapeid).length && !$("#cachebtn_"+escapeid).prop("disabled")){
        		
        		alert("This is a remote file. Need cache first.");
        		
        	}else{
        		
        		edu.gmu.csiss.covali.upload.load(accessurl);
        		
        	}
        	
        },
		
		searchForm: function(){
			
			var cont = '	<div class="row">'+
					
			'		<!-- left-->'+
					
			'		<div class="col-md-12">'+
					
			'			<div class="row">'+
						
			'				<label class="col-md-4 control-label" for="location">Search Text</label>  '+
					  
			'				  <div class="col-md-8">'+
							  
			'				  		<input type="text" id="searchtext" placeholder="type something.." class="form-control input-md" />'+
							  
//			'				  		<br/>'+
							  
//			'					  	<span class="button-checkbox"><button type="button" class="btn btn-primary active" data-color="primary">Name</button><input type="checkbox" class="hidden"  id="name" checked="checked" /></span>'+
//								
//			'					    <span class="button-checkbox">'+
//			'					        <button type="button" class="btn btn-primary active" data-color="primary">Description</button>'+
//			'					        <input type="checkbox" class="hidden" id="desc" checked="checked" />'+
//			'					    </span>'+
//								
//			'					    <span class="button-checkbox">'+
//			'					        <button type="button" class="btn btn-primary active" data-color="primary">Keywords</button>'+
//			'					        <input type="checkbox" class="hidden"  id="keywords" checked="checked"  />'+
//			'					    </span>'+
								    
			'				  </div>'+
						
			'			</div>'+
						
			'			<div class="row hidden">'+
						
			'				<label class="col-md-4 control-label" for="isvirtual">If Virtual?</label>'+
						  
			'				  <div class="col-md-8">'+
							  
			'				    <select id="isvirtual" name="isvirtual" id="isvirtual" class="form-control">'+

			'				      <option value="0">Real</option>'+
			
			'				      <option value="1">Virtual</option>'+
							  
			'				    </select>'+
							  
			'				  </div>'+
						
			'			</div>'+
						
			'			<br/>'+
						
			'			<div class="row">'+
						
			'				<label class="col-md-4 control-label" for="csw">Catalog</label>'+
						  
			'				  <div class="col-md-8">'+
							  
			'				    <select id="csw" name="csw" id="csw" class="form-control" disabled="disabled">'+
							  		
//			'				  	  <option value="-1" disabled="disabled" selected="selected" style="display:none"> -- select an option --</option>'+
			
//			'				      <option value="0">VDP</option>'+
			
			'				      <option value="2">Public & Uploaded Files</option>'+
			
			'				      <option value="1">CSISS Catalogue for UCAR Thredds Data Server</option>'+
			
//			'				      <option value="4">CSISS Catalogue for Landsat 4/5/7 images (incomplete)</option>'+
			
			'				      <option value="3">BCube Broker</option>'+
							  
			'				    </select>'+
							  
			'				  </div>'+
						
			'			</div>'+
						
			'			<br/>'+
						  
			'			<div class="row">'+
						
			'				<label class="col-md-4 control-label" for="selectbasic">Format</label>'+
					  
			'				  <div class="col-md-4">'+
							  		
			'				  		<ul class="list-unstyled" id="formatall">'+
						              	  
			'			              	  <li><label><input type="checkbox" class="all"  checked="checked" /> All</label></li>'+
						            
			'			            </ul>'+
						            
			'				  </div>'+
							  
			'				  <div class="col-md-4">'+
						  		
			'				  		<button class="btn btn-xs btn-primary" value="btn-xs" type="button" id="moreorless">more</button>'+
							  		
			'				  </div>'+
			
			'			</div>'+
			
			'			<div class="row">'+
			
			'				  <div class="col-md-12">'+
			
			'						<ul class="list-unstyled" id="formatlist">'+
			
			'						      <li><label><input type="checkbox" name="hdf" /> HDF</label></li>'+

			'						      <li><label><input type="checkbox" name="nc" /> netCDF</label></li>'+
			
			'						      <li><label><input type="checkbox" name="grb" /> GRIB</label></li>'+

			'						      <li><label><input type="checkbox" name="tif" /> Geotiff</label></li>'+
									      
			'						      <li><label><input type="checkbox" name="shp" /> SHP</label></li>'+
									      
			'			            </ul>'+
			
			'				  </div>'+
			
			'			</div>'+
			
			'			<br/>'+
			
			'			<div class="row">'+
			
			'				<div class="col-md-4 ">'+
			'					<label class="control-label" for="property_type">Spatial Extent</label>'+
			'				</div>'+
							
			'				  <div class="col-md-8">'+
			'					    <div id="mapid" class="col-md-12" style="height:200px;"></div>'+
			'					    <hr/>'+
			'					    <input type="hidden" id="west" value="-180" />'+
			'					    <input type="hidden" id="east" value="180" />'+
			'					    <input type="hidden" id="south" value="-90" />'+
			'					    <input type="hidden" id="north" value="90" />'+
							    
			'				  </div>'+
						
			'			</div>'+
			
			'			<br/>'+
					
			'			<div class="row">'+
						 
			'			 	<div class="col-md-4">'+
						 	
			'				 	<label class=" control-label">Time Extent <br/>'+
							 	
			'				 	   <span>'+
							 	   
			'				 	   	<input type="checkbox" name="distime" id="distime" value="false" /> disable'+
							 	   
			'				 	   </span>'+
							 	
			'				 	</label>'+
						 	
			'			 	</div>'+
						 	
			'				  <div class="col-md-8">'+
							  
			'				    <div class="row">'+
							    
			'				    	<div class="col-md-8">'+
							    	
			'				    		<input type="text" name="bdtv" id="bdtv" size="24" class="form-control input-md ItemLabel" maxLength="19" onkeydown="DateFormat(this, \'1\', event)" placeholder="start" onKeyUp="DateFormat(this, \'1\', event)" />'+
							    		
			'				    	</div>'+
							    	
			'				    	<div class="col-md-1 pl-0 pr-0">'+
							    	
			'				    		<a class="pull-left" href="javascript:NewCal(\'bdtv\',\'yyyymmdd\',true,24)">'+
													
			'								<img src="../images/cal.gif" width="16" height="16" border="0" alt="Pick a date" />'+
										
			'							</a>'+
							    	
			'				    	</div>'+
							    
			'				    </div>'+
							    
			'				    <br/>'+
			                                  	
			'                    <div class="row">'+
			                    
			'                    	<div class="col-md-8">'+
			                    	
			'                    		<input name="edtv" id="edtv"  type="text" size="24" class="form-control input-md ItemLabel" maxLength="19" onkeydown="DateFormat(this, \'1\', event)" placeholder="end" onKeyUp="DateFormat(this, \'1\', event)" />'+
										
			 '                   	</div>'+
			                    	
			 '                   	<div class="col-md-1 pl-0 pr-0">'+
										
			'								<a class="pull-left" href="javascript:NewCal(\'edtv\',\'yyyymmdd\',true,24)">'+
									
			'									<img src="../images/cal.gif" width="16" height="16" border="0" alt="Pick a date" />'+
										
			'								</a>'+
										
			'						</div> '+
			                    
			 '                   </div>'+
			                                  	
							  
			'				  </div>'+
						 
			'			</div>'+
			
			'			<br/>'+
			
			'			<div class="row">'+
			
			'			 	<label class="col-md-4 control-label" for="price_min">Records/Page </label>'+
						  
			'			 	<div class="col-md-8">'+
						  
			'			    	<select id="recordsperpage" class="form-control">'+
						  			
			'			      		<option value="5">5</option>'+
						  
			'			      		<option value="10">10</option>'+
						  		
			'			      		<option value="50">50</option>'+
						  
			'			      		<option value="100">100</option>'+
						  
			'			    	</select>'+
						  
			'			 	</div>'+
						
			'			</div>'+
			 
			'		</div>'+
			
			'	</div>';
			
			return cont;
			
		},
		
		// Initialize Leaflet Map
		
		initializeResultMap: function(mapid, west, east, south, north){
    		
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
		
		initializeSearchMap: function (){

	    	//**********************************************//
	    	// Initialize Leaflet Map
			
    		var mymap = L.map('mapid').setView([36, -78], 13);
    		
    		var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    		
    		var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
    		
    		var osm = new L.TileLayer(osmUrl, {attribution: osmAttrib});		
			
    		// start the map in South-East England
    		//mymap.setView(new L.LatLng(-78, 36),9);
    		
    		var southWest = new L.LatLng(90, 180),
		    
    		northEast = new L.LatLng(-90, -180),
		    
		    bounds = new L.LatLngBounds(southWest, northEast);
	
			mymap.fitBounds(bounds);
	
    		mymap.addLayer(osm);
    		
    		mymap.on('moveend', function(e) {
    			
    			   var bounds = mymap.getBounds();
    			
    			   var sw = bounds.getSouthWest().wrap();
    			   
    			   var south = sw.lat;
    			   
    			   var west = sw.lng;
    			   
    			   var ne = bounds.getNorthEast().wrap();
    			   
    			   var north = ne.lat;
    			   
    			   var east = ne.lng;
    			   
    			   $("#south").val(south);
    			   
    			   $("#west").val(west);
    			   
    			   $("#north").val(north);
    			   
    			   $("#east").val(east);
    			   
    			   console.log("bounds changed:" + south + " " + north + " " + west + " " + east);
    			   
    		});
	  		
	  	},
	  	
	  	checkFormat: function(){
	  		
	  		var ckb = $(".all").is(':checked');
	  		
	  		$("#formatlist").find("input").each(function(){
	  			
	  			$(this).click(function(){
	  				
	  				if(!$(this).prop('checked')){
	  					
	  					$(".all").prop('checked', false);
	  					
	  				}
	  				
	  			});
				
				if(ckb){

					$(this).prop( 'checked', true)
					
				}else{
					
					$(this).prop( 'checked', false)
					
				}
				
				
			});
	  		
	  	},
		
		init: function(){
			
			edu.gmu.csiss.covali.search.searchdialog = new BootstrapDialog({
				
	            message: edu.gmu.csiss.covali.search.searchForm(),
	            
	            title: "Search Dialog",
	            
	            size: BootstrapDialog.SIZE_WIDE,
	            
	            cssClass: 'dialog-vertical-center',
	            
	            onshown: function(dialog) {
	            	
	            	//for format list
	            	
	            	edu.gmu.csiss.covali.search.checkFormat();
	            	
	    			$('.all').on('click', function(e){
	    				
	    				edu.gmu.csiss.covali.search.checkFormat();
	    				
	    			});
	    	    	
	        	    $('.button-checkbox').each(function () {

	        	        // Settings
	        	        var $widget = $(this),
	        	            $button = $widget.find('button'),
	        	            $checkbox = $widget.find('input:checkbox'),
	        	            color = $button.data('color'),
	        	            settings = {
	        	                on: {
	        	                    icon: 'glyphicon glyphicon-check'
	        	                },
	        	                off: {
	        	                    icon: 'glyphicon glyphicon-unchecked'
	        	                }
	        	            };

	        	        // Event Handlers
	        	        $button.on('click', function () {
	        	            $checkbox.prop('checked', !$checkbox.is(':checked'));
	        	            $checkbox.triggerHandler('change');
	        	            updateDisplay();
	        	        });
	        	        $checkbox.on('change', function () {
	        	            updateDisplay();
	        	        });

        	            var isChecked = $checkbox.is(':checked');

        	            // Set the button's state
        	            $button.data('state', (isChecked) ? "on" : "off");
        	            
        	            // Set the button's icon
        	            $button.find('.state-icon')
        	                .removeClass()
        	                .addClass('state-icon ' + settings[$button.data('state')].icon);

        	            // Update the button's color
        	            if (isChecked) {
        	                $button
        	                    .removeClass('btn-default')
        	                    .addClass('btn-' + color + ' active');
        	            }
        	            else {
        	                $button
        	                    .removeClass('btn-' + color + ' active')
        	                    .addClass('btn-default');
        	            }

        	            // Inject the icon if applicable
        	            if ($button.find('.state-icon').length == 0) {
        	                $button.prepend('<i class="state-icon ' + settings[$button.data('state')].icon + '"></i>');
        	            }
	        	    
	        	    });
	    	    	
	    	    	edu.gmu.csiss.covali.search.initializeSearchMap();
	    	    	
	    	    	$("#moreorless").click(function(){
	    	    		
	    	    		if($("#formatlist").is(":visible")){
	    	    			
	    	    			$("#formatlist").hide();
	    	    			
	    	    		}else{
	    	    			
	    	    			$("#formatlist").show();
	    	    			
	    	    		}
	    	    		
	    	    	});
	    	    	
	    	    	$("#formatlist").hide();
	    	    	
	    	    	//set CSW to null
	    	    	if($("#isvirtual").val()=="0")
	    	    		$('#csw').prop('disabled', false);
	    	    	else	
	    	    		$("#csw").val($("#csw option:eq(0)").val());
	    	    	
	    	    	//add listener to virtual box
	    	    	
	    	    	$("#isvirtual").on('change', function(){
	    	    		
	    	    		if(this.value == "1"){
	    	    			console.log("virtual");
	    	    			$('#csw').prop('disabled', 'disabled');
	    	    			$("#csw").val($("#csw option:eq(0)").val());
	    	    		}else if(this.value=="0"){
	    	    			console.log("real");
	    	    			$('#csw').prop('disabled', false);
	    	    			$("#csw").val($("#csw option:eq(1)").val());
	    	    		}
	    	    		
	    	    	});
	    	    	
	    	    	$("#distime").change(function(){
	    	    	    
	    	    		if($(this).is(':checked')) {
	    	    	        
	    	    	    	$(this).val("true");
	    	    	        
	    	    	    	$("#bdtv").prop('disabled', true);        
	    	    	    	
	    	    	    	$("#edtv").prop('disabled', true);        
	    	    	        
	    	    	    } else {
	    	    	    
	    	    	    	$(this).val("false");
	    	    	    	
	    					$("#bdtv").prop('disabled', false);        
	    	    	    	
	    	    	    	$("#edtv").prop('disabled', false);        
	    	    	    
	    	    	    }

	    	    	});
	    	    	
	            },
	            
	            buttons: [{
	                
	            	icon: 'glyphicon glyphicon-ok',
	                
	                label: 'Search',
	                
	                title: 'Search Data',
	                
	                cssClass: 'btn-warning',
	                
	                action: function(dialogItself){
	                	
	                	//Pop up a new dialog to contain the results	                	
	                	//send the search request to the backend proxy which will transfer to PyCSW
	                	
	                	var formatlist = "";
	                	
	                	var ckb = $(".all").is(':checked');
	                	
	                	if(!ckb){

	                		$("#formatlist").find("input").each(function(){
		        				
		        				if($(this).prop( 'checked')){
		        					
		        					formatlist+=($(this).attr("name"))+" ";
		        					
		        				}
		        				
		        			});
	                		
	                	}else{
	                		
	                		formatlist += "all";
	                		
	                	}
	        	  		
	                	var request = {
	                		
	                		"searchtext":$("#searchtext").val(),
	                			
	                		"isvirtual":0,
	                		
	                		"csw":$("#csw").val(),
	                		
	                		"west":$("#west").val(),
	                		
	                		"east":$("#east").val(),
	                		
	                		"north":$("#north").val(),
	                		
	                		"south":$("#south").val(),
	                		
	                		"begindatetime":$("#bdtv").val(),
	                		
	                		"enddatetime":$("#edtv").val(),
	                		
	                		"recordsperpage":$("#recordsperpage  option:selected").text(),
	                		
	                		"pageno":0,
	                		
	                		"formats": formatlist
	                		
	                	};
	                	
	                	edu.gmu.csiss.covali.search.resultDialog(request);
	                	
	                	dialogItself.close();
	                	
//	                	dialogItself.hide();
	                	
	                }
	            	
	            }, {
	            	
	                label: 'Close',
	                
	                action: function(dialogItself){
	                	
	                    dialogItself.close();
	                    
	                }
	            
	            }]
	        
			});
			
			edu.gmu.csiss.covali.search.searchdialog.open();
			
		}
		
};