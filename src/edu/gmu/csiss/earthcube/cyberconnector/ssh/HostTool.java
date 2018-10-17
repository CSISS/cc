package edu.gmu.csiss.earthcube.cyberconnector.ssh;


import java.sql.ResultSet;
import java.sql.SQLException;

import org.apache.log4j.Logger;

import edu.gmu.csiss.earthcube.cyberconnector.database.DataBaseOperation;
import edu.gmu.csiss.earthcube.cyberconnector.utils.RandomString;

public class HostTool {

	static Logger logger = Logger.getLogger(HostTool.class);
	
	/**
	 * 
	 * @return
	 * @throws SQLException 
	 */
	public static String list(String owner) throws SQLException {
		
		StringBuffer json = new StringBuffer("[");
		
		String sql = "select id, name from hosts;";
		
		ResultSet rs = DataBaseOperation.query(sql);
		
		int num = 0;
		
		while(rs.next()) {
			
			String hostid = rs.getString("id");
			
			String hostname = rs.getString("name");
			
			if( num++ != 0) {
				
				json.append(",");
				
			}
			
			json.append("{\"id\":\"").append(hostid).append("\", \"name\": \"").append(hostname).append("\"}");
			
		}
		
		json.append("]");
		
		DataBaseOperation.closeConnection();
		
		return json.toString();
	}
	
	
	/**
	 * Add a new host
	 * @param hostname
	 * @param hostip
	 * @param hostport
	 * @param username
	 * @param owner
	 */
	public static String add(String hostname, String hostip, String hostport, String username, String owner) {
		
		String newhostid = new RandomString(6).nextString();
		
		StringBuffer sql = new StringBuffer("insert into hosts (id, name, ip, port, user, owner) values ('")
				
				.append(newhostid).append("', '")
				
				.append(hostname).append("', '")
				
				.append(hostip).append("', '")
				
				.append(hostport).append("', '")
				
				.append(username).append("', '")
				
				.append(owner).append("'); ");
		
//		logger.info(sql);
		
		DataBaseOperation.execute(sql.toString());
		
		return newhostid;
		
	}
	
	/**
	 * Remove a host from database
	 * @param hostid
	 */
	public static String del(String hostid) {
		
		StringBuffer sql = new StringBuffer("delete from hosts where id = '").append(hostid).append("';");
		
		DataBaseOperation.execute(sql.toString());
		
		return "done";
		
	}
	
	public static void main(String[] args) throws SQLException {
		
		
		System.out.println(HostTool.list(""));;
		
	}
	
}
