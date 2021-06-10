let running = false;
let counter = 0;
const ROWS = 26;
const COLS = 78;
function createGrid(rows, cols){
    let grid =[]
    for(let i = 0; i < rows; i++)
    {
        grid[i] = new Array(cols).fill(0);
    }
    return grid;
}

function randomGrid(rows, cols){ // Generates a ranodm grid 
    let grid = createGrid(rows,cols);
    for(let i = 0; i < rows; i++){
        for(let j = 0; j < cols; j++){
            grid[i][j] = Math.floor(Math.random() * 2);
        }
        
    }
    displayGrid(grid);
}

function getNewGrid(grid){ //Applies rules and generates the next grid
    let newGrid = createGrid(grid.length, grid[0].length);
    
    for(let i = 0; i < grid.length; i++){
        for(let j = 0; j < grid[i].length; j++){
            let neighborSum = 0;
            //console.log(grid.length, grid[i].length);
            if(i == 0 && j == 0){
                neighborSum = grid[i][j + 1] + grid[i + 1][j] + grid[i + 1][j+1];
                //console.log("TOp left", i, j);
            }
            else if(i == 0 && j == grid[i].length - 1){
                neighborSum =  grid[i][j - 1]  + grid[i + 1][j-1] + grid[i+1][j];
                //console.log("top right", i, j);
            }
            else if(i == grid.length - 1 && j ==0){
                neighborSum =  grid[i-1][j]+ grid[i-1][j+1] + grid[i][j + 1];
                //console.log("Bottom left", i, j);
            }
            else if(i == grid.length -1  && j == grid[i].length - 1){
                neighborSum = grid[i-1][j-1]+ grid[i-1][j] + grid[i][j - 1];
                //console.log("Bottom right", i, j);
            }
            else if(i == 0){
                neighborSum = grid[i][j - 1] + grid[i][j + 1] + grid[i + 1][j-1] + grid[i+1][j] + grid[i+1][j+1];
                //console.log("Top", i, j);
            }
            else if(i == grid.length - 1){
                neighborSum = grid[i-1][j-1]+ grid[i-1][j]+ grid[i-1][j+1] + grid[i][j - 1] + grid[i][j + 1];
            }
            else if(j == 0){
                neighborSum = grid[i-1][j]+ grid[i-1][j+1] + grid[i][j + 1]  + grid[i+1][j] + grid[i+1][j+1];
                //console.log("Far left", i, j);
            }
            else if(j == grid[i].length - 1){
                neighborSum = grid[i-1][j-1]+ grid[i-1][j]+grid[i][j - 1]  + grid[i + 1][j-1] + grid[i+1][j];
                //console.log("Far right", i, j);
            }
            else{
                neighborSum = grid[i-1][j-1] + grid[i-1][j] + grid[i-1][j+1] + grid[i][j - 1] + grid[i][j + 1] + grid[i + 1][j-1] + grid[i+1][j] + grid[i+1][j+1];
            }
            newGrid[i][j] = nextState(grid[i][j], neighborSum);
        }
    }
    return newGrid;
}

function nextState(curState, neighborSum){// Returns the next state of a cell given the neighborsum and the current state
    if(curState == 1 && (neighborSum ==2 || neighborSum == 3)){
        return 1;
    }
    else if(curState == 0 && neighborSum == 3){
        return 1;
    }
    else{
        return 0;
    }
}

function initGridPrint(grid){// Creates the grid and the cells.
    let body = document.querySelector("#world");
    let tbl = document.createElement("table");
    tbl.setAttribute('id', "grid");
    for(let i = 0; i < grid.length; i++){
        let tr = document.createElement("tr");
        for(let j = 0; j < grid[i].length; j++){
            let cell = document.createElement("td");
            if(grid[i][j] == 0){
                cell.setAttribute("class", "dead");
            }
            else{
                cell.setAttribute("class", "alive");
            }
            cell.setAttribute("id", i + "_" + j);
            cell.setAttribute("onclick", "invertCell(this)");
            tr.appendChild(cell);
        }
        tbl.appendChild(tr)
    }
    body.appendChild(tbl);
}

function invertCell(cell){// Inverts the value of a cell's death state
    if(cell.getAttribute("class") == "alive"){
        cell.setAttribute("class", "dead");
    }
    else{
        cell.setAttribute("class", "alive");
    }
}

function displayGrid(grid){// Displays the grid given as a parameter from js to html
    let rows = document.querySelectorAll("tr");
    let cells = []
    for(let k = 0; k < rows.length; k++){
        cells.push(rows[k].children);
    }
    for(let i = 0; i < cells.length; i++){
        for(let j = 0; j < cells[i].length; j++){
        let ijarr = cells[i][j].getAttribute("id").split("_");
        if(grid[parseInt(ijarr[0])][parseInt(ijarr[1])] == 0){
            cells[i][j].setAttribute("class", 'dead');
        }
        else{
            cells[i][j].setAttribute("class", 'alive');
        }
    }
    }
}
function getGrid(){// Gets the current grid being displayed from html to js
    let rows = document.querySelectorAll("tr");
    let cells = []
    for(let k = 0; k < rows.length; k++){
        cells.push(rows[k].children);
    }
    let baseGrid = createGrid(ROWS,COLS);
    
    for(let i = 0; i < cells.length; i++){
        for(let j = 0; j < cells[i].length; j++){
        let ijarr = cells[i][j].getAttribute("id").split("_");
        if(cells[i][j].getAttribute("class") == 'alive'){
            baseGrid[parseInt(ijarr[0])][parseInt(ijarr[1])] = 1;
        }
        else{
            baseGrid[parseInt(ijarr[0])][parseInt(ijarr[1])] = 0;
        }
        
    }
}
    return baseGrid;
}

    
function evolve(){ // Individual step  process
    let curgrid = getGrid();;
    let nextGrid = getNewGrid(curgrid);
    displayGrid(nextGrid);
}

function reset(){ //Reset button script, 
    displayGrid(createGrid(ROWS,COLS));
}

const sleep= (delay) => new Promise((resolve) => setTimeout(resolve,delay))
function playStopClick(){// The start stop button
    counter++;
    let playbtn = document.getElementById("playbtn")
    if(counter %2 == 1)
    {
        running = true;
        playbtn.setAttribute("style", "background-color: rgb(255, 255, 255)")
        asyncEvolve();
    }
    else{
        playbtn.setAttribute("style", "background-color: rgb(58, 57, 57)")
        running = false;
    }
}
async function asyncEvolve(){
    while(running){
        evolve();
        await sleep(250);
    }
}
initGridPrint(createGrid(ROWS,COLS));