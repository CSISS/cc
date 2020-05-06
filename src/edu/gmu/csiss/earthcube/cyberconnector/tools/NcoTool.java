package edu.gmu.csiss.earthcube.cyberconnector.tools;

import edu.gmu.csiss.earthcube.cyberconnector.utils.SysDir;
import org.apache.commons.io.IOUtils;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Path;
import java.util.concurrent.TimeUnit;

import org.json.simple.JSONValue;

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

        Path outputDir = SysDir.workspace_path;
        Path outtputFile = outputDir.resolve(args[args.length - 1]);

        ProcessBuilder pb = new ProcessBuilder(args);
        pb.directory(outputDir.toFile());
        pb.redirectErrorStream(true);
        appendToLog(log, pb.command().toString() + "\n");

        String output = "";

        boolean success = false;

        try {
            Process p = pb.start();
            p.waitFor(120, TimeUnit.SECONDS);
            output = IOUtils.toString(p.getInputStream());
            if(p.exitValue() == 0) {
                success = true;
            }
        } catch (Exception e) {
            e.printStackTrace();
            output = e.getLocalizedMessage();
        }

        if(success) {
            return "{ \"success\": {\"filepath\": \"" + outtputFile.toString() + "\"}}";
        }

        return  "{ \"failure\": {\"message\": \"" + JSONValue.escape(output) + "\"}}";
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
