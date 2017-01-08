function createMaze() {
    var file = document.getElementById("maze-file");

    $.getJSON(file.name, function(json) {
        console.log(json);
    });

    /*
    var c = document.getElementById("maze");
    var ctx = c.getContext("2d");
    ctx.moveTo(0,0);
    ctx.lineTo(200,100);
    ctx.stroke();
    */
}
