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
    public static BLACK = "#000";
    
    public static TEXT_LIGHT = "#FFF";
    public static tileColorMap = {2 : "", 4 : "", 8: "", 16 : ""};
    public static tileTextColorMap = {2 : "", 4: "", 8: "", 16: ""};
    public static colorTileArr = [["#301A4B", Colors.WHITE], ["#6DB1BF", Colors.WHITE], ["#FFAECC", Colors.BLACK], ["#3F6C51", Colors.WHITE], ["#521B95", Colors.WHITE], ["#23525D", Colors.WHITE], ["#917A7D", Colors.WHITE], ["#8E535", Colors.WHITE]];


}

enum GameState {
    GAME
}

class Game {

    board : Board;
    gameState : GameState;
    CANVAS_OFFSET_X : number = 0;
    CANVAS_OFFSET_Y : number = 0; 

    constructor(gameState : GameState = GameState.GAME) {
        this.gameState = gameState;
        this.board = new Board();
    }

    initialize() {
        this.addKeyPressEvent();
        this.createGameBoard();
    }

    newGame() {
        this.board.createBoard();
        this.createGameBoard();
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


    createGameBoard() {
        let c = document.getElementById("myCanvas") as HTMLCanvasElement | null;
        let ctx  = c?.getContext("2d");

        if (ctx == null)
            return;

        ctx.clearRect(0, 0, c?.width!, c?.height!);
        ctx.fillStyle = Colors.BOARD_BACKGROUND;
        ctx.fillRect(0, 0, 330, 330);

        let size = this.board.getBoardSize();

        let tileWidth = (330 - (2 * size + 1)) / size; 

        const MARGIN : number = 2;
        const BOARD_X = 0;
        const BOARD_Y = 0;
        const TEXT_PAD_X = 10;
        const TEXT_PAD_Y = 10;


        let prevTotYTileWidth = 0;

        let tileColorArr : string[][] = Colors.colorTileArr;

    
        for (let r = 0; r < size; r++) {
            let prevTotXTileWidth = 0;
            for (let c = 0; c < size; c++) {
                const tileValue = this.board.getBoardValue(r, c);
                let pickIndex = 0;
                if (tileValue != this.board.INITIAL_VALUE) {
                    pickIndex = Math.log2(tileValue);
                }
                ctx.fillStyle = tileColorArr[pickIndex][0];
                ctx.fillRect(BOARD_X + MARGIN * (c + 1) + prevTotXTileWidth, BOARD_Y + MARGIN * (r + 1) + prevTotYTileWidth, tileWidth, tileWidth);
                ctx.fillStyle = tileColorArr[pickIndex][1];
                if (tileValue != this.board.INITIAL_VALUE) {
                    ctx.font = "12px Arial";
                    ctx.fillText(tileValue + "", BOARD_X + MARGIN * (c + 1) + prevTotXTileWidth + TEXT_PAD_X,  BOARD_Y + MARGIN * (r + 1) + prevTotYTileWidth + TEXT_PAD_Y)
                }
                prevTotXTileWidth += tileWidth;
            }
            prevTotYTileWidth += tileWidth;
        }

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
        this.updateScores();
        this.checkGameOver();
    }

    updateScores() {
        document.getElementById("score").innerText = this.score + "";
        document.getElementById("best").innerHTML = this.maxScore + "";
    }

    checkGameOver() {
        if (this.score >= 2048 && this.noOfEmptyTile > 0) {
            document.getElementById("result").innerText = "You Won!!!";
        } else if (this.noOfEmptyTile == 0) {
            document.getElementById("result").innerText = "No More Moves!!!";
        } else {
            document.getElementById("result").innerText = "";

        }

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

        let tempMovesLeft = 0; 
        
        this.board.forEach(row => row.forEach(val => {
            if (val == this.INITIAL_VALUE) {
                tempMovesLeft++;
            }
        }));

        this.noOfEmptyTile = tempMovesLeft;
    }


    leftAction() {
        for (let r = 0; r < this.board.length; r++) {
            let curRow : number[] = this.board[r];
            let headIndex : number = 0; // index identities the location of the currently processed grid[i][j]
            let c = 1;
            while (c < this.board[0].length) {
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



function newGame() {
    console.log("initiating new game");
    game.newGame();
}