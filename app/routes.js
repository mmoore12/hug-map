const express = require('express');
const wmsRequestHandler = require('./controllers/wmsRequestHandler');
const path = require('path');

let router = express.Router();

router.get('/wms', wmsRequestHandler);

router.get('/test', function (req, res) {
  res.sendFile(path.join(__dirname, '/../test_pages/getFeatureInfoTest.html'));
});

router.get('/slippymap', function (req, res) {
  res.sendFile(path.join(__dirname, '/../test_pages/slippymap.html'));
});

// Export
module.exports = router;
