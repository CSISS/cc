package edu.gmu.csiss.earthcube.cyberconnector.ssh;

import java.util.concurrent.TimeUnit;

import org.junit.Test;

import edu.gmu.csiss.earthcube.cyberconnector.workers.WorkerManager;

public class WorkflowTest {
	
	@Test
	public void testWorkflow() {
		
		String[] hosts = new String[] {"kps1gf","kps1gf","kps1gf"};
		
		String[] pswds = new String[] {"Chuntian18$","Chuntian18$","Chuntian18$"};
		
		WorkflowTool.execute("5k56d9vcx4ip3tr5pj26", "one", hosts, pswds, null);
		
		try {
//			TimeUnit.SECONDS.sleep(25);
			WorkerManager.waitJoin();
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}
	

}
