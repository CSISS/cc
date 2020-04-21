/**
* 
* All the methods related to search
* 
* Author: Ziheng Sun
* Date: 06/19/2018
* 
*/

edu.gmu.csiss.covali.search = {

		resultDialog: function(request, title){

			var dialogName = 'edu.gmu.csiss.covali.search.jsframe.'+title.replace(" ", "");
			var dialogTitle = title;
			
			var content =   "<div class=\"modal-body\"><dl class=\"row\" style=\"font-size: 12px; padding: 5px; margin:0px;\">"+
							'<table id="producttable"'+
				        	
							'			class="table table-striped table-bordered table-list">'+
					
							'		<thead>'+
					
							'			<tr>'+
					
							'				<th class="hidden-xs col-md-9" style="word-wrap: break-word; word-break: break-all;">Product</th>'+
					
				//			'				<th class="col-text">Information</th>'+
					
							'				<th class="col-text col-sm-3">Map</th>'+
					
							'			</tr>'+
					
							'		</thead>'+
					
							'		<tbody>'+
					
							'		</tbody>'+
					
							'	</table>'+
							"</dl></div>"+
							
							"<div class=\"modal-footer\">" +
							"<p><span class=\"btn btn-primary\" onclick=\'edu.gmu.csiss.covali.menu.closeDialog(\""+dialogName+"\")\'>Back</span>"+
							"<span class=\"btn btn-primary\" onclick=\"edu.gmu.csiss.covali.menu.closeAllDialogs();\">Close</span></p>"+
							"</div>";

			
			edu.gmu.csiss.covali.menu.createDialog(dialogName, dialogTitle, content, 700);
			
        },
		
		/**
		 * Check whether the file format is supported
		 */
		checkfileformat: function(filename){
			return edu.gmu.csiss.covali.local.filterFormats(filename);
		},
		
		download: function(url, name){
			var a = $("<a />", {
				href: url,
				download: name
			});
			a.appendTo("body").get(0).click();
		},
		
		granules: function(name){
            api =  $('#producttable').DataTable();
			request = api.ajax.params();

			delete(request.start);
			delete(request.draw);
			request.collectiongranules = true;
			request.searchtext = name;

            $('#producttable').DataTable().destroy();
            $('#producttable').remove();
            BootstrapDialog.closeAll();

            edu.gmu.csiss.covali.search.resultDialog(request, "Granules for " + name);
            edu.gmu.csiss.covali.search.initTable(request);
            edu.gmu.csiss.covali.menu.closeDialog('edu.gmu.csiss.covali.search.jsframe.SearchResults');
        },
		
		initTable: function(request){
			if($('#producttable').DataTable) {
				$('#producttable').DataTable().destroy();
			}

            $('#producttable').DataTable({
            	
                "processing": true,
                
                "serverSide": true,

				"pageLength": request.length,

				"searching": false,
                
                "ajax": {
                	
                	//{'begindatetime':'1900-01-01T00:00:00','csw':'1','desc':false,'distime':false,'east':-16.875,'enddatetime':'2017-06-15T00:00:00','formats':null,'isvirtual':'0','keywords':false,'name':true,'north':57.326521225217064,'pageno':1,'recordsperpage':5,'searchtext':'bufr','south':7.013667927566642,'west':-154.3359375};
                	
                	"url": '../web/search',
                    
                	"type": "POST",
                	
                	"data": request,
                	
                	"dataSrc" : "products"
                
                },
                
                "columnDefs": [
                 
                         { "width": "70%", "targets": 0 },
                         
                         { "width": "30%", "targets": 1, "orderable": false }
                         
                ],
                
                "columns": [
                
                    { 
                    	
                    	"data": "id",
                        
                    	"render": function ( data, type, product, meta ) {
                    		
                    		var desc = " ", btime = " ", etime = " ";
                            var escapeid = product.id.replace(/\./g, '_');

                            if(product.desc!=null) desc = product.desc;
                    		
                    		if(product.begintime!=null) btime = product.begintime;
                    		
                    		if(product.endtime!=null) etime = product.endtime;
                        	
                    		var content = "<h4> "+
    						"	<a href=\"#\" id=\"name_"+product.id+"\" "+
    						"		 style=\"word-wrap: break-word;word-break: break-all;\">"+(product.title||product.name)+"</a>"+
    						"</h4>"+
    						"<p>"+desc+"</p>"+
    						"<p>"+
    						"	<span text=\"\">"+btime+"</span> - <span>"+etime+"</span>"+
    						"</p>";

                    		content += '	<div class="btn-group-horizontal"> ';

                            content += "	<button type=\"button\" id=\"viewbtn_"+product.id+"\""+
    						"		class=\"btn btn-primary btn-circle\">"+
    						"		<i class=\"glyphicon glyphicon-info-sign\" title=\"View Details\"></i>"+
    						"	</button>";
                            if(product.accesslink && product.accesslink != 'NA') {

                                content += '		<a href="'+ product.accesslink + '" target="_blank"><button class="btn btn-default" ' +
                                    ' id="externallinkbtn_' + escapeid + '"> <span ' +
                                    '			class="glyphicon glyphicon-new-window" title="Goto External Access Link"></span> ' +
                                    '		</button></a>';
							}

                            if(product.iscollection == "1") {
                                content += '		<button onclick="edu.gmu.csiss.covali.search.granules('
									+ "'" + product.name + "'" + ')"'
                                    + ' class="btn btn-default" ' +
                                    ' id="downbtn_' + escapeid + '"> <span ' +
                                    '			class="glyphicon glyphicon-th" title="List Granules"></span> ' +
                                    '		</button>';
                            }
                            else {
                                if (product.downloadurl) {

                                    content += '		<button onclick="edu.gmu.csiss.covali.search.download(\'' + product.downloadurl + '\', \'' + product.name + '\')" class="btn btn-default" ' +
                                        ' id="downbtn_' + escapeid + '"> <span ' +
                                        '			class="glyphicon glyphicon-download-alt" title="Download"></span> ' +
                                        '		</button>';
                                }
                                //add a button to load map


								content += '		<button onclick="edu.gmu.csiss.covali.search.load(\'' + product.id + '\', \'' +
									product.filepath +
									'\')" class="btn btn-default" id="loadbtn_' + escapeid + '" ';

                                //  if can't be loaded add "disabled" attribute to the load button
                                if(!edu.gmu.csiss.covali.search.checkfileformat(product.filepath)) {
                                	content += ' disabled="true" ';
								}
                                content += '>';

                                content += '<span ' +
									'			class="glyphicon glyphicon-film" title="Load Map"></span> ' +
									'		</button> ';

								if (!product.filepath && product.downloadurl) {

									content += '<button onclick="edu.gmu.csiss.covali.search.cache(\'' + product.id + '\', \'' + product.name + '\', \'' + product.downloadurl + '\')" id="cachebtn_' + escapeid + '" class="btn btn-default" > ' +
										'			<span class="glyphicon glyphicon-save-file" title="Cache Data"></span> ' +
										//        							'			DataCache '+
										'		</button> ';

                                }
                            }

                            content += '	</div> ';

                        	return content;
                        	
                        },
                        
                    	"target" : 0
                    	
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
                    	
                    	"target" : 1 
                    	
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

    	        		$("#viewbtn_" + full.id + ", #name_" + full.id ).click(full, function(event){
    	        			
    	        			edu.gmu.csiss.covali.search.view(event.data);
    	        			
    	        		});

    	        		
//    	        		$("#likebtn_" + full.id).click(function(){
//    	        		
//    	        			edu.gmu.csiss.covali.search.like(this.id);
//    	        			
//    	        		});
    	        		
    	        	}
    	        	
                },
                
                "iDisplayLength": request.length,
                
                "bLengthChange": false
            
            })
        },

		variablesTable: function(product) {
			var content = '<div><table class="table table-striped table-bordered table-list dataTable no-footer">';

			content += '<thead><tr role="row"><th>Variable</th><th>Type</th><th>Description</th></tr></thead>';

			content += '<tbody>';
			product.variables.forEach(function (v) {
                content += '<tr role="row">';

                content += '<td>' + v.id + '</td>';
                content += '<td>' + v.type + '</td>';
                content += '<td>' + v.desc + '</td>';

                content += '</tr>';
            });
			content += '</tbody></table></div>';

			var dialogName = 'edu.gmu.csiss.covali.search.jsframe.Variables';
			var dialogTitle = product.name + ' Variables';
			
			$content = "<div class=\"modal-body\"><dl class=\"row\" style=\"font-size: 12px; padding: 5px; margin:0px\">"+
						$content+"</dl></div>"+
			//content +=
						"<div class=\"modal-footer\">" +
						"<p><span class=\"btn btn-primary\" onclick=\'edu.gmu.csiss.covali.menu.closeDialog(\""+dialogName+"\")\'>OK</span></p>"+
						"</div>";
			edu.gmu.csiss.covali.menu.createDialog(dialogName, dialogTitle, content);


		},

    	view: function (product){

            var dialogName = 'edu.gmu.csiss.covali.search.jsframe.TableContent';
            var dialogTitle = 'Information';
			
			var tablecontent = "<div style='font-size: 14px;'>";


			if(product.name) {
                tablecontent += "  <div class=\"form-group\">\n";
                tablecontent += "    <label class=\"col-md-4 control-label\" >Name</label>";
                tablecontent += "    <label class=\"col-md-8 control-content\" style=\"word-wrap: break-word;word-break: break-all;\" >" + product.name + "</label>";
                tablecontent += "  </div>";
            }

            if(product.desc && product.name != product.desc) {
                tablecontent += "  <div class=\"form-group\">\n";
                tablecontent += "    <label class=\"col-md-4 control-label\" >Description</label>";
                tablecontent += "    <label class=\"col-md-8 control-content\" style=\"word-wrap: break-word;word-break: break-all;\"  >" + product.desc + "</label>";
                tablecontent += "  </div>";
            }

            // tablecontent += "  <div class=\"form-group\">\n";
            // tablecontent += "    <label class=\"col-md-4 control-label\" >Identifier</label>";
            // tablecontent += "    <label class=\"col-md-8 control-content\" style=\"word-wrap: break-word;word-break: break-all;\"  >" + product.id + "</label>";
            // tablecontent += "  </div>";


            if(product.accesslink && product.accesslink != "NA") {
                tablecontent += "  <div class=\"form-group\">\n";
                tablecontent += "    <label class=\"col-md-4 control-label\" >Access Link</label>";
                tablecontent += "    <label class=\"col-md-8 control-content\" style=\"word-wrap: break-word;word-break: break-all;\"  ><a target='_blank' href='" + product.accesslink + "'>" + product.accesslink + "</a></label>";
                tablecontent += "  </div>";
            }

            if(product.accessinfo && product.accessinfo != "NA") {
                tablecontent += "  <div class=\"form-group\">\n";
                tablecontent += "    <label class=\"col-md-4 control-label\" >Access Link Info</label>";
                tablecontent += "    <label class=\"col-md-8 control-content\"  >" + product.accessinfo + "</label>";
                tablecontent += "  </div>";
            }


            if(product.keywords) {
                tablecontent += "  <div class=\"form-group\">\n";
                tablecontent += "    <label class=\"col-md-4 control-label\" >Keywords</label>";
                tablecontent += "    <label class=\"col-md-8 control-content\"  >" + product.keywords + "</label>";
                tablecontent += "  </div>";
            }


            if(product.begintime) {
                tablecontent += "  <div class=\"form-group\">\n";
                tablecontent += "    <label class=\"col-md-4 control-label\" >Begin Time</label>";
                tablecontent += "    <label class=\"col-md-8 control-content\" style=\"word-wrap: break-word;word-break: break-all;\"  >" + product.begintime + "</label>";
                tablecontent += "  </div>";
            }

			if(product.endtime) {
				tablecontent += "  <div class=\"form-group\">\n";
				tablecontent += "    <label class=\"col-md-4 control-label\" >End Time</label>";
				tablecontent += "    <label class=\"col-md-8 control-content\" style=\"word-wrap: break-word;word-break: break-all;\"  >" + product.endtime + "</label>";
				tablecontent += "  </div>";
			}
		    
		    if(product.isspatial == "1" && product.east){
		    	
		    	tablecontent += "  <div class=\"form-group\">\n";
			    tablecontent += "    <label class=\"col-md-4 control-label\" >East</label>";
			    tablecontent += "    <label class=\"col-md-8 control-content\" style=\"word-wrap: break-word;word-break: break-all;\"  >"+product.east+"</label>";
			    tablecontent += "  </div>";

				tablecontent += "  <div class=\"form-group\">\n";
			    tablecontent += "    <label class=\"col-md-4 control-label\" >West</label>";
			    tablecontent += "    <label class=\"col-md-8 control-content\" style=\"word-wrap: break-word;word-break: break-all;\"  >"+product.west+"</label>";
			    tablecontent += "  </div>";

				tablecontent += "  <div class=\"form-group\">\n";
			    tablecontent += "    <label class=\"col-md-4 control-label\" >North</label>";
			    tablecontent += "    <label class=\"col-md-8 control-content\" style=\"word-wrap: break-word;word-break: break-all;\"  >"+product.north+"</label>";
			    tablecontent += "  </div>";

			    tablecontent += "  <div class=\"form-group\">\n";
			    tablecontent += "    <label class=\"col-md-4 control-label\" >South</label>";
			    tablecontent += "    <label class=\"col-md-8 control-content\" style=\"word-wrap: break-word;word-break: break-all;\"  >"+product.south+"</label>";
			    tablecontent += "  </div>";
		    	
		    }

			if(product.srs) {
                tablecontent += "  <div class=\"form-group\">\n";
                tablecontent += "    <label class=\"col-md-4 control-label\" >Projection</label>";
                tablecontent += "    <label class=\"col-md-8 control-content\" >" + product.srs + "</label>";
                tablecontent += "  </div>";
            }

			if(product.ifvirtual != 0) {
                tablecontent += "  <div class=\"form-group\">\n";
                tablecontent += "    <label class=\"col-md-4 control-label\" >Is Virtual</label>";
                tablecontent += "  </div>";
            }

		    if(product.format) {
                tablecontent += "  <div class=\"form-group\">\n";
                tablecontent += "    <label class=\"col-md-4 control-label\" >Format</label>";
                tablecontent += "    <label class=\"col-md-8 control-content\" >" + product.format + "</label>";
                tablecontent += "  </div>";
            }

		    if(product.lastupdate) {
                tablecontent += "  <div class=\"form-group\">\n";
                tablecontent += "    <label class=\"col-md-4 control-label\" >Last Update</label>";
                tablecontent += "    <label class=\"col-md-8 control-content\" >" + product.lastupdate + "</label>";
                tablecontent += "  </div>";
            }

            if(product.filepath) {
                tablecontent += "  <div class=\"form-group\">\n";
                tablecontent += "    <label class=\"col-md-4 control-label\" >File Path</label>";
                tablecontent += "    <label class=\"col-md-8 control-content\" style=\"word-wrap: break-word;word-break: break-all;\">" + product.filepath + "</label>";
                tablecontent += "  </div>";
            }

            if(product.filesize) {
                tablecontent += "  <div class=\"form-group\">\n";
                tablecontent += "    <label class=\"col-md-4 control-label\" >File Size</label>";
                tablecontent += "    <label class=\"col-md-8 control-content\" >" + product.filesize + "</label>";
                tablecontent += "  </div>";
            }

			if(product.variables.length > 0) {
                // Show variables List
                var variableNames = [];
                product.variables.forEach(function (v) {
                    variableNames.push(v.id)
                });

                tablecontent += "  <div class=\"form-group\">\n";
                tablecontent += "    <label class=\"col-md-4 control-label\" >Variables</label>";
                tablecontent += "    <label class=\"col-md-8 control-content\" >" + variableNames.join(', ');
                tablecontent += ' 	 	<a href="#" id="viewvars_' + product.id + '">details</a>';
                tablecontent += "	 </label>";
                tablecontent += "  </div>";
            }


			tablecontent += "</div>";

			tablecontent +="<div class=\"modal-footer\">" +
				"<p><span class=\"btn btn-primary\" onclick=\'edu.gmu.csiss.covali.menu.closeDialog(\""+dialogName+"\")\'>OK</span></p>"+
				"</div>";
			

			edu.gmu.csiss.covali.menu.createDialog(dialogName, dialogTitle, tablecontent);


			
        },
        
        cache: function(id, name, downloadurl){
        	
            var escapeid = id.replace(/\./g, '_');

        	$("#cachebtn_"+escapeid).button("loading");
        	
        	$.ajax({
				
				contentType: "application/x-www-form-urlencoded", //this is by default
				
				type: "POST",
				
				url: "../web/cache",
				
				data: "downloadurl="+downloadurl
        	}).success(function(obj, text, jxhr){
					
				var resp = $.parseJSON(obj);
				
				if(resp.output=="success"){
					
					alert("Cached " + resp.filepath);
					
					console.log("cached url is:" + resp.downloadurl);
					
					//change the link of the download and loading map to the new link. 
					
					$('#loadbtn_' + escapeid).attr('onclick', 'edu.gmu.csiss.covali.search.load(\''+
							id+'\',\''+
							resp.filepath+'\')');
					$('#loadbtn_' + escapeid).prop('disabled', false);
					
					$('#downbtn_' + escapeid).attr('onclick', 'edu.gmu.csiss.covali.search.download(\''+
							resp.downloadurl+'\')');
				}					
				
				$("#cachebtn_"+escapeid).button('reset');
			    
				setTimeout(function() {//  short delay after reset
			    	
			    	$("#cachebtn_"+escapeid).prop('disabled', true);

			    }, 200);
				
			}).fail(function(jxhr, status, error){
				
				alert("Cache failed." + error);
				
				$("#cachebtn_"+escapeid).button("reset");
				
			});
        	
        	alert("It may take a while depending on the file size. You can leave this dialog and find the cached file later in the search Public&Upload category.");

        	
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

        load: function(escapeid, accessurl){

        	accessurl = unescape(accessurl);

        	console.log("the accessurl: " + accessurl);

        	var escapeid = escapeid.replace(/\./g, '_');

        	if( $("#cachebtn_"+escapeid).length && !$("#cachebtn_"+escapeid).prop('disabled')){

        		alert("This is a remote file. Need cache first.");

        	}else{

				edu.gmu.csiss.covali.local.showFileLoadingDialog(accessurl);
				edu.gmu.csiss.covali.local.loadWMSFile(accessurl);
        	}

        },
		
		searchForm: function(){
			
			var cont = "<div class=\"modal-body\" style=\"overflow:auto\"><dl class=\"row\" style=\"font-size: 12px; padding: 5px; margin:0px;\">"+
			'	<div class="row">'+
					
			'		<!-- left-->'+
					
			'		<div class="col-md-12">'+
					
			'			<div class="row">'+
						
			'				<label class="col-md-4 control-label" for="location">Search Text</label>  '+
					  
			'				  <div class="col-md-8">'+
							  
			'				  		<input type="text" id="searchtext" placeholder="type something.." class="form-control input-md" />'+
							  
//			'				  		<br/>'+
//			'					  	<span class="button-checkbox"><button type="button" class="btn btn-primary active" data-color="primary">Name</button><input type="checkbox" class="hidden"  id="name" checked="checked" /></span>'+
//			'					    <span class="button-checkbox">'+
//			'					        <button type="button" class="btn btn-primary active" data-color="primary">Description</button>'+
//			'					        <input type="checkbox" class="hidden" id="desc" checked="checked" />'+
//			'					    </span>'+
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

            '				      <option value="1">CSISS Catalogue (UCAR/RDA)</option>'+
            
            '				      <option value="2">Public & Uploaded Files</option>'+

			'				      <option value="3">CEOS WGISS Integrated Catalog (CWIC)</option>'+

			'				      <option value="4">GeoDAB CSW</option>'+

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

			'				  <div class="col-md-4"></div>'+

			'				  <div class="col-md-4">'+
			
			'						<ul class="list-unstyled" id="formatlist">'+
			
			'						      <li><label><input type="checkbox" name="hdf" /> HDF</label></li>'+

			'						      <li><label><input type="checkbox" name="nc" /> netCDF</label></li>'+
			
			'						      <li><label><input type="checkbox" name="grib" /> GRIB</label></li>'+

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
			
			'	</div>'+
			'</dl></div>';
			
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
	  	
	  	switchLocalOn: function(){
	  		
	  		$("#csw").val(2);
	  		
	  	},
	  	
	  	searchDialogsearchButtonAction: function(dialogItself){
        	
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

        		"length":$("#recordsperpage  option:selected").text(),

        		"formats": formatlist
        		
        	};
        	
        	edu.gmu.csiss.covali.search.resultDialog(request, 'Search Results');
        	edu.gmu.csiss.covali.search.initTable(request);
		},
		
        searchDialogOnShownAction: function(dialog) {
        	
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
	    	
	    	$("#csw").on('change', function(){
	    		
	    		if(this.value == "2"){
	    			
	    			//local file need check if login is required
	    			
	    			$.ajax({
	    				
	    				url: "checkLoginRequirement",
	    				
	    				type: "POST",
	    				
	    				data: "action=localfilesearch"
	    				
	    			}).success(function(data){
	    				
	    				data = $.parseJSON(data);
	    				
	    				if(data.ret == "true"){
	    					
	    					//require login permission
	    					
	    					$("#csw").val(1); //first switch to 1 until the login requirement is met
	    					
	    					edu.gmu.csiss.covali.login.loginDialog(edu.gmu.csiss.covali.search.switchLocalOn);
	    					
	    				}else{
	    					
	    					//do nothing, it is fine. go ahead
	    					
	    				}
	    				
	    			});
	    			
	    			
	    		}
	    		
	    	});
	    	
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
        
		init: function(){
			
			edu.gmu.csiss.covali.menu.closeAllDialogs();
			var dialogName = 'edu.gmu.csiss.covali.search.jsframe.SearchDialog';
			var dialogTitle = 'Search Dialog';
			
			var content = edu.gmu.csiss.covali.search.searchForm() +
				"<div class=\"modal-footer\">" +
				"<p><span class=\"btn btn-primary\" onclick=\"edu.gmu.csiss.covali.search.searchDialogsearchButtonAction()\">Search</span>"+
				"<span class=\"btn btn-primary\" onclick=\'edu.gmu.csiss.covali.menu.closeAllDialogs()\'>Close</span></p>"+
				"</div>";
			edu.gmu.csiss.covali.menu.createDialog(dialogName, dialogTitle, content, 670);
			edu.gmu.csiss.covali.search.searchDialogOnShownAction();

		}
		
};