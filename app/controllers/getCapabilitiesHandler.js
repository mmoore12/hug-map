const config = require('../../config');

function handleGetCapabilitiesRequest (req, res) {
  res.sendFile(config.WMSServerCapabilities['1.3.0']);
}

module.exports = handleGetCapabilitiesRequest;
