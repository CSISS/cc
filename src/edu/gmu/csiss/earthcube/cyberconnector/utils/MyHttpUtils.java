package edu.gmu.csiss.earthcube.cyberconnector.utils;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.CookieHandler;
import java.net.CookieManager;
import java.net.HttpCookie;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.httpclient.Credentials;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.NameValuePair;
import org.apache.commons.httpclient.UsernamePasswordCredentials;
import org.apache.commons.httpclient.auth.AuthScope;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.methods.StringRequestEntity;
import org.apache.log4j.Logger;

/**
 * 
 * @author Administrator
 *
 * updated by Ziheng Sun on 4/22/2016
 *
 */
public class MyHttpUtils
{
	
	public static Logger theLogger = Logger.getLogger(MyHttpUtils.class);
	
	/**
	 * 
	 * @param querystr
	 * @return
	 */
	public static NameValuePair[] turnStr2NVPs(String querystr) {
		
		String[] ss = querystr.split("&");
		
		NameValuePair[] nvps = new NameValuePair[ss.length];
		
		for(int i=0;i<ss.length;i++) {
			
			String[] kv = ss[i].split("=");
			
			nvps[i] = new NameValuePair(kv[0], kv[1]);
			
		}
		
		return nvps;
		
	}
	
	public static String doPost_Auth_URLEncode(String url, String postContent, String username, String password) {
		
		String resp = "";
	    try {
	    	
	    	if(url.toLowerCase().startsWith("https:")) {
	    		
	    		resp = MyHttpsUtils.doPostSSLBA_URLEncode(url, postContent, username, password);
	    		
	    	}else {
	    		
				HttpClient client = new HttpClient(); //or any method to get a client instance
				Credentials credentials = new UsernamePasswordCredentials(username, password);
				client.getState().setCredentials(AuthScope.ANY, credentials);
				PostMethod post = new PostMethod(url);
//		        post.setRequestEntity(new StringRequestEntity(postContent));
//		        post.addParameter("location", "sdfdsfds");
//		        post.addParameter("id", "sdfds");
//		        post.addParameters(arg0);
				post.addParameters(turnStr2NVPs(postContent));
		        int returnCode = client.executeMethod(post);
		        theLogger.info("ReturnCode: " + returnCode);
		        //add by Ziheng Sun on 5/3/2016 - to judge if the URL is secured
				if(returnCode == 401){
					throw new RuntimeException("HTTP Code 401 Unauthorized visit. This URL is secured.");
				}
		        // execute method and handle any error responses.
		        BufferedReader br = null;
		        if(returnCode == HttpStatus.SC_NOT_IMPLEMENTED) {
				       System.err.println("The Post method is not implemented by this URI");
				       // still consume the response body
				       resp = post.getResponseBodyAsString();
			    } else {
				       br = new BufferedReader(new InputStreamReader(post.getResponseBodyAsStream()));
				       String readLine = null;
					   while(((readLine = br.readLine()) != null)) {
						      System.err.println(readLine);
						      resp += readLine + "\n";
					   }
					   
			    }
	    	}
	    	
		} catch (Exception e) {
			
			e.printStackTrace();
			
		}
	    
	    theLogger.info("Response: " + resp);
	    
		return resp;
	}
	
	/**
	 * do GET
	 * @param url
	 * @param postContent
	 * @param username
	 * @param password
	 * @return
	 */
	public static String doGet_BasicAuth(String url, String username, String password) {
		String resp = "";
	    try {
	    	
	    	if(url.toLowerCase().startsWith("https:")) {
	    		
	    		resp = MyHttpsUtils.doGetSSLBA(url, username, password);
	    		
	    	}else {

				HttpClient client = new HttpClient(); //or any method to get a client instance
				
				Credentials credentials = new UsernamePasswordCredentials(username, password);
				client.getState().setCredentials(AuthScope.ANY, credentials);
				GetMethod post = new GetMethod(url);
				
		        int returnCode = client.executeMethod(post);
		        theLogger.info("ReturnCode: " + returnCode);
		      //add by Ziheng Sun on 5/3/2016 - to judge if the URL is secured
				if(returnCode == 401){
					throw new RuntimeException("HTTP Code 401 Unauthorized visit. This URL is secured.");
				}
		        // execute method and handle any error responses.
		        BufferedReader br = null;
		        if(returnCode == HttpStatus.SC_NOT_IMPLEMENTED) {
				       System.err.println("The Post method is not implemented by this URI");
				       // still consume the response body
				       resp = post.getResponseBodyAsString();
			    } else {
				       br = new BufferedReader(new InputStreamReader(post.getResponseBodyAsStream()));
				       String readLine = null;
					   while(((readLine = br.readLine()) != null)) {
//							      System.err.println(readLine);
						      resp += readLine + "\n";
					   }
					   
			    }
	    		
	    	}
	    	
		} catch (Exception e) {
				// TODO Auto-generated catch block
			e.printStackTrace();
		}
//	    theLogger.info("Response: " + resp);
		return resp;
		
	}
	
	
	/**
	 * 
	 * add by Ziheng Sun on 4/26/2016
	 * @param url
	 * @param postContent
	 * @param username
	 * @param password
	 * @return
	 */
	public static String doPost_BasicAuth(String url, String postContent, String username, String password){
		String resp = "";
	    try {
	    	
	    	if(url.toLowerCase().startsWith("https:")) {
	    		
	    		resp = MyHttpsUtils.doPostSSLBA(url, postContent, username, password);
	    		
	    	}else {
	    		
	    		HttpClient client = new HttpClient(); //or any method to get a client instance
				Credentials credentials = new UsernamePasswordCredentials(username, password);
				client.getState().setCredentials(AuthScope.ANY, credentials);
				PostMethod post = new PostMethod(url);
		        post.setRequestEntity(new StringRequestEntity(postContent));
		        int returnCode = client.executeMethod(post);
		        theLogger.info("ReturnCode: " + returnCode);
		      //add by Ziheng Sun on 5/3/2016 - to judge if the URL is secured
				if(returnCode == 401){
					throw new RuntimeException("HTTP Code 401 Unauthorized visit. This URL is secured.");
				}
		        // execute method and handle any error responses.
		        BufferedReader br = null;
		        if(returnCode == HttpStatus.SC_NOT_IMPLEMENTED) {
				       System.err.println("The Post method is not implemented by this URI");
				       // still consume the response body
				       resp = post.getResponseBodyAsString();
			    } else {
				       br = new BufferedReader(new InputStreamReader(post.getResponseBodyAsStream()));
				       String readLine = null;
					   while(((readLine = br.readLine()) != null)) {
						      System.err.println(readLine);
						      resp += readLine + "\n";
					   }
					   
			    }
	    		
	    	}
			
		} catch (Exception e) {
				// TODO Auto-generated catch block
			e.printStackTrace();
		}
	    
	    theLogger.info("Response: " + resp);
	    
		return resp;
		
	}
	/**
	 * 
	 * @param url
	 * @param postContent
	 * @return
	 * @throws Exception
	 */
//	public static String doPost2(String url, String postContent) throws Exception {
//		URL u = new URL(url);
//
//		// Open the connection and prepare to POST
//		URLConnection uc = u.openConnection();
//		HttpURLConnection huc = (HttpURLConnection)uc;
////		Fri Sep 02 23:37:24 EDT 2016:DEBUG:>> "Content-Type: text/xml;charset=UTF-8[\r][\n]"
//
//		huc.setRequestProperty("Content-Type", "text/xml;charset=UTF-8");
//		huc.setDoOutput(true);
//		huc.setDoInput(true);
//		huc.setAllowUserInteraction(false);
//		
//		DataOutputStream dstream = new DataOutputStream(huc.getOutputStream());
//		
//		// POST it
//		dstream.writeBytes(postContent);
//		dstream.close();
//
//		//add by Ziheng Sun on 5/3/2016 - to judge if the URL is secured
//		int code = huc.getResponseCode();
//		if(code == 401){
//			throw new RuntimeException("HTTP Code 401 Unauthorized visit. This URL is secured.");
//		}
//		
//		// Read Response
//		InputStream in = huc.getInputStream();
//
//		BufferedReader r = new BufferedReader(new InputStreamReader(in));
//		StringBuffer buf = new StringBuffer();
//		String line;
//		while ((line = r.readLine())!=null)
//			buf.append(line);
//
//		in.close();
//		
//
//		return buf.toString();
//	}
	/**
	 * 
	 * doPost
	 * 
	 * created by Z.S. on 20160926
	 * 
	 * @param url
	 * @param postContent
	 * @param contenttype
	 * @return
	 * @throws Exception
	 */
//	public static String doPost(String url, String postContent, String contenttype) throws Exception {
//		
//		URL u = new URL(url);
//		
//		// Open the connection and prepare to POST
//		
//		URLConnection uc = u.openConnection();
//		
//		HttpURLConnection huc = (HttpURLConnection)uc;
////		Fri Sep 02 23:37:24 EDT 2016:DEBUG:>> "Content-Type: text/xml;charset=UTF-8[\r][\n]"
//
//		huc.setRequestProperty("Content-Type", contenttype);
//		
//		huc.setDoOutput(true);
//		
//		huc.setDoInput(true);
//		
//		huc.setAllowUserInteraction(false);
//		
//		DataOutputStream dstream = new DataOutputStream(huc.getOutputStream());
//		
//		// POST it
//		dstream.writeBytes(postContent);
//		
//		dstream.close();
//
//		//add by Ziheng Sun on 5/3/2016 - to judge if the URL is secured
//		int code = huc.getResponseCode();
//		
//		if(code == 401){
//		
//			throw new RuntimeException("HTTP Code 401 Unauthorized visit. This URL is secured.");
//		
//		}
//		
//		// Read Response
//		InputStream in = huc.getInputStream();
//
//		BufferedReader r = new BufferedReader(new InputStreamReader(in));
//		
//		StringBuffer buf = new StringBuffer();
//		
//		String line;
//		
//		while ((line = r.readLine())!=null)
//			
//			buf.append(line);
//
//		in.close();
//		
//		return buf.toString();
//		
//	}
	
	
	
	
	/**
	 * HTTP Post
	 * @param url
	 * @param postContent
	 * @return
	 * @throws Exception
	 */
//	public static String doPost(String url, String postContent) throws Exception {
//		URL u = new URL(url);
//
//		// Open the connection and prepare to POST
//		URLConnection uc = u.openConnection();
//		HttpURLConnection huc = (HttpURLConnection)uc;
//		huc.setDoOutput(true);
//		huc.setDoInput(true);
//		huc.setAllowUserInteraction(false);
//		
//		DataOutputStream dstream = new DataOutputStream(huc.getOutputStream());
//		
//		// POST it
//		dstream.writeBytes(postContent);
//		dstream.close();
//
//		//add by Ziheng Sun on 5/3/2016 - to judge if the URL is secured
//		int code = huc.getResponseCode();
//		if(code == 401){
//			throw new RuntimeException("HTTP Code 401 Unauthorized visit. This URL is secured.");
//		}
//		
//		// Read Response
//		InputStream in = huc.getInputStream();
//
//		BufferedReader r = new BufferedReader(new InputStreamReader(in));
//		StringBuffer buf = new StringBuffer();
//		String line;
//		while ((line = r.readLine())!=null)
//			buf.append(line);
//
//		in.close();
//		
//
//		return buf.toString();
//	}
	
	/**
	 * HTTP GET
	 * @param url
	 * @return
	 * @throws Exception
	 */
	public static String doGet(String url) throws Exception
	{
		
		//url = java.net.URLEncoder.encode(url,"UTF-8");
		
		System.out.println("Encoded URL: " + url);
		
		URL u = new URL(url);

		// Open the connection and prepare to POST
		URLConnection uc = u.openConnection();
		HttpURLConnection huc = (HttpURLConnection)uc;
		huc.setDoOutput(false);
		huc.setDoInput(true);
		huc.setAllowUserInteraction(false);
		
		//add by Ziheng Sun on 5/3/2016 - to judge if the URL is secured
		int code = huc.getResponseCode();
		if(code == 401){
			throw new RuntimeException("HTTP Code 401 Unauthorized visit. This URL is secured.");
		}

		// Read Response
		InputStream in = huc.getInputStream();

		BufferedReader r = new BufferedReader(new InputStreamReader(in));
		StringBuffer buf = new StringBuffer();
		String line;
		while ((line = r.readLine())!=null)
			buf.append(line);

		in.close();

		return buf.toString();
	}
	/**
	 * HTTP GET with cookies
	 * @param url
	 * @param cookie_str
	 * @return
	 * @throws Exception
	 */
//	public static String doGetWithCookies(String url, String cookie_str) throws Exception
//	{
//		URL u = new URL(url);
//
//		// Open the connection and prepare to POST
//		URLConnection uc = u.openConnection();
//		HttpURLConnection huc = (HttpURLConnection)uc;
//		huc.setDoOutput(false);
//		huc.setDoInput(true);
//		huc.setAllowUserInteraction(false);
//		huc.setRequestProperty("Cookie", cookie_str);
//
//		//add by Ziheng Sun on 5/3/2016 - to judge if the URL is secured
//		int code = huc.getResponseCode();
//		if(code == 401){
//			throw new RuntimeException("HTTP Code 401 Unauthorized visit. This URL is secured.");
//		}
//
//		// Read Response
//		InputStream in = huc.getInputStream();
//
//		BufferedReader r = new BufferedReader(new InputStreamReader(in));
//		StringBuffer buf = new StringBuffer();
//		String line;
//		while ((line = r.readLine())!=null)
//			buf.append(line);
//
//		in.close();
//
//		return buf.toString();
//	}

	public static void downloadFile(String resourceUrl, String destinationPath) throws Exception
	{
		downloadFile(resourceUrl, destinationPath, null);
	}

	public static void downloadFile(String resourceUrl, String destinationPath, String cookie) throws Exception
	{
		URL url = new URL(resourceUrl);

		URLConnection uc = url.openConnection();
		HttpURLConnection huc = (HttpURLConnection)uc;

		if(cookie != null) {
			huc.setRequestProperty("Cookie", cookie);
		}

		BufferedInputStream in = new BufferedInputStream(huc.getInputStream());

		FileOutputStream fileOutputStream = new FileOutputStream(destinationPath);
		byte dataBuffer[] = new byte[1048576];
		int bytesRead;

		while ((bytesRead = in.read(dataBuffer, 0, 1048576)) != -1) {
			fileOutputStream.write(dataBuffer, 0, bytesRead);
		}

		fileOutputStream.close();
	}

	public static void downloadFileSessionAuth(String loginUrl, String loginFormData, String resourceUrl, String destinationPath) throws Exception
	{
		CookieManager cookieManager = new CookieManager();
		CookieHandler.setDefault(cookieManager);

		URL u = new URL(loginUrl);

		// Open the connection and prepare to POST
		URLConnection uc = u.openConnection();
		HttpURLConnection huc = (HttpURLConnection)uc;

		huc.setRequestProperty("Content-Type", "text/xml;charset=UTF-8");
		huc.setDoOutput(true);
		huc.setDoInput(true);
		huc.setAllowUserInteraction(false);

		DataOutputStream dstream = new DataOutputStream(huc.getOutputStream());

		dstream.writeBytes(loginFormData);
		dstream.close();


		uc.getContent();

		List <String> cookies = new ArrayList<String>();
		for (HttpCookie c : cookieManager.getCookieStore().getCookies()) {
			cookies.add(c.toString());
		}

		String cookiesStr = String.join(";", cookies);
		downloadFile(resourceUrl, destinationPath, cookiesStr);
	}
	
	
	
	
}
