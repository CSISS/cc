/**
 * 
 * Dialog for processing datasets to create new data
 * 
 * @author Ziheng Sun
 * 
 */

edu.gmu.csiss.covali.nco = {

    doNcoCalculation: function(action, command, dialog) {
        var outfile = command.split(' ').pop();
        
        $.ajax({
        	
            // dataType: 'json',
        	
            type: "POST",
            
            data: {
                "command": command
            },

            url: action,

        }).success(function (data) {
        	
            if(!data.startsWith("Fail") && !data.includes('ERROR') && !data.includes('HTTP Status 500')){
                edu.gmu.csiss.covali.local.showFileLoadingDialog('/' + outfile);
                edu.gmu.csiss.covali.local.loadWMSFile('/' + outfile);
        		
        	}else{
        		
        		console.error(data);
        		
        		alert(data);
        		
        	}
            
        });
        
    },


    ncraDialogContent: function() {
        var content = "<br/>";
        
        // INPUT FILES
        content += '  <div class="row infile-row">';
        content += '	<label class="col-md-3 control-label" for="ncra-infiles">Input Files</label>';
        content += '	<div class="col-md-8">';
        content += '		<textarea rows=5 id="ncra-infiles" name="ncra-infiles" class="form-control"/>';
        content += '	</div>';
        content += '	<div class="col-md-1 text-left"  style="padding-left: 0px;">';
        content += '		<a class="btn btn-primary" id="ncra-add-file-btn" href="javascript:void(0)"><i class="fa fa-folder"></i></a>';
        content += '	</div>';
        content += '  </div><br/>';
        
        // OPTIONS
        content += '  <div class="row">';
        content += '	<label class="col-md-3 control-label" for="ncra-options">Options</label>';
        content += '	<div class="col-md-9">';
        content += '		<input id="ncra-options" name="ncra-options" class="form-control" value="-O">';
        content += '	</div>';
        content += '  </div><br/>';

        // OUTPUT FILE
        content += '  <div class="row">';
        content += '	<label class="col-md-3 control-label" for="ncra-infile">Output file</label>';
        content += '	<div class="col-md-9">';
        content += '		<input id="ncra-outfile" name="ncra-outfile" value="nco_record_average_result.nc" class="form-control" required>';
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

        content.find('#ncra-infiles,#ncra-outfile,#ncra-options').bind('change keyup', function(){
            var inputs = $('#ncra-infiles').val();
            var options = $('#ncra-options').val();
            var output = $('#ncra-outfile').val();


            var command = 'ncra ' + options + ' ' + inputs + ' ' + output;
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
        content += '		<select id="ncbo-operation" name="ncbo-operation" class="form-control">';
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
        content += '		<input id="ncbo-infile1" name="ncbo-infile1" class="form-control" required/>';
        content += '	</div>';
        content += '	<div class="col-md-1 text-left"  style="padding-left: 0px;">';
        content += '		<a class="btn btn-primary" id="ncbo-add-file1-btn" href="javascript:void(0)"><i class="fa fa-folder"></i></a>';
        content += '	</div>';
        content += '  </div><br/>';

        // INPUT FILE 2
        content += '  <div class="row infile-row">';
        content += '	<label class="col-md-3 control-label" for="ncbo-infile2">Input File 2</label>';
        content += '	<div class="col-md-8">';
        content += '		<input id="ncbo-infile2" name="ncbo-infile2" class="form-control" required/>';
        content += '	</div>';
        content += '	<div class="col-md-1 text-left"  style="padding-left: 0px;">';
        content += '		<a class="btn btn-primary" id="ncbo-add-file2-btn" href="javascript:void(0)"><i class="fa fa-folder"></i></a>';
        content += '	</div>';
        content += '  </div><br/>';


        // OPTIONS
        content += '  <div class="row">';
        content += '	<label class="col-md-3 control-label" for="ncbo-options">Options</label>';
        content += '	<div class="col-md-9">';
        content += '		<input id="ncbo-options" name="ncbo-options" class="form-control" value="-O">';
        content += '	</div>';
        content += '  </div><br/>';

        // OUTPUT FILE
        content += '  <div class="row">';
        content += '	<label class="col-md-3 control-label" for="ncbo-infile">Output file</label>';
        content += '	<div class="col-md-9">';
        content += '		<input id="ncbo-outfile" name="ncbo-outfile" value="nco_binary_operator_result.nc" class="form-control" required>';
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
            };
            edu.gmu.csiss.covali.filebrowser.init();
        });

        content.find('#ncbo-add-file2-btn').click(function(){
            edu.gmu.csiss.covali.filebrowser.selectedCallback = function(selectedFile) {
                $('#ncbo-infile2').val(selectedFile);
                $('#ncbo-infile2').change();
            };
            edu.gmu.csiss.covali.filebrowser.init();
        });

        content.find('#ncbo-operation,#ncbo-infile1,#ncbo-infile2,#ncbo-outfile,#ncbo-options').bind('change keyup', function(){
            var op = $('#ncbo-operation option:selected').data('operation')
            var input1 = $('#ncbo-infile1').val();
            var input2 = $('#ncbo-infile2').val();
            var options = $('#ncbo-options').val();
            var output = $('#ncbo-outfile').val();


            var command = 'ncbo ' + '--op_typ=' + op + ' ' + options + ' ' + input1 + ' ' + input2 + ' ' + output;
            $('#ncbo-command').val(command);
        });

        return content;
    },


    changeDialogContent: function(selected){
        var content = "";
        switch(selected) {
            case "1":
                content = "<div></div>";
                break;
            case "2":
                content = edu.gmu.csiss.covali.nco.ncraDialogContent();
                break;
            case "3":
                content = edu.gmu.csiss.covali.nco.ncboDialogContent();
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
    
    calculateButtonAction: function(dialogItself){
        if($("#nco-operation").val()=="2"){

            var command = $("#ncra-command").val();
            edu.gmu.csiss.covali.nco.doNcoCalculation('../web/nco/ncra', command, dialogItself);
        } else if($("#nco-operation").val()=="3"){

            var command = $("#ncbo-command").val();
            edu.gmu.csiss.covali.nco.doNcoCalculation('../web/nco/ncbo', command, dialogItself);
        }

        console.log(dialogItself);
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
        
        //var $content = $(content);

  
		
		var dialogName = 'edu.gmu.csiss.covali.nco.jsframe.NCOProcessing';
		var dialogTitle = 'NCO Processing';
		dialogContent = "<div class=\"modal-body\"><dl class=\"row\" style=\"font-size: 12px; padding: 5px; margin:0px\">"+
			content + 
			"</dl></div>"+
			"<div class=\"modal-footer\">" +
			"<p><span class=\"btn btn-primary\" onclick=\'edu.gmu.csiss.covali.nco.calculateButtonAction()\'>Calculate</span>" +
			"<span class=\"btn btn-primary\" onclick=\'edu.gmu.csiss.covali.menu.closeDialog(\""+dialogName+"\")\'>Close</span></p>"+
			"</div>";
		edu.gmu.csiss.covali.menu.createDialog(dialogName, dialogTitle, dialogContent, 400, 700);
		
		//$('#nco-frame').append($content);
        $('#nco-operation').change(function() {
        	console.log($('#nco-operation').val());
            edu.gmu.csiss.covali.nco.changeDialogContent(this.value);
        });
        
        $('#process-info-btn').click(function() {
            edu.gmu.csiss.covali.nco.information();
        });

		
//		BootstrapDialog.closeAll();
//		
//		BootstrapDialog.show({
//			
//			title: "NCO Processing",
//			
//			message: function(){
//				
//				var content = '<div class="row">';
//                content += '	<label class="col-md-3 control-label" for="nco-operation">Operation</label>';
//                content += '	<div class="col-md-8">';
//                content += '		<select id="nco-operation" name="nco-operation" class="form-control">';
//                content += '			<option value="1">Select</option>';
//                content += '			<option id="operation-ncra" value="2">Record Average (ncra)</option>';
//                content += '			<option id="operation-ncra" value="3">Binary Operator (ncbo)</option>';
//                content += '		</select>';
//                content += '	</div>';
//                content += '	<div class="col-md-1 text-left" style="padding-left: 0px;">';
//                content += '		<a class="btn btn-primary" id="process-info-btn" href="javascript:void(0)"><i class="fa fa-info"></i></a>';
//                content += '	</div>';
//                content += '</div>';
//                
//
//                content += '<div id="nco-operation-content"></div>';
//
//                content = $(content);
//                content.find('#nco-operation').change(function() {
//                    edu.gmu.csiss.covali.nco.changeDialogContent(this.value);
//                });
//                
//                content.find('#process-info-btn').click(function() {
//                    edu.gmu.csiss.covali.nco.information();
//                });
//                return content;
//				
//			},
//			
//			buttons: [{
//				
//            	icon: 'glyphicon glyphicon-ok',
//                
//                label: 'Calculate',
//
//                autospin: true,
//                
//                cssClass: 'btn-warning',
//                
//                action: function(dialogItself){
//                    if($("#nco-operation").val()=="2"){
//
//                        var command = $("#ncra-command").val();
//                        edu.gmu.csiss.covali.nco.doNcoCalculation('../web/nco/ncra', command, dialogItself);
//                    } else if($("#nco-operation").val()=="3"){
//
//                        var command = $("#ncbo-command").val();
//                        edu.gmu.csiss.covali.nco.doNcoCalculation('../web/nco/ncbo', command, dialogItself);
//                    }
//
//                    console.log(dialogItself);
//                }
//                
//			}, {
//
//            	icon: 'glyphicon',
//                
//                label: 'Close',
//                
//                cssClass: 'btn-default',
//                
//                action: function(dialogItself){
//                	dialogItself.close();
//                }
//                
//			}]
//			
//		});
		
	}
		
}
