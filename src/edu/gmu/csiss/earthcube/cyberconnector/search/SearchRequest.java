package edu.gmu.csiss.earthcube.cyberconnector.search;

import java.util.List;

/**
*Class SearchRequest.java
*
*Search product
*
*@author Ziheng Sun
*@time Feb 3, 2017 10:27:58 AM
*Original aim is to support CyberConnector.
*/
public class SearchRequest {
	String searchtext;
	
	boolean name = true;
	boolean desc = false;
	boolean keywords = false;

	boolean collectiongranules = false; //name, desc, keywords
	
	String isvirtual = "1"; //virtual : 1, real : 0
	
	String csw = "1"; //VDP catalog (0), pycsw_unidata (1), Public&Uploaded files (2), BCube (3), CSISS Landsat Catalog (4). 
	
	double west = -180, east = 180, south = -90, north = 90;
	
	boolean distime = false;

	boolean servicewms = false;

	boolean geodab = false;
	
	String begindatetime = "1900-01-01T00:00:00", enddatetime = "2019-06-05T00:00:00"; //begin, end. Default: No restriction.
	
	int start = 0;

	int length = 5;//default = 5

	String formats;
	
	
	public SearchRequest(){
		
	}
	
//	public SearchRequest(String searchtext, boolean name, boolean desc, boolean keywords, String isvirtual, double west,
//			double east, double south, double north, String begindatetime, String enddatetime, int start, int length, String csw) {
//
//		this.searchtext = searchtext;
//		this.name = name;
//		this.desc = desc;
//		this.keywords = keywords;
//		this.isvirtual = isvirtual;
//		this.west = west;
//		this.east = east;
//		this.south = south;
//		this.north = north;
//		this.begindatetime = begindatetime;
//		this.enddatetime = enddatetime;
//		this.start = start;
//		this.length = length;
//		this.csw = csw;
//	}

	
	public boolean isDistime() {
		return distime;
	}

	public void setDistime(boolean distime) {
		this.distime = distime;
	}

	public String getCsw() {
		return csw;
	}

	public void setCsw(String csw) {
		this.csw = csw;
	}

	public String getFormats() {
		return formats;
	}

	public void setFormats(String formats) {
		this.formats = formats;
	}

	public double getWest() {
		return west;
	}

	public void setWest(double west) {
		this.west = west;
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

	public double getNorth() {
		return north;
	}


	public void setNorth(double north) {
		this.north = north;
	}


	public String getBegindatetime() {
		return begindatetime;
	}


	public void setBegindatetime(String begindatetime) {
		this.begindatetime = begindatetime;
	}


	public String getEnddatetime() {
		return enddatetime;
	}


	public void setEnddatetime(String enddatetime) {
		this.enddatetime = enddatetime;
	}


	public String getSearchtext() {
		return searchtext;
	}

	public void setSearchtext(String searchtext) {
		this.searchtext = searchtext;
	}

	public boolean isName() {
		return name;
	}

	public void setName(boolean name) {
		this.name = name;
	}

	public boolean isDesc() {
		return desc;
	}

	public void setDesc(boolean desc) {
		this.desc = desc;
	}

	public boolean isKeywords() {
		return keywords;
	}

	public void setKeywords(boolean keywords) {
		this.keywords = keywords;
	}

	public String getIsvirtual() {
		return isvirtual;
	}

	public void setIsvirtual(String isvirtual) {
		this.isvirtual = isvirtual;
	}

	public boolean isCollectiongranules() {
		return collectiongranules;
	}

	public void setCollectiongranules(boolean collectiongranules) {
		this.collectiongranules = collectiongranules;
	}

	public int getStart() {
		return start;
	}

	public void setStart(int start) {
		this.start = start;
	}

	public int getLength() {
		return length;
	}

	public void setLength(int length) {
		this.length = length;
	}

	public int getPageNumber() {
		return this.getStart()/this.getLength();
	}

	public int getRecordsPerPage() {
		return this.getLength();
	}

	public boolean isServicewms() { return servicewms; }

	public void setServicewms(boolean servicewms) { this.servicewms = servicewms; }

	public boolean isGeodab() { return geodab; }

	public void setGeodab(boolean geodab) { this.geodab = geodab; }


}
