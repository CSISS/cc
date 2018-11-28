package edu.cyberconnector.web;

import javax.servlet.http.HttpSession;

import edu.cyberconnector.utils.SysDir;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;


@Controller
public class PortalController {

    private static Logger log = LoggerFactory.getLogger(PortalController.class);
	
    @GetMapping("/")
    public String index() {
        return "index";
    }

    @GetMapping("/web/index")
    public String webIndex() {
        return "index";
    }


    @GetMapping("/web/demo")
    public String demo() {
        return "demo";
    }


    @GetMapping("/web/function")
    public String function() {
        return "function";
    }

    @GetMapping("{name}")
    public String view(@PathVariable String name, HttpSession session) {
    	
    	log.debug("Current user: " + (String)session.getAttribute("sessionUser"));
    	
    	log.debug("Current sessionId: " + (String)session.getId());
    	
        return name;
    }
    
    
}