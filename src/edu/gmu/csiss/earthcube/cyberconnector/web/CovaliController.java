package edu.gmu.csiss.earthcube.cyberconnector.web;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpSession;

import edu.gmu.csiss.earthcube.cyberconnector.products.ProductCache;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.log4j.Logger;
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
import edu.gmu.csiss.earthcube.cyberconnector.products.Product;
import edu.gmu.csiss.earthcube.cyberconnector.search.Granule;
import edu.gmu.csiss.earthcube.cyberconnector.search.GranulesTool;
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
    	
    	String rootlocation = request.getParameter("root");
    	
    	try {
    		
    		String name = (String)session.getAttribute("sessionUser");
    		
    		logger.debug("Recognized user of the incoming traffic: " + name);
    		
    		if(SysDir.login_required && name == null) {
    			
    			resp = "{\"ret\": \"login\", \"reason\": \"Login is required to access the public files.\"}";
    			
    		}else {
    			
        		//have some potential threats. Restrict the folder that COVALI can publish later
        		
        		if(rootlocation==null) {
        			
        			resp = LocalFileTool.getLocalFileList("/tmp/");
        			
        		}else
        		
        			resp = LocalFileTool.getLocalFileList(rootlocation);
        		
    		}
    		
    	}catch(Exception e) {
    		
    		e.printStackTrace();
    		
    		resp = "{\"output\":\"failure\",\"reason\": \""+
    				
    				e.getLocalizedMessage() +
    				
    				"\"}";
    				
    	}
    	
    	return resp;
    	
    }
    
	// cache remote data in the local filesystem
    @RequestMapping(value = "/cachecasual", method = RequestMethod.POST)
    public @ResponseBody String cachecasualdata(ModelMap model, WebRequest request, SessionStatus status, HttpSession session){
    	
    	String resp = null;
    	
    	String dataurl = request.getParameter("accessurl");
		String id = request.getParameter("id");


		try {
			ProductCache cache = new ProductCache(id, dataurl);
			if (!cache.cacheExists()) {
				cache.doCache();
			}
			resp = "{\"output\":\"success\", \"file_url\": \""+cache.getCacheUrl()+"\"}";

		} catch(Exception e) {
			resp = "{\"output\":\"failure\"}";

		}

    	return resp;
    }
    
	// cache remote data in the local filesystem and update the CSW record
	@RequestMapping(value = "/cache", method = RequestMethod.POST)
    public @ResponseBody String cachedata(ModelMap model, WebRequest request, SessionStatus status, HttpSession session){
    	
    	String resp = null;
    	
    	String dataurl = request.getParameter("data");
    	
    	//update the metadata in CSW
    	
    	String id = request.getParameter("id");
    	
    	//the updating function is disabled for now, as the transaction function in PyCSW is disabled. 
    	
//    	if(SearchTool.updatePyCSWDataURL(id, dataurl)){

		try {
			ProductCache cache = new ProductCache(id, dataurl);
			if (!cache.cacheExists()) {
				cache.doCache();
			}
			resp = "{\"output\":\"success\"}";

		} catch(Exception e) {
			resp = "{\"output\":\"failure\"}";

		}
    	
    	return resp;
    	
    }
	
	@RequestMapping(value = "/downloadLocalFile", method = RequestMethod.POST)
    public @ResponseBody String downloadLocalFile(ModelMap model, WebRequest request, SessionStatus status, HttpSession session){
    	
    	String resp = null;
    	
//    	String querystr = request.getQueryString();
    	
    	String path = request.getParameter("path");
    	
    	try {
    		
    		String url = LocalFileTool.turnLocalFile2Downloadable(path);
    		
    		File f = new File(path);
    		
    		resp = "{\"output\":\"success\",\"url\":\""+url+"\", \"filename\": \""+f.getName()+"\"}";
    		
    	}catch(Exception e) {
    		
    		e.printStackTrace();
    		
    		resp = "{\"output\":\"failure\",\"reason\": \""+
    				
    				e.getLocalizedMessage() +
    				
    				"\"}";
    				
    	}
    	
    	return resp;
    	
    }
	
	@RequestMapping(value = "/downloadWMSFile", method = RequestMethod.POST)
    public @ResponseBody String downloadWMSFile(ModelMap model, WebRequest request, SessionStatus status, HttpSession session){
    	
    	String resp = null;
    	
//    	String querystr = request.getQueryString();
    	
    	String id = request.getParameter("id");
    	
    	try {
    		
    		String location = ncWMSTool.getLocationByWMSLayerId(id);
    		
    		String url = LocalFileTool.turnLocalFile2Downloadable(location);
    		
    		File f = new File(location);
    		
    		resp = "{\"output\":\"success\",\"url\":\""+url+"\", \"filename\": \""+f.getName()+"\"}";
    		
    	}catch(Exception e) {
    		
    		e.printStackTrace();
    		
    		resp = "{\"output\":\"failure\",\"reason\": \""+
    				
    				e.getLocalizedMessage() +
    				
    				"\"}";
    				
    	}
    	
    	return resp;
    	
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
    		
    		if(location.startsWith(SysDir.PREFIXURL)) {

				location = BaseTool.getCyberConnectorRootPath() + "/" + location.replaceAll(SysDir.PREFIXURL+"/CyberConnector/","");

    		}else if(location.startsWith(SysDir.getCovali_file_path())){
    			
//    			location = location;
    			
    		}else {
    			
    			File f = new File(location);
    			
    			File folder = new File(BaseTool.getCyberConnectorRootPath());
    			
    			if(f.getAbsolutePath().indexOf(folder.getPath())!=-1){
        			
        			//do nothing
        			
        		}else {
        			
        			location = SysDir.getCovali_file_path() + location;
        			
        		} 
    			
    		}

			File f = new File(location);
			String id = FilenameUtils.getBaseName(location);
    		
    		ncWMSTool.addDataset(id, location);
    		
    		resp = "{\"output\":\"success\",\"id\":\""+id+"\"}";
    		
    	}catch(Exception e) {
    		
    		e.printStackTrace();
    		
    		resp = "{\"output\":\"failure\",\"reason\": \""+
    				
    				e.getLocalizedMessage() +
    				
    				"\"}";
    				
    	}
    	
    	return resp;
    	
    }

}
