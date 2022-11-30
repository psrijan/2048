var Testing = /** @class */ (function () {
    function Testing() {
    }
    Testing.prototype.test = function () {
        var c = document.getElementById("myCanvas");
        var ctx = c === null || c === void 0 ? void 0 : c.getContext("2d");
        if (ctx != null) {
            ctx.fillStyle = "#FF0000";
            ctx === null || ctx === void 0 ? void 0 : ctx.fillRect(20, 20, 150, 100);
            ctx.fillStyle = "#000";
            ctx.font = "30px Arial";
            ctx.fillText("hello world", 200, 50);
        }
    };
    return Testing;
}());
var Constants = /** @class */ (function () {
    function Constants() {
    }
    Constants.GAME_NAME = "2048";
    Constants.QUIT_MESSAGE = "ARE YOU SURE YOU WANT TO QUIT";
    Constants.YES = "YES";
    Constants.NO = "NO";
    Constants.SCORE = "SCORE";
    Constants.BEST = "BEST";
    Constants.GAME_MESSAGE = "Join the numbers and get the 2048 tile!";
    Constants.CONTINUE = "CONTINUE";
    Constants.NEW_GAME = "NEW GAME";
    return Constants;
}());
var Colors = /** @class */ (function () {
    function Colors() {
    }
    Colors.DARK_BUTTON_COLOR = "#000";
    Colors.YELLOW_BUTTON_COLOR = "#FFFF00";
    Colors.WHITE = "#FFF";
    Colors.BACKGROUND_COLOR = "";
    Colors.BOARD_BACKGROUND = "#B38B6D";
    Colors.BOARD_TILE = "#d2b48c";
    Colors.TEXT_LIGHT = "#FFF";
    Colors.tileColorMap = { 2: "", 4: "", 8: "", 16: "" };
    Colors.tileTextColorMap = { 2: "", 4: "", 8: "", 16: "" };
    return Colors;
}());
var GameObjPositions = /** @class */ (function () {
    function GameObjPositions() {
        this.objPosMap = new Map();
    }
    GameObjPositions.prototype.putItems = function (state, objPos) {
        var hasState = this.objPosMap.has(state);
        var objList = [];
        if (hasState) {
            objList = this.objPosMap.get(state);
        }
        else {
            objList = [];
        }
        objList === null || objList === void 0 ? void 0 : objList.push(objPos);
        this.objPosMap.set(state, objList);
    };
    GameObjPositions.prototype.checkIfObjectClicked = function (gameState, xPos, yPos) {
        var objList = this.objPosMap.get(gameState);
        if (objList == undefined) {
            console.log("WARNING: Object List for ", gameState, " is undefined");
        }
        var matchingObj = objList.filter(function (val) { return val.checkIfPositionFallsInObject(xPos, yPos); });
        if (matchingObj.length > 0) {
            return matchingObj[0].getObjIdentifier();
        }
        else {
            return ObjectIdentifier.NONE;
        }
    };
    return GameObjPositions;
}());
/**
 * Identifier to classify what type of object it is
 */
var ObjectIdentifier;
(function (ObjectIdentifier) {
    ObjectIdentifier[ObjectIdentifier["NEW_GAME_BUTTON"] = 0] = "NEW_GAME_BUTTON";
    ObjectIdentifier[ObjectIdentifier["CONTINUE_BUTTON"] = 1] = "CONTINUE_BUTTON";
    ObjectIdentifier[ObjectIdentifier["NONE"] = 2] = "NONE";
})(ObjectIdentifier || (ObjectIdentifier = {}));
/**
 * Class that identifies the objects x and y position
 * this is used for checking if the button is clicked
 * based on the x and y position.
 */
var ObjPos = /** @class */ (function () {
    function ObjPos(xPos, yPos, width, height, isClickable, objIdentifier) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.width = width;
        this.height = height;
        this.isClickable = isClickable;
        this.objIdentifier = objIdentifier;
    }
    /**
     * Idnetifies if these objects can be clicked
     */
    ObjPos.prototype.getIsClickable = function () {
        return this.isClickable;
    };
    ObjPos.prototype.checkIfPositionFallsInObject = function (x, y) {
        if (x > this.xPos && y < this.yPos && x < this.xPos + this.width && y < this.yPos + this.height) {
            return true;
        }
        return false;
    };
    ObjPos.prototype.getObjIdentifier = function () {
        if (this.objIdentifier == null || this.objIdentifier == undefined)
            console.log("OOPS: Cannot find Object identifier for the clicked object. Something is not right");
        return this.objIdentifier;
    };
    return ObjPos;
}());
var GameState;
(function (GameState) {
    GameState[GameState["MAIN_MENU"] = 0] = "MAIN_MENU";
    GameState[GameState["GAME"] = 1] = "GAME";
    GameState[GameState["SETTINGS"] = 2] = "SETTINGS";
    GameState[GameState["CLOSE"] = 3] = "CLOSE";
    GameState[GameState["HOW_TO_PLAY"] = 4] = "HOW_TO_PLAY";
})(GameState || (GameState = {}));
var Game = /** @class */ (function () {
    function Game(gameState) {
        if (gameState === void 0) { gameState = GameState.MAIN_MENU; }
        this.gameState = gameState;
        this.board = new Board();
        this.gameObjPosition = new GameObjPositions();
    }
    Game.prototype.initialize = function () {
        this.addKeyPressEvent();
        this.createViews();
        this.createEventListeners();
    };
    Game.prototype.createEventListeners = function () {
        var _this = this;
        var c = document.getElementById("myCanvas");
        if (c == null)
            return;
        c.addEventListener("click", function (event) {
            console.log("canvas has been clicked");
            var xPos = event.pageX;
            var yPos = event.pageY;
            console.log("xPos , yPos: ", xPos, yPos);
            _this.clickEventDispatcher(xPos, yPos, _this.gameState);
        });
    };
    Game.prototype.clickEventDispatcher = function (xPos, yPos, gameState) {
        switch (gameState) {
            case GameState.MAIN_MENU: {
                var objIden = this.gameObjPosition.checkIfObjectClicked(gameState, xPos, yPos);
                if (objIden == ObjectIdentifier.NEW_GAME_BUTTON) {
                    this.gameState = GameState.GAME;
                    this.board.createBoard();
                    this.createViews();
                }
                else if (objIden == ObjectIdentifier.CONTINUE_BUTTON) {
                    this.gameState = GameState.GAME;
                    this.createViews();
                }
                break;
            }
        }
    };
    Game.prototype.createViews = function () {
        switch (this.gameState) {
            case GameState.MAIN_MENU:
                this.createMainMenu();
                break;
            case GameState.GAME:
                this.createGameBoard();
                break;
            case GameState.SETTINGS:
                break;
            case GameState.CLOSE:
                break;
            case GameState.HOW_TO_PLAY:
                break;
        }
    };
    Game.prototype.addKeyPressEvent = function () {
        var _this = this;
        var eventTarget = document.querySelector("body");
        eventTarget === null || eventTarget === void 0 ? void 0 : eventTarget.addEventListener("keydown", function (event) {
            var keyCode = event.code;
            console.log("Code", event.code);
            console.log("keyCode", event.keyCode);
            if (_this.gameState != GameState.GAME) {
                console.log("Game State is ", _this.gameState, " ignoring");
                return;
            }
            if (keyCode == 'ArrowUp') {
                console.log('Up Pressed!');
                _this.board.userMovement(Move.UP);
            }
            else if (keyCode == 'ArrowDown') {
                console.log('Down Pressed!');
                _this.board.userMovement(Move.DOWN);
            }
            else if (keyCode == 'ArrowLeft') {
                console.log('Left Pressed!');
                _this.board.userMovement(Move.LEFT);
            }
            else if (keyCode == 'ArrowRight') {
                console.log('Right Pressed!');
                _this.board.userMovement(Move.RIGHT);
            }
            _this.createGameBoard();
        });
    };
    Game.prototype.createMainMenu = function () {
        var c = document.getElementById("myCanvas");
        var ctx = c === null || c === void 0 ? void 0 : c.getContext("2d");
        if (ctx == null || c == null)
            return;
        ctx.clearRect(0, 0, c === null || c === void 0 ? void 0 : c.width, c === null || c === void 0 ? void 0 : c.height);
        var pos = new ObjPos(10, 20, 330, 70, true, ObjectIdentifier.CONTINUE_BUTTON);
        this.gameObjPosition.putItems(this.gameState, pos);
        ctx.fillStyle = Colors.DARK_BUTTON_COLOR;
        ctx.fillRect(10, 200, 330, 70);
        ctx.fillStyle = Colors.DARK_BUTTON_COLOR;
        ctx.fillRect(10, 290, 330, 70);
        var pos1 = new ObjPos(10, 290, 330, 70, true, ObjectIdentifier.NEW_GAME_BUTTON);
        this.gameObjPosition.putItems(this.gameState, pos1);
        ctx.fillStyle = Colors.TEXT_LIGHT;
        ctx.fillText(Constants.NEW_GAME, 40, 230);
        ctx.fillStyle = Colors.TEXT_LIGHT;
        ctx.fillText(Constants.CONTINUE, 40, 320);
    };
    Game.prototype.createGameBoard = function () {
        var c = document.getElementById("myCanvas");
        var ctx = c === null || c === void 0 ? void 0 : c.getContext("2d");
        if (ctx == null)
            return;
        ctx.clearRect(0, 0, c === null || c === void 0 ? void 0 : c.width, c === null || c === void 0 ? void 0 : c.height);
        ctx.fillStyle = Colors.DARK_BUTTON_COLOR;
        ctx.fillRect(10, 10, 60, 60);
        ctx.fillStyle = Colors.TEXT_LIGHT;
        ctx.fillText(Constants.SCORE, 10, 20);
        ctx.fillText(this.board.score + "", 10, 30);
        ctx.fillStyle = Colors.DARK_BUTTON_COLOR;
        ctx.fillRect(10, 90, 60, 30);
        ctx.fillStyle = Colors.YELLOW_BUTTON_COLOR;
        ctx.fillRect(90, 10, 120, 120);
        ctx.fillStyle = Colors.DARK_BUTTON_COLOR;
        ctx.fillText(Constants.GAME_NAME, 120, 50);
        ctx.fillStyle = Colors.DARK_BUTTON_COLOR;
        ctx.fillRect(250, 10, 60, 60);
        ctx.fillStyle = Colors.TEXT_LIGHT;
        ctx.fillText(Constants.BEST, 250, 20);
        ctx.fillText(this.board.maxScore + "", 250, 30);
        ctx.fillStyle = Colors.DARK_BUTTON_COLOR;
        ctx.fillRect(250, 90, 60, 30);
        ctx.fillText(Constants.GAME_MESSAGE, 30, 170);
        ctx.fillStyle = Colors.BOARD_BACKGROUND;
        ctx.fillRect(10, 190, 330, 330);
        var size = this.board.getBoardSize();
        var tileWidth = (330 - (2 * size + 1)) / size;
        var MARGIN = 2;
        var BOARD_X = 10;
        var BOARD_Y = 190;
        var TEXT_PAD_X = 5;
        var TEXT_PAD_Y = 5;
        var prevTotYTileWidth = 0;
        for (var r = 0; r < size; r++) {
            var prevTotXTileWidth = 0;
            for (var c_1 = 0; c_1 < size; c_1++) {
                ctx.fillStyle = "#222222";
                ctx.fillRect(BOARD_X + MARGIN * (c_1 + 1) + prevTotXTileWidth, BOARD_Y + MARGIN * (r + 1) + prevTotYTileWidth, tileWidth, tileWidth);
                ctx.fillStyle = '#FFF';
                var tileValue = this.board.getBoardValue(r, c_1);
                if (tileValue != this.board.INITIAL_VALUE) {
                    ctx.fillText(tileValue + "", BOARD_X + MARGIN * (c_1 + 1) + prevTotXTileWidth + TEXT_PAD_X, BOARD_Y + MARGIN * (r + 1) + prevTotYTileWidth + TEXT_PAD_Y);
                }
                prevTotXTileWidth += tileWidth;
            }
            prevTotYTileWidth += tileWidth;
        }
    };
    Game.prototype.createSettings = function () {
    };
    Game.prototype.createClose = function () {
    };
    Game.prototype.createHowToPlay = function () {
    };
    return Game;
}());
var Move;
(function (Move) {
    Move[Move["LEFT"] = 0] = "LEFT";
    Move[Move["RIGHT"] = 1] = "RIGHT";
    Move[Move["UP"] = 2] = "UP";
    Move[Move["DOWN"] = 3] = "DOWN";
})(Move || (Move = {}));
var Board = /** @class */ (function () {
    function Board(size) {
        if (size === void 0) { size = 4; }
        this.score = 0;
        this.maxScore = 0;
        this.INITIAL_VALUE = 0;
        this.boardSize = size;
        this.createBoard();
    }
    Board.prototype.newGameAction = function (size) {
        this.boardSize = size;
        this.createBoard();
    };
    Board.prototype.createBoard = function () {
        this.board = new Array();
        for (var i = 0; i < this.boardSize; i++) {
            var row = new Array();
            for (var j = 0; j < this.boardSize; j++) {
                row.push(this.INITIAL_VALUE);
            }
            this.board[i] = row;
        }
    };
    Board.prototype.getBoardSize = function () {
        return this.boardSize;
    };
    Board.prototype.getBoardMatrix = function () {
        return this.board;
    };
    Board.prototype.getBoardValue = function (r, c) {
        return this.board[r][c];
    };
    Board.prototype.userMovement = function (move) {
        switch (move) {
            case Move.LEFT:
                this.leftAction();
                break;
            case Move.RIGHT:
                this.rightAction();
                break;
            case Move.UP:
                this.upAction();
                break;
            case Move.DOWN:
                this.downAction();
                break;
        }
        this.placeRandomValue();
        this.checkGameOver();
    };
    Board.prototype.checkGameOver = function () {
        if (this.noOfEmptyTile == 0)
            console.log("Game Over!!!!");
    };
    Board.prototype.resetBoard = function () {
        this.score = 0;
        this.createBoard();
    };
    Board.prototype.placeRandomValue = function () {
        var emptyIndexArr = new Array();
        for (var r = 0; r < this.board.length; r++) {
            for (var c = 0; c < this.board.length; c++) {
                if (this.board[r][c] == this.INITIAL_VALUE) {
                    emptyIndexArr.push([r, c]);
                }
            }
        }
        var emptyIndexArrSize = emptyIndexArr.length;
        if (emptyIndexArrSize == 0) {
            console.log("There are no free tiles");
            return;
        }
        var val = Math.random();
        var randomIndex = Math.floor(val * emptyIndexArrSize);
        var boardIndex = emptyIndexArr[randomIndex];
        this.board[boardIndex[0]][boardIndex[1]] = 2;
        this.noOfEmptyTile = emptyIndexArrSize - 1;
    };
    Board.prototype.leftAction = function () {
        for (var r = 0; r < this.board.length; r++) {
            var curRow = this.board[r];
            var headIndex = 0; // index identities the location of the currently processed grid[i][j]
            var c = 1;
            while (c < this.board[0].length) {
                console.log("index: ", c);
                console.log("headIndex", headIndex);
                //for (let c = 1; c < this.board[0].length; c++ ) {
                var headVal = curRow[headIndex];
                var curVal = curRow[c];
                if (c <= headIndex) {
                    c++;
                    continue;
                }
                if (headVal == this.INITIAL_VALUE && curVal == this.INITIAL_VALUE) {
                    c++;
                    continue;
                }
                else if (headVal != this.INITIAL_VALUE && curVal != this.INITIAL_VALUE) {
                    if (headVal == curVal) {
                        curRow[headIndex] = curRow[headIndex] * 2;
                        curRow[c] = this.INITIAL_VALUE;
                        headIndex++;
                        c++;
                        this.score += headVal;
                        this.maxScore = Math.max(this.score, this.maxScore);
                    }
                    else {
                        // current headIndex value and the curValue differ, increment headIndex and set the value to the next one
                        headIndex++;
                    }
                }
                else if (headVal == this.INITIAL_VALUE && curVal != this.INITIAL_VALUE) {
                    curRow[headIndex] = curVal;
                    curRow[c] = this.INITIAL_VALUE;
                    c++;
                }
                else if (headVal != this.INITIAL_VALUE && curVal == this.INITIAL_VALUE) {
                    c++;
                }
            }
        }
    };
    Board.prototype.rightAction = function () {
        this.reflectLeft(this.board);
        this.leftAction();
        this.reflectLeft(this.board);
        this.board[0][0] = 2;
    };
    Board.prototype.reflectLeft = function (matrix) {
        for (var r = 0; r < this.board.length; r++) {
            for (var c = 0; c < Math.floor(this.board.length / 2); c++) {
                var temp = matrix[r][c];
                matrix[r][c] = matrix[r][matrix[0].length - 1 - c];
                matrix[r][matrix[0].length - 1 - c] = temp;
            }
        }
    };
    Board.prototype.reflectTop = function () {
        for (var c = 0; c < this.board[0].length; c++) {
            for (var r = 0; r < Math.floor(this.board.length / 2); r++) {
                var temp = this.board[r][c];
                this.board[r][c] = this.board[this.board.length - r - 1][c];
                this.board[this.board.length - r - 1][c] = temp;
            }
        }
        console.log(this.board);
    };
    Board.prototype.upAction = function () {
        for (var c = 0; c < this.board[0].length; c++) {
            var headIndex = 0;
            var r = 1;
            console.log("c: ", c);
            while (r < this.board.length) {
                console.log("r: ", r);
                console.log("headIndex: ", headIndex);
                var curVal = this.board[r][c];
                var headVal = this.board[headIndex][c];
                if (r <= headIndex) {
                    r++;
                    continue;
                }
                if (headVal == this.INITIAL_VALUE && curVal == this.INITIAL_VALUE) {
                    r++;
                    continue;
                }
                else if (headVal == this.INITIAL_VALUE && curVal != this.INITIAL_VALUE) {
                    this.board[headIndex][c] = curVal;
                    this.board[r][c] = this.INITIAL_VALUE;
                    r++;
                }
                else if (headVal != this.INITIAL_VALUE && curVal != this.INITIAL_VALUE) {
                    if (headVal == curVal) {
                        this.board[headIndex][c] *= 2;
                        this.board[r][c] = this.INITIAL_VALUE;
                        headIndex++;
                        r++;
                        this.score += headVal;
                        this.maxScore = Math.max(this.score, this.maxScore);
                    }
                    else {
                        headIndex++;
                    }
                }
                else if (headVal != this.INITIAL_VALUE && curVal == this.INITIAL_VALUE) {
                    r++;
                }
            }
        }
        this.board[this.board.length - 1][0] = 2;
    };
    Board.prototype.downAction = function () {
        this.reflectTop();
        this.upAction();
        this.reflectTop();
    };
    return Board;
}());
var game = new Game();
game.initialize();
