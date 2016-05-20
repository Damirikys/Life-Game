var div = document.getElementById('content');
var live = document.getElementById('live');
// var canvas = document.getElementById("a");
// var context = canvas.getContext("2d");
var liveCount = 0;
var size = 50;
//var parametr = 3.5;
var field = [];
var buffer = [];
var getReady;
var lkm = false;

document.onmousedown = function(){
    lkm = true;
}

document.onmouseup = function(){
    lkm = false;
}

function CreateField() {
    for (var i = 0; i < size; i++) {
        field[i] = [], buffer[i] = [];
        for (var j = 0; j < size; j++) {
            var rnd = Math.random() >= 0.7;
            field[i][j] = rnd, buffer[i][j] = rnd;
        }
    }
}

function CleanField() {
    for (var i = 0; i < size; i++)
        for (var j = 0; j < size; j++)
            field[i][j] = false, buffer[i][j] = false;

    Pause();
}

function Print(array) {
    var string = "";
    liveCount = 0;
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            var type = (array[i][j]) ? "true" : "false";
            if(type == "true") liveCount++;
            string += "<cell x='"+ i + "' y='"+ j
                   + "' onmouseover='CellClick(this, false);' onclick='CellClick(this, true);' class='"
                   + type +"'>x</cell>";
        }
        string += "\n";
    }

    div.innerHTML = string;
    live.innerHTML = liveCount;
    document.getElementById('mapsave').innerHTML =
        '<a id="mapsave" href="data:text/plain;charset=utf-8,%EF%BB%BF'
        + encodeURIComponent(SaveMap())
        + '" download="map.txt"><button>Save map</button></a>';
}

function Start() {

    function CheckAlive(i, j) {
        var countAlive = 0;
        for (var k = -1; k < 2; k++) {
            if (i + k < 0 || i + k > size - 1) continue;
            for (var s = -1; s < 2; s++) {
                if (j + s < 0 || j + s > size - 1) continue;
                if (field[i + k][j + s] == true) countAlive++;
            }
        }
        return countAlive;
    }

    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            var alive = CheckAlive(i, j);
            if (field[i][j])
                buffer[i][j] = (alive - 1 == 2 || alive - 1 == 3) ? true : false;
            else
                buffer[i][j] = (alive == 3) ? true : false;
        }
    }

    for (var i = 0; i < size; i++)
        for (var j = 0; j < size; j++)
            field[i][j] = buffer[i][j];

    Print(field);
}

function CellClick(cell, click) {
    if(lkm == false && click == false) return;
    var i = cell.getAttribute("x");
    var j = cell.getAttribute("y");
    var type = cell.getAttribute("class");

    if(type == "true")
        cell.setAttribute("class", "false"), field[i][j] = false, liveCount--;
    else
        cell.setAttribute("class", "true"), field[i][j] = true, liveCount++;

    live.innerHTML = liveCount;
    document.getElementById('mapsave').innerHTML =
        '<a id="mapsave" href="data:text/plain;charset=utf-8,%EF%BB%BF'
        + encodeURIComponent(SaveMap())
        + '" download="map.txt"><button>Save map</button></a>';
}

function SaveMap() {
    var write = "";
    for (var i = 0; i < size; i++)
        for (var j = 0; j < size; j++)
            write += (field[i][j]) ? "1" : "0";

    return write;
}

function processFiles(files) {
    var file = files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
        var string = e.target.result;
        var count = 0;
        for (var i = 0; i < size; i++) {
            for (var j = 0; j < size; j++) {
                field[i][j] = (string[count] == "1") ? true : false;
                count++;
            }
        }
        Print(field);
    }

    reader.readAsText(file);
}

function Play() {
    clearInterval(getReady);
    getReady = setInterval(Start, 0);
}

function Pause() {
    clearInterval(getReady);
}

CreateField();
Print(field);
