/**
* This file is created by Ziheng Sun on 3/30/2016
* Initialize the settings and about pages.
*/

edu.gmu.csiss.gpkg.cmapi.settings = {

		googlemapindicator: "on",
		
		openlayersindicator: "on",
		
	    // ------------------------------------------------------
	    onClickGoogleMapsSwitch : function()
	    {
	        console.log( "Google Maps Switch clicked" );
	        if(this.googlemapindicator == "on"){
	        	//turn off
	        	$("#googlemaprow").hide();
	        	$("#openlayersrow").removeClass("row-xs-6");
	        	$("#openlayersrow").addClass("row-xs-12");

	        	//resize the map
	        	edu.gmu.csiss.gpkg.cmapi.openlayers.resize();
	        	
	        	//rename button
	        	$("#googlemapswitch").text("Show GoolgeMaps");
	        	
	        	this.googlemapindicator = "off";
	        }else{
	        	//turn on
	        	$("#googlemaprow").show();
	        	$("#openlayersrow").removeClass("row-xs-12");
	        	$("#openlayersrow").addClass("row-xs-6");

	        	//resize the map
	        	edu.gmu.csiss.gpkg.cmapi.googlemap.resize();
	        	edu.gmu.csiss.gpkg.cmapi.openlayers.resize();
	        	
	        	//rename button
	        	$("#googlemapswitch").text("Hide GoolgeMaps");
	        	
	        	this.googlemapindicator = "on";
	        }
	        //switch back to the main page
	        $("#mainPage").show();
	    },
	    
	    // ------------------------------------------------------
	    onClickOpenLayersSwitch : function()
	    {
	        console.log( "OpenLayers Switch clicked" );
	        if(this.openlayersindicator == "on"){
	        	//turn off
	        	$("#openlayersrow").hide();
	        	$("#googlemaprow").removeClass("row-xs-6");
	        	$("#googlemaprow").addClass("row-xs-12");
	        	//resize the map
	        	edu.gmu.csiss.gpkg.cmapi.googlemap.resize();
	        	//rename button
	        	$("#openlayersswith").text("Show OpenLayers");
	        	
	        	this.openlayersindicator = "off";
	        }else{
	        	//turn on
	        	$("#openlayersrow").show();
	        	$("#googlemaprow").removeClass("row-xs-12");
	        	$("#googlemaprow").addClass("row-xs-6");
	        	//resize the map
	        	edu.gmu.csiss.gpkg.cmapi.googlemap.resize();
	        	edu.gmu.csiss.gpkg.cmapi.openlayers.resize();
	        	//rename button
	        	$("#openlayersswith").text("Hide OpenLayers");
	        	
	        	this.openlayersindicator = "on";
	        }
	        $("#mainPage").show();
	    },
	    
	    onClickAboutButton: function(){
	    	$("#aboutPage").show();
	        $("#mainPage").hide();
            
           //modified by Gil Heo on 6/7/2016            
	        $("#geoPackageTestPage").hide();
	        $("#channelTestPage").hide();
	    },
	    
	    
	    // ------------------------------------------------------
	    init : function() 
	    {
	        $( "#googlemapswitch").click( function() {
	            edu.gmu.csiss.gpkg.cmapi.settings.onClickGoogleMapsSwitch();
	        });

	        $( "#openlayersswith").click( function() {
	            edu.gmu.csiss.gpkg.cmapi.settings.onClickOpenLayersSwitch();
	        });
	        
	        $( "#aboutButton").click( function() {
	            edu.gmu.csiss.gpkg.cmapi.settings.onClickAboutButton();
	        });
	        

	        console.log("[AppSettings] initialized");
	    }
	        
};
