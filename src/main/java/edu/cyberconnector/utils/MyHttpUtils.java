package edu.cyberconnector.utils;

import java.net.*;

import org.apache.http.*;
import org.apache.http.auth.*;
import org.apache.http.client.*;
import org.apache.http.client.methods.*;
import org.apache.http.client.utils.*;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.*;


import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;


public class MyHttpUtils
{
	
	public static Logger theLogger = LoggerFactory.getLogger(MyHttpUtils.class);
	

	public static NameValuePair[] turnStr2NVPs(String querystr) {
		
		String[] ss = querystr.split("&");
		
		NameValuePair[] nvps = new NameValuePair[ss.length];
		
		for(int i=0;i<ss.length;i++) {
			
			String[] kv = ss[i].split("=");
			
			nvps[i] = new BasicNameValuePair(kv[0], kv[1]);
			
		}
		
		return nvps;
		
	}

	public static String doPost_Auth_URLEncode(String url, String postContent, String username, String password) {
		return _doPost_Auth(url, postContent, username, password, true);
	}

	public static String doPost_BasicAuth(String url, String postContent, String username, String password){
		return _doPost_Auth(url, postContent, username, password, false);
	}


	private static String _doPost_Auth(String url, String postContent, String username, String password, boolean urlEncode) {
		
		String responseBody = "";
	    try {
			CredentialsProvider provider = new BasicCredentialsProvider();

			Credentials credentials = new UsernamePasswordCredentials(username, password);
			provider.setCredentials(AuthScope.ANY, credentials);


			HttpClient client = HttpClientBuilder.create()
					.setDefaultCredentialsProvider(provider)
					.build();

			URIBuilder builder = new URIBuilder(url);
			if(urlEncode) {
				builder.setParameters(turnStr2NVPs(postContent));
			}

			HttpPost post = new HttpPost(builder.build());
			if(!urlEncode) {
				post.setEntity(new StringEntity(postContent));
			}

			HttpResponse response = client.execute(post);
			HttpEntity responseEntity = response.getEntity();
			int returnCode = response.getStatusLine().getStatusCode();
			theLogger.info("ReturnCode: " + returnCode);

			if(returnCode == 401){
				throw new RuntimeException("HTTP Code 401 Unauthorized visit. This URL is secured.");
			}
			// execute method and handle any error responses.
			BufferedReader br = null;
			if(returnCode == HttpStatus.SC_NOT_IMPLEMENTED) {
				System.err.println("The Post method is not implemented by this URI");
				responseBody = EntityUtils.toString(responseEntity);
			} else {
				   br = new BufferedReader(new InputStreamReader(responseEntity.getContent()));
				   String readLine = null;
				   while(((readLine = br.readLine()) != null)) {
						  System.err.println(readLine);
					   responseBody += readLine + "\n";
				   }

			}
		} catch (Exception e) {
				// TODO Auto-generated catch block
			e.printStackTrace();
		}
	    theLogger.info("Response: " + responseBody);
	    
		return responseBody;
	}
	



	public static String doPost2(String url, String postContent) throws Exception {
		URL u = new URL(url);

		// Open the connection and prepare to POST
		URLConnection uc = u.openConnection();
		HttpURLConnection huc = (HttpURLConnection)uc;
//		Fri Sep 02 23:37:24 EDT 2016:DEBUG:>> "Content-Type: text/xml;charset=UTF-8[\r][\n]"

		huc.setRequestProperty("Content-Type", "text/xml;charset=UTF-8");
		huc.setDoOutput(true);
		huc.setDoInput(true);
		huc.setAllowUserInteraction(false);
		
		DataOutputStream dstream = new DataOutputStream(huc.getOutputStream());
		
		// POST it
		dstream.writeBytes(postContent);
		dstream.close();

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


	public static String doPost(String url, String postContent, String contenttype) throws Exception {
		
		URL u = new URL(url);
		
		// Open the connection and prepare to POST
		
		URLConnection uc = u.openConnection();
		
		HttpURLConnection huc = (HttpURLConnection)uc;
//		Fri Sep 02 23:37:24 EDT 2016:DEBUG:>> "Content-Type: text/xml;charset=UTF-8[\r][\n]"

		huc.setRequestProperty("Content-Type", contenttype);
		
		huc.setDoOutput(true);
		
		huc.setDoInput(true);
		
		huc.setAllowUserInteraction(false);
		
		DataOutputStream dstream = new DataOutputStream(huc.getOutputStream());
		
		// POST it
		dstream.writeBytes(postContent);
		
		dstream.close();

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
	 * HTTP Post
	 * @param url
	 * @param postContent
	 * @return
	 * @throws Exception
	 */
	public static String doPost(String url, String postContent) throws Exception {
		URL u = new URL(url);

		// Open the connection and prepare to POST
		URLConnection uc = u.openConnection();
		HttpURLConnection huc = (HttpURLConnection)uc;
		huc.setDoOutput(true);
		huc.setDoInput(true);
		huc.setAllowUserInteraction(false);
		
		DataOutputStream dstream = new DataOutputStream(huc.getOutputStream());
		
		// POST it
		dstream.writeBytes(postContent);
		dstream.close();

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

	public static String doGetWithCookies(String url, String cookie_str) throws Exception
	{
		URL u = new URL(url);

		// Open the connection and prepare to POST
		URLConnection uc = u.openConnection();
		HttpURLConnection huc = (HttpURLConnection)uc;
		huc.setDoOutput(false);
		huc.setDoInput(true);
		huc.setAllowUserInteraction(false);
		huc.setRequestProperty("Cookie", cookie_str);

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
	
	
	public static void main(String[] args){

		
		try {
			String resp = MyHttpUtils.doGet("http://ows.dev.52north.org:8080/wps/WebProcessingService?request=GetCapabilities&service=WPS&version=2.0.0");
			
			System.out.println("Response:" + resp);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
}
