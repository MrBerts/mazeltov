
var c;
var ctx;

var cSize = 500;
var width;
var height;
var deltaW;
var deltaH;

var wallsColor = '#000000';
var wallsWidth = 2;
var pathColor = '#00ff00';
var pathWidth = 2;
var endColor = '#ff0000';
var startRadius = 3;
var endRadius = 2;

var textColor = '#000000';
var textErrorColor = '#ff4c4c';

$(document).ready(function() {
	c = document.getElementById("mazeCanvas");
	ctx = c.getContext("2d");

    $('#mazeForm').submit(function() {

        $(this).ajaxSubmit({

            error: function(xhr) {
            	$('.file-feedback').css('color', textErrorColor);
        		$('.file-feedback').text(xhr.responseText);
            },

            success: function(response) {
	
                height = response.width;
                width = response.height;
                deltaW = cSize / width;
                deltaH = cSize / height;
                drawSolution(response);
            }
    	});
    
	    //Very important line, it disable the page refresh.
	    return false;
    });

    $(document).on('change', ':file', function() {
	    var input = $(this),
        	numFiles = input.get(0).files ? input.get(0).files.length : 1,
        	label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
	    input.trigger('fileselect', label);
	});

	$(':file').on('fileselect', function(event, label) {
		$('.file-feedback').css('color', textColor);
        $('.file-feedback').text(label);
    });
});

function drawSolution(file) {
	c.style.display = 'block';
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

	ctx.strokeStyle = wallsColor;
	ctx.lineWidth = wallsWidth;
	ctx.stroke();

	// Draw the solution
	ctx.beginPath();

	var solution = file.solution;

	ctx.moveTo(solution[0][1] * deltaW - ((1 / 2) * deltaW), solution[0][0] * deltaH - ((1 / 2) * deltaH));

	for (var i = 1; i < solution.length; i++) {

		var x = solution[i][0] * deltaH - ((1 / 2) * deltaH);
		var y = solution[i][1] * deltaW - ((1 / 2) * deltaW);
		ctx.lineTo(y, x);
		
	}

	ctx.strokeStyle = pathColor;
	ctx.lineWidth = pathWidth;
	ctx.stroke();

	// Draw start point
	ctx.beginPath();
    ctx.arc(solution[0][1] * deltaW - ((1 / 2) * deltaW), solution[0][0] * deltaH - ((1 / 2) * deltaH), startRadius, 0, 2 * Math.PI);
    ctx.fillStyle = pathColor;
    ctx.fill();
    ctx.strokeStyle = pathColor;
    ctx.stroke();

    // Draw end point
    var endPoint = solution[solution.length - 1];
    ctx.beginPath();
    ctx.arc(endPoint[1] * deltaW - ((1 / 2) * deltaW), endPoint[0] * deltaH - ((1 / 2) * deltaH), endRadius, 0, 2 * Math.PI);
    ctx.fillStyle = endColor;
    ctx.fill();
    ctx.strokeStyle = endColor;
    ctx.stroke();
}

