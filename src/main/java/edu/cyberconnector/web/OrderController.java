package edu.cyberconnector.web;


import java.util.HashMap;
import java.util.Map;
import java.util.Iterator;


import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;
import org.springframework.ui.Model;
import org.springframework.web.context.request.WebRequest;

import edu.cyberconnector.tools.*;
import edu.cyberconnector.utils.*;
import edu.cyberconnector.order.*;
import edu.cyberconnector.user.*;
import edu.cyberconnector.products.*;

@RestController
@RequestMapping("/web")
public class OrderController {

    private static Logger log = LoggerFactory.getLogger(GeoweaverController.class);

    @PostMapping(value = "/deleteorder")
    public String  deleteorder(Model model, WebRequest request, HttpSession session){

        String name = (String)session.getAttribute("sessionUser");

        String resp = "message";

        if(name == null){

            resp = "redirect:login";

        }else{

            String orderid = request.getParameter("orderid");

            try{

                OrderTool.deleteOrder(orderid);

                model.addAttribute("show", "tab2");

                resp = "redirect:user_profile";

            }catch(Exception e){

                Message msg = new Message("deleteorder", "browser", "failed", false);

                msg.setTitle("Delete Order Failed");

                msg.setStrongmsg("Oops!! We are unable to delete this order at this moment.");

                msg.setDisplaymsg("Something goes wrong. "+e.getLocalizedMessage()+"Contact our webmaster (zsun@gmu.edu) ");

                model.addAttribute("message", msg);

                model.addAttribute("forwardURL", "index");

                model.addAttribute("forward", "redirect to main page");

            }

        }

        return resp;
    }

    @PostMapping(value = "/reorder")
    public @ResponseBody String reorder(Model model, WebRequest request, HttpSession session) {

        String name = (String)session.getAttribute("sessionUser");

        String resp =  null;

        if(name == null){

            resp = "{\"error\":\"you need log in first.\"}";

        }else{

            log.info("receive the reorder request");

            String oid = request.getParameter("oid");

            Order o = OrderTool.getOrderById(oid);

            Map parametermap = o.getParametermap();

            parametermap.put("email", o.getMail());

            parametermap.put("userid", o.getUserid());

            PlaceOrderTool t = new PlaceOrderTool();

            String orderid = t.placeOrder(parametermap);

            resp = "{\"oid\": \""+orderid+"\"}";

        }

        return resp;

    }


    @PostMapping(value = "/placeorder")
    public String placeorder(Model model, WebRequest request, HttpSession session) {

        String name = (String)session.getAttribute("sessionUser");

        String resp = "message";

        if(name == null){

            resp = "redirect:login";

        }else{

            try{

                Map<String, String[]> pmap = request.getParameterMap();

                Map<String, String> parametermap = new HashMap();

                Iterator it = pmap.entrySet().iterator();

                while (it.hasNext()) {

                    Map.Entry pair = (Map.Entry)it.next();

                    log.debug(pair.getKey() + " = " + ((String[])pair.getValue())[0]);

                    parametermap.put((String)pair.getKey(), ((String[])pair.getValue())[0]);

                }

                //get email by username

                User u = UserTool.retrieveInformation(name);

                parametermap.put("email", u.getEmail());

                parametermap.put("userid", u.getId());

                PlaceOrderTool t = new PlaceOrderTool();

                String orderid = t.placeOrder(parametermap);

                Message msg = new Message("placeorder", "browser", "success", true);

                msg.setTitle("We have received your order. The processing starts right now..");

                msg.setStrongmsg("Congratulations! Your order id is " + orderid + ". A notification e-mail has already been sent to your account.");

                msg.setDisplaymsg("Your request has been heard and we will take care of it.");

                model.addAttribute("message", msg);

                model.addAttribute("forwardURL", "user_profile");

                model.addAttribute("forward", "redirect to your profile");

            }catch(Exception e){

                e.printStackTrace();

                Message msg = new Message("placeorder", "browser", "failure", false);

                msg.setTitle("Something Happens");

                msg.setStrongmsg("Sorry, the order is unsuccessful. Please return to the order page and place the order again or contact the webmaster.");

                msg.setDisplaymsg("Your request has not been submitted yet.");

                model.addAttribute("message", msg);

                model.addAttribute("forwardURL", "history.go(-2)");

                model.addAttribute("forward", "redirect to order page");

            }


        }

        return resp;
    }


    @GetMapping(value = "/productorder")
    public String orderproduct(@RequestParam("pid") String productid, Model model,  WebRequest request, HttpSession session) {

        String name = (String)session.getAttribute("sessionUser");

        String resp = "productorder";

        if(name == null){

            resp = "redirect:login";

        }else{

            Product p = RetrieveProductTool.retrieveProduct(productid);

            //if there are parameter value pairs, absorb the valid values into the product object
            RetrieveProductTool.absorbParameterValuePairs(p, request.getParameterMap());

            model.addAttribute("product", p);

            model.addAttribute("order", new Order());

        }

        return resp;
    }

    @PostMapping(value = "/vieworder")
    public @ResponseBody String  vieworder(Model model, WebRequest request, HttpSession session){

        String orderdetailsjson = null;

        String name = (String)session.getAttribute("sessionUser");

        if(name == null){

            orderdetailsjson = "{'error': 'You have to login first.'}";

        }else{

            String orderid = request.getParameter("orderid");

            try{

                orderdetailsjson = OrderTool.getOrderById(orderid).toJSON();

                log.debug(orderdetailsjson);

            }catch(Exception e){

//    			e.printStackTrace();
                log.error(e.getLocalizedMessage());

                orderdetailsjson = "{'error' : '"+e.getLocalizedMessage()+"'}";

            }

        }

        return orderdetailsjson;
    }


    @PostMapping(value = "/deleteproduct")
    public String  deleteproduct(Model model, WebRequest request, HttpSession session){

        String name = (String)session.getAttribute("sessionUser");

        String resp = "message";

        if(name == null){

            resp = "redirect:login";

        }else{

            String productid = request.getParameter("productid");

            try{

                //OrderTool.deleteOrder(orderid);
                DeleteProductTool.delete(productid);

                model.addAttribute("show", "tab3");

                resp = "redirect:user_profile";

            }catch(Exception e){

                Message msg = new Message("deleteorder", "browser", "failed", false);

                msg.setTitle("Delete Service Failed");

                msg.setStrongmsg("Oops!! We are unable to delete this service at this moment.");

                msg.setDisplaymsg("Something goes wrong. "+e.getLocalizedMessage()+"Contact our webmaster (zsun@gmu.edu) ");

                model.addAttribute("message", msg);

                model.addAttribute("forwardURL", "index");

                model.addAttribute("forward", "redirect to main page");

            }

        }

        return resp;
    }


}
