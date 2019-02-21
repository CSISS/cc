package edu.gmu.csiss.earthcube.cyberconnector.utils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;

import javax.net.ssl.SSLContext;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.CredentialsProvider;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.conn.ssl.NoopHostnameVerifier;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.ssl.SSLContextBuilder;
import org.apache.http.util.EntityUtils;

/**
 * HTTP 请求工具类
 *
 * @author : liii
 * @version : 1.0.0
 * @date : 2015/7/21
 * @see : TODO
 */
public class MyHttpsUtils {
	
	public static String doPostSSLBA(String url, String content, String username, String password) {

		// The underlying HTTP connection is still held by the response object
		// to allow the response content to be streamed directly from the network socket.
		// In order to ensure correct deallocation of system resources
		// the user MUST call CloseableHttpResponse#close() from a finally clause.
		// Please note that if response content is not fully consumed the underlying
		// connection cannot be safely re-used and will be shut down and discarded
		// by the connection manager. 
		String resp = "";
		try {
			
			CredentialsProvider provider = new BasicCredentialsProvider();
			UsernamePasswordCredentials credentials
			 = new UsernamePasswordCredentials(username, password);
			provider.setCredentials(AuthScope.ANY, credentials);
			
			SSLContext sslContext = new SSLContextBuilder()
		            .loadTrustMaterial(null, (certificate, authType) -> true).build();
			
			CloseableHttpClient httpclient = HttpClients.custom().setSSLContext(sslContext)
		            .setSSLHostnameVerifier(new NoopHostnameVerifier())
		            .setDefaultCredentialsProvider(provider)
		            .build();
			
			HttpPost httpPost = new HttpPost(url);
			httpPost.setEntity(new StringEntity(content));
			CloseableHttpResponse response1 = httpclient.execute(httpPost);
		    System.out.println(response1.getStatusLine());
		    
		    // Get the response
            BufferedReader br = new BufferedReader(new InputStreamReader(response1
                        .getEntity().getContent()));
             
            String line = "";
            while ((line = br.readLine()) != null) {
                System.out.println(line);
                resp += line + "\n";
            }
            response1.close();
            
		}catch(Exception e) {
			
			e.printStackTrace();
			
		} finally {
		    
		}
		return resp;
		
	}
	
	public static String doGetSSLBA(String url, String username, String password) {
		
		StringBuffer resp = new StringBuffer();
		
		try {
			
			CredentialsProvider provider = new BasicCredentialsProvider();
			UsernamePasswordCredentials credentials
			 = new UsernamePasswordCredentials(username, password);
			provider.setCredentials(AuthScope.ANY, credentials);
			
			SSLContext sslContext = new SSLContextBuilder()
		            .loadTrustMaterial(null, (certificate, authType) -> true).build();
			
			  
			CloseableHttpClient client = HttpClients.custom().setSSLContext(sslContext)
		            .setSSLHostnameVerifier(new NoopHostnameVerifier())
					.setDefaultCredentialsProvider(provider)
					.build();
			
			HttpGet httpget = new HttpGet(url);
			 
			CloseableHttpResponse response = client.execute(httpget);
			int statusCode = response.getStatusLine()
			  .getStatusCode();
			// Get the response
            BufferedReader br = new BufferedReader(new InputStreamReader(response
                        .getEntity().getContent()));
             
            String line = "";
            while ((line = br.readLine()) != null) {
                System.out.println(line);
                resp.append(line).append("\n");
            }
            response.close();
		}catch(Exception e) {
			
			e.printStackTrace();
			
		}
		
		return null;
	}
   
	public static String doPostSSL(String url, String content) {
		
		// The underlying HTTP connection is still held by the response object
		// to allow the response content to be streamed directly from the network socket.
		// In order to ensure correct deallocation of system resources
		// the user MUST call CloseableHttpResponse#close() from a finally clause.
		// Please note that if response content is not fully consumed the underlying
		// connection cannot be safely re-used and will be shut down and discarded
		// by the connection manager. 
		String resp = "";
		try {
			SSLContext sslContext = new SSLContextBuilder()
		            .loadTrustMaterial(null, (certificate, authType) -> true).build();
			CloseableHttpClient httpclient = HttpClients.custom().setSSLContext(sslContext)
		            .setSSLHostnameVerifier(new NoopHostnameVerifier())
		            .build();
			
			HttpPost httpPost = new HttpPost(url);
			httpPost.setEntity(new StringEntity(content));
			CloseableHttpResponse response1 = httpclient.execute(httpPost);
		    System.out.println(response1.getStatusLine());
		    
		    // Get the response
            BufferedReader br = new BufferedReader(new InputStreamReader(response1
                        .getEntity().getContent()));
             
            String line = "";
            while ((line = br.readLine()) != null) {
                System.out.println(line);
                resp += line + "\n";
            }
            response1.close();
            
		}catch(Exception e) {
			
			e.printStackTrace();
			
		} finally {
		    
		}
		return resp;
		
	}
	
	public static String doGetSSL(String url) throws ClientProtocolException, IOException, KeyManagementException, NoSuchAlgorithmException, KeyStoreException {
		
//		CloseableHttpClient httpclient = HttpClients.createDefault();
		
		SSLContext sslContext = new SSLContextBuilder()
	            .loadTrustMaterial(null, (certificate, authType) -> true).build();
		CloseableHttpClient httpclient = HttpClients.custom().setSSLContext(sslContext)
	            .setSSLHostnameVerifier(new NoopHostnameVerifier())
	            .build();
		HttpGet httpGet = new HttpGet(url);
		CloseableHttpResponse response1 = httpclient.execute(httpGet);
		// The underlying HTTP connection is still held by the response object
		// to allow the response content to be streamed directly from the network socket.
		// In order to ensure correct deallocation of system resources
		// the user MUST call CloseableHttpResponse#close() from a finally clause.
		// Please note that if response content is not fully consumed the underlying
		// connection cannot be safely re-used and will be shut down and discarded
		// by the connection manager. 
		try {
		    System.out.println(response1.getStatusLine());
		    // Get the response
            BufferedReader br;
             
            br = new BufferedReader(new InputStreamReader(response1
                        .getEntity().getContent()));
             
            String line = "";
            while ((line = br.readLine()) != null) {
                System.out.println(line);
            }
            
		} finally {
		    response1.close();
		}

//		HttpPost httpPost = new HttpPost("http://targethost/login");
//		List <NameValuePair> nvps = new ArrayList <NameValuePair>();
//		nvps.add(new BasicNameValuePair("username", "vip"));
//		nvps.add(new BasicNameValuePair("password", "secret"));
//		httpPost.setEntity(new UrlEncodedFormEntity(nvps));
//		CloseableHttpResponse response2 = httpclient.execute(httpPost);
//
//		try {
//		    System.out.println(response2.getStatusLine());
//		    HttpEntity entity2 = response2.getEntity();
//		    // do something useful with the response body
//		    // and ensure it is fully consumed
//		    EntityUtils.consume(entity2);
//		} finally {
//		    response2.close();
//		}
		
		return null;
		
	}
	
}
