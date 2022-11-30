package com.srijan.test.views;

import javax.swing.*;
import java.awt.*;

public class GameMoveBall extends Panel {

    int x = 0;
    int y = 0;


    private void moveBall() {
        x = x + 1;
        y = y + 1;
    }

    @Override
    public void paint(Graphics graphics) {
        super.paint(graphics);
        Graphics2D graphics2D = (Graphics2D) graphics;
        graphics2D.setRenderingHint(RenderingHints.KEY_ANTIALIASING,
                RenderingHints.VALUE_ANTIALIAS_ON);
        graphics2D.setColor(Color.RED);
        graphics2D.fillOval(x,y,30,30);
    }

    public static void main(String[] args ) throws InterruptedException {
        JFrame frame = new JFrame();
        frame.setSize(300,300);
        frame.setTitle("Test Game Bro");
        frame.setVisible(true);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        GameMoveBall gameMoveBall = new GameMoveBall();
        frame.add(gameMoveBall);

        while(true) {
            gameMoveBall.moveBall();
            gameMoveBall.repaint();
            Thread.sleep(10);
        }
    }
}
