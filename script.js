function calculateOutcome(r,c) {

	//check row for win
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

function TicTacController($scope)
{
	//console.log($scope);
	$scope.rows = [["", "", ""], ["","",""], ["","",""]];  //clear board
	$scope.outcome = "T3";
	$scope.gameWinner = "";

	$scope.showWinningCell = function(r,c) {
		return (winMatrix[r][c] == 1 && $scope.gameWinner != "");
	}

	$scope.isCellFull = function(r,c) {
		return ($scope.rows[r][c] != "" && !$scope.isGameOver() );
	}

	$scope.isGameOver = function() {
		//console.log("Game Over:"+$scope.gameWinner);
		return ($scope.gameWinner != "");
	}

	$scope.resetBoard = function() {
		$scope.rows = [["", "", ""], ["","",""], ["","",""]];
		$scope.outcome = "T3"
		gameMatrix = [[0,0,0],[0,0,0],[0,0,0]];
		$scope.gameWinner = "";
		movesTaken = 0;
		$scope.footerStyle = { "display":"none" };
	}

	$scope.playerMoved = function(r,c) {
		//console.log("makemove")
		//console.log("row:"+r+" col:"+c );
		
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
				$scope.footerStyle = { "display":"block" }; //adjust style to block;
				if($scope.gameWinner == "Tied")
					$scope.outcome = "Draw!";
				else
					$scope.outcome = "Player "+$scope.gameWinner+" Wins!";
			}
				
		}
		
	};
}



window.onload = function() {
	//console.log("script start");
}

var winMatrix = [[0,0,0],[0,0,0],[0,0,0]];
var gameMatrix = [[0,0,0],[0,0,0],[0,0,0]];
var playerXTurn = true;
var MAX_TURNS = 9;
var movesTaken = 0;
