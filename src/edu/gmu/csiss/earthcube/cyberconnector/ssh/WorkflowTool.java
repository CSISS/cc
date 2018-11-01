package edu.gmu.csiss.earthcube.cyberconnector.ssh;

import java.sql.ResultSet;
import java.sql.SQLException;

import edu.gmu.csiss.earthcube.cyberconnector.database.DataBaseOperation;
import edu.gmu.csiss.earthcube.cyberconnector.utils.RandomString;

public class WorkflowTool {
	
	public static String list(String owner){
		
		StringBuffer json = new StringBuffer("[");
		
		try {
			
			ResultSet rs = DataBaseOperation.query("select * from abstract_model where length(identifier) < 30; ");
			
			int num = 0;
			
			while(rs.next()) {
				
				if(num!=0) {
					
					json.append(",");
					
				}
				
				json.append("{ \"id\": \"")
					.append(rs.getString("identifier"))
					.append("\", \"name\": \"")
					.append(rs.getString("name"))
					.append("\" }");
				
				num++;
				
			}
			
			json.append("]");
			
		} catch (SQLException e) {

			e.printStackTrace();
			
		}finally {

			DataBaseOperation.closeConnection();
			
		}
		
		return json.toString();
		
	}

	public static String detail(String id) {
		
		StringBuffer sql = new StringBuffer("select * from abstract_model where identifier = \"").append(id).append("\";");
		
		StringBuffer resp = new StringBuffer();
		
		try {
			
			ResultSet rs = DataBaseOperation.query(sql.toString());
			
			if(rs.next()) {
				
				resp.append("{ \"name\":\"");
				
				resp.append(rs.getString("name")).append("\", \"id\": \"");
				
				resp.append(id).append("\", \"nodes\":");
				
				resp.append(rs.getString("process_connection")).append(", \"edges\":");
				
				resp.append(rs.getString("param_connection")).append(" }");
				
			}
			
		} catch (Exception e) {
			
			e.printStackTrace();
			
			throw new RuntimeException(e.getLocalizedMessage());
			
		}finally {
			
			DataBaseOperation.closeConnection();
			
		}
		
		return resp.toString();
		
	}

	public static String execute(String id) {
		
		
		
		return "";
		
	}

	
	public static String add(String name, String nodes, String edges) {
		
		String newid = new RandomString(20).nextString();
		
		StringBuffer sql = new StringBuffer("insert into abstract_model (identifier, name, namespace, process_connection, param_connection) values (\"");
		
		sql.append(newid).append("\", \"");
		
		sql.append(name).append("\", \"http://geoweaver.csiss.gmu.edu/workflow/");
		
		sql.append(name).append("\", ?, ? )");
		
		DataBaseOperation.preexecute(sql.toString(), new String[] {nodes, edges});
		
		return newid;
		
	}
	
	public static String del(String workflowid) {
		
		StringBuffer sql = new StringBuffer("delete from abstract_model where identifier = '").append(workflowid).append("';");
		
		DataBaseOperation.execute(sql.toString());
		
		return "done";
		
	}

	/**
	 * show the history of every execution of the workflow
	 * @param string
	 * @return
	 */
	public static String all_history(String workflow_id) {
		
		
		return null;
		
	}

	public static String one_history(String string) {

		return null;
		
	}

}
