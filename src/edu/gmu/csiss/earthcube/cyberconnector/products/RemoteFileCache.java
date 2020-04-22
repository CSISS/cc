package edu.gmu.csiss.earthcube.cyberconnector.products;
import java.nio.file.Files;
import java.nio.file.Path;

import edu.gmu.csiss.earthcube.cyberconnector.utils.BaseTool;
import edu.gmu.csiss.earthcube.cyberconnector.utils.MyHttpUtils;
import edu.gmu.csiss.earthcube.cyberconnector.utils.SysDir;
import org.apache.log4j.Logger;


public class RemoteFileCache {
    private Logger logger = Logger.getLogger(RemoteFileCache.class);

    private String remoteUrl;
    private Path cachedFilePath;


    public String getCachedUrl() {
        return SysDir.PREFIXURL + "/CyberConnector/web/download?path=" + BaseTool.urlEncode(cachedFilePath.toString());
    }

    public Path getCachedFilePath() {
        return cachedFilePath;
    }

    public RemoteFileCache(String remoteUrl) {
        this.remoteUrl = remoteUrl;

        String cachedFileName = remoteUrl.replaceAll(":","-").replaceAll("/", "-").replaceAll("\\\\", "-").replaceAll(" ", "");
        this.cachedFilePath = SysDir.workspace_cache_path.resolve(cachedFileName).toAbsolutePath();
    }

    public boolean cacheExists() {
        return cachedFilePath.toFile().exists();
    }

    public void doCache() throws Exception {
        logger.info("Cache " + remoteUrl + " to " + cachedFilePath + " as " + getCachedUrl());

        Path cachedTmpPath = SysDir.workspace_tmp_path.resolve(cachedFilePath.getFileName());

        if(remoteUrl.startsWith("https://rda.ucar.edu/data")) {
            String formData = "remember=on&do=login&url=%2F";
            formData = formData + "&email=" + SysDir.ucar_rda_username;
            formData = formData + "&passwd=" + SysDir.ucar_rda_password;

            MyHttpUtils.downloadFileSessionAuth("https://rda.ucar.edu/cgi-bin/login", formData, remoteUrl, cachedTmpPath.toString());
        } else {
            MyHttpUtils.downloadFile(remoteUrl, cachedTmpPath.toString());
        }

        Files.move(cachedTmpPath, cachedFilePath);
    }


}
