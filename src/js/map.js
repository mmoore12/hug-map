import omnivore from 'leaflet-omnivore';
import leaflet from 'leaflet';

// Define basemaps
let darkBaseMap = leaflet.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2hlcGhlcmRqZXJyZWQiLCJhIjoiY2ozMGZ0ZnYwMDAyazJ3bnd2djlucXFvaSJ9.W_8W-wU-OqWec30PX9xbvA', {
  maxZoom: 15,
  minZoom: 2
});

let lightBaseMap = leaflet.tileLayer('https://api.mapbox.com/styles/v1/shepherdjerred/cj318us7m00012rqpg0q8fyfl/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2hlcGhlcmRqZXJyZWQiLCJhIjoiY2ozMGZ0ZnYwMDAyazJ3bnd2djlucXFvaSJ9.W_8W-wU-OqWec30PX9xbvA', {
  maxZoom: 15,
  minZoom: 2
});

let satellite = leaflet.tileLayer('https://api.mapbox.com/styles/v1/shepherdjerred/cj318wk5p000e2ro4upj38gfw/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2hlcGhlcmRqZXJyZWQiLCJhIjoiY2ozMGZ0ZnYwMDAyazJ3bnd2djlucXFvaSJ9.W_8W-wU-OqWec30PX9xbvA', {
  maxZoom: 15,
  minZoom: 2
});

// Define overlays
let cyprus = omnivore.geojson('/geojson/cyprus.geojson');
let rome = omnivore.geojson('/geojson/rome.geojson');

// Create the map
let map = leaflet.map('mapid', {
  center: [37.89, 23.99],
  zoom: 3,
  worldCopyJump: true,
  layers: [darkBaseMap, cyprus, rome]
});

// Add tooltips to overlays
cyprus.on('ready', function () {
  cyprus.eachLayer(function (layer) {
    layer.bindPopup(layer.feature.properties.place_name);
  });
})
    .addTo(map);

rome.on('ready', function () {
  rome.eachLayer(function (layer) {
    layer.bindPopup(layer.feature.properties.place_name);
  });
})
    .addTo(map);

// Create layer controls
let baseMaps = {
  'Dark': darkBaseMap,
  'Light': lightBaseMap,
  'Satellite': satellite
};

let overlays = {
  'Cyprus': cyprus,
  'Rome': rome
};

leaflet.control.layers(baseMaps, overlays).addTo(map);

// Fix gray gaps between tiles
// https://github.com/Leaflet/Leaflet/issues/3575

(function () {
  let originalInitTile = leaflet.GridLayer.prototype._initTile;
  leaflet.GridLayer.include({
    _initTile: function (tile) {
      originalInitTile.call(this, tile);
      let tileSize = this.getTileSize();
      tile.style.width = tileSize.x + 1 + 'px';
      tile.style.height = tileSize.y + 1 + 'px';
    }
  });
})();

// Load the images with Webpack
leaflet.Icon.Default.imagePath = '.';

leaflet.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});
