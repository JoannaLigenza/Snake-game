
document.addEventListener('DOMContentLoaded', function() {
	
	const container = document.getElementById("container");
	let gamePlay = true;
	
	// draw table and wirtual board
	function drawTable(x, y) {
		const table = document.createElement("table");
		container.appendChild(table);
		const boardArr = [];
		const position = [];
		for (i=0; i < y; i++) {
			const tr = document.createElement("tr");
			table.appendChild(tr);
			boardArr[i] = [];
			position[i] = [];
			//position.push(tr);
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
				gameOver();
				gamePlay = false;
				return;
			}
			// if snake eat red food
			if (boardArr[snake[0][0]][snake[0][1]] == 2) {
				boardArr[snake[0][0]][snake[0][1]] = 1;
				scoreQuantity += 10;
				getAndShowScore(scoreQuantity)
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
	function directionMove(snake, x, y, direct, prevdirect) {
			if (direct == "left") { 
				goLeft(snake, x, y, direct, prevdirect);
			}	
			if (direct == "right") { 
				goRight(snake, x, y, direct, prevdirect);
			}
			if (direct == "up") { 
				goUp(snake, x, y, direct, prevdirect);
			}
			if (direct == "down") { 
				goDown(snake, x, y, direct, prevdirect);
			}
	} 
	
	
	function goLeft(snake, x, y, direct, prevdirect) {
		// if snake goes right and left arrow is clicked, snake go right still
		if (prevdirect == "right") {
			goRight(snake, x, y, direct, prevdirect);
			direct = "right";
			SetAndReadDirection.direction(direct);
			return;
		}
		// colllizion with left wall check
		if (snake[0][1] < 1 ) {
			gamePlay = false;
			return;
		} 
		// go left
		snake.unshift([snake[0][0],snake[0][1]-1]);
	}
	
	function goRight(snake, x, y, direct, prevdirect) {
		if (prevdirect == "left") {
			goLeft(snake, x, y, direct, prevdirect);
			direct = "left";
			SetAndReadDirection.direction(direct);
			return;
		}
		if (snake[0][1] >= y-1) {
			gamePlay = false;
			return;
		} 
		snake.unshift([snake[0][0],snake[0][1]+1]);
	}
	
	function goUp(snake, x, y, direct, prevdirect) {
		if (prevdirect == "down") {
			goDown(snake, x, y, direct, prevdirect);
			direct = "down";
			SetAndReadDirection.direction(direct);
			return;
		}
		if (snake[0][0] < 1) {
			gamePlay = false;
			return;
		} 
		snake.unshift([snake[0][0]-1,snake[0][1]]);
	}
	
	function goDown(snake, x, y, direct, prevdirect) {
		if (prevdirect == "up") {
			goUp(snake, x, y, direct, prevdirect);
			direct = "up";
			SetAndReadDirection.direction(direct);
			return;
		}
		if (snake[0][0] >= x-1) {
			gamePlay = false;
			return;
		} 
		snake.unshift([snake[0][0]+1,snake[0][1]]);
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
		checkWin(pixelArr);
	}
	
	// check which key was pressed
	document.addEventListener("keydown", function findKey(evt) {
    const key = evt.key;
	SetAndReadDirection.arrow(key);
	}); 
	
	
	const SetAndReadDirection = {
		direct: "right",
		prevdirect: "",
		
		arrow: function(key) {
		// setting direction for directionMove function
		if (key == "ArrowLeft") {
			this.prevdirect = this.direct;
			this.direct = "left";
		}
		if (key == "ArrowRight") {
			this.prevdirect = this.direct;
			this.direct = "right";
		}
		if (key == "ArrowUp") {
			this.prevdirect = this.direct;
			this.direct = "up";
		}
		if (key == "ArrowDown") {
			this.prevdirect = this.direct;
			this.direct = "down";
		} 
	},
		
		direction: function(direct) {
			this.direct = direct || this.direct;
			return [this.direct, this.prevdirect];
		}	
	}
	
	const setScore = {
		score: 0,
		
		createScoreBox: function(scoreQuantity)  {
		const createScoreDiv = document.createElement("div");
		createScoreDiv.id = "score";
		container.appendChild(createScoreDiv);
		},
		
		returnScore: function() {
			return this.score;
		}
	}
	
	function getAndShowScore(scoreQuantity) {
		const getScore = document.getElementById("score");
		getScore.innerText = "Score: " + scoreQuantity;
	}
	
	function checkWin(pixelArr) {
		const three = (sizeX*sizeY)-(sizeX*sizeY-3);
		if (pixelArr.length < three) {
			showWin();
			gamePlay = false;
		}
	}
	
	function showWin() {
		const winDiv = document.createElement("div");
		winDiv.id = "winDiv";
		winDiv.classList.add("winDiv");
		winDiv.innerText = "Yeah! YOU WIN!"
		container.appendChild(winDiv);
		playAgain(winDiv);
	}
	
	function gameOver() {
		const gameOverDiv = document.createElement("div");
		gameOverDiv.id = "gameOverDiv";
		gameOverDiv.innerText = "GAME OVER"
		container.appendChild(gameOverDiv);
		playAgain(gameOverDiv);
	}
	
	function playAgain(playAgainParent) {
		const playAgainButton = document.createElement("button");
		playAgainButton.id = "playAgain";
		playAgainButton.innerText = "Play Again";
		playAgainParent.appendChild(playAgainButton);
		resetGame(playAgainButton);
	}
	
	function resetGame(playAgainButton) {
		playAgainButton.addEventListener("click", function() {
			location.reload();
		})
	}
	
	// Speed up snake when score grow
	function time() {
		let timer;
		if (scoreQuantity >= 0 && scoreQuantity < 50) {
			timer = 300;
		}
		if (scoreQuantity >= 50 && scoreQuantity < 100) {
			timer = 200;
		}
		if (scoreQuantity >= 100 && scoreQuantity < 150) {
			timer = 150;
		}
		if (scoreQuantity >= 150 && scoreQuantity < 200) {
			timer = 100;
		}
		if (scoreQuantity >= 200 && scoreQuantity < 300) {
			timer = 70;
		}
		if (scoreQuantity >= 300) {
			timer = 50;
		}
		return timer;
	}
	
	
	const tableElements = drawTable(20,20);
	const board = tableElements[0];
	const sizeX = tableElements[1];
	const sizeY = tableElements[2];
	const tdPosition = tableElements[3];
	
	const snakee = snakeLength(board);				// returns snake
	let scoreQuantity = setScore.returnScore(); 	// returns score
	
	function loop() {
		if (gamePlay == false) {
			return;
		}
		directionMove(snakee, sizeX, sizeY, SetAndReadDirection.direction()[0], SetAndReadDirection.direction()[1]);
		snakeMove(snakee, board, sizeX, sizeY);
		sync(board, sizeX, sizeY, tdPosition);
		console.log("idzie");
		setTimeout(loop, time());
	}
	
	
	sync(board, sizeX, sizeY, tdPosition);
	randomPixel(board, sizeX, sizeY);
	setScore.createScoreBox(scoreQuantity);
	getAndShowScore(scoreQuantity);
	loop();
	console.log((sizeX*sizeY)-(sizeX*sizeY-3));

});