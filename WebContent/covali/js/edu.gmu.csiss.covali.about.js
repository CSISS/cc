/**
 * 
 * Author: Ziheng Sun
 * 
 * Date: 4 Oct 2018
 * 
 */

edu.gmu.csiss.covali.about = {
		
		init: function(){
			
			$("#about").click(function(){

				edu.gmu.csiss.covali.about.dialog();

            });
			
		},
		
		dialog: function(){
			
			BootstrapDialog.closeAll();
			
			BootstrapDialog.show({
				
	            message: function(dialog){
	            	
	            	$content = $("<p>COVALI (version "+edu.gmu.csiss.covali.version+") is initially proposed, developed and maitained by <a href=\"http://csiss.gmu.edu\">Center for Spatial Information Science and Sysmtems (CSISS)</a> in <a href=\"http://gmu.edu\">George Mason University</a>. This project is funded by National Science Foundation (1740693 and 1440294). The source code is open on <a href=\"http://github.com/CSISS/cc\">Github</a>.  </p>"+
	            	
	            	"<p>COVALI aims to enable inter-comparison and validation across models. Two common approaches to evaluate models are model output inter-comparison and confronting models with observations to provide validation. For inter-comparison, it is necessary to find matching model outputs, retrieve the data, and, because different models typically produce different parameter estimates in different formats and resolutions, bring the outputs of multiple models into a compatible format and spatial and temporal resolution. Both inter-comparison and validation present similar challenges in data discovery, access, and interoperability. The data interoperability includes data re-formatting, unit homogenization, coordinate system re-projection, geolocating and swath to grid conversion, spatial resolution scaling, temporal resolution scaling, and data range scaling. All these challenges can be addressed easily with COVALI. </p>"+
	            			
	            	"<p>COVALI is one of the module systems within <a href=\"http://cube.csiss.gmu.edu/CyberConnector\">CyberConnector</a>. CyberConnector is designed to extensively adopt open geospatial standards/specifications, including the ISO geospatial data and metadata standards and standard-based geospatial web service, workflows, and sensor web technologies are the foundation. It bridges the sensors and earth science models through standard interfaces, such as Web Processing Service, Sensor Planning Service, and Catalogue Service for the Web. It facilitates the automatic preparation and feeding of both historic and near-real time Earth Observation customized data and on-demand derived products into Earth science models.The standard interfaces allow the automatic handshaking between components with workflow designers and underlying workflow execution language.</p>"+

	            	"<p>This system provides users with an entrance to access the virtual geospatial data products registered in CyberConnector's CSW. The products are not present until someone requests them. Once a request is received, CyberConnector will invoke the product generation processing model on the server side and execute the model by adopting appropriate geoprocessing Web services. When the execution is over, the outputted products will be sent back to the data consumers automatically. </p>"+
	            	
	            	"<h3>Developers:</h3>"+
	            	
	            	"<a href=\"https://github.com/CSISS/cc/blob/master/authors.md\">developer list</a>");
	            	
	            	return $content;
	            	
	            },
	            
	            title: "About COVALI",
	            
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