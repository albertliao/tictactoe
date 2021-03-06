angular.module("TTTApp", ["firebase"]).
controller("TicTacController", function($scope,$timeout,$firebase) {
	$scope.outcome = "T3";
	$scope.AIOpponent = false;
	$scope.pauseMouse = false;
	$scope.game = { 
		"rows": [["", "", ""], ["","",""], ["","",""]], 
		"movesTaken":0, 
		"gameComplete":false, 
		"gameWinner":"",
		"winMatrix":[[0,0,0],[0,0,0],[0,0,0]],
		"gameMatrix":[[0,0,0],[0,0,0],[0,0,0]],
		"scoreX":0,
		"scoreO":0
	};  //clear board
	var blankBoard = [["", "", ""], ["","",""], ["","",""]];  //clear board
	var firebaseURL = "https://ticytacy.firebaseio.com/games"
	var ticTacRef = new Firebase(firebaseURL);
	var networkPlayer = null;
	var lastGame;
	var networkGame = false;

	$scope.calculateOutcome = function(r,c) {

		//check row for win
		var scoreArray = [];
		var matrixScore = 0;
		$scope.game.winMatrix = [[0,0,0],[0,0,0],[0,0,0]];
		for (var i=0; i<3; i++) {
			matrixScore += $scope.game.gameMatrix[r][i];
			$scope.game.winMatrix[r][i] = 1;
		}
		if(networkGame)
			$scope.game.$save();

		if (matrixScore == 3) {
			$scope.game.scoreX++;
			return "X";
		}
		else if (matrixScore == -3) {
			$scope.game.scoreO++;
			return "O";
		}

		//checking col for win
		matrixScore = 0;
		$scope.game.winMatrix = [[0,0,0],[0,0,0],[0,0,0]];
		for (var i=0; i<3; i++) {
			matrixScore += $scope.game.gameMatrix[i][c];
			$scope.game.winMatrix[i][c] = 1;
		}
		if(networkGame)
			$scope.game.$save();

		if (matrixScore == 3) {
			$scope.game.scoreX++;
			return "X";
		}
		else if (matrixScore == -3) {
			$scope.game.scoreO++;
			return "O";
		}

		//check for diagonals TL
		matrixScore = 0;
		matrixScore = $scope.game.gameMatrix[0][0]+$scope.game.gameMatrix[1][1]+$scope.game.gameMatrix[2][2];
		$scope.game.winMatrix = [[1,0,0],[0,1,0],[0,0,1]];

		if(networkGame)
			$scope.game.$save();

		if (matrixScore == 3) {
			$scope.game.scoreX++;
			return "X";
		}
		else if (matrixScore == -3) {
			$scope.game.scoreO++;
			return "O";
		}

		//check for diagonals BL
		matrixScore = 0;
		matrixScore = $scope.game.gameMatrix[2][0]+$scope.game.gameMatrix[1][1]+$scope.game.gameMatrix[0][2];
		$scope.game.winMatrix = [[0,0,1],[0,1,0],[1,0,0]];

		if(networkGame)
			$scope.game.$save();

		if (matrixScore == 3) {
			$scope.game.scoreX++;
			return "X";
		}
		else if (matrixScore == -3) {
			$scope.game.scoreO++;
			return "O";
		}


		//check for tie
		$scope.game.winMatrix = [[0,0,0],[0,0,0],[0,0,0]];
		if(networkGame)
			$scope.game.$save();
		if ($scope.game.movesTaken == MAX_TURNS) {
			return "Tied";
		}
		else {
			return ""; //continue game
		}

	}

	$scope.resetBoard = function() {
		$scope.game.rows = [["", "", ""], ["","",""], ["","",""]];
		$scope.outcome = "T3"
		$scope.game.gameMatrix = [[0,0,0],[0,0,0],[0,0,0]];
		$scope.game.gameWinner = "";
		$scope.game.movesTaken = 0;
		$scope.footerStyle = { "visibility":"hidden" };
		playerXTurn = true; //Player X always starts
		$scope.game.gameComplete = false;
		if(networkGame) { //alternate player turn
			$scope.game.$save();
		}
	};

	$scope.exitNetworkGame = function() {
		networkGame = false;
		$scope.game = { 
			"rows": [["", "", ""], ["","",""], ["","",""]], 
			"movesTaken":0, 
			"gameComplete":false, 
			"gameWinner":"",
			"winMatrix":[[0,0,0],[0,0,0],[0,0,0]],
			"gameMatrix":[[0,0,0],[0,0,0],[0,0,0]],
			"scoreX":0,
			"scoreO":0
		};  //clear board
    $scope.outcome = "T3";
		$scope.footerStyle = { "visibility":"hidden" };
		playerXTurn = true; //Player X always starts
	}

	$scope.playNetworkGame = function() {

		networkGame = true;
		// Ask for info from firebase
		ticTacRef.once('value', function(gamesSnapshot) {
			// get the actual games data
		  	var games = gamesSnapshot.val();
			if(games == null)
			{
				// No games at all, so make a new game -- As if we're Areg
				lastGame = ticTacRef.push( { scoreX: 0, scoreO: 0, waiting:true, movesTaken: 0, gameComplete: 
			  		false, rows: blankBoard, gameWinner: "", "winMatrix":[[0,0,0],[0,0,0],[0,0,0]], "gameMatrix":[[0,0,0],[0,0,0],[0,0,0]] } );
				$scope.networkPlayer = 1;
				$scope.outcome = "Connecting...";
				$scope.game.$save;
			}
			else	// I do have at least one game out there...
			{
				var keys = Object.keys(games);
			  var lastGameKey = keys[ keys.length - 1 ];
			  var lastGame = games[ lastGameKey ];
			  console.log("LastGame", lastGame);
				console.log("LastGameKey",lastGameKey);
				console.log("games",games);
			  	if(lastGame.waiting)
			  	{
			  		// Currently someone is waiting -- Areg is there and we're Rocky
			  		// Grab from Firebase its last game object
			  		lastGame = ticTacRef.child(lastGameKey);
			  		console.log("LastGameWaiting", lastGame);
			  		// Set a new game on this
			  		lastGame.update( { waiting:false } );
			  		$scope.networkPlayer = 2;
			  	}
			  	else
			  	{
			  		// Make a new game -- As if we're Areg
					lastGame = ticTacRef.push( { scoreX: 0, scoreO: 0, waiting:true, movesTaken: 0, gameComplete: 
			  		false, rows: blankBoard, gameWinner: "", "winMatrix":[[0,0,0],[0,0,0],[0,0,0]], "gameMatrix":[[0,0,0],[0,0,0],[0,0,0]] } );
					$scope.networkPlayer = 1;
					$scope.outcome = "Connecting...";
				}
			}
			  // Show the actual last game!
			  console.log("Connecting to Firebase");
		  	$scope.game = $firebase(lastGame);

		  	$scope.game.$on("change", function() {
				if($scope.game.waiting == false) {
					if($scope.game.movesTaken % 2 == 0 && $scope.networkPlayer == 1)
						$scope.outcome = "Make Move";
					else if ($scope.game.movesTaken % 2 != 0 && $scope.networkPlayer == 2)
						$scope.outcome = "Make Move";
					else
						$scope.outcome = "Waiting..."
				}


				if($scope.game.gameComplete) {
					$scope.footerStyle = { "visibility":"visible" };
					if($scope.game.gameWinner == "Tied")
						$scope.outcome = "Draw!";
					else 
            $scope.outcome = "Player "+$scope.game.gameWinner+" Wins!";

          //alternate starting player for network games
					if($scope.networkPlayer == 1)
						$scope.networkPlayer = 2;
					else
						$scope.networkPlayer = 1;
				}
				else
					$scope.footerStyle = { "visibility":"hidden" };
			});

		});

	};

	$scope.showWinningCell = function(r,c) {
		return ($scope.game.winMatrix[r][c] == 1 && $scope.game.gameWinner != "");
	};

	$scope.isCellFull = function(r,c) {
		return ($scope.game.rows[r][c] != "" && !$scope.isGameOver() );
	};

	$scope.isGameOver = function() {
		return ($scope.game.gameWinner != "");
	};

	$scope.chooseFirstCell = function() {
		
		var chosenCell = [0,0] 

		for(var i = 0; i<$scope.game.rows.length; i++) {
			for(var j = 0; j<$scope.game.rows[i].length; j++) {
				if($scope.game.rows[i][j] == "") {
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

		for(var move = 0; move<freeMoves.length; move++) {
			$scope.makeMove(matrix, freeMoves[move], player)
			val = $scope.minMaxMove(matrix, $scope.getEnemy(player));
			$scope.makeMove(matrix, freeMoves[move], 0);
			if(player == -1) { //if player is O (who we want to wins)
				if(val > best)
					best = val;
			}
			else if(player == 1) {  //minimize the opponents choice
				if(val < best)
					best = val;
			}
		}

		return best;
	}

	$scope.chooseMiniMax = function() {
		var best = -1000;
		var choices = [];
		var testMatrix = $scope.game.gameMatrix.slice(0); //copy array
		var val;
		var player = -1; //computer is always O

		var freeMoves = $scope.freeCells(testMatrix);

		//for all available moves run minmax test
		for(var move = 0; move<freeMoves.length; move++) {
			$scope.makeMove(testMatrix, freeMoves[move], player);
			val = $scope.minMaxMove(testMatrix, $scope.getEnemy(player));
			$scope.makeMove(testMatrix, freeMoves[move], 0);
			if(val > best) {
				best = val;
				choices = [freeMoves[move]];
			}
			else if (val == best && best!=-1000)
				choices.push(freeMoves[move]);
		}

		//return random best choice
		return choices[Math.floor(Math.random()*choices.length)];
	};

	$scope.chooseRandom = function() {
		var choices = $scope.freeCells($scope.game.gameMatrix);
		return choices[Math.floor(Math.random()*choices.length)];
	}

	$scope.pickAIMove = function() {

		// var AImove = $scope.chooseFirstCell();
		var AImove = $scope.chooseMiniMax();
		// var AImove = $scope.chooseRandom();
		var i = AImove[0];
		var j = AImove[1];
		
		if(window.playerXTurn) {
			$scope.game.rows[i][j] = 'X';
			$scope.game.gameMatrix[i][j] = 1;
			window.playerXTurn = !window.playerXTurn;
			$scope.game.movesTaken++;
			$scope.game.gameWinner = $scope.calculateOutcome(i,j);
		}
		else {
			$scope.game.rows[i][j] = 'O';
			$scope.game.gameMatrix[i][j] = -1;
			window.playerXTurn = !window.playerXTurn;
			$scope.game.movesTaken++;
			$scope.game.gameWinner = $scope.calculateOutcome(i,j);
		}

		if($scope.game.gameWinner != "") {
			$scope.footerStyle = { "visibility":"visible" };
			if($scope.game.gameWinner == "Tied")
				$scope.outcome = "Draw!";
			else
				$scope.outcome = "Player "+$scope.game.gameWinner+" Wins!";
		}
	};

	$scope.playerMoved = function(r,c) {
		if(networkGame) {
			console.log("Player",$scope.networkPlayer);
			if(($scope.game.movesTaken % 2 != 0 && $scope.networkPlayer == 1) || ($scope.game.movesTaken % 2 == 0 && $scope.networkPlayer == 2)) //don't let wrong player move
				return;
		}
					

		if ($scope.game.gameWinner == "" && $scope.game.rows[r][c] == "") {
			if ((!networkGame && window.playerXTurn) || (networkGame && $scope.game.movesTaken % 2 == 0)) {
				$scope.game.rows[r][c] = 'X';
				$scope.game.gameMatrix[r][c] = 1;
				window.playerXTurn = !window.playerXTurn;
				$scope.game.movesTaken++;	
			}
			else {
				$scope.game.rows[r][c] = 'O';
				$scope.game.gameMatrix[r][c] = -1;
				window.playerXTurn = !window.playerXTurn;
				$scope.game.movesTaken++;
			}
			
			if(networkGame)
				$scope.game.$save();

			//returns game outcome or "" if not done
			$scope.game.gameWinner = $scope.calculateOutcome(r,c);

			if($scope.game.gameWinner != "") {
				$scope.game.gameComplete = true;
				console.log("ScoreX",$scope.game.scoreX);
				console.log("ScoreO",$scope.game.scoreO);
				if(networkGame)
					$scope.game.$save();
				else { 
					//display win for local game, network game is displayed in $on function 
					$scope.footerStyle = { "visibility":"visible" };
					if($scope.game.gameWinner == "Tied")
						$scope.outcome = "Draw!";
					else
						$scope.outcome = "Player "+$scope.game.gameWinner+" Wins!";
				}
			}
			else if ($scope.AIOpponent) { //AI moves if activated
				$scope.pickAIMove();
			}
			
		}
	};
});

var playerXTurn = true;
var MAX_TURNS = 9;
