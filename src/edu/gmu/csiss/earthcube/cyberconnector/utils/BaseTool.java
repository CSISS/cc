package edu.gmu.csiss.earthcube.cyberconnector.utils;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.DataInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLDecoder;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.xml.soap.SOAPException;

import org.apache.commons.io.IOUtils;
import org.apache.log4j.Logger;
import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.ObjectWriter;
import org.dom4j.Document;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.dom4j.Node;
import org.dom4j.XPath;
import org.dom4j.io.SAXReader;


/**
 *Class BaseTool.java
 *@author ziheng
 *@time Aug 6, 2015 2:49:10 PM
 *Original aim is to support iGFDS.
 */
public class BaseTool {
	
	private static String _classpath = null;
	static Logger logger = Logger.getLogger(BaseTool.class);
	/**
	 * Judge whether an object is null
	 * @param obj
	 * @return
	 * true or false
	 */
	public static boolean isNull(Object obj){
		boolean isnull=false;
		if(obj==null || obj == "" || "".equals(obj)){
			isnull = true;
		}
		return isnull;
	}
	
	public static String array2String(String[] arr, String splitter) {
		
		if (arr.length > 0) {
			
		    StringBuilder nameBuilder = new StringBuilder();

		    for (String n : arr) {
		        nameBuilder.append(n).append(splitter);
		        // can also do the following
		        // nameBuilder.append("'").append(n.replace("'", "''")).append("',");
		    }

//		    nameBuilder.deleteCharAt(nameBuilder.length() - 1);

		    return nameBuilder.toString();
		    
		} else {
		    
			return "";
			
		}
		
		
	}
	
	public static String long2Date(long time) {
		
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		
		return sdf.format(time);
		
	}
	

	public static String toJSONString(Object value) {
		String json = null;
		ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();

		try {
			json = ow.writeValueAsString(value);

		} catch (JsonGenerationException e) {
			e.printStackTrace();

		} catch (JsonMappingException e) {
			e.printStackTrace();

		} catch (IOException e) {
			e.printStackTrace();
		}

		return json;
	}

	/**
	 * Write string to file
	 * @param content
	 * @param filepath
	 */
	public static void writeString2File(String content, String filepath){
		PrintWriter out;
		try {
			out = new PrintWriter(filepath);
			out.println(content);
			out.close();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		}
	}
	/**
	 * Escape the reserved characters
	 * @param msg
	 * @return
	 */
	public static String escape(String msg){
		msg = msg.replaceAll("\\'", "").replaceAll("\\\n", "");
		return msg;
	}
	
	public static Document parseString(String xml){
		
		SAXReader reader = new SAXReader();
		
		Document document = null;
		
		try {
			
			InputStream stream = new ByteArrayInputStream(xml.trim().getBytes("UTF-8"));
			
			document = reader.read(stream);
			
		} catch (Exception e) {
			
			e.printStackTrace();
			
		}
		
	    return document;
	    
	}
	/**
	 * Parse file from URL
	 * @param url
	 * @return
	 */
	public static Document parseURL(String url) 
    {
		
		URL myURL;
	       
        SAXReader reader = new SAXReader();
        Document document = null;
		try {

		    myURL = new URL(url);
			document = reader.read(myURL);
		} catch (Exception e) {
			e.printStackTrace();
		}
        return document;
    }
	
	/**
	 * Parse VCI date
	 * @param datestr
	 * @return
	 */
	public static Date parseVCIDate(String datestr){
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
		Date d = null;
		try {
			d = format.parse(datestr);
		} catch (ParseException e) {
			e.printStackTrace();
			throw new RuntimeException("Fail to parse Date from string."+ e.getLocalizedMessage());
		}
		return d;
	}
	/**
	 * Get the root file path of CyberConnector
	 * @return
	 */
	public static String getCyberConnectorRootPath(){
		
		String classpath = getClassPath();
		
		String rootpath = classpath;
		
		if(classpath.indexOf("CyberConnector")!=-1)
		
			rootpath = classpath.substring(0, classpath.indexOf("CyberConnector") + "CyberConnector".length()) + "/";
		
		return rootpath;
	}
	
	/**
	 * Get classpath
	 * @return
	 * class path
	 */
	public static String getClassPath(){
		if(isNull(_classpath)){
			String dir = new BaseTool().getClass().getClassLoader().getResource("").getPath();
			try {
				dir = URLDecoder.decode(dir,"utf-8");
			} catch (UnsupportedEncodingException e) {
				e.printStackTrace();
			}
			_classpath = dir;
		}
		return _classpath;
	}
	

	/**
	 * Read the string from a file
	 * @param path
	 * @return
	 */
	public static String readStringFromFile(String path){
		StringBuffer strLine = new StringBuffer();
		try{
			  // Open the file that is the first 
			  // command line parameter
			  FileInputStream fstream = new FileInputStream(path);
			  // Get the object of DataInputStream
			  DataInputStream in = new DataInputStream(fstream);
			  FileReader fr = new FileReader(path);
			  BufferedReader br = new BufferedReader(fr);
			  String str = null;
			  //Read File Line By Line
			  while ((str = br.readLine()) != null)   {
			  // Print the content on the console
				  strLine.append(str).append("\n");
//				  System.out.println (strLine);
			  }
			  //Close the input stream
			  in.close();
		}catch (Exception e){
			  //Catch exception if any
			  System.err.println("Error: " + e.getMessage());
	    }
		return strLine.toString().trim();
	}
	/**
	 * Get day number between two dates
	 * @param b
	 * @param e
	 * @return
	 */
	public int getDaysBetweenTwoDates(Date b, Date e){
		return (int)((b.getTime()-e.getTime())/(1000 * 60 * 60 * 24));
	}
	/**
	 * Parse string from input stream
	 * @param in
	 * @return
	 */
	public String parseStringFromInputStream(InputStream in){
	        String output = null;
	        try{
	                // WORKAROUND cut the parameter name "request" of the stream
	                BufferedReader br = new BufferedReader(new 
	                                InputStreamReader(in,"UTF-8"));
	                StringWriter sw = new StringWriter();
	                int k;
	                while ((k = br.read()) != -1) {
	                        sw.write(k);
	                }
	                output = sw.toString();
	
	        }catch(Exception e){
	                e.printStackTrace();
	        }finally{
	                try{
	                        in.close();
	                }catch(Exception e1){
	                        e1.printStackTrace();
	                }
	        }
	        return output;
	}
	/**
	 * Read document from string
	 * @param xmlstring
	 * @return
	 */
	public Document readDocumentFromString(String xmlstring){
        Document doc = null;
        try{
                doc  = DocumentHelper.parseText(xmlstring.trim());
        }catch(Exception e){
                throw new RuntimeException("Fail to read document from string:"+xmlstring);
        }
        return doc;
	}
	/**
	 * Read element from string
	 * @param xmlstring
	 * @return
	 */
	public  Element readElementFromString(String xmlstring){
	        Element ele = null;
	        try{
	                Document doc  = DocumentHelper.parseText(xmlstring.trim());
	                ele = doc.getRootElement();
	        }catch(Exception e){
	                throw new RuntimeException("Fail to read element from string:"+xmlstring);
	        }
	        return ele;
	}
	/**
     * Convert string to input stream
     * @param str
     * @return
     * @throws IOException 
     */
    public InputStream convertString2InputStream(String str) throws IOException{
        InputStream stream = IOUtils.toInputStream(str, "UTF-8");
        return stream;
    }
	/**
     * Modified into a safer method which can capture the fault response SOAP message
     * @param param
     * @param operationname
     * @param input_url
     * @return 
     */
    public  String AgentSOAP(String param, String operationname,String input_url){
        
    	String resp = null;
        
        try {
            
        	SOAPClient client = new SOAPClient();
            
            client.setEndpoint(input_url);
            
            client.setSoapmessage(param);
            
            client.send();
            
            resp =  client.getRespmessage();
            
        } catch (SOAPException ex) {
        
        	String errmsg = ex.getClass().getName()+ex.getLocalizedMessage();
            
        	throw new RuntimeException(errmsg);
        
        }
        
        return resp;
    }
    /**
     * Get the DATETIME format of current time
     * @return
     * DATETIME
     */
    public static String getCurrentMySQLDatetime(){
    	java.util.Date dt = new java.util.Date();
    	java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    	String currentTime = sdf.format(dt);
    	return currentTime;
    }
    /**
     * add by Ziheng Sun on 10/17/2015
     * @param address
     * @param error
     * @return
     */
    public boolean sendUserAErrorMail(String orderid, String address, String error){
    	
    	String content = this.readStringFromFile(this.getClassPath()+"error_notice.txt");
    	
    	content = content.replace("[error]", error).replace("[orderid]", orderid);
    	
    	return notifyUserByEmail(address, content);
    	
    }
    /**
     * add by Ziheng Sun on 10/17/2015
     * @param address
     * @param response
     * @return
     */
    public boolean sendUserAResultMail(String orderid, String address, String response){
    	
    	String content = this.readStringFromFile(this.getClassPath()+"resp_notice.txt");
    	
    	content = content.replace("[result]", response).replace("[orderid]", orderid);
    	
    	return notifyUserByEmail(address, content);
    }
    /**
     * add by Ziheng Sun on 10/17/2015
     * @param address
     * @param orderid
     * @return
     */
    public boolean sendUserAOrderNotice(String address, String orderid){
    	
    	String content = this.readStringFromFile(this.getClassPath()+"order_notice.txt");
    	
    	content = content.replace("[orderid]", orderid);
    	
    	logger.info(content);
    	
    	return notifyUserByEmail(address, content);
    }
	/**
     * Notify user by E-mail
     * Use .10 7001 notification service
     * @param email
     * @param content
     * @return 
     */
    public boolean notifyUserByEmail(String address, String content){
            boolean success =false;
            String req = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:not=\"http://NotificationService.grass.ws.laits.gmu.edu\">\n" +
                                "   <soapenv:Header/>\n" +
                                "   <soapenv:Body>\n" +
                                "      <not:notifyElement>\n" +
                                "	    <not:token>^||^</not:token>\n" +
                                "         <not:content>"+content+"</not:content>\n" +
                                "         <not:sendto>"+address.trim()+"</not:sendto>\n" +
                                "      </not:notifyElement>\n" +
                                "   </soapenv:Body>\n" +
                                "</soapenv:Envelope>";
            String datainforesp = AgentSOAP(req, SysDir.NOTIFICATION_EMAIL, SysDir.NOTIFICATION_EMAIL_SERVICE_URL);
//            <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
//   <soapenv:Body>
//      <notifyResponse xmlns="http://NotificationService.grass.ws.laits.gmu.edu">
//         <return>Send</return>
//      </notifyResponse>
//   </soapenv:Body>
//</soapenv:Envelope>
            System.out.println("Parsing the response...");
            Document doc = readDocumentFromString(datainforesp);
            XPath xpath = doc.createXPath("//soapenv:Envelope/soapenv:Body/ser:notifyResponse/ser:return" );
            Map nsmap = new HashMap();
            nsmap.put("soapenv", "http://schemas.xmlsoap.org/soap/envelope/");
            nsmap.put("ser", "http://NotificationService.grass.ws.laits.gmu.edu");
            xpath.setNamespaceURIs(nsmap);
            Node node = xpath.selectSingleNode(doc);
            String txturl = node.getText();
//            List nodes = xpath.selectNodes(doc);
//            String txturl = null;
//            for(int i=0;i<nodes.size();i++){
//                Node node = (Node)nodes.get(i);
//                txturl = node.getText();
//            }
            if(isNull(txturl)||!txturl.equals("Send")){
                System.out.println("Cann't set notification to the address :"+address);
            }else{
                success = true;
                System.out.println("Notification E-mail is sent.");
            }
            return success;
    }
    /**
     * Post long time request
     * @param param
     * @param input_url
     * @return
     * 
     */
    public static String Longtime_POST(String param, String input_url){
    	String resp = null;
    	try{
    		URL url = new URL(input_url);	      
            HttpURLConnection con =(HttpURLConnection)url.openConnection();
            con.setDoOutput(true); 
            con.setRequestMethod("POST");
            con.setRequestProperty("Content-Type", "application/xml");
            con.setConnectTimeout(36*60*60*1000); //extend the waiting time to 36 hours
            con.setDoOutput(true);
            con.setDoInput(true);
            con.setUseCaches(false);

            PrintWriter xmlOut = new PrintWriter(con.getOutputStream());
            xmlOut.write(param);   
            xmlOut.flush();
            BufferedReader response = new BufferedReader(new InputStreamReader(con.getInputStream())); 
            String result = "";
            String line;
            while((line = response.readLine())!=null){
                result += "\n" + line;
            }
            resp =  result.toString();  
    	}catch(Exception e){
    		e.printStackTrace();
    		throw new RuntimeException("Cann't send messages to "+input_url+". Reason: "+e.getLocalizedMessage());
    	}
    	return resp;
    }
	/**
	 * send a HTTP POST request
	 * @param param
	 * @param input_url
	 * @return
	 */
	public static  String POST(String param,String input_url){
        try {
                URL url = new URL(input_url);	      
                HttpURLConnection con =(HttpURLConnection)url.openConnection();
                con.setDoOutput(true); 
                con.setRequestMethod("POST");
                con.setRequestProperty("Content-Type", "application/xml");
                con.setDoOutput(true);
                con.setDoInput(true);
                con.setUseCaches(false);

                PrintWriter xmlOut = new PrintWriter(con.getOutputStream());
                xmlOut.write(param);   
                xmlOut.flush();
                BufferedReader response = new BufferedReader(new InputStreamReader(con.getInputStream())); 
                String result = "";
                String line;
                while((line = response.readLine())!=null){
                    result += "\n" + line;
                }
                return result.toString();  
            } catch (Exception e) {
                e.printStackTrace();
                throw new RuntimeException("Cann't send messages to "+input_url+". Reason: "+e.getLocalizedMessage());
            }
    }
	/**
	 * Main Entry
	 * @param args
	 */
	public static final void main(String[] args){
		BaseTool tool = new BaseTool();
//		tool.notifyUserByEmail("szhwhu@gmail.com", "A data product link.");
//		tool.sendUserAOrderNotice("szhwhu@gmail.com", "sdfdsfewewfrewrfewrvcvdfde");
//		tool.sendUserAResultMail("", "zsun@gmu.edu", "");
		
//		String url = BaseTool.cacheData("http://thredds.ucar.edu/thredds/fileServer/grib/NCEP/NDFD/NWS/CONUS/CONDUIT/NDFD_NWS_CONUS_conduit_2p5km_20170613_1800.grib2");
		
		String path = BaseTool.getCyberConnectorRootPath();
		
		System.out.println(path);
		
	}
}
