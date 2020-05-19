package edu.gmu.csiss.earthcube.cyberconnector.web;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import edu.gmu.csiss.earthcube.cyberconnector.database.DataBaseOperation;
import edu.gmu.csiss.earthcube.cyberconnector.products.RemoteFileCache;
import edu.gmu.csiss.earthcube.cyberconnector.tools.IRISTool;
import edu.gmu.csiss.earthcube.cyberconnector.tools.ExternalShellCommandTool;
import edu.iris.dmc.fdsn.station.model.Channel;
import edu.iris.dmc.fdsn.station.model.Station;
import org.apache.commons.io.FilenameUtils;
import org.apache.log4j.Logger;
import org.json.simple.JSONValue;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.support.SessionStatus;
import org.springframework.web.context.request.WebRequest;

import edu.gmu.csiss.earthcube.cyberconnector.ncwms.ncWMSTool;
import edu.gmu.csiss.earthcube.cyberconnector.search.SearchRequest;
import edu.gmu.csiss.earthcube.cyberconnector.search.SearchResponse;
import edu.gmu.csiss.earthcube.cyberconnector.search.SearchTool;
import edu.gmu.csiss.earthcube.cyberconnector.tools.LocalFileTool;
import edu.gmu.csiss.earthcube.cyberconnector.utils.BaseTool;
import edu.gmu.csiss.earthcube.cyberconnector.utils.Message;
import edu.gmu.csiss.earthcube.cyberconnector.utils.RandomString;
import edu.gmu.csiss.earthcube.cyberconnector.utils.SysDir;

/**
*Class CovaliController.java
*Every bean COVALI used should be put here
*@author Ziheng Sun
*@time Oct 18, 2018 6:02:12 PM
*Original aim is to support COVALI.
*/	
@Controller 
//@SessionAttributes({"sessionUser"})
public class CovaliController {

	Logger logger = Logger.getLogger(this.getClass());

	@RequestMapping(value = "/regrid", method = RequestMethod.POST, produces = MediaType.TEXT_PLAIN_VALUE)
	public @ResponseBody String regrid(WebRequest request) {
		String result = ExternalShellCommandTool.regrid(request);

		return result;
	}


	@RequestMapping(value = "/nco/ncra", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody String nconcra(WebRequest request) {
		String command = request.getParameter("command");
		String result = ExternalShellCommandTool.execNcra(command);
		return result;
	}

	@RequestMapping(value = "/nco/ncbo", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody String nconcbo(WebRequest request) {
		String command = request.getParameter("command");
		String result = ExternalShellCommandTool.execNcbo(command);
		return result;
	}

	@RequestMapping(value = "/ncdump", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody String ncdump(WebRequest request) {
		String filepath = request.getParameter("filepath");
		String result = ExternalShellCommandTool.ncdump(filepath);
		return result;
	}

	@RequestMapping(value = "/iris/stations", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody String irisstationlist() {

		List<Station> stations = IRISTool.demoList();
		List<String> stationJson = new ArrayList<>();

		for (Station s: stations) {
			stationJson.add(IRISTool.stationToJSON(s));
		}
		return "[" + String.join(", ", stationJson) + "]";
	}

	@RequestMapping(value = "/iris/channels", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody String irischannellist(WebRequest request) {
		String station = request.getParameter("station");
		String network = request.getParameter("network");


		List<Channel> channels = IRISTool.listChannels(network, station);

		List<String> channelJson = new ArrayList<>();

		for (Channel c: channels) {
			channelJson.add(IRISTool.channelToJSON(c));
		}

		return "[" + String.join(", ", channelJson) + "]";
	}

	@RequestMapping(value = "/search", method = RequestMethod.GET)
    public String productsearch(@ModelAttribute("request") SearchRequest searchreq,  ModelMap model){

    	//int x = 1;
		//model.addAttribute("request", searchreq);

    	return "searchresult";
    }


    @RequestMapping(value = "/searchresult", method = RequestMethod.GET)
    public String displayresultget(@ModelAttribute("resp") SearchResponse searchresp, BindingResult result, ModelMap model, WebRequest request, SessionStatus status, HttpSession session){
    	
    	String name = (String)session.getAttribute("sessionUser");
    	
    	String resp = "message";
    	
    	if(name == null){
    		
    		resp = "redirect:login";
    		
    	}else{
    		
    		Message msg = new Message("search_result_servlet", "browser", "failed", false);
    		
    		msg.setTitle("Page 404");
        	
        	msg.setStrongmsg("Oops! The page doesn't exist.");
        	
        	msg.setDisplaymsg("Sorry for that. Contact our webmaster (zsun@gmu.edu) if any doubts.");
        	
        	model.addAttribute("message", msg);
        	
        	model.addAttribute("forwardURL", "index");
        	
        	model.addAttribute("forward", "redirect to main page");
    		
    	}
    	
    	return resp;
    	
    }
    

    @RequestMapping(value = "/search", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody String tableserver(@ModelAttribute("request") SearchRequest searchreq, WebRequest webreq) {

		SearchResponse sr = SearchTool.search(searchreq);
		
    	//for JQuery DataTables
    	String draw = webreq.getParameter("draw");

    	sr.setDraw(Integer.parseInt(draw));

		return BaseTool.toJSONString(sr);
		
    }

    /**
     * List local files in the shared folder
     * @param model
     * @param request
     * @param status
     * @param session
     * @return
     */
    @RequestMapping(value = "/localfilelist", method = RequestMethod.POST)
    public @ResponseBody String localfilelist(ModelMap model, WebRequest request, SessionStatus status, HttpSession session){
    	
    	String resp = null;
    	
//    	String querystr = request.getQueryString();
    	
    	String location = request.getParameter("location");
    	if(location.isEmpty()) {
    		location = "/";
		}
    	
    	try {
    		
    		String name = (String)session.getAttribute("sessionUser");
    		
    		logger.debug("Recognized user of the incoming traffic: " + name);
    		
    		if(SysDir.login_required && name == null) {
    			
    			resp = "{\"ret\": \"login\", \"reason\": \"Login is required to access the public files.\"}";
    			
    		}else {
       			resp = LocalFileTool.getJsonFileList(Paths.get(location));
    		}
    		
    	}catch(Exception e) {
    		
    		e.printStackTrace();
    		
    		resp = "{\"output\":\"failure\",\"reason\": \""+
    				
    				e.getLocalizedMessage() +
    				
    				"\"}";
    				
    	}
    	
    	return resp;
    	
    }
    
	@RequestMapping(value = "/cache", method = RequestMethod.POST)
    public @ResponseBody String cache(WebRequest request){
    	String resp = null;
		String downloadurl = request.getParameter("downloadurl");

		try {
			RemoteFileCache cache = new RemoteFileCache(downloadurl);
			if (!cache.cacheExists()) {
				cache.doCache();
			}
			resp = "{\"output\":\"success\", ";
			resp += "\"filepath\": \"" + cache.getCachedFilePath() + "\", ";
			resp += "\"downloadurl\": \"" + cache.getCachedUrl() + "\"}";
		} catch(Exception e) {
			resp = "{\"output\":\"failure\"}";
		}
    	
    	return resp;
    }


	@RequestMapping(value = "/download", method = RequestMethod.GET)
	public void download( HttpServletRequest request,  HttpServletResponse response, WebRequest webrequest) {
		Path path = Paths.get(BaseTool.urlDecode(webrequest.getParameter("path")));
		path = path.normalize().toAbsolutePath();

		if (!LocalFileTool.isFileDownloadAllowed(path)) {
			logger.error("Forbidden download location " + path.toString());
			response.setStatus(403);
			return;
		}

		try {
			Files.copy(path, response.getOutputStream());
			response.setContentType("application/octet-strean");
			response.setHeader("Content-Disposition", "attachment; filename=\"" + path.getFileName() + "\"");
			response.getOutputStream().flush();
		} catch (Exception e) {
			logger.error(e);
			e.printStackTrace();
		}
	}

	/**
     * Add dataset into ncWMS
     * add by Z.S. on 7/6/2018
     * @param model
     * @param request
     * @param status
     * @param session
     * @return
     */
    @RequestMapping(value = "/adddata", method = RequestMethod.POST)
    public @ResponseBody String adddata(ModelMap model, WebRequest request, SessionStatus status, HttpSession session){
    	String resp;

    	String location = request.getParameter("location");

    	try {

			File f = new File(location);
			String id = FilenameUtils.getBaseName(location) + '-' + RandomString.get(4);
    		
    		ncWMSTool.addDataset(id, location);
    		
    		resp = "{\"output\":\"success\",\"id\":\""+id+"\"}";
    		
    	}catch(Exception e) {
    		
    		e.printStackTrace();
    		
    		resp = "{\"output\":\"failure\",\"reason\": \""+
					JSONValue.escape(e.getLocalizedMessage()) +
    				"\"}";
    				
    	}
    	
    	return resp;
    	
    }

}
