
document.addEventListener('DOMContentLoaded', function() {
	
	const draw = { 
		
		// draw table and wirtual board
		drawTable: function(x, y) {
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
		},
		
		// draw snake
		drawSnake: function(board) {
			const snake = [ [19,2], [19,1], [19,0] ] ;
			for (i=0; i < snake.length; i++) {
				board[snake[i][0]][snake[i][1]] = 1;
			}	
			return snake; 
		},
		
		// synchronize table witch wirtual board
		sync: function(board, sizeX, sizeY, tdPosition) {
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
	}
	
	const move = { 	
		
		gamePlay: true,
		
		// when snake should move and stop
		snakeMove: function(snake, boardArr, x, y ) {	
				// if snake eat itself
				if (boardArr[snake[0][0]][snake[0][1]] == 1) {
					winning.gameOver();
					this.gamePlay = false;
					return;
				}
				// if snake eat red food
				if (boardArr[snake[0][0]][snake[0][1]] == 2) {
					boardArr[snake[0][0]][snake[0][1]] = 1;
					setScore.countScore();
					setScore.getAndShowScore();
					randomFoodPixel.generateAndSetRandomFoodPixel(board, sizeX, sizeY);;
				}
				// snake move forward 
				else {
					boardArr[snake[0][0]][snake[0][1]] = 1; 
					boardArr[snake[snake.length-1][0]][snake[snake.length-1][1]] = 0;
					snake.pop();
				}
		},
		
		// in which way should snake move
		directionMove: function(snake, x, y, direct, prevdirect) {
				if (direct == "left") { 
					move.goLeft(snake, x, y, direct, prevdirect);
				}	
				if (direct == "right") { 
					move.goRight(snake, x, y, direct, prevdirect);
				}
				if (direct == "up") { 
					move.goUp(snake, x, y, direct, prevdirect);
				}
				if (direct == "down") { 
					move.goDown(snake, x, y, direct, prevdirect);
				}
		},		
		
		goLeft: function(snake, x, y, direct, prevdirect) {
			// if snake goes right and left arrow is clicked, snake go right still
			if (prevdirect == "right") {
				move.goRight(snake, x, y, direct, prevdirect);
				direct = "right";
				SetAndReadDirection.direction(direct);
				return;
			}
			// colllizion with left wall check
			if (snake[0][1] < 1 ) {
				this.gamePlay = false;
				return;
			} 
			// go left
			snake.unshift([snake[0][0],snake[0][1]-1]);
		},
		
		goRight: function(snake, x, y, direct, prevdirect) {
			if (prevdirect == "left") {
				move.goLeft(snake, x, y, direct, prevdirect);
				direct = "left";
				SetAndReadDirection.direction(direct);
				return;
			}
			if (snake[0][1] >= y-1) {
				this.gamePlay = false;
				return;
			} 
			snake.unshift([snake[0][0],snake[0][1]+1]);
		},
		
		goUp: function(snake, x, y, direct, prevdirect) {
			if (prevdirect == "down") {
				move.goDown(snake, x, y, direct, prevdirect);
				direct = "down";
				SetAndReadDirection.direction(direct);
				return;
			}
			if (snake[0][0] < 1) {
				this.gamePlay = false;
				return;
			} 
			snake.unshift([snake[0][0]-1,snake[0][1]]);
		},
		
		goDown: function(snake, x, y, direct, prevdirect) {
			if (prevdirect == "up") {
				move.goUp(snake, x, y, direct, prevdirect);
				direct = "up";
				SetAndReadDirection.direction(direct);
				return;
			}
			if (snake[0][0] >= x-1) {
				this.gamePlay = false;
				return;
			} 
			snake.unshift([snake[0][0]+1,snake[0][1]]);
		},
		
		returnGameplay: function(){
			return this.gamePlay;
		}
	}
		
	const randomFoodPixel = { 
	
		generateAndSetRandomFoodPixel: function(board, sizeX, sizeY) {
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
			winning.checkWin(pixelArr);
		}
	}
		
		// check which key was pressed
	const addListener = { 
	
		listener: function() { 
			document.addEventListener("keydown", function findKey(evt) {
			const key = evt.key;
			SetAndReadDirection.arrow(key);
			})
		}
	}	
		
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
			
		createScoreBox: function()  {
		const createScoreDiv = document.createElement("div");
		createScoreDiv.id = "score";
		container.appendChild(createScoreDiv);
		},
		
		countScore: function() {
			this.score += 10;
		},
		
		getAndShowScore: function() {
			const getScore = document.getElementById("score");
			getScore.innerText = "Score: " + this.score;
		},
		
		returnScore: function() {
			console.log("this.score: ", this.score)
			return this.score;
		}
	}
		
	const winning = { 
	
		checkWin: function(pixelArr) {
			const three = (sizeX*sizeY)-(sizeX*sizeY-3);
			if (pixelArr.length < three) {
				winning.showWin();
				move.returnGameplay = false;
			}
		},
		
		showWin: function() {
			const winDiv = document.createElement("div");
			winDiv.id = "winDiv";
			winDiv.classList.add("winDiv");
			winDiv.innerText = "Yeah! YOU WIN!"
			container.appendChild(winDiv);
			winning.playAgain(winDiv);
		},
		
		gameOver: function() {
			const gameOverDiv = document.createElement("div");
			gameOverDiv.id = "gameOverDiv";
			gameOverDiv.innerText = "GAME OVER"
			container.appendChild(gameOverDiv);
			winning.playAgain(gameOverDiv);
		},
		
		playAgain: function(playAgainParent) {
			const playAgainButton = document.createElement("button");
			playAgainButton.id = "playAgain";
			playAgainButton.innerText = "Play Again";
			playAgainParent.appendChild(playAgainButton);
			winning.resetGame(playAgainButton);
		},
		
		resetGame: function(playAgainButton) {
			playAgainButton.addEventListener("click", function() {
				location.reload();
			})
		},
	}
		
	const setTime = { 
		// Speed up snake when score grow
		time: function() {
			const scoreQuantity = setScore.returnScore();
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
		},
		
		loop: function() {
			if (move.returnGameplay() == false) {
				return;
			}
			move.directionMove(snakee, sizeX, sizeY, SetAndReadDirection.direction()[0], SetAndReadDirection.direction()[1]);
			move.snakeMove(snakee, board, sizeX, sizeY);
			draw.sync(board, sizeX, sizeY, tdPosition);
			console.log("idzie");
			setTimeout(setTime.loop, setTime.time());
		}
	}	
	
	const container = document.getElementById("container");
	
	const tableElements = draw.drawTable(20,20);
	const board = tableElements[0];
	const sizeX = tableElements[1];
	const sizeY = tableElements[2];
	const tdPosition = tableElements[3];
		
	const snakee = draw.drawSnake(board);				// returns snake
	
	addListener.listener();
	tableElements;
	draw.sync(board, sizeX, sizeY, tdPosition);
	randomFoodPixel.generateAndSetRandomFoodPixel(board, sizeX, sizeY);
	setScore.createScoreBox();
	setScore.getAndShowScore(setScore.score);
	setTime.loop();
	
	
});