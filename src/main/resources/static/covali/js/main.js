/* eslint googshift/valid-provide-and-module: 0 */

const ol2d = new ol.Map({
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    })
  ],
  controls: [],
  target: 'openlayers1',
  view: new ol.View({
    center: ol.proj.transform([25, 20], 'EPSG:4326', 'EPSG:3857'),
    zoom: 3
  })
});

//const timeElt = document.getElementById('time');
const ol3d = new olcs.OLCesium({
  map: ol2d
});

ol3d.setEnabled(true);


//timeElt.style.display = 'none';
//const toggleTime = function() { // eslint-disable-line no-unused-vars
//  scene.globe.enableLighting = !scene.globe.enableLighting;
//  if (timeElt.style.display == 'none') {
//    timeElt.style.display = 'inline-block';
//  } else {
//    timeElt.style.display = 'none';
//  }
//};

