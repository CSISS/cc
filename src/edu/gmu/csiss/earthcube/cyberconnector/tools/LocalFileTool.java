package edu.gmu.csiss.earthcube.cyberconnector.tools;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.log4j.Logger;

import edu.gmu.csiss.earthcube.cyberconnector.products.Product;
import edu.gmu.csiss.earthcube.cyberconnector.search.SearchResponse;
import edu.gmu.csiss.earthcube.cyberconnector.search.SearchTool;
import edu.gmu.csiss.earthcube.cyberconnector.utils.BaseTool;
import edu.gmu.csiss.earthcube.cyberconnector.utils.SysDir;

public class LocalFileTool {
	
	final static public String[] FORMATS = {"tif", "tiff", "grb", "grib", "grib2", "nc", "nc4", "nc3", 
			"tiff", "shp", "h5", "hdf", "hdfeos", "hdf4", "hdf5"}; 
	
	static int num = 0;
	
	static Logger logger = Logger.getLogger(LocalFileTool.class);
	
	/**
	 * Check if the file is in supported format
	 * @param filename
	 * @return
	 */
	public static boolean filterFileSuffix(String filename) {
		
		String suffix = FilenameUtils.getExtension(filename).toLowerCase();
		
		boolean support = false;
		
		for(String f: FORMATS) {
		
			if(f.equals(suffix)) {
				
				support = true;
				
				break;
				
			}
			
		}
		
		return support;
		
	}
	/**
	 * Check if the file is the required file format
	 * @param filename
	 * @param formats
	 * @return
	 */
	public static boolean filterFileSuffix(String filename, List formats) {
		
		String suffix = FilenameUtils.getExtension(filename).toLowerCase();
		
		logger.debug("file suffix: " + suffix);
		
		boolean support = false;
		
		if(formats==null||formats.size()==0
				||String.valueOf(formats.get(0)).equals("all")) {
			
			logger.debug("the file suffix is accepted");
			
			support = true;
			
		}else {
			
			for(Object f: formats) {
				
				if(String.valueOf(f).equals(suffix)) {
					
					support = true;
					
					break;
					
				}
				
			}
			
		}
		
		return support;
		
	}
	
	/**
	 * Find file by keywords
	 * @param keywords
	 * @param recordsperpage
	 * @param start
	 * @param folder
	 * @param formats
	 * @return
	 */
	private static List<Product> findFileByKeywords(String keywords, int recordsperpage, int start, String folder, List formats) {
		
		List<Product> products = new ArrayList();
		
		try {
			
			File folderfile = new File(folder);
			
			logger.debug("Searching folder: " + folder);
			
			if(folderfile.exists()) {
				
//	            Collection files = FileUtils.listFiles(folderfile, null, recursive);
				
				File[] files = folderfile.listFiles();
				
	            String[] keywordlist = null;
	            
	            if(!BaseTool.isNull(keywords)) {
	            	
	            	keywordlist = keywords.split(" ");
	            	
	            }
	            
	            String accessurl = null;
	            
	            if(!BaseTool.isNull(files)) {
	            	
		            for (int i=0; i<files.length;i++) {
		            	
	            		if(num>=1000) {
	            			
	            			break;
	            			
	            		}
	            		
		            	File file = (File) files[i];
		            	
		            	if(file.isDirectory()) {
		            		
		            		logger.debug("Inspecting folder : " + file.getName());
		            		
		            		List<Product> secondlayerproducts = findFileByKeywords( keywords,  recordsperpage,  start,  file.getPath(),  formats);
		            		
		            		products.addAll(secondlayerproducts);
		            		
		            	}else {
		            		
		            		logger.debug("Inspecting file : " + file.getName());
		            		
		            		boolean has = false;
			            	
			            	if(keywordlist!=null) {
			            		
			            		logger.debug("keyword is not null");
			            		
			            		for(String kw: keywordlist) {
			                		
			                		if (file.getName().contains(kw)
			                				&&LocalFileTool.filterFileSuffix(file.getName(), formats)) {
			                			
			                			has = true;
			                			
			                			break;
			                			
			                		}
			                            
			                	}
			            		
			            	}else {
			            		
			            		logger.debug("keyword is null");
			            		
			            		if(LocalFileTool.filterFileSuffix(file.getName(), formats)) {
			            			
			            			has = true;
			            			
			            		}
			            		
			            	}
			            	
			            	if(has) {
			            		
		            			logger.debug("found file: " + file.getName());
		            			
		            			logger.debug("num=" + num + " start=" + start + " recordsperpage=" + recordsperpage);
			            		
			            		if(num>=start && num<(start+recordsperpage)) {
			            			
			            			logger.debug("Add the file to product list");
			            			
			            			Product p = new Product();
			                		
			                		p.setName(file.getName());
			                		
			                		p.setCached(true);
			                		
			                		p.setIfvirtual("0");
			                		
			                		p.setId(file.getName());
			                		
			                		if(file.getAbsolutePath().startsWith(BaseTool.getCyberConnectorRootPath()+
			                				SysDir.upload_file_path)) {
			                			
			                			accessurl = SysDir.PREFIXURL+"/CyberConnector/"+SysDir.upload_file_path+"/" + file.getName();
			                			
			                		}else  {
			                			
			                			accessurl = file.getAbsolutePath().replaceAll("\\\\", "/");
			                			
			                		}
			                		
			                		p.setAccessurl(accessurl);
			                		
			                		p.setLastupdate(BaseTool.long2Date(file.lastModified()));
			                		
			                		products.add(p);
			                		
			                		logger.debug("Add a new product : " + file.getName());
			            			
			            		}
			            		
			            		num++;
			            		
			            	}
		            		
		            	}
		            	
		            }
		            
	            }else {
	            	
	            	logger.debug("no child files are found in " + folder);
	            	
	            }
	            
			}
            
        } catch (Exception e) {
        	
            e.printStackTrace();
            
        }
		
		return products;
		
	}
	
	/**
	 * Search keywords in a folder
	 * @param keywords
	 * @param recordsperpage
	 * @param pageno
	 * @param folder
	 * @return
	 */
	public static SearchResponse search(String keywords, int recordsperpage, int pageno, String folder, List formats) {	
		
        int start = recordsperpage*pageno;
		
		SearchResponse resp = new SearchResponse();
		
		List products  = findFileByKeywords( keywords,  recordsperpage, start,  folder,  formats);

        resp.setProducts(products);
        
        resp.setProduct_total_number(num);
        
        resp.setStartposition(start);
        
        resp.setRecordsperpage(recordsperpage);
        
        num=0;
        
		return resp;
		
	}
	
	/**
	 * Turn local file to download URL
	 * @param location
	 * @return
	 */
	public static String turnLocalFile2Downloadable(String location) {
		
		String url = null;
		
		if(location.startsWith(SysDir.getCovali_file_path())) {

			//move the file to covali file path
			
			File file = new File(location); 
			
			String newlocation = BaseTool.getCyberConnectorRootPath() + SysDir.upload_file_path + "/" + file.getName();
			
			System.out.println(newlocation);
	        
			File targetfile = new File(newlocation);
			
			try {
				
				FileUtils.copyFile(file, targetfile);
				
				url = "../" + SysDir.upload_file_path + "/" + file.getName();
				
			} catch (IOException e) {
				
				e.printStackTrace();
				
				throw new RuntimeException(e.getLocalizedMessage());
				
			}
	        
		}else{
			
			File f = new File(location);
			
			File folder = new File(BaseTool.getCyberConnectorRootPath());
			
			 if(f.getAbsolutePath().startsWith(folder.getPath())) {
				 
				 url = "../" + location.substring(location.indexOf(BaseTool.getCyberConnectorRootPath()) + BaseTool.getCyberConnectorRootPath().length());
				 
			 }
			
			
			
		}
		
		return url;
		
	}
	
	
	
	/**
	 * Search by keywords, maximum 100 count
	 * @param keywords
	 * @return
	 */
	public static SearchResponse search(String keywords, int recordsperpage, int pageno, List formats) {
		
		logger.debug("upload folder: " + BaseTool.getCyberConnectorRootPath()+SysDir.upload_file_path);
		
		SearchResponse resp1 = LocalFileTool.search(keywords, recordsperpage, pageno,
				BaseTool.getCyberConnectorRootPath()+SysDir.upload_file_path, formats);
		
		if(resp1.getProducts().size()<recordsperpage) {
			
			pageno = pageno - resp1.getProduct_total_number()/recordsperpage;
			
			SearchResponse resp2 = LocalFileTool.search(keywords, recordsperpage, pageno,
					SysDir.getCovali_file_path(), formats);
			
			resp1 = SearchTool.merge(resp1, resp2);
			
		}
		
		return resp1;
		
	}
	
	/**
	 * Get local file list
	 * @param rootlocation
	 * @return
	 */
	public static String getLocalFileList(String rootlocation) {
		
		StringBuffer filelist = new StringBuffer("[") ;
		
		String file_loc = SysDir.getCovali_file_path()+ rootlocation;

		logger.debug(file_loc);
		
		File f = new File(file_loc);
		
		File[] flist = f.listFiles();
		
		for(int i=0; i<flist.length; i++) {
			
			if(i!=0) {
				
				filelist.append(",");
				
			}
			
			if(flist[i].isFile()) {
				
				filelist.append("{\"name\":\"").append(flist[i].getName()).append("\",\"type\":\"file\"}");
				
			}else if(flist[i].isDirectory()) {
				
				filelist.append("{\"name\":\"").append(flist[i].getName()).append("\",\"type\":\"directory\"}");
				
			}
			
		}
		
		filelist.append("]");
		
		return filelist.toString();
		
	}
	
	public static void main(String[] args) {
		
//		logger.debug(LocalFileTool.getLocalFileList("/"));
		
//		int distance = StringUtils.getLevenshteinDistance("sdfds", "werewrqweqwsadfsfdsgewr");
		
//		logger.debug("fuzzy distance: " + distance);
		
		SearchResponse resp = LocalFileTool.search("", 1, 16, null);
//		
		logger.info("total number " + resp.getProduct_total_number() + 
				"\n recordsperpage: " + resp.getRecordsperpage() + 
				"\n start position: " + resp.getStartposition() + 
				"\n records: " + resp.getProducts().get(0).getId());
		
//		String url = LocalFileTool.turnLocalFile2Downloadable("D:/Program Files/apache-tomcat-8.5.31/webapps/CyberConnector/uploadFile/data.nc");
//		
//		System.out.println("cached URL: " + url);
		
	}

}
