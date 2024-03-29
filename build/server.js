const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

app.use(express.static('dist'));
app.use('/geojson', express.static('src/geojson'));

app.get('/', function (req, res) {
  res.sendfile('./dist/index.html');
});

app.listen(port, function () {
  console.log('Site started on port ' + port);
});
