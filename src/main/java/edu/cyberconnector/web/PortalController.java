package edu.cyberconnector.web;

import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;


@RestController
public class PortalController {

    private static Logger log = LoggerFactory.getLogger(PortalController.class);
	
    @GetMapping("/")
    public String index() {
        return "index";
    }

    @GetMapping("{name}")
    public String view(@PathVariable String name, HttpSession session) {
    	
    	log.debug("Current user: " + (String)session.getAttribute("sessionUser"));
    	
    	log.debug("Current sessionId: " + (String)session.getId());
    	
        return name;
    }
    
    
}