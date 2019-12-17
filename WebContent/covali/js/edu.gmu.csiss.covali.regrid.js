
edu.gmu.csiss.covali.regrid = {
    // layer_tree : null,

    /**
     *  show a select list to choose the rendered layer list
     */
    // layerSelectCallback: function(layerjson){
    //
    //     console.log(layerjson);
    //
    //     // var
    //
    //     edu.gmu.csiss.covali.animation.layer_tree = $('#layer-select-tree').treeview({data: [layerjson]});
    //
    // },

    inputFilesChanged: function() {
        var path1 = $('#regrid-data-file').val();
        var path2 = $('#regrid-grid-file').val();

        var dir = path1.substr(0, path1.lastIndexOf("/"));
        var name1 = path1.substr(path1.lastIndexOf("/") + 1);
        var name2 = path2.substr(path2.lastIndexOf("/") + 1);

        name1 = name1.replace(/\.[^/.]+$/, "");
        name2 = name2.replace(/\.[^/.]+$/, "");

        var outname = dir + '/' + name1 + '-' + name2 + ".nc4";

        $('#regrid-outfile').val(outname);
    },

    showDialog: function () {

        BootstrapDialog.closeAll();

        BootstrapDialog.show({

            title: "Regrid",

            message: function() {
                // var ui = "<label for=\"layer-select-tree\" >Select the Input Layer</label>";
                //
                // ui += "<div id=\"layer-select-tree\">";
                // ui += "  </div>";
                //
                // ui += "<div class=\"row\" id=\"\"></div>";

                // INPUT DATA FILE
                var content = '';
                content += '  <div class="row infile-row">';
                content += '	<div class="col-md-12">';
                content += 'Only NetCDF files with regular curvilinear grids are supported.';
                content += '</div>';
                content += '  </div><br/>';

                content += '  <div class="row infile-row">';
                content += '	<label class="col-md-3 control-label" for="regrid-data-file">Data File</label>';
                content += '	<div class="col-md-8">';
                content += '		<input id="regrid-data-file" name="regrid-data-file" class="form-control" required/>';
                content += '	</div>';
                content += '	<div class="col-md-1 text-left"  style="padding-left: 0px;">';
                content += '		<a class="btn btn-primary" id="regrid-add-data-file-btn" href="javascript:void(0)"><i class="fa fa-folder"></i></a>';
                content += '	</div>';
                content += '  </div><br/>';

                // INPUT GRID FILE
                content += '  <div class="row infile-row">';
                content += '	<label class="col-md-3 control-label" for="regrid-grid-file">Grid File</label>';
                content += '	<div class="col-md-8">';
                content += '		<input id="regrid-grid-file" name="regrid-grid-file" class="form-control" required/>';
                content += '	</div>';
                content += '	<div class="col-md-1 text-left"  style="padding-left: 0px;">';
                content += '		<a class="btn btn-primary" id="regrid-add-grid-file-btn" href="javascript:void(0)"><i class="fa fa-folder"></i></a>';
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

                content.find('#regrid-add-data-file-btn').click(function(){
                    edu.gmu.csiss.covali.filebrowser.selectedCallback = function(selectedFile) {
                        $('#regrid-data-file').val(selectedFile);
                        $('#regrid-data-file').change();

                    };
                    edu.gmu.csiss.covali.filebrowser.init();
                });

                content.find('#regrid-add-grid-file-btn').click(function(){
                    edu.gmu.csiss.covali.filebrowser.selectedCallback = function(selectedFile) {
                        $('#regrid-grid-file').val(selectedFile);
                        $('#regrid-grid-file').change();
                    };
                    edu.gmu.csiss.covali.filebrowser.init();
                });

                content.find('#regrid-data-file, #regrid-grid-file').change(function(){
                    console.log('oh yeah!');
                    edu.gmu.csiss.covali.regrid.inputFilesChanged();
                });

                return content;

            },
            onshown: function (dialog) {
                // var x = 1;

                // edu.gmu.csiss.covali.wms.getAllLayers(edu.gmu.csiss.covali.regrid.layerSelectCallback);




            },

            buttons: [{

                icon: 'glyphicon glyphicon-ok',

                label: 'Regrid',

                cssClass: 'btn-warning',

                action: function (dialogItself) {

                    var nodes = $('#layer-select-tree').treeview('getSelected');

                    if (nodes.length != 0) {

                        var layername = nodes[0].Name;
                        alert(layername);


                    } else {

                        alert("Please select a layer");

                    }



                }

            }, {

                label: 'Cancel',

                action: function (dialogItself) {

                    dialogItself.close();

                }

            }]

        });
    }
}
