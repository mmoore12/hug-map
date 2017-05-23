import omnivore from 'leaflet-omnivore';
import leaflet from 'leaflet';

let layers = [];

let basemaps = [
  {
    name: 'Streets',
    url: 'https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2hlcGhlcmRqZXJyZWQiLCJhIjoiY2ozMGZ0ZnYwMDAyazJ3bnd2djlucXFvaSJ9.W_8W-wU-OqWec30PX9xbvA'
  },
  {
    name: 'Outdoors',
    url: 'https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2hlcGhlcmRqZXJyZWQiLCJhIjoiY2ozMGZ0ZnYwMDAyazJ3bnd2djlucXFvaSJ9.W_8W-wU-OqWec30PX9xbvA'
  },
  {
    name: 'Dark',
    url: 'https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2hlcGhlcmRqZXJyZWQiLCJhIjoiY2ozMGZ0ZnYwMDAyazJ3bnd2djlucXFvaSJ9.W_8W-wU-OqWec30PX9xbvA'
  },
  {
    name: 'Light',
    url: 'https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2hlcGhlcmRqZXJyZWQiLCJhIjoiY2ozMGZ0ZnYwMDAyazJ3bnd2djlucXFvaSJ9.W_8W-wU-OqWec30PX9xbvA'
  },
  {
    name: 'Satellite',
    url: 'https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2hlcGhlcmRqZXJyZWQiLCJhIjoiY2ozMGZ0ZnYwMDAyazJ3bnd2djlucXFvaSJ9.W_8W-wU-OqWec30PX9xbvA'
  },
  {
    name: 'Satellite Streets',
    url: 'https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2hlcGhlcmRqZXJyZWQiLCJhIjoiY2ozMGZ0ZnYwMDAyazJ3bnd2djlucXFvaSJ9.W_8W-wU-OqWec30PX9xbvA'
  },
  {
    name: 'Traffic day',
    url: 'https://api.mapbox.com/styles/v1/mapbox/traffic-day-v2/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2hlcGhlcmRqZXJyZWQiLCJhIjoiY2ozMGZ0ZnYwMDAyazJ3bnd2djlucXFvaSJ9.W_8W-wU-OqWec30PX9xbvA'
  },
  {
    name: 'Traffic night',
    url: 'https://api.mapbox.com/styles/v1/mapbox/traffic-night-v2/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2hlcGhlcmRqZXJyZWQiLCJhIjoiY2ozMGZ0ZnYwMDAyazJ3bnd2djlucXFvaSJ9.W_8W-wU-OqWec30PX9xbvA'
  }
];

basemaps.forEach(function (map) {
  map['layer'] = leaflet.tileLayer(map['url'], {
    maxZoom: 15,
    minZoom: 2
  });
  layers.add(map['layer']);
});

let overlays = [
  {
    name: 'Cyprus',
    path: '/geojson/cyprus.geojson'
  },
  {
    name: 'Rome',
    path: '/geojson/rome.geojson'
  }
];

overlays.forEach(function (overlay) {
  overlay['layer'] = omnivore.geojson(overlay['path']);
  layers.add(map['layer']);
});

// Create the map
let map = leaflet.map('mapid', {
  center: [37.89, 23.99],
  zoom: 3,
  worldCopyJump: true,
  layers: layers
});

// Add tooltips to overlays
overlays.forEach(function (overlay) {
  overlay.on('ready', function () {
    overlay.eachLayer(function (layer) {
      layer.bindPopup(layer.feature.properties.place_name);
    });
  })
        .addTo(map);
});

// Create layer controls
let basemapNames = {};
basemaps.forEach(function (basemap) {
  basemapNames[basemap.name] = basemapNames[basemap.layer];
});

let overlayNames = {};
basemaps.forEach(function (basemap) {
  overlayNames[basemap.name] = basemapNames[basemap.layer];
});

leaflet.control.layers(basemapNames, overlayNames).addTo(map);

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
// https://github.com/PaulLeCam/react-leaflet/issues/255
leaflet.Icon.Default.imagePath = '.';

leaflet.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});
