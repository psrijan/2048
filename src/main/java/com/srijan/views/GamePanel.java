package com.srijan.views;

import javax.swing.*;
import java.awt.*;
import java.awt.geom.Ellipse2D;

public class GamePanel extends JPanel {

    @Override
    public void paint(Graphics graphics) {
        Graphics2D g2d = (Graphics2D) graphics;
        g2d.setColor(Color.RED);
        g2d.fillOval(0,0,30,30);
        g2d.drawOval(0,50,30,30);
        g2d.fillRect(50,0,30,30);
        g2d.drawRect(50,50,30,30);

        g2d.draw(new Ellipse2D.Double(0,100,30,30));

    }

    public static void main(String[] args) {
        JFrame jFrame = new JFrame("Mini Tennis");
        jFrame.add(new GamePanel());
        jFrame.setSize(300,300);
        jFrame.setVisible(true);
        jFrame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
    }
}
