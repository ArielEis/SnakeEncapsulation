/**
 * Created by ariel on 17/01/2017.
 */

// initialize variables
var rows = 50;
var cols = 50;
var flag = true;   // pause flag for interval function
var score = 0;
var isGameOn = true;
var scoreDiv;
var speed = 50;

var Food = {
    posX: 0,
    posY: 0,
    isFood: false,
    timer: 0,
    score: 0,
    foodDiv: 'food',
    newFood: function (){
        var found = false;
        var position;
        while(!found){
            this.posX = (Math.floor((Math.random() * rows)));
            this.posY = (Math.floor((Math.random() * cols)));
            position = FindByAttributeValue("name", "r" + this.posX + "c" + this.posY);

            if (position.id === 'blank'){
                found = true;
            }
        }
        this.timer = (Math.floor((Math.random() * 20)) +20 +Snake.snakesize +(rows-10));
        this.score = (Math.floor((Math.random() * 3)) +1);
        switch(this.score){
            case 1:
                this.foodDiv = FindByAttributeValue("name", "r" + Food.posX + "c" + Food.posY);
                this.foodDiv.id = "food1";
                break;
            case 2:
                this.foodDiv = FindByAttributeValue("name", "r" + Food.posX + "c" + Food.posY);
                this.foodDiv.id = "food2";
                break;
            case 3:
                this.foodDiv = FindByAttributeValue("name", "r" + Food.posX + "c" + Food.posY);
                this.foodDiv.id = "food3";
                break;

        }
        this.foodDiv.setAttribute("Timer",this.timer+"");
        this.isFood = true;
    }

};

var Snake = {
    posX: 0,
    posY: 0,
    snakesize: 1,
    direction: 0,
    isAlive: true,
    move: function(){
        switch (this.direction) {
            case 0: // move right
                this.posY = moveForward(this.posY);
                break;
            case 1: // move left
                this.posY = moveBackward(this.posY);
                break;
            case 2: // move up
                this.posX = moveBackward(this.posX);
                break;
            case 3: // move down
                this.posX = moveForward(this.posX);
                break;
        }

        function moveForward(num){
            num++;
            if (num>(rows-1))
                num = 0;
            return num;
        }


        function moveBackward(num){
            num--;
            if (num<0)
                num = (rows-1);
            return num;
        }

    }

};

var Snake2 = $.extend({}, Snake);
Snake2.posX = cols-1;
Snake2.posY = rows-1;

// initialize matrix
var matrix = initialize(rows,cols);
matrix[Snake.posX][Snake.posY] = true;

$(document).ready(function (){
    //draw matrix
    createTable(matrix);
    scoreDiv = document.getElementById("score");
    updateScore();
});

/*
Initialize matrix:
rows: [number of rows]
cols: [number of columns]
size = (rows X cols)
 */
function initialize(rows,cols){
    var matrix = [];
    for (i=0; i<rows; i++){
        var matrix2 = [];
        matrix.push(matrix2);
        for (j=0; j<cols; j++){
            matrix2[j] = false;
        }
    }
    return matrix;
}

/*
 Draw the game
 matrix: [array 2D]
 */
function createTable(matrix){
    // create table
    var tbl = document.createElement("table");
    var tblBody = document.createElement("tbody");

    // run all over the matrix
    for(rows = 0; rows < matrix.length; rows++){
        var row = document.createElement("tr");
        for(cols = 0; cols < matrix[rows].length; cols++){
            var cell = document.createElement("td");
            cell.id = 'tdId';

            // create new div with attributes and set it to snake or blank id
            var newDiv = document.createElement("div");
            if((rows === Snake.posX)&&(cols === Snake.posY)){
                newDiv.id = 'snakeHead';
                newDiv.setAttribute("Timer",Snake.snakesize+"");
            }else if((rows === Snake2.posX)&&(cols === Snake2.posY)){
                newDiv.id = 'snakeHead2';
                newDiv.setAttribute("Timer",Snake2.snakesize+"");
            }else{
                newDiv.id = 'blank';
            }
            newDiv.setAttribute("row",rows+"");
            newDiv.setAttribute("col",cols+"");
            newDiv.setAttribute("name","r"+rows+"c"+cols);
            cell.appendChild(newDiv);
            row.appendChild(cell);
        }
        tblBody.appendChild(row);
    }
    tbl.appendChild(tblBody);
    document.getElementById("stage").appendChild(tbl);
    tbl.id = 'tableId';
}

/*
Interval function used for move the snake
 */
setInterval(function(){

        if (flag && isGameOn) {

            if (!Food.isFood) {
                Food.newFood();
            } else {
                Food.timer--;
                if (Food.timer === 0) {
                    Food.foodDiv.id = 'blank';
                    Food.isFood = false;
                } else {
                    Food.foodDiv.setAttribute("Timer", Food.timer + "");
                }
            }

            if (Snake.isAlive) {
                /*
                 Snake number 1
                 */

                //find the black div(the snake), get its position and change it to blank
                var snake = document.getElementById("snakeHead");
                snake.id = 'snake';

                Snake.move();

                var newSnake = FindByAttributeValue("name", "r" + Snake.posX + "c" + Snake.posY);
                if ((Snake.posX === Food.posX) && (Snake.posY === Food.posY)) {
                    score += Food.score;
                    updateScore();
                    Snake.snakesize += Food.score;
                    newSnake.id = 'snakeHead';
                    newSnake.setAttribute("Timer", Snake.snakesize + "");
                    Food.isFood = false;
                } else if (newSnake.id === 'snake') {
                    Snake.isAlive = false;
                } else if (newSnake.id === 'snakeHead2') {
                    alert('Game over your score is: ' + score);
                    isGameOn = false;
                } else {
                    moveSnake("snake");
                    newSnake.id = 'snakeHead';
                    newSnake.setAttribute("Timer", Snake.snakesize + "");
                }
            }

            if (Snake2.isAlive) {
                /*
                 Snake number 2
                 */

                //find the black div(the snake), get its position and change it to blank
                var snake = document.getElementById("snakeHead2");
                snake.id = 'snake2';
                Snake2.move();

                var newSnake = FindByAttributeValue("name", "r" + Snake2.posX + "c" + Snake2.posY);
                if ((Snake2.posX === Food.posX) && (Snake2.posY === Food.posY)) {
                    score += Food.score;
                    updateScore();
                    Snake2.snakesize += Food.score;
                    newSnake.id = 'snakeHead2';
                    newSnake.setAttribute("Timer", Snake2.snakesize + "");
                    Food.isFood = false;
                } else if (newSnake.id === 'snake2') {
                    Snake2.isAlive = false;
                } else if (newSnake.id === 'snakeHead') {
                    alert('Game over your score is: ' + score);
                    isGameOn = false;
                } else {
                    moveSnake("snake2");
                    newSnake.id = 'snakeHead2';
                    newSnake.setAttribute("Timer", Snake2.snakesize + "");
                }
            }

            if (!Snake.isAlive && !Snake2.isAlive){
                alert('Game over your score is: ' + score);
                isGameOn = false;
            }

}

}, speed);




function FindByAttributeValue(attribute, value)    {
    var All = document.getElementsByTagName('*');
    for (var i = 0; i < All.length; i++)       {
        if (All[i].getAttribute(attribute) == value) { return All[i]; }
    }
}

function moveSnake(snake){
    var All = document.getElementsByTagName('*');
    for (var i = 0; i < All.length; i++) {
        if (All[i].getAttribute("id") == snake) {
            var timer = Number(All[i].getAttribute("Timer"));
            timer--;
            if (timer === 0) {
                All[i].id = 'blank';
            } else {
                All[i].setAttribute("Timer", timer + "");
            }
        }
    }
}


/*
Event function check which key pressed by the user
arrow keys for movement
space key for pause/play
 */
function changeDirection(event){

    console.log(event.keyCode);

    switch(event.keyCode){
        case 32: //Pause - Continue
            flag = !flag;
            break;
        case 37: //Left
            if (Snake.direction!==0)
                Snake.direction = 1;
            break;
        case 38: // Up
            if (Snake.direction!==3)
                Snake.direction = 2;
            break;
        case 39: // Right
            if (Snake.direction!==1)
                Snake.direction = 0;
            break;
        case 40: // Down
            if (Snake.direction!==2)
                Snake.direction = 3;
            break;
        case 65: //Left
            if (Snake2.direction!==0)
                Snake2.direction = 1;
            break;
        case 87: // Up
            if (Snake2.direction!==3)
                Snake2.direction = 2;
            break;
        case 68: // Right
            if (Snake2.direction!==1)
                Snake2.direction = 0;
            break;
        case 83: // Down
            if (Snake2.direction!==2)
                Snake2.direction = 3;
            break;
    }
}

function updateScore(){
    if(score !== 0) {
        var prevDiv = document.getElementById("scoreResult"+(score-Food.score));
        scoreDiv.removeChild(prevDiv);
    }
    var newDiv = document.createElement("div");
    newDiv.id = "scoreResult"+score;
    newDiv.innerText = score+"";
    scoreDiv.appendChild(newDiv);


}

