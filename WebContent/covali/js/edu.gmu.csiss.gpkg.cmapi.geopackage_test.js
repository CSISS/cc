/**
* This file is created by Gil Heo on 6/7/2016
* 
* This is a testing code for geopackage
*/

edu.gmu.csiss.gpkg.cmapi.geopackage_test = 
{

    // ------------------------------------------------------
    onClickTestButton : function()
    {
        $("#mainPage").hide();
        $("#geoPackageTestPage").show();
        $("#channelTestPage").hide();
        
        //add by Ziheng Sun on 6/7/2016
        $("#aboutPage").hide();
    },
    
    // ------------------------------------------------------
    onClickHomeButton : function()
    {
        $("#mainPage").show();
        $("#geoPackageTestPage").hide();
        $("#channelTestPage").hide();
        
        //add by Ziheng Sun on 6/7/2016
        $("#aboutPage").hide();
    },
    
    goToMainPage: function()
    {
        $("#mainPage").show();
        $("#geoPackageTestPage").hide();
        $("#channelTestPage").hide();
        $("#aboutPage").hide();
    },
    
    // ------------------------------------------------------
    init : function() 
    {
        $( "#geoPackageTestButton").click( function() {
            edu.gmu.csiss.gpkg.cmapi.geopackage_test.onClickTestButton();
        });

        $( "#homeButton").click( function() {
            edu.gmu.csiss.gpkg.cmapi.geopackage_test.onClickHomeButton();
        });

        console.log("[geopackage_test] initialized");
    }
        
};
