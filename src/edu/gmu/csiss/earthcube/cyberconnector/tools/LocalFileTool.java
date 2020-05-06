package edu.gmu.csiss.earthcube.cyberconnector.tools;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.file.FileVisitOption;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.apache.commons.io.FilenameUtils;
import org.apache.log4j.Logger;

import edu.gmu.csiss.earthcube.cyberconnector.products.Product;
import edu.gmu.csiss.earthcube.cyberconnector.search.SearchResponse;
import edu.gmu.csiss.earthcube.cyberconnector.utils.BaseTool;
import edu.gmu.csiss.earthcube.cyberconnector.utils.SysDir;

public class LocalFileTool {
	
	final static public String[] FORMATS = {"tif", "tiff", "grb", "grib", "grib2", "nc", "nc4", "nc3", 
			"tiff", "shp", "h5", "hdf", "hdfeos", "hdf4", "hdf5"}; 
	
//	int MAX_RESULTS = 1000;

	static Logger logger = Logger.getLogger(LocalFileTool.class);

	public static Stream<Path> walkPath(Path path) {
		List<Path> results = new ArrayList<>();

		try {
			return Files.walk(path, FileVisitOption.FOLLOW_LINKS);
		}
		catch (Exception e) {
			logger.error("Failed to list files in " + path);
			logger.error(e);
			return (new ArrayList<Path>().stream());
		}
	}


	public static boolean filterFilenameSuffix(Path path, List<String> formats) {
		if(formats == null || formats.isEmpty() || formats.get(0).equals("all")) {
			return true;
		}

		String suffix = FilenameUtils.getExtension(path.toString()).toLowerCase();

		for(String f: formats) {
			if(f.equals(suffix)) {
				return true;
			}
		}
		return false;
	}


	private static boolean filterFilenameKeywords(Path path, String keywords) {
		if (keywords == null || keywords.isEmpty()) {
			return true;
		}

		String filename = path.getFileName().toString();
		String[] keywordlist = keywords.split(" ");;
		for (String kw : keywordlist) {
			if (filename.contains(kw)) {
				return true;
			}
		}

		return false;
	}

	public SearchResponse search(String keywords, int recordsperpage, int pageno, List<String> formats) {
		List<Path> matchingPaths = Stream.concat(
				walkPath(SysDir.workspace_path),
				walkPath(SysDir.data_path))
				.filter(path -> !Files.isDirectory(path))
				.filter(path -> filterFilenameSuffix(path, formats))
				.filter(path -> filterFilenameKeywords(path, keywords))
				.collect(Collectors.toList());

		// create a page of products
		List <Product> products = new ArrayList<>();
		int start = recordsperpage * pageno;
		for(int i = start; i < start + recordsperpage && i < matchingPaths.size(); i++) {
			products.add(pathToProduct(matchingPaths.get(i)));
		}

		SearchResponse res = new SearchResponse();
		res.setProducts(products);
		res.setRecordsTotal(matchingPaths.size());
		res.setRecordsFiltered(matchingPaths.size());

		return res;
	}

	public static String getJsonFileList(Path location) throws IOException {
		location = location.normalize().toAbsolutePath();

		List<Path> paths = new ArrayList<>();
		List <String> pathJsonElements = new ArrayList<>();

		// list files

		if(location.startsWith(SysDir.workspace_path) || location.startsWith(SysDir.data_path)) {
			paths.addAll(Files.list(location).collect(Collectors.toList()));
		} else {
			paths.add(SysDir.workspace_path);
			paths.add(SysDir.data_path);
		}

		// determine parentPath if it is in covali allowed paths
		Path parentPath = location.getParent();
		if(parentPath != null && (parentPath.startsWith(SysDir.workspace_path) || parentPath.startsWith(SysDir.data_path))) {
			// add parent path
			String e = "{\"name\": \"..\", \"path\":\"" + parentPath.toAbsolutePath() + "\",\"type\":\"directory\"}";
			pathJsonElements.add(e);
		} else if(location.equals(SysDir.workspace_path) || location.equals(SysDir.data_path)) {
			String e = "{\"name\": \"..\", \"path\":\"" +  "\",\"type\":\"directory\"}";
			pathJsonElements.add(e);
		}


		// separate dirs and files to list dirs first
		Stream<Path> directories = paths.stream().filter(p -> Files.isDirectory(p));
		Stream<Path> files = paths.stream().filter(p -> !Files.isDirectory(p));

		directories.forEach(p -> {
			String e = "{\"name\": \"" + p.getFileName() + "\", \"path\":\"" + p.toAbsolutePath() + "\",\"type\":\"directory\"}";
			pathJsonElements.add(e);
		});

		files.forEach(p -> {
			String e = "{\"name\": \"" + p.getFileName() + "\", \"path\":\"" + p.toAbsolutePath() + "\",\"type\":\"file\"}";
			pathJsonElements.add(e);
		});


		return "[" + String.join(",", pathJsonElements) + "]";
	}

	/**
	 * Turn local file to download URL
	 * @param location
	 * @return
	 */
	public static boolean isFileDownloadAllowed(Path location) {
		location = location.normalize().toAbsolutePath();

		if(!Files.isReadable(location)) {
			return false;
		}

		if(!location.startsWith(SysDir.workspace_path) && !location.startsWith(SysDir.data_path)) {
			return false;
		}

		return true;
	}


	private Product pathToProduct(Path path)
	{
		String pathstr = path.toAbsolutePath().toString();//.replaceAll("\\\\","/");
		String namestr = path.getFileName().toString();

		Product p = new Product();

		p.setName(namestr);
		p.setFilepath(pathstr);
		p.updateFileSize();

		p.setIfvirtual("0");

		String identifier = Product.generateSafeId(namestr, pathstr);
		p.setId(identifier);

		p.setDownloadurl("download?path=" + BaseTool.urlEncode(pathstr));

		p.setLastupdate(BaseTool.long2Date(path.toFile().lastModified()));
		return p;
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
