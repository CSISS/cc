/**
* Dialog browsing the data files in local folder
* Author: Ziheng Sun
* Date: 8/1/2018
*/

edu.gmu.csiss.covali.local = {

	formats: ["tif", "tiff", "shp", "grb", "grib", "grib2", "h5","hdf", "hdfeos", "hdf4", "hdf5", "nc", "nc4",  "nc3", "ncf"],


	init: function(){

        edu.gmu.csiss.covali.filebrowser.selectedCallback = function(selectedFile) {
            edu.gmu.csiss.covali.local.showFileLoadingDialog(selectedFile);
            edu.gmu.csiss.covali.local.loadWMSFile(selectedFile);
        };
        edu.gmu.csiss.covali.filebrowser.init();

	},


	showFileLoadingDialog: function(file_path) {
		
		var dialogName = 'edu.gmu.csiss.covali.local.jsframe.ParsingFile';
		var dialogTitle = 'File Loading';

		var content = '<div class="modal-body" style="font-size: 12px;">';
		content += '<b>Parsing file ' + file_path + '...</b>';
		content += '</div>';

		edu.gmu.csiss.covali.menu.createDialog(dialogName, dialogTitle, content, 76);

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
				edu.gmu.csiss.covali.menu.closeAllDialogs();
                //BootstrapDialog.closeAll();

				var obj = jQuery.parseJSON( obj );

				if(obj.output=="failure"){

					alert("Fail to parse the file: " + obj.reason);

				}else{

					console.info("the new WMS layer name is : " + obj.id);

					var dialogName = 'edu.gmu.csiss.covali.local.jsframe.PublicFolder';
					var dialogTitle = 'Add data from server public folder';
					var content = "<div class=\"modal-body\"><dl class=\"row\" style=\"font-size: 12px; padding: 5px; margin:0px\">"+
							"<p class=\"text-success\">The file is parsed. Do you want to load it into the map now?</p>" +
							"<p class=\"text-warning\">Warning: For netCDF format, only files compliant to CF convention are supported.</p>"+
							"<div class=\"modal-footer\">" +
							"<p><span class=\"btn btn-primary\" onclick=\'edu.gmu.csiss.covali.wms.showLayerSelector(\""+obj.id+"\");\'>Load</span>"+
							"<span class=\"btn btn-primary\" onclick=\'edu.gmu.csiss.covali.menu.closeDialog(\""+dialogName+"\")\'>Close</span></p>"+
							"</div>";
					
					edu.gmu.csiss.covali.menu.createDialog(dialogName, dialogTitle, content);
					
//					BootstrapDialog.show({
//
//						title: "Add data from server public folder",
//
//						message: function(dialog){
//
//							$content = $("<p class=\"text-success\">The file is parsed. Do you want to load it into the map now?</p>" +
//									"<p class=\"text-warning\">Warning: For netCDF format, only files compliant to CF convention are supported.</p>");
//
//							return $content;
//
//						},
//
//						title: "Data Uploader",
//
//						cssClass: 'dialog-vertical-center',
//
//						buttons: [{
//
//								label: 'Load',
//
//								action: function(dialogItself){
//
//									//open the WMS loading dialog to add a specific layer
//
//									var id = obj.id; //the wms layer name
//
//									edu.gmu.csiss.covali.wms.showLayerSelector(id);
//
//								}
//							},{
//
//								label: 'Close',
//
//								action: function(dialogItself){
//
//									dialogItself.close();
//
//								}
//						}]
//					});

				}

			},
			error: function(){
                //BootstrapDialog.closeAll();
                //edu.gmu.csiss.covali.menu.closeAllDialogs();

                alert("Failed to process the request.");
			}
		});
	}

}