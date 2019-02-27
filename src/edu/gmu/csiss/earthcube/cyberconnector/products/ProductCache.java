package edu.gmu.csiss.earthcube.cyberconnector.products;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.net.URLConnection;
import java.util.HashMap;
import java.util.Map;

import javax.xml.soap.SOAPException;

import edu.gmu.csiss.earthcube.cyberconnector.utils.BaseTool;
import edu.gmu.csiss.earthcube.cyberconnector.utils.MyHttpUtils;
import edu.gmu.csiss.earthcube.cyberconnector.utils.SOAPClient;
import edu.gmu.csiss.earthcube.cyberconnector.utils.SysDir;
import org.apache.commons.io.FilenameUtils;
import org.apache.log4j.Logger;
import org.dom4j.Document;
import org.dom4j.DocumentHelper;
import org.dom4j.Node;
import org.dom4j.XPath;


public class ProductCache {
    private Logger logger = Logger.getLogger(ProductCache.class);

    private String id;
    private String url;

    public String getCacheUrl() {
        return cacheUrl;
    }

    public String getCachePath() {
        return cachePath;
    }

    private String cacheUrl;
    private String cachePath;
    private String cacheTmpPath;
    private String cacheDir;

    public ProductCache(String id, String url) {
        this.id = id;
        this.url = url;

        String suffix = FilenameUtils.getExtension(url).toLowerCase();

        String cacheFileName = id;
        if(!suffix.isEmpty()) {
            cacheFileName = cacheFileName + "." + suffix;
        }



        this.cacheDir = BaseTool.getCyberConnectorRootPath() + SysDir.upload_file_path ;

        this.cacheUrl = SysDir.PREFIXURL + "/CyberConnector/" + SysDir.upload_file_path + "/" + cacheFileName;

        this.cachePath = cacheDir  + "/" + cacheFileName;

        this.cacheTmpPath = this.cachePath + ".tmp";
    }

    public boolean cacheExists() {
        File cacheFile = new File(cachePath);
        return cacheFile.exists();
    }

    public void doCache() throws Exception {
        (new File(cacheDir)).mkdirs();

        logger.info("Cache " + url + " to " + cachePath + " as " + cacheUrl);

//        new FileOutputStream(cachePath).close();
//        return;

        if(url.startsWith("https://rda.ucar.edu/data")) {
            String formData = "remember=on&do=login&url=%2F";
            formData = formData + "&email=" + SysDir.ucar_rda_username;
            formData = formData + "&passwd=" + SysDir.ucar_rda_password;

            MyHttpUtils.downloadFileSessionAuth("https://rda.ucar.edu/cgi-bin/login", formData, url, cacheTmpPath);
            
        } else {
            
        	MyHttpUtils.downloadFile(url, cacheTmpPath);
        	
        }

        File cachedFile = new File(cacheTmpPath);
        
        cachedFile.renameTo(new File(cachePath));
        
    }

    
    /**
     * Download file through URI
     * @param uri
     * @param tempurl
     * @param tempdir
     * @return
     */
//    public static String[] downloadURI(String uri, String tempurl, String tempdir){
//        String tempName = uri.substring(uri.lastIndexOf("/")+1);
//        String tempfilepath = tempdir+tempName;
//        if(!uri.startsWith(tempurl)&&!new File(tempfilepath).exists()){
//            logger.info("Begin dowloading the image from the link..");
//            logger.info("File URI: "+uri);
//            if(uri.startsWith("http")){
//                down(tempfilepath, uri);
//            }else{
////				wget(tempfilepath, uri);
//                throw new RuntimeException("The input file url is not by http protocal.");
//            }
//
//            logger.info("File is saved to:" + tempfilepath);
//            logger.info("Download ends successfully.");
//        }else{
//            logger.info("The file from the link "+uri+"already exists on the server..");
//        }
//        String[] urianddir = new String[2];
//        urianddir[0] = tempurl+tempName;
//        urianddir[1] = tempfilepath;
//        return urianddir;
//    }


    /**
     * Cache Data on Server
     * @param url
     * @return
     */
    public static String cacheData(String url){

        String resp = null;

        String cachedurl =null;

        if(url.startsWith(SysDir.CACHE_SERVICE_URL)){

            return url;

        }

        try {
            String req = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:cac=\"http://cache.cube.ws.csiss.gmu.edu\"> "+
                    " <soapenv:Header/> "+
                    " <soapenv:Body> "+
                    "   <cac:cacheElement> "+
                    "      <cac:rawDataURL>" + url + "</cac:rawDataURL> "+
                    "      <cac:lasting>whatever</cac:lasting> "+ //this option is meaningless for now
                    "   </cac:cacheElement> "+
                    " </soapenv:Body> "+
                    "</soapenv:Envelope>";

            SOAPClient client = new SOAPClient();

            client.setEndpoint(SysDir.CACHE_SERVICE_URL);

            client.setSoapmessage(req);
            client.send();
            resp = client.getRespmessage();

            Document doc = BaseTool.parseString(resp);

            if(doc==null){

                throw new RuntimeException("Fail to cache data onto server.");

            }

            Map map = new HashMap();

            map.put("soapenv", "http://schemas.xmlsoap.org/soap/envelope/");

            map.put("cache", "http://cache.cube.ws.csiss.gmu.edu");

            XPath cacheurlpath = DocumentHelper.createXPath("//soapenv:Envelope/soapenv:Body/cache:cacheResponse/cache:cacheURL");

            cacheurlpath.setNamespaceURIs(map);

            Node cachenode = cacheurlpath.selectSingleNode(doc);

            cachedurl = cachenode.getText();

        } catch (SOAPException e) {

            e.printStackTrace();

            throw new RuntimeException("Fail to cache data on server. SOAP servcie failure.");

        }

        return cachedurl;

    }

}
