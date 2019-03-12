package edu.gmu.csiss.earthcube.cyberconnector.tools;


import edu.gmu.csiss.earthcube.cyberconnector.products.Product;
import edu.gmu.csiss.earthcube.cyberconnector.search.SearchRequest;
import edu.gmu.csiss.earthcube.cyberconnector.utils.BaseTool;
import edu.iris.dmc.criteria.OutputLevel;
import edu.iris.dmc.criteria.StationCriteria;
import edu.iris.dmc.fdsn.station.model.Channel;
import edu.iris.dmc.fdsn.station.model.Network;
import edu.iris.dmc.fdsn.station.model.Station;
import edu.iris.dmc.service.ServiceUtil;
import edu.iris.dmc.service.StationService;
import org.apache.log4j.Logger;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;

public class IRISTool {

    private static Logger logger = Logger.getLogger(IRISTool.class);

    public static List<Station> demoList() {
        List<Station> stations = globalList();
        List<Station> arctic = arcticList();

        stations.addAll(arctic);

        // unique values
        HashMap<String, Station> hm = new HashMap();
        for (Station s: stations) {
            hm.put(s.getCode(), s);
        }


        return new ArrayList(hm.values());
    }

    public static List<Station> globalList() {
        StationCriteria criteria = new StationCriteria();

        criteria.addNetwork("KP");
        criteria.addNetwork("GG");
        criteria.addNetwork("VI");
        criteria.addNetwork("XF");
        criteria.addNetwork("XH");
        criteria.addNetwork("IU");

        return IRISTool.fetchStations(criteria, OutputLevel.STATION);
    }

    public static List<Station> arcticList() {
        List<Station> results = new ArrayList<>();

        // Spatial BBox
        StationCriteria criteria = new StationCriteria();
        criteria.setMinimumLatitude(75.0);
        criteria.setMaximumLatitude(90.0);


        return IRISTool.fetchStations(criteria, OutputLevel.STATION);
    }

    public static List<Station> fetchStations(StationCriteria stationCriteria, OutputLevel level) {
        ServiceUtil serviceUtil = ServiceUtil.getInstance();
        serviceUtil.setAppName("GMU CSISS CyberConnector");
        StationService stationService = serviceUtil.getStationService();

        // Get the results
        List<Network> ls;
        List<Station> results = new ArrayList<>();

        try {
            ls = stationService.fetch(stationCriteria, level);
            for (Network n : ls) {
                for (Station s : n.getStations()) {
                    results.add(s);
                }
            }
        } catch (Exception e) {
            logger.error(e);
        }

        return results;
    }

    public static List<Channel> listChannels(String network, String station) {
        StationCriteria criteria = new StationCriteria();
        criteria.addNetwork(network).addStation(station);


        List<Station> stations = IRISTool.fetchStations(criteria, OutputLevel.CHANNEL);
        List<Channel> results = new ArrayList<>();
        for(Station s : stations) {
            for(Channel c : s.getChannels()) {
                results.add(c);
            }
        }

        return results;
    }


    public static String stationToJSON(Station s) {
        HashMap<String, String> hm = new HashMap();

        hm.put("networkcode", s.getNetwork().getCode());
        hm.put("code", s.getCode());
        hm.put("lat", "" + s.getLatitude().getValue());
        hm.put("lon", "" + s.getLongitude().getValue());

        return BaseTool.toJSONString(hm);
    }

    public static String channelToJSON(Channel c) {
        return BaseTool.toJSONString(IRISTool.channelToHMap(c));
    }

    public static HashMap<String, String> channelToHMap(Channel c) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'hh:mm:ss");

        HashMap<String, String> hm = new HashMap();

        Station s = c.getStation();

        hm.put("networkcode", s.getNetwork().getCode());
        hm.put("stationcode", s.getCode());
        hm.put("code", c.getCode());
        hm.put("start", dateFormat.format(c.getStartDate()));
        hm.put("end", dateFormat.format(c.getEndDate()));

        String locationCode = c.getLocationCode();
        if(locationCode == "") {
            locationCode = "--";
        }
        hm.put("location", locationCode);

//        http://service.iris.edu/irisws/timeseriesplot/1/query?net=IU&sta=ANMO&loc=00&cha=LHZ&start=2004-12-26T00%3A00%3A00&end=2004-12-26T13%3A01%3A00
//        http://service.iris.edu/fdsnws/dataselect/1/query?net=IU&sta=LCO&loc=00&cha=BHZ&start=2018-11-01T20%3A12%3A12&end=2018-11-01T20%3A35%3A33&format=geocsv.inline&nodata=404"

        String query = "";

        query += "?net="      + hm.get("networkcode");
        query += "&sta="      + hm.get("stationcode");
        query += "&cha="      + hm.get("code");
        query += "&loc="      + hm.get("location");
        query += "&start="    + hm.get("start");
        query += "&end="      + hm.get("end");

        hm.put("jpegurl", "http://service.iris.edu/irisws/timeseriesplot/1/query" + query);
        hm.put("geocsvurl", "http://service.iris.edu/fdsnws/dataselect/1/query" + query + "&format=geocsv.zip&nodata=404");

        return hm;
    }

}
