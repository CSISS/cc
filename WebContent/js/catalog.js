var g_catalogs = [
    {
        catalogId: 'NCEP Forecast Model',
        url: 'http://cube.csiss.gmu.edu/srv/csw/discovery',
        contentType: 'application/xml;charset=UTF-8',
        datasets: [
            {label: 'Global Forecast System (GFS)', value: '/NCEP/GFS/'},
            {label: 'Downscaled GFS with Eta Extension (DGEX)', value: '/NCEP/DGEX/'},
            {label: 'Global Ensemble Forecasting System (GEFS)', value: '/NCEP/GEFS/'},
            {label: 'High Resolution Rapid Refresh (HRRR)', value: '/NCEP/HRRR/'},
            {label: 'North American Model (NAM)', value: '/NCEP/NAM/'},
            {label: 'Rapid Refresh (RAP)', value: '/NCEP/RAP/'},
            {label: 'Short Range Ensemble Forecasting (SREF)', value: '/NCEP/SREF/'},
            {label: 'Wave Watch III (WW3)', value: '/NCEP/WW3/'}
        ]
    }, {
        catalogId: 'FNMOC Forecast Model',
        url: 'http://cube.csiss.gmu.edu/srv/csw/discovery',
        contentType: 'application/xml;charset=UTF-8',
        datasets: [
            {label: 'Forecast of Aerosol Radiative Optical Properties (FAROP) Model', value: 'FNMOC/FAROP/'},
            {label: 'Coupled Ocean / Atmosphere Mesoscale Prediction System (COAMPS) Model', value: '/FNMOC/COAMPS/'},
            {label: 'Navy Coupled Ocean Data Assimilation (NCODA) Model', value: '/FNMOC/NCODA/'},
            {label: 'NAVy Global Environmental Model (NAVGEM) Model', value: '/FNMOC/NAVGEM/'},
            {label: 'Wave Watch 3 (WW3) Model', value: '/FNMOC/WW3/'}
        ]
    }, {
        catalogId: 'NCEP Analyses',
        url: 'http://cube.csiss.gmu.edu/srv/csw/discovery',
        contentType: 'application/xml;charset=UTF-8',
        datasets: [
            {label: 'National Digital Forecast Database (NDFD)', value: '/NCEP/NDFD/'},
            {label: 'Real Time Mesoscale Analysis (RTMA)', value: '/NCEP/RTMA/'},
            {label: 'Multi-Radar Multi-Sensor (MRMS) Analysis', value: '/NCEP/MRMS/'}
        ]
    }, {
        catalogId: 'Observation Data',
        url: 'http://cube.csiss.gmu.edu/srv/csw/discovery',
        contentType: 'application/xml;charset=UTF-8',
        datasets: [
            {label: 'Metar Station Data', value: 'nws/metar/'},
            {label: 'Surface Buoy Point Data', value: 'nws/buoy/'},
            {label: 'Surface Synoptic Point Data', value: 'nws/synoptic/'},
            {label: 'Wind Profile Data for KBOU', value: 'NWS/Sounding'}
        ]
    }, {
        catalogId: 'Satellite Data',
        url: 'http://cube.csiss.gmu.edu/srv/csw/discovery',
        contentType: 'application/xml;charset=UTF-8',
        datasets: [
            {label: 'Shortwave IR (3.9um)', value: 'SSEC/IDD-Satellite/3.9/'},
            {label: 'Water Vapor (6.5 / 5.7 um)', value: 'SSEC/IDD-Satellite/WV'},
            {label: 'Infrared (11 um)', value: 'SSEC/IDD-Satellite/IR/'},
            {label: 'CO2 (13.3 um)', value: 'SSEC/IDD-Satellite/13.3/'},
            {label: 'Visible', value: 'SSEC/IDD-Satellite/VIS/'},
            {label: 'SOUND-3.98', value: 'SSEC/IDD-Satellite/SOUND-3.98/'},
            {label: 'SOUND-4.45', value: 'SSEC/IDD-Satellite/SOUND-4.45/'},
            {label: 'SOUND-6.51', value: 'SSEC/IDD-Satellite/SOUND-6.51/'},
            {label: 'SOUND-7.02', value: 'SSEC/IDD-Satellite/SOUND-7.02/'},
            {label: 'SOUND-7.43', value: 'SSEC/IDD-Satellite/SOUND-7.43/'},
            {label: 'SOUND-11.03', value: 'SSEC/IDD-Satellite/SOUND-11.03/'},
            {label: 'SOUND-14.06', value: 'SSEC/IDD-Satellite/SOUND-14.06/'},
            {label: 'SOUND-VIS', value: 'SSEC/IDD-Satellite/SOUND-VIS/'},
            {label: 'SOUND-Lifted Index', value: 'SSEC/IDD-Satellite/LI/'},
            {label: 'SOUND-Precipitable Water', value: 'SSEC/IDD-Satellite/PW/'},
            {label: 'SOUND-Cloud Top Pressure', value: 'SSEC/IDD-Satellite/CTP/'},
            {label: 'SOUND-Surface Skin Temperature', value: 'SSEC/IDD-Satellite/SFC-T/'}
        ]
    }, {
        catalogId: 'Radar Data (IDD)',
        url: 'http://cube.csiss.gmu.edu/srv/csw/discovery',
        contentType: 'application/xml;charset=UTF-8',
        datasets: [
            {label: 'NEXRAD Level II Radar WSR-88D', value: 'NWS/NEXRAD2/'},
            {label: 'TDWR Level III Radar', value: 'NWS/TDWR3/'}
        ]
    }, {
        catalogId: 'Radar Data (NEXRAD National Composites)',
        url: 'http://cube.csiss.gmu.edu/srv/csw/discovery',
        contentType: 'application/xml;charset=UTF-8',
        datasets: [
            {label: 'Unidata NEXRAD Composites (GINI)', value: '/NEXRAD/NationalComposite/GINI/'},
            {label: 'NWS NEXRAD Composite VIP 10 km', value: '/nexrad/composite/nws/'},
            {label: 'Unidata NEXRAD Composite Reflectivity', value: '/nexrad/composite/unidata/'}
        ]
    }
]
