package edu.gmu.csiss.earthcube.cyberconnector.products;

import org.apache.commons.codec.digest.DigestUtils;

import java.io.File;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.List;

/**
*Class Product.java
*@author Ziheng Sun
*@time Feb 2, 2017 5:48:43 PM
*Original aim is to support CyberConnector.
*/
public class Product {

	String id;
	String abbr;
	String desc;
	String keywords;
	String name;
	String srs;
	String begintime;
	String endtime;
	String ifvirtual;
	String isspatial;
	String modelid;
	String format;
	String accessurl;
	String parentmodel;
	String ontology;
	String lastupdate;
	String userid;
	String iscollection;
	String filepath;
	String filesize;
	String accesslink;
	String accessinfo;

	String title;

	int likes;

	boolean cached;

	double east, south, west, north;

	List<Input> inputlist;
	List <ProductVariable> variables;

	public Product(){
		this.variables = new ArrayList<ProductVariable>();
		this.inputlist = new ArrayList<Input>(); }
	
	public String getTitle() { return title; }
	public void setTitle(String title) { this.title = title; }

	public String getIscollection() {return iscollection; }
	public void setIscollection(String iscollection) { this.iscollection = iscollection; }

	public boolean isCached() {
		return new ProductCache(id, accessurl).cacheExists() || this.cached;
	}

	public void setCached(boolean cached) {
		this.cached = cached;
	}

	public int getLikes() {
		return likes;
	}
	
	public void setLikes(int likes) {
		this.likes = likes;
	}
	
	public List<Input> getInputlist() {
		return inputlist;
	}
	
	public void setInputlist(List<Input> inputlist) {
		this.inputlist = inputlist;
	}
	
	public String getIsspatial() {
		return isspatial;
	}

	public void setIsspatial(String isspatial) {
		this.isspatial = isspatial;
	}

	public String getParentmodel() {
		return parentmodel;
	}

	public void setParentmodel(String parentmodel) {
		this.parentmodel = parentmodel;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getAbbr() {
		return abbr;
	}

	public void setAbbr(String abbr) {
		this.abbr = abbr;
	}

	public String getDesc() {
		return desc;
	}

	public void setDesc(String desc) {
		this.desc = desc;
	}

	public String getKeywords() {
		return keywords;
	}

	public void setKeywords(String keywords) {
		this.keywords = keywords;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getSrs() {
		return srs;
	}

	public void setSrs(String srs) {
		this.srs = srs;
	}

	public String getBegintime() {
		return begintime;
	}

	public void setBegintime(String begintime) {
		this.begintime = begintime;
	}

	public String getEndtime() {
		return endtime;
	}

	public void setEndtime(String endtime) {
		this.endtime = endtime;
	}

	public String getIfvirtual() {
		return ifvirtual;
	}

	public void setIfvirtual(String ifvirtual) {
		this.ifvirtual = ifvirtual;
	}

	public String getModelid() {
		return modelid;
	}

	public void setModelid(String modelid) {
		this.modelid = modelid;
	}

	public String getFormat() {
		return format;
	}

	public void setFormat(String format) {
		this.format = format;
	}

	public String getAccessurl() {
		return accessurl;
	}

	public void setAccessurl(String accessurl) {
		this.accessurl = accessurl;
	}

	public String getOntology() {
		return ontology;
	}

	public void setOntology(String ontology) {
		this.ontology = ontology;
	}

	public String getLastupdate() {
		return lastupdate;
	}

	public void setLastupdate(String lastupdate) {
		this.lastupdate = lastupdate;
	}

	public String getUserid() {
		return userid;
	}

	public void setUserid(String userid) {
		this.userid = userid;
	}

	public double getEast() {
		return east;
	}

	public void setEast(double east) {
		this.east = east;
	}

	public double getSouth() {
		return south;
	}

	public void setSouth(double south) {
		this.south = south;
	}

	public double getWest() {
		return west;
	}

	public void setWest(double west) {
		this.west = west;
	}

	public double getNorth() {
		return north;
	}

	public void setNorth(double north) {
		this.north = north;
	}

	public List<ProductVariable> getVariables() {
		return variables;
	}

	public void setVariables(List<ProductVariable> variables) {
		this.variables = variables;
	}

	public void addVariable(ProductVariable pv) {
		this.variables.add(pv);
	}

	public void setFilepath(String filepath) {
		this.filepath = filepath;
	}

	public void setFilesize(String filesize) {
		this.filesize = filesize;
	}

	public String getFilepath() {
		return filepath;
	}

	public String getFilesize() {
		return filesize;
	}

	public String getAccesslink() {return accesslink; }

	public void setAccesslink(String accesslink) { this.accesslink = accesslink; }

	public String getAccessinfo() { return accessinfo; }

	public void setAccessinfo(String accessinfo) { this.accessinfo = accessinfo; }

	public void updateFileSize() {
		File file = new File(filepath);
		if(file.exists())
			setFilesize(readableFileSize(file.length()));
	}

	// From: https://stackoverflow.com/questions/3263892/format-file-size-as-mb-gb-etc
	public static String readableFileSize(long size) {
		if(size <= 0) return "0";
		final String[] units = new String[] { "B", "kB", "MB", "GB", "TB" };
		int digitGroups = (int) (Math.log10(size)/Math.log10(1024));
		return new DecimalFormat("#,##0.#").format(size/Math.pow(1024, digitGroups)) + " " + units[digitGroups];
	}


	public static String generateSafeId(String name, String uniqueInfo) {
		String safeName = name
				.replaceAll("\\W", "-");

		String uniqueInfoMd5 = DigestUtils.md5Hex(uniqueInfo).substring(0, 8);

		return safeName + "-" + uniqueInfoMd5;
	}

	//	CREATE TABLE `products` (
//			`identifier` VARCHAR(50) NOT NULL DEFAULT '',
//			`abbreviation` VARCHAR(50) NULL DEFAULT NULL,
//			`description` TINYTEXT NULL,
//			`keywords` TINYTEXT NULL,
//			`name` VARCHAR(100) NOT NULL,
//			`east` DOUBLE(20,6) NULL DEFAULT NULL,
//			`south` DOUBLE(20,6) NULL DEFAULT NULL,
//			`west` DOUBLE(20,6) NULL DEFAULT NULL,
//			`north` DOUBLE(20,6) NULL DEFAULT NULL,
//			`srs` VARCHAR(50) NULL DEFAULT 'EPSG:4326',
//			`begintime` DATE NULL DEFAULT NULL,
//			`endtime` DATE NULL DEFAULT NULL,
//			`ifvirtual` CHAR(1) NOT NULL DEFAULT '0',
//			`parent_abstract_model` VARCHAR(50) NULL DEFAULT NULL,
//			`dataFormat` VARCHAR(50) NULL DEFAULT NULL,
//			`accessURL` TINYTEXT NULL,
//			`ontology_reference` TINYTEXT NULL,
//			`lastUpdateDate` DATE NULL DEFAULT NULL,
//			`userid` INT(10) NULL DEFAULT NULL,
//			PRIMARY KEY (`identifier`),
//			UNIQUE INDEX `identifier` (`identifier`),
//			UNIQUE INDEX `name` (`name`),
//			INDEX `ifvirtual` (`ifvirtual`),
//			INDEX `parent_abstract_model` (`parent_abstract_model`)
//		)
//		COMMENT='This table archives the metadata of VDPs.'
//		COLLATE='latin1_swedish_ci'
//		ENGINE=InnoDB;

	
}
