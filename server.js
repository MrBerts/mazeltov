var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var multer = require('multer');
var upload = multer({dest: 'uploads/'});
var fs = require('fs');

// App route
var app = express();

// Launch public/index.html
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

// Initialize the app
var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
});

app.post('/upload-file', upload.single('maze-file'), function(req,res){
    // Read the JSON file
    var obj = JSON.parse(fs.readFileSync(req.file.path, 'utf8'));

    console.log(obj);
    console.log(req.body);

    // Go back to index.html
    res.redirect('/');
});
