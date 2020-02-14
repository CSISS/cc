import xarray as xr
import xesmf as xe
import sys

datafile = sys.argv[1]
gridfile = sys.argv[2]
outfile = sys.argv[3]
periodic = (sys.argv[4].lower() == 'true')
make_grid = (sys.argv[5].lower() == 'true')

if(make_grid):
    d_lon = float(sys.argv[6])
    d_lat = float(sys.argv[6])

    grid = xe.util.grid_global(d_lon, d_lat)
else:
    grid = xr.open_dataset(gridfile)


data = xr.open_dataset(datafile)


if 'XLAT' in data.coords._names:
    data = data.rename({'XLAT':'lat','XLONG':'lon'})#, 'Time': 'time'})

if 'XLAT' in grid.coords._names:
    grid = grid.rename({'XLAT':'lat','XLONG':'lon'})#, 'Time': 'time'})

regridder = xe.Regridder(data, grid, 'bilinear', reuse_weights=True, periodic=periodic)

# select vars with more than 1 dim that can be regridded
regridded_vars = dict()
for vname in data.variables:
    if data[vname].ndim > 1 and not vname in ['lat', 'lon', 'x', 'y']:
        regridded_vars[vname] = regridder(data[vname])


data_out = xr.Dataset(regridded_vars)

print("Create regridded file: " + outfile)
data_out.to_netcdf(outfile)