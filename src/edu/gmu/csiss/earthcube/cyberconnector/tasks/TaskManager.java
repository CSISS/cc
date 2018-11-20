package edu.gmu.csiss.earthcube.cyberconnector.tasks;

import java.util.ArrayList;
import java.util.List;

import edu.gmu.csiss.earthcube.cyberconnector.utils.SysDir;
import edu.gmu.csiss.earthcube.cyberconnector.workers.WorkerManager;

/**
 *Class TaskManager.java
 *
 *updated on 11/17/2018
 *remove the observer and observable because they are deprecated in the latest JDK (>=9)
 *
 *@author ziheng
 *@time Aug 10, 2015 4:05:28 PM
 *Original aim is to support iGFDS.
 */
public class TaskManager {
	
	private static List<Task> waitinglist;
//	private static List<Task> runninglist;
	private static RunningTaskObserver rto;
	private static WaitingTaskObserver wto;
	
	static{
		waitinglist = new ArrayList();
//		runninglist = new ArrayList();
//		rto = new RunningTaskObserver();
//		wto = new WaitingTaskObserver();
	}
	/**
	 * Add a new task to the waiting list
	 */
	public static void addANewTask(Task t){
//		t.addObserver(wto);
		waitinglist.add(t);
		notifyWaitinglist();
//		t.initialize();
	}
	/**
	 * Execute a task
	 * @param t
	 * @return
	 */
	private static boolean executeATask(Task t){
		boolean is = false;
		if(WorkerManager.getCurrentWorkerNumber()<SysDir.worknumber){
//			t.addObserver(rto);
			WorkerManager.createANewWorker(t);
//			runninglist.add(t);
			is = true;
		}else{
			System.out.println("!!!This function is not called by the method notifyWaitinglist.");
//			t.addObserver(wto);
			waitinglist.add(t);
		}
		return is;
	}
	/**
	 * Notify the waiting list that there is at least an available worker
	 */
	public static synchronized void notifyWaitinglist(){
		System.out.println("notify waiting list to pay attention to the released worker");
		if(waitinglist.size()>0&&WorkerManager.getCurrentWorkerNumber()<SysDir.worknumber){
			Task newtask = waitinglist.get(0);
			waitinglist.remove(newtask);
//			newtask.deleteObserver(wto);
			TaskManager.executeATask(newtask);
		}
	}
	/**
	 * A task is done, being triggered to start doing another task.
	 * @param t
	 * The done task.
	 */
	public static void done(Task t){
//		t.deleteObserver(rto);
//		runninglist.remove(t);
		notifyWaitinglist();
	}
	
	/**
	 * A new task arrives. Notify the task manager to take care of it.
	 */
	public static void arrive(Task t){
		notifyWaitinglist();
	}
	
}
