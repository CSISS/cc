package edu.cyberconnector.web;


import javax.servlet.http.HttpSession;

import org.springframework.web.bind.annotation.*;
import org.springframework.ui.ModelMap;
import org.springframework.web.context.request.WebRequest;

@RestController
public class ServiceController {
    @GetMapping(value = "/regser")
    public String regser(ModelMap model, WebRequest request, SessionStatus status, HttpSession session) {

        String name = (String) session.getAttribute("sessionUser");

        String resp = "regser";

        if (name == null) {

            resp = "redirect:login";

        } else {

//    		model.addAttribute("username", name);

        }

        return resp;


        @PostMapping(value = "/updateservice")
        public @ResponseBody String updateService (ModelMap model, WebRequest request, SessionStatus status, HttpSession
        session){

            String name = (String) session.getAttribute("sessionUser");

            String resp = ""; //number of likes

            logger.debug("Service update request received.");

            if (name == null) {

                resp = "redirect:login";

            } else {

                String sid = request.getParameter("serviceid");

                logger.debug("service id is : " + sid);

                RegisterServiceTool tool = new RegisterServiceTool();

                try {

                    tool.updateWSDL(sid);

                    System.out.print("Server response is : " + resp);

                    resp = "Done";

                } catch (Exception e) {

                    throw new RuntimeException("Failed. " + e.getLocalizedMessage());

                }
            }

            return resp;

        }

    }

    @PostMapping(value = "/deleteservice")
    public String deleteservice(Model model, WebRequest request, SessionStatus status, HttpSession session) {

        String name = (String) session.getAttribute("sessionUser");

        String resp = "message";

        if (name == null) {

            resp = "redirect:login";

        } else {

            String serviceid = request.getParameter("serviceid");

            try {

                //OrderTool.deleteOrder(orderid);
                RegisterServiceTool.deleteService(serviceid);

                model.addAttribute("show", "tab3");

                resp = "redirect:user_profile";

            } catch (Exception e) {

                Message msg = new Message("deleteorder", "browser", "failed", false);

                msg.setTitle("Delete Service Failed");

                msg.setStrongmsg("Oops!! We are unable to delete this service at this moment.");

                msg.setDisplaymsg("Something goes wrong. " + e.getLocalizedMessage() + "Contact our webmaster (zsun@gmu.edu) ");

                model.addAttribute("message", msg);

                model.addAttribute("forwardURL", "index");

                model.addAttribute("forward", "redirect to main page");

            }

        }

        return resp;
    }


    @GetMapping(value = "/newservice")
    public String newservice(Model model, HttpSession session) {

        //get user information by session user name

        String username = (String) session.getAttribute("sessionUser");
        logger.debug("New Service: Username: " + username);

        String resp = "";

        if (username == null) {

            logger.debug("New Service: Redirect to login");

            resp = "redirect:login";

        } else {

            logger.debug("New Service: Get User Profile : \n SessionId is: " + session.getId());

            Service s = new Service();

            model.addAttribute("service", s);

            resp = "newservice";
        }

        return resp;

    }


    @PostMapping(value = "/newservice")
    public String newservice(@ModelAttribute("service") Service service, @ModelAttribute("user") User user, HttpSession session, BindingResult result, ModelMap model) {

        String username = (String) session.getAttribute("sessionUser");
        User u = UserTool.retrieveInformation(username);

        logger.debug("New Service: Service Name entered " + service.getName() + " userID:" + u.getId() + "\n");

        Message msg = RegisterServiceTool.registerWPS(service, u.getId());

        model.addAttribute("service", service);

        String resp = null;

        if (msg.isIsdone()) {
            resp = "user_profile";
        } else {
            resp = "newservice";
        }

        return resp;
    }

}