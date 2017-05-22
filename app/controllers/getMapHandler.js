const sendXML = require('./sendXML');
const mapHelper = require('./mapHelper');
const errorMessageBuilder = require('./errorMessageBuilder');

function handleGetMapRequest (mapReqObj, res) {
  mapHelper.createMapImage(mapReqObj, function (err, mapImg) {
    if (err) {
      sendXML(res, errorMessageBuilder.buildServiceExceptionReportForError(err));
    } else {
      res.set('content-type', 'image/' + mapReqObj.format);
      res.send(mapImg);
    }
  });
}

module.exports = handleGetMapRequest;
