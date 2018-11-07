package edu.cyberconnector.servlet;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import edu.cyberconnector.tools.CheckOrderStatusTool;
import edu.cyberconnector.tools.PlaceOrderTool;
import edu.cyberconnector.utils.BaseTool;
import edu.cyberconnector.utils.SpatialExtentValidator;
import edu.cyberconnector.utils.TimeExtentValidator;

/**
 * Servlet implementation class OrderCheckingServlet
 */
public class OrderCheckingServlet extends HttpServlet {
	
	private static final long serialVersionUID = 1L;

	private static Logger log = LoggerFactory.getLogger(OrderCheckingServlet.class);
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public OrderCheckingServlet() {
        super();
    }

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		PrintWriter out = response.getWriter();
		
		response.setContentType("text/plain; charset=utf-8");
		
		try{
			
			log.debug("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
			
			log.debug("New order checking request arrives.");
			
			String ordernumber = request.getParameter("ordernumber").trim();
			
			if(ordernumber==null||ordernumber.length()!=18){
			
				throw new RuntimeException("Invalid ordernumber.");
			
			}
			
			CheckOrderStatusTool tool = new CheckOrderStatusTool(ordernumber);
			
			out.println(tool.check());
			
		}catch(Exception e){
			
			//e.printStackTrace();
			
			log.error(e.getLocalizedMessage());
			
			out.println("Failure. "+ e.getLocalizedMessage());
			
		}
		
        out.flush();
        
        out.close();

		log.debug("A order checking request is processed.\n^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
	}

}
