package edu.gmu.csiss.earthcube.cyberconnector.ssh;

import java.sql.SQLException;

import edu.gmu.csiss.earthcube.cyberconnector.database.DataBaseOperation;
import edu.gmu.csiss.earthcube.cyberconnector.utils.RandomString;

public class WorkflowTool {
	
	public static String list(String owner) throws SQLException {
		
		StringBuffer json = new StringBuffer("[");
		
		json.append("]");
		
		DataBaseOperation.closeConnection();
		
		return json.toString();
		
	}

	
	public static String add() {
		
		String newid = new RandomString(6).nextString();
		
		StringBuffer sql = new StringBuffer("insert into hosts (id) values ('");
		
		DataBaseOperation.execute(sql.toString());
		
		return newid;
		
	}
	
	public static String del(String hostid) {
		
		StringBuffer sql = new StringBuffer("delete from hosts where id = '").append(hostid).append("';");
		
		DataBaseOperation.execute(sql.toString());
		
		return "done";
		
	}

}
