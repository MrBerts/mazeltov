var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var multer = require('multer');
var upload = multer({dest: 'uploads/'});
var fs = require('fs');

var wallsFile;
var maze = [];

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

// Chargement de socket.io
var io = require('socket.io').listen(server);

// Quand un client se connecte, on le note dans la console
io.sockets.on('connection', function (socket) {
    socket.emit('message', 'Vous êtes bien connecté !');
});

app.post('/upload-file', upload.single('maze-file'), function(req,res){
    // Read the JSON file
    var obj = JSON.parse(fs.readFileSync(req.file.path, 'utf8'));

    //TODO
    //Vérification du fichier

    wallsFile = obj;
    buildMaze();

    //io.sockets.emit('message', 'bonjour');
    // Go back to index.html

    res.redirect('/');
});

function buildMaze() {
    console.log(wallsFile);

    // Init the maze array
    var i, j;
    for (i = 1; i <= wallsFile.height * 2 - 1; i++) {
        maze[i] = [];
        for (j = 1; j <= wallsFile.width * 2 - 1; j++) {
            maze[i][j] = 1;
        }
    }

    // Define walls
    var cellX1, cellY1, cellX2, cellY2, wallX, wallY, temp;
    wallsFile.walls.forEach(function(tuple) {
        console.log(tuple);
        cellX1 = (tuple[0][0] + 1) * 2 - 1;
        cellY1 = (tuple[0][1] + 1) * 2 - 1;
        cellX2 = (tuple[1][0] + 1) * 2 - 1;
        cellY2 = (tuple[1][1] + 1) * 2 - 1;
        wallX = (cellX1 + cellX2) / 2;
        wallY = (cellY1 + cellY2) / 2;

        maze[wallX][wallY] = 0;

        if (wallX == cellX1) {

            temp = wallX - 1;
            if (temp != 0) {
                maze[temp][wallY] = 0;
            }

            temp = wallX + 1;
            if (temp != wallsFile.height * 2) {
                maze[temp][wallY] = 0;
            }
        } else if (wallY == cellY1) {
            
            temp = wallY - 1;
            if (temp != 0) {
                maze[wallX][temp] = 0;
            }

            temp = wallY + 1
            if (temp != wallsFile.width * 2) {
                maze[wallX][temp] = 0;   
            }
        }
        console.log(maze);
    });

    
}
