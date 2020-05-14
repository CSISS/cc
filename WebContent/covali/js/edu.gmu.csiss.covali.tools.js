/**
*
* All the methods related to the tools panel
*
* Author : Ziheng Sun
* 
* Date: 06/19/2018
*
*/

edu.gmu.csiss.covali.tools = {
		
		init: function() {
            var dialogName = 'edu.gmu.csiss.covali.tools.jsframe.Tools';
            var dialogTitle = 'Tools';

            var ui = '<div class="modal-dialog" style="margin-left: 60px">';

            ui += "<button type=\"button\" onclick=\"edu.gmu.csiss.covali.nco.showDialog()\" class=\"btn btn-primary btn-tools\"><i class='fa fa-calculator'></i> Difference Map </button>";
            ui += "<button type=\"button\" onclick=\"edu.gmu.csiss.covali.statistics.showDialog()\" class=\"btn btn-primary btn-tools\"><i class='fa fa-chart-bar'></i> Statistics Report </button>";
            ui += "<button type=\"button\" onclick=\"edu.gmu.csiss.covali.regrid.showDialog()\" class=\"btn btn-primary btn-tools\"><i class='fa fa-border-none'></i> Regrid </button>";
            ui += "<button type=\"button\" onclick=\"edu.gmu.csiss.covali.print.showDialog()\" class=\"btn btn-primary btn-tools\"><i class='fa fa-print'></i> Print </button>";

            ui += '</div>';

            edu.gmu.csiss.covali.menu.createDialog(dialogName, dialogTitle, ui, 160);
        },

        // basic API for process-and-load functions
        // 1. POST a JSON data object to URL
        // 2. Receive a JSON structure that is one of this:
        // data = {'success': {'filepath': '/covaliFiles/results/newfile.nc', 'message': 'STDOUT and STDERR from the script here'}}
        // data = {'failure': {'message': 'Bad request caused Exception...'}}
        remoteProcessAndLoad: function(url, data) {

            $.ajax({
                dataType: 'json',
                type: "POST",
                data: data,
                url: url,
            }).success(function (data) {
                edu.gmu.csiss.covali.menu.closeDialog('edu.gmu.csiss.covali.jsframe.RemoteProcessingWaiting');
                console.log(data);

                if(data.success){
                    var filepath = data.success.filepath
                    edu.gmu.csiss.covali.local.showFileLoadingDialog(filepath);
                    edu.gmu.csiss.covali.local.loadWMSFile(filepath);
                } else {
                    alert(data.failure.message);
                }
            }).error(function(data) {
                edu.gmu.csiss.covali.menu.closeDialog('edu.gmu.csiss.covali.jsframe.RemoteProcessingWaiting');
                console.log(data);

                alert(data.responseText);
            });
        }
		
}