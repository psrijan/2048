package com.srijan.game.view;

import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;

class MKeyListener extends KeyAdapter {
    @Override
    public void keyPressed(KeyEvent keyEvent) {
        super.keyPressed(keyEvent);
        char ch = keyEvent.getKeyChar();
        System.out.println("Character: " + ch);
    }
}