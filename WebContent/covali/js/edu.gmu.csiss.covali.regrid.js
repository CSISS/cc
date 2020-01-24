
edu.gmu.csiss.covali.regrid = {

    doRegrid() {
        var datafile = $('#regrid-datafile').val();
        var gridfile = $('#regrid-gridfile').val();

        var dir = $('#regrid-outdir').val();
        var outfile = $('#regrid-outfile').val();

        var outpath = dir + '/' + outfile;

        $('#do-regrid-button .regrid-icon').toggleClass('fa-border-none fa-spinner fa-spin');

        $.ajax({
            type: "POST",

            data: {
                "datafile": datafile,
                "gridfile": gridfile,
                "outfile": outpath
            },

            url: '../web/regrid',

        }).success(function(data) {
            alert(data);
            edu.gmu.csiss.covali.menu.closeAllDialogs();
            edu.gmu.csiss.covali.local.showFileLoadingDialog(outpath);
            edu.gmu.csiss.covali.local.loadWMSFile(outpath);

        }).error(function(data) {
            edu.gmu.csiss.covali.menu.closeAllDialogs();
            alert(data);
        });
    },

    inputFilesChanged: function() {
        var path1 = $('#regrid-datafile').val();
        var path2 = $('#regrid-gridfile').val();

        var dir = $('#regrid-outdir').val();
        if(dir == "") {
            dir = path1.substr(0, path1.lastIndexOf("/"));
            $('#regrid-outdir').val(dir);
        }

        var name1 = path1.substr(path1.lastIndexOf("/") + 1);
        var name2 = path2.substr(path2.lastIndexOf("/") + 1);

        name1 = name1.replace(/\.[^/.]+$/, "");
        name2 = name2.replace(/\.[^/.]+$/, "");

        var outname = name1 + '-gridto-' + name2 + ".nc4";

        $('#regrid-outfile').val(outname);
    },

    showDialog: function () {
        BootstrapDialog.closeAll();

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

        // OUTPUT DIR
        content += '  <dl class="row">';
        content += '	<label class="col-md-3 control-label" for="regrid-outdir">Output folder</label>';
        content += '	<div class="col-md-9">';
        content += '		<input id="regrid-outdir" name="regrid-outdir" value="" class="form-control" required>';
        content += '	</div>';
        content += '  </dl>';

        // OUTPUT FILE
        content += '  <dl class="row">';
        content += '	<label class="col-md-3 control-label" for="regrid-outfile">Output file</label>';
        content += '	<div class="col-md-9">';
        content += '		<input id="regrid-outfile" name="regrid-outfile" value="" class="form-control" required>';
        content += '	</div>';
        content += '  </dl>';

        content += '</div>';

        content += '<div class="modal-footer">';
        content += '<p style="margin:0;">';
        content += '<span id="do-regrid-button" class="btn btn-primary" onclick="edu.gmu.csiss.covali.regrid.doRegrid();">';
        content += '<span style="margin-right: 5px" class="regrid-icon fa fa-border-none"></span>Regrid</span>';
        content += '</p></div>';


        edu.gmu.csiss.covali.menu.createDialog(dialogName, dialogTitle, content, 380);


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

        $('#regrid-datafile, #regrid-gridfile').change(function(){
            edu.gmu.csiss.covali.regrid.inputFilesChanged();
        });


    }
}
