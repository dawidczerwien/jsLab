const aaa=document.getElementById('canvas1');
const ctx=aaa.getContext('2d');
ctx.fillStyle = "green";
// max size 1000x1000
const width = 400;
const height = 300;
aaa.width = width;
aaa.height = height;
var cols, rows;
var cellSize = 40;

cols = Math.floor(height/cellSize);
rows = Math.floor(width/cellSize);

var cellsArr = [];
var stack = [];
var current;


class Cell {
    //Maze algorithm Randomized depth-first search Iterative
    constructor(i,j) {
    this.i = i;
    this.j = j;
    this.walls = [true, true, true, true]
    this.visited = false;
    }
    
    //check 4 possible neighbours
    checkNeighbors() {
        var neighbors = [];
        if (this.i-1<0) {
            top = undefined;
        } else {
            var top = cellsArr[this.i-1][this.j];
        }
        if (this.j+1>=cols) {
            var right = undefined;
        } else {
            var right = cellsArr[this.i][this.j+1];
        }
        if (this.i+1>= rows) {
            var bottom = undefined;
        } else {
            var bottom = cellsArr[this.i+1][this.j];
        }
        if (this.j-1<0) {
            var left = undefined;
        } else {
            var left = cellsArr[this.i][this.j-1];
        }
        
        
        if (top && !top.visited) {
            neighbors.push(top);
        }
        if (right && !right.visited) {
            neighbors.push(right);
        }
        if (bottom && !bottom.visited) {
            neighbors.push(bottom);
        }
        if (left && !left.visited) {
            neighbors.push(left);
        }
        
        //choose a neighbor randomly
        if (neighbors.length > 0) {
            var random = Math.floor(Math.random()*neighbors.length);
            return neighbors[random];
        } else {
            return undefined;
        }
    }
    //draw cell borders and background if visited
    drawCell() {
        var x = this.i*cellSize;
        var y = this.j*cellSize;
        //upper border
        if (this.walls[0]) {
            drawLine(x,y,x+cellSize,y);
            
        }
        //right border
        if (this.walls[1]) {
            drawLine(x+cellSize,y,x+cellSize,y+cellSize);
            
        }
        //bottom border
        if (this.walls[2]) {
            drawLine(x+cellSize,y+cellSize,x,y+cellSize);
            
        }
        //left border
        if (this.walls[3]) {
            drawLine(x,y+cellSize,x,y);
            
        }
        
        if (this.visited) {
            ctx.fillStyle = "green";
            ctx.fillRect(x, y, cellSize, cellSize);
           
            
        }
    }
    
    
    cellOnStack() {

        var x = this.i*cellSize;
        var y = this.j*cellSize;
        ctx.fillStyle = "blue";
        ctx.fillRect(x, y, cellSize, cellSize)
        
    }

    cellActual() {

        var x = this.i*cellSize;
        var y = this.j*cellSize;
        ctx.fillStyle = "red";
        ctx.fillRect(x, y, cellSize, cellSize)
        
    }
    
}

//setup maze and draw 2d array of squares
for (var i = 0; i < rows; i++) {
    var row = [];
    for (var j = 0; j < cols; j++) {
        var cell = new Cell(i,j);
        row.push(cell);
        cell.drawCell();
    }
    cellsArr.push(row);
    current = cellsArr[0][0];
}


//run animation
while (true) {
    setInterval(function() {
        //paint the cell twice visited (green colour cell)
        current.drawCell();
    var next = current.checkNeighbors();
    if (next) {
        next.visited = true;
        stack.push(current);

        setInterval(function() {
            //paint sprinter cell (red colour cell)
            current.cellActual();
        },50);
        
        //paint the cell once visited (blue colour cell)
        current.cellOnStack();
        removeWalls(current, next);
        current = next;
        
        
    } else if(stack.length > 0) {
        current = stack.pop();
    } else {
        return;
    }
    },100);
    break
    
}

//draw a line between the rectangles
function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.strokeStyle ='white';
    ctx.lineWidth = 2;
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.stroke();
    
}

// remove wall 
function removeWalls(a,b) {
    var x = a.i - b.i;
    if (x == -1) {
        a.walls[1] = false;
        b.walls[3] = false;
    } else if(x == 1) {
        a.walls[3] = false;
        b.walls[1] = false;
    }
    var y = a.j - b.j;
    if (y == -1) {
        a.walls[2] = false;
        b.walls[0] = false;
    } else if(y == 1) {
        a.walls[0] = false;
        b.walls[2] = false;
    }
}