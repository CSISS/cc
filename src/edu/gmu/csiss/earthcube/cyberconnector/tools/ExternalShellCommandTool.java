package edu.gmu.csiss.earthcube.cyberconnector.tools;

import edu.gmu.csiss.earthcube.cyberconnector.utils.BaseTool;
import edu.gmu.csiss.earthcube.cyberconnector.utils.SysDir;
import org.apache.commons.io.IOUtils;


import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

import org.apache.log4j.Logger;
import org.json.simple.JSONValue;
import org.springframework.web.context.request.WebRequest;

public class ExternalShellCommandTool {
    static Logger logger = Logger.getLogger(ExternalShellCommandTool.class);

    public static String execNcoCommand(String command) {
        String[] args = command.split("\\s+");

        // remove absolute path for outfile
        String outfile = args[args.length - 1];
        outfile = outfile.replaceAll("^[\\/\\\\]+","");
        args[args.length - 1] = outfile;

        ProcessBuilder pb = new ProcessBuilder(args);
        pb.directory(SysDir.workspace_results_path.toFile());
        pb.redirectErrorStream(true);
        logger.info(pb.command().toString());

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

        return formatJSONResult(success, outfile, output);
    }

    public static String execNcra(String command) {
        command = command.replaceAll("^ncra", SysDir.ncra_path.toString());
        return execNcoCommand(command);
    }

    public static String execNcbo(String command) {
        command = command.replaceAll("^ncbo", SysDir.ncbo_path.toString());
        return execNcoCommand(command);
    }

    public static String ncdump(String filepath) {
        // TODO: add SysDir option
        String ncdumpPath = "/usr/bin/ncdump";

        ProcessBuilder pb = new ProcessBuilder(ncdumpPath, "-c", filepath);
        pb.directory(SysDir.workspace_path.toFile());
        pb.redirectErrorStream(true);
        logger.info(pb.command().toString());

        boolean success = false;
        String output = "";

        try {
            Process p = pb.start();
            p.waitFor(30, TimeUnit.SECONDS);
            output = IOUtils.toString(p.getInputStream());
            if(p.exitValue() == 0) {
                success = true;
            }
        } catch (Exception e) {
            e.printStackTrace();
            output = e.getLocalizedMessage();
        }

        return formatNcdumpJSONResult(success, output);
    }

    public static String regrid(WebRequest request) {
        BaseTool t = new BaseTool();

        String pwd = t.getClassPath() + "regrid";
        String script = pwd + "/conda-regrid.sh";
        String pythonScript = pwd + "/regrid.py";


        String paramsJSON = BaseTool.toJSONString(request.getParameterMap());

        String[] args = {"/bin/bash", script, SysDir.anaconda_path.toString(), pythonScript, paramsJSON};


        ProcessBuilder pb = new ProcessBuilder(args);
        pb.directory(SysDir.workspace_results_path.toFile());
        pb.redirectErrorStream(true);

        logger.info(pb.command().toString());

        String output = "";

        boolean success = false;
        try {
            Process p = pb.start();
            p.waitFor(600, TimeUnit.SECONDS);
            output = IOUtils.toString(p.getInputStream());
            if(p.exitValue() == 0) {
                success = true;
            }
        } catch (Exception e) {
            e.printStackTrace();
            output = e.getLocalizedMessage();
        }

        // outfile will be stored in the SysDir.workspace_results_path PWD
        // filepath is the full absolute path
        String outfile = request.getParameter("outfile");
        return formatJSONResult(success, outfile, output);
    }

     // outfile will always be stored in the SysDir.workspace_results_path PWD
     public static String formatJSONResult(boolean success, String outfile, String message) {
        // filepath is the full absolute path
        String filepath = SysDir.workspace_results_path.resolve(outfile).toAbsolutePath().toString();

        if(success) {
            return "{ \"success\": {\"filepath\": \"" +filepath + "\"}}";
        }

        return  "{ \"failure\": {\"message\": \"" + JSONValue.escape(message) + "\"}}";
    }

    public static String formatNcdumpJSONResult(boolean success, String output) {

        if(success) {
            return "{ \"success\": {\"message\": \"" + JSONValue.escape(output) + "\"}}";
        }

        return  "{ \"failure\": {\"message\": \"" + JSONValue.escape(output) + "\"}}";

//        List<String> varNames = new ArrayList<>();
//
//        for (String  line : output.split(System.lineSeparator())) {
//            if(line.startsWith("\tfloat ") ||
//                    line.startsWith("\tchar ") ||
//                    line.startsWith("\tbyte ") ||
//                    line.startsWith("\tshort ") ||
//                    line.startsWith("\tint ") ||
//                    line.startsWith("\tdouble ")) {
//                String varnname = line.split("\\b")[3];
//                varNames.add("\"" + varnname + "\"");
//            }
//        }
//
//        String variables = String.join(",", varNames);
//        return "{ \"success\": {\"variables\": [" + variables + "]}}";
    }
}
