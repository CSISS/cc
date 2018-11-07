package edu.cyberconnector.tools;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import edu.cyberconnector.utils.BaseTool;
import edu.cyberconnector.utils.SysDir;

/**
 *Class GetProductInputDetailsTool.java
 *@author Ziheng Sun
 *@time Oct 30, 2015 5:55:17 PM
 *Original aim is to support CyberConnector.
 */
public class GetProductInputDetailsTool {

	private static Logger log = LoggerFactory.getLogger(GetProductInputDetailsTool.class);
	
	public String getInputDetailsJSON(String productid){
		log.debug("Trying to fetch the input details...");
		String details = BaseTool.POST("$GETPRODUCTINPUTDETAILS$"+productid, SysDir.executionservletaddress);
		log.debug(details);
		return details;
	}
	
}
