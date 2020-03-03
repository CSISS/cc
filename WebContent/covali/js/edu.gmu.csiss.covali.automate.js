edu.gmu.csiss.covali.automate = {
    loadExampleData: function(){
        edu.gmu.csiss.covali.wms.parse(null, "../../ncWMS2/wms?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0");
        setTimeout(function() {
            edu.gmu.csiss.covali.menu.closeAllDialogs();
            edu.gmu.csiss.covali.wms.addLayer('right', 'GFS_CONUS_80km_20170611_0000-klr2/Temperature_isobaric', "default-scalar/default", "2017-06-11T00:00:00.000Z", "100.0");
            edu.gmu.csiss.covali.wms.addLayer('left', "asr15km.anl.2D.20010101-7rfp/PSFC", "default-scalar/default", "2001-01-01T00:00:00.000Z", "");
            setTimeout(function() {



            }, 3000);
            edu.gmu.csiss.covali.statistics.showDialog();
        }, 1000);
    },

    testRegrid: function() {
        edu.gmu.csiss.covali.regrid.showDialog();

        $('#regrid-datafile').val("/covaliFiles/asr15km.anl.2D.20010101.nc");
        $('#regrid-gridfile').val("/covaliFiles/tco199.gm8w.t2m.apr.nc");

        // $('#regrid-gridfile').val("/covaliFiles/tco199.gm8w.t2m.apr.nc");
        $('#regrid-gridfile').val("/covaliFiles/tco199.gm8w.t2m.apr.nc");

        $('#regrid-outdir').val("/covaliFiles");
        $('#regrid-datafile').change();

    },
}