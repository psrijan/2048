class Testing {

    test() {
        let c = document.getElementById("myCanvas") as HTMLCanvasElement | null;
        let ctx = c?.getContext("2d");

        if (ctx != null) {
            ctx.fillStyle = "#FF0000";
            ctx?.fillRect(20, 20, 150, 100);


            ctx.fillStyle = "#000";
            ctx.font = "30px Arial";
            ctx.fillText("hello world", 200, 50);
        }
    }
}


class Constants {
    public static GAME_NAME = "2048";
    public static QUIT_MESSAGE : string =  "ARE YOU SURE YOU WANT TO QUIT";
    public static YES : string = "YES";
    public static NO : string  = "NO";
    public static SCORE : string = "SCORE";
    public static BEST : string = "BEST";
    public static GAME_MESSAGE : string = "Join the numbers and get the 2048 tile!";
    public static CONTINUE: string =  "CONTINUE";
    public static NEW_GAME : string = "NEW GAME";
}


class Colors {
    public static DARK_BUTTON_COLOR : string = "#000";
    public static YELLOW_BUTTON_COLOR = "#FFFF00";
    public static WHITE : string = "#FFF";
    public static BACKGROUND_COLOR = "";
    public static BOARD_BACKGROUND = "#B38B6D";
    public static BOARD_TILE = "#d2b48c";
    
    public static TEXT_LIGHT = "#FFF";
    public static tileColorMap = {2 : "", 4 : "", 8: "", 16 : ""};
    public static tileTextColorMap = {2 : "", 4: "", 8: "", 16: ""};

}

class GameObjPositions {

    objPosMap : Map<GameState, Array<ObjPos>> =  new Map<GameState,  Array<ObjPos>>(); 

    constructor() {
    }


    putItems(state : GameState , objPos : ObjPos ) {
        let hasState : boolean = this.objPosMap.has(state);
        let objList : Array<ObjPos>= [];
        if (hasState) {
            objList = this.objPosMap.get(state)!;
        } else {
            objList = [];
        }

        objList?.push(objPos);
        this.objPosMap.set(state, objList!);
    }

    checkIfObjectClicked(gameState : GameState, xPos : number, yPos : number) {
        let objList : ObjPos[] = this.objPosMap.get(gameState)!;

        if (objList == undefined) {
            console.log("WARNING: Object List for ", gameState, " is undefined");
        }

        let matchingObj : ObjPos[] = objList.filter(val => val.checkIfPositionFallsInObject(xPos, yPos));

        if (matchingObj.length > 0) {
            return matchingObj[0].getObjIdentifier();
        } else {
            return ObjectIdentifier.NONE;
        }
    }
}

/**
 * Identifier to classify what type of object it is 
 */
enum ObjectIdentifier {
    NEW_GAME_BUTTON,
    CONTINUE_BUTTON,
    NONE
}

/**
 * Class that identifies the objects x and y position
 * this is used for checking if the button is clicked
 * based on the x and y position. 
 */
class ObjPos {

    constructor(private xPos: number, 
        private yPos : number, 
        private width: number, 
        private height: number, 
        private isClickable? : boolean,
        private objIdentifier? : ObjectIdentifier) {
    }


    /**
     * Idnetifies if these objects can be clicked 
     */
    getIsClickable() {
        return this.isClickable;
    }

    checkIfPositionFallsInObject(x, y) {
        if (x > this.xPos && y < this.yPos && x < this.xPos + this.width && y < this.yPos + this.height) {
            return true;
        }
        return false;
    }

    getObjIdentifier() : ObjectIdentifier {
        if (this.objIdentifier == null || this.objIdentifier == undefined) 
            console.log("OOPS: Cannot find Object identifier for the clicked object. Something is not right");
        return this.objIdentifier!;
    }
}

enum GameState {
    MAIN_MENU,
    GAME,
    SETTINGS,
    CLOSE,
    HOW_TO_PLAY
}

class Game {

    board : Board;
    gameState : GameState;
    gameObjPosition : GameObjPositions;


    constructor(gameState : GameState = GameState.MAIN_MENU) {
        this.gameState = gameState;
        this.board = new Board();
        this.gameObjPosition = new GameObjPositions();
    }

    initialize() {
        this.addKeyPressEvent();
        this.createViews();
        this.createEventListeners();
    }

    createEventListeners() {
        
        let c = document.getElementById("myCanvas") as HTMLCanvasElement | null;
        if (c == null )
            return;
        
        c.addEventListener("click", (event) => {
            console.log("canvas has been clicked");
            let xPos = event.pageX;
            let yPos = event.pageY;
            console.log("xPos , yPos: " , xPos, yPos);
            this.clickEventDispatcher(xPos, yPos, this.gameState); 

            
        });
    } 

    clickEventDispatcher(xPos : number, yPos : number, gameState: GameState) {
        switch(gameState) {
            case GameState.MAIN_MENU: {
                let objIden : ObjectIdentifier = this.gameObjPosition.checkIfObjectClicked(gameState, xPos, yPos);
                
                if (objIden == ObjectIdentifier.NEW_GAME_BUTTON) {
                    this.gameState = GameState.GAME;
                    this.board.createBoard();
                    this.createViews();

                } else if (objIden == ObjectIdentifier.CONTINUE_BUTTON) {
                    this.gameState = GameState.GAME;
                    this.createViews();
                }

                break;
            } 

        }
    }
 
    createViews() {

        switch(this.gameState) {
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
    }

    addKeyPressEvent() {
        let eventTarget = document.querySelector("body");

        eventTarget?.addEventListener("keydown", (event) => {
            const keyCode = event.code;
            
            console.log("Code", event.code);
            console.log("keyCode", event.keyCode);

            if (this.gameState != GameState.GAME) {
                console.log("Game State is ", this.gameState , " ignoring");
                return;
            }

            if (keyCode == 'ArrowUp') {
                console.log('Up Pressed!');
                this.board.userMovement(Move.UP);
            } else if (keyCode == 'ArrowDown') {
                console.log('Down Pressed!');
                this.board.userMovement(Move.DOWN);
            } else if (keyCode == 'ArrowLeft') {
                console.log('Left Pressed!');
                this.board.userMovement(Move.LEFT);
            } else if (keyCode == 'ArrowRight' ) {
                console.log('Right Pressed!');
                this.board.userMovement(Move.RIGHT);
            }
            this.createGameBoard();
        });
    }


    createMainMenu() {        
        let c = document.getElementById("myCanvas") as HTMLCanvasElement | null;
        let ctx  = c?.getContext("2d");
        
        if (ctx == null || c == null)
            return;

        ctx.clearRect(0, 0, c?.width, c?.height);

        let pos = new ObjPos(10, 20, 330, 70, true, ObjectIdentifier.CONTINUE_BUTTON);
        this.gameObjPosition.putItems(this.gameState, pos);
        ctx.fillStyle = Colors.DARK_BUTTON_COLOR;
        ctx.fillRect(10, 200, 330 , 70);

        ctx.fillStyle = Colors.DARK_BUTTON_COLOR;
        ctx.fillRect(10, 290, 330, 70);
        
        let pos1 = new ObjPos(10, 290, 330, 70, true, ObjectIdentifier.NEW_GAME_BUTTON);
        this.gameObjPosition.putItems(this.gameState, pos1);

        ctx.fillStyle = Colors.TEXT_LIGHT;
        ctx.fillText(Constants.NEW_GAME, 40, 230);

        ctx.fillStyle = Colors.TEXT_LIGHT;
        ctx.fillText(Constants.CONTINUE, 40, 320); 
    }


    createGameBoard() {
        let c = document.getElementById("myCanvas") as HTMLCanvasElement | null;
        let ctx  = c?.getContext("2d");

        if (ctx == null)
            return;

        
        ctx.clearRect(0, 0, c?.width!, c?.height!);

        ctx.fillStyle = Colors.DARK_BUTTON_COLOR;
        ctx.fillRect( 10, 10, 60, 60);

        
        ctx.fillStyle = Colors.TEXT_LIGHT;
        ctx.fillText(Constants.SCORE, 10, 20);
        ctx.fillText(this.board.score + "", 10, 30);

        ctx.fillStyle = Colors.DARK_BUTTON_COLOR;
        ctx.fillRect(10, 90, 60, 30);

        ctx.fillStyle = Colors.YELLOW_BUTTON_COLOR;
        ctx.fillRect(90, 10 , 120, 120);
        
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

        let size = this.board.getBoardSize();

        let tileWidth = (330 - (2 * size + 1)) / size; 

        const MARGIN : number = 2;
        const BOARD_X = 10;
        const BOARD_Y = 190;
        const TEXT_PAD_X = 5;
        const TEXT_PAD_Y = 5;


        let prevTotYTileWidth = 0;
        for (let r = 0; r < size; r++) {
            let prevTotXTileWidth = 0;
            for (let c = 0; c < size; c++) {
                ctx.fillStyle = "#222222";
                ctx.fillRect(BOARD_X + MARGIN * (c + 1) + prevTotXTileWidth, BOARD_Y + MARGIN * (r + 1) + prevTotYTileWidth, tileWidth, tileWidth);

                ctx.fillStyle = '#FFF';
                const tileValue = this.board.getBoardValue(r, c);
                if (tileValue != this.board.INITIAL_VALUE) {
                    ctx.fillText(tileValue + "", BOARD_X + MARGIN * (c + 1) + prevTotXTileWidth + TEXT_PAD_X,  BOARD_Y + MARGIN * (r + 1) + prevTotYTileWidth + TEXT_PAD_Y)
                }
                prevTotXTileWidth += tileWidth;
            }
            prevTotYTileWidth += tileWidth;
        }

    }


    createSettings() {


    }

    createClose() {


    }


    createHowToPlay() {

    }

}

enum Move {
    LEFT, RIGHT, UP, DOWN
}


class Board {
    score : number =0;
    maxScore : number = 0;
    board : number[][];
    INITIAL_VALUE : number = 0;
    boardSize : number;
    noOfEmptyTile : number;

    constructor(size : number = 4) {
        this.boardSize = size; 
        this.createBoard();
    }

    newGameAction (size : number ) {
        this.boardSize = size;
        this.createBoard();
    }

    createBoard() {
        this.board  = new Array<number[]>();
        for (let i = 0; i < this.boardSize; i++) {
            let row = new Array<number>();
            for (let j = 0; j < this.boardSize; j++) {
                row.push(this.INITIAL_VALUE);
            }
            this.board[i] = row;
        }
    }

    getBoardSize() : number {
        return this.boardSize;
    }

    getBoardMatrix() : number[][] {
        return this.board;
    }


    getBoardValue(r : number, c: number) : number {
        return this.board[r][c];
    }


    userMovement(move : Move) {

        switch(move) {
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
    }

    checkGameOver() {
        if (this.noOfEmptyTile == 0)
            console.log("Game Over!!!!");

    }

    resetBoard() {
        this.score = 0;
        this.createBoard();
    }

    placeRandomValue() {
        let emptyIndexArr = new Array<number[]>(); 
        for (let r = 0; r < this.board.length; r++) {
            for (let c = 0; c < this.board.length; c++ ) {
                if (this.board[r][c] == this.INITIAL_VALUE) {
                    emptyIndexArr.push([r, c]);
                }
            }
        }
        let emptyIndexArrSize = emptyIndexArr.length;

        if (emptyIndexArrSize == 0) {
            console.log("There are no free tiles");
            return;
        }

        let val = Math.random();
        let randomIndex = Math.floor(val * emptyIndexArrSize);
        let boardIndex : number[] = emptyIndexArr[randomIndex];
        this.board[boardIndex[0]][boardIndex[1]] = 2;

        this.noOfEmptyTile = emptyIndexArrSize - 1;
    }


    leftAction() {
        for (let r = 0; r < this.board.length; r++) {
            let curRow : number[] = this.board[r];
            let headIndex : number = 0; // index identities the location of the currently processed grid[i][j]
            let c = 1;
            while (c < this.board[0].length) {
                console.log("index: " , c);
                console.log("headIndex", headIndex);
            //for (let c = 1; c < this.board[0].length; c++ ) {
                let headVal = curRow[headIndex];
                let curVal = curRow[c];
                if ( c <= headIndex) {
                    c++;
                    continue;
                }
                if (headVal == this.INITIAL_VALUE && curVal == this.INITIAL_VALUE) {
                    c++;
                    continue;
                } else if (headVal != this.INITIAL_VALUE && curVal != this.INITIAL_VALUE) {
                    if (headVal == curVal) {
                        curRow[headIndex] = curRow[headIndex] * 2;
                        curRow[c] = this.INITIAL_VALUE;
                        headIndex++;
                        c++;
                        this.score += headVal;
                        this.maxScore = Math.max(this.score , this.maxScore);
                    } else {
                        // current headIndex value and the curValue differ, increment headIndex and set the value to the next one
                        headIndex++;
                    }
                } else if (headVal == this.INITIAL_VALUE && curVal != this.INITIAL_VALUE) {
                    curRow[headIndex] = curVal;
                    curRow[c] = this.INITIAL_VALUE;
                    c++;
                } else if (headVal != this.INITIAL_VALUE && curVal == this.INITIAL_VALUE) {
                    c++;
                }
            }
        }
    }


    rightAction() {
        this.reflectLeft(this.board);
        this.leftAction();
        this.reflectLeft(this.board);
        this.board[0][0] = 2;
    }

    reflectLeft(matrix : number[][]) {
        for (let r = 0; r < this.board.length; r++) {
            for (let c = 0; c < Math.floor(this.board.length / 2); c++) {
                let temp = matrix[r][c]
                matrix[r][c] = matrix[r][matrix[0].length - 1 - c];
                matrix[r][matrix[0].length - 1 - c] = temp;
            }
        }
    }

    reflectTop() {
        for (let c = 0; c < this.board[0].length; c++) {
            for (let r = 0; r < Math.floor(this.board.length / 2); r++) {
                let temp = this.board[r][c];
                this.board[r][c] = this.board[this.board.length - r - 1][c];
                this.board[this.board.length - r -1][c] = temp;
            }
        }
        console.log(this.board);
    }

    upAction() {
        for (let c = 0; c < this.board[0].length; c++) {
            let headIndex = 0;
            let r = 1;
            console.log("c: ", c);
            while (r < this.board.length) {
                console.log("r: ", r);
                console.log("headIndex: ", headIndex);
                let curVal =  this.board[r][c];
                let headVal = this.board[headIndex][c];
                if (r <= headIndex) {
                    r++;
                    continue;
                } 
                
                if(headVal == this.INITIAL_VALUE && curVal == this.INITIAL_VALUE) {
                    r++;
                    continue;
                } else if (headVal == this.INITIAL_VALUE && curVal != this.INITIAL_VALUE) {
                    this.board[headIndex][c] = curVal;
                    this.board[r][c] = this.INITIAL_VALUE;
                    r++;
                } else if (headVal != this.INITIAL_VALUE && curVal != this.INITIAL_VALUE) {
                    if ( headVal == curVal) {
                        this.board[headIndex][c] *=2;
                        this.board[r][c] = this.INITIAL_VALUE;
                        headIndex++;
                        r++;
                        this.score += headVal;
                        this.maxScore = Math.max(this.score , this.maxScore);
                    } else {
                        headIndex++;
                    }
                } else if (headVal != this.INITIAL_VALUE && curVal == this.INITIAL_VALUE) {
                    r++;
                }
                
            }
        }
        this.board[this.board.length - 1][0] = 2;
    }

    downAction() {
        this.reflectTop();
        this.upAction();
        this.reflectTop();
    }
}

let game = new Game();
game.initialize();