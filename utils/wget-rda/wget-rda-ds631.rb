years = 
%w(
2000
2001
2002
2003
2004
2005
2006
2007
2008
2009
2010
2011
2012
2013
2014
2015
2016)


def getyear(year)
	puts "get year #{year}"
	`mkdir #{year}`

	links = `wget -q --load-cookies rda-cookies.txt  -O - 'https://rda.ucar.edu/data/ds631.1/index.html?g=#{year}5'`

	linksnc = links.lines.map {|l| l.match(/asr15.anl.2D\/asr15km.anl.2D.\d+?.nc/)}.compact.map {|md| md[0]}.uniq

	linksnc.each do |link|
		puts link
		url = 'https://rda.ucar.edu/data/ds631.1/' + link
		name = link.split('/').last
		`wget -q --load-cookies rda-cookies.txt #{url} -O #{year}/#{name}`
	end
end

threads = []
8.times do 
	threads << Thread.new {
		until years.empty?
			year = years.pop
			getyear(year)
		end
	}
end


threads.each {|t| t.join}