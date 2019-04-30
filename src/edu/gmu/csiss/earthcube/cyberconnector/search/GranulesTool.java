package edu.gmu.csiss.earthcube.cyberconnector.search;

import edu.gmu.csiss.earthcube.cyberconnector.utils.MyHttpUtils;
import edu.gmu.csiss.earthcube.cyberconnector.utils.SysDir;
import org.apache.commons.io.IOUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;


public class GranulesTool {
    public static List<Granule> getCollectionGranules(SearchRequest request) {
        String url = SysDir.thredds_index_url + "/index?collection_name=" + request.getSearchtext();

        String jsonOutput;
        List<Granule> granules = new ArrayList<Granule>();

        ObjectMapper objectMapper = new ObjectMapper();

        try {
            jsonOutput = MyHttpUtils.doGet(url);
            granules = objectMapper.readValue(jsonOutput, new TypeReference<List<Granule>>(){});
        } catch (Exception e) {
            e.printStackTrace();
        }


        return granules;
    }
}
