package com.srijan.game.view;

import com.srijan.core.logic.BoardAction;
import com.srijan.core.logic.Moves;
import lombok.Data;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.util.ArrayList;
import java.util.List;


@Data
public class GamePanel extends Panel implements KeyListener {

    private BoardAction boardAction = new BoardAction();

    private JLabel scoreValueLabel;
    private JLabel bestValueLabel;
    private JButton startBtn;
    private JPanel gamePanel;

    private List<List<JLabel>> gameLabelList;

    public static void main(String args[]) {

        GamePanel gamePanel = new GamePanel();
        gamePanel.initUI();
    }

    private void resetUI() {
        System.out.println("Resetting UI");
    }

    private void addListeners() {

        startBtn.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                boardAction = new BoardAction();
                resetGameBoard();
            }
        });
    }


    private void resetGameBoard() {
        int size = boardAction.getBoardModel().getSize();
        gameLabelList.stream().forEach(jLabels -> {
            jLabels.stream().forEach(jLabel -> {
                //testing that the values are working
                jLabel.setText("-2");
            });
        });

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

        startBtn = new JButton("Start");
        startBtn.setBackground(Color.RED);

        JLabel scoreLabel = new JLabel("Score");
        JLabel bestLabel = new JLabel("Best");

        scoreValueLabel = new JLabel("100");
        bestValueLabel = new JLabel("100");

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

        gamePanel = new JPanel();
        gamePanel.setBackground(Color.LIGHT_GRAY);
        gamePanel.setVisible(true);
        gamePanel.setSize(100, 100);
        gamePanel.setLayout(new BoxLayout(gamePanel, BoxLayout.PAGE_AXIS));
        gamePanel.setOpaque(true);
        gamePanel.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));

        initializeGameBoard();

        container.add(gamePanel);
        springLayout.putConstraint(SpringLayout.NORTH, gamePanel, 5, SpringLayout.SOUTH, startBtn);
        springLayout.putConstraint(SpringLayout.WEST, gamePanel, 5, SpringLayout.WEST, container);

        gamePanel.addKeyListener(this);
        addListeners();

    }

    private void initializeGameBoard() {
        gameLabelList = new ArrayList<>();

        //You cant re create the game Panel
        gamePanel.removeAll();
        gamePanel.repaint();

        int size = boardAction.getBoardModel().getSize();
        for (int i = 0; i < size; i++) {
            List<JLabel> row = new ArrayList<>();
            for (int j = 0; j < size; j++) {
                JLabel label = new JLabel();
                label.setSize(new Dimension(60, 60));
                label.setOpaque(true);
                label.setBackground(Color.GRAY);
                label.setText("-1");
                row.add(label);
            }
            gameLabelList.add(row);
        }

        for (int i = 0; i < size; i++) {
            JPanel rowPanel = new JPanel();
            rowPanel.setLayout(new BoxLayout(rowPanel, BoxLayout.LINE_AXIS));
            List<JLabel> rowLabelList = gameLabelList.get(i);
            for (int j = 0; j < size; j++) {
                rowPanel.add(rowLabelList.get(j));
            }
            gamePanel.add(rowPanel);
        }
        gamePanel.repaint();
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
        System.out.println("Something happened here");

    }

    @Override
    public void keyReleased(KeyEvent keyEvent) {
        System.out.println("Key Released");

    }

}
