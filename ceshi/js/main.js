/**
 * @author songfy
 */
//初始化数据
var board = new Array();
var score = 0;
var isCollapsed =  new Array();
//屏幕宽度
var documentWidth= window.screen.availWidth;
var gridContainerWidth = 0.92*documentWidth;
var gridContainerPadding = 0.04*documentWidth;
var cellWidth = 0.18*documentWidth;
function prepareForMobel(){
	$("#grid-container").css("width",gridContainerWidth - 2*gridContainerPadding);
	$("#grid-container").css("height",gridContainerWidth - 2*gridContainerPadding);
	$("#grid-container").css("padding",gridContainerPadding);
	$("#grid-container").css("border-radius",0.02*gridContainerWidth);
	$("#grid-container").css("margin-top",2*gridContainerPadding);
	$("#grid-container").css("margin-bottom",2*gridContainerPadding);
	$(".grid-cell").css("width",cellWidth);
	$(".grid-cell").css("height",cellWidth);
	$(".grid-cell").css("border-radius",0.02*cellWidth);
}
$(document).ready(function(){
	if(documentWidth > 500){
		cellWidth = 100;
		gridContainerPadding = 20;
	}else{
		prepareForMobel();
	}
	newGame();
});

//初始化游戏
function newGame(){
	//初始化游戏棋盘
	init();
	generateOneNumber();
	generateOneNumber();
}

function init(){
	for(var i=0;i <= 3;i++){
		for(var j=0;j <= 3;j++ ){
			var gridCell = $("#grid-cell-"+i+"-"+j);
			//设置他们的位置
			gridCell.css("top",getPositionTop(i,j));
			gridCell.css("left",getPositonLeft(i,j));
		}
	}
	
	//初始化board变量
	for(var i =0;i <= 3;i++){
		board[i] = new Array();
		for(var j = 0;j <= 3;j++){
			board[i][j] = 0;
		}
	}
	
	//初始化score
	score = 0;
	updateScore();
	updateBoardView();
}
function getPositionTop(i,j){
	return (cellWidth+gridContainerPadding)*i+gridContainerPadding;
}

function getPositonLeft(i,j){
	return (cellWidth+gridContainerPadding)*j+gridContainerPadding;
}

//根据board来更新显示
function updateBoardView(){
	//它的做法是生成新的一层number-cell覆盖到grid-cell上
	//首先要去掉原来的number-cell,类似于清空
	$(".number-cell").remove();
	for(var i=0;i <= 3;i++){
		for(var j=0;j <= 3;j++ ){
				//先生成numbercell
				$("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
				$(".number-cell").css('line-height',cellWidth+"px");
				$(".number-cell").css('font-size',0.4*cellWidth+"px");
				$(".number-cell").css("border-radius",0.06*cellWidth);
				var numberCell = $("#number-cell-"+i+"-"+j);
				//如果numberCell对应的board[i][j]为0,不显示
				if(board[i][j] == 0){
					numberCell.css("width","0");
					numberCell.css("height","0");
					numberCell.css("top",getPositionTop(i,j)+cellWidth/2);
					numberCell.css("left",getPositonLeft(i,j)+cellWidth/2);
				}else{
					//反之,显示
					//长宽沿用样式表的设置
					numberCell.css("top",getPositionTop(i,j));
					numberCell.css("left",getPositonLeft(i,j));
					numberCell.css("width",cellWidth);
					numberCell.css("height",cellWidth);
					numberCell.css("background-color",getBackGroundColor(board[i][j]));
					numberCell.css("color",getBackColor(board[i][j]));
					numberCell.text(board[i][j]);
				}
		}
	}
	clearCollapsed();
}
function clearCollapsed(){
	for(var i = 0;i <= 3;i++){
		isCollapsed[i]= new Array();
		for(var j = 0;j <= 3;j++)
			isCollapsed[i][j] = false;
	}
}

//根据值选取背景颜色
function getBackGroundColor(value){
	switch(value){
		case 2:return "#eee4da";break;
		case 4:return "#ede0c8";break;
		case 8:return "#f2b179";break;
		case 16:return "#f59563";break;
		case 32:return "#f67c5f";break;
		case 64:return "#f65e38";break;
		case 128:return "#edcf72";break;
		case 256:return "#edcc61";break;
		case 512:return "#9c0";break;
		case 1024:return "#33b5e5";break;
		case 2048:return "#09c";break;
		case 4096:return "#a6c";break;
		case 8192:return "#93c";break;
		default:return "#93c";
	}
}

//根据值去颜色
function getBackColor(value){
	if(value < 4)
		return "#776e65";
	else
		return "white";
}

//产生并显示一个随机数
function generateOneNumber(){
	var num = getZeroNumber();
	if(num != 0){
		var position = parseInt(Math.floor(Math.random()*num));
		for(var i = 0;i <= 3;i++)
			for(var j = 0; j <= 3;j++)
				if(board[i][j] == 0){
					if(position == 0){
						if(Math.random() > 0.5)
							board[i][j]=4;
						else
							board[i][j] = 2;
						showNumber(i,j);
						return;
					}else{
						position--;
					}
				}
	}
}

//获取空余的0数目
function getZeroNumber(){
	var num = 0;
	for(var i = 0;i <= 3;i++)
		for(var j = 0; j <= 3;j++)
			if(board[i][j] == 0)
				num++;
	return num;
}
//显示随机数
function showNumber(i,j){
	var numberCell = $("#number-cell-"+i+"-"+j);
	numberCell.text(board[i][j]);
	numberCell.css("background-color",getBackGroundColor(board[i][j]));
	numberCell.css("color",getBackColor(board[i][j]));
	
	numberCell.animate({
		width:cellWidth,
		height:cellWidth,
		top:getPositionTop(i,j),
		left:getPositonLeft(i,j),
	},200);
}


//接下来就是游戏的主循环了
$(document).keydown(function(event){
	switch(event.keyCode){
		case 37://left
		event.preventDefault();
		if(isGameOver())
			alert("Game Over!");
		if(canMoveLeft()){
			moveLeft();
			setTimeout(updateBoardView,250);
			generateOneNumber();
		}
		break;
		case 38://up
		event.preventDefault();
		if(isGameOver())
			alert("Game Over!");
		if(canMoveUp()){
			moveUp();
			setTimeout(updateBoardView,250);
			generateOneNumber();	
		}
		break;
		case 39://right
		event.preventDefault();
		if(isGameOver())
			alert("Game Over!");
		if(canMoveRight()){
			moveRight();
			setTimeout(updateBoardView,250);
			generateOneNumber();
		}
		break;
		case 40://down
		event.preventDefault();
		if(isGameOver())
			alert("Game Over!");
		if(canMoveDown()){
			moveDown();
			setTimeout(updateBoardView,250);
			generateOneNumber();
		}
		break;
	}
});

function canMoveLeft(){
	for(var i = 0; i <= 3;i++){
		for(var j = 1; j <=3;j++)
			if(board[i][j] != 0)
				if(board[i][j-1] == 0 || board[i][j] ==  board[i][j-1])
					return true;
	}
	return false;
}
function canMoveRight(){
	for(var i = 0; i <= 3;i++){
		for(var j = 2; j >= 0 ;j--)
			if(board[i][j] != 0)
				if(board[i][j+1] == 0 || board[i][j] ==  board[i][j+1])
					return true;
	}
	return false;
}
function canMoveUp(){
	for(var j = 0; j <= 3;j++){
		for(var i = 1; i <= 3 ;i++)
		 	if(board[i][j] != 0)
				if(board[i-1][j] == 0 || board[i][j] ==  board[i-1][j])
					return true;
	}
	return false;
}
function canMoveDown(){
	for(var j = 0; j <= 3;j++){
		for(var i = 2; i >= 0 ;i--)
			if(board[i][j] != 0)
				if(board[i+1][j] == 0 || board[i][j] ==  board[i+1][j])
					return true;
	}
	return false;
}
function isGameOver(){
	var num = getZeroNumber();
	if(num == 0 && !canMoveLeft() && !canMoveRight() && !canMoveUp() && !canMoveDown())
		return true;
	return false;
}
function moveLeft(){
	for(var i = 0;i <= 3;i++)
		for(var j = 1;j <= 3;j++){
			if(board[i][j] != 0){
				for(var k = 0;k <j ;k++){
					if(board[i][k] == 0 && noBlock(i,k,i,j)){
						move(i,j,i,k);
						board[i][k] = board[i][j] ;
						board[i][j] = 0;
						break;
					}
					if(board[i][k] == board[i][j] && !isCollapsed[i][k] && noBlock(i,k,i,j)){
						move(i,j,i,k);
						score += board[i][k];
						board[i][k] += board[i][j] ;
						board[i][j] = 0;
						isCollapsed[i][k] = true;
						updateScore();
						break;
					}
				}
			}
		}
}

function moveRight(){
	for(var i = 0;i <= 3;i++)
		for(var j = 2;j >= 0;j--){
			if(board[i][j] != 0){
				for(var k = 3;k > j ;k--){
					if(board[i][k] == 0 && noBlock(i,j,i,k)){
						move(i,j,i,k);
						board[i][k] = board[i][j] ;
						board[i][j] = 0;
						break;
					}
					if(board[i][k] == board[i][j] && !isCollapsed[i][k] && noBlock(i,j,i,k)){
						move(i,j,i,k);
						score += board[i][k];
						board[i][k] += board[i][j] ;
						board[i][j] = 0;
						isCollapsed[i][k] = true;
						updateScore();
						break;
					}
				}
			}
		}
}

function moveUp(){
	for(var j = 0;j <= 3;j++)
		for(var i = 1;i <= 3;i++){
			if(board[i][j] != 0){
				for(var k = 0;k < i ;k++){
					if(board[k][j] == 0 && noBlock(k,j,i,j)){
						move(i,j,k,j);
						board[k][j] = board[i][j] ;
						board[i][j] = 0;
						break;
					}
					if(board[k][j] == board[i][j] && !isCollapsed[k][j] && noBlock(k,j,i,j)){
						move(i,j,k,j);
						score+=board[k][j];
						board[k][j] += board[i][j] ;
						board[i][j] = 0;
						isCollapsed[k][j] = true;
						updateScore();
						break;
					}
				}
			}
		}
}
function moveDown(){
	for(var j = 0;j <= 3;j++)
		for(var i = 2;i >= 0 ;i--){
			if(board[i][j] != 0){
				for(var k = 3;k > i ;k--){
					if(board[k][j] == 0 && noBlock(i,j,k,j)){
						move(i,j,k,j);
						board[k][j] = board[i][j] ;
						board[i][j] = 0;
						break;
					}
					if(board[k][j] == board[i][j] && !isCollapsed[k][j] && noBlock(i,j,k,j)){
						move(i,j,k,j);
						score+=board[k][j];
						board[k][j] += board[i][j] ;
						board[i][j] = 0;
						isCollapsed[k][j] = true;
						updateScore();
						break;
					}
				}
			}
		}
}

function noBlock(fromX,fromY,toX,toY){
	if(fromX == toX){
		for(var i = fromY+1;i < toY;i++)
			if(board[fromX][i] != 0)
				return false;
	}else{
		for(var i = fromX+1;i < toX;i++)
			if(board[i][fromY] != 0)
				return false;
	}
	return true;
}
function move(fromX,fromY,toX,toY){
	var numberCell = $("#number-cell-"+fromX+"-"+fromY);
	numberCell.animate({
		top:getPositionTop(toX,toY),
		left:getPositonLeft(toX,toY)
	},200);
}
function updateScore(){
	$("#score").text(score);
}

var startx = 0;
var starty=0;
//支持触控
document.addEventListener('touchstart',function(event){
	startx = event.touches[0].pageX;
	starty = event.touches[0].pageY;
});

document.addEventListener('touchend',function(event){
	var endx = event.changedTouches[0].pageX;
	var endy = event.changedTouches[0].pageY;
	var deltax = endx - startx;
	var deltay = endy-starty;
	if(Math.abs(deltax) < 0.3*documentWidth && Math.abs(deltay) < 0.3*documentWidth){
		return;
	}
	if(Math.abs(deltax) >Math.abs(deltay)){
		if(deltax < 0){
			if(isGameOver())
				alert("Game Over!");
			if(canMoveLeft()){
				moveLeft();
				setTimeout(updateBoardView,250);
				generateOneNumber();
			}
		}else{
			if(isGameOver())
				alert("Game Over!");
			if(canMoveRight()){
				moveRight();
				setTimeout(updateBoardView,250);
				generateOneNumber();
			}
		}
	}else{
		if(deltay < 0){
			if(isGameOver())
				alert("Game Over!");
			if(canMoveUp()){
				moveUp();
				setTimeout(updateBoardView,250);
				generateOneNumber();	
			}
		}else{
			if(isGameOver())
				alert("Game Over!");
			if(canMoveDown()){
				moveDown();
				setTimeout(updateBoardView,250);
				generateOneNumber();
			}
		}
	 }
});

document.addEventListener('touchmove',function(event){
	event.preventDefault();
});
