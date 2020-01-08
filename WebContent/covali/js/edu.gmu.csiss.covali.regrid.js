
edu.gmu.csiss.covali.regrid = {

    doRegrid(datafile, gridfile, outpath) {
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
            BootstrapDialog.closeAll();
            edu.gmu.csiss.covali.local.showFileLoadingDialog(outpath);
            edu.gmu.csiss.covali.local.loadWMSFile(outpath);

        }).error(function(data) {
            alert(data);
            BootstrapDialog.closeAll();
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

        BootstrapDialog.show({

            title: "Regrid",

            message: function() {
                // INPUT DATA FILE
                var content = '';
                content += '  <div class="row infile-row">';
                content += '	<div class="col-md-12">';
                content += 'Only NetCDF files with lat/lon grids are supported. Uses xESMF bilinear mode.';
                content += '</div>';
                content += '  </div><br/>';

                content += '  <div class="row infile-row">';
                content += '	<label class="col-md-3 control-label" for="regrid-datafile">Data File</label>';
                content += '	<div class="col-md-8">';
                content += '		<input id="regrid-datafile" name="regrid-datafile" class="form-control" required/>';
                content += '	</div>';
                content += '	<div class="col-md-1 text-left"  style="padding-left: 0px;">';
                content += '		<a class="btn btn-primary" id="regrid-add-datafile-btn" href="javascript:void(0)"><i class="fa fa-folder"></i></a>';
                content += '	</div>';
                content += '  </div><br/>';

                // INPUT GRID FILE
                content += '  <div class="row infile-row">';
                content += '	<label class="col-md-3 control-label" for="regrid-gridfile">Grid File</label>';
                content += '	<div class="col-md-8">';
                content += '		<input id="regrid-gridfile" name="regrid-gridfile" class="form-control" required/>';
                content += '	</div>';
                content += '	<div class="col-md-1 text-left"  style="padding-left: 0px;">';
                content += '		<a class="btn btn-primary" id="regrid-add-gridfile-btn" href="javascript:void(0)"><i class="fa fa-folder"></i></a>';
                content += '	</div>';
                content += '  </div><br/>';

                // OUTPUT DIR
                content += '  <div class="row">';
                content += '	<label class="col-md-3 control-label" for="regrid-outdir">Output folder</label>';
                content += '	<div class="col-md-9">';
                content += '		<input id="regrid-outdir" name="regrid-outdir" value="" class="form-control" required>';
                content += '	</div>';
                content += '  </div><br/>';

                // OUTPUT FILE
                content += '  <div class="row">';
                content += '	<label class="col-md-3 control-label" for="regrid-outfile">Output file</label>';
                content += '	<div class="col-md-9">';
                content += '		<input id="regrid-outfile" name="regrid-outfile" value="" class="form-control" required>';
                content += '	</div>';
                content += '  </div><br/>';


                content = $(content);

                content.find('#regrid-add-datafile-btn').click(function(){
                    edu.gmu.csiss.covali.filebrowser.selectedCallback = function(selectedFile) {
                        $('#regrid-datafile').val(selectedFile);
                        $('#regrid-datafile').change();

                    };
                    edu.gmu.csiss.covali.filebrowser.init();
                });

                content.find('#regrid-add-gridfile-btn').click(function(){
                    edu.gmu.csiss.covali.filebrowser.selectedCallback = function(selectedFile) {
                        $('#regrid-gridfile').val(selectedFile);
                        $('#regrid-gridfile').change();
                    };
                    edu.gmu.csiss.covali.filebrowser.init();
                });

                content.find('#regrid-datafile, #regrid-gridfile').change(function(){
                    edu.gmu.csiss.covali.regrid.inputFilesChanged();
                });

                return content;

            },
            onshown: function (dialog) {

            },

            buttons: [{
                label: 'Regrid',

                icon: 'glyphicon glyphicon-ok',

                cssClass: 'btn-warning',

                autospin: true,

                action: function(dialogItself) {
                    var datafile = $('#regrid-datafile').val();
                    var gridfile = $('#regrid-gridfile').val();

                    var dir = $('#regrid-outdir').val();
                    var outfile = $('#regrid-outfile').val();

                    edu.gmu.csiss.covali.regrid.doRegrid(datafile, gridfile, dir + '/' + outfile);
                }

            }, {
                label: 'Cancel',

                action: function(dialogItself) {
                    dialogItself.close();
                }

            }]

        });
    }
}
