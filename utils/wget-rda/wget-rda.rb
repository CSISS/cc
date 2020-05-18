require 'nokogiri'

def url_download(url, fpath)
    puts("Save #{url} -> #{fpath}")
    `wget -q --load-cookies rda-cookies.txt  -O #{fpath} '#{url}'`
end

def url_read(url)
    puts("Read #{url}")
    return `wget -q --load-cookies rda-cookies.txt  -O - '#{url}'`
end




def getyeargroup(ds, year, gid, gname)
	dir = "#{ds}/#{gname}/#{year}"
	puts "Process #{dir}  g=#{year}#{gid}"
	`mkdir -p #{dir}`

	gurl = "https://rda.ucar.edu/data/#{ds}/index.html?g=#{year}#{gid}"
	doc = Nokogiri::HTML(url_read(gurl))


    doc.css('table.filelist tr td:nth-of-type(3) a:nth-of-type(1)').each do |l|
        dsurl = "https://rda.ucar.edu" + l['href']
        fpath = "#{dir}/#{l.content}"
        
        url_download(dsurl, fpath)     
    end
end

dataset = "ds630.1"

years = 
%w(
2008
2009
2010
2011
2012
2013
2014
2015
2016
2017
)

groups = []
# ERA5 atmospheric monthly mean surface analysis [netCDF4]
groups << ['34', 'e5.mnth.mean.an.sfc.nc']
# ERA5 atmospheric monthly diurnal mean surface analysis [netCDF4]
groups << ['33', 'e5.mnth.diur.an.sfc.nc']



threads = []
4.times do 
	threads << Thread.new {
		until years.empty?
			year = years.pop
			groups.each do |id, name|
				getyeargroup(dataset, year, id, name)
			end
			
		end
	}
end


threads.each {|t| t.join}



