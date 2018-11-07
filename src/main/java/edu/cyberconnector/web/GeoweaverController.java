package edu.cyberconnector.web;

import java.io.InputStreamReader;

import javax.annotation.PreDestroy;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;

import edu.cyberconnector.ssh.HostTool;
import edu.cyberconnector.ssh.ProcessTool;
import edu.cyberconnector.ssh.RSAEncryptTool;
import edu.cyberconnector.ssh.SSHSession;
import edu.cyberconnector.ssh.SSHSessionImpl;
import edu.cyberconnector.ssh.SSHSessionManager;
import edu.cyberconnector.ssh.WorkflowTool;
import edu.cyberconnector.utils.RandomString;

/**
 * 
 * Controller for SSH related activities, including all the handlers for Geoweaver.
 * 
 * @author Ziheng Sun
 * 
 * @date 5 Oct 2018
 * 
 */

@RestController
//@RequestMapping(value="/")     
//@SessionAttributes({"SSHToken"})
public class GeoweaverController {

	Logger logger = LoggerFactory.getLogger(getClass());
	
	public static SSHSessionManager sshSessionManager;
	
	static {
		
		sshSessionManager = new SSHSessionManager();
		
	}
	
	@PreDestroy
    public void destroy() {
		
        System.out.println(
          "Callback triggered - @PreDestroy.");
        
        sshSessionManager.closeAll();
        
    }
	
	@PostMapping(value = "/del")
    public @ResponseBody String del(WebRequest request){
		
		String resp = null;
		
		try {
			
			String id = request.getParameter("id");
			
			String type = request.getParameter("type");
			
			if(type.equals("host")) {

				resp = HostTool.del(id);
				
			}else if(type.equals("process")) {
				
				resp = ProcessTool.del(id);
				
			}else if(type.equals("workflow")) {
				
				resp = WorkflowTool.del(id);
				
			}
			
		}catch(Exception e) {
			
			throw new RuntimeException("failed " + e.getLocalizedMessage());
			
		}
		
		return resp;
		
	}
	
	@PostMapping(value = "/detail")
    public @ResponseBody String detail(WebRequest request){
		
		String resp = null;
		
		try {
			
			String type = request.getParameter("type");
					
			String id = request.getParameter("id");
			
			if(type.equals("host")) {

				resp = HostTool.detail(id);
				
			}else if(type.equals("process")) {
				
				resp = ProcessTool.detail(id);
				
			}else if(type.equals("workflow")) {
				
				resp = WorkflowTool.detail(id);
				
			}
			
		}catch(Exception e) {
			
			throw new RuntimeException("failed " + e.getLocalizedMessage());
			
		}
		
		return resp;
		
	}
	
	@PostMapping(value = "/key")
    public @ResponseBody String getpublickey(HttpSession session){
		
		String resp = null;
		
		try {
			
			resp = RSAEncryptTool.getPublicKey(session.getId());
			
		}catch(Exception e) {
			
			e.printStackTrace();
			
			throw new RuntimeException("failed " + e.getLocalizedMessage());
			
		}
		
		return resp;
		
	}
	
	@PostMapping(value = "/log")
    public @ResponseBody String one_history(WebRequest request){
		
		String resp = null;
		
		try {
			
			String type = request.getParameter("type");
			
			String hid = request.getParameter("id");
			
			if(type.equals("process")) {
				
				resp = ProcessTool.one_history(hid);
				
			}else if(type.equals("workflow")) {
				
				resp = WorkflowTool.one_history("");
				
			}
			
		}catch(Exception e) {
			
			e.printStackTrace();
			
			throw new RuntimeException("failed " + e.getLocalizedMessage());
			
		}
		
		return resp;
		
	}
	
	@PostMapping(value = "/logs")
    public @ResponseBody String all_history(ModelMap model, WebRequest request){
		
		String resp = null;
		
		try {
			
			String type = request.getParameter("type");
			
			String pid = request.getParameter("id");
			
			if(type.equals("process")) {
				
				resp = ProcessTool.all_history(pid);
				
			}else if(type.equals("workflow")) {
				
				resp = WorkflowTool.all_history("");
				
			}
			
		}catch(Exception e) {
			
			e.printStackTrace();
			
			throw new RuntimeException("failed " + e.getLocalizedMessage());
			
		}
		
		return resp;
		
	}
	
	@PostMapping(value = "/list")
    public @ResponseBody String list(ModelMap model, WebRequest request){
		
		String resp = null;
		
		try {
			
			String type = request.getParameter("type");
			
			if(type.equals("host")) {

				resp = HostTool.list("");
				
			}else if(type.equals("process")) {
				
				resp = ProcessTool.list("");
				
			}else if(type.equals("workflow")) {
				
				resp = WorkflowTool.list("");
				
			}
			
		}catch(Exception e) {
			
			e.printStackTrace();
			
			throw new RuntimeException("failed " + e.getLocalizedMessage());
			
		}
		
		return resp;
		
	}
	
	@PostMapping(value = "/checkLiveSession")
    public @ResponseBody String checklivesession(ModelMap model, WebRequest request){
		
		String resp = null;
		
		try {
			
			String hid = request.getParameter("hostId");
			
			
			
			resp = "{\"exist\": false}";
			
		}catch(Exception e) {
			
			e.printStackTrace();
			
			throw new RuntimeException("failed " + e.getLocalizedMessage());
			
		}
		
		return resp;
		
	}

	@PostMapping(value = "/executeWorkflow")
    public @ResponseBody String executeWorkflow(ModelMap model, WebRequest request){
		
		String resp = null;
		
		try {
			
			String id = request.getParameter("id");
			
			WorkflowTool.execute(id);
			
		}catch(Exception e) {
			
			e.printStackTrace();
			
			throw new RuntimeException("failed " + e.getLocalizedMessage());
			
		}
		
		return resp;
		
	}
	
	@PostMapping(value = "/executeProcess")
    public @ResponseBody String executeProcess(ModelMap model, WebRequest request, HttpSession session){
		
		String resp = null;
		
		try {
			
			String pid = request.getParameter("processId");
			
			String hid = request.getParameter("hostId");
			
			String encrypted_password = request.getParameter("pswd");
			
			String password = RSAEncryptTool.getPassword(encrypted_password, session.getId());
			
			resp = ProcessTool.execute(pid, hid, password, null);
			
		}catch(Exception e) {
			
			e.printStackTrace();
			
			throw new RuntimeException("failed " + e.getLocalizedMessage());
			
		}
		
		return resp;
		
	}
	
	@PostMapping(value = "/add")
    public @ResponseBody String add(ModelMap model, WebRequest request){
		
		String resp = null;
		
		try {
			
			String type = request.getParameter("type");
			
			if(type.equals("host")) {
				
				String hostname = request.getParameter("hostname");
				
				String hostip = request.getParameter("hostip");
				
				String hostport = request.getParameter("hostport");
				
				String username = request.getParameter("username");
				
				String hostid = HostTool.add(hostname, hostip, hostport, username, null);
				
				resp = "{ \"hostid\" : \"" + hostid + "\", \"hostname\" : \""+ hostname + "\" }";
				
			}else if(type.equals("process")) {
				
				String lang = request.getParameter("lang");
				
				String code = request.getParameter("code");
				
				String name = request.getParameter("name");
				
				String desc = request.getParameter("desc");
				
				String pid = ProcessTool.add(name, lang, code, desc);
				
				resp = "{\"id\" : \"" + pid + "\", \"name\":\"" + name + "\"}";
				
			}else if(type.equals("workflow")) {
				
				String name = request.getParameter("name");
				
				String nodes = request.getParameter("nodes");
				
				String edges = request.getParameter("edges");
				
				String wid = WorkflowTool.add(name, nodes, edges);
				
				resp = "{\"id\" : \"" + wid + "\", \"name\":\"" + name + "\"}";
				
			}
			
		}catch(Exception e) {
			
			e.printStackTrace();
			
			throw new RuntimeException("failed " + e.getLocalizedMessage());
			
		}
		
		return resp;
		
	}
	
	@GetMapping(value = "/geoweaver-ssh")
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
	
	@PostMapping(value = "/geoweaver-ssh-logout-inbox")
    public @ResponseBody String ssh_close_inbox(Model model, WebRequest request, HttpSession session){
    	
    	String resp = "";
    	
    	try {
    		
        	String token = request.getParameter("token");
        	
        	if(token != null) {

            	SSHSession s =  sshSessionManager.sessionsByToken.get(token);
            	
            	if(s != null) {
            		
            		s.logout();
            		
            		sshSessionManager.sessionsByToken.remove(token);
            		
            	}
        		
        	}
        	
            resp = "done";
            
    	}catch(Exception e) {
    		
    		e.printStackTrace();
    		
    		throw new RuntimeException();
    		
    	}
    	
    	return resp;
    	
    }
	
	@PostMapping(value = "/geoweaver-ssh-login-inbox")
    public @ResponseBody String ssh_auth_inbox(WebRequest request){
    	
    	String resp = "";
    	
    	try {
    		
    		String host = request.getParameter("host");
        	
        	String port = request.getParameter("port");
        	
        	String username = request.getParameter("username");
        	
        	String password = request.getParameter("password");
        	
        	String token = request.getParameter("token");
        	
        	if(token!=null && sshSessionManager.sessionsByToken.get(token)!=null) {
        		
        		token = sshSessionManager.sessionsByToken.get(token).getToken();
        		
        	 } else {
        		
        		token = new RandomString(16).nextString();
            	
            	SSHSession sshSession = new SSHSessionImpl();
            	
            	boolean success = sshSession.login(host, port, username, password, token, false);
            	
            	logger.info("SSH login: {}={}", username, success);
                        
                logger.info("adding SSH session for {}", username);
                
//                sshSessionManager.sessionsByUsername.put(host+"-"+username, sshSession);
                
                sshSessionManager.sessionsByToken.put(token, sshSession);
        		
        	}
        	
//            model.addAttribute("host", host);
//            
//            model.addAttribute("username", username);
//            
//            model.addAttribute("port", port);
//            
//            model.addAttribute("token", token);
            
            resp = "{\"token\": \""+token+"\"}";
            
    	}catch(Exception e) {
    		
    		e.printStackTrace();
    		
    		throw new RuntimeException();
    		
    	}
    	
    	return resp;
    	
    }
	
	@PostMapping(value = "/geoweaver-ssh-login")
    public String ssh_auth(Model model, WebRequest request){
    	
    	String resp = "redirect:geoweaver-ssh";
    	
    	try {
    		
    		String host = request.getParameter("host");
        	
        	String port = request.getParameter("port");
        	
        	String username = request.getParameter("username");
        	
        	String password = request.getParameter("password");
        	
        	String token = null;
        	
        	if(sshSessionManager.sessionsByToken.get(host+"-"+username)!=null) {
        		
        		token = sshSessionManager.sessionsByToken.get(host+"-"+username).getToken();
        		
        	}else {
        		
        		token = new RandomString(16).nextString();
            	
            	SSHSession sshSession = new SSHSessionImpl();
            	
            	boolean success = sshSession.login(host, port, username, password, token, false);
            	
            	logger.info("SSH login: {}={}", username, success);
                        
                logger.info("adding SSH session for {}", username);
                
//                sshSessionManager.sessionsByUsername.put(host+"-"+username, sshSession);
                
                sshSessionManager.sessionsByToken.put(token, sshSession);
        		
        	}
        	
            model.addAttribute("host", host);
            
            model.addAttribute("username", username);
            
            model.addAttribute("port", port);
            
            model.addAttribute("token", token);
            
    	}catch(Exception e) {
    		
    		e.printStackTrace();
    		
    	}
    	
    	return resp;
    	
    }
    
    @GetMapping(value = "/geoweaver-ssh-login")
    public String ssh_login(Model model){
    	
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
