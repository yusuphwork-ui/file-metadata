var express = require('express');
var cors = require('cors');
require('dotenv').config()

var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// --------------CHALLENGE--------------
// Firstly install "multer". It is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files.
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Analyze Uploaded file API endpoint
app.post('/api/fileanalyse', upload.single('upfile'), (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  return res.json({
    name: file.originalname,
    type: file.mimetype,
    size: file.size,
  });
});

const configuredPort = process.env.PORT || 3005;
const portsToTry = Array.from(new Set([configuredPort, 3000, 3005].filter(Boolean)));

if (require.main === module) {
  portsToTry.forEach((port) => {
    app.listen(port, function () {
      console.log('Your app is listening on port ' + port)
    }).on('error', function (err) {
      if (err.code !== 'EADDRINUSE') {
        throw err;
      }
    });
  });
}

module.exports = app;
