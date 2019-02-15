package edu.gmu.csiss.earthcube.cyberconnector.ncwms;

import java.util.concurrent.TimeUnit;

import edu.gmu.csiss.earthcube.cyberconnector.tools.LocalFileTool;
import edu.gmu.csiss.earthcube.cyberconnector.utils.BaseTool;
import edu.gmu.csiss.earthcube.cyberconnector.utils.MyHttpUtils;
import edu.gmu.csiss.earthcube.cyberconnector.utils.SysDir;

public class ncWMSTool {
	
	private static String failure_reason = "";
	
	public static void addDataset(String id, String location) {
		
		String querystr = "id="+id + "&location=" + location;
		
		String resp = MyHttpUtils.doPost_Auth_URLEncode(SysDir.ncWMSURL+"/"+SysDir.ncUsername+"/addDataset", querystr, SysDir.ncUsername, SysDir.ncPassword);
		
		System.out.println("The response is : " + resp);
		
		if(resp.indexOf("is being added")==-1) {
			
			throw new RuntimeException("Fail to add data into ncWMS. " + resp);
			
		}
		
		try {
			
			boolean isready = false;
			
			for(int i=0;i<10;i++) {
				
				TimeUnit.SECONDS.sleep(3);
				
//				Dataset asr15km.anl.2D.200001.mon.nc-qn6 (D:/work/TESTDATA/earthcube/asr15km.anl.2D.200001.mon.nc) is being added.
//				Check the status at http://localhost:8080/ncWMS2/admin/datasetStatus?dataset=asr15km.anl.2D.200001.mon.nc-qn6
				
				if(!checkDatasetStatus(id)) {
					
					continue;
					
				}else {
					
					isready = true;
					
					System.out.println("the dataset is successfully set up");
					
					break;
					
				}
				
			}
			
			if(!isready) {
				
				throw new RuntimeException("fail to read the file into ncWMS");
				
			}
			
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		
		
		
	}
	
	public static String getLocationByWMSLayerId(String id) {
		
		String resp = MyHttpUtils.doGet_BasicAuth(SysDir.ncWMSURL+"/"+SysDir.ncUsername, SysDir.ncUsername, SysDir.ncPassword);
		
		String prefix = "<input type=\"text\" name=\"dataset."+id+".location\" value=\"";
		
		int startidx = resp.indexOf(prefix) + prefix.length();
		
		resp = resp.substring(startidx);
		
		resp = resp.substring(0, resp.indexOf("\""));

		System.out.println(resp);
		
		return resp;
		
	}
	
	public static void removeDataset(String datasetid) {
		
		String querystr = "dataset=" + datasetid;
		
		String resp = MyHttpUtils.doPost_BasicAuth(SysDir.ncWMSURL+"/"+SysDir.ncUsername+"/removeDataset", querystr, SysDir.ncUsername, SysDir.ncPassword);
		
		if(resp.indexOf("has been removed")==-1) {
			
			throw new RuntimeException("Fail to remove data from ncWMS. " + resp);
			
		}
		
	}
	
	public static boolean checkDatasetStatus(String datasetid) {
		
		String querystr = "dataset=" + datasetid;
		
		String target_url = SysDir.ncWMSURL+"/"+SysDir.ncUsername+"/datasetStatus?" + querystr;
		
		System.out.println(target_url);
		
		String resp = MyHttpUtils.doGet_BasicAuth(target_url, SysDir.ncUsername, SysDir.ncPassword);
		
		boolean issuccess = false;
		
		resp = resp.substring(resp.indexOf("State: ") + "State: ".length());
		
		resp = resp.substring(0, resp.indexOf("</b>")).trim();
		
		if("READY".equals(resp)) {
			
			issuccess = true;
			
		}
		
		return issuccess;
	}
	
	public static void main(String[] args) {
		
//		ncWMSTool.addDataset("id=hmgrid");
		
//		ncWMSTool.addDataset("id=hmgrid&location=D:/work/TESTDATA/earthcube/archv.2009_092_00_3z.nc");
		
//		String location = "http://localhost:8080/CyberConnector/uploadFile/archv.2009_099_00_3z.nc";
//		
//		if(location.startsWith(SysDir.PREFIXURL)) {
//			
//			location = BaseTool.getCyberConnectorRootPath() + "/" + location.replaceAll(SysDir.PREFIXURL+"/CyberConnector/","");
//			
//			System.out.println("the new location is : " + location);
//			
//		}
		
		System.out.println(ncWMSTool.checkDatasetStatus("asr15km-anl-2D-20000103-nc-1s7-tvi"));;
		
//		String location = ncWMSTool.getLocationByWMSLayerId("FC82j");
//		String url = LocalFileTool.turnLocalFile2Downloadable(location);
		
//		System.out.println(url);
		
	}
	
}
