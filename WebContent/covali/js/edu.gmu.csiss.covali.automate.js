edu.gmu.csiss.covali.automate = {

    test: function() {
        // edu.gmu.csiss.covali.search.init();
        // edu.gmu.csiss.covali.iris.init();
        // edu.gmu.csiss.covali.iris.showStationDialog('IU', 'SSPA')
        this.loadExampleData();

    },

    loadExampleData: function(){
        edu.gmu.csiss.covali.wms.parse(null, "../../ncWMS2/wms?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0");
        setTimeout(function() {
            edu.gmu.csiss.covali.menu.closeAllDialogs();
            edu.gmu.csiss.covali.wms.addLayer('left', 'GFS_CONUS_80km_20170611_0000-klr2/Temperature_isobaric', "default-scalar/default", "2017-06-11T00:00:00.000Z", "100.0");
            edu.gmu.csiss.covali.wms.addLayer('left', "asr15km.anl.2D.20010101-7rfp/PSFC", "default-scalar/default", "2001-01-01T00:00:00.000Z", "");

            edu.gmu.csiss.covali.wms.addLayer('right', "asr15km.anl.2D.20010101-7rfp/ISLTYP", "default-scalar/default", "2001-01-01T00:00:00.000Z", "");
        }, 1000);

        setTimeout(function() {
            edu.gmu.csiss.covali.settings.init();
        }, 2000);
    },

    loadRemoteWMS: function(){
        // edu.gmu.csiss.covali.wms.parse(null, 'http://nsidc.org/cgi-bin/acap.pl?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0');
        edu.gmu.csiss.covali.wms.parse(null, 'https://imageserver.gisdata.mn.gov/cgi-bin/wmsll?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities');
        setTimeout(function() {
            // edu.gmu.csiss.covali.wms.addLayer("left", "sea_ice_concentration_01_graded_18classes", "default", "", "");
        }, 5500);
    },

    loadDuplicateLayer: function(){
        edu.gmu.csiss.covali.wms.parse(null, "../../ncWMS2/wms?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0");
        setTimeout(function() {
            edu.gmu.csiss.covali.menu.closeAllDialogs();
            edu.gmu.csiss.covali.wms.addLayer('left', "asr15km.anl.2D.20010101-7rfp/PSFC", "default-scalar/default", "2001-01-01T00:00:00.000Z", "");
            // edu.gmu.csiss.covali.wms.addLayer('left', "asr15km.anl.2D.20010101-7rfp/PSFC", "contours", "2001-01-01T00:00:00.000Z", "");
            setTimeout(function() {
            }, 3000);
            // edu.gmu.csiss.covali.statistics.showDialog();
        }, 1000);
    },

    createAnimation: function() {
        var layername = "asr15km.anl.2D.20010101-7rfp/ISLTYP";
        var mapside = "right";
        var starttime = "2001-01-01T00:00:00.000Z";
        var endtime = "2001-01-01T18:00:00.000Z";
        var framerate ="1";
        setTimeout(function() {
            edu.gmu.csiss.covali.wms.loadAnimation(layername, mapside, starttime, endtime, framerate);
        }, 1400);
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