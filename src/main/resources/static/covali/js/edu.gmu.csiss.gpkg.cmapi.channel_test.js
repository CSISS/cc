/**
* This file is created by Gil Heo on 6/7/2016
* 
* This is a testing code for cmapi channels
*/

edu.gmu.csiss.gpkg.cmapi.channel_test = 
{
    channels : [
        "map.overlay.create",
        "map.overlay.remove",
        "map.overlay.hide",
        "map.overlay.show",
        "map.overlay.update",
        "map.feature.plot",
        "map.feature.plot.batch",
        "map.feature.plot.url",
        "map.feature.unplot",
        "map.feature.unplot.batch",
        "map.feature.hide",
        "map.feature.show",
        "map.feature.selected",
        "map.feature.selected.batch",
        "map.feature.deselected",
        "map.feature.deselected.batch",
        "map.feature.update",
        "map.view.zoom",
        "map.view.center.overlay",
        "map.view.center.feature",
        "map.view.center.location",
        "map.view.center.bounds",
        "map.view.clicked",
        "map.status.request",
        "map.status.view",
        "map.status.format",
        "map.status.about",
        "map.status.selected",
        "map.status.initialization"
    ],
    
    examples : {         
        
        // ------------------------------------------------------
        // map.overlay Channels
        "test_map_overlay_create" :
        {
            "name":"Test",
            "overlayId":"2d882141-0d9e-59d4-20bb-58e6d0460699.1"            
        },
        
        "test_map_overlay_remove" : 
        {
               "overlayId":"2d882141-0d9e-59d4-20bb-58e6d0460699.1"
        },
        
        "test_map_overlay_hide" : 
        {
            "overlayId":"2d882141-0d9e-59d4-20bb-58e6d0460699.1"
        },
        
        "test_map_overlay_show" : 
        {
            "overlayId":"2d882141-0d9e-59d4-20bb-58e6d0460699.1"
        },
        
        "test_map_overlay_update" : 
        {
            "name":"New Name",
            "overlayId":"2d882141-0d9e-59d4-20bb-58e6d0460699.1"
        },
        
        // ------------------------------------------------------
        // map.feature Channels
        
        "test_map_feature_plot_kml" :
        {
           "overlayId":"2d882141-0d9e-59d4-20bb-58e6d0460699.1",
           "featureId":"example.mapWidget.1",
           "feature":"<kml xmlns=\"http://www.opengis.net/kml/2.2\" xmlns:gx=\"http://www.google.com/kml/ext/2.2\" xmlns:kml=\"http://www.opengis.net/kml/2.2\" xmlns:atom=\"http://www.w3.org/2005/Atom\"><Placemark id=\"example.mapWidget.1.1\"><name>World Trade Center</name><description><![CDATA[Site of World Trade Center]]></description><Style><IconStyle><Icon><href>https://localhost/widgets/mapWidget/images/blu-circle.png</href></Icon><hotSpot x=\"0.5\" y=\"0\" xunits=\"fraction\" yunits=\"fraction\"></hotSpot></IconStyle></Style><Point><coordinates>-74.01324033737183,40.71149172571141,0 </coordinates></Point></Placemark></kml>",
           "name":"World Trade Center",
           "zoom":true
        },
        
        "test_map_feature_plot_geojson" : 
        {
           "overlayId":"2d882141-0d9e-59d4-20bb-58e6d0460699.1",
           "featureId":"example.geojson.1",
           "format":"geojson",
           "feature":{
             "type":"FeatureCollection",
             "features":[
               {
                 "type":"Feature",
                 "timePrimitive":{
                   "timeSpan":{
                     "begin":"1937-01-01T12:00:27.87+00:20",
                     "end":"1976-01-01T12:00:27.87+00:20"
                   },
                   "timeSpans":[
                     {
                       "begin":"1937-01-01T12:00:27.87+00:20",
                       "end":"1976-01-01T12:00:27.87+00:20"
                     },
                     {
                       "begin":"1976-01-01T12:00:27.87+00:20",
                       "end":"1988-01-01T12:00:27.87+00:20"
                     }            
                   ]          
                 },
                 "geometry":{
                   "type":"Polygon",
                   "coordinates":[
                     [
                       100,
                       0
                     ],
                     [
                       101,
                       0
                     ],
                     [
                       101,
                       1
                     ],
                     [
                       100,
                       1
                     ],
                     [
                       100,
                       0
                     ]            
                   ]          
                 },
                 "properties":{
                   "style":{
                     "lineStyle":{
                       "color":{
                         "r":255,
                         "g":0,
                         "b":255,
                         "a":0.5
                       }              
                     },
                     "polyStyle":{
                       "color":{
                         "r":0,
                         "g":255,
                         "b":0,
                         "a":0.25
                       }              
                     },
                     "name":"test polygon",
                     "id":"tp13456",
                     "description":"polygon pop-up text"
                   }          
                 }        
               },
               {
                 "type":"Feature",
                 "geometry":{
                   "type":"Line",
                   "coordinates":[
                     [
                       80,
                       3
                     ],
                     [
                       81,
                       3
                     ],
                     [
                       81,
                       5
                     ],
                     [
                       82,
                       2
                     ]            
                   ]          
                 },
                 "properties":{
                   "style":{
                     "lineStyle":{
                       "color":{
                         "r":0,
                         "g":255,
                         "b":255,
                         "a":0.5
                       }              
                     }            
                   }          
                 },
                 "name":"crossingLine",
                 "id":"0x45632",
                 "description":"this is a line you don’t want to cross"
               }      
             ]    
           },
           "name":"Sample GeoJSON Feature Collection",
           "zoom":true,
           "readOnly":false
        },
        
        "test_map_feature_plot_aoi" : 
        {
           "overlayId":"2d882141-0d9e-59d4-20bb-58e6d0460699.1",
           "featureId":"example.aoi.1",
           "format":"geojson",
           "feature":{
             "type":"Feature",
             "geometry":{
               "type":"point",
               "coordinates":[
                 100,
                 0
               ]      
             }    
           },
           "properties":{
             "name":"SampleAOIBufferedpoint(i.e., Point/Radius)",
             "aoi":{
               "type":"point-radius",
               "buffer":1000
             },
             "style":{
               "lineStyle":{
                 "color":{
                   "r":255,
                   "g":0,
                   "b":255,
                   "a":1
                 }        
               },
               "polyStyle":{
                 "color":{
                   "r":0,
                   "g":255,
                   "b":25,
                   "a":0.5
                 },
                 "iconStyle":{
                   "url":"http: //www.coolicons.org/icon"
                 }        
               },
               "id":"0x75023443",
               "description":"ThisisimportanttextfortheAOIpopup"
             }    
           },
           "zoom":true,
           "readOnly":false
        },
        
        "test_map_feature_plot_batch" :
        {
           "features":[
             {
               "featureId":"example.mapWidget.1",
               "feature":"<kml xmlns=\"http://www.opengis.net/kml/2.2\" xmlns:gx=\"http://www.google.com/kml/ext/2.2\" xmlns:kml=\"http://www.opengis.net/kml/2.2\" xmlns:atom=\"http://www.w3.org/2005/Atom\"><Placemark id=\"example.mapWidget.1.1\"><name>World Trade Center</name><description><![CDATA[Site of World Trade Center]]></description><Style><IconStyle><Icon><href>https://localhost/widgets/mapWidget/images/blu-circle.png</href></Icon><hotSpot x=\"0.5\" y=\"0\" xunits=\"fraction\" yunits=\"fraction\"></hotSpot></IconStyle></Style><Point><coordinates>-74.01324033737183,40.71149172571141,0 </coordinates></Point></Placemark></kml>",
               "name":"World Trade Center"
             },
             {
               "featureId":"example.mapWidget.2",
               "feature":"<kml xmlns=\"http://www.opengis.net/kml/2.2\" xmlns:gx=\"http://www.google.com/kml/ext/2.2\" xmlns:kml=\"http://www.opengis.net/kml/2.2\" xmlns:atom=\"http://www.w3.org/2005/Atom\"><Placemark id=\"example.mapWidget.1.2\"><name>911 Memorial Museum</name><description><![CDATA[Site of 911 Memorial Museum]]></description><Style><IconStyle><Icon><href>https://localhost/widgets/mapWidget/images/blu-circle.png</href></Icon><hotSpot x=\"0.5\" y=\"0\" xunits=\"fraction\" yunits=\"fraction\"></hotSpot></IconStyle></Style><Point><coordinates>-74.0136,40.7117,0 </coordinates></Point></Placemark></kml>",
               "name":"911 Memorial Museum"
             },
             {
               "featureId":"example.mapWidget.3",
               "feature":"<kml xmlns=\"http://www.opengis.net/kml/2.2\" xmlns:gx=\"http://www.google.com/kml/ext/2.2\" xmlns:kml=\"http://www.opengis.net/kml/2.2\" xmlns:atom=\"http://www.w3.org/2005/Atom\"><Placemark id=\"example.mapWidget.1.3\"><name>Millenium Hilton</name><description><![CDATA[Site of Millenium Hilton]]></description><Style><IconStyle><Icon><href>https://localhost/widgets/mapWidget/images/blu-circle.png</href></Icon><hotSpot x=\"0.5\" y=\"0\" xunits=\"fraction\" yunits=\"fraction\"></hotSpot></IconStyle></Style><Point><coordinates>-74.0103,40.7111,0 </coordinates></Point></Placemark></kml>",
               "name":"Millenium Hilton"
             },
             {
               "featureId":"example.mapWidget.4",
               "feature":"<kml xmlns=\"http://www.opengis.net/kml/2.2\" xmlns:gx=\"http://www.google.com/kml/ext/2.2\" xmlns:kml=\"http://www.opengis.net/kml/2.2\" xmlns:atom=\"http://www.w3.org/2005/Atom\"><Placemark id=\"example.mapWidget.1.4\"><name>911 Tribute Center</name><description><![CDATA[Site of 911 Tribute Center]]></description><Style><IconStyle><Icon><href>https://localhost/widgets/mapWidget/images/blu-circle.png</href></Icon><hotSpot x=\"0.5\" y=\"0\" xunits=\"fraction\" yunits=\"fraction\"></hotSpot></IconStyle></Style><Point><coordinates>-74.0124,40.7101,0 </coordinates></Point></Placemark></kml>",
               "name":"911 Tribute Center"
             }    
           ],
           "overlayId":"2d882141-0d9e-59d4-20bb-58e6d0460699.1",
           "format":"kml",
           "zoom":false,
           "readOnly":false
        },
        
        "test_map_feature_plot_url_kml" :
        {
            "overlayId":"2d882141-0d9e-59d4-20bb-58e6d0460699.1",
            "featureId":"example.mapWidget.2",
            "url":"https://developers.google.com/kml/documentation/KML_Samples.kml",
            "name":"Samples",
            "zoom":true
        },
        
        "test_map_feature_plot_url_wms" :
        {
            "overlayId":"xyz",
            "featureId":"def",
            "name":"Bodies of Water",
            "format":"wms",
            "url":"http://demo.opengeo.org/geoserver/wms",
            "params":{
              "layers":"topp:tasmania_water_bodies",
              "transparent":true,
              "format":"image/gif"
            }  
        },
        
        "test_map_feature_unplot" : 
        {
            "overlayId":"2d882141-0d9e-59d4-20bb-58e6d0460699.1",
            "featureId":"example.mapWidget.2"
        },
        
        "test_map_feature_unplot_batch" : 
        {
            "features":[
              {
                "featureId":"example.mapWidget.1"
              },
              {
                "featureId":"example.mapWidget.2"
              },
              {
                "featureId":"example.mapWidget.3"
              },
              {
                "featureId":"example.mapWidget.4"
              }    
            ],
            "overlayId":"2d882141-0d9e-59d4-20bb-58e6d0460699.1"
        },
        
        "test_map_feature_hide" : 
        {
            "overlayId":"2d882141-0d9e-59d4-20bb-58e6d0460699.1",
            "featureId":"example.mapWidget.2"
        },
        
        "test_map_feature_show" : {
            "overlayId":"2d882141-0d9e-59d4-20bb-58e6d0460699.1",
            "featureId":"example.mapWidget.2",
            "zoom":true
        },
        
        "test_map_feature_selected" :
        {
            "selectedId":"example.mapWidget.1.1",
            "selectedName":"World Trade Center",
            "featureId":"example.mapWidget.1",
            "overlayId":"2d882141-0d9e-59d4-20bb-58e6d0460699.1"
        },
        
        "test_map_feature_selected_batch" : {
            "features":[
              {
                "featureId":"example.mapWidget.1",
                "selectedName":"World Trade Center"
              },
              {
                "featureId":"example.mapWidget.2",
                "selectedName":"911 Memorial Museum"
              },
              {
                "featureId":"example.mapWidget.3",
                "selectedName":"Millenium Hilton"
              },
              {
                "featureId":"example.mapWidget.4",
                "selectedName":"911 Tribute Center"
              }    
            ],
            "overlayId":"2d882141-0d9e-59d4-20bb-58e6d0460699.1"            
        },
        
        "test_map_feature_deselected" : 
        {
            "deSelectedId":"example.mapWidget.1.1",
            "deSelectedName":"World Trade Center",
            "featureId":"example.mapWidget.1",
            "overlayId":"2d882141-0d9e-59d4-20bb-58e6d0460699.1"            
        },
        
        "test_map_feature_deselected_batch" : 
        {
            "features":[
              {
                "featureId":"example.mapWidget.1",
                "deSelectedName":"World Trade Center"
              },
              {
                "featureId":"example.mapWidget.2",
                "deSelectedName":"911 Memorial Museum"
              },
              {
                "featureId":"example.mapWidget.3",
                "deSelectedName":"Millenium Hilton"
              },
              {
                "featureId":"example.mapWidget.4",
                "deSelectedName":"911 Tribute Center"
              }    
            ],
            "overlayId":"2d882141-0d9e-59d4-20bb-58e6d0460699.1"            
        },
        
        "test_map_feature_update" : 
        {
            "overlayId":"2d882141-0d9e-59d4-20bb-58e6d0460699.1",
            "featureId":"example.mapWidget.2",
            "name":"New Name"            
        },
        
        // ------------------------------------------------------
        // map.view Channels
        
        "test_map_view_zoom" : 
        {
            "range":100000
        },
        
        "test_map_view_center_overlay" : 
        {
            "overlayId":"2tyjhp-23idk38-rml389k6kd-29-flsow2c"
        },
        
        "test_map_view_center_feature" : 
        {
            "overlayId":"2d882141-0d9e-59d4-20bb-58e6d0460699.1",
            "featureId":"example.mapWidget.1"
        },
        
        "test_map_view_center_location" : 
        {
            "location":{
              "lat":38.8708,
              "lon":-77.0558
            },
            "zoom":1000
        },
        
        "test_map_view_center_bounds" : 
        {
            "bounds":{
              "southWest":{
                "lat":24.5,
                "lon":-124
              },
              "northEast":{
                "lat":50.5,
                "lon":-79
              }    
            },
            "zoom":3000000
        },
        
        "test_map_view_clicked_keys" : 
        {
            "lat":40.195659093364654,
            "lon":-74.28955078125,
            "button":"right",
            "type":"single",
            "keys":[
              "shift",
              "ctrl"
            ]  
        },
        
        "test_map_view_clicked" : 
        {
            "lat":40.195659093364654,
            "lon":-74.28955078125,
            "button":"middle",
            "type":"double",
            "keys":[
              "none"
            ]  
        },
        
        // ------------------------------------------------------
        // map.status Channels
        "test_map_status_request" : 
        {
            "types":[
              "view",
              "about",
              "format",
              "selected"
            ]  
        },
        
        "test_map_status_view" :
        {
            "requester":"217c086f-719f-928f-5e75-972530cf0db6",
            "bounds":{
              "southWest":{
                "lat":39.46164364205549,
                "lon":-75.6134033203125
              },
              "northEast":{
                "lat":40.97575093157534,
                "lon":-73.10302734375
              }    
            },
            "center":{
              "lat":40.2205,
              "lon":-74.3579
            },
           "range":137500
        },

        "test_map_status_view_norequestor" :
        {
            "bounds":{
              "southWest":{
                "lat":39.46164364205549,
                "lon":-75.6134033203125
              },
              "northEast":{
                "lat":40.97575093157534,
                "lon":-73.10302734375
              }    
            },
            "center":{
              "lat":40.2205,
              "lon":-74.3579
            },
            "range":137500
        },

        "test_map_status_format" : 
        {
            "formats":[
              "kml",
              "geojson",
              "wms"
            ]  
        },

        "test_map_status_format_czml" : 
        {
            "formats":[
              "kml",
              "geojson",
              "wms",
              "czml"
            ]  
        },

        "test_map_status_about" : 
        {
            "version":"1.0.0",
            "type":"2-D",
            "widgetName":"Common Map Widget",
            "extensions":[
              "clustering",
              "userManipulation"
            ]              
        },
        
        "test_map_status_selected" : 
        {
            "overlayId":"2d882141-0d9e-59d4-20bb-58e6d0460699.1",
            "selectedFeatures":[
              {
                "featureId":"example.mapWidget.1",
                "selectedId":"example.mapWidget.1.1"
              },
              {
                "featureId":"example.mapWidget.1",
                "selectedId":"example.mapWidget.1.2"
              },
              {
                "featureId":"example.mapWidget.2",
                "selectedId":"example.mapWidget.2.1"
              }    
            ]  
        },
        
        "test_map_status_initialization" : 
        {
            "status":"mapswapinprogress"
        }
    },

    // ------------------------------------------------------
    publishExample : function( id, option )
    {
        var token = id.split("_");
        token.splice(0,1);    // eliminate "test_"
        var channel = token.join(".");
        
        if ( option != null )
            id = id + "_" + option;

        $( "#cmapiChannel").val( channel );
        $( "#cmapiMessage").val( JSON.stringify( this.examples[id], null, 2 ) );
    },
  

    // ------------------------------------------------------
    getExample : function( id, option )
    {
        if ( option != null )
            id = id + "_" + option;
        
        return this.examples[id];
    },
    
    // ------------------------------------------------------
    onClickPublishButton : function()
    {
        var channel = $( "#cmapiChannel").val();
        var message = JSON.parse( $( "#cmapiMessage").val() );
        
        cmajs.runtimes.browser.mediator.publish({
            sender: "channelTest",
            channel: channel,
            message: message
        });
        
        $("#channelTestPage").hide();
        $("#mainPage").show();
        
        console.log( "[" + channel + "] " + "is published" );
    },
    
    // ------------------------------------------------------
    onClickTestButton : function()
    {
        $("#mainPage").hide();
        $("#geoPackageTestPage").hide();
        $("#channelTestPage").show();
        $("#aboutPage").hide();
        
        console.log( "[channelTestButton] clicked" );
    },
    
    responder: function(sender, message, channel)
    {
        $( "#cmapiReceivedSender").val( sender );
        $( "#cmapiReceivedChannel").val( channel );
        $( "#cmapiReceivedMessage").val( JSON.stringify( message, null, 2 ) );
    },
    
    // ------------------------------------------------------
    registerAllChannels : function()
    {
        var channels = edu.gmu.csiss.gpkg.cmapi.channel_test.channels;
        
        for ( var i=0; i < channels.length; i++ ) 
        {
            cmajs.runtimes.browser.mediator.subscribe({ 
                channel: channels[i],
                callback: function( sender, message, channel ) {
                    edu.gmu.csiss.gpkg.cmapi.channel_test.responder( sender, message, channel );
                }
            });
        }
    },
    
    
    // ------------------------------------------------------
    init : function() 
    {
        $( "#channelTestButton").click( function() {
            edu.gmu.csiss.gpkg.cmapi.channel_test.onClickTestButton();
        });

        $( "#publishButton").click( function() {
            edu.gmu.csiss.gpkg.cmapi.channel_test.onClickPublishButton();
        });

        edu.gmu.csiss.gpkg.cmapi.channel_test.registerAllChannels();
        
        console.log("[channel_test] initialized");
    }
        
};
