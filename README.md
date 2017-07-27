# Arcade Game 

## Introduction

The game has a Player and Enemies (Bugs). The goal of the player is to reach the water collecting gems on the way, without colliding into any one of the enemies and circumventing the blocking rocks. The player can move left, right, up and down. The enemies move in varying speeds on the paved block portion of the scene. The player gains points each time he reaches the water or collects a gem and on colliding with an enemy the points are lost and the position is reset.

## How it works:

This game runs on javascript. **Engine.js** is the game loop that continually updates and renders the objects. 
**Resources.js** is the image loading utility that also caches images for performance purposes. 
**App.js** contains the game logic and instantiates the objects (enemies, player, gems, rocks).

## Instructions: How to play

- Download the repo to your computer and open/load the index.html file in your browser. Use the keyboards directional arrows (UP, DOWN,     LEFT, RIGHT) to move the player around the board and finally reach the water
- Score points by collecting the gems while navigating the player to the water without colliding with its enemies
- Colliding with the enemies resets the player to its starting position and decrements the score

## Game highlights

- Gain points every time you reach the water or collect a gem
- Lose points every time you hit a bug
