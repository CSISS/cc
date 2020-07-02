package edu.gmu.csiss.earthcube.cyberconnector.utils;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.LinkOption;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

/**
 *Class SysDir.java
 *@author ziheng
 *@time Aug 10, 2015 4:18:19 PM
 *Original aim is to support iGFDS.
 */
public class SysDir {
	
	public static int worknumber = 1;
	
	public static String instantiationservletaddress0 = null; //WorkflowCore instantiation servlet 0 - bind LogicProcess to MessageType
	
	public static String instantiationservletaddress = null; //WorkflowCore instantiation servlet 1 - Transform LogicProcess and MessageType to BPEL Workflow
	
	public static String executionservletaddress = null;
	
	public static String registrationaddress = null;
	
	public static String NOTIFICATION_EMAIL  = null;
    
	public static String NOTIFICATION_EMAIL_SERVICE_URL = null;

	public static String CACHE_SERVICE_URL = null;

	public static String CSISS_CSW_URL = null;

	public static String GEODAB_CSW_URL = "http://gs-service-production.geodab.eu/gs-service/services/essi/csw";

	public static String CEOS_COLLECTION_CSW_URL = "https://cmr.earthdata.nasa.gov/csw/collections";

	public static String CEOS_GRANULE_CSW_URL = "https://cwic.wgiss.ceos.org/cwicv1/discovery";

	public static String PREFIXURL = null;
    
	public static String ncWMSURL = null; 
    
	public static String ncUsername = null; 
    
	public static String ncPassword = null;

	public static String geoweaver_file_path = null;

	public static Path data_path = null;

	public static Path workspace_path = null;

	public static Path workspace_cache_path = null;

	public static Path workspace_uploads_path = null;

	public static Path workspace_tmp_path = null;

	public static Path workspace_results_path = null;

	public static Path nco_path = null;

	public static Path anaconda_path = null;

	public static String thredds_index_url = null;

	public static String database_driver = null;

	public static boolean database_h2_embedded = false;

	public static String database_h2_embedded_host = null;

	public static String database_h2_embedded_port = null;

	public static String database_url = null;
	
	public static String database_docker_url = null;

	public static String database_user = null;

	public static String database_password = null;

	public static String ucar_rda_username = null;

	public static String ucar_rda_password = null;
	
	public static boolean login_required = false;
	
	public static boolean enable_whitelist = true;
	
	public static List whiteusers = new ArrayList();

	static  Path normalizedPath(String path) throws IOException {
		String homedir = System.getProperty("user.home") + File.separator;
		path = path.replace("~", homedir);

		return Paths.get(path).normalize().toAbsolutePath();
	}
	
	static Properties readProperties(String path) {
		Properties p = new Properties();

		try {
			
			FileInputStream fileIn = new FileInputStream(path);

			p.load(fileIn);
			
			fileIn.close();
			
		} catch (IOException e) {
			
			e.printStackTrace();
			
			//System.exit(1);
		}

		return p;
	}
	
	static void init() {
		
		try {
			
			BaseTool t = new BaseTool();
			
			String configFile = t.getClassPath()+File.separator+"config.properties";
			
			Properties p = readProperties(configFile);

			String secretConfigFile = p.getProperty("secret_properties_path");
			
			Properties secrets = null;
			
			if(new File(secretConfigFile).exists())
			
				secrets = readProperties(secretConfigFile);
			
			else
				
				secrets = readProperties(t.getClassPath()+File.separator+secretConfigFile);

			String number = p.getProperty("workernumber");
			
			SysDir.worknumber = Integer.parseInt(number);
			
			instantiationservletaddress0 = p.getProperty("instantiationservletaddress0");
			
			instantiationservletaddress = p.getProperty("instantiationservletaddress");
			
			executionservletaddress = p.getProperty("executionservletaddress");
			
			registrationaddress = p.getProperty("registrationaddress");
			
			NOTIFICATION_EMAIL = p.getProperty("notify");
			
			NOTIFICATION_EMAIL_SERVICE_URL = p.getProperty("notificationserviceaddress");

			CACHE_SERVICE_URL = p.getProperty("datacacheserviceaddress");
			
			CSISS_CSW_URL = p.getProperty("csisscswurl");

			PREFIXURL = p.getProperty("prefixurl");
			
			ncWMSURL = p.getProperty("ncwmsurl");

			geoweaver_file_path = normalizedPath(p.getProperty("geoweaver_file_path")).toString();

			data_path = normalizedPath(p.getProperty("data_path"));

			workspace_path = normalizedPath(p.getProperty("workspace_path"));

			SysDir.initWorkspacePaths();

			thredds_index_url = p.getProperty("thredds_index_url");
			
			database_driver = p.getProperty("database_driver");

			String h2_embed_prop = p.getProperty("database_h2_embedded");
			if(h2_embed_prop == null) {
				h2_embed_prop = "false";
			}

			database_h2_embedded = h2_embed_prop.toLowerCase().equals("true");

			database_h2_embedded_host = p.getProperty("database_h2_embedded_host");

			database_h2_embedded_port = p.getProperty("database_h2_embedded_port");

			database_url = p.getProperty("database_url");

			database_docker_url = p.getProperty("database_docker_url");
			
			login_required = Boolean.parseBoolean(p.getProperty("login_required"));

			nco_path = normalizedPath(p.getProperty("nco_path"));

			anaconda_path = normalizedPath(p.getProperty("anaconda_path"));
			
			enable_whitelist = Boolean.parseBoolean(p.getProperty("enable_whitelist"));
			
			// SECRET PROPERTIES

			ncUsername = secrets.getProperty("ncwms_username");

			ncPassword = secrets.getProperty("ncwms_password");

			database_user = secrets.getProperty("database_user");

			database_password = secrets.getProperty("database_password");

			ucar_rda_username = secrets.getProperty("ucar_rda_username");

			ucar_rda_password = secrets.getProperty("ucar_rda_password");
			
			String whitelist = t.readStringFromFile(t.getClassPath()+File.separator+"whitelist.user");
			
			if(!t.isNull(whitelist.trim())) {
			
				String[] emails = whitelist.trim().split("\n");
				
				for(String email: emails) {
					
					email = email.trim();
					
					if(!t.isNull(email)) {
						
						whiteusers.add(email);
						
					}
					
				}
				
			}
			
		} catch (Exception e) {
			e.printStackTrace();
			System.exit(1);
		}
	}



	static void initWorkspacePaths() throws IOException {
		SysDir.workspace_cache_path = SysDir.workspace_path.resolve("cache");
		SysDir.workspace_uploads_path = SysDir.workspace_path.resolve("uploads");
		SysDir.workspace_tmp_path = SysDir.workspace_path.resolve("tmp");
		SysDir.workspace_results_path = SysDir.workspace_path.resolve("results");

		Files.createDirectories(SysDir.workspace_cache_path);
		Files.createDirectories(SysDir.workspace_uploads_path);
		Files.createDirectories(SysDir.workspace_tmp_path);
		Files.createDirectories(SysDir.workspace_results_path);
	}

	static {
		//initialize from config file
		init();
	}

//	public static void write(String msg) {
//		try {
//			FileWriter myWriter = new FileWriter("/covaliFiles/log.txt");
//			myWriter.write(msg);
//			myWriter.close();
//		} catch (IOException e) {
//			System.out.println("An error occurred.");
//			e.printStackTrace();
//		}
//	}

}