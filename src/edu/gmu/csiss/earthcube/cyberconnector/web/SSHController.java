package edu.gmu.csiss.earthcube.cyberconnector.web;

import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.bind.support.SessionStatus;
import org.springframework.web.context.request.WebRequest;

import edu.gmu.csiss.earthcube.cyberconnector.search.SearchRequest;
import edu.gmu.csiss.earthcube.cyberconnector.ssh.SSHSession;
import edu.gmu.csiss.earthcube.cyberconnector.ssh.SSHSessionImpl;
import edu.gmu.csiss.earthcube.cyberconnector.ssh.SSHSessionManager;
import edu.gmu.csiss.earthcube.cyberconnector.utils.RandomString;

@Controller 
//@RequestMapping(value="/")     
//@SessionAttributes({"SSHToken"})
public class SSHController {

	Logger logger = LoggerFactory.getLogger(getClass());
	
	public static SSHSessionManager sshSessionManager;
	
	static {
		
		sshSessionManager = new SSHSessionManager();
		
	}
	
	@RequestMapping(value = "/geoweaver-ssh", method = RequestMethod.GET)
    public String sshterminal(ModelMap model, WebRequest request, SessionStatus status, HttpSession session){
    	
    	String token = request.getParameter("token");
    	
    	logger.info("token : {}", token);
    	
    	String resp = "redirect:geoweaver-ssh-login";
    	
    	//here should validate the token
    	if(token != null){
    		
//    		model.addAttribute("username", name);
    		
    		SSHSession ss = sshSessionManager.sessionsByToken.get(token);
    		
    		if(ss!=null) {
    			
    			model.addAttribute("host", ss.getHost());
                
                model.addAttribute("username", ss.getUsername());
                
                model.addAttribute("port", ss.getPort());
                
                model.addAttribute("token", ss.getToken());
    			
    			resp = "geoweaver-ssh";
    			
    		}
    		
    	}
    	
    	return resp;
    	
    }
	
	@RequestMapping(value = "/geoweaver-ssh-login", method = RequestMethod.POST)
    public String ssh_auth(Model model, WebRequest request, HttpSession session){
    	
    	String resp = "redirect:geoweaver-ssh";
    	
    	try {
    		
    		String host = request.getParameter("host");
        	
        	String port = request.getParameter("port");
        	
        	String username = request.getParameter("username");
        	
        	String password = request.getParameter("password");
        	
        	String token = new RandomString(16).nextString();
        	
        	SSHSession sshSession = new SSHSessionImpl();
        	
        	boolean success = sshSession.login(host, port, username, password, token);
        	
        	logger.info("SSH login: {}={}", username, success);
                    
            logger.info("adding SSH session for {}", username);
            
            sshSessionManager.sessionsByUsername.put(username, sshSession);
            
            sshSessionManager.sessionsByToken.put(token, sshSession);
            
            model.addAttribute("host", host);
            
            model.addAttribute("username", username);
            
            model.addAttribute("port", port);
            
            model.addAttribute("token", token);
            
    	}catch(Exception e) {
    		
    		e.printStackTrace();
    		
    	}
    	
    	return resp;
    	
    }
    
    @RequestMapping(value = "/geoweaver-ssh-login", method = RequestMethod.GET)
    public String ssh_login(Model model, WebRequest request, HttpSession session){
    	
    	String resp = "geoweaver-ssh-login";
    	
//    	String error = request.getParameter("error");
//        String message = request.getParameter("message");
//        String logout = request.getParameter("logout");
        
//        ModelAndView model  = new ModelAndView("login");
//
//        if (message != null) {
//            model.addObject("message", message);
//        }
//
//        if (logout != null) {
//            model.addObject("message", "Logout successful");
//        }
//
//        if (error != null) {
//	        log.error(error);
//            model.addObject("error", "Login was unsuccessful");
//		}
//		
//        return model;
    	
    	return resp;
    	
    }

    public static void main(String[] args) {
    	
    	sshSessionManager.closeAll();
    	
    }
	
    
}
