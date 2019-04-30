package edu.gmu.csiss.earthcube.cyberconnector.tools;

import edu.gmu.csiss.earthcube.cyberconnector.utils.BaseTool;
import edu.gmu.csiss.earthcube.cyberconnector.utils.SysDir;
import org.apache.commons.io.IOUtils;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class NcoTool {

    public static void appendToLog(File log, String text) {
        try {
            BufferedWriter out = new BufferedWriter(new FileWriter(log, true));
            out.write(text);
            out.close();
        }
        catch (IOException e) {
            System.out.println("IOException occurred" + e);
        }

    }


    public static String execNcra(String command) {
        String dataDirectory = BaseTool.getCyberConnectorRootPath()+SysDir.upload_file_path;
        File log = new File(SysDir.temp_file_path + "/ncra.log");

        command = command.replaceAll("^ncra", SysDir.ncra_path);

//        List<String> args = new ArrayList<String>();
//
//        args.add(SysDir.ncra_path);
//        args.addAll(inputFiles);
//        args.add(outFile);

        String[] args = command.split("\\s+");
        ProcessBuilder pb = new ProcessBuilder(args);
        pb.directory(new File(dataDirectory));
        pb.redirectErrorStream(true);
        appendToLog(log, pb.command().toString() + "\n");


        String output = "";

        try {
            Process p = pb.start();
            output = IOUtils.toString(p.getInputStream());
        } catch (Exception e) {
            e.printStackTrace();
            output = e.toString();
        }


        return output;
    }
}
