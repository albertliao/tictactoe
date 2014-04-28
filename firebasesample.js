var blankBoard = [[0,0,0],[0,0,0],[0,0,0]];
var gameApp = angular.module('gameApp', ["firebase"]);
gameApp.controller('TicTacController', function($scope, $firebase){

	// $scope.countX = 0;
	// $scope.countO = 0;
	// $scope.game.rows = [ [0,0,0],[0,0,0],[0,0,0] ];
	// // Track if we're player 1 or 2
var playerNum = null;

		var ticTacRef = new Firebase("https://kotic.firebaseio.com/games");
			var lastGame;
			// Ask for all existing game info from firebase
			ticTacRef.once('value', function(gamesSnapshot) {
				// get the actual games data
			  var games = gamesSnapshot.val();
				if(games == null)
				{
					// No games at all, so make a new game -- As if we're Areg
					lastGame = ticTacRef.push( {waiting: true} );
					playerNum = 1;
				}
				else	// I do have at least one game out there...
				{
				  var keys = Object.keys(games);
				  var lastGameKey = keys[ keys.length - 1 ];
				  var lastGame = games[ lastGameKey ];
					console.log("This person's game: " + lastGameKey);
				  if(lastGame.waiting)
				  {
				  	// Currently someone is waiting -- Areg is there and we're Rocky
				  	// Grab from Firebase its last game object
				  	lastGame = ticTacRef.child(lastGameKey);
				  	// Set a new game on this
				  	lastGame.set( {countX: 0, countO: 0, waiting:false, playerTurn: 0, won: 
				  		false, rows: blankBoard } );
				  	playerNum = 2;
				  }
				  else
				  {
				  	// Make a new game -- As if we're Areg
						lastGame = ticTacRef.push( {waiting: true} );
						playerNum = 1;
				  }
				
				// Attach the last game to what we're up to
			  $scope.game = $firebase(lastGame);
			

		};
	});

	
	var turn = true;

	$scope.playerTurn = function(r, c)
	{
		//if ($scope.gameSt == 0){
			//console.log($scope.gameSt == 0)
		
		if($scope.game.rows[r][c] != 0)
		{
			turn = false;
		}
		else if(turn === true)
		{
			$scope.game.rows[r][c] = 1;	// X
			turn = false;
			//turnCount++;
		}
		else
		{
			$scope.game.rows[r][c] = -1;	// O
			turn = true;
		}
		$scope.game.$save();
		// Test various win conditions
		if(Math.abs($scope.game.rows[0][0] + $scope.game.rows[0][1] + $scope.game.rows[0][2]) == 3){
			$scope.playerWon("top row", $scope.game.rows[0][0])
				
				if($scope.game.rows[0][0] == 1) {
					$scope.countX++;
				}else{
					$scope.countO++;
				} 
			};
		
		if(Math.abs($scope.game.rows[1][0] + $scope.game.rows[1][1] + $scope.game.rows[1][2]) == 3){
			$scope.playerWon("middle row", $scope.game.rows[1][2]);

				if($scope.game.rows[1][2] == 1) {
					$scope.countX++;
				}else{
					$scope.countO++;
				} 
			};
		
		if(Math.abs($scope.game.rows[2][0] + $scope.game.rows[2][1] + $scope.game.rows[2][2]) == 3){
			$scope.playerWon("bottom row", $scope.game.rows[2][0]);

				if($scope.game.rows[2][0] == 1) {
					$scope.countX++;
				}else{
					$scope.countO++;
				} 
			};
		
		if(Math.abs($scope.game.rows[0][0] + $scope.game.rows[1][1] + $scope.game.rows[2][2]) == 3){
			$scope.playerWon("\\", $scope.game.rows[1][1]);

				if($scope.game.rows[1][1] == 1) {
					$scope.countX++;
				}else{
					$scope.countO++;
				} 
			};
		
		if(Math.abs($scope.game.rows[0][2] + $scope.game.rows[1][1] + $scope.game.rows[2][0]) == 3){
			$scope.playerWon("/", $scope.game.rows[2][0]);

				if($scope.game.rows[2][0] == 1) {
					$scope.countX++;
				}else{
					$scope.countO++;
				} 
			};
		
		if(Math.abs($scope.game.rows[0][0] + $scope.game.rows[1][0] + $scope.game.rows[2][0]) == 3){
			$scope.playerWon("right |", $scope.game.rows[1][0]);

				if($scope.game.rows[1][0] == 1) {
					$scope.countX++;
				}else{
					$scope.countO++;
				} 
			};

		if(Math.abs($scope.game.rows[0][2] + $scope.game.rows[1][2] + $scope.game.rows[2][2]) == 3){
			$scope.playerWon("left |", $scope.game.rows[2][2]);
		
				if($scope.game.rows[0][0] == 1) {
					$scope.countX++;
				}else{
					$scope.countO++;
				} 

			};
		
		if(Math.abs($scope.game.rows[0][1] + $scope.game.rows[1][1] + $scope.game.rows[2][1]) == 3){
			$scope.playerWon("middle |", $scope.game.rows[2][1]);
			
			if($scope.game.rows[0][0] == 1) {
					$scope.countX++;
				}else{
					$scope.countO++;
				}
		};	
		if(Math.abs($scope.game.rows[0][0] + $scope.game.rows[0][1] + $scope.game.rows[0][2] + $scope.game.rows[0][3] + $scope.game.rows[1][0] + $scope.game.rows[1][1] + $scope.game.rows[1][2] + $scope.game.rows[2][0] + $scope.game.rows[2][1]) + $scope.game.rows[2][2] == 9){
			$scope.playerWon("Tie", $scope.game.rows[2][2]);
		
			
				if($scope.game.rows[0][0] == 1) {
						$scope.countX++;
					}else{
						$scope.countO++;
					}
		};	
};
	// Show an alert if one of the tested directions is a win
	$scope.playerWon = function(descrip, player)
	{
		// Some example text that could be shown: "X won by diagonal"
		alert( ((player == 1)?"X" : "O") + " won by " + descrip);

	}
	$scope.playerTie = function()
	{
		alert("Tie Game!");

	}
	 	//Play Again button without loosing the scores
	$scope.playAg = function(){
	$scope.game.rows = blankBoard;
		
	};
		//Reset the entire game
	$scope.reset = function(){
		$scope.game.rows = blankBoard;
		$scope.countX = 0;
		$scope.countO = 0;
	};

});