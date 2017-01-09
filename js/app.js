function createMaze() {
    console.log("011");
    var file = document.getElementById("maze-file");
alert("avant");
    $.getJSON(file[0].name, function(json) {
        alert("hello");
        console.log(json);
    });
alert("apres");
    /*
    var c = document.getElementById("maze");
    var ctx = c.getContext("2d");
    ctx.moveTo(0,0);
    ctx.lineTo(200,100);
    ctx.stroke();
    */
}
