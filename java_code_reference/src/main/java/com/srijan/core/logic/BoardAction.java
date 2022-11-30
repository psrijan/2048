package com.srijan.core.logic;

import lombok.Getter;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class BoardAction {

    private BoardModel boardModel;
    private static final Integer DEFAULT_VALUE = -1;

    public BoardAction() {
        boardModel= new BoardModel(4);
    }

    public BoardModel getBoardModel() {
        return boardModel;
    }

    public GameState applyMove(Moves move) {
        System.out.println(move.toString());
        boardModel.printState();

        if (move.equals(Moves.LEFT)) {
            leftAction();
        } else if (move.equals(Moves.RIGHT)) {
            rightAction();
        } else if (move.equals(Moves.UP)) {
            upAction();
        } else {
            downAction();
        }

        GameState gameState = generateRandomTwos();
        boardModel.printState();
        return gameState;
    }

    private GameState generateRandomTwos() {
        Random random = new Random();

        Integer[][] state = boardModel.getBoardState();
        int size = boardModel.getSize();

        int val1 = random.nextInt(boardModel.getSize());
        int val2 = random.nextInt(boardModel.getSize());

        List<IndexHolder> indexHolders = new ArrayList<>();

        for (int i = 0; i < size; i++) {
            for (int j = 0; j < size; j++) {
                if (state[i][j] == -1) {
                    IndexHolder indexHolder = new IndexHolder(i, j);
                    indexHolders.add(indexHolder);
                }
            }
        }

        if (indexHolders.size() == 0) {
            boardModel.setGameState(GameState.END);
            return GameState.END;
        } else {
            boardModel.setGameState(GameState.CONTINUE);
            IndexHolder indexHolder = indexHolders.get(random.nextInt(indexHolders.size()));
            state[indexHolder.getI()][indexHolder.getJ()] = 2;
            return GameState.CONTINUE;
        }

    }

    private void leftAction() {

        Integer[][] boardState = boardModel.getBoardState();
        int headIndex;

        for (int i = 0; i < boardModel.getSize(); i++) {
            headIndex = 0;

            for (int j = 1; j < boardModel.getSize(); j++) {

                if (headIndex >= boardModel.getSize()) {
                    break;
                }

                if (boardState[i][j] == -1)
                    continue;
                else if (boardState[i][headIndex] == -1) {
                    boardState[i][headIndex] = boardState[i][j];
                    boardState[i][j] = -1;
                    continue;
                } else if (boardState[i][headIndex] == boardState[i][j]) {
                    boardState[i][headIndex] *= 2;
                    boardState[i][j] = -1;
                } else if (boardState[i][headIndex] != boardState[i][j]) {
                    headIndex++;
                    // recursive or a while loop.
                    while (headIndex < j) {
                        if (boardState[i][headIndex] == -1) {
                            boardState[i][headIndex] = boardState[i][j];
                            boardState[i][j] = -1;
                            break;
                        } else if (boardState[i][headIndex] == boardState[i][j]) {
                            boardState[i][headIndex] *= 2;
                            boardState[i][j] = -1;
                            break;
                        } else if (boardState[i][headIndex] != boardState[i][j]) {
                            headIndex++;
                        }
                    }
                }
            }
        }
    }

    private void rightAction() {

        Integer[][] boardState = boardModel.getBoardState();
        int size = boardModel.getSize();
        int headIndex;

        for (int i = 0; i < size; i++) {
            headIndex = size - 1;

            for (int j = size - 1; j >= 0; j--) {
                if (headIndex < 0) {
                    break;
                }

                if (boardState[i][j] == -1)
                    continue;
                else if (boardState[i][headIndex] == -1) {
                    boardState[i][headIndex] = boardState[i][j];
                    boardState[i][j] = -1;
                    continue;
                } else if (boardState[i][headIndex] == boardState[i][j]) {
                    boardState[i][headIndex] *= 2;
                    boardState[i][j] = -1;
                } else if (boardState[i][headIndex] != boardState[i][j]) {
                    headIndex--;
                    // recursive or a while loop.
                    while (headIndex > j) {
                        if (boardState[i][headIndex] == -1) {
                            boardState[i][headIndex] = boardState[i][j];
                            boardState[i][j] = -1;
                            break;
                        } else if (boardState[i][headIndex] == boardState[i][j]) {
                            boardState[i][headIndex] *= 2;
                            boardState[i][j] = -1;
                            break;
                        } else if (boardState[i][headIndex] != boardState[i][j]) {
                            headIndex--;
                        }
                    }
                }
            }


        }
    }


    private void upAction() {
        Integer[][] boardState = boardModel.getBoardState();
        int size = boardModel.getSize();
        int headIndex;

        for (int i = 0; i < size; i++) {
            headIndex = 0;
            for (int j = 1; j < size; j++) {
                if (headIndex >= boardModel.getSize()) {
                    break;
                }

                if (boardState[j][i] == -1)
                    continue;
                else if (boardState[headIndex][i] == -1) {
                    boardState[headIndex][i] = boardState[j][i];
                    boardState[j][i] = -1;
                    continue;
                } else if (boardState[headIndex][i] == boardState[j][i]) {
                    boardState[headIndex][i] *= 2;
                    boardState[j][i] = -1;
                } else if (boardState[headIndex][i] != boardState[j][i]) {
                    headIndex++;
                    while (headIndex < j) {
                        if (boardState[headIndex][i] == -1) {
                            boardState[headIndex][i] = boardState[j][i];
                            boardState[j][i] = -1;
                            break;
                        } else if (boardState[headIndex][i] == boardState[j][i]) {
                            boardState[headIndex][i] *= 2;
                            boardState[j][i] = -1;
                            break;
                        } else if (boardState[headIndex][i] != boardState[j][i]) {
                            headIndex++;
                        }
                    }
                }
            }
        }
    }

    private void downAction() {

        Integer[][] boardState = boardModel.getBoardState();
        int size = boardModel.getSize();
        int headIndex;

        for (int i = 0; i < size; i++) {
            headIndex = size - 1;
            for (int j = size - 2; j >= 0; j--) {

                if (headIndex < 0) {
                    break;
                }

                if (boardState[j][i] == -1)
                    continue;
                else if (boardState[headIndex][i] == -1) {
                    boardState[headIndex][i] = boardState[j][i];
                    boardState[j][i] = -1;
                    continue;
                } else if (boardState[headIndex][i] == boardState[j][i]) {
                    boardState[headIndex][i] *= 2;
                    boardState[j][i] = -1;
                } else if (boardState[headIndex][i] != boardState[j][i]) {
                    headIndex--;
                    // recursive or a while loop.
                    while (headIndex > j) {
                        if (boardState[headIndex][i] == -1) {
                            boardState[headIndex][i] = boardState[j][i];
                            boardState[j][i] = -1;
                            break;
                        } else if (boardState[headIndex][i] == boardState[j][i]) {
                            boardState[headIndex][i] *= 2;
                            boardState[j][i] = -1;
                            break;
                        } else if (boardState[headIndex][i] != boardState[j][i]) {
                            headIndex++;
                        }
                    }
                }
            }
        }
    }
}
