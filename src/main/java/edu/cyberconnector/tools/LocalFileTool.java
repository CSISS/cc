package edu.cyberconnector.tools;

import java.io.File;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang3.StringUtils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import edu.cyberconnector.products.Product;
import edu.cyberconnector.search.SearchResponse;
import edu.cyberconnector.search.SearchTool;
import edu.cyberconnector.utils.BaseTool;
import edu.cyberconnector.utils.SysDir;

public class LocalFileTool {
	
	final static public String[] FORMATS = {"tif", "tiff", "grb", "grib", "grib2", "nc", "nc4", "nc3", 
			"tiff", "shp", "h5", "hdf", "hdfeos", "hdf4", "hdf5"}; 
	
	static Logger log = LoggerFactory.getLogger(LocalFileTool.class);
	
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
		
		boolean support = false;
		
		if(formats==null||formats.size()==0
				||String.valueOf(formats.get(0)).equals("all")) {
			
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
	 * Search keywords in a folder
	 * @param keywords
	 * @param recordsperpage
	 * @param pageno
	 * @param folder
	 * @return
	 */
	public static SearchResponse search(String keywords, int recordsperpage, int pageno, String folder, List formats) {	
		
		File folderfile = new File(folder);
		
		log.debug("Searching folder: " + folder);
		
		SearchResponse resp = new SearchResponse();
		
		List<Product> products = new ArrayList();
		
		try {
			
            int num = 0,
            	start = recordsperpage*pageno;
        	
			if(folderfile.exists()) {
				
				boolean recursive = true;

	            Collection files = FileUtils.listFiles(folderfile, null, recursive);
	            
	            String[] keywordlist = null;
	            
	            if(!BaseTool.isNull(keywords)) {
	            	
	            	keywordlist = keywords.split(" ");
	            	
	            }
	            
	            String accessurl = null;
	            
	            for (Iterator iterator = files.iterator(); iterator.hasNext();) {
	            	
	            	File file = (File) iterator.next();
	            	
	            	boolean has = false;
	            	
	            	if(keywordlist!=null) {
	            		
	            		for(String kw: keywordlist) {
	                		
	                		if (file.getName().contains(kw)
	                				&&LocalFileTool.filterFileSuffix(file.getName(), formats)) {
	                			
	                			has = true;
	                			
	                			break;
	                			
	                		}
	                            
	                	}
	            		
	            	}else {
	            		
	            		if(LocalFileTool.filterFileSuffix(file.getName(), formats)) {
	            			
	            			has = true;
	            			
	            		}
	            		
	            	}
	            	
	            	if(has) {
	            		
	            		if(num>=start&&num<(start+recordsperpage)) {
	            			
	            			log.debug("found file: " + file.getName());
	            			
	            			Product p = new Product();
	                		
	                		p.setName(file.getName());
	                		
	                		p.setCached(true);
	                		
	                		p.setIfvirtual("0");
	                		
	                		p.setId(file.getName());
	                		
	                		if(file.getAbsolutePath().startsWith(BaseTool.getCyberConnectorRootPath()+
	                				SysDir.upload_file_path)) {
	                			
	                			accessurl = SysDir.PREFIXURL+"/CyberConnector/"+SysDir.upload_file_path+"/";
	                			
	                		}else  {
	                			
	                			accessurl = file.getAbsolutePath().replaceAll("\\\\", "/");
	                			
	                		}
	                		
	                		p.setAccessurl(accessurl);
	                		
	                		p.setLastupdate(BaseTool.long2Date(file.lastModified()));
	                		
	                		products.add(p);
	            			
	            		}
	            		
	            		num++;
	            		
	            		if(num==1000) {
	            			
	            			break;
	            			
	            		}
	            		
	            	}
	                
	            }
			}
            
            resp.setProducts(products);
            
            resp.setProduct_total_number(num);
            
            resp.setStartposition(start);
            
            resp.setRecordsperpage(recordsperpage);
            
        } catch (Exception e) {
        	
            e.printStackTrace();
            
        }
		
		return resp;
		
	}
	
	/**
	 * Search by keywords, maximum 100 count
	 * @param keywords
	 * @return
	 */
	public static SearchResponse search(String keywords, int recordsperpage, int pageno, List formats) {
		
		log.debug("upload folder: " + BaseTool.getCyberConnectorRootPath()+SysDir.upload_file_path);
		
		SearchResponse resp1 = LocalFileTool.search(keywords, recordsperpage, pageno,
				BaseTool.getCyberConnectorRootPath()+SysDir.upload_file_path, formats);
		
		if(resp1.getProducts().size()<recordsperpage) {
			
			pageno = pageno - resp1.getProduct_total_number()/recordsperpage;
			
			SearchResponse resp2 = LocalFileTool.search(keywords, recordsperpage, pageno,
					SysDir.covali_file_path, formats);
			
			resp1 = (new SearchTool()).merge(resp1, resp2);
			
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
		
		String file_loc = SysDir.covali_file_path+ rootlocation;

		log.debug(file_loc);
		
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
		
//		log.debug(LocalFileTool.getLocalFileList("/"));
		
//		int distance = StringUtils.getLevenshteinDistance("sdfds", "werewrqweqwsadfsfdsgewr");
		
//		log.debug("fuzzy distance: " + distance);
		
		SearchResponse resp = LocalFileTool.search("", 5, 16, null);
		
		log.debug("total number " + resp.getProduct_total_number() + 
				" recordsperpage: " + resp.getRecordsperpage() + 
				" start position: " + resp.getStartposition());
		
	}

}
