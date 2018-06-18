
document.addEventListener('DOMContentLoaded', function() {
	
	
	let direct = "right";
	let prevdirect = "";
	
	// draw table and wirtual board
	function drawTable(x, y) {
		const container = document.getElementById("container");
		const table = document.createElement("table");
		container.appendChild(table);
		const boardArr = [];
		const position = [];
		for (i=0; i < y; i++) {
			const tr = document.createElement("tr");
			table.appendChild(tr);
			boardArr[i] = [];
			position[i] = [];
			for (j=0; j < x; j++) {
				const td = document.createElement("td");
				tr.appendChild(td);
				td.classList.add("tds");
				td.id = i + "," + j;
				boardArr[i][j] = 0;
				position[i][j] = td;
			}
		}
		return [boardArr, x, y,  position];
	} 
	
	// draw snake
	function snakeLength(board) {
		const snake = [ [19,2], [19,1], [19,0] ] ;
		for (i=0; i < snake.length; i++) {
			board[snake[i][0]][snake[i][1]] = 1;
		}	
		return snake; 
	}
	
	// synchronize table witch wirtual board
	function sync(board, sizeX, sizeY, tdPosition) {
		for (i=0; i < sizeY; i++) {
			for (j=0; j < sizeX; j++) {
				if (board[i][j] == 1) {
					tdPosition[i][j].classList.add("snake");
					tdPosition[i][j].classList.remove("food");
				}
				if (board[i][j] == 2) {
					tdPosition[i][j].classList.add("food");
				}
				if (board[i][j] == 0) {
					tdPosition[i][j].classList.remove("snake");
					tdPosition[i][j].classList.remove("food");
				}
			}
		}
	}
	
	// when snake should move and stop
	function snakeMove(snake, boardArr, x, y ) {	
			// if snake eat itself
			if (boardArr[snake[0][0]][snake[0][1]] == 1) {
				return;
			}
			// if snake eat red food
			if (boardArr[snake[0][0]][snake[0][1]] == 2) {
				boardArr[snake[0][0]][snake[0][1]] = 1;
				randomPixel(boardArr, x, y);
			}
			// snake move forward 
			else {
				boardArr[snake[0][0]][snake[0][1]] = 1; 
				boardArr[snake[snake.length-1][0]][snake[snake.length-1][1]] = 0;
				snake.pop();
			}
	}
	
	// in which way should snake move
	function directionMove(snake, x, y,) {
			if (direct == "left") { 
				if (prevdirect == "right") {
					snake.reverse();
					prevdirect = "";
				}
				// colllizion with left wall check
				if (snake[0][1] < 1 ) {
					return;
				} 
				// go left
				snake.unshift([snake[0][0],snake[0][1]-1]);
			}	
			if (direct == "right") { 
				if (prevdirect == "left") {
					snake.reverse();
					prevdirect = "";
				}
				if (snake[0][1] >= y-1) {
					return;
				} 
				snake.unshift([snake[0][0],snake[0][1]+1]);
			}
			if (direct == "up") { 
				if (prevdirect == "down") {
					snake.reverse();
					prevdirect = "";
				}
				if (snake[0][0] < 1) {
					return;
				} 
				snake.unshift([snake[0][0]-1,snake[0][1]]);
			}
			if (direct == "down") { 
				if (prevdirect == "up") {
					snake.reverse();
					prevdirect = "";
				}
				if (snake[0][0] >= x-1) {
					return;
				} 
				snake.unshift([snake[0][0]+1,snake[0][1]]);
			}
	}
	
	// generate food
	function randomPixel(board, sizeX, sizeY) {
		const pixelArr = [];
		for (i=0; i < sizeY; i++) {
			for (j=0; j < sizeX; j++) {
				if (board[i][j] == 0 ) {
					pixelArr.push([i,j])
				}
			}
		}
		const random = Math.floor(Math.random() * pixelArr.length);
		//console.log(pixelArr[random]); // zwraca wspolrzedne w tablicy
		//console.log(pixelArr[random][0]); // zwraca pierwsza wspolrzedna z tablicy pixelArr
		board[pixelArr[random][0]][pixelArr[random][1]] = 2;
	}
	
	// check which key was pressed
	document.addEventListener("keydown", function findKey(evt) {
    const key = evt.key;
	direction(key);
	});
	
	// setting direction for directionMove function
	function direction(key) {
		if (key == "ArrowLeft") {
			prevdirect = direct;
			direct = "left";
		}
		if (key == "ArrowRight") {
			prevdirect = direct;
			direct = "right";
		}
		if (key == "ArrowUp") {
			prevdirect = direct;
			direct = "up";
		}
		if (key == "ArrowDown") {
			prevdirect = direct;
			direct = "down";
		}
	} 
	
	const tableElements = drawTable(20,20);
	const board = tableElements[0];
	const sizeX = tableElements[1];
	const sizeY = tableElements[2];
	const tdPosition = tableElements[3];
	
	const snakee = snakeLength(board);	// snake
	
	const intervall = setInterval(function() {
			directionMove(snakee, sizeX, sizeY);
			snakeMove(snakee, board, sizeX, sizeY);
			sync(board, sizeX, sizeY, tdPosition);
		}, 300);
	
	sync(board, sizeX, sizeY, tdPosition);
	randomPixel(board, sizeX, sizeY);


	
	
});