function calculateOutcome(r,c) {

	//check row for win
	var matrixScore = 0;
	for (var i=0; i<3; i++) {
		matrixScore += gameMatrix[r][i];
	}
	console.log("row score:"+matrixScore);

	if (matrixScore == 3) {
		return "X";
	}
	else if (matrixScore == -3) {
		return "O";
	}

	//checking col for win
	matrixScore = 0;
	for (var i=0; i<3; i++) {
		matrixScore += gameMatrix[i][c];
	}
	console.log("col score:"+matrixScore);

	if (matrixScore == 3) {
		return "X";
	}
	else if (matrixScore == -3) {
		return "O";
	}

	//check for diagonals TL
	matrixScore = 0;
	matrixScore = gameMatrix[0][0]+gameMatrix[1][1]+gameMatrix[2][2];
	console.log("diagTL score:"+matrixScore);

	if (matrixScore == 3) {
		return "X";
	}
	else if (matrixScore == -3) {
		return "O";
	}

	//check for diagonals BL
	matrixScore = 0;
	matrixScore = gameMatrix[2][0]+gameMatrix[1][1]+gameMatrix[0][2];
	console.log("diagBL score:"+matrixScore);

	if (matrixScore == 3) {
		return "X";
	}
	else if (matrixScore == -3) {
		return "O";
	}


	//check for tie
	if (movesTaken == MAX_TURNS) {
		console.log("Game Over: Tied");
		return "Tied";
	}
	else {
		return ""; //continue game
	}

}

function TicTacController($scope)
{
	console.log($scope);
	$scope.rows = [["", "", ""], ["","",""], ["","",""]];  //clear board
	$scope.outcome = ""

	$scope.playerMoved = function(r,c) {
		console.log("makemove")
		console.log("row:"+r+" col:"+c );
		
		if (window.gameWinner == "" && $scope.rows[r][c] == "") {
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
			window.gameWinner = calculateOutcome(r,c);

			if(window.gameWinner != "") {
				if(window.gameWinner == "Tied")
					$scope.outcome = "Draw!";
				else
					$scope.outcome = "Player "+gameWinner+" Wins!";
			}
				
		}
		
	};
}

function resetBoard() {}
function gameEnd() {
	console.log("Game Over:"+gameWinner+" has won.");
}
function gameStart() {

	//while game not over
		//first player turn  (can use one player function, toggle global var)
		//if game over -> end  
		//else second player turn
		//if game over -> end

}

window.onload = function() {
	console.log("script start");

	gameStart();
}

var gameMatrix = [[0,0,0],[0,0,0],[0,0,0]];
var gameWinner = "";
var playerXTurn = true;
var MAX_TURNS = 9;
var movesTaken = 0;
