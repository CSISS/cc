import xarray as xr
import xesmf as xe
import sys

datafile = sys.argv[1]
gridfile = sys.argv[2]
outfile = sys.argv[3]

data = xr.open_dataset(datafile)
grid = xr.open_dataset(gridfile)

if 'XLAT' in data.coords._names:
    data = data.rename({'XLAT':'lat','XLONG':'lon'})

if 'XLAT' in grid.coords._names:
    grid = grid.rename({'XLAT':'lat','XLONG':'lon'})


# delete variables with less than 2 dimensions from data. they won't be regridder
for vname in data.variables:
    if data[vname].ndim < 2:
        data = data.drop(vname)

regridder = xe.Regridder(data, grid, 'bilinear', reuse_weights=True)

data_out = regridder(data, keep_attrs=True)

data_out.to_netcdf(outfile)

print("Create regridded file: " + outfile)
