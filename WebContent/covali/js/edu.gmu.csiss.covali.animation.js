/**
 * 
 * Create animation of netCDF/GRIB
 * 
 * @author Ziheng Sun
 * 
 */

edu.gmu.csiss.covali.animation = {

    createDialog: function(side, layername){
		var olayer = edu.gmu.csiss.covali.map.getOLLayerByName(side, layername);
		var timesteps = olayer.get('timesteps');


        var content = "<div class=\"row\" style=\"margin: 10px;\" id=\"frame-select\">"+
            "  <div class=\"form-group\">"+
            "    <label for=\"first-select\">From Timestep: </label>"+
            "    <select class=\"form-control\" id=\"first-select\">"+
            "    </select>"+
            "  </div>"+
            "  <div class=\"form-group\">"+
            "    <label for=\"last-select\">To Timestep: </label>"+
            "    <select class=\"form-control \" id=\"last-select\">"+
            "    </select>"+
            "  </div>"+
            "  <div class=\"form-group\">"+
            "    <label for=\"last-select\">Frame Rate: </label>"+
            "    <select class=\"form-control \" id=\"frame-rate\">"+
            "		<option value=\"1\">1fps</option>"+
            "		<option value=\"2\">2fps</option>"+
            "		<option value=\"5\">5fps</option>"+
            "		<option value=\"10\">10fps</option>"+
            "		<option value=\"15\">15fps</option>"+
            "		<option value=\"24\">24fps</option>"+
            "		<option value=\"30\">30fps</option>"+
            "    </select>"+
            "  </div>"+
            "</div>";


        edu.gmu.csiss.covali.menu.closeAllDialogs();

        var dialogName = 'edu.gmu.csiss.covali.animation.jsframe.CreateAnimation';
        var dialogTitle = 'Animate ' + layername;

        var content = "<div class=\"modal-body\"><dl class=\"row\" style=\"font-size: 12px; padding: 5px;\">"+
            content+
            "</dl></div>"+
            "<div class=\"modal-footer\">" +
            "<p><span class=\"btn btn-primary\" onclick=\'edu.gmu.csiss.covali.animation.createAnimation(\"" + side + "\",\"" +layername+"\")\'>Create</span></p>"+
            "</div>";

        edu.gmu.csiss.covali.menu.createDialog(dialogName, dialogTitle, content, 420, 700);
        this.animationDialogOnShown(timesteps);
    },

    animationDialogOnShown: function(timesteps){
        for(var i=0;i<timesteps.length;i++){

            var o1 = new Option("value", timesteps[i]);

            $(o1).html(timesteps[i]);

            $("#first-select").append(o1);

            var o2 = new Option("value", timesteps[i]);

            $(o2).html(timesteps[i]);

            $("#last-select").append(o2);
        }

        $("#last-select option:last").attr("selected", "selected");
    },
	
	createAnimation: function(side, layername){

    	starttime = $("#first-select").val();
    	
    	endtime = $("#last-select").val();

    	framerate = $("#frame-rate").val();
    	
    	edu.gmu.csiss.covali.map.setAnimation(side, layername, starttime, endtime, framerate);
		
    	edu.gmu.csiss.covali.menu.closeDialog('edu.gmu.csiss.covali.animation.jsframe.CreateAnimation');
	}

}
