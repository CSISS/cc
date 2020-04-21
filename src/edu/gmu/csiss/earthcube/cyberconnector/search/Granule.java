package edu.gmu.csiss.earthcube.cyberconnector.search;

import edu.gmu.csiss.earthcube.cyberconnector.products.Product;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Granule {

    private String name, iso_url, access_url, time_start, time_end;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getIso_url() {
        return iso_url;
    }

    public void setIso_url(String iso_url) {
        this.iso_url = iso_url;
    }

    public String getAccess_url() {
        return access_url;
    }

    public void setAccess_url(String access_url) {
        this.access_url = access_url;
    }

    public String getTime_start() {
        return time_start;
    }

    public void setTime_start(String time_start) {
        this.time_start = time_start;
    }

    public String getTime_end() {
        return time_end;
    }

    public void setTime_end(String time_end) {
        this.time_end = time_end;
    }

    public Granule() {
    }

    public Product toProduct(Product collectionRecord, int index, int total) {
        Product p = new Product();

        String[] parts = this.name.split("/");
        String title = parts[parts.length - 1];

        p.setTitle(title);
        p.setName(this.name);
        p.setId(Product.generateSafeId(title, this.name));

        p.setDesc("Granule " + (index + 1) + " of " + total + " in " + collectionRecord.getTitle());

        p.setBegintime(this.time_start);
        p.setEndtime(this.time_end);
        p.setWest(collectionRecord.getWest());
        p.setEast(collectionRecord.getEast());
        p.setNorth(collectionRecord.getNorth());
        p.setSouth(collectionRecord.getSouth());
        p.setDownloadurl(this.access_url);
        p.setIfvirtual("0");
        p.setIsspatial("1");
        p.setIscollection("0");
        p.setVariables(collectionRecord.getVariables());
        p.setCachedFilePath();

        return p;
    }
}
