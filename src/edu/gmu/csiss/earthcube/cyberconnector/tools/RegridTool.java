package edu.gmu.csiss.earthcube.cyberconnector.tools;

import edu.gmu.csiss.earthcube.cyberconnector.utils.BaseTool;
import edu.gmu.csiss.earthcube.cyberconnector.utils.SysDir;
import org.apache.commons.io.IOUtils;

import java.io.File;


public class RegridTool {

    public static String regrid(String datafile, String gridfile, String outfile) {
        BaseTool t = new BaseTool();

        String pwd = t.getClassPath() + "regrid";
        String script = pwd + "/conda-regrid.sh";

        String[] args = {script, SysDir.anaconda_path, datafile, gridfile, outfile};
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
