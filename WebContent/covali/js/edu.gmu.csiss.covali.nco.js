/**
 * 
 * Dialog for processing datasets to create new data
 * 
 * @author Ziheng Sun
 * 
 */

edu.gmu.csiss.covali.nco = {
    fileInfoDialog: function(filepath) {
        if(filepath) {
            $.ajax({
                contentType: "application/json", //this is by default
                type: "GET",
                url: "../web/ncdump",
                data: "filepath="+filepath
            }).success(function(data) {
                if(data.success) {
                    var dialogName = 'edu.gmu.csiss.covali.search.jsframe.FileInfo-' + filepath;
                    var dialogTitle = 'ncdump ' + filepath;

                    var content = '<div class="modal-body" style="font-size: 12px;">';
                    content += "<pre>" + data.success.message + "</pre>";
                    content += '</div>';

                    content += "<div class=\"modal-footer\">" +
                        "<span class=\"btn btn-primary\" onclick=\'edu.gmu.csiss.covali.menu.closeDialog(\" + dialogName + \")\'>Close</span></p>"+
                        "</div>";
                    edu.gmu.csiss.covali.menu.createDialog(dialogName, dialogTitle, content, 600);
                }
            });
        }
    },

    updateFileInfoLinks: function(filepaths) {
        var container = $('.fileinfo-links');
        // <a href="#"  onclick="edu.gmu.csiss.covali.nco.fileInfoDialog(this);" data-filepath=""></a>'

        container.html("");
        if(filepaths) {
            filepaths.forEach(function(filepath) {
                var filename = filepath.replace(/^.*[\\\/]/, '');
                var a = $("<a>" + filename + "</a>");
                a.on("click", function (e) {
                    edu.gmu.csiss.covali.nco.fileInfoDialog(filepath);
                });
                container.append(a);
                container.append("&nbsp;");
            });
        }
    },

    ncoCommandCommonOptions: function() {
        var options = $('#nco-options').val();
        var variables = $('#nco-variables').val();
        var overwrite = $('#nco-overwrite').prop('checked');

        var command = options;
        if(variables) {
            command += " -V " + variables;
        }
        if(overwrite) {
            command += " -O "
        }

        return  command;
    },

    ncraDialogContent: function() {
        var content = "<br/>";
        
        // INPUT FILES
        content += '  <div class="row infile-row">';
        content += '	<label class="col-md-3 control-label" for="ncra-infiles">Input Files</label>';
        content += '	<div class="col-md-8">';
        content += '		<textarea rows=5 id="ncra-infiles" name="ncra-infiles" class="nco-command-element form-control"/>';
        content += '	</div>';
        content += '	<div class="col-md-1 text-left"  style="padding-left: 0px;">';
        content += '		<a class="btn btn-primary" id="ncra-add-file-btn" href="javascript:void(0)"><i class="fa fa-folder"></i></a>';
        content += '	</div>';
        content += '  </div><br/>';


        // FILEINFO
        content += '  <div class="row">';
        content += '	<label class="col-md-3 control-label">File Info (ncdump)</label>';
        content += '	<div class="col-md-9 fileinfo-links">';
        content += '	</div>';
        content += '  </div><br/>';
        
        // OPTIONS
        content += '  <div class="row">';
        content += '	<label class="col-md-3 control-label" for="nco-options">Options</label>';
        content += '	<div class="col-md-9">';
        content += '		<input id="nco-options" name="nco-options" class="nco-command-element form-control" value="">';
        content += '	</div>';
        content += '  </div><br/>';

        // Variables
        content += '  <div class="row">';
        content += '	<label class="col-md-3 control-label" for="nco-variables">Variables</label>';
        content += '	<div class="col-md-9">';
        content += '		<input id="nco-variables" name="nco-variables" class="nco-command-element form-control" value="">';
        content += '	</div>';
        content += '  </div><br/>';

        // OUTPUT FILE
        content += '  <div class="row">';
        content += '	<label class="col-md-3 control-label" for="ncra-infile">Output file</label>';
        content += '	<div class="col-md-9">';
        content += '		<input id="nco-outfile" name="nco-outfile" value="nco_record_average_result.nc" class="nco-command-element form-control" required>';
        content += '	</div>';
        content += '  </div>';

        content += '  <div class="row">';
        content += '	<label class="col-md-3"></label>';
        content += '	<div class="col-md-9" style="padding-top:4px; padding-left:16px; font-style: italic">';
        content += '		<span>The output file will be stored in the <span style="font-family: monospace;">covali-workspace/results</span> folder</span>';
        content += '	</div>';
        content += '  </div><br/>';

        // Overwrite
        content += '  <div class="row">';
        content += '	<label class="col-md-3 control-label" for="nco-overwrite">Overwrite Output (-O)</label>';
        content += '	<div class="col-md-9">';
        content += '		<input type="checkbox" checked id="nco-overwrite" class="nco-command-element" name="nco-overwrite">';
        content += '	</div>';
        content += '  </div><br/>';


        // COMMAND
        content += '  <div class="row infile-row">';
        content += '	<label class="col-md-3 control-label" for="ncra-command">Command</label>';
        content += '	<div class="col-md-9">';
        content += '		<textarea rows=6 id="ncra-command" name="ncra-command" class="form-control"/>';
        content += '	</div>';


        content = $(content);
        content.find('#ncra-add-file-btn').click(function(){
            edu.gmu.csiss.covali.multifilebrowser.selectedCallback = function(selectedFiles) {
                $('#ncra-infiles').val(selectedFiles.join(" "));
                $('#ncra-infiles').change();
            };
            edu.gmu.csiss.covali.multifilebrowser.init();
        });

        content.find('.nco-command-element').bind('change keyup', function(){
            var inputs = $('#ncra-infiles').val().replaceAll("\n", " ");
            var ncoCommandCommonOptions = edu.gmu.csiss.covali.nco.ncoCommandCommonOptions();

            var output = $('#nco-outfile').val();

            // update variables list
            edu.gmu.csiss.covali.nco.updateFileInfoLinks(inputs.split(/\s+/));

            var command = 'ncra ' + ncoCommandCommonOptions + ' ' + inputs + ' ' + output;
            $('#ncra-command').val(command);
        });


        return content;
    },

    ncboDialogContent: function() {
        var content = "<br/>";

        // OPERATION
        content += '  <div class="row">';
        content += '	<label class="col-md-3 control-label" for="ncbo-operation">Operation</label>';
        content += '	<div class="col-md-9">';
        content += '		<select id="ncbo-operation"  name="ncbo-operation" class="nco-command-element form-control">';
        content += '			<option data-operation="add" id="ncbo-operation-add" value="1">Addition</option>';
        content += '			<option data-operation="sub" id="ncbo-operation-sub" value="2">Subtraction</option>';
        content += '			<option data-operation="mult" id="ncbo-operation-mult" value="3">Multiplication</option>';
        content += '			<option data-operation="dvd" id="ncbo-operation-div" value="4">Division</option>';
        content += '		</select>';
        content += '	</div>';
        content += '  </div><br/>';

        // INPUT FILE 1
        content += '  <div class="row infile-row">';
        content += '	<label class="col-md-3 control-label" for="ncbo-infile1">Input File 1</label>';
        content += '	<div class="col-md-8">';
        content += '		<input id="ncbo-infile1" name="ncbo-infile1" class="nco-command-element form-control" required/>';
        content += '	</div>';
        content += '	<div class="col-md-1 text-left"  style="padding-left: 0px;">';
        content += '		<a class="btn btn-primary" id="ncbo-add-file1-btn" href="javascript:void(0)"><i class="fa fa-folder"></i></a>';
        content += '	</div>';
        content += '  </div><br/>';

        // INPUT FILE 2
        content += '  <div class="row infile-row">';
        content += '	<label class="col-md-3 control-label" for="ncbo-infile2">Input File 2</label>';
        content += '	<div class="col-md-8">';
        content += '		<input id="ncbo-infile2" name="ncbo-infile2" class="nco-command-element form-control" required/>';
        content += '	</div>';
        content += '	<div class="col-md-1 text-left"  style="padding-left: 0px;">';
        content += '		<a class="btn btn-primary" id="ncbo-add-file2-btn" href="javascript:void(0)"><i class="fa fa-folder"></i></a>';
        content += '	</div>';
        content += '  </div><br/>';

        // FILEINFO
        content += '  <div class="row">';
        content += '	<label class="col-md-3 control-label">File Info (ncdump)</label>';
        content += '	<div class="col-md-9 fileinfo-links">';
        content += '	</div>';
        content += '  </div><br/>';


        // OPTIONS
        content += '  <div class="row">';
        content += '	<label class="col-md-3 control-label" for="nco-options">Options</label>';
        content += '	<div class="col-md-9">';
        content += '		<input id="nco-options" name="nco-options" class="nco-command-element form-control" value="">';
        content += '	</div>';
        content += '  </div><br/>';

        // Variables
        content += '  <div class="row">';
        content += '	<label class="col-md-3 control-label" for="nco-variables">Variables</label>';
        content += '	<div class="col-md-9">';
        content += '		<input id="nco-variables" name="nco-variables" class="nco-command-element form-control" value="">';
        content += '	</div>';
        content += '  </div><br/>';

        // OUTPUT FILE
        content += '  <div class="row">';
        content += '	<label class="col-md-3 control-label" for="ncbo-infile">Output file</label>';
        content += '	<div class="col-md-9">';
        content += '		<input id="nco-outfile" name="nco-outfile" value="nco_binary_operator_result.nc" class="nco-command-element form-control" required>';
        content += '	</div>';
        content += '  </div>';

        content += '  <div class="row">';
        content += '	<label class="col-md-3"></label>';
        content += '	<div class="col-md-9" style="padding-top:4px; padding-left:16px; font-style: italic">';
        content += '		<span>The output file will be stored in the <span style="font-family: monospace;">covali-workspace/results</span> folder</span>';
        content += '	</div>';
        content += '  </div><br/>';

        // Overwrite
        content += '  <div class="row">';
        content += '	<label class="col-md-3 control-label" for="nco-overwrite">Overwrite Output (-O)</label>';
        content += '	<div class="col-md-9">';
        content += '		<input type="checkbox" checked id="nco-overwrite" name="nco-overwrite" class="nco-command-element"  >';
        content += '	</div>';
        content += '  </div><br/>';


        // COMMAND
        content += '  <div class="row infile-row">';
        content += '	<label class="col-md-3 control-label" for="ncbo-command">Command</label>';
        content += '	<div class="col-md-9">';
        content += '		<textarea rows=6 id="ncbo-command" name="ncbo-command" class="form-control"/>';
        content += '	</div>';


        content = $(content);

        content.find('#ncbo-add-file1-btn').click(function(){
            edu.gmu.csiss.covali.filebrowser.selectedCallback = function(selectedFile) {
                $('#ncbo-infile1').val(selectedFile);
                $('#ncbo-infile1').change();
                edu.gmu.csiss.covali.filebrowser.close();
            };
            edu.gmu.csiss.covali.filebrowser.init();
        });

        content.find('#ncbo-add-file2-btn').click(function(){
            edu.gmu.csiss.covali.filebrowser.selectedCallback = function(selectedFile) {
                $('#ncbo-infile2').val(selectedFile);
                $('#ncbo-infile2').change();
                edu.gmu.csiss.covali.filebrowser.close();

            };
            edu.gmu.csiss.covali.filebrowser.init();
        });

        content.find('.nco-command-element').bind('change keyup', function(){
            var op = $('#ncbo-operation option:selected').data('operation')
            var input1 = $('#ncbo-infile1').val();
            var input2 = $('#ncbo-infile2').val();

            var ncoCommandCommonOptions = edu.gmu.csiss.covali.nco.ncoCommandCommonOptions();

            var output = $('#nco-outfile').val();

            // update variables list
            edu.gmu.csiss.covali.nco.updateFileInfoLinks([input1, input2]);


            var command = 'ncbo ' + '--op_typ=' + op + ' ' + ncoCommandCommonOptions + ' ' + input1 + ' ' + input2 + ' ' + output;
            $('#ncbo-command').val(command);
        });

        return content;
    },


    changeDialogContent: function(selected){
        var dialogName = 'edu.gmu.csiss.covali.nco.jsframe.NCOProcessing';
        var content = "";

        switch(selected) {
            case "1":
                content = "<div></div>";
                edu.gmu.csiss.covali.menu.setSize(dialogName, 200);
                break;
            case "2":
                content = edu.gmu.csiss.covali.nco.ncraDialogContent();
                edu.gmu.csiss.covali.menu.setSize(dialogName, 730);
                break;
            case "3":
                content = edu.gmu.csiss.covali.nco.ncboDialogContent();
                edu.gmu.csiss.covali.menu.setSize(dialogName, 760);
                break;
        }
        $('#nco-operation-content').html(content);
    },
    
    information: function(){
    	
    	if($("#nco-operation").val()=="2"){
    		
    		window.open('https://linux.die.net/man/1/ncra', '_blank');
    		
    	}else if($("#nco-operation").val()=="3"){
            window.open('https://linux.die.net/man/1/ncbo', '_blank');

        }
    	
    },
    
    calculateButtonAction: function(){
        var waiting_message = "Waiting..."
        if($("#nco-operation").val()=="2"){
            var command = $("#ncra-command").val();
            edu.gmu.csiss.covali.tools.remoteProcessAndLoad('../web/nco/ncra', {"command": command});
            waiting_message = "Executing: " + command + "...";
        } else if($("#nco-operation").val()=="3"){
            var command = $("#ncbo-command").val();
            edu.gmu.csiss.covali.tools.remoteProcessAndLoad('../web/nco/ncbo', {"command": command});
            waiting_message = "Executing: " + command + "...";
        }


        edu.gmu.csiss.covali.menu.closeDialog('edu.gmu.csiss.covali.nco.jsframe.NCOProcessing');

        var dialogName = 'edu.gmu.csiss.covali.jsframe.RemoteProcessingWaiting';
        var dialogTitle = 'Executing NCO Process';
        var content = '<div class="modal-body" style="font-size: 12px;">';
        content += '<b>' + waiting_message + '</b>';
        content += '</div>';

        edu.gmu.csiss.covali.menu.createDialog(dialogName, dialogTitle, content, 100, 700);

    },
	
	showDialog: function(){
		
		edu.gmu.csiss.covali.menu.closeAllDialogs();
		

		var content = '<div class="row">';
        content += '	<label class="col-md-3 control-label" for="nco-operation">Operation</label>';
        content += '	<div class="col-md-8">';
        content += '		<select id="nco-operation" name="nco-operation" class="form-control">';
        content += '			<option value="1">Select</option>';
        content += '			<option id="operation-ncra" value="2">Record Average (ncra)</option>';
        content += '			<option id="operation-ncra" value="3">Binary Operator (ncbo)</option>';
        content += '		</select>';
        content += '	</div>';
        content += '	<div class="col-md-1 text-left" style="padding-left: 0px;">';
        content += '		<a class="btn btn-primary" id="process-info-btn" href="javascript:void(0)"><i class="fa fa-info"></i></a>';
        content += '	</div>';
        content += '</div>';
        content += '<div id="nco-operation-content"></div>';

		var dialogName = 'edu.gmu.csiss.covali.nco.jsframe.NCOProcessing';
		var dialogTitle = 'NCO Processing';
		dialogContent = "<div class=\"modal-body\"><dl class=\"row\" style=\"font-size: 12px; padding: 5px; margin:0px\">"+
			content + 
			"</dl></div>"+
			"<div class=\"modal-footer\">" +
			"<p><span class=\"btn btn-primary\" onclick=\'edu.gmu.csiss.covali.nco.calculateButtonAction()\'>Calculate</span>" +
			"<span class=\"btn btn-primary\" onclick=\'edu.gmu.csiss.covali.menu.closeDialog(\""+dialogName+"\")\'>Close</span></p>"+
			"</div>";
		edu.gmu.csiss.covali.menu.createDialog(dialogName, dialogTitle, dialogContent, 200, 700);
		
		//$('#nco-frame').append($content);
        $('#nco-operation').change(function() {
        	console.log($('#nco-operation').val());
            edu.gmu.csiss.covali.nco.changeDialogContent(this.value);
        });
        
        $('#process-info-btn').click(function() {
            edu.gmu.csiss.covali.nco.information();
        });

	}
		
}
