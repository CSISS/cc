/**
* This file is created by Gil Heo on 6/1/2016
* 
* This is an implementation of geopackage relative codes 
*/

edu.gmu.csiss.gpkg.cmapi.map_overlay_common = 
{

    widgetId: "",
    
    // --------------------------------------------------------------
    getFeatureIdList: function( overlayId ) 
    // --------------------------------------------------------------
    {
        if ( overlayId == null )
            overlayId = edu.gmu.csiss.gpkg.cmapi.map_overlay_common.widgetId;
        
        return [];
    },

    // --------------------------------------------------------------
    getOverlayIdList: function() 
    // --------------------------------------------------------------
    {
        
        
        return [];
    },

    // --------------------------------------------------------------
    add: function( featureId, overlayId ) 
    // --------------------------------------------------------------
    {
        if ( overlayId == null )
            overlayId = edu.gmu.csiss.gpkg.cmapi.map_overlay_common.widgetId;
        
        
        // manage overlayId and it's featureId
        
    },

    // --------------------------------------------------------------
    remove: function( featureId, overlayId ) 
    // --------------------------------------------------------------
    {
        if ( overlayId == null )
            overlayId = edu.gmu.csiss.gpkg.cmapi.map_overlay_common.widgetId;
        
        
        // manage overlayId and it's featureId
        
    },

    // --------------------------------------------------------------
    update: function( featureId, overlayId, newOverlayId ) 
    // --------------------------------------------------------------
    {
        // manage overlayId and it's featureId
    },
    
    // --------------------------------------------------------------
    init: function() 
    // --------------------------------------------------------------
    {    
        edu.gmu.csiss.gpkg.cmapi.map_overlay_common.widgetId = cmajs.utils.getUUID();
            
        console.log( "[map_overlay_common] initialized" );
    }    
};
