package com.srijan;

import com.srijan.core.logic.BoardAction;
import com.srijan.core.logic.Moves;
import org.junit.Test;

public class BoardActionTest {

    BoardAction boardAction = new BoardAction();

    @Test
    public void testLeftAction() {
        boardAction.applyMove(Moves.LEFT);


    }


}