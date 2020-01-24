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
            ui += "<button type=\"button\" onclick=\"edu.gmu.csiss.covali.animation.showDialog()\" class=\"btn btn-primary btn-tools\"><i class='fa fa-film'></i> Create Animation </button>";
            ui += "<button type=\"button\" onclick=\"edu.gmu.csiss.covali.regrid.showDialog()\" class=\"btn btn-primary btn-tools\"><i class='fa fa-border-none'></i> Regrid </button>";
            ui += "<button type=\"button\" onclick=\"edu.gmu.csiss.covali.print.showDialog()\" class=\"btn btn-primary btn-tools\"><i class='fa fa-print'></i> Print </button>";

            ui += '</div>';

            edu.gmu.csiss.covali.menu.createDialog(dialogName, dialogTitle, ui, 160);
        }
		
}