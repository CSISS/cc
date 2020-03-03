package edu.gmu.csiss.earthcube.cyberconnector.tools;

import java.io.File;
import java.io.IOException;
import java.util.*;

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
	
	int MAX_RESULTS = 1000;

	
	static Logger logger = Logger.getLogger(LocalFileTool.class);
	
	/**
	 * Check if the file is in supported format
	 * @param filename
	 * @return
	 */
	public static boolean filterFileSuffix(String filename) {
		return filterFileSuffix(filename, Arrays.asList(FORMATS));
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

		if(formats==null||formats.size()==0
				||String.valueOf(formats.get(0)).equals("all")) {
			
			logger.debug("the file suffix is accepted");
			
			return true;
		}


		for(Object f: formats) {
			if(String.valueOf(f).equals(suffix)) {
				return true;
			}
		}

		return false;
	}
	
	/**
	 * Find file by keywords
	 * @param keywords
	 * @param folderPath
	 * @param formats
	 * @return
	 */
	private List<File> findFileByKeywords(String keywords, String folderPath, List formats) {
		
		List<File> results = new ArrayList();
		

		File folder = new File(folderPath);

		logger.debug("Searching folder: " + folderPath);

		if(folder.exists()) {

			File[] files = folder.listFiles();

			String[] keywordlist = null;

			if(!BaseTool.isNull(keywords)) {
				keywordlist = keywords.split(" ");
			}

			if(!BaseTool.isNull(files)) {
				Arrays.sort(files);

				for (int i=0; i < files.length; i++) {
					if(results.size() >= MAX_RESULTS) {
						break;
					}

					File file = (File) files[i];

					if(file.isDirectory()) {

						logger.debug("Inspecting folder : " + file.getName());

						List<File> subfolderResults = findFileByKeywords(keywords, file.getPath(), formats);

						results.addAll(subfolderResults);

					} else {
						logger.debug("Inspecting file : " + file.getName());

						if(keywordlist != null) {
							for(String kw: keywordlist) {
								if (file.getName().contains(kw)
										&&LocalFileTool.filterFileSuffix(file.getName(), formats)) {

									results.add(file);
									break;
								}
							}
						} else {
							if(LocalFileTool.filterFileSuffix(file.getName(), formats)) {
								results.add(file);
							}
						}
					}
				}
			} else {
				logger.debug("no child files are found in " + folder);
			}
		}

		return results;
	}
	

	/**
	 * Search by keywords
	 * @param keywords
	 * @return
	 */
	public SearchResponse search(String keywords, int recordsperpage, int pageno, List formats) {
		
		logger.debug("upload folder: " + BaseTool.getCyberConnectorRootPath()+SysDir.upload_file_path);

		List<File> matchingFiles = findFileByKeywords(keywords, BaseTool.getCyberConnectorRootPath()+SysDir.upload_file_path, formats);

		matchingFiles.addAll(findFileByKeywords(keywords, SysDir.getCovali_file_path(), formats));

		// create a page of products
		List <Product> products = new ArrayList<>();
		int start = recordsperpage * pageno;
		for(int i = start; i < start + recordsperpage && i < matchingFiles.size(); i++) {
			products.add(fileToProduct(matchingFiles.get(i)));
		}

		SearchResponse res = new SearchResponse();
		res.setProducts(products);
		res.setRecordsTotal(matchingFiles.size());
		res.setRecordsFiltered(matchingFiles.size());

		return res;
	}

	private Product fileToProduct(File file)
	{
		logger.debug("Add the file to product list");

		String accessurl;
		Product p = new Product();

		p.setName(file.getName());
		p.setFilepath(file.getAbsolutePath());
		p.updateFileSize();

		p.setCached(true);

		p.setIfvirtual("0");

		String identifier = Product.generateSafeId(file.getName(), file.getAbsolutePath());
		p.setId(identifier);

		if(file.getAbsolutePath().startsWith(BaseTool.getCyberConnectorRootPath()+
				SysDir.upload_file_path)) {

			accessurl = SysDir.PREFIXURL+"/CyberConnector/"+SysDir.upload_file_path+"/" + file.getName();

		} else {
			accessurl = file.getAbsolutePath().replaceAll("\\\\", "/");
		}

		p.setAccessurl(accessurl);

		p.setLastupdate(BaseTool.long2Date(file.lastModified()));

		logger.debug("Add a new product : " + file.getName());

		return p;
	}

	/**
	 * Get local file list
	 * @param location
	 * @return
	 */
	public static String getLocalFileList(String location) {
		
		String covaliFilePath = SysDir.getCovali_file_path().replaceAll("\\\\", "/");
		
		String uploadFilePath = BaseTool.getCyberConnectorRootPath() + SysDir.upload_file_path;
		
		uploadFilePath = uploadFilePath.replaceAll("\\\\", "/");
		
		logger.debug(location);
		
		logger.debug(covaliFilePath);
		
		logger.debug(uploadFilePath);

		File uploadf = new File(uploadFilePath);
		
		if(!uploadf.exists()) uploadf.mkdirs();
		
		if(location.startsWith("/") && !(location.startsWith(covaliFilePath) || location.startsWith(uploadFilePath)))
		{
			location = "";
			logger.debug("the location is not the COVALI and Upload folder path");
		}
		
		logger.debug(location);

		StringBuffer filelist = new StringBuffer("[") ;
		File[] flist;
		if (location == "") {
			flist = new File[2];

			flist[0] = new File(covaliFilePath);
			flist[1] = new File(uploadFilePath);

		}
		else {
			File f = new File(location);
			flist = f.listFiles();
		}

		Arrays.sort(flist);

		if(location != "") {
			filelist.append("\"..\"");
			if(flist.length > 0) {
				filelist.append(",");
			}
		}

		for(int i=0; i<flist.length; i++) {

			if(i!=0) {
				filelist.append(",");
			}

			if(flist[i].isFile()) {
				filelist.append("{\"name\":\"")
						.append(flist[i].getAbsolutePath().replaceAll("\\\\","/"))
						.append("\",\"type\":\"file\"}");
				
			} else if(flist[i].isDirectory()) {
				
				filelist.append("{\"name\":\"")
						.append(flist[i].getAbsolutePath().replaceAll("\\\\","/"))
						.append("\",\"type\":\"directory\"}");
				
			}

		}
		
		filelist.append("]");
		
		logger.debug(filelist);

		return filelist.toString();
		
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


	public static void main(String[] args) {
		
//		logger.debug(LocalFileTool.getLocalFileList("/"));
		
//		int distance = StringUtils.getLevenshteinDistance("sdfds", "werewrqweqwsadfsfdsgewr");
		
//		logger.debug("fuzzy distance: " + distance);
		
//		LocalFileTool tool = new LocalFileTool();
		
//		SearchResponse resp = tool.search("", 1, 16, null);
//		
//		logger.info("total number " + resp.getProduct_total_number() +
//				"\n recordsperpage: " + resp.getRecordsperpage() +
//				"\n start position: " + resp.getStartposition() +
//				"\n records: " + resp.getProducts().get(0).getId());
//
//		String url = LocalFileTool.turnLocalFile2Downloadable("D:/Program Files/apache-tomcat-8.5.31/webapps/CyberConnector/uploadFile/data.nc");
//		
//		System.out.println("cached URL: " + url);
		
	}

}
