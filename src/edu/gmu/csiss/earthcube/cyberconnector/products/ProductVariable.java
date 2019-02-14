package edu.gmu.csiss.earthcube.cyberconnector.products;

public class ProductVariable {
    String id;
    String type;
    String desc;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public ProductVariable(String id, String type, String desc) {
        this.id = id;
        this.type = type;
        this.desc = desc;
    }

}
