package edu.gmu.csiss.earthcube.cyberconnector.servlet;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.io.*;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.*;
import org.apache.commons.fileupload.servlet.*;
import org.apache.log4j.Logger;

import edu.gmu.csiss.earthcube.cyberconnector.utils.BaseTool;
import edu.gmu.csiss.earthcube.cyberconnector.utils.SysDir;

import org.apache.commons.fileupload.disk.*; 

/**
 * The servlet for uploading a file
 * @author Ziheng Sun
 */
@WebServlet(name = "FileUploadServlet", urlPatterns = {"/FileUploadServlet"})
public class FileUploadServlet extends HttpServlet {

    private int maxvol = 8000;
    
    Logger logger = Logger.getLogger(this.getClass());
    
    @Override
    public void init(ServletConfig config) throws ServletException {

    }
    
    /**
     * Processes requests for both HTTP
     * <code>GET</code> and
     * <code>POST</code> methods.
     *
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {
        res.setContentType("text/html; charset=utf-8");
        PrintWriter pw = res.getWriter();
        try{

            pw.println("<!DOCTYPE html>");
            pw.println("<html>");
            String head = "<head>" + 
		        "<title>File Uploading Response</title>" + 
		        "<meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">" + 
		        "<script type=\"text/javascript\" src=\"js/TaskGridTool.js\"></script>"+
		        "</head>";
            pw.println(head);
            pw.println("<body>");
            
            DiskFileItemFactory diskFactory = new DiskFileItemFactory();
            // threshold  4M 
            //extend to 2GB - updated by ziheng - 7/5/2018
            diskFactory.setSizeThreshold(maxvol * 1024);
            // repository
            diskFactory.setRepository(SysDir.workspace_tmp_path.toFile());
                                 
            ServletFileUpload upload = new ServletFileUpload(diskFactory);
            // 100M
            upload.setSizeMax(maxvol * 1024 * 1024);
            // HTTP
            List fileItems = upload.parseRequest(req);
            Iterator iter = fileItems.iterator();
            while(iter.hasNext())
            {
                FileItem item = (FileItem)iter.next();
                if(item.isFormField())
                {
                    processFormField(item, pw);
                }else{
                    processUploadFile(item, pw);
                }
            }// end while()
            //add some buttons for further process
            pw.println("<br/>");
            pw.println("<input type=\"button\" id=\"bt\" value=\"Load\" onclick=\"load();\">");
            pw.println("<input type=\"button\" id=\"close\" value=\"Close window\" onclick=\"window.close();\">");
            pw.println("</body>");
            pw.println("</html>");
        }catch(Exception e){
            e.printStackTrace();
            pw.println("ERR:"+e.getClass().getName()+":"+e.getLocalizedMessage());
        }finally{
            pw.flush();
            pw.close();
        }
    }
    /**
     * Information of the fields except file fields
     * @param item
     * @param pw
     * @throws Exception 
     */
    private void processFormField(FileItem item, PrintWriter pw)
        throws Exception
    {
        String name = item.getFieldName();
        String value = item.getString();        
        System.out.println(name + " : " + value + "\r\n");
        if(name.equals("script")){
            pw.println("<script>");
            pw.println(value);
            pw.println("</script>");
        }
//        pw.println(name + " : " + value + "\r\n");
    }
    
    /**
     * Process uploaded file
     * @param item
     * @param pw
     * @throws Exception
     */
    private void processUploadFile(FileItem item, PrintWriter pw)
        throws Exception
    {
        Path filename = Paths.get(item.getName());
        Path uploadsFilePath = SysDir.workspace_uploads_path.resolve(filename);
        logger.info("Processing uploaded " + uploadsFilePath);

        item.write(uploadsFilePath.toFile());

        pw.println("<a id=\"filelink\"" +
                " data-path='" + uploadsFilePath.toString() + "'" +
                " href='web/download?path=" + BaseTool.urlEncode(uploadsFilePath.toString())+"' >Link</a> to the uploaded file : "+filename);
    } 
    
    /**
     * Handles the HTTP
     * <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
    	
    	PrintWriter pw = response.getWriter();
    	
    	pw.println("wrong way");
    	
    }

    /**
     * Handles the HTTP
     * <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }
}
