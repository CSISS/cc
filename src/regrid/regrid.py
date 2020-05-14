import xarray as xr
import xesmf as xe
import sys

import json

# params:
# {
#     "datafile" : "/media/volume1/cc_cache/regrid/asr15km.anl.2D.20010101.nc",
#     "gridfile" : "/media/volume1/cc_cache/regrid/grid-720x1440.nc",
#     "outfile" : "asr15km.anl.2D.20010101-gridto-1x2.nc4",
#     "isCustomGrid" : "true",
#     "customLat" : "1",
#     "customLon" : "2",
#     "isPeriodic" : "true"
# }
params = json.loads(sys.argv[1])
params = {k: v[0] for k, v in params.items()}


if(params['isCustomGrid'] == 'true'):
    d_lat = float(params['customLat'])
    d_lon = float(params['customLon'])

    grid = xe.util.grid_global(d_lon, d_lat)
else:
    grid = xr.open_dataset(params['gridfile'])


data = xr.open_dataset(params['datafile'])


if 'XLAT' in data.coords._names:
    data = data.rename({'XLAT':'lat','XLONG':'lon'})#, 'Time': 'time'})

if 'XLAT' in grid.coords._names:
    grid = grid.rename({'XLAT':'lat','XLONG':'lon'})#, 'Time': 'time'})

regridder = xe.Regridder(data, grid, 'bilinear', reuse_weights=True, periodic=(params['isPeriodic'] == 'true'))

# select vars with more than 1 dim that can be regridded
regridded_vars = dict()
for vname in data.variables:
    if data[vname].ndim > 1 and not vname in ['lat', 'lon', 'x', 'y']:
        regridded_vars[vname] = regridder(data[vname], keep_attrs=True)


data_out = xr.Dataset(regridded_vars)

print("Create regridded file: " + params['outfile'])
data_out.to_netcdf(params['outfile'])