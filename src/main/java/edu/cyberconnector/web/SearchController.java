package edu.cyberconnector.web;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpSession;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;


import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ModelAttribute;

import org.springframework.web.context.request.WebRequest;

import edu.cyberconnector.search.*;
import edu.cyberconnector.utils.*;
import edu.cyberconnector.products.*;

@RestController
public class SearchController {

    private static Logger log = LoggerFactory.getLogger(SearchController.class);


    @GetMapping(value = "/productsearch")
    public String productsearchpage(ModelMap model, HttpSession session){

        String name = (String)session.getAttribute("sessionUser");

        String resp = "productsearch";


        model.addAttribute("request", new SearchRequest());

        return resp;

    }


    @GetMapping(value = "/searchresult")
    public String displayresultget(@ModelAttribute SearchResponse resp, ModelMap model, HttpSession session){

        String name = (String)session.getAttribute("sessionUser");

        String response = "message";

        if(name == null){

            response = "redirect:login";

        }else{

            Message msg = new Message("search_result_servlet", "browser", "failed", false);

            msg.setTitle("Page 404");

            msg.setStrongmsg("Oops! The page doesn't exist.");

            msg.setDisplaymsg("Sorry for that. Contact our webmaster (zsun@gmu.edu) if any doubts.");

            model.addAttribute("message", msg);

            model.addAttribute("forwardURL", "index");

            model.addAttribute("forward", "redirect to main page");

        }

        return response;

    }

    @PostMapping(value = "/search", produces = "application/json")
    public @ResponseBody SearchResponse tableserver(@ModelAttribute SearchRequest request,  WebRequest webRequest) {

        SearchResponse sr = SearchTool.search(request);


        int start = Integer.parseInt(webRequest.getParameter("start")) + 1;
        int length = Integer.parseInt(webRequest.getParameter("length"));
        int pageNum = start/length;

        request.setPageno(pageNum);

        int pageno = start/length;

        request.setPageno(pageno);

        //for JQuery DataTables
        String draw = webRequest.getParameter("draw");

        sr.setDraw(Integer.parseInt(draw));
        sr.setRecordsFiltered(sr.getProduct_total_number());
        sr.setRecordsTotal(sr.getProduct_total_number());

        return sr;
    }


    @GetMapping(value = "/search")
    public String productsearch(@ModelAttribute SearchRequest request){

        //int x = 1;
        //model.addAttribute("request", searchreq);

        return "searchresult";
    }


    @PostMapping(value = "/listgranules", produces = "application/json")
    public @ResponseBody SearchResponse listgranules_ajax(@ModelAttribute GranulesRequest request, WebRequest webRequest) {
        int start = Integer.parseInt(webRequest.getParameter("start"));
        int length = Integer.parseInt(webRequest.getParameter("length"));


        GranulesTool.indexCollectionGranules(request);

        List<Granule> granules = GranulesTool.getCollectionGranules(request);

        SearchResponse sr = new SearchResponse();

        List products = new ArrayList();
        for(int i = start; i < start + length && i < granules.size() ; i++) {
            Granule g = granules.get(i);
            Product p = g.toProduct(request);

            products.add(p);
        }

        sr.setProducts(products);

        int draw = Integer.parseInt(webRequest.getParameter("draw"));
        sr.setDraw(draw);

        sr.setRecordsFiltered(granules.size());
        sr.setRecordsTotal(granules.size());

        return sr;
    }

    @GetMapping(value = "/listgranules")
    public String listgranules(@ModelAttribute GranulesRequest request){

        return "listgranules";
    }


    @PostMapping(value = "/productlike")
    public @ResponseBody String productlike(WebRequest request, HttpSession session){

        String name = (String)session.getAttribute("sessionUser");

        String resp = ""; //number of likes

        log.debug("Like request received.");

        if(name == null){

            resp = "redirect:login";

        }else{

            String productid = request.getParameter("pid");

            log.debug("product id is : " + productid);

            int newlikes = LikeProductTool.like(productid);

            resp = "{ \"likes\" : \""+newlikes+"\" }";

            System.out.print("Server response is : " + resp);

        }

        return resp;

    }





}
