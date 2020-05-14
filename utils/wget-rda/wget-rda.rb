require 'nokogiri'

def url_download(url, fpath)
    puts("D #{url} #{fpath}")
    `wget -q --load-cookies rda-cookies.txt  -O #{fpath} '#{url}'`
end

def url_read(url)
    puts("r #{url}")
    return `wget -q --load-cookies rda-cookies.txt  -O - '#{url}'`
end


def get_group(gid, gname)
    `mkdir -p #{gname}`
    gurl = @dsurl + "/index.html?g=#{gid}"

    # TODO: support multiple pages    
    dsdoc = Nokogiri::HTML(url_read(gurl))
    dsdoc.css('table.filelist tr td:nth-of-type(3) a:nth-of-type(1)').each do |l|
        dsurl = "https://rda.ucar.edu" + l['href']
        fpath = "#{gname}/#{l.content}"
        fpath += ".#{@add_ftype}" if @add_ftype
        url_download(dsurl, fpath)
    end
end

### PARAMETERSs
@ds = "ds627.0"
@group_name_filter = "ei.oper.an.sfc"
@dsurl = "https://rda.ucar.edu/data/#{@ds}"
# @add_ftype = "grib1"

gdoc = Nokogiri::HTML(url_read(@dsurl + "/index.html"))

groups = []
gdoc.css('table.filelist tr.flcolor2 a').each do |l|
    # <a href="#sfol-wl-/data/ds627.0?g=19795">1979.ei.oper.an.ml</a>
    if(l['href'].match(/\?g=(\d+)/)) then
        gid = l['href'].match(/\?g=(\d+)/)[1]
        gname = l.content
        groups << [gid, gname] if gname.include?(@group_name_filter)
    end
end


NUM_THREADS = 3
threads = []
NUM_THREADS.times do 
    threads << Thread.new {
        get_group(*groups.pop) until groups.empty?
    }
end


threads.each {|t| t.join}


