const mapnik = require('mapnik');
const config = require('../../config');
const WMSlayers = require(config.layers);

mapnik.registerFonts(config.fontDirectory, {recurse: true});
mapnik.register_default_input_plugins();

function createMap (mapReq, callback) {
  let createMapError;
  let map = new mapnik.Map(mapReq.width, mapReq.height);
  map.loadSync(config.styles);
  map.srs = '+init=' + mapReq.srs;

  for (let index in mapReq.layers) {
    let layerName = mapReq.layers[index];
    if (WMSlayers.hasOwnProperty(layerName)) {
      let layerToAdd = createMapLayer(layerName, mapReq.styles[index]);
      if (layerToAdd.styles.length > 0) {
        map.add_layer(layerToAdd);
      } else {
        createMapError = 'StyleNotDefined';
        callback(createMapError);
        return;
      }
    } else {
      createMapError = 'LayerNotDefined';
      callback(createMapError);
      return;
    }
  }
  if (bboxIsValid(mapReq.bbox)) {
    map.zoomToBox(mapReq.bbox);
  } else {
    createMapError = 'InvalidBBox';
    callback(createMapError);
    return;
  }
  callback(createMapError, map);
}

function createMapLayer (name, style) {
  let layerOptions = WMSlayers[name];
  let mapLayer = new mapnik.Layer(layerOptions.name, layerOptions.srs);
  if (layerOptions.availableStyles.indexOf(style) > -1 || style === '') {
    mapLayer.styles = [(style === '') ? layerOptions.availableStyles[0] : style];
  }
  mapLayer.datasource = new mapnik.Datasource(layerOptions.datasource);
  return mapLayer;
}

function createMapImage (mapReq, callback) {
  createMap(mapReq, function (createMapError, map) {
    if (createMapError) {
      callback(createMapError);
    } else {
      var im = new mapnik.Image(mapReq.width, mapReq.height);
      map.render(im, function (err, im) {
        if (err) throw err;

        mapReq.format = mapReq.format.replace('image/', '');

        im.encode(mapReq.format, function (err, buffer) {
          if (err) createMapError = 'InvalidFormat';
          callback(createMapError, buffer);
        });
      });
    }
  });
}

function getFeatureInfo (mapReq, callback) {
  let getFeatureInfoError = validateMapQuery(mapReq);
  if (!getFeatureInfoError) {
    createMap(mapReq, function (createMapError, map) {
      if (createMapError) {
        callback(createMapError);
      } else {
        map.queryMapPoint(mapReq.i, mapReq.j, {}, function (err, results) {
          if (err) throw err;

          console.log(results);
          let attributes = [];
          for (let resultsIndex = 0; resultsIndex < results.length; ++resultsIndex) {
            if (mapReq.query_layers.indexOf(results[resultsIndex].layer) !== -1) {
              let features = results[resultsIndex].featureset;
              let feature;
              while ((feature = features.next())) {
                attributes.push(feature.attributes());
              }
            }
          }
          callback(null, attributes);
        });
      }
    });
  } else {
    callback(getFeatureInfoError);
  }
}

// makes sure the BBOX is logical
function bboxIsValid (bbox) {
  if (bbox.length === 4) {
    try {
      let xMin = parseFloat(bbox[0]);
      let yMin = parseFloat(bbox[1]);
      let xMax = parseFloat(bbox[2]);
      let yMax = parseFloat(bbox[3]);
      return (xMax > xMin && yMax > yMin);
    } catch (e) {
      return false;
    }
  } else {
    return false;
  }
}

function validateMapQuery (mapReq) {
  if (mapReq.query_layers[0] === '') {
    return 'EmptyQueryLayers';
  }
  for (var layer in mapReq.query_layers) {
    if (mapReq.layers.indexOf(mapReq.query_layers[layer]) === -1) {
      return 'InvalidQueryLayers';
    }
  }

    // check info_format
  if (mapReq.info_format === '') {
    return 'EmptyInfoFormat';
  }
  if (config.supportedInfoFormats.indexOf(mapReq.info_format) === -1) {
    return 'InvalidInfoFormat';
  }

    // check i, j coordinates
  if (mapReq.i < 0 || mapReq.i < 0 || mapReq.i > mapReq.width || mapReq.j > mapReq.height) {
    return 'InvalidImageCoordinates';
  }

  return null;
}

module.exports = {
  createMap: createMap,
  createMapLayer: createMapLayer,
  createMapImage: createMapImage,
  bboxIsValid: bboxIsValid,
  getFeatureInfo: getFeatureInfo
};
