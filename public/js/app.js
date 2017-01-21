var socket = io.connect('http://localhost:8080');
var c=document.getElementById("maze");
var ctx=c.getContext("2d");

socket.on('message', function(message) {
    console.log('Le serveur a un message pour vous : ' + message);
    draw();
});

function draw() {
	// Red rectangle
	ctx.beginPath();
	ctx.lineWidth="6";
	ctx.strokeStyle="red";
	ctx.rect(3,3,3,3); 
	ctx.stroke();

	ctx.beginPath();
	ctx.lineWidth="3";
	ctx.strokeStyle="green";
	ctx.rect(3,3,3,3); 
	ctx.stroke();
}
