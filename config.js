const path = require('path');

exports.port = process.env.PORT || 8080;

exports.logLevel = 'dev';

// path to capabilities document (for each supported version)
exports.WMSServerCapabilities = {
  '1.3.0': path.join(__dirname, '/xml/WMSServer.1.3.0.xml')
};

// font locations for use in map styles
exports.fontDirectory = path.join(__dirname, '/map/fonts');

// directory containing available datasources
exports.geodataDirectory = path.join(__dirname, '/map/geodata');

// path to XML document that defines available styles
exports.styles = path.join(__dirname, '/map/styles.xml');

// path to js file that defines the available layers
exports.layers = path.join(__dirname, '/map/layers.js');

// array of supported formats for the getFeatureInfo request
exports.supportedInfoFormats = ['json'];
