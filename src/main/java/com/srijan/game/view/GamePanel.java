package com.srijan.game.view;

import com.srijan.core.logic.BoardAction;
import com.srijan.core.logic.Moves;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import javax.swing.*;
import java.awt.*;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;

@Data
public class GamePanel extends Panel implements KeyListener {

    private BoardAction boardAction = new BoardAction();

    private Label scoreValueLabel;
    private Label bestValueLabel;


    public static void main(String args[]) {

        GamePanel gamePanel = new GamePanel();
        gamePanel.initUI();
    }

    private void initUI() {



        JFrame frame = new JFrame();
        frame.setSize(300, 300);
        frame.setTitle("2048");
        frame.setVisible(true);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        Container container = frame.getContentPane();
        container.setBackground(Color.orange);
        container.setSize(300, 300);

        SpringLayout springLayout = new SpringLayout();
        container.setLayout(springLayout);

        Label titleLabel = new Label("2048");

        container.add(titleLabel);
        springLayout.putConstraint(SpringLayout.WEST, titleLabel, 5, SpringLayout.WEST, container);
        springLayout.putConstraint(SpringLayout.NORTH, titleLabel, 5, SpringLayout.NORTH, container);

        Button startBtn = new Button("Start");
        startBtn.setBackground(Color.RED);

        Label scoreLabel = new Label("Score");
        Label bestLabel = new Label("Best");

        scoreValueLabel = new Label("100");
        bestValueLabel = new Label("100");

        container.add(scoreLabel);
        springLayout.putConstraint(SpringLayout.WEST, scoreLabel, 15, SpringLayout.EAST, titleLabel);
        springLayout.putConstraint(SpringLayout.NORTH, scoreLabel, 5, SpringLayout.NORTH, container);

        container.add(scoreValueLabel);
        springLayout.putConstraint(SpringLayout.WEST, scoreValueLabel, 15, SpringLayout.EAST, titleLabel);
        springLayout.putConstraint(SpringLayout.NORTH, scoreValueLabel, 2, SpringLayout.SOUTH, scoreLabel);

        container.add(bestLabel);
        springLayout.putConstraint(SpringLayout.WEST, bestLabel, 15, SpringLayout.EAST, scoreLabel);
        springLayout.putConstraint(SpringLayout.NORTH, bestLabel, 5, SpringLayout.NORTH, container);

        container.add(bestValueLabel);
        springLayout.putConstraint(SpringLayout.NORTH, bestValueLabel, 2, SpringLayout.SOUTH, bestLabel);
        springLayout.putConstraint(SpringLayout.WEST, bestValueLabel, 15, SpringLayout.EAST, scoreLabel);


        container.add(startBtn);
        springLayout.putConstraint(SpringLayout.NORTH, startBtn, 5, SpringLayout.SOUTH, bestLabel);
        springLayout.putConstraint(SpringLayout.EAST, startBtn, -10, SpringLayout.EAST, container);


        container.setFocusable(true);
        container.addKeyListener(new MKeyListener());


        JPanel gamePanel = new JPanel();
        gamePanel.setBackground(Color.LIGHT_GRAY);
        gamePanel.setVisible(true);
        gamePanel.setSize(300 , 200);
        gamePanel.add(new Button("Test"));

        container.add(gamePanel);
        springLayout.putConstraint(SpringLayout.NORTH , gamePanel , 5 , SpringLayout.SOUTH , startBtn);
        springLayout.putConstraint(SpringLayout.WEST , gamePanel , 5 , SpringLayout.WEST, container);


    }

    public void addListener(Container container) {
        container.addKeyListener(this);
    }


    @Override
    public void keyPressed(KeyEvent keyEvent) {
        char ch = keyEvent.getKeyChar();
        System.out.println("Character: " + ch);

        if (ch == 'u') {
            //up
            boardAction.applyMove(Moves.UP);

        } else if (ch == 'h') {
            //left
            boardAction.applyMove(Moves.LEFT);
        } else if (ch == 'j') {
            //down
            boardAction.applyMove(Moves.DOWN);
        } else if (ch == 'k') {
            //right
            boardAction.applyMove(Moves.RIGHT);
        }
    }


    @Override
    public void keyTyped(KeyEvent keyEvent) {

    }

    @Override
    public void keyReleased(KeyEvent keyEvent) {

    }
}
