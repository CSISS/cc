package edu.cyberconnector.controller;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.support.SessionStatus;

import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;



import org.springframework.web.context.request.WebRequest;

import edu.cyberconnector.utils.*;
import edu.cyberconnector.user.*;

@Controller
public class UserController {
    private static Logger log = LoggerFactory.getLogger(UserController.class);

    // Thread safe map
    static Map<String, User> users = Collections.synchronizedMap(new HashMap<String, User>());


    @PostMapping(value = "/checklog")
    public @ResponseBody String checklogin(HttpSession session){

        String resp = null;

        String name = (String)session.getAttribute("sessionUser");

        if(name==null){

            resp = "{ \"login\": false }";

        }else{

            resp = "{ \"login\": true }";

        }

        return resp;
    }

    @GetMapping(value = "/user_password")
    public String password(Model model, HttpSession session) {

        String name = (String)session.getAttribute("sessionUser");

        String resp = "user_password";

        if(name == null){

            resp = "redirect:login";

        }else{

            User u = UserTool.retrieveInformation(name);

            model.addAttribute("user", u);

        }

        return resp;
    }

    @PostMapping(value = "/user_password")
    public String password(@ModelAttribute("user") User user, BindingResult result, Model model, HttpSession session) {

        String name = (String)session.getAttribute("sessionUser");

        String resp = "message";

        if(name == null){

            resp = "redirect:login";

        }else{

            user.setName(name);

            Message msg = UserTool.updateExistingUser(user);

            if(msg.isIsdone()){

                msg.setTitle("Updated!!");

                msg.setStrongmsg("Your new information has been recorded. Old information has been erased.");

                model.addAttribute("forwardURL", "index");

                model.addAttribute("forward", "redirect to main page");

            }else{

                msg.setTitle("Oops!!!Fail to update your information.");

                msg.setStrongmsg("Very sorry about that. The reason seems to be " + msg.getInformation());

                model.addAttribute("forwardURL", "user_edit");

                model.addAttribute("forward", "redirect to edit page");

            }

            model.addAttribute("message", msg);

        }

        return resp;
    }


    @GetMapping(value = "/user_setpassword")
    public String setpassword(Model model, WebRequest request, HttpSession session) {

        String token = (String)request.getParameter("token");

        String resp = "user_setpassword";

        if (UserTool.validateToken(token)) {

            resp = "user_setpassword";

            User u = UserTool.loginByToken(token);

            model.addAttribute("user", u);

//    		session.setAttribute("sessionUser", u.getName());
//
//    		log.debug("User email: "+ u.getEmail() + "\n" );
        }
        else {

            Message msg = new Message("user_forget", "browser", "fail", false);

            msg.setTitle("Invalid token");

            msg.setStrongmsg("The token might be invalid or expired.");

            model.addAttribute("forwardURL", "login");

            model.addAttribute("forward", "redirect to main page");

            model.addAttribute("message", msg);

            resp = "message";
        }

        return resp;
    }



    @PostMapping(value = "/user_setpassword")
    public String setpassword(@ModelAttribute("user") User user, BindingResult result, Model model, HttpSession session) {

//    	String name = (String)session.getAttribute("sessionUser");

        log.debug("sesion user: "+ user.getName() + "\n" );

        Message msg = UserTool.resetPassword(user);


        msg.setTitle("Password has been reset.");

        msg.setStrongmsg("Please login using the new password.");

        model.addAttribute("forwardURL", "login");

        model.addAttribute("forward", "redirect to main page");

        model.addAttribute("message", msg);

        String resp = "message";

        return resp;
    }


    /*************************************************************************************/

    @GetMapping(value="/users")
    public List<User> getUserList() {

        List<User> r = new ArrayList<User>(users.values());

        return r;

    }

    @PostMapping(value="/users")
    public String postUser(@ModelAttribute User user) {

        users.put(user.getId(), user);

        return "success";

    }

    @GetMapping(value="/users/{id}")
    public User getUser(@PathVariable Long id) {

        return users.get(id);

    }

    @PutMapping(value="/users/{id}")
    public String putUser(@PathVariable String id, @ModelAttribute User user) {

        User u = users.get(id);

        u.setName(user.getName());

        users.put(id, u);

        return "success";

    }

    @DeleteMapping(value="/users/{id}")
    public String deleteUser(@PathVariable Long id) {

        users.remove(id);

        return "success";

    }

    @GetMapping(value = "/user_forget")
    public String forget(Model model) {
        model.addAttribute("user", new User());
        return "user_forget";
    }


    @PostMapping(value = "/user_forget")
    public String forget(@ModelAttribute User user, BindingResult result, Model model) {
        log.debug(" Name entered "+ user.getEmail()+ "\n" );

        Message msg = null;

        if (UserTool.checkUserExist(user)) {

            UserTool.passwordResetEmail(user);

            msg = new Message("user_forget", "browser", "success", true);

            msg.setTitle("A password reset email has been sent to the given e-mail. Please check your email account.");

            msg.setStrongmsg("If this request is not submitted in your intention, please ignore the email and contact the administrator.");

            msg.setDisplaymsg("Your request has been heard and we will take care of it.");

            model.addAttribute("message", msg);

            model.addAttribute("forwardURL", "login");

            model.addAttribute("forward", "redirect to your profile");
        }
        else {

            msg = new Message("user_forget", "browser", "failed", false);

            msg.setTitle("The given email address cannot be found.");

            msg.setStrongmsg("Please enter your registered email.");

            msg.setDisplaymsg("Fail to complete the request, please try again.");

            model.addAttribute("message", msg);

            model.addAttribute("forwardURL", "login");

            model.addAttribute("forward", "redirect to your profile");

        }

        return "message";
    }





    @GetMapping(value = "/user_profile")
    public String userprofile(Model model, WebRequest request, HttpSession session) {

        //get user information by session user name

        String username = (String)session.getAttribute("sessionUser");

        String resp = "";

        if(username == null){

            resp = "redirect:login";

        }else{

            log.debug("Get User Profile : \n SessionId is: " + session.getId());

            User u = UserTool.retrieveInformation(username);

            model.addAttribute("user", u);

            String tabtag = request.getParameter("show");

            if(tabtag != null){

                model.addAttribute("fronttab", tabtag);

            }

            resp = "user_profile";

        }

        return resp;

    }

    @PostMapping(value = "/user_profile")
    public String userprofile(@ModelAttribute User user, ModelMap model) {

        user = UserTool.retrieveInformation(user.getName());

        log.debug("User Profile Post : User Information is retrieved.");

        model.addAttribute("user", user);

        return "user_profile";
    }


    @PostMapping(value = "/logout")
    public String logout(ModelMap model,  WebRequest request, SessionStatus status, HttpSession session) {

        Message msg = UserTool.logout((String)session.getAttribute("sessionUser"));

        String resp = "message";

        if(msg.isIsdone()){

            //session.setAttribute("sessionUser", null);

            //session.removeAttribute("sessionUser");

            status.setComplete();

            request.removeAttribute("sessionUser", WebRequest.SCOPE_SESSION);

            msg.setTitle("Logout Successful!");

            msg.setStrongmsg("your information is safe with us");

            msg.setDisplaymsg("You are now signed out. Thanks for using CyberConnector. ");

            model.addAttribute("message", msg);

            model.addAttribute("forwardURL", "index");

            model.addAttribute("forward", "redirect to main page");

        }else{

            msg.setTitle("Logout Failed");

            msg.setStrongmsg("your information is safe with us");

            msg.setDisplaymsg("Something goes wrong. Contact our webmaster (zsun@gmu.edu) ");

            model.addAttribute("message", msg);

            model.addAttribute("forwardURL", "index");

            model.addAttribute("forward", "redirect to main page");

        }

        log.debug("Current user: " + (String)session.getAttribute("sessionUser"));

        return resp;
    }


    @GetMapping(value = "/login")
    public String displayLogin(Model model, HttpSession session) {

        String name = (String)session.getAttribute("sessionUser");

        String resp = null;

        if(name == null){

            model.addAttribute("user", new User());

            resp = "login";

        }else{

            resp = "redirect:user_profile";

        }


        return resp;
    }


    @GetMapping(value = "/owner")
    public @ResponseBody String checkowner_get(ModelMap model, WebRequest request,   HttpSession session){

        String resp = null;

        resp = "{ \"ret\" : \"true\"}";

        return resp;


    }


    @PostMapping(value = "/owner")
    public @ResponseBody String checkowner(ModelMap model, WebRequest request,   HttpSession session){

        String resp = null;

        String userid = request.getParameter("uid");

        String modelid = request.getParameter("mid");

        boolean yes = UserTool.checkOwner(userid, modelid);

        resp = "{ \"ret\" : \""+yes+"\"}";

        return resp;


    }

    @PostMapping(value = "/auth")
    public @ResponseBody String authenticate( ModelMap model, WebRequest request,   HttpSession session) {

        String resp = null;

        String username = request.getParameter("name");

        String password = request.getParameter("password");

        User user = new User();

        user.setName(username);

        user.setPassword(password);

        Message msg = UserTool.login(user);

        if(msg.isIsdone()){

            String uid = UserTool.getUserIDByName(username);

            resp = "{ \"ret\" : \"true\", \"uid\":\""+uid+"\" }";

        }else{

            resp = "{ \"ret\" : \"false\" }";

        }

        return resp;

    }



    @PostMapping(value = "/login")
    public String login(    @ModelAttribute("user") User user, BindingResult result, ModelMap model, HttpSession session) {

        log.debug("Display Name on the Profile Page "+ user.getName()+ "\n" );

        Message msg = UserTool.login(user);

        String resp = null;

        if(msg.isIsdone()){

            session.setAttribute("sessionUser", user.getName());

            log.debug("SessionId is: " + session.getId());

            user = UserTool.retrieveInformation(user.getName());

            model.addAttribute("user", user);

            resp = "redirect:user_profile";

        }else{

            msg.setTitle("Fail to login");

            msg.setStrongmsg("Reason: " + msg.getInformation());

            model.addAttribute("forwardURL", "login");

            model.addAttribute("forward", "redirect to login page");

            model.addAttribute("message", msg);

            resp = "message";

        }

        log.debug("Response page is: " + resp);

        return resp;
    }

    @PostMapping(value = "/user_edit")
    public String edit(@ModelAttribute("user") User user, BindingResult result, Model model, HttpSession session) {

        String name = (String)session.getAttribute("sessionUser");

        String resp = "message";

        if(name == null){

            resp = "redirect:login";

        }else{

            user.setName(name);

            Message msg = UserTool.updateExistingUser(user);

            if(msg.isIsdone()){

                msg.setTitle("Updated!!");

                msg.setStrongmsg("Your new information has been recorded. Old information has been erased.");

                model.addAttribute("forwardURL", "index");

                model.addAttribute("forward", "redirect to main page");

            }else{

                msg.setTitle("Oops!!!Fail to update your information.");

                msg.setStrongmsg("Very sorry about that. The reason seems to be " + msg.getInformation());

                model.addAttribute("forwardURL", "user_edit");

                model.addAttribute("forward", "redirect to edit page");

            }

            model.addAttribute("message", msg);

        }

        return resp;
    }


    @GetMapping(value = "/user_edit")
    public String edit(Model model, HttpSession session) {

        String name = (String)session.getAttribute("sessionUser");

        String resp = "user_edit";

        if(name == null){

            resp = "redirect:login";

        }else{

            User u = UserTool.retrieveInformation(name);

            model.addAttribute("user", u);

        }

        return resp;
    }


    @GetMapping(value = "/user_register")
    public String register(Model model) {
        model.addAttribute("user", new User());

        Message msg = new Message("", "", "", false);
        model.addAttribute("message", msg);

        return "user_register";
    }

    @PostMapping(value = "/user_register")
    public String register(@ModelAttribute User user, BindingResult result, Model model) {

        log.debug(" Name entered "+ user.getName()+ "\n" );

        log.debug(" Password entered " + user.getPassword() + "\n");

        Message msg = UserTool.registerNewUser(user);

        String resp = null;

        if(msg.isIsdone()){

            resp = "user_profile";

        }
        else  {

            model.addAttribute("message", msg);

            resp = "user_register";

        }

        return resp;
    }



}
