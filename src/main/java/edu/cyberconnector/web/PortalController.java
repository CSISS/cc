package edu.cyberconnector.web;

import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;

/**
 * 
 * This is the controller of SpringMVC for CyberConnector
 * 
 * @author Z.S.
 * @date 20170126
 * 
 */
@RestController
public class PortalController {

	Logger logger = Logger.getLogger(this.getClass());
	
    @GetMapping("/")
    public String index() {
        return "index";
    }

    @GetMapping("{name}")
    public String view(@PathVariable String name, HttpSession session) {
    	
    	logger.debug("Current user: " + (String)session.getAttribute("sessionUser"));
    	
    	logger.debug("Current sessionId: " + (String)session.getId());
    	
        return name;
    }
    
    
}