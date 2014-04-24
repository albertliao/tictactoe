function calculateOutcome(r,c) {

	//check row for win
	var scoreArray = [];
	var matrixScore = 0;
	winMatrix = [[0,0,0],[0,0,0],[0,0,0]];
	for (var i=0; i<3; i++) {
		matrixScore += gameMatrix[r][i];
		winMatrix[r][i] = 1;
	}
	//console.log("row score:"+matrixScore);

	if (matrixScore == 3) {
		return "X";
	}
	else if (matrixScore == -3) {
		return "O";
	}

	//checking col for win
	matrixScore = 0;
	winMatrix = [[0,0,0],[0,0,0],[0,0,0]];
	for (var i=0; i<3; i++) {
		matrixScore += gameMatrix[i][c];
		winMatrix[i][c] = 1;
	}
	//console.log("col score:"+matrixScore);

	if (matrixScore == 3) {
		return "X";
	}
	else if (matrixScore == -3) {
		return "O";
	}

	//check for diagonals TL
	matrixScore = 0;
	matrixScore = gameMatrix[0][0]+gameMatrix[1][1]+gameMatrix[2][2];
	winMatrix = [[1,0,0],[0,1,0],[0,0,1]];
	//console.log("diagTL score:"+matrixScore);

	if (matrixScore == 3) {
		return "X";
	}
	else if (matrixScore == -3) {
		return "O";
	}

	//check for diagonals BL
	matrixScore = 0;
	matrixScore = gameMatrix[2][0]+gameMatrix[1][1]+gameMatrix[0][2];
	winMatrix = [[0,0,1],[0,1,0],[1,0,0]];
	//console.log("diagBL score:"+matrixScore);

	if (matrixScore == 3) {
		return "X";
	}
	else if (matrixScore == -3) {
		return "O";
	}


	//check for tie
	winMatrix = [[0,0,0],[0,0,0],[0,0,0]];
	if (movesTaken == MAX_TURNS) {
		//console.log("Game Over: Tied");
		return "Tied";
	}
	else {
		return ""; //continue game
	}

}

function TicTacController($scope,$timeout) {
	//console.log($scope);
	$scope.rows = [["", "", ""], ["","",""], ["","",""]];  //clear board
	$scope.outcome = "T3";
	$scope.gameWinner = "";
	$scope.AIOpponent = false;
	$scope.pauseMouse = false;

	$scope.showWinningCell = function(r,c) {
		return (winMatrix[r][c] == 1 && $scope.gameWinner != "");
	};

	$scope.isCellFull = function(r,c) {
		return ($scope.rows[r][c] != "" && !$scope.isGameOver() );
	};

	$scope.isGameOver = function() {
		//console.log("Game Over:"+$scope.gameWinner);
		return ($scope.gameWinner != "");
	};

	$scope.resetBoard = function() {
		$scope.rows = [["", "", ""], ["","",""], ["","",""]];
		$scope.outcome = "T3"
		gameMatrix = [[0,0,0],[0,0,0],[0,0,0]];
		$scope.gameWinner = "";
		movesTaken = 0;
		$scope.footerStyle = { "visibility":"hidden" };
		playerXTurn = true; //Player X always starts
	};

	$scope.chooseFirstCell = function() {
		
		var chosenCell = [0,0] 

		for(var i = 0; i<$scope.rows.length; i++) {
			for(var j = 0; j<$scope.rows[i].length; j++) {
				if($scope.rows[i][j] == "") {
						chosenCell[0] = i;
						chosenCell[1] = j;
						return chosenCell;
				}

			}
		}
	};

	//returns all free cells in array
	$scope.freeCells = function(matrix) {

		var freeCells = [];

		for(var i = 0; i<matrix.length; i++) {
			for(var j = 0; j<matrix[i].length; j++) {
				if(matrix[i][j] == 0) {
					freeCells.push([i,j]);
				}

			}
		}

		return freeCells;
	}

	$scope.makeMove = function(matrix, move, player) {
			var x=move[0];
			var y=move[1];
			matrix[x][y] = player;
	}

	$scope.getEnemy = function(player) {
		return (player*-1);
	}

	$scope.matrixGameWinner = function(matrix) {
		if(matrix[0][0]+matrix[1][0]+matrix[2][0] == 3)
			return "X";
		if(matrix[0][1]+matrix[1][1]+matrix[2][1] == 3)
			return "X";		
		if(matrix[0][2]+matrix[1][2]+matrix[2][2] == 3)
			return "X";

		if(matrix[0][0]+matrix[0][1]+matrix[0][2] == 3)
			return "X";	
		if(matrix[1][0]+matrix[1][1]+matrix[1][2] == 3)
			return "X";								
		if(matrix[2][0]+matrix[2][1]+matrix[2][2] == 3)
			return "X";

		if(matrix[0][0]+matrix[1][1]+matrix[2][2] == 3)
			return "X";	
		if(matrix[0][2]+matrix[1][1]+matrix[2][0] == 3)
			return "X";	

		///////////////////////////////////////////////

		if(matrix[0][0]+matrix[1][0]+matrix[2][0] == -3)
			return "O";
		if(matrix[0][1]+matrix[1][1]+matrix[2][1] == -3)
			return "O";		
		if(matrix[0][2]+matrix[1][2]+matrix[2][2] == -3)
			return "O";

		if(matrix[0][0]+matrix[0][1]+matrix[0][2] == -3)
			return "O";	
		if(matrix[1][0]+matrix[1][1]+matrix[1][2] == -3)
			return "O";								
		if(matrix[2][0]+matrix[2][1]+matrix[2][2] == -3)
			return "O";

		if(matrix[0][0]+matrix[1][1]+matrix[2][2] == -3)
			return "O";	
		if(matrix[0][2]+matrix[1][1]+matrix[2][0] == -3)
			return "O";			

		return "";												
	}

	$scope.minMaxMove = function(matrix, player) {
		var winner = $scope.matrixGameWinner(matrix);
		//console.log("Winner:"+winner);
		var best;
		var val;

		if(winner == "X") {
			return -10;
		}
		else if(winner == "O") {	
			return 10;
		}
		else if($scope.freeCells(matrix).length == 0) //tie
			return 0;

		if(player == -1)  //maximize O
			best = -1000;
		else
			best = 1000;
	
		var freeMoves = $scope.freeCells(matrix);
		//console.log("FreeMoves.length"+freeMoves.length);
		for(var move = 0; move<freeMoves.length; move++) {
			//console.log("Trying Move:"+freeMoves[move][0]+","+freeMoves[move][1]);
			$scope.makeMove(matrix, freeMoves[move], player)
			val = $scope.minMaxMove(matrix, $scope.getEnemy(player));
			//console.log("Minmax Val:"+val);
			$scope.makeMove(matrix, freeMoves[move], 0);
			if(player == -1) {//if player is O (who we want to wins)
				if(val > best)
					best = val;
			}
			else if(player == 1) {  //minimize the opponents choice
				if(val < best)
					best = val;
			}
		}
		//console.log("Returning best:"+best);
		return best;
	}

	$scope.chooseMiniMax = function() {
		var best = -1000;
		var choices = [];
		var testMatrix = window.gameMatrix.slice(0); //copy array
		var val;
		var player = -1; //computer is always O

		var freeMoves = $scope.freeCells(testMatrix);
		//console.log("Free Moves:"+freeMoves);

		//for all available moves run minmax test
		for(var move = 0; move<freeMoves.length; move++) {
			//console.log("Trying Move:"+freeMoves[move][0]+","+freeMoves[move][1]);
			$scope.makeMove(testMatrix, freeMoves[move], player);
			val = $scope.minMaxMove(testMatrix, $scope.getEnemy(player));
			//console.log("chooseMinMax val:"+val);
			$scope.makeMove(testMatrix, freeMoves[move], 0);
			if(val > best) {
				best = val;
				choices = [freeMoves[move]];
			}
			else if (val == best && best!=-1000)
				choices.push(freeMoves[move]);
		}

		//return random best choice
		//console.log("Choices:"+choices);
		return choices[Math.floor(Math.random()*choices.length)];
	};

	$scope.chooseRandom = function() {
		var choices = $scope.freeCells(gameMatrix);
		return choices[Math.floor(Math.random()*choices.length)];
	}

	$scope.pickAIMove = function() {

		// var AImove = $scope.chooseFirstCell();
		var AImove = $scope.chooseMiniMax();
		// var AImove = $scope.chooseRandom();
		var i = AImove[0];
		var j = AImove[1];
		
		if(window.playerXTurn) {
			$scope.rows[i][j] = 'X';
			gameMatrix[i][j] = 1;
			window.playerXTurn = !window.playerXTurn;
			movesTaken++;
			$scope.gameWinner = calculateOutcome(i,j);
		}
		else {
			$scope.rows[i][j] = 'O';
			gameMatrix[i][j] = -1;
			window.playerXTurn = !window.playerXTurn;
			movesTaken++;
			$scope.gameWinner = calculateOutcome(i,j);
		}

		if($scope.gameWinner != "") {
			$scope.footerStyle = { "visibility":"visible" };
			if($scope.gameWinner == "Tied")
				$scope.outcome = "Draw!";
			else
				$scope.outcome = "Player "+$scope.gameWinner+" Wins!";
		}
		//$scope.pauseMouse = false;
	};

	$scope.playerMoved = function(r,c) {
		//console.log("makemove")
		//console.log("row:"+r+" col:"+c );
		
		// if($scope.pauseMouse) //pause for timeout to execute
		// 	return;

		if ($scope.gameWinner == "" && $scope.rows[r][c] == "") {
			if (window.playerXTurn) {
				$scope.rows[r][c] = 'X';
				gameMatrix[r][c] = 1;
				window.playerXTurn = !window.playerXTurn;
				movesTaken++;	
			}
			else {
				$scope.rows[r][c] = 'O';
				gameMatrix[r][c] = -1;
				window.playerXTurn = !window.playerXTurn;
				movesTaken++;
			}

			//returns game outcome or "" if not done
			$scope.gameWinner = calculateOutcome(r,c);

			if($scope.gameWinner != "") {
				$scope.footerStyle = { "visibility":"visible" };
				if($scope.gameWinner == "Tied")
					$scope.outcome = "Draw!";
				else
					$scope.outcome = "Player "+$scope.gameWinner+" Wins!";
			}
			else if ($scope.AIOpponent) { //AI moves if activated
				//random free move
				//$scope.pauseMouse = true;
				//$timeout($scope.pickAIMove,1000);
				$scope.pickAIMove();
			}
			
		}
	};
}



window.onload = function() {
	//console.log("script start");
}

var winMatrix = [[0,0,0],[0,0,0],[0,0,0]]; //for highlighting the win cells
var gameMatrix = [[0,0,0],[0,0,0],[0,0,0]];
var playerXTurn = true;
var MAX_TURNS = 9;
var movesTaken = 0;
