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


    serializeMapLayers: function(side) {
        var olmap = edu.gmu.csiss.covali.map.getMapBySide(side);

        var layers =  olmap.getLayers().getArray();

        var sortablelayers = layers.slice(2);

        sortablelayers = sortablelayers.sort(function(l1, l2) {
            if(l1.getZIndex() < l2.getZIndex()) {
                return -1;
            }
            return 1;
        });

        return sortablelayers.map(function(olayer) {
            var layerState = {}
            layerState.creationArguments = olayer.get('creationArguments');
            layerState.opacity = olayer.getOpacity();
            layerState.params = olayer.getSource().getParams();

            return layerState;
        });
    },

    deserializeMapLayer: function(side, layerState) {
        var args = Object.values(layerState.creationArguments)
        edu.gmu.csiss.covali.map.addWMSLayer(...args);

        // wait for layer to initialize (load metadata, run map events)
        setTimeout(function() {
            var olayer = edu.gmu.csiss.covali.map.getOLLayerByName(side, args[2]);
            olayer.setOpacity(layerState.opacity);
            olayer.getSource().updateParams(layerState.params);
        }, 300);
    },

    serializeLayers: function() {
        var layerStates = {}

        layerStates.left = this.serializeMapLayers('left');
        layerStates.right = this.serializeMapLayers('right');

        return layerStates;
    },

    deserializeLayers: function(layerStates) {
        layerStates.left.forEach(function(layerState) {
            edu.gmu.csiss.covali.snapshot.deserializeMapLayer('left', layerState);
        });

        layerStates.right.forEach(function(layerState) {
            edu.gmu.csiss.covali.snapshot.deserializeMapLayer('right', layerState);
        });

        setTimeout(function() {
            edu.gmu.csiss.covali.legend.refresh('left');
            edu.gmu.csiss.covali.legend.refresh('right');
        }, 500);

    },

    serializeSnapshot: function() {
        var snapshot = {};
        snapshot.view = this.serializeView();
        snapshot.layers = this.serializeLayers();

        return snapshot;
    },

    deserializeSnapshot: function(snapshot) {
        this.deserializeView(snapshot.view);

        edu.gmu.csiss.covali.wms.loadLocal();
        setTimeout(function() {
            edu.gmu.csiss.covali.menu.closeDialog('edu.gmu.csiss.covali.wms.jsframe.LayerSelector');
            edu.gmu.csiss.covali.snapshot.deserializeLayers(snapshot.layers);
        }, 300);

    },

    saveSnapshot: function() {
        var identifier = this.makeid();
        var name = "Name " + identifier;
        var description = "Description " + identifier;
        var snapshot = this.serializeSnapshot();

        console.log('Saving snapshot ' + identifier + ':');
        console.log(snapshot);

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
                // alert("Saved snapshot " + identifier);
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
                console.log("Loaded snapshot " + identifier);
                console.log(data.success);
                edu.gmu.csiss.covali.snapshot.deserializeSnapshot(JSON.parse(data.success.snapshot));
            } else {
                alert(data.failure.message);
            }
        }).error(function (error) {
            alert("Failed to load snapshot: " + error);
            console.log(error);
        });
    },

    loadFromUrl: function() {
        var params = new URLSearchParams(window.location.href.split('?')[1])
        var snapshotId = params.get('snapshot');

        if(snapshotId) {
            this.loadSnapshot(snapshotId);
        }
        history.replaceState(null, '', 'covali');

    }
}