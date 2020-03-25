/**
 *
 * All the methods related to the settings panel
 *
 * Author: Ziheng Sun
 *
 * Date: 06/19/2018
 *
 */

edu.gmu.csiss.covali.settings = {

    isSync: true,

    layerElementId: function(side, layername) {
        return side + '-' + layername.replaceAll(/[\/\\\.\#\,]/,'-');
    },

    checkLayer: function(side, layername, checked){
        var layer = edu.gmu.csiss.covali.map.getOLLayerByName(side, layername);

        // layer currently visible. now becoming invisble
        // until we hide it, it remains top layer and should have stats popups removed
        if(!checked) {
            edu.gmu.csiss.covali.statistics.changePopupVisibility(side, layername, checked);
        }

        layer.setVisible(checked);

        // layer was invisible and is now visible and possibly the top layer
        if(checked) {
            edu.gmu.csiss.covali.statistics.changePopupVisibility(side, layername, checked);
        }



        edu.gmu.csiss.covali.legend.refresh(side);
        this.redrawLayerControls();
    },

    changeOpacity: function(sliderinput, side, layername){

        var opacityval = Number($(sliderinput).val())/100;

        $(sliderinput).parent().find(".opacity-value").text(opacityval);

        var olmap = edu.gmu.csiss.covali.map.getMapBySide(side);

        olmap.getLayers().forEach(function (layer) {

            if (layer.get('name') == layername) {

//					layer.setVisible(checked);

                layer.setOpacity(opacityval);

            }

        });

    },

    delLayer: function(side, layername, noquestion){
        if(noquestion||confirm("Do you really want to delete this layer?")) {
            var olmap = edu.gmu.csiss.covali.map.removeLayer(side, layername);

            this.redrawLayerControls();
        }
    },

    /**
     * Move back
     */
    moveBack: function(side,layername){
        edu.gmu.csiss.covali.map.moveLayerBack(side, layername);
        this.redrawLayerControls();
    },

    /**
     * Move front
     */
    moveFront: function(side, layername){
        edu.gmu.csiss.covali.map.moveLayerFront(side, layername);
        this.redrawLayerControls();
    },

    checkBoxBasedOnLayerVisbility: function(side, layername){
        var olayer = edu.gmu.csiss.covali.map.getOLLayerByName(side, layername);

        if(olayer.getVisible()==true){
            return "checked";
        }else{
            return "";
        }
    },

    getOneLayerControl: function(side, layername, opacity){

        var opaval = Number(opacity);

        var layerId = this.layerElementId(side, layername);

        var olayer = edu.gmu.csiss.covali.map.getOLLayerByName(side, layername);
        var zIndex = olayer.getZIndex();
        var maxZIndex = edu.gmu.csiss.covali.map.getTopZIndex(side)

        var onecontrol = "<div class=\"checkbox\" id=\""+side+"_"+layerId+"\">"+
            "<label>"+
            //check/uncheck layer
            "<input type=\"checkbox\" "+this.checkBoxBasedOnLayerVisbility(side,layername)+" onchange=\"edu.gmu.csiss.covali.settings.checkLayer('"+
            side + "', '"+ layername + "', this.checked)\" value=\"\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Layer visibility\"/>" +
            //layer name
            "<span style=\"word-wrap:break-word;\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Layer name\">" + layername + "</span>" +
            "</br>";

        if(layername!="osm-basemap" && layername != "World Boundary"){
        	//delete button
            onecontrol += "<a href=\"javascript:void(0)\" onclick=\"edu.gmu.csiss.covali.settings.delLayer('"+
            side + "', '" + layername +
            "'); \" class=\"btn btn-inverse\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Remove layer\"><i class=\"glyphicon glyphicon-trash\"></i></a>";

            if(zIndex > 1) {
                //up (back) button
                onecontrol += "<a href=\"javascript:void(0)\" onclick=\"edu.gmu.csiss.covali.settings.moveBack('" +
                    side + "', '" + layername +
                    "'); \" class=\"btn btn-inverse\"><i class=\"glyphicon glyphicon-chevron-up\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Move layer to back!\"></i></a>";
            }

            if(zIndex < maxZIndex) {
                //down (front) button
                onecontrol += "<a href=\"javascript:void(0)\" onclick=\"edu.gmu.csiss.covali.settings.moveFront('" +
                    side + "', '" + layername +
                    "'); \" class=\"btn btn-inverse\"><i class=\"glyphicon glyphicon-chevron-down\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Move layer to front!\"></i></a>";
            }

            //switch button
            onecontrol += "<a href=\"javascript:void(0)\" onclick=\"edu.gmu.csiss.covali.settings.switchSide('"+
                side + "', '" + layername +
                "'); \" class=\"btn btn-inverse\"><i class=\"glyphicon glyphicon-transfer\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Move layer to the other map!\"></i></a>"+
                //add more button
                "<a href=\"javascript:void(0)\" onclick=\"edu.gmu.csiss.covali.wms.addMore('"+
                side + "', '" + layername +
                "'); \" class=\"btn btn-inverse\"><i class=\"glyphicon glyphicon-plus\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Add another layer!\"></i></a>";

        }

        //opacity slider bar
        onecontrol += "<input style=\"width:220px;\" oninput=\"edu.gmu.csiss.covali.settings.changeOpacity(this, '"+
            side + "', '" + layername +
            "');\" type=\"range\" class=\"slider\" min=\"0\" max=\"100\" value=\""+opaval*100+"\" /><p>Opacity: <span class=\"opacity-value\">"+opaval+"</span></p>"+
            "</label> "+
            "</div>";

        return onecontrol;

    },

    switchSide: function(side, layername){
        var otherside = edu.gmu.csiss.covali.map.getOtherSide(side);

        var olayer = edu.gmu.csiss.covali.map.getOLLayerByName(side, layername);

        edu.gmu.csiss.covali.map.removeLayer(side, layername);

        edu.gmu.csiss.covali.map.addOLLayer(otherside, olayer);

        this.redrawLayerControls();

    },

    redrawLayerControls: function(side) {
        $('#layertree-left').html(this.getLayerControl('left').html());
        $('#layertree-right').html(this.getLayerControl('right').html());
    },

    /**
     * Get layer control of either left or right side
     */
    getLayerControl: function(side){

        var id = "treeview-checkable-"+side;

        $tree = $("<div id=\""+id+"\"></div>");

        var olmap = edu.gmu.csiss.covali.map.getMapBySide(side);

        var layers =  olmap.getLayers().getArray();

        var fixedlayers = layers.slice(0,2);
        var sortablelayers = layers.slice(2);

        sortablelayers = sortablelayers.sort(function(l1, l2) {
            if(l1.getZIndex() < l2.getZIndex()) {
                return -1;
            }
            return 1;
        });

        layers = fixedlayers.concat(sortablelayers);

        layers.forEach(function(layer){

            var onecontrol = edu.gmu.csiss.covali.settings.getOneLayerControl(side, layer.get("name"), layer.getOpacity());

            $tree.append(onecontrol);

        });


        return $tree;

    },

    checkMap: function(side, checkstatus){

        edu.gmu.csiss.covali.map.setMapVisible(side, checkstatus);

    },

    /**
     * Disconnect or Reconnect the two maps
     */
    switchSync: function(checked){

        edu.gmu.csiss.covali.settings.isSync = checked;

        if(edu.gmu.csiss.covali.settings.isSync){

            edu.gmu.csiss.gpkg.cmapi.initialize.init();

        }else{

            edu.gmu.csiss.gpkg.cmapi.initialize.unregister();

        }


    },

    getContent: function(){

        var $lefttree = edu.gmu.csiss.covali.settings.getLayerControl("left");

        var $righttree = edu.gmu.csiss.covali.settings.getLayerControl("right");

        var leftstatus = "";

        if(edu.gmu.csiss.covali.map.getMapVisible("left")){

            leftstatus = "checked=\"checked\"";

        }

        var rightstatus = "";

        if(edu.gmu.csiss.covali.map.getMapVisible("right")){

            rightstatus = "checked=\"checked\"";

        }

        console.log("left status: " + leftstatus + " - right status: " + rightstatus );

        var synccheck = "";

        if(edu.gmu.csiss.covali.settings.isSync){

            synccheck = "checked=\"checked\"";

        }

        var $content = '<div class=\"row\">'+

            '<div class=\"col-md-12\"><h2>Map Control</h2></div>'+

            '<div class=\"col-md-12\"><span>Enable Map Synchronization:</span> <input type=\"checkbox\" id=\"map-sync\" onchange=\"edu.gmu.csiss.covali.settings.switchSync(this.checked)\" '+synccheck+' ></div>'+

            '<div class=\"col-md-6\" id=\"left-settings\">'+

            '	<h4>Left Map '+

            '	<input type=\"checkbox\" '+leftstatus+' id=\"left-map-switch\" onchange=\"edu.gmu.csiss.covali.settings.checkMap(\'left\', this.checked)\" value=\"\">'+

            '</h4>'+

            '<div id="layertree-left">'+

            $lefttree.html()+

            '</div>' +

            '</div>' +

            '<div class=\"col-md-6\" id=\"right-settings\" >'+

            '<h4>Right Map'+

            '	<input type=\"checkbox\" '+rightstatus+' id=\"left-map-switch\" onchange=\"edu.gmu.csiss.covali.settings.checkMap(\'right\', this.checked)\" value=\"\">'+

            '</h4>'+

            '<div id="layertree-right">'+

            $righttree.html()+

            '</div>' +

            '</div>';

        return $content;

    },

    init: function(){


        edu.gmu.csiss.covali.menu.closeAllDialogs();

        var dialogName = 'edu.gmu.csiss.covali.settings.jsframe.Settings';
        var dialogTitle = 'Settings';
        var content = "<div class=\"modal-body\"><dl class=\"row\" style=\"font-size: 12px; padding: 5px; margin:0px\">"+
            edu.gmu.csiss.covali.settings.getContent()+
            "</dl></div>"+
            "<div class=\"modal-footer\">" +
            "<p><span class=\"btn btn-primary\" onclick=\'edu.gmu.csiss.covali.menu.closeDialog(\""+dialogName+"\")\'>Ok</span>"+
            "<span class=\"btn btn-primary\" onclick=\'edu.gmu.csiss.covali.menu.closeDialog(\""+dialogName+"\")\'>Close</span></p>"+
            "</div>";
        edu.gmu.csiss.covali.menu.createDialog(dialogName, dialogTitle, content, 700, 840);

    }

};