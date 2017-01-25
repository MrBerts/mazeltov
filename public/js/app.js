//var socket = io.connect('http://localhost:8080');

var c = document.getElementById("mazeCanvas");
var ctx = c.getContext("2d");

var cSize = 500;
var width;
var height;
var deltaW;
var deltaH;

$(document).ready(function() {

    $('#mazeForm').submit(function() {

        $(this).ajaxSubmit({

            error: function(xhr) {
        		alert('Error: ' + xhr.status);
            },

            success: function(response) {
                console.log(response);
                width = response.width;
                height = response.height;
                deltaW = cSize / width;
                deltaH = cSize / height;
                drawSolution(response);
            }
    	});
    
	    //Very important line, it disable the page refresh.
	    return false;
    });    
});

function drawSolution(file) {
	ctx.clearRect(0, 0, cSize, cSize);
	// Draw the maze
	console.log(file.walls);
	ctx.beginPath();

	file.walls.forEach(function (tuple) {

		var start = [tuple[1][1] * deltaW, tuple[1][0] * deltaH];
		var temp = [tuple[1][0] - tuple[0][0], tuple[1][1] - tuple[0][1]];
		var end = [start[0] + temp[0] * deltaW, start[1] + temp[1] * deltaH];

		
		ctx.moveTo(start[0],start[1]);
		ctx.lineTo(end[0],end[1]);
	});

	ctx.strokeStyle = "#000000";
	ctx.lineWidth = 2;
	ctx.stroke();

	// Draw the solution
	/*
	file.solution.forEach(function (tuple) {

		
	});
	*/
}

