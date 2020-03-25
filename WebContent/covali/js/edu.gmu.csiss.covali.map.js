/**
 * @author Ziheng Sun
 * @date 2018.06.01
 */

edu.gmu.csiss.covali.map = {
    animation_left_id: null,

    animation_right_id: null,


    init: function(){
        this.addBoundaryWMS();
    },



    moveLayerBack: function(side, layername) {
        var olayer1 = this.getOLLayerByName(side, layername);

        var oldZIndex = olayer1.getZIndex();
        var newZIndex = oldZIndex - 1;

        // already in the back
        if(newZIndex < 1) {
            return;
        }

        var olayer2 = this.getOLLayerByZIndex(side, newZIndex);

        olayer1.setZIndex(newZIndex);
        olayer2.setZIndex(oldZIndex);

        edu.gmu.csiss.covali.legend.refresh(side);

    },


    moveLayerFront: function(side, layername) {
        var olayer1 = this.getOLLayerByName(side, layername);

        var oldZIndex = olayer1.getZIndex();
        var newZIndex = oldZIndex + 1;

        // already in the front. can't go above overlay
        if(oldZIndex == this.getTopZIndex(side) || newZIndex >= 99) {
            return;
        }

        var olayer2 = this.getOLLayerByZIndex(side, newZIndex);

        olayer1.setZIndex(newZIndex);
        olayer2.setZIndex(oldZIndex);

        edu.gmu.csiss.covali.legend.refresh(side);
    },


    getTopZIndex: function(side) {
        var maxZIndex = 0;

        var olmap = this.getMapBySide(side);
        olmap.getLayers().forEach(function (olayer) {
            var zIndex = olayer.getZIndex();
            if(zIndex > maxZIndex && zIndex != 99) {
                maxZIndex = zIndex;
            }

        });

        return maxZIndex;
    },

    getOLLayerByZIndex: function(side, zIndex) {
        var olmap = this.getMapBySide(side);
        return olmap.getLayers().getArray().find(function (olayer) {
            return olayer.getZIndex() == zIndex;

        });
    },


    // the zindex topmost layer that is visible and has a legend (TileWMS - not Vector layer)
    getLegendOLLayer: function(side) {
        var zIndex = this.getTopZIndex(side);

        while (zIndex > 0) {
            var olayer = this.getOLLayerByZIndex(side, zIndex);
            if(olayer.getVisible() && olayer.getSource() instanceof ol.source.TileWMS) {
                return olayer;
            }

            zIndex--;
        }

        return null;
    },


    getOLLayerByName: function(side, layername) {
        var olmap = this.getMapBySide(side);
        return olmap.getLayers().getArray().find(function (olayer) {
            return olayer.get('name') == layername;
        });
    },


    getMapVisible: function(side){
        var id = this.getMapContainerIdBySide(side);

        return $("#"+id).is(":visible");
    },

    /**
     * This function controls the show/hide of the left/right map panel
     */
    setMapVisible: function(side, visible){

        var id = this.getMapContainerIdBySide(side);

        var otherside = this.getOtherSide(side);

        var otherid = this.getMapContainerIdBySide(otherside);

        var othermap = this.getMapBySide(otherside);

        if(visible){

            //show map

            $("#"+id).show();

            $("#"+otherid).removeClass("col-xs-12");

            $("#"+otherid).addClass("col-xs-6");

            othermap.updateSize();

        }else{

            //hide map

            $("#"+id).hide();

            $("#"+otherid).removeClass("col-xs-6");

            $("#"+otherid).addClass("col-xs-12");

            othermap.updateSize();

        }
    },


    getMapContainerIdBySide: function(side){

        var id = "openlayers"+this.getNumberBySide(side);

        return id;

    },

    getNumberBySide: function(side){

        var num = 1;

        if(side=="right"){

            num = 2;

        }

        return num;

    },


    getOtherSide: function(side) {
        if(side == 'left') {
            return 'right';
        }

        return 'left';
    },


    getMapBySide: function(side){

        var id = this.getMapContainerIdBySide(side);

        return edu.gmu.csiss.gpkg.cmapi.openlayers.getMap(id);

    },


    addWMSLayer: function(side, url, layername, stylename, time, elevation, timesteps, elevationsteps){
        var legendurl = edu.gmu.csiss.covali.wms.getLegendUrl(side, layername, stylename);

        var params = {'LAYERS': layername,
            'TILED': true,
            'VERSION': '1.3.0',
            'TIME': time,
            'LEGEND': legendurl
        };

        if(time){
            params.TIME = time;
        }

        if(elevation){
            params.ELEVATION = elevation;
        }

        var olayer = new ol.layer.Tile({
            //extent: [2033814, 6414547, 2037302, 6420952],
            //preload: Infinity,
            name: layername,
            title: layername,
            visible: true,
            source: new ol.source.TileWMS({
//					  LAYERS=IR&ELEVATION=0&TIME=2018-05-31T02%3A00%3A19.000Z&TRANSPARENT=true&STYLES=boxfill%2Frainbow&COLORSCALERANGE=-50%2C50&NUMCOLORBANDS=20&LOGSCALE=false&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image%2Fpng&SRS=EPSG%3A4326&BBOX=-101.47971029369,19.92840558883,-85.775652352431,35.632463530092&WIDTH=256&HEIGHT=256
//				    url: 'http://thredds.ucar.edu/thredds/wms/grib/NCEP/GEFS/Global_1p0deg_Ensemble/members-analysis/GEFS_Global_1p0deg_Ensemble_ana_20180520_0600.grib2',
                url: url,
                params: params,
                crossOrigin: 'anonymous'
            })
        });

        olayer.set('legendurl', legendurl);

        if(!timesteps) {
            timesteps = [time];
        }
        olayer.set('timesteps', timesteps);

        if(!elevationsteps) {
            if(elevation) {
                elevationsteps = [elevation];
            } else {
                elevationsteps = [];
            }
        }
        olayer.set('elevationsteps', elevationsteps);

        this.addOLLayer(side, olayer);

        // get layer metadata and refresh the legend
        $.ajax({
            contentType: "application/x-www-form-urlencoded", //this is by default

            type: "GET",

            url: "../../ncWMS2/wms?request=GetMetadata&item=layerDetails&layerName=" + olayer.get('name'),

            success: function(obj){
                olayer.set('layerdetails', obj);
                edu.gmu.csiss.covali.legend.refresh(side);
            }

        });

    },

    addOLLayer: function(side, olayer) {
        var zIndex = edu.gmu.csiss.covali.map.getTopZIndex(side) + 1;
        olayer.setZIndex(zIndex);

        var olmap = this.getMapBySide(side);
        olmap.addLayer(olayer);

        edu.gmu.csiss.covali.legend.refresh(side);
    },

    removeLayer: function(side, layername) {
        var olayer = edu.gmu.csiss.covali.map.getOLLayerByName(side, layername);
        var deletedZIndex = olayer.getZIndex();

        // we are removing the top visible legend map
        if(this.getLegendOLLayer(side).get('name') == layername) {
            edu.gmu.csiss.covali.statistics.clearAllPopupsOnAMap(side);
        }

        edu.gmu.csiss.covali.map.clearAnimation(side, layername);

        var olmap = this.getMapBySide(side);

        olmap.removeLayer(olayer);

        // re-sort zindexes
        olmap.getLayers().forEach(function(ol) {
            var z = ol.getZIndex();
            if(z > deletedZIndex && z !=  99) {
                ol.setZIndex(z-1);
            }
        });

        edu.gmu.csiss.covali.legend.refresh(side);
    },


    // this is a lower level method than addOLLAyer
    // it sets zIndex to 99 which is treated differently by otehr code  that works with layers
    // zIndex == 99 is non-reorderable, non-deletable, always on top, hide-able.
    // zIndex == 99 has no legendurl or legend details
    addBoundaryWMS: function(){

        var leftmap = edu.gmu.csiss.gpkg.cmapi.openlayers.getMap("openlayers1");

        var rightmap = edu.gmu.csiss.gpkg.cmapi.openlayers.getMap("openlayers2");

        var myLayer1303 = new ol.layer.Image({
            name: "World Boundary",
            title: "World Boundary Overlay",
            zIndex: 99,
            source: new ol.source.ImageWMS({
                url: 'http://gis.csiss.gmu.edu/cgi-bin/mapserv.cgi',
                params: {
                    map: "/media/gisiv01/world/world_modissin.map",
                    'LAYERS': 'world_countries_sin,world_state_provinces_sin',
                    'VERSION': '1.3.0'
                },
                serverType: 'mapserver',
                crossOrigin: null
            })
        });

        leftmap.addLayer(myLayer1303);


        var myLayer1304 = new ol.layer.Image({
            name: "World Boundary",
            title: "World Boundary Overlay",
            zIndex: 99,
            source: new ol.source.ImageWMS({
                url: 'http://gis.csiss.gmu.edu/cgi-bin/mapserv.cgi',
                params: {
                    map: "/media/gisiv01/world/world_modissin.map",
                    'LAYERS': 'world_countries_sin,world_state_provinces_sin',
                    'VERSION': '1.3.0'
                },
                serverType: 'mapserver',
                crossOrigin: null
            })
        });

        rightmap.addLayer(myLayer1304);

    },

    // dimension = 'time' or 'elevation'
    stepDimension: function(side, layername, dimension, direction, amount, from, to, looparound) {
        if(!amount) {
            amount = 1;
        }

        var olayer = this.getOLLayerByName(side, layername);
        if(!olayer) {
            return;
        }

        var allSteps = olayer.get(dimension + 'steps');
        if(!from) {
            from = 0;
        }

        if(!to) {
            to = allSteps.length - 1;
        }

        var paramName = dimension.toUpperCase(); // TIME or ELEVATION
        var currentStep = olayer.getSource().getParams()[paramName];

        if(!currentStep || !allSteps || allSteps.length < 2) {
            return;
        }

        var i = allSteps.indexOf(currentStep);

        if(direction == 'back') {
            i -= amount;
        } else {
            i += amount;
        }

        if(i < from) {
            i = from;
        }

        if(i > to) {
            if(looparound)
            {
                i = from;
            } else {
                i = allSteps.length - 1;
            }
        }

        var newStep = allSteps[i];

        var update = [];
        update[paramName] = newStep;
        olayer.getSource().updateParams(update);
        edu.gmu.csiss.covali.legend.refreshLegendCaptionAnimated(side, layername);
    },


    setAnimation: function(side, layername, starttime, endtime, framerate) {
        var olayer = this.getOLLayerByName(side, layername);
        var timesteps = olayer.get('timesteps');

        var from = timesteps.indexOf(starttime);
        var to = timesteps.indexOf(endtime);

        var animation = window.setInterval(function(){
            edu.gmu.csiss.covali.map.stepDimension(side, layername, 'time', 'forward', 1, from, to, true);
        }, 1000/framerate);


        olayer.set('animation', animation);
        edu.gmu.csiss.covali.legend.refreshLegendCaption(side);
    },

    clearAnimation: function(side, layername) {
        var olayer = this.getOLLayerByName(side, layername);
        var animation = olayer.get('animation');
        window.clearInterval(animation);
        olayer.set('animation', null);

        edu.gmu.csiss.covali.legend.refreshLegendCaption(side);

    }
}