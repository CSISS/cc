package edu.gmu.csiss.earthcube.cyberconnector.ssh;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.concurrent.TimeUnit;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import edu.gmu.csiss.earthcube.cyberconnector.database.DataBaseOperation;
import edu.gmu.csiss.earthcube.cyberconnector.utils.RandomString;
import edu.gmu.csiss.earthcube.cyberconnector.web.GeoweaverController;
import net.schmizz.sshj.common.IOUtils;
import net.schmizz.sshj.connection.channel.direct.Session;

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
	
	/**
	 * Get code by Id
	 * @param pid
	 * @return
	 */
	public static String getCodeById(String pid) {
		
		StringBuffer sql = new StringBuffer("select code from process_type where id = '").append(pid).append("';");
		
		ResultSet rs = DataBaseOperation.query(sql.toString());
		
		String code = null;
		
		try {
			
			if(rs.next())
				
				code = rs.getString("code");
			
			DataBaseOperation.closeConnection();
			
		} catch (SQLException e) {
			
			e.printStackTrace();
			
		}
		
		return code;
		
	}
	
	
	
	/**
	 * Execute one process on a host
	 * @param id
	 * process Id
	 * @param hid
	 * host Id
	 * @param pswd
	 * password
	 * @return
	 */
	public static String execute(String id, String hid, String pswd, String token) {
		
		try {

			//get code of the process
			
			String code = getCodeById(id);
			
			System.out.println(code);
			
			//get host ip, port, user name and password
			
			String[] hostdetails = HostTool.getHostDetailsById(hid);
			
			//establish SSH session
			
			if(token == null) {
				
				token = new RandomString(12).nextString();
				
			}
			
			SSHSession session = new SSHSessionImpl();
			
			session.login(hostdetails[1], hostdetails[2], hostdetails[3], pswd, token, false);
			
			GeoweaverController.sshSessionManager.sessionsByToken.put(token, session);
			
			//feed the process code into the SSH session
			
			String executebash = "echo \"" + code.replaceAll("\"", "\\\\\"") + "\" > geoweaver-" + token + ".sh;"+
			
					"chmod +x geoweaver-" + token + ".sh; " + 
					
					"./geoweaver-" + token + ".sh;";
			
			Session.Command cmd = session.getSSHJSession().exec(executebash);
			
			String output = IOUtils.readFully(cmd.getInputStream()).toString();
			
			logger.info(output);
			
			//wait until the process execution is over
			
	        cmd.join(5, TimeUnit.SECONDS);
	        
			cmd.close();
			
			session.logout();
			
			GeoweaverController.sshSessionManager.sessionsByToken.remove(token);
			
			//register the input/output into the database
	        
			
			
		} catch (Exception e) {
			
			e.printStackTrace();
			
		} 
        		
		return token;
		
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
		
//		System.out.println(ProcessTool.detail("di1xlf"));
		
		System.out.println(ProcessTool.execute("degrzr", "kps1gf", "Chuntian18$", null));
		
		
		
	}
	
}
