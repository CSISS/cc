/**
* Last updated by Gil Heo on 7/5/2016
* 
* This is an implementation of geopackage relative codes 
*/

edu.gmu.csiss.gpkg.cmapi.map_feature_common = 
{
    //  {
    //      featureIdList : {
    //            "rivers" : [featureID list]
    //            "..."    : [featureID list] },
    //      googlemaps : {}
    //      openlayers : { "featureID 1" : LayerObject_1,
    //                     "featureID 2" : LayerObject_2,
    //                      ...    }
    //  }
        
    properties: {
        "featureIdList" : {},
        "selectedFeatures" : [],
        "widgetId" : cmajs.utils.getUUID(),
        "googlemaps": {
            "selectedStyle": {
                strokeColor: "red",
                strokeOpacity: 0.8,
                strokeWeight: 5,
                fillColor: "red",
                fillOpacity: 0.5                
            },
            "normalStyle": {
                strokeColor: "green",
                strokeOpacity: 0.8,
                strokeWeight: 1,
                fillColor: "green",
                fillOpacity: 0.35                
            }
        },
        "openlayers": {
            "selectedStyle": new ol.style.Style({ 
                fill: new ol.style.Fill({
                    color: "red",
                    opacity: 0.5
                }),
                stroke: new ol.style.Stroke({
                    color: "red",
                    width: 5,
                    opacity: 0.8
                })
            }),
            "normalStyle": new ol.style.Style({ 
                fill: new ol.style.Fill({
                    color: "green",
                    opacity: 0.35
                }),
                stroke: new ol.style.Stroke({
                    color: "green",
                    width: 1,
                    opacity: 0.8
                })
            })
        }
    },

    //  [{ "overlayId": "", 
    //      "selectedFeatures" : [ {
    //          "featureId": "",
    //          "selectedId": "" 
    //        },
    //        {
    //          "featureId": "",
    //          "selectedId": "" 
    //        }
    //      ]
    //  },
    //  {
    //    ...
    //  }]
    //
    
    selectedFeatures: [],

    zoomLevelToScale: [
       500000000,   //  0
       250000000,   //  1
       150000000,   //  2
       70000000,    //  3
       35000000,    //  4
       15000000,    //  5
       10000000,    //  6
       4000000,     //  7
       2000000,     //  8
       1000000,     //  9
       500000,      // 10
       250000,      // 11
       150000,      // 12
       70000,       // 13
       35000,       // 14
       15000,       // 15
       8000,        // 16
       4000,        // 17
       2000,        // 18
       1000,        // 19
       500,         // 20
    ],
 
    
    // ------------------------------------------------------
    scaleToLevel: function( scale )
    {
        for ( var i=this.zoomLevelToScale.length + 1; i > 2; i-- )
            if (edu.gmu.csiss.gpkg.cmapi.map_feature_common.zoomLevelToScale[i] >= scale )
                return (i-3);
        
        return 0;
    },
    
    
    // ------------------------------------------------------
    latLngToDistance: function( lat1, lng1, lat2, lng2 )
    {
        var Rm = 6373000; 
        
        var lat1 = edu.gmu.csiss.gpkg.cmapi.map_feature_common.deg2rad(lat1);
        var lng1 = edu.gmu.csiss.gpkg.cmapi.map_feature_common.deg2rad(lng1);
        var lat2 = edu.gmu.csiss.gpkg.cmapi.map_feature_common.deg2rad(lat2);
        var lng2 = edu.gmu.csiss.gpkg.cmapi.map_feature_common.deg2rad(lng2);
        
        var dlng = lng2 - lng1; 
        var dlat = lat2 - lat1;
        
        var a  = Math.pow(Math.sin(dlat/2),2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlng/2),2);
        var c  = 2 * Math.atan2(Math.sqrt(a),Math.sqrt(1-a)); // great circle distance in radians
        var dm = c * Rm; // great circle distance in km
        var m = edu.gmu.csiss.gpkg.cmapi.map_feature_common.round(dm);
        
        return m;
    },
    
    // ------------------------------------------------------
    // convert degrees to radians
    deg2rad: function (deg) 
    {
        rad = deg * Math.PI/180; // radians = degrees * pi/180
        
        return rad;
    },
    
    
    // ------------------------------------------------------
    // round to the nearest 1/1000
    round: function (x) 
    {
        return Math.round( x * 1000) / 1000;
    },
   

    // --------------------------------------------------------------
    getFeatureIdList: function( name ) 
    // --------------------------------------------------------------
    {
        var idList = [];
        
        if ( name in edu.gmu.csiss.gpkg.cmapi.map_feature_common.properties.featureIdList )
            idList = edu.gmu.csiss.gpkg.cmapi.map_feature_common.properties.featureIdList[name];

        return idList;
    },
    
    // --------------------------------------------------------------
    getAllFeatureIdList: function() 
    // --------------------------------------------------------------
    {
        return idList = edu.gmu.csiss.gpkg.cmapi.map_feature_common.properties.featureIdList;
    },
    
    // --------------------------------------------------------------
    appendFeatureId: function( name, id )
    // --------------------------------------------------------------
    {
        if ( !(name in edu.gmu.csiss.gpkg.cmapi.map_feature_common.properties.featureIdList) )
            edu.gmu.csiss.gpkg.cmapi.map_feature_common.properties.featureIdList[name] = [];
        
        edu.gmu.csiss.gpkg.cmapi.map_feature_common.properties.featureIdList[name].push( id );
    },

    // --------------------------------------------------------------
    createFeatureIdList: function( name )
    // --------------------------------------------------------------
    {
        if ( name in edu.gmu.csiss.gpkg.cmapi.map_feature_common.properties.featureIdList )
            delete edu.gmu.csiss.gpkg.cmapi.map_feature_common.properties.featureIdList[name];

        edu.gmu.csiss.gpkg.cmapi.map_feature_common.properties.featureIdList[name] = [];
    },
    
    // --------------------------------------------------------------
    removeFeatureIdList: function( name )
    // --------------------------------------------------------------
    {
        if ( name in edu.gmu.csiss.gpkg.cmapi.map_feature_common.properties.featureIdList )
            delete edu.gmu.csiss.gpkg.cmapi.map_feature_common.properties.featureIdList[name];
    },
    
    // --------------------------------------------------------------
    removeAllFeatureIdList: function()
    // --------------------------------------------------------------
    {
        edu.gmu.csiss.gpkg.cmapi.map_feature_common.properties.featureIdList = [];
    },

    
    // --------------------------------------------------------------
    existFeatureId: function( featureId )
    // --------------------------------------------------------------
    {
        var list = edu.gmu.csiss.gpkg.cmapi.map_feature_common.properties.featureIdList;
        
        for ( var key in list ) {
            if ( list[key].indexOf( featureId ) >= 0 )
                return true;
        }
        
        return false;
    },

    
    // --------------------------------------------------------------
    setProperty: function( target, key, value )
    // --------------------------------------------------------------
    {
        edu.gmu.csiss.gpkg.cmapi.map_feature_common.properties[target][key] = value;
    },

    // --------------------------------------------------------------
    getProperty: function( target, key )
    // --------------------------------------------------------------
    {
        return edu.gmu.csiss.gpkg.cmapi.map_feature_common.properties[target][key];
    },
    
    // --------------------------------------------------------------
    removeProperty: function( target, key )
    // --------------------------------------------------------------
    {
        delete edu.gmu.csiss.gpkg.cmapi.map_feature_common.properties[target][key];
    },
    

    // --------------------------------------------------------------
    hide: function( featureID )
    // --------------------------------------------------------------
    {
        edu.gmu.csiss.gpkg.cmapi.map_feature_hide.hide( "googlemaps", featureId );
        edu.gmu.csiss.gpkg.cmapi.map_feature_hide.hide( "openlayers", featureId );
    },

    // --------------------------------------------------------------
    show: function( featureID )
    // --------------------------------------------------------------
    {
        edu.gmu.csiss.gpkg.cmapi.map_feature_show.show( "googlemaps", featureId );
        edu.gmu.csiss.gpkg.cmapi.map_feature_show.show( "openlayers", featureId );
    },
    
    // --------------------------------------------------------------
    update: function( featureID )
    // --------------------------------------------------------------
    {
        edu.gmu.csiss.gpkg.cmapi.map_feature_update.update( "googlemaps", featureId );
        edu.gmu.csiss.gpkg.cmapi.map_feature_update.update( "openlayers", featureId );
    },
    
    // --------------------------------------------------------------
    remove: function( featureID )
    // --------------------------------------------------------------
    {
        edu.gmu.csiss.gpkg.cmapi.map_feature_unplot.remove( "googlemaps", featureId );
        edu.gmu.csiss.gpkg.cmapi.map_feature_unplot.remove( "openlayers", featureId );
    },
    
    // --------------------------------------------------------------
    getSelected: function()
    // --------------------------------------------------------------
    {
        return edu.gmu.csiss.gpkg.cmapi.map_feature_common.properties.selectedFeatures;
    },

    // --------------------------------------------------------------
    setSelected: function( payload )
    // --------------------------------------------------------------
    {
        var properties = edu.gmu.csiss.gpkg.cmapi.map_feature_common.properties;

        if ( !edu.gmu.csiss.gpkg.cmapi.map_feature_common.existFeatureId( payload.featureId ) )
            return;

        var selectedFeature = {
            "featureId": payload.featureId
        };
        
        if ( "selectedId" in payload )
            selectedFeature.selectedId = payload.selectedId;
            
        
        var overlayId = properties.widgetId;
        if ( "overlayId" in payload )
            overlayId = payload.overlayId;

        
        
        var found1 = false;
        var selected = properties.selectedFeatures;
        for ( var i=0; i < selected.length; i++ )
        {
            if ( selected[i].overlayId == overlayId )
            {
                var found2 = false;
                
                for ( var j=0; j < selected[i].selectedFeatures.length; j++ ) 
                {
                    if ( payload.featureId == selected[i].selectedFeatures[j].featureId ) 
                    {
                        if ( "selectedId" in payload )
                            selected[i].selectedFeatures[j].selectedId = payload.selectedId;
                        found2 = true;
                        break;
                    }
                }
                if ( found2 == false )
                    selected[i].selectedFeatures.push( selectedFeature );
                
                found1 = true;
                break;
            }
        }
        
        if ( found1 == false )
        {
            selected.push( { 
                "overlayId": overlayId, 
                "selectedFeatures": [ selectedFeature ]
            });
        }
        
        console.log( edu.gmu.csiss.gpkg.cmapi.map_feature_common.properties.selectedFeatures );
        
    },
    
    // --------------------------------------------------------------
    removeSelected: function( featureId, overlayId, payload )
    // --------------------------------------------------------------
    {
        
    },
    
    
    // --------------------------------------------------------------
    init: function() 
    // --------------------------------------------------------------
    {    
        console.log( "[map_feature_common] initialized" );
    }    
};
