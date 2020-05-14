
edu.gmu.csiss.covali.regrid = {

    doRegrid() {
        var datafile = $('#regrid-datafile').val();
        var gridfile = $('#regrid-gridfile').val();
        var isCustomGrid = $('#is-custom-grid').prop("checked");
        var customLat = $('#custom-grid-lat').val();
        var customLon = $('#custom-grid-lon').val();
        var isPeriodic = $('#is-periodic').prop("checked");

        var outfile = $('#regrid-outfile').val();
        // remove leading slash
        outfile = outfile.replace(/^\/+/g, '');

        $('#do-regrid-button .regrid-icon').toggleClass('fa-border-none fa-spinner fa-spin');

        edu.gmu.csiss.covali.tools.remoteProcessAndLoad( '../web/regrid', {
            "datafile": datafile,
            "gridfile": gridfile,
            "outfile": outfile,
            "isCustomGrid": isCustomGrid,
            "customLat": customLat,
            "customLon": customLon,
            "isPeriodic": isPeriodic
        });

        edu.gmu.csiss.covali.menu.closeDialog('edu.gmu.csiss.covali.regrid.jsframe.RegridData');

        var dialogName = 'edu.gmu.csiss.covali.jsframe.RemoteProcessingWaiting';
        var dialogTitle = 'Executing Regrid Process';
        var waiting_message = "Creating regridded file: " + outfile + "...";
        var content = '<div class="modal-body" style="font-size: 12px;">';
        content += '<b>' + waiting_message + '</b>';
        content += '</div>';

        edu.gmu.csiss.covali.menu.createDialog(dialogName, dialogTitle, content, 100, 700);
    },

    inputFilesChanged: function() {
        // get the dirname and first part of the outname from the data file
        var path1 = $('#regrid-datafile').val();
        var name1 = path1.substr(path1.lastIndexOf("/") + 1);
        name1 = name1.replace(/\.[^/.]+$/, "");


        var dir = $('#regrid-outdir').val();
        if(dir == "") {
            dir = path1.substr(0, path1.lastIndexOf("/"));
            $('#regrid-outdir').val(dir);
        }

        // get the second part of name from either the custom grid parameters
        // or the grid file
        var name2 = "";
        if($('#is-custom-grid').prop("checked") == true) {
            var customLat = $('#custom-grid-lat').val();
            var customLon = $('#custom-grid-lon').val();

            name2 = customLat + 'x' + customLon;
        } else {
            var path2 = $('#regrid-gridfile').val();
            name2 = path2.substr(path2.lastIndexOf("/") + 1);
            name2 = name2.replace(/\.[^/.]+$/, "");
        }

        var outname = name1 + '-gridto-' + name2;
        if($('#is-periodic').prop("checked")) {
            outname += '-periodic'
        }

        outname += ".nc4";

        $('#regrid-outfile').val(outname);
    },

    showDialog: function () {
        edu.gmu.csiss.covali.menu.closeAllDialogs();

        var dialogName = 'edu.gmu.csiss.covali.regrid.jsframe.RegridData';
        var dialogTitle = 'Regrid Data';

        var content = "<div class=\"modal-body\"><dl class=\"row\" style=\"font-size: 12px; padding: 5px; margin:0px\">"+
            '<div id="filebrowser"></div>'+

            "<div class=\"modal-footer\">" +
            "<p><span class=\"btn btn-primary\" onclick=\'edu.gmu.csiss.covali.menu.closeDialog(\""+dialogName+"\")\'>Cancel</span></p>"+
            "</div>";


        // INPUT DATA FILE
        var content = '';
        content += '<div class="modal-body" style="font-size: 12px; padding: 5px; margin:0px">';
        content += '  <dl class="row infile-row">';
        content += '	<div style="margin-left: 15px">';
        content += 'Only NetCDF files with lat/lon grids are supported. Uses xESMF bilinear mode.';
        content += '</div>';
        content += '  </dl>';

        content += '  <dl class="row infile-row">';
        content += '	<label class="col-md-3 control-label" for="regrid-datafile">Data File</label>';
        content += '	<div class="col-md-8">';
        content += '		<input id="regrid-datafile" name="regrid-datafile" class="form-control" required/>';
        content += '	</div>';
        content += '	<div class="col-md-1 text-left"  style="padding-left: 0px;">';
        content += '		<a class="btn btn-primary" id="regrid-add-datafile-btn" href="javascript:void(0)"><i class="fa fa-folder"></i></a>';
        content += '	</div>';
        content += '  </dl>';

        // INPUT GRID FILE
        content += '  <dl class="row infile-row">';
        content += '	<label class="col-md-3 control-label" for="regrid-gridfile">Grid File</label>';
        content += '	<div class="col-md-8">';
        content += '		<input id="regrid-gridfile" name="regrid-gridfile" class="form-control" required/>';
        content += '	</div>';
        content += '	<div class="col-md-1 text-left"  style="padding-left: 0px;">';
        content += '		<a class="btn btn-primary" id="regrid-add-gridfile-btn" href="javascript:void(0)"><i class="fa fa-folder"></i></a>';
        content += '	</div>';
        content += '  </dl>';

        // CUSTOM GRID
        content += '  <dl class="row">';
        content += '	<label class="col-md-3 control-label" for="is-custom-grid">Custom Global Grid?</label>';
        content += '	<div class="col-md-9">';
        content += '		<input type="checkbox" id="is-custom-grid" name="is-custom-grid" value="" required>';
        content += '	</div>';
        content += '  </dl>';

        // CUSTOM GRID LAT
        content += '  <dl class="row">';
        content += '	<label class="col-md-3 control-label" for="custom-grid-lat">Custom Lat Step</label>';
        content += '	<div class="col-md-9">';
        content += '		<input id="custom-grid-lat" name="custom-grid-lat" value="" class="form-control">';
        content += '	</div>';
        content += '  </dl>';

        // CUSTOM GRID LON
        content += '  <dl class="row">';
        content += '	<label class="col-md-3 control-label" for="custom-grid-lon">Custom Lon Step</label>';
        content += '	<div class="col-md-9">';
        content += '		<input id="custom-grid-lon" name="custom-grid-lon" value="" class="form-control">';
        content += '	</div>';
        content += '  </dl>';


        // OUTPUT FILE
        content += '  <dl class="row" style="margin-bottom: 0px;">';
        content += '	<label class="col-md-3 control-label" for="regrid-outfile">Output file</label>';
        content += '	<div class="col-md-9">';
        content += '		<input id="regrid-outfile" name="regrid-outfile" value="" class="form-control" required>';
        content += '	</div>';
        content += '  </dl>';

        content += '  <dl class="row">';
        content += '	<label class="col-md-3"></label>';
        content += '	<div class="col-md-9" style="padding-top:4px; padding-left:16px; font-style: italic">';
        content += '		<span>The output file will be stored in the <span style="font-family: monospace;">covali-workspace/results</span> folder</span>';
        content += '	</div>';
        content += '  </dl><br/>';


        // PERIODIC
        content += '  <dl class="row">';
        content += '	<label class="col-md-3 control-label" for="is-periodic">Periodic?</label>';
        content += '	<div class="col-md-9">';
        content += '		<input type="checkbox" id="is-periodic" name="is-periodic" value="" required>';
        content += '	</div>';
        content += '  </dl>';


        content += '</div>';

        content += '<div class="modal-footer">';
        content += '<p style="margin:0;">';
        content += '<span id="do-regrid-button" class="btn btn-primary" onclick="edu.gmu.csiss.covali.regrid.doRegrid();">';
        content += '<span style="margin-right: 5px" class="regrid-icon fa fa-border-none"></span>Regrid</span>';
        content += '</p></div>';


        edu.gmu.csiss.covali.menu.createDialog(dialogName, dialogTitle, content, 580);


        $('#regrid-add-datafile-btn').click(function(){
            edu.gmu.csiss.covali.filebrowser.selectedCallback = function(selectedFile) {
                $('#regrid-datafile').val(selectedFile);
                $('#regrid-datafile').change();
                edu.gmu.csiss.covali.filebrowser.close();

            };
            edu.gmu.csiss.covali.filebrowser.init();
        });

        $('#regrid-add-gridfile-btn').click(function(){
            edu.gmu.csiss.covali.filebrowser.selectedCallback = function(selectedFile) {
                $('#regrid-gridfile').val(selectedFile);
                $('#regrid-gridfile').change();
                edu.gmu.csiss.covali.filebrowser.close();
            };
            edu.gmu.csiss.covali.filebrowser.init();
        });

        $('#regrid-datafile, #regrid-gridfile, #is-custom-grid, #custom-grid-lat, #custom-grid-lon, #is-periodic').change(function(){
            edu.gmu.csiss.covali.regrid.inputFilesChanged();
        });


    }
}
