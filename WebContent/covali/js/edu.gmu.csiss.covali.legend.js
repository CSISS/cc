edu.gmu.csiss.covali.legend = {

    getLegendIdBySide: function(side){

        var id = "legend"+edu.gmu.csiss.covali.map.getNumberBySide(side);

        return id;

    },

    getSideByLegendId: function(id){

        var side = "";

        if(id == "legend1"){

            side = "left";

        }else if(id == "legend2"){

            side = "right";

        }

        return side;

    },

    /**
     * only used for updating the legend div element and the current legend layer variable
     */
    refresh: function(side){
        this.refreshLegendImage(side);
        this.refreshLegendScale(side);
        this.refreshLegendCaption(side);
    },

    refreshLegendImage: function(side) {
        var olayer = edu.gmu.csiss.covali.map.getLegendOLLayer(side);
        var lid = this.getLegendIdBySide(side);

        if(olayer) {
            var legendurl = olayer.get('legendurl');

            var width = 100;

            if($("#"+lid).width()!=0){
                width = $("#"+lid).width();
            }

            var styles = olayer.getSource().getParams()['STYLES'];
            if(styles) {
                var palette = styles.split('/')[1];
                legendurl = edu.gmu.csiss.covali.util.setUrlParameterByName(legendurl, 'PALETTE', palette);
            }

            $('#'+lid).css("background-image", "url(" + legendurl + "&VERTICAL=false&COLORBARONLY=true&height=20&width=" + width + ")");


        } else {
            $('#'+lid).css("background-image", "url('')");

        }

        this.refreshLegendScale(side);

    },

    /**
     * update the numbers in the scale bar
     */
    refreshLegendScale: function(side){
        $("#min"+side).text('');
        $("#max"+side).text('');
        $("#middle"+side).text('');

        var olayer = edu.gmu.csiss.covali.map.getLegendOLLayer(side);

        if(!olayer) {
            return;
        }

        var layerdetails = olayer.get('layerdetails');
        if(!layerdetails) {
            return;
        }

        var minmax = [null,null];
        if(olayer && olayer.getSource().getParams()["COLORSCALERANGE"]){
            minmax = olayer.getSource().getParams()["COLORSCALERANGE"].split(",");
        } else {
            minmax = [Number(layerdetails.scaleRange[0]), Number(layerdetails.scaleRange[1])];
        }


        $("#min"+side).text(minmax[0]);

        $("#max"+side).text(minmax[1]);

        var avg = (Number(minmax[0])+Number(minmax[1]))/2;
        $("#middle"+side).text(avg.toFixed(5));
    },

    /**
     * update the markup in the legend bar
     */
    refreshLegendCaption: function(side){
        var caption_id = "title-" + edu.gmu.csiss.covali.map.getMapContainerIdBySide(side);
        $("#"+caption_id).html('');

        var olayer = edu.gmu.csiss.covali.map.getLegendOLLayer(side);
        if(!olayer) {
            return;
        }

        var layername = olayer.get('name');
        var time = olayer.getSource().getParams()['TIME'];
        var elevation = olayer.getSource().getParams()['ELEVATION'];


        var captionhtml = "<div id=\"legendcaption-"+side+"\"></div>" +
            //"<div style=\"height: 30px;\">" +
            "<table style='width: 100%;'>"+
            //"<tbody>" +
            "<tr>" +
            "<td style=\"width 60px; height: 12px !important; padding:0px 15px 0px 15px !important;\" align=\"left\"><font color=\"#0841E4\">NAME: </font></th>" +
            "<td style=\"height: 12px !important; padding:0px 5px 0px 5px !important;\" align=\"left\">"+layername+"</td>" +
            "<td style=\"height: 12px !important; padding:0px 5px 0px 5px !important;\" align=\"right\"></td>" +
            "</tr>";

        if(time){
            var timesteps = olayer.get('timesteps');
            var timestepNum = timesteps.indexOf(time) + 1;

            var tsCaption = '';
            if(timesteps && timesteps.length > 1) {
                tsCaption = "<span>(" + timestepNum + " of " + timesteps.length + ") </span>";

                tsCaption += '<button class="fa fa-angle-left" id="timestep-back"> </button>';
                tsCaption += '<button class="fa fa-angle-right" id="timestep-forward"> </button>';

            }


            //captionhtml += "<br><font color=\"#0841E4\">TIME: </font>" + time;
            captionhtml +=
                "<tr>" +
                "<td style=\"width: 60px; height: 12px !important; padding:0px 15px 0px 15px !important;\" align=\"left\"><font color=\"#0841E4\">TIME: </font></th>" +
                "<td style=\"height: 12px !important; padding:0px 5px 0px 5px !important;\" align=\"left\">"+time+"</td>" +
                "<td style=\"width: 200px; height: 12px !important; padding:0px 5px 0px 5px !important;\" align=\"right\">"+tsCaption +"</td>" +

                "</tr>";

        }

        if(elevation){
            var elevationsteps = olayer.get('elevationsteps');
            var elevationstepNum = elevationsteps.indexOf(elevation) + 1;

            var esCaption = '';
            if(elevationsteps && elevationsteps.length > 1) {
                esCaption = "<span>(" + elevationstepNum + " of " + elevationsteps.length + ") </span>";
                esCaption += '<button class="fa fa-angle-left" id="elevationstep-back"> </button>';
                esCaption += '<button class="fa fa-angle-right" id="elevationstep-forward"> </button>';
            }

            //captionhtml += "<br><font color=\"#0841E4\">ELEVATION: </font>" + elevation;
            captionhtml +=
                "<tr>" +
                "<td style=\"height: 12px !important; padding:0px 15px 0px 15px !important;\" align=\"left\"><font color=\"#0841E4\">ELEVATION: </font></th>" +
                "<td style=\"height: 12px !important; padding:0px 5px 0px 5px !important;\" align=\"left\">"+elevation +"</td>" +
                "<td style=\"height: 12px !important; padding:0px 5px 0px 5px !important;\" align=\"right\">"+ esCaption +"</td>" +
                "</tr>";
        }
        captionhtml+= "</table>";//+
        //"</div>";


        $("#"+caption_id).html(captionhtml);
        $("#"+caption_id).find('#timestep-back').click(function() {
            edu.gmu.csiss.covali.map.stepDimension(side, layername, 'time', 'back');
        });
        $("#"+caption_id).find('#timestep-forward').click(function() {
            edu.gmu.csiss.covali.map.stepDimension(side, layername, 'time', 'forward');
        });
        $("#"+caption_id).find('#elevationstep-back').click(function() {
            edu.gmu.csiss.covali.map.stepDimension(side, layername, 'elevation', 'back');
        });
        $("#"+caption_id).find('#elevationstep-forward').click(function() {
            edu.gmu.csiss.covali.map.stepDimension(side, layername, 'elevation', 'forward');
        });

    },

}