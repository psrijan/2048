package com.srijan.core.logic;

import lombok.Getter;

@Getter
public class BoardModel {

    //need to make a copy of state to go back to previous state
    private GameState gameState;
    private Integer[][] board;
    private Integer size;
    private String currentMessage;


    public void setGameState(GameState gameState) {
        this.gameState = gameState;
    }

    public BoardModel(int boardSize) {
        this.board = new Integer[boardSize][boardSize];
        this.size = boardSize;

        for (int i = 0; i < size; i++) {
            for (int j = 0; j < size; j++) {
                board[i][j] = -1;
            }
        }
        board[0][0] = 2;
        printState();
    }

    public Integer[][] getBoardState() {
        return board;
    }


    public void printState() {
        for (int i = 0; i < size; i++) {
            for (int j = 0; j < size; j++) {
                System.out.print(board[i][j] + " ");
            }
            System.out.println("\n");
        }
        System.out.println("---");
    }
}