package edu.gmu.csiss.earthcube.cyberconnector.tasks;

import java.util.concurrent.TimeUnit;

import org.junit.Test;

import edu.gmu.csiss.earthcube.cyberconnector.workers.WorkerManager;

public class TaskTest {
	
	

	@Test
	public void testTaskManagerThread() throws InterruptedException {
		
		System.out.println("Begin to test Task related classes..");
		
		System.out.println("current worker number : " + WorkerManager.getCurrentWorkerNumber());;
		
		for(int i=0;i<10;i++) {

			TaskManager.addANewTask(new GeoweaverWorkflowTask("geoweaver_" + i));
			
		}
		
		TimeUnit.SECONDS.sleep(15);
		
//		WorkerManager.waitJoin();
		
//		try {
//			w.join();
//		} catch (InterruptedException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
//		if(w.isAlive()){
//			System.out.println("Worker is alive.");
//		}else{
//			System.out.println("Worker is dead.");
//		}
//		int i=0;
//		if(!w.isAlive()&&i<=100){
//			System.out.println("waiting================"+i);
//			i++;
//		}
		
	}
	
}
