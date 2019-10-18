var board = [];
var score = 0;
var hasConflicted = [];

$(document).ready(function () {
    prepareForMobile();
    newgame();
})

function prepareForMobile(){
    $('#grid-container').css('width',gridContatinerWidth)
}

function newgame() {
    //初始化棋盘
    init();
    //随机生成两个格子数
    generateOneNumber();
    generateOneNumber();
}
function init() {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            var gridCell = $("#grid-cell-" + i + "-" + j);
            gridCell.css('top', getPostTop(i, j));
            gridCell.css('left', getPostLeft(i, j));
        }
    }

    for (var i = 0; i < 4; i++) {
        board[i] = [];
        hasConflicted[i] = [];
        for (var j = 0; j < 4; j++) {
            board[i][j] = 0;
            hasConflicted[i][j] = false;
        }
    }

    updateBoardView();
    score = 0;
}
function updateBoardView() {
    $(".number-cell").remove();
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            $("#grid-container").append('<div class ="number-cell" id="number-cell-' + i + '-' + j + '"></div>');
            var theNumberCell = $('#number-cell-' + i + '-' + j);

            if (board[i][j] == 0) {
                theNumberCell.css('width', '0px');
                theNumberCell.css('height', '0px');
                theNumberCell.css('top', getPostTop(i, j) + 50);
                theNumberCell.css('left', getPostLeft(i, j) + 50);

            } else {
                theNumberCell.css('width', '100px');
                theNumberCell.css('height', '100px');
                theNumberCell.css('top', getPostTop(i, j));
                theNumberCell.css('left', getPostLeft(i, j));
                theNumberCell.css('background-color', getNumberBackgroundColor(board[i][j]));
                theNumberCell.css('color', getNumberColor(board[i][j]));
                theNumberCell.text(board[i][j]);

            }

            hasConflicted[i][j] = false;
        }
    }
}

function generateOneNumber() {
    if (nospace()) {
        return false;
    }
    //随机位置
    var randx = parseInt(Math.floor(Math.random() * 4));
    var randy = parseInt(Math.floor(Math.random() * 4));

    var times=0;
    while (times<50) {
        if (board[randx][randy] == 0) {
            break;
        }
        randx = parseInt(Math.floor(Math.random() * 4));
        randy = parseInt(Math.floor(Math.random() * 4));
        times++;
    }

    if(times == 50){
        for(var i=0;i<4;i++){
            for(var j=0;j<4;j++){
                if(board[i][j]==0){
                    randx = i;
                    randy = j;
                }
            }
        }
    }

    //随机数字
    var randNumber = Math.random() < 0.5 ? 2 : 4;

    //显示
    board[randx][randy] = randNumber;
    showNumberWithAnimation(randx, randy, randNumber);
    return true;
}

$(document).keydown(function (event) {
    switch (event.keyCode) {
        case 37:
            if (moveLeft()) {
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;//left
        case 38:
            if (moveUp()) {
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;//up
        case 39:
            if (moveRight()) {
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;//right
        case 40:
            if (moveDown()) {
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }

            break;//down
        default: break;//default
    }
});


function isgameover() {
    if(nospace() && !nomove(board)){
        gameover();
    }

}

function gameover(){
    alert('gamgeover!');
}

function moveLeft() {
    if (!canMoveLeft(board)) {
        return false;
    }
    //moveleft
    for (var i = 0; i < 4; i++) {
        for (var j = 1; j < 4; j++) {
            if (board[i][j] != 0) {
                for (var k = 0; k < j; k++) {
                    if (board[i][k] == 0 && noBlockH(i, k, j, board) && !hasConflicted[i][k]) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[i][k] == board[i][j] && noBlockH(i, k, j, board)) {
                        //move
                        showMoveAnimation(i, j, i, k);

                        //add
                        board[i][k] *= 2;
                        board[i][j] = 0;
                        score += board[i][k];
                        updateSocre(score);

                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()", 200);
    return true;
}


function moveRight() {
    if (!canMoveRight(board)) {
        return false;
    }
    //moveRight
    for (var i = 0; i < 4; i++) {
        for (var j = 2; j >= 0; j--) {
            if (board[i][j] != 0) {
                for (var k = 3; k > j; k--) {
                    if (board[i][k] == 0 && noBlockH(i, j, k, board) && !hasConflicted[i][k]) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[i][k] == board[i][j] && noBlockH(i, j, k, board)) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        //add
                        board[i][k] *= 2;
                        board[i][j] = 0;
                        score += board[i][k];
                        updateSocre(score);
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()", 200);
    return true;
}

function moveUp() {
    if (!canMoveUp(board)) {
        return false;
    }
    //moveUp
    for (var j = 0; j < 4; j++) {
        for (var i = 1; i < 4; i++) {
            if (board[i][j] != 0) {
                for (var k = 0; k < i; k++) {
                    if (board[k][j] == 0 && noBlockV(j, i, k, board) && !hasConflicted[i][k]) {
                        //move
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[k][j] == board[i][j] && noBlockV(j, k, i, board)) {
                        //move
                        showMoveAnimation(i, j, k, j);

                        //add
                        board[k][j] *= 2;
                        board[i][j] = 0;
                        score += board[i][k];
                        updateSocre(score);
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()", 200);
    return true;
}

function moveDown() {
    if (!canMoveDown(board)) {
        return false;
    }
    //moveDown
    for (var j = 0; j < 4; j++) {
        for (var i = 2; i >= 0; i--) {
            if (board[i][j] != 0) {
                for (var k = 3; k > i; k--) {
                    if (board[k][j] == 0 && noBlockV(j, i, k, board) && !hasConflicted[i][k]) {
                        //move
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[k][j] == board[i][j] && noBlockV(j, k, i, board)) {
                        //move
                        showMoveAnimation(i, j, k, j);
                        //add
                        board[k][j] *= 2;
                        board[i][j] = 0;
                        score += board[i][k];
                        updateSocre(score);
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()", 200);
    return true;
}