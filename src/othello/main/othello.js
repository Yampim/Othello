
var WHITE = 1;
var BLACK = 2;

var rows = 8;
var columns = 8;
var constBoardState = [];
var priorityBoard = [[1,6,2,4,4,2,6,1],
					 [6,6,5,5,5,5,6,6],
					 [2,2,2,3,3,2,5,2],
					 [4,5,3,0,0,3,5,4],
					 [4,5,3,0,0,3,5,4],
					 [2,5,2,3,3,2,5,2],
					 [6,6,5,5,5,5,6,6],
					 [1,6,2,4,4,2,6,1]];

var turn = 1;
var player = BLACK;
var enemy = WHITE;

var enemyIndexList = [-1 ,0 ,1 ];

$(initializeState);

$(initializeOsero);

function initializeState() {
	
	  constBoardState = [];
	  player = BLACK;
	  enemy = WHITE;
	  
	  for (var x = 0; x < rows; x++) {
		  var rowBoardState = [];
		  for (var y = 0; y < columns; y++) {				 
			  if ((x == (rows/2)-1 && y == (columns/2)-1)||(x == rows/2 && y == columns/2)) {
				  rowBoardState.push(WHITE);
			  }
			  else if ((x == (rows/2)-1 && y == columns/2)||(x == rows/2 && y == (columns/2)-1)) {
				  rowBoardState.push(BLACK);
			  }
			  else {
				  rowBoardState.push(0); 
			  }
		  }
		  constBoardState.push(rowBoardState);
	  }
}

function initializeOsero() {

$('#game-board').empty();
	
 var board = [];
 
 board.push('<table class="osero_table">');
  for (var x = 0; x < rows; x++) {
	  board.push('<tr class="osero_row">');
	  for (var y = 0; y < columns; y++) {
		  board.push('<td class="osero_mas');
		  if (constBoardState[x][y]==WHITE) {
			  board.push(' white');
		  }
		  else if (constBoardState[x][y]==BLACK) {
			  board.push(' black');
		  }
		  board.push('">');
		  board.push('<div class="disc">');
		  board.push('<span style="display:none">',x ,y ,'</ span>');
		  board.push('</div>');
		  board.push('</ td>');
	  }
	  board.push('</ tr>');
  }
 board.push('</ table>');
 
 $('#game-board').html(board.join(''));
 
 if(player==WHITE) {
	 $('#game-player-name').text('WHITE');
	 $('#game-player-name').addClass('game-player-name-white');
 }
 else {
	 $('#game-player-name').text('BLACK');
	 $('#game-player-name').removeClass('game-player-name-white');
 }
 
 $('#white-count').text(countBoard(WHITE));
 $('#black-count').text(countBoard(BLACK));

}

$(function () {
	  $('#game-board')
	    .click(function (e) {
	    	
    		var row = $(e.target).find('span').text().substr(0,1);
    		var column = $(e.target).find('span').text().substr(1,1);
    		
    		player = getPlayer();
    		enemy = getEnemy();
    		
    		if(row != "" && column != "") {
    			
    			row = Number(row);
    			column = Number(column);
    			
    			if(constBoardState[row][column] == 0) {
    				
					constBoardState[row][column] = player;
					
					if (checkPut(row, column)) {
							        
						reverseOero(row, column);
						
						player = getEnemy();
						enemy = getPlayer();
						
						turn++;

						initializeOsero();
						
						think2();
						
					} else {
						constBoardState[row][column] = 0;
					}
    			}
			}
	   })  
});

function checkPut(row , column) {
	
	var checkFlg = false;
	var aroundRow = null;
	var aroundColumn = null;
	
	for (var x = 0; x < 3; x++) {
		  aroundRow = row + enemyIndexList[x];
	  for (var y = 0; y < 3; y++) {
		  aroundColumn = column + enemyIndexList[y];  
		  if(!isWall(aroundRow, aroundColumn) && isEnemy(aroundRow, aroundColumn)) {
				if(checkCanPut(row, column, aroundRow, aroundColumn)) {
					checkFlg = true;
				}  
		   }
	   }
	}
	
	return checkFlg;
	
}

function checkCanPut(row , column, aroundRow, aroundColumn) {
	
	var checkFlg = false;
				  						
	var playerCnt = 0;
	var enemyCnt = 0;
	var intervalFlg = false;
	var checkCnt = 0;
	var progressRow = 0;
	var progressColumn = 0;
						  
	//Left, Right
	if(aroundRow == row) {
	  index = aroundColumn < column ? -1 :
		      aroundColumn > column ? 1 :
		      0;
	  progressRow = row;
	  progressColumn = column + (index*checkCnt);
	}
	//Top, Bottom
	else if (aroundColumn == column) {
	  index = aroundRow < row ? -1 :
		      aroundRow > row ? 1 :
		      0;
	  progressRow = row + (index*checkCnt);
	  progressColumn = column;
	}
	//Top_Left_Slant, Top_Right_Slant, Bottom_Left_Slant, Bottom_Right_Slant
	else {
	  progressRow = aroundRow > row ? row + (1*checkCnt) :
		            aroundRow < row ? row + (-1*checkCnt) :
		            0;
	  progressColumn = aroundColumn > column ? column + (1*checkCnt) :
		               aroundColumn < column ? column + (-1*checkCnt) :
			           0;
	}

	while (!isWall(progressRow, progressColumn)) {
		if(isEnemy(progressRow, progressColumn)) {
			intervalFlg = false;
			enemyCnt++;
		}
		else if(isPlayer(progressRow, progressColumn)) {
			intervalFlg = true;
			playerCnt++;
			if(playerCnt == 2) {
				break;
			}
		}
		else {
			break;
		}
		checkCnt++;
		
		//Left, Right
		if(aroundRow == row) {
		  progressColumn = column + (index*checkCnt);
		} 
		//Top, Bottom
		else if (aroundColumn == column) {
		  progressRow = row + (index*checkCnt);
		}
		//Top_Left_Slant, Top_Right_Slant, Bottom_Left_Slant, Bottom_Right_Slant
		else {
		  progressRow = aroundRow > row ? row + (1*checkCnt) :
		                aroundRow < row ? row + (-1*checkCnt) :
		                0;
		  progressColumn = aroundColumn > column ? column + (1*checkCnt) :
				           aroundColumn < column ? column + (-1*checkCnt) :
					       0;
		}
	}
	
	if(playerCnt == 2 && enemyCnt >= 1 && intervalFlg) {
		checkFlg = true;
	}
	return checkFlg;
}

function reverseOero(row, column) {
	
	var aroundRow = null;
	var aroundColumn = null;
	
	for (var x = 0; x < 3; x++) {
		  aroundRow = row + enemyIndexList[x];
		  for (var y = 0; y < 3; y++) {
			  aroundColumn = column + enemyIndexList[y];
			  if(!isWall(aroundRow, aroundColumn) && isEnemy(aroundRow, aroundColumn)) {
					if(checkCanPut(row , column, aroundRow, aroundColumn)) {
						var reverseCnt = 0;
						var breakCnt = 0;
						
						//Left, Right
						if(aroundRow == row) {
							  index = aroundColumn < column ? -1 :
								      aroundColumn > column ? 1 :
								      0;
							  progressRow = row;
							  progressColumn = column + (index*reverseCnt);
						} 
						//Top, Bottom
						else if (aroundColumn == column) {
							  index = aroundRow < row ? -1 :
								      aroundRow > row ? 1 :
								      0;
							  progressRow = row + (index*reverseCnt);
							  progressColumn = column;
						}
						//Top_Left_Slant, Top_Right_Slant, Bottom_Left_Slant, Bottom_Right_Slant
						else{
						      progressRow = aroundRow > row ? row + (1*reverseCnt) :
						    	            aroundRow < row ? row + (-1*reverseCnt) :
						    		        0;
						      progressColumn = aroundColumn > column ? column + (1*reverseCnt) :
						    	               aroundColumn < column ? column + (-1*reverseCnt) : 
						    		           0;
					    }
						
						while (!isWall(progressRow, progressColumn)) {
							if(isEnemy(progressRow, progressColumn)) {
								 constBoardState[progressRow][progressColumn] = player;
							}
							else if(isPlayer(progressRow, progressColumn)) {
								breakCnt++;
								if(breakCnt == 2) {
									break;
								}
							}
							
							reverseCnt++;
							
							//Left, Right
							if(aroundRow == row) {
								  progressColumn = column + (index*reverseCnt);
							}
							//Top, Bottom
							else if (aroundColumn == column) {
								  progressRow = row + (index*reverseCnt);
							} 
							//Top_Left_Slant, Top_Right_Slant, Bottom_Left_Slant, Bottom_Right_Slant
							else{
							      progressRow = aroundRow > row ? row + (1*reverseCnt) : 
							    	            aroundRow < row ? row + (-1*reverseCnt) :
							    		        0;
							      progressColumn = aroundColumn > column ? column + (1*reverseCnt) :
							    	               aroundColumn < column ? column + (-1*reverseCnt) : 
							    		           0;
						    }
						}
					}
			   }
		   }
		}
}

//置けるマスの一覧を返す
function showNavigation() {
	
}

//相手かどうか判定する
function isEnemy(row, column){
	var enemyFlg=false;
	if(constBoardState[row][column] == enemy) {
		enemyFlg=true;
	}
	return enemyFlg;
}

//自分かどうか判定する
function isPlayer(row, column){
	var playerFlg=false;
	if(constBoardState[row][column] == player) {
		playerFlg=true;
	}
	return playerFlg;
}

//壁を判定する
function isWall(row, column){
	var wallFlg = false;
	if(row < 0 
	|| column < 0 
	|| row >= rows
	|| column >= columns) {
		wallFlg = true;
	}
	return wallFlg;
}

//自分を取得する
function getPlayer() {
	var tempPlayer;
	if (turn%2==0) {
		tempPlayer = WHITE;
	}
	else {
		tempPlayer = BLACK;
	}
	return tempPlayer;
}

//相手を取得する
function getEnemy() {
	var tempEnemy;
	if (turn%2==0) {
		tempEnemy = BLACK;
	}
	else {
		tempEnemy = WHITE;
	}
	return tempEnemy;
}

//パスする
function pass(UserPassed) {
	
	//プレイヤーを入れ替える
	player = getEnemy();
	enemy = getPlayer();
	
	//ターンを進める
	turn++;
	
	if(UserPassed) {
		think2();
	}
}

//盤の駒数を数える
function countBoard(target) {
	var targetCnt = 0;
	for(var x = 0; x < rows; x++) {
		for(var y = 0; y < columns; y++) {
			if(constBoardState[x][y] == target) {
				targetCnt++;
			}
		}
	}
	return targetCnt;
}

//勝敗を決める
function finish() {

	var message = null;
	var whiteQuantity = countBoard(WHITE);
	var blackQuantity = countBoard(BLACK);
	
	if(whiteQuantity > blackQuantity) {
		message = "ゲームの勝者はWHITEです。";
	}
	else if (whiteQuantity == blackQuantity) {
		message = "ゲームは引き分けです。";
	}
	else {
		message = "ゲームの勝者はBLACKです。";
	}
	
	var result = confirm(message);
	
	$(initializeState);

	$(initializeOsero);
}

function restart() {
		$(initializeState);
		$(initializeOsero);
}

function think1() {
	
	LOOP: for(var x = 0; x < rows; x++){
		for(var y = 0; y < columns; y++) {
			if(constBoardState[x][y] == 0) {
				
				constBoardState[x][y] = player;
				
				if(checkPut(x, y))
				{
					reverseOero(x, y);
				
					player = getEnemy();
					enemy = getPlayer();
				
					turn++;
					
					break LOOP;
					
				} else {
					constBoardState[x][y] = 0;
				}
			}
			
			if(x==(rows-1) && y==(columns-1))
			{
				pass(false);
				break LOOP;
			}
		}
	}
	initializeOsero();
}

function think2() {
	
	var priority = 0;
	var priorityMapObj = {};
	var priorityArray = [];
	
	LOOP: for(var x = 0; x < rows; x++){
		for(var y = 0; y < columns; y++) {
			if(constBoardState[x][y] == 0) {
				
				constBoardState[x][y] = player;
				
				if(checkPut(x, y))
				{
					priority = priorityBoard[x][y];
					priorityMapObj = { Row: x, Column: y, Priority: priority};
					priorityArray.push(priorityMapObj);
					constBoardState[x][y] = 0;
					
				} else {
					constBoardState[x][y] = 0;
				}
			}
		}
	}
		
	if(priorityArray.length > 0) {
		
		priorityArray.sort(compare);
		constBoardState[priorityArray[0].Row][priorityArray[0].Column] = player;
		reverseOero(priorityArray[0].Row, priorityArray[0].Column);
		
		player = getEnemy();
		enemy = getPlayer();
	
		turn++;
		
	} else {
		pass(false);
	}
	
	initializeOsero();
	
}

function compare(a, b) {
	  const priorityA = a.Priority;
	  const priorityB = b.Priority;
	  return (priorityA-priorityB);
}
