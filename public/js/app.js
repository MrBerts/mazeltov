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
	ctx.clearRect(0, 0, c.width, c.height);

	// Draw the maze
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
	ctx.beginPath();

	var solution = file.solution;
	ctx.moveTo(solution[0][0] * deltaW - ((1 / 2) * deltaW), solution[0][1] * deltaH - ((1 / 2) * deltaH));

	for (var i = 1; i < solution.length; i++) {

		var x = solution[i][0] * deltaW - ((1 / 2) * deltaW);
		var y = solution[i][1] * deltaH - ((1 / 2) * deltaH);
		ctx.lineTo(y, x);
		
	}

	ctx.strokeStyle = "#00ff00";
	ctx.lineWidth = 2;
	ctx.stroke();
}

