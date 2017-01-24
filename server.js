var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var multer = require('multer');
var upload = multer({dest: 'uploads/'});
var fs = require('fs');

var wallsFile;
var maze = [];
var solution = [];

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
    //solveMaze();

    // Go back to index.html
    res.end("terminé");
    //io.sockets.emit('walls', obj);
});

function buildMaze() {

    // Init the maze array
    var i, j;
    for (i = 1; i <= wallsFile.height * 2 - 1; i++) {
        maze[i] = [];
        for (j = 1; j <= wallsFile.width * 2 - 1; j++) {
            maze[i][j] = 1;
        }
    }

    // Define walls and path
    var cellX1, cellY1, cellX2, cellY2, wallX, wallY, temp;
    wallsFile.walls.forEach(function(tuple) {
        cellX1 = (tuple[0][0] + 1) * 2 - 1;
        cellY1 = (tuple[0][1] + 1) * 2 - 1;
        cellX2 = (tuple[1][0] + 1) * 2 - 1;
        cellY2 = (tuple[1][1] + 1) * 2 - 1;
        wallX = (cellX1 + cellX2) / 2;
        wallY = (cellY1 + cellY2) / 2;

        maze[wallX][wallY] = 0;
    });

    //Define start
    maze[wallsFile.start[0] * 2 + 1][wallsFile.start[1] * 2 + 1] = 2;

    //Define end
    maze[wallsFile.end[0] * 2 + 1][wallsFile.end[1] * 2 + 1] = 3;    
}

function solveMaze() {

    //                left     down    right   up
    var direction = [[0, -1], [1, 0], [0, 1], [-1, 0]];
    var move =      [[0, -2], [2, 0], [0, 2], [-2, 0]];
    var current = [wallsFile.start[0] + 1, wallsFile.start[1] + 1];
    var previous = current
    var next = [];
    
    solution.push(current);

    var deltaX = 2, deltaY = 0, temp;
    var signe = 1;

    // Test win
    if (current == wallsFile.end) {
        return result;
    }

    // Find the first next from start
    var i = -1;
    do {
        i++;
        next[0] = current[0] + direction[i][0];
        next[1] = current[1] + direction[i][1];
    } while (!testCell(next))

    next[0] = current[0] + move[i][0];
    next[1] = current[1] + move[i][1];
    
    previous = current.concat();
    current = next.concat();
    
    solution.push(current);

    // Find a path
    while (maze[current[0]][current[1]] != 3) {

        temp = [previous[0] - current[0], previous[1] - current[1]];
        // Find next cell
        if (temp[0] < 0) {
            i = 0;
        } else if (temp[0] > 0) {
            i = 2;
        } else if (temp[1] < 0) {
            i = 1;
        } else if (temp[1] > 0) {
            i = 3;
        } else {
            console.log("Error");
            return -1;
        }

        do {
            next[0] = current[0] + direction[i][0];
            next[1] = current[1] + direction[i][1];
            i++;
            i %= direction.length;
        } while (!testCell(next))

        i--;
        if (i == -1) i = move.length - 1;

        next[0] = current[0] + move[i][0];
        next[1] = current[1] + move[i][1];

        previous = current.concat();
        current = next.concat();
        testPush(current);
    }
    console.log(solution);
}

function testCell(cell) {

    if (    cell[0] <= 0 ||
            cell[0] >= wallsFile.height * 2 ||
            cell[1] <= 0 ||
            cell[1] >= wallsFile.width * 2) {
        return false;
    } else if (maze[cell[0]][cell[1]] == 0) {
        return false;
    } else {
        return true;
    }
}

function testPush(cell) {

    if (solution[solution.length - 2][0] === cell[0] && solution[solution.length - 2][1] === cell[1]) {
        solution.pop();
    } else {
        solution.push(cell);
    }
}
