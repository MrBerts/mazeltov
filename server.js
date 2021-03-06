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

app.post('/upload-file', upload.single('mazeFile'), function(req,res){

    if (req.file === undefined) {
        res.status(500).send('Select a file');
        res.end();

    } else {
        try {
            // Read the JSON file
            wallsFile = JSON.parse(fs.readFileSync(req.file.path, 'utf8'));

            if (isValid()) {

                buildMaze();
                solveMaze();

                // Go back to index.html
                res.setHeader('Content-Type', 'application/json');
                res.send(wallsFile);
                res.end();
            } else {
                throw ('notValid');
            }

        } catch (e) {
            res.status(500).send('Select a JSON file generated by Pymaze');
            res.end();
        }
    }
});

function isValid() {

    if (wallsFile.width != undefined &&
        wallsFile.height != undefined &&
        wallsFile.walls != undefined &&
        wallsFile.start != undefined &&
        wallsFile.end != undefined) return true;

    return false;
}

function buildMaze() {
    // For example wallsFile is width = 2, height = 2,
    // walls = [[0, 0], [0, 1]], start = [0, 0], end = [1, 1]
    // In the following, a tuple is something like [[a, b], [c, d]] and "a", "c" represent the line; "b", "d" the column

    // Define a 2width-1 x 2height-1 matrix fill with 1
    // and start to fill from 1, not 0
    var i, j;
    for (i = 1; i <= wallsFile.width * 2 - 1; i++) {
        maze[i] = [];
        for (j = 1; j <= wallsFile.height * 2 - 1; j++) {
            maze[i][j] = 1;
        }
    }
    /* maze looks like :
    0 0 0 0
    0 1 1 1
    0 1 1 1
    0 1 1 1
    */

    // Put a 0 where a wall is
    var cellX1, cellY1, cellX2, cellY2, wallX, wallY;
    wallsFile.walls.forEach(function(tuple) {
        cellX1 = (tuple[0][0] + 1) * 2 - 1;
        cellY1 = (tuple[0][1] + 1) * 2 - 1;
        cellX2 = (tuple[1][0] + 1) * 2 - 1;
        cellY2 = (tuple[1][1] + 1) * 2 - 1;
        wallX = (cellX1 + cellX2) / 2;
        wallY = (cellY1 + cellY2) / 2;

        maze[wallX][wallY] = 0;
    });
    /* maze looks like :
    0 0 0 0
    0 1 0 1
    0 1 1 1
    0 1 1 1
    */

    // Define start
    // Useless in our case but could be usefull in case we don't know if the maze has a solution
    maze[wallsFile.start[0] * 2 + 1][wallsFile.start[1] * 2 + 1] = 2;

    // Define end
    maze[wallsFile.end[0] * 2 + 1][wallsFile.end[1] * 2 + 1] = 3;
    /* maze looks like :
    0 0 0 0
    0 2 0 1
    0 1 1 1
    0 1 1 3
    */
}

/*  The aim of the algorithm is to check right first.
    So we need to define a current cell, a previous cell and a next cell to check if we can go to that direction
*/
function solveMaze() {

    var solution = [];

    //                left     down    right   up
    var direction = [[0, -1], [1, 0], [0, 1], [-1, 0]]; // Define the direction to check if there is a wall
    var move =      [[0, -2], [2, 0], [0, 2], [-2, 0]]; // Define the next cell to go


    var current = [wallsFile.start[0] * 2 + 1, wallsFile.start[1] * 2 + 1];
    // We always go right if we can, so we need to know where are we coming from
    var previous = current;
    var next = [];
    
    solution.push(current);

    var temp;
    var signe = 1;

    // Test win
    if (maze[current[0]][current[1]] != 3) {

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

        // At this point we have "previous" on the start cell and "current" on the first available cell
        
        solution.push(current);

        // Find a path
        while (maze[current[0]][current[1]] != 3) {

            temp = [previous[0] - current[0], previous[1] - current[1]];
            // Find next cell
            if (temp[0] < 0) { // Previous is 2 cells top from current so we'll start to check left first
                i = 0;
            } else if (temp[0] > 0) { // Previous is 2 cells down from current so we'll start to check right first
                i = 2;
            } else if (temp[1] < 0) { // Previous is 2 cells left from current so we'll start to check left first
                i = 1;
            } else if (temp[1] > 0) { // Previous is 2 cells right from current so we'll start to check left first
                i = 3;
            } else {
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
            testPush(solution, current);
        }
    }

    scaleSolution(solution);
    wallsFile.solution = solution;
}

function scaleSolution(solution) {

    solution.forEach(function(tuple) {

        tuple[0] = (tuple[0] + 1) / 2;
        tuple[1] = (tuple[1] + 1) / 2;
    });
}

function testCell(cell) {

    if (    cell[0] <= 0 ||
            cell[0] >= wallsFile.width * 2 ||
            cell[1] <= 0 ||
            cell[1] >= wallsFile.height * 2) {
        return false;
    } else if (maze[cell[0]][cell[1]] == 0) {
        return false;
    } else {
        return true;
    }
}

/*  Push a if a != topList-1
    Pop otherwise
*/
function testPush(solution, cell) {

    if (solution.length >= 2 && solution[solution.length - 2][0] === cell[0] && solution[solution.length - 2][1] === cell[1]) {
        solution.pop();
    } else {
        solution.push(cell);
    }
}
