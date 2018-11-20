package edu.gmu.csiss.earthcube.cyberconnector.tasks;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import org.apache.log4j.Logger;
import org.json.simple.JSONArray;
import org.json.simple.parser.JSONParser;

import edu.gmu.csiss.earthcube.cyberconnector.ssh.HostTool;
import edu.gmu.csiss.earthcube.cyberconnector.ssh.ProcessTool;
import edu.gmu.csiss.earthcube.cyberconnector.ssh.SSHSession;
import edu.gmu.csiss.earthcube.cyberconnector.ssh.SSHSessionImpl;
import edu.gmu.csiss.earthcube.cyberconnector.ssh.Workflow;
import edu.gmu.csiss.earthcube.cyberconnector.ssh.WorkflowTool;
import edu.gmu.csiss.earthcube.cyberconnector.utils.RandomString;
import edu.gmu.csiss.earthcube.cyberconnector.web.GeoweaverController;

public class GeoweaverWorkflowTask extends Task {
	
	Logger log = Logger.getLogger(this.getClass());
	
	String name;
	
	String wid, mode;
	
	String[] hosts;
	
	String[] pswds;
	
	String token;
	
	Map pid2hid = new HashMap();
	
	public GeoweaverWorkflowTask(String name) {
		
		this.name = name;
		
	}
	
	@Override
	public String getName() {
		return name;
	}



	public void setName(String name) {
		this.name = name;
	}



	@Override
	public void initialize() {
//		setChanged();
//		notifyObservers(this);
	}
	
	public void initialize(String wid, String mode, String[] hosts, String[] pswds, String token) {
		
		this.wid = wid;
		
		this.mode = mode;
		
		this.hosts = hosts;
		
		this.pswds = pswds;
		
		this.token = token;
		
	}

	@Override
	public void execute() {
		// TODO Auto-generated method stub
		
//		hid = new RandomString(15).nextString();
		
		System.out.println(" + + + start Geoweaver workflow " + wid );
		
		try {
			
			//get the nodes and edges of the workflows
			
			Workflow w = WorkflowTool.getById(wid);
			
			//execute the process in a while loop - for now. Improve this in future
			
			int executed_process = 0;
			
			JSONParser parser = new JSONParser();
			
			JSONArray edges = (JSONArray)parser.parse(w.getEdges());
			
			JSONArray nodes = (JSONArray)parser.parse(w.getNodes());
			
			boolean[] flags = new boolean[nodes.size()];
			
			for(int i=0;i<flags.length; i++ ) {
				
				flags [i] = false;
				
			}
			
			Map<String, List> node2condition = WorkflowTool.getNodeConditionMap(nodes, edges);
			
			while(executed_process < w.getNodes().length()) {
				
				//find next process to execute - the id has two parts: process type id - process object id
				
				String[] idnum = WorkflowTool.findNextProcess(node2condition, flags, nodes);
				
				String nextid = idnum[0];
				
				System.out.print("this round is : " + nextid);
				
				String processTypeId = nextid.split("-")[0];
				
				int num = Integer.parseInt(idnum[1]);
				
				String hid = hosts[num];
				
				String password = pswds[num];
				
				//nodes
//				[{"title":"download-landsat","id":"nhi96d-7VZhh","x":119,"y":279},{"title":"filter_cloud","id":"rh1u8q-4sCmg","x":286,"y":148},{"title":"filter_shadow","id":"rpnhlg-JZfyQ","x":455,"y":282},{"title":"match_cdl_landsat","id":"omop8l-1p5x1","x":624,"y":152}]
				
				//edges
//				[{"source":{"title":"sleep5s","id":"ac4724-jL0Ep","x":342.67081451416016,"y":268.8715720176697},"target":{"title":"testbash","id":"199vsg-Xr6FZ","x":465.2892303466797,"y":41.6651611328125}},{"source":{"title":"testbash","id":"199vsg-oAq2d","x":-7.481706619262695,"y":180.70700073242188},"target":{"title":"sleep5s","id":"ac4724-jL0Ep","x":342.67081451416016,"y":268.8715720176697}}]
				
				//get code of the process
				
				String code = ProcessTool.getCodeById(processTypeId);
				
				System.out.println("Ready to run process : " + processTypeId);
				
				System.out.println(code);
				
				//get host ip, port, user name and password
				
				String[] hostdetails = HostTool.getHostDetailsById(hid);
				
				//establish SSH session and generate a token for it
				
				if(token == null) {
					
					token = new RandomString(12).nextString();
					
				}
				
				//if the mode is one, reuse the same SSHSession object for all processes. 
				//if the mode is different, create new SSHSession object for each process
//				
				SSHSession session = new SSHSessionImpl();
//				
				session.login(hostdetails[1], hostdetails[2], hostdetails[3], password, token, false);
//				
				GeoweaverController.sshSessionManager.sessionsByToken.put(token, session);
//				
				session.runBash(code, nextid);  //every task only has no more than one active SSH session at a time
//				
				String historyid = session.getHistory_id();
				
				pid2hid.put(nextid, historyid); //save the mapping between process id and history id
				
				WorkflowTool.updateNodeStatus(nextid, flags, nodes, true); //once the process is finished, updated its status
				
				executed_process++;
				
			}
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

	@Override
	public void responseCallback() {
		// TODO Auto-generated method stub
		//notify the task list observer
//		setChanged();
//		notifyObservers(this);
	}

	@Override
	public void failureCallback(Exception e) {
		// TODO Auto-generated method stub
		//notify the task list observer
//		setChanged();
//		notifyObservers(this);

	}

}
