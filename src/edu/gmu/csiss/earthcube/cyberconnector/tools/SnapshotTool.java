package edu.gmu.csiss.earthcube.cyberconnector.tools;

import edu.gmu.csiss.earthcube.cyberconnector.database.DataBaseOperation;
import edu.gmu.csiss.earthcube.cyberconnector.user.UserTool;
import edu.gmu.csiss.earthcube.cyberconnector.utils.Message;
import org.apache.log4j.Logger;
import org.json.simple.JSONValue;
import org.springframework.web.context.request.WebRequest;

import java.sql.ResultSet;
import java.sql.SQLException;

public class SnapshotTool {
    static Logger logger = Logger.getLogger(SnapshotTool.class);

    public static String saveSnapshot(WebRequest request) {
        String identifier = request.getParameter("identifier");
        String name = request.getParameter("name");
        String description = request.getParameter("description");
        String snapshot = request.getParameter("snapshot");

        String sql = "INSERT INTO covali_snapshots (identifier,  name, description, data) VALUES ( '"
                + JSONValue.escape(identifier) +"','"
                + JSONValue.escape(name) + "','"
                + JSONValue.escape(description) + "','"
                + JSONValue.escape(snapshot) +"' );";

        try {
            DataBaseOperation.execute(sql);
            return "{ \"success\": {\"identifier\": \"" + JSONValue.escape(identifier) + "\"}}";
        } catch(Exception e){
            e.printStackTrace();
            logger.error(e.getLocalizedMessage());

            return  "{ \"failure\": {\"message\": \"" + JSONValue.escape(e.getLocalizedMessage()) + "\"}}";
        }
    }

    public static String loadSnapshot(WebRequest request) {
        String identifier = request.getParameter("identifier");

        String sql = "SELECT name, description, data from covali_snapshots where identifier = '"+ JSONValue.escape(identifier) + "';";
        try {
            ResultSet rs = DataBaseOperation.query(sql);
            if (rs.next()) {
                String name = rs.getString("name");
                String description = rs.getString("description");
                String snapshot = rs.getString("data");

                return "{ \"success\": {\"name\": \"" + name
                        + "\", \"description\": \"" + description
                        +"\",\"snapshot\":\"" + snapshot + "\"}}";
            }

            return  "{ \"failure\": {\"message\": \"" + "No snapshot found with identifier '" + JSONValue.escape(identifier) + "'" + "\"}}";
        } catch (SQLException e) {
            e.printStackTrace();
            logger.error(e.getLocalizedMessage());
            return  "{ \"failure\": {\"message\": \"" + JSONValue.escape(e.getLocalizedMessage()) + "\"}}";
        }
    }

}
