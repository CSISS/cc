/**
 * 
 * Dialog for processing datasets to create new data
 * 
 * @author Ziheng Sun
 * 
 */

edu.gmu.csiss.covali.nco = {

    doNcraCalculation: function(dialog) {
        // var infiles = $(".ncra-infile").map(function() {
        //     if($(this).val()) {return $(this).val();}
        // }).toArray();
        var command = $("#ncra-command").val();
        
        var outfile = command.split(' ').pop();
        
        $.ajax({
        	
            // dataType: 'json',
        	
            type: "POST",
            
            data: {
                "command": command
            },

            url: '../web/nco/ncra',

        }).success(function (data) {
        	
        	if(!data.startsWith("Fail")){
        	
        		//alert('Created ' + outfile + '. Loading layers...');
                edu.gmu.csiss.covali.local.loadlocalfile('/' + outfile, 'layer');
        		
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
        content += '		<input id="ncra-options" name="ncra-options" class="form-control">';
        content += '	</div>';
        content += '  </div><br/>';

        // OUTPUT FILE
        content += '  <div class="row">';
        content += '	<label class="col-md-3 control-label" for="ncra-infile">Output file</label>';
        content += '	<div class="col-md-9">';
        content += '		<input id="ncra-outfile" name="ncra-outfile" class="form-control" required>';
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
            edu.gmu.csiss.covali.filebrowser.selectedCallback = function(selectedFiles) {
                $('#ncra-infiles').val(selectedFiles.join(" "));
                $('#ncra-infiles').change();
            };
            edu.gmu.csiss.covali.filebrowser.init();
        });

        content.find('#ncra-infiles,#ncra-outfile,#ncra-options').bind('change keyup', function(){
            var inputs = $('#ncra-infiles').val();
            var options = $('#ncra-options').val();
            var output = $('#ncra-outfile').val();


            var command = 'ncra ' + options + ' ' + inputs + ' ' + output
            $('#ncra-command').val(command);
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
        }
        $('#nco-operation-content').html(content);
    },
    
    information: function(){
    	
    	if($("#nco-operation").val()=="2"){
    		
    		window.open('https://linux.die.net/man/1/ncra', '_blank');
    		
    	}else if($("#nco-operation").val()=="3"){
    		
    		
    		
    	}
    	
    },
	
	showDialog: function(){
		
		BootstrapDialog.closeAll();
		
		BootstrapDialog.show({
			
			title: "NCO Processing",
			
			message: function(){
				
				var content = '<div class="row">';
                content += '	<label class="col-md-3 control-label" for="nco-operation">Operation</label>';
                content += '	<div class="col-md-8">';
                content += '		<select id="nco-operation" name="nco-operation" class="form-control">';
                content += '			<option value="1">Select</option>';
                content += '			<option id="operation-ncra" value="2">Average (nco ncra)</option>';
                content += '		</select>';
                content += '	</div>';
                content += '	<div class="col-md-1 text-left" style="padding-left: 0px;">';
                content += '		<a class="btn btn-primary" id="process-info-btn" href="javascript:void(0)"><i class="fa fa-info"></i></a>';
                content += '	</div>';
                content += '</div>';
                

                content += '<div id="nco-operation-content"></div>';

                content = $(content);
                content.find('#nco-operation').change(function() {
                    edu.gmu.csiss.covali.nco.changeDialogContent(this.value);
                });
                
                content.find('#process-info-btn').click(function() {
                    edu.gmu.csiss.covali.nco.information();
                });
                return content;
				
			},
			
			buttons: [{
				
            	icon: 'glyphicon glyphicon-ok',
                
                label: 'Calculate',

                autospin: true,
                
                cssClass: 'btn-warning',
                
                action: function(dialogItself){
                	
                    edu.gmu.csiss.covali.nco.doNcraCalculation(dialogItself);

                    console.log(dialogItself);

                }
                
			}, {

            	icon: 'glyphicon',
                
                label: 'Close',
                
                cssClass: 'btn-default',
                
                action: function(dialogItself){
                	dialogItself.close();
                }
                
			}]
			
		});
		
	}
		
}
