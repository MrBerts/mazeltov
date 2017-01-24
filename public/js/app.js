var socket = io.connect('http://localhost:8080');

var c = document.getElementById("maze");
var ctx = c.getContext("2d");

var cSize = 500;
var width;
var height;
var deltaW;
var deltaH;
var walls;

$(document).ready(function() {

    $('#mazeForm').submit(function() {

        $(this).ajaxSubmit({

            error: function(xhr) {
        		alert('Error: ' + xhr.status);
            },

            success: function(response) {
                alert(response);
            }
    	});
    
	    //Very important line, it disable the page refresh.
	    return false;
    });    
});

socket.on('walls', function(wallsFile) {
    console.log('Draw walls');

    width = wallsFile.width;
    height = wallsFile.height;
    deltaW = cSize / width;
    deltaH = cSize / height;
    walls = wallsFile.walls;

    ctx.beginPath();
    wallsFile.walls.forEach(function(tuple) {
    	drawWall(tuple);
    });
});

function drawWall(tuple) {

	var start = [tuple[1][1] * deltaW, tuple[1][0] * deltaH];
	var temp = [tuple[1][0] - tuple[0][0], tuple[1][1] - tuple[0][1]];
	var end = [start[0] + temp[0] * deltaW, start[1] + temp[1] * deltaH];


	ctx.moveTo(start[0],start[1]);
	ctx.lineTo(end[0],end[1]);
	ctx.stroke();
}
