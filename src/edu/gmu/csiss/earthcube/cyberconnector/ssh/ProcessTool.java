package edu.gmu.csiss.earthcube.cyberconnector.ssh;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import edu.gmu.csiss.earthcube.cyberconnector.database.DataBaseOperation;
import edu.gmu.csiss.earthcube.cyberconnector.utils.RandomString;

public class ProcessTool {
	
	static Logger logger = LoggerFactory.getLogger(ProcessTool.class);
	
	public static String list(String owner) throws SQLException {
		
		StringBuffer json = new StringBuffer("[");
		
		
		
		json.append("]");
		
		DataBaseOperation.closeConnection();
		
		return json.toString();
	}
	
	public static String detail(String id) {
		
		
		return null;
		
	}

	
	public static String add(String name, String lang, String code, String description) {
		
		String newid = new RandomString(6).nextString();
		
		StringBuffer sql = new StringBuffer("insert into process_type (id, name, code, description) values ('");
		
		sql.append(newid).append("', '");
		
		sql.append(name).append("', '");
		
		sql.append(code).append("', '");
		
		sql.append(description).append("'; ");
		
		logger.info(sql.toString());
		
		DataBaseOperation.execute(sql.toString());
		
		return newid;
		
	}
	
	public static String del(String hostid) {
		
		StringBuffer sql = new StringBuffer("delete from hosts where id = '").append(hostid).append("';");
		
		DataBaseOperation.execute(sql.toString());
		
		return "done";
		
	}
	
}
