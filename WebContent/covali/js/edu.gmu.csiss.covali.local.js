/**
 * Dialog browsing the data files in local folder
 * Author: Ziheng Sun
 * Date: 8/1/2018
 */

edu.gmu.csiss.covali.local = {
		
		formats: ["tif", "tiff", "shp", "grb", "grib", "grib2", "h5","hdf", "hdfeos", "hdf4", "hdf5", "nc", "nc4",  "nc3", "ncf"],
		
		root_directory: null,
		
		init: function(){
		
			this.dialog();
			
		},
		
		filterFormats: function(file_path){
			
			//only supports netCDF, GRIB and GeoTiff rightnow
			
			var support = true;
//			
//			for(var i=0; i< edu.gmu.csiss.covali.local.formats.length; i++){
//				
//				if(file_path.endsWith(edu.gmu.csiss.covali.local.formats[i])){
//					
//					support = true;
//					
//					break;
//					
//				}
//				
//			}
			
			return support;
			
		},

		loadlocalfile: function(file_path){
			
			if(file_path.toLowerCase().endsWith('.geojson')) {
                edu.gmu.csiss.covali.local.loadGeoJSON(file_path);
			} else {
                edu.gmu.csiss.covali.local.loadWMSFile(file_path);
			}

		},

		loadGeoJSON: function(file_path) {
			var url = '../uploadFile' + file_path;
            edu.gmu.csiss.covali.geojson.addGeoJSONFeature(url);

		},
		
		loadWMSFile: function(file_path){
			
			if(!edu.gmu.csiss.covali.local.filterFormats(file_path)){
				
				alert("COVALI doesn't support this format at present. Please check our website for more details.");
				
				return;
				
			}
			
			var postresp = $.ajax({
				
				contentType: "application/x-www-form-urlencoded", //this is by default
				
				type: "POST",
				
				url: "../web/adddata",
				
				data: "location="+file_path, 
				
				success: function(obj, text, jxhr){
					
					var obj = jQuery.parseJSON( obj );
					
					if(obj.output=="failure"){
						
						alert("Fail to parse the file: " + obj.reason);
						
					}else{
						
						console.info("the new WMS layer name is : " + obj.id);
						
						BootstrapDialog.closeAll();
						
						BootstrapDialog.show({
							
							title: "Add data from server public folder",
							
				            message: function(dialog){
				            	
				            	$content = $("<p class=\"text-success\">The file is parsed. Do you want to load it into the map now?</p>" +
				            			"<p class=\"text-warning\">Warning: For netCDF format, only files compliant to CF convention are supported.</p>");
				            	
				            	return $content;
				            	
				            },
				            
				            title: "Data Uploader",
				            
				            cssClass: 'dialog-vertical-center',
				            
				            buttons: [{
					                
				            		label: 'Load',
					                
					                action: function(dialogItself){
					                	
					                	//open the WMS loading dialog to add a specific layer
					                	
					                	var id = obj.id; //the wms layer name
					                	
					                	edu.gmu.csiss.covali.wms.showLayerSelector(id);
					                    
					                }
				            	},{
					                
				            		label: 'Close',
					                
					                action: function(dialogItself){
					                	
					                    dialogItself.close();
					                    
					                }
				            }]
				        });
						
					}
					
				}, //success(result,status,xhr)
				error: function(){
				
					alert("Fail to process the request.");
					
				} //error(xhr,status,error)
				
			});
			
		},
		
		/**
		 * Pop up a dialog to contain all the files in the shared folder 
		 */
		dialog: function(relativepath){
			
			//get the file list
			
			if(typeof(relativepath) == "undefined" || relativepath == null){
				
				relativepath = "";
				
			}
			console.log("relative path is:" + relativepath);

			edu.gmu.csiss.covali.local.root_directory = relativepath;
			
			var posting = $.ajax({
				
				contentType: "application/x-www-form-urlencoded", //this is by default
				
				type: "POST",
				
				url: "../web/localfilelist",
				
				data: "root="+relativepath, 
				
				success: function(obj, text, jxhr){
					
					var obj = jQuery.parseJSON( obj );
					
//					console.info("the retrieved file list is : " + obj);
					
					BootstrapDialog.closeAll();
					
					if(obj.ret == "login"){
						
						edu.gmu.csiss.covali.login.loginDialog(edu.gmu.csiss.covali.local.dialog, relativepath);
						
					}else{
						
						BootstrapDialog.show({
							
				            message: function(dialog){
				            	
				            	var filelist = " <ul class=\"list-group\">";
				            	var parentpath = "/";
				            	if(edu.gmu.csiss.covali.local.root_directory!=""){
				            		var pathes = edu.gmu.csiss.covali.local.root_directory.split("/");
				            		pathes.splice(-1,1);
				            		parentpath = pathes.join("/");
				            	}
				            	
				            	filelist += "<li class=\"list-group-item\">"+
		            			"<span class=\"glyphicon glyphicon-file text-primary\"></span>"+
		            			"<a href=\"javascript:void(0)\" onclick=\"edu.gmu.csiss.covali.local.dialog('"+
		            			parentpath + 
		            			"')\">..</a>"+
		            			"</li>";
				            	
				            	for(var i=0;i<obj.length;i++){
				            		
				            		if(obj[i].type=="file"){
				            			
				            			filelist += "<li class=\"list-group-item\">"+
				            			" <span class=\"glyphicon glyphicon-file text-primary\"></span> "+
				            			"<a href=\"javascript:void(0)\" onclick=\"edu.gmu.csiss.covali.local.loadlocalfile('"+edu.gmu.csiss.covali.local.root_directory +"/"+obj[i].name+"')\">"+obj[i].name+"</a> "+
				            			"</li>";
				            			
				            		}else if(obj[i].type=="directory"){
				            			
				            			filelist += "<li class=\"list-group-item\">"+
				            			" <span class=\"glyphicon glyphicon-folder-close text-primary\"></span> "+
				            			"<a href=\"javascript:void(0)\" onclick=\"edu.gmu.csiss.covali.local.dialog('"+ 
				            			edu.gmu.csiss.covali.local.root_directory + "/" + obj[i].name+"')\">"+obj[i].name+"</a> "+
				            			"</li>";
				            			
				            		}
				            		
				            	}
				            	
				            	filelist += "</ul> ";
				            	
				            	$content = $(filelist);
				            	
				            	return $content;
				            	
				            },
				            
				            title: "Local Files",
				            
				            cssClass: 'dialog-vertical-center',
				            
				            buttons: [
				            	//right now, one file a time only.
//				            	{
//					                
//				            		label: 'Load',
//					                
//					                action: function(dialogItself){
//					                	
//					                	//Register the file to the ncWMS  
//					                	
////					                	var id = obj.id; //the wms layer name
//					                	
//					                	edu.gmu.csiss.covali.wms.showLayerSelector(id);
//					                    
//					                }
//				            	},
				            	{
					                
				            		label: 'Close',
					                
					                action: function(dialogItself){
					                	
					                    dialogItself.close();
					                    
					                }
				            }]
				        });
						
					}
					
					
				}, //success(result,status,xhr)
				error: function(){
				
					alert("Fail to send the request.");
					
				} //error(xhr,status,error)
			});
			
		}
}