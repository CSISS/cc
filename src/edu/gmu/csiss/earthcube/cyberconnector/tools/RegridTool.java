package edu.gmu.csiss.earthcube.cyberconnector.tools;

import edu.gmu.csiss.earthcube.cyberconnector.utils.BaseTool;
import edu.gmu.csiss.earthcube.cyberconnector.utils.SysDir;
import org.apache.commons.io.IOUtils;
import org.apache.log4j.Logger;
import org.springframework.web.context.request.WebRequest;

import java.io.File;


public class RegridTool {

    public static String regrid(WebRequest request) {
        Logger logger = Logger.getLogger(RegridTool.class);

        BaseTool t = new BaseTool();

        String pwd = t.getClassPath() + "regrid";
        String script = pwd + "/conda-regrid.sh";
        String pythonScript = pwd + "/regrid.py";

        String paramsJSON = BaseTool.toJSONString(request.getParameterMap());

        String[] args = {"/bin/bash", script, SysDir.anaconda_path, pythonScript, paramsJSON};

        logger.info("regrid parameters: " + paramsJSON);

        ProcessBuilder pb = new ProcessBuilder(args);
        pb.directory(new File(pwd));
        pb.redirectErrorStream(true);

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
}
