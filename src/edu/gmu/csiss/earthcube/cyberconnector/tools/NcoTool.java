package edu.gmu.csiss.earthcube.cyberconnector.tools;

import edu.gmu.csiss.earthcube.cyberconnector.utils.SysDir;
import org.apache.commons.io.IOUtils;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

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


    public static String execNcoCommand(String command) {
        File log = SysDir.workspace_tmp_path.resolve("nco.log").toFile();

        String[] args = command.split("\\s+");
        ProcessBuilder pb = new ProcessBuilder(args);
        pb.directory(SysDir.workspace_path.toFile());
        pb.redirectErrorStream(true);
        appendToLog(log, pb.command().toString() + "\n");

        String output = "";

        try {
            Process p = pb.start();
            output = IOUtils.toString(p.getInputStream());
        } catch (Exception e) {
            e.printStackTrace();
            output = "Failed. " + e.getLocalizedMessage();
        }


        return output;
    }

    public static String execNcra(String command) {
        command = command.replaceAll("^ncra", SysDir.ncra_path.toString());
        return execNcoCommand(command);
    }

    public static String execNcbo(String command) {
        command = command.replaceAll("^ncbo", SysDir.ncbo_path.toString());
        return execNcoCommand(command);
    }
}
