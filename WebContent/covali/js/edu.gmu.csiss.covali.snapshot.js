edu.gmu.csiss.covali.snapshot = {
    makeid: function() {
        var text = "";
        var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 8; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    },

    serializeView: function() {
        var map =  edu.gmu.csiss.gpkg.cmapi.openlayers.getMap("openlayers1");
        var v = map.getView();

        var viewState = {
            zoom: v.getZoom(),
            center: v.getCenter(),
            projection: $("#projectionselector option:selected").val()
        }

        return viewState;
    },

    deserializeView: function(viewState) {
        var map =  edu.gmu.csiss.gpkg.cmapi.openlayers.getMap("openlayers1");
        var v = map.getView();

        $("#projectionselector").val(viewState.projection).change();

        setTimeout(function() {
            // wait for projection to update
            map.getView().setZoom(viewState.zoom);
            map.getView().setCenter(viewState.center);
        }, 300);
    },

    serializeLayers: function() {
    },

    deserializeLayers: function(layerState) {
    },

    serializeSnapshot: function() {
        var snapshot = {};
        snapshot.view = this.serializeView();
        snapshot.layers = this.serializeLayers();

        return snapshot;
    },

    deserializeSnapshot: function(snapshot) {
        this.deserializeView(snapshot.view);
        this.deserializeLayers(snapshot.layers);
    },

    saveSnapshot: function() {
        var identifier = this.makeid();
        var name = "Name " + identifier;
        var description = "Description " + identifier;
        var snapshot = this.serializeSnapshot();


        $.ajax({
            // contentType: "application/json", //this is by default
            type: "POST",
            url: "../web/snapshot/save",
            data: {
                identifier: identifier,
                name: name,
                description: description,
                snapshot: JSON.stringify(snapshot)
            }
        }).success(function(data) {
            if(data.success) {
                console.log(identifier);
                alert("Saved snapshot " + identifier);
            } else {
                alert(data.failure.message);
            }
        }).error(function (error) {
            alert("Failed to save snapshot: " + error);
            console.log(error);
        });

        return identifier;
    },

    loadSnapshot: function (identifier) {
        $.ajax({
            // contentType: "application/json", // this is by default
            type: "GET",
            url: "../web/snapshot/load",
            data: {identifier: identifier}
        }).success(function(data) {
            if(data.success) {
                console.log(data.success);
                edu.gmu.csiss.covali.snapshot.deserializeSnapshot(JSON.parse(data.success.snapshot));
            } else {
                alert(data.failure.message);
            }
        }).error(function (error) {
            alert("Failed to save snapshot: " + error);
            console.log(error);
        });
    }
}