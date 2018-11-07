package edu.cyberconnector.web;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.context.request.WebRequest;

import edu.cyberconnector.tools.*;
import edu.cyberconnector.utils.*;
import edu.cyberconnector.ncwms.ncWMSTool;


@RestController
public class FileDataController {

    private static Logger log = LoggerFactory.getLogger(FileDataController.class);

    @GetMapping(value = "/localfilelist")
    public @ResponseBody String localfilelist(WebRequest request){

        String resp = null;

        String rootlocation = request.getParameter("root");

        try {

            //have some potential threats. Restrict the folder that COVALI can publish later

            if(rootlocation==null) {

                resp = LocalFileTool.getLocalFileList("/");

            } else
                resp = LocalFileTool.getLocalFileList(rootlocation);
        } catch(Exception e) {

            e.printStackTrace();

            resp = "{\"output\":\"failure\",\"reason\": \""+

                    e.getLocalizedMessage() +

                    "\"}";

        }

        return resp;
    }

    // Add dataset into ncWMS
    @PostMapping(value = "/adddata")
    public @ResponseBody String adddata(WebRequest request){

        String resp = null;


        String id = RandomString.get(8);

        String location = request.getParameter("location");

        try {

            if(location.startsWith(SysDir.PREFIXURL)) {

                location = BaseTool.getCyberConnectorRootPath() + "/" + location.replaceAll(SysDir.PREFIXURL+"/CyberConnector/","");

                log.debug("the new location is : " + location);

            }else if(location.startsWith(SysDir.covali_file_path)){

//    			location = location;

            }else {

                location = SysDir.covali_file_path + location;

            }

            ncWMSTool.addDataset("id="+id + "&location=" + location);

            resp = "{\"output\":\"success\",\"id\":\""+id+"\"}";

        } catch(Exception e) {

            e.printStackTrace();

            resp = "{\"output\":\"failure\",\"reason\": \""+

                    e.getLocalizedMessage() +

                    "\"}";

        }
        return resp;
    }

    @PostMapping(value = "/cachecasual")
    public @ResponseBody String cachecasualdata(WebRequest request){

        String resp = null;

        String dataurl = request.getParameter("data");

        String fileurl = BaseTool.cacheDataLocally(dataurl);

        resp = "{\"output\":\"success\", \"file_url\": \""+fileurl+"\"}";

        return resp;
    }

    @PostMapping(value = "/cache")
    public @ResponseBody String cachedata(WebRequest request){

        String resp = null;

        String dataurl = request.getParameter("data");

        //update the metadata in CSW

        String id = request.getParameter("id");

        //the updating function is disabled for now, as the transaction function in PyCSW is disabled.

//    	if(SearchTool.updatePyCSWDataURL(id, dataurl)){

        String fileurl = BaseTool.cacheDataLocally(dataurl);

        if(!BaseTool.isNull(fileurl)) {

            resp = "{\"output\":\"success\"}";

        } else{

            resp = "{\"output\":\"failure\"}";

        }

        return resp;
    }
}
