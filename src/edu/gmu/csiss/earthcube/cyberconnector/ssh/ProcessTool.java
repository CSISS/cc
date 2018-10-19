package edu.gmu.csiss.earthcube.cyberconnector.ssh;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import edu.gmu.csiss.earthcube.cyberconnector.database.DataBaseOperation;
import edu.gmu.csiss.earthcube.cyberconnector.utils.RandomString;

public class ProcessTool {
	
	static Logger logger = LoggerFactory.getLogger(ProcessTool.class);
	
	
	public static String list(String owner) throws SQLException {
		
		StringBuffer json = new StringBuffer("[");
		
		StringBuffer sql = new StringBuffer("select id, name from process_type;");
		
		ResultSet rs = DataBaseOperation.query(sql.toString());
		
		int num = 0;
		
		while(rs.next()) {
			
			String id = rs.getString("id");
			
			String name = rs.getString("name");
			
			if(!StringUtils.isNumeric(id)) {
				
				if(num!=0) {
					
					json.append(",");
					
				}
				
				json.append("{\"id\": \"").append(id).append("\", \"name\": \"").append(name).append("\"}");

				num++;
				
			}
			
			
			
		}
		
		json.append("]");
		
		DataBaseOperation.closeConnection();
		
		return json.toString();
		
	}
	
	public static String detail(String id) {
		
		StringBuffer sql = new StringBuffer("select * from process_type where id = \"").append(id).append("\";");
		
		StringBuffer resp = new StringBuffer();
		
		try {

			ResultSet rs = DataBaseOperation.query(sql.toString());
			
			if(rs.next()) {
				
				resp.append("{ \"id\":\"").append(rs.getString("id")).append("\", ");
				
				resp.append("\"name\":\"").append(rs.getString("name")).append("\", ");
				
				resp.append("\"code\":\"").append(rs.getString("code")).append("\", ");
				
				resp.append("\"description\":\"").append(rs.getString("description")).append("\" }");
				
			}
			
			
			
		} catch (Exception e) {
			
			e.printStackTrace();
			
			throw new RuntimeException(e.getLocalizedMessage());
			
		}
		
		return resp.toString();
		
	}

	/**
	 * Escape the code text
	 * @param code
	 * @return
	 */
	public static String escape(String code) {
		
		String resp = code.replaceAll("/", "-.-").replaceAll("'", "-·-").replaceAll("\"", "-··-").replaceAll("\\n", "->-").replaceAll("\\r", "-!-");
		
		logger.info(resp);
		
		return resp;
		
	}
	
	public static String unescape(String code) {
		
		String resp = code.replaceAll("-.-", "/").replaceAll("-·-", "'").replaceAll("-··-", "\"").replaceAll("->-", "\\n").replaceAll("-!-", "\\r");
		
		logger.info(resp);
		
		return resp;
		
	}
	
	public static String add(String name, String lang, String code, String description) {
		
		String newid = new RandomString(6).nextString();
		
		StringBuffer sql = new StringBuffer("insert into process_type (id, name, code, description) values ('");
		
		sql.append(newid).append("', '");
		
		sql.append(name).append("', ?, '");
		
		sql.append(description).append("'); ");
		
		logger.info(sql.toString());
		
		DataBaseOperation.preexecute(sql.toString(), new String[] {code});
		
		return newid;
		
	}
	
	public static String del(String id) {
		
		StringBuffer sql = new StringBuffer("delete from process_type where id = '").append(id).append("';");
		
		DataBaseOperation.execute(sql.toString());
		
		return "done";
		
	}
	
	public static void main(String[] args) {
		
//		String code = "#!/bin/sh\r\n" + 
//				"echo \"test geoweaver process running\"\r\n" + 
//				"echo \"Good\"\r\n";
//		
//		ProcessTool.escape(code);
//		
//		ProcessTool.unescape(code);
		
//		String code = "#!/bin/sh\r\n" + 
//				"echo \"test geoweaver process running\"\r\n" + 
//				"echo \"Good\"\r\n";
		
//		ProcessTool.add("test21", "shell", code, null);
		
		System.out.println(ProcessTool.detail("di1xlf"));
		
	}
	
}
