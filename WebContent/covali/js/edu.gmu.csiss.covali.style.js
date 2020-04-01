edu.gmu.csiss.covali.style = {


    /**
     * The event listener to legend click
     */
    legendclick: function(side){
        var layer = edu.gmu.csiss.covali.map.getLegendOLLayer(side);

        var legendurl = layer.get('legendurl');
        var layerdetails = layer.get('layerdetails');

        layer.getP


        var palettename = edu.gmu.csiss.covali.util.getUrlParameterByName(legendurl, "PALETTE") ;

        if(!palettename){
            palettename = edu.gmu.csiss.covali.util.getUrlParameterByName(legendurl, "palette");
        }

        var sp = [null, null];

        if(layer.getSource().getParams()["STYLES"]){

            sp = layer.getSource().getParams()["STYLES"].split("/");

        }else{

            sp = [layerdetails.supportedStyles[0], palettename];

        }

        var minmax = [null,null];

        if(layer.getSource().getParams()["COLORSCALERANGE"]){
            minmax = layer.getSource().getParams()["COLORSCALERANGE"].split(",");
        }else{
            minmax = [Number(layerdetails.scaleRange[0]), Number(layerdetails.scaleRange[1])];
        }

        var belowabove = [null, null];

        if(layer.getSource().getParams()["ABOVEMAXCOLOR"]){
            belowabove[0] = layer.getSource().getParams()["BELOWMINCOLOR"];
            belowabove[1] = layer.getSource().getParams()["ABOVEMAXCOLOR"];
        }else{
            belowabove[0] = layerdetails.belowMinColor;
            belowabove[1] = layerdetails.aboveMaxColor;
        }

        this.showStyleManager(side,
            sp[1],
            minmax[0],
            minmax[1],
            sp[0],
            belowabove[0],
            belowabove[1],
        );

    },


    showStyleManager: function(side, palettename, min, max, currentstyle, belowcolor, abovecolor){
        var olayer = edu.gmu.csiss.covali.map.getLegendOLLayer(side);
        var layername = olayer.get('name');

        var legendurl = olayer.get('legendurl');
        var layerdetails = olayer.get('layerdetails');


        var stylelist = "<select class=\"form-control\" id=\"stylelist\" style=\"width:auto;\"> ";

        for(var i=0;i<layerdetails.supportedStyles.length;i++){

            var selected = "";

            if(currentstyle == layerdetails.supportedStyles[i]){

                selected = " selected=\"selected\"";

            }

            stylelist += "    <option value=\""+layerdetails.supportedStyles[i] +"\" "+ selected +" >"

                + layerdetails.supportedStyles[i] + "</option> ";

        }

        stylelist += "  </select>";

        var bc = belowcolor.slice(-6);

        var ac = abovecolor.slice(-6);

        var content = "<div class=\"modal-body\"><dl class=\"row\" style=\"font-size: 12px; padding: 5px; margin:0px\">"+

            "<div class=\"row\" style=\"padding: 10px;\">" +

            "<p>Layer: " + layername + "</p>"+

            "</div>"+

            "<div class=\"row\">" +

            "	<div class=\"col-md-1\">  " +

            "		<div id=\"colorbelowblock\" style=\"width:100%;height:30px;background-color:#"+bc+";\" alt=\""+ belowcolor +"\"></div>"+

            "	</div>" +

            "	<div class=\"col-md-10\">  " +

            "		<img id=\"paletteselector\" onclick=\"edu.gmu.csiss.covali.style.paletteselector('" + side + "')\" src=\""+

            legendurl + "&palette=" + palettename + "&height=1&VERTICAL=False&COLORBARONLY=True\"" +

            " 		style=\"width:100%;height:30px;\" alt=\""+palettename+"\" />" +

            "	</div>" +

            "	<div class=\"col-md-1\">  " +

            "		<div id=\"coloraboveblock\" style=\"width:100%;height:30px;background-color:#"+ac+";\" alt=\""+ abovecolor +"\" ></div>"+

            "	</div>" +

            "</div>" +

            "<br/>" +

            "<div class=\"row\">" +

            "	<div class=\"col-md-12\">" +

            "		<span class=\"pull-left\">Min: <input id=\"min\" type=\"text\"  style=\"width:60px\" value=\""+

            min + "\" /></span> " +

            "		<span class=\"pull-right\">Max: <input id=\"max\" type=\"text\" style=\"width:60px\" value=\""+

            max + "\" /></span>"+

            "	</div>"+

            "</div>"+

            "<br/>" +

            "<div class=\"row\">" +

            "	<div class=\"col-md-12\">"+

            "		<span class=\"col-centered\">Style: "+stylelist+"</span> " +

            "	</div>"+

            "</div>"+

            "<br/>" +

            "<div class=\"row\">" +

            "	<div class=\"col-md-6\">"+

            "		<div class=\"input-group colorpicker-component\">Color Below Min: <input id=\"colorbelowpicker\" type=\"text\" value=\""+

            bc +"\" class=\"form-control\"/></div> " +

            "	</div>"+

            "	<div class=\"col-md-6\">"+

            "		<div class=\"input-group colorpicker-component\">Color Above Max: <input id=\"colorabovepicker\" type=\"text\" value=\""+

            ac +"\" class=\"form-control\"/></div> " +

            "	</div>"+

            "</div></dl></div>";

        edu.gmu.csiss.covali.menu.closeAllDialogs();
        var dialogName = 'edu.gmu.csiss.covali.map.jsframe.StyleManager';
        var dialogTitle = "Style Manager for " + side + " map";

        content += "<div class=\"modal-footer\">" +
            "<p><span class=\"btn btn-primary\" onclick=\'edu.gmu.csiss.covali.style.syncFrom(\""+edu.gmu.csiss.covali.map.getOtherSide(side)+"\")\'>Sync from "+edu.gmu.csiss.covali.map.getOtherSide(side)+"</span>"+
            "<span class=\"btn btn-primary\" onclick=\"edu.gmu.csiss.covali.style.resetDefaultStyle('" + side + "')\">Reset</span>"+
            "<span class=\"btn btn-primary\" onclick=\'edu.gmu.csiss.covali.style.applyStyle(\""+side + "\")\'>Apply</span>"+
            "<span class=\"btn btn-primary\" onclick=\'edu.gmu.csiss.covali.menu.closeDialog(\""+dialogName+"\")\'>Close</span></p>"+
            "</div>";

        edu.gmu.csiss.covali.menu.createDialog(dialogName, dialogTitle, content, 420);
        this.styleManagerOnShown(belowcolor, abovecolor);
    },

    choosePalette: function(side, obj){
        var olayer = edu.gmu.csiss.covali.map.getLegendOLLayer(side);
        var legendurl = olayer.get('legendurl');

        var palettename = $(obj).val();

        //switch palette in the style manager

        $("#paletteselector").attr("src", legendurl+ "&palette=" + palettename +"&height=1&VERTICAL=FALSE&COLORBARONLY=True");

        $("#paletteselector").attr("alt", palettename);

        edu.gmu.csiss.covali.menu.closeDialog('edu.gmu.csiss.covali.map.jsframe.PaletteSelector');
    },

    paletteselector: function(side){
        var olayer = edu.gmu.csiss.covali.map.getLegendOLLayer(side);
        var legendurl = olayer.get('legendurl');
        var layerdetails = olayer.get('layerdetails');

        var content = "";

        for(var i=0; i<layerdetails.palettes.length; i++){

            var palettename = layerdetails.palettes[i];

            var paletteurl = legendurl + "&palette=" + palettename +"&height=1&VERTICAL=FALSE&COLORBARONLY=True";

            var checked = "";

            if(palettename==$("#paletteselector").attr("alt")){

                checked = "checked=\"checked\"";

            }

            content += "	<div class=\"row\" style=\"font-size: 12px;\">"+

                "		<div class=\"col-md-9\"><img id=\"paletteselector\" src=\""+ paletteurl + "\"" +

                " 			style=\"width:100%;height:30px;\" alt=\"Palette\"></div>" +

                "	  	<div class=\"col-md-3\"><span><input type=\"radio\" onclick=\"edu.gmu.csiss.covali.style.choosePalette('" + side + "', this);\" name=\"palette\" value=\"" + palettename + "\" " + checked + " />" + palettename + "</span></div>" +

                "	</div>";

        }

        //edu.gmu.csiss.covali.menu.closeAllDialogs();
        var dialogName = 'edu.gmu.csiss.covali.map.jsframe.PaletteSelector';
        var dialogTitle = 'Palette Selector';

        content = "<div class=\"modal-body\"><dl class=\"row\" style=\"font-size: 12px; padding: 5px; margin:0px\">"+
            content+"</dl></div>"+
            "<div class=\"modal-footer\">" +
            //"<p><span class=\"btn btn-primary\" onclick=\'edu.gmu.csiss.covali.map.applyStyle(\""+legendid+"\",\""+legendurl+"\",\""+currentstyle+"\",\""+belowcolor+"\",\""
            //	+abovecolor+"\",\""+side+"\")\'>Apply</span>"+
            "<p><span class=\"btn btn-primary\" onclick=\'edu.gmu.csiss.covali.menu.closeDialog(\""+dialogName+"\")\'>Apply</span>"+
            "<span class=\"btn btn-primary\" onclick=\'edu.gmu.csiss.covali.menu.closeDialog(\""+dialogName+"\")\'>Close</span></p>"+
            "</div>";

        edu.gmu.csiss.covali.menu.createDialog(dialogName, dialogTitle, content, 600);
    },



    /**
     * show style manager.
     */

    syncFrom: function(otherside){

        //get the style of the top layer of the other map and put the number into the current style manager

        var thisside = edu.gmu.csiss.covali.map.getOtherSide(otherside);
        var thislayer = edu.gmu.csiss.covali.map.getLegendOLLayer(thisside);
        var thislegendurl = thislayer.get('legendurl');

        var olayer = edu.gmu.csiss.covali.map.getLegendOLLayer(otherside);

        if(olayer) {
            var layerdetails = olayer.get('layerdetails');
            var legendurl = olayer.get('legendurl');

            var palettename = edu.gmu.csiss.covali.util.getUrlParameterByName(legendurl, "PALETTE");

            if (!palettename) {
                palettename = edu.gmu.csiss.covali.util.getUrlParameterByName(legendurl, "palette");
            }

            var sp = [null, null];

            if (olayer.getSource().getParams()["STYLES"]) {

                sp = olayer.getSource().getParams()["STYLES"].split("/");

            } else {

                sp = [layerdetails.supportedStyles[0], palettename];

            }

            var minmax = [null, null];

            if (olayer.getSource().getParams()["COLORSCALERANGE"]) {
                minmax = olayer.getSource().getParams()["COLORSCALERANGE"].split(",");
            } else {

                minmax = [Number(layerdetails.scaleRange[0]), Number(layerdetails.scaleRange[1])];
            }

            var belowabove = [null, null];

            if (olayer.getSource().getParams()["ABOVEMAXCOLOR"]) {
                belowabove[0] = olayer.getSource().getParams()["BELOWMINCOLOR"];
                belowabove[1] = olayer.getSource().getParams()["ABOVEMAXCOLOR"];

            } else {
                belowabove[0] = layerdetails.belowMinColor;
                belowabove[1] = layerdetails.aboveMaxColor;

            }

            $("#paletteselector").attr("src", thislegendurl + "&palette=" + sp[1] + "&height=1&VERTICAL=FALSE&COLORBARONLY=True");

            $("#paletteselector").attr("alt", sp[1]);

            $("#min").val(minmax[0]);

            $("#max").val(minmax[1]);

            $("#colorbelowpicker").val("#" + belowabove[0].slice(-6));
            $("#colorbelowblock").css("background-color", $("#colorbelowpicker").val());

            $("#colorabovepicker").val("#" + belowabove[1].slice(-6));
            $("#coloraboveblock").css("background-color", $("#colorabovepicker").val());



        } else {

            console.warn("Cannot find the WMS layer on the other map!!");

        }

    },

    applyStyle: function(side){


        var style = $("#stylelist").val();

        var palette = $("#paletteselector").attr("alt");

        var minv = $("#min").val();

        var maxv = $("#max").val();

        var belowcolor = $("#colorbelowpicker").val();

        var abovecolor = $("#colorabovepicker").val();

        var bc = belowcolor.slice(-6);

        var ac = abovecolor.slice(-6);

        var newbelowcolor = belowcolor.replace(bc, $("#colorbelowpicker").val().slice(-6));

        var newabovecolor = abovecolor.replace(ac, $("#colorabovepicker").val().slice(-6));

        var olayer = edu.gmu.csiss.covali.map.getLegendOLLayer(side);
        var layername = olayer.get('name');
        var legendurl = olayer.get('legendurl');


        //change the layer source
        var oldparams = olayer.getSource().getParams();

        oldparams.LAYERS = layername;

        oldparams.TILED = true;

        oldparams.VERSION = '1.3.0';

        oldparams.COLORSCALERANGE = minv+","+maxv;

        oldparams.LEGEND = legendurl;

        oldparams.STYLES = style+"/"+palette;

        oldparams.ABOVEMAXCOLOR = newabovecolor;

        oldparams.BELOWMINCOLOR = newbelowcolor;

        olayer.setSource(new ol.source.TileWMS({

            url: olayer.getSource().getUrls()[0],

            params: oldparams

        }));

        edu.gmu.csiss.covali.legend.refresh(side);
    },

    resetDefaultStyle: function(side){
        var olayer = edu.gmu.csiss.covali.map.getLegendOLLayer(side);
        var legendurl = olayer.get('legendurl');
        var layerdetails = olayer.get('layerdetails');

        if(!layerdetails) {
            return;
        }

        var palettename = "default";

        var sp = [null, null];

        sp = [layerdetails.supportedStyles[0],palettename];

        var minmax = [Number(layerdetails.scaleRange[0]), Number(layerdetails.scaleRange[1])];

        var belowabove = [null, null];

        belowabove[0] = layerdetails.belowMinColor;

        belowabove[1] = layerdetails.aboveMaxColor;

        // var style = $("#stylelist").val()
        // var palette = $("#paletteselector").attr("alt");

        $("#paletteselector").attr("src", legendurl + "&palette=" + palettename +"&height=1&VERTICAL=FALSE&COLORBARONLY=True");

        $("#paletteselector").attr("alt", palettename);

        $("#min").val(minmax[0]);

        $("#max").val(minmax[1]);

        $("#colorbelowpicker").val("#" + belowabove[0].slice(-6));
        $("#colorbelowblock").css("background-color", $("#colorbelowpicker").val());

        $("#colorabovepicker").val("#" + belowabove[1].slice(-6));
        $("#coloraboveblock").css("background-color", $("#colorabovepicker").val());

    },

    styleManagerOnShown: function(belowcolor, abovecolor){

        var bc = belowcolor.slice(-6);

        var ac = abovecolor.slice(-6);

        $('#colorbelowpicker').colorpicker({"color":bc}).on('changeColor', function(){

            //change the color block as well

            $("#colorbelowblock").css("background-color", $("#colorbelowpicker").val());

        });

        $('#colorabovepicker').colorpicker({"color":ac}).on('changeColor', function(){

            $("#coloraboveblock").css("background-color", $("#colorabovepicker").val());

        });

    }

}
