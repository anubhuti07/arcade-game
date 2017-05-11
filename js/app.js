/* These are constants defined to be used throughout app.js*/
var NUM_COLUMNS = 9;
var NUM_ROWS = 7;
var COLUMN_WIDTH = 101;
var ROW_HEIGHT = 83;
var CANVAS_WIDTH = COLUMN_WIDTH * NUM_COLUMNS;
var CANVAS_HEIGHT = COLUMN_WIDTH * NUM_ROWS;
var score = 0;
var ROW_ROCK_FIRST = 1;
var ROW_ROCK_LAST = 4;
var GAME_SCORE = 50;
var BUG_PENALTY = 20;

/*
 * @description: A superclass defined
 * @constructor: GameEntity
 * @param{image path}: sprite
 */
var GameEntity = function (sprite) {
    this.x = 0;
    this.y = 0;
    this.sprite = sprite;
    this.height = ROW_HEIGHT;
    this.width = COLUMN_WIDTH;
};

/*
* @description: Render method is defined for superclass GameEntity. It draws the image on the canvas
                using drawImage function of the canvas' context element that takes three parameters:
                the image to be drawn, the x coordinate to start drawing and the y coordinate to start
                drawing.
*/
GameEntity.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/*
 * @description: A subclass of superclass 'GameEntity' defined
 * @constructor: Enemy
 * @param {number} speed: It sets speed of enemy to an initial value
 */

var Enemy = function () {
    /* .call() calls the constructor function of superclass
       GameEntity and sets all its properties for a new
       instance of subclass Enemy is created
      */
    GameEntity.call(this, 'images/enemy-bug.png');
    this.speed = 50;
};

/*
 * @description: This creates 'Enemy' a pseudoclassical subclass of superclass 'GameEntity'
 */
Enemy.prototype = Object.create(GameEntity.prototype);

/* Enemy is a subclass so by default it points to the constructor of its superclass.
   This line will make Enemy class point to its own constructor */
Enemy.prototype.constructor = Enemy;

/*
 * @description: Updates the enemy's position
 * @param dt: A time delta between ticks
 */
Enemy.prototype.update = function (dt) {

    /* You should multiply any movement by the dt parameter which will
       ensure the game runs at the same speed for all computers */
    this.x = this.x + this.speed * dt;

    /* Checks if the enemy x coordinate (position) is greater than the canvas width
       then sets its x coordinate to 0 i.e the starting position */
    if (this.x > canvas.width) {
        this.x = 0;
    }
};

/*
 * @description: A subclass of superclass 'GameEntity' defined
 * @constructor: Player
 */
var Player = function () {
    GameEntity.call(this, 'images/char-cat-girl.png');
};

// This creates 'Player' a pseudoclassical subclass of superclass 'GameEntity'
Player.prototype = Object.create(GameEntity.prototype);

/* Player is a subclass so by default it points to the constructor of its superclass.
   This line will make Player class point to its own constructor */
Player.prototype.constructor = Player;

/*
* @description: Handle input method. Checks for the keyboard inputs and updates the
                players position (x, y coordinates) if the input key matches with the
                specified keycode
*/
Player.prototype.handleInput = function (keyCode) {
    // Sets the current position of player in x and y
    var x = this.x;
    var y = this.y;

    // checks for keyboard inputs and updates player position accordingly
    switch (keyCode) {
    case 'left':
        this.x -= COLUMN_WIDTH;
        break;
    case 'up':
        this.y -= ROW_HEIGHT;
        break;
    case 'right':
        this.x += COLUMN_WIDTH;
        break;
    case 'down':
        this.y += ROW_HEIGHT;
    }

     /* Iterates over each rock to check if the player has collided with the rock.
       In case of collision with the rock, doesnt allow the player to move in the
       same direction
    */
    allRocks.forEach(function (rock) {
        if (isCollided(player, rock)) {
            player.x = x;
            player.y = y;
            return;
        }
    });

    /* Doesnt let the player move beyond the min and max points on the x axis of the canvas.
       i.e If the players current position is less than 0 or greater than (9 - 1)* 101 (canvas width)
       then it doesnt move the player and its position remains the same
    */
    if (this.x < 0 || this.x > (NUM_COLUMNS - 1) * COLUMN_WIDTH) {
        this.x = x;
    }

    /* player wins the game on reaching the water i.e when its y coordinate becomes less than 0.
       reset method is called which is defined in engine.js. This resets all the entities:
       enemy, player, gems and rocks for the new game. The score gets updated adding the
       game score to the score earned by collecting the gems in the game
    */
    if (this.y < 0) {
        //game won
        reset();
        score += GAME_SCORE;

    }

    // player' y position is checked and is not allowed to move outside the canvas height
    else if (this.y > (NUM_ROWS - 1) * ROW_HEIGHT) {
        this.y = y;
    }
};

/* Reset method of Player class. This resets the x and y
   position of player to its starting position */
Player.prototype.reset = function () {
    this.x = Math.floor(NUM_COLUMNS / 2) * COLUMN_WIDTH;
    this.y = (NUM_ROWS - 1) * ROW_HEIGHT - 20;
};

/*
 * @description: A subclass of superclass 'GameEntity' defined
 * @constructor: Gem
 * @param score: score of the player
 * @param available: The availability of gems is set to true
 */
var Gem = function (sprite, score) {
    GameEntity.call(this, sprite);
    this.score = score;
    this.available = true;
};

// This creates 'Gem' a pseudoclassical subclass of superclass 'GameEntity'
Gem.prototype = Object.create(GameEntity.prototype);

/* Gem is a subclass so by default it points to the constructor of its superclass.
   This line will make Gem class point to its own constructor */
Gem.prototype.constructor = Gem;

/*
* @description: It checks the availability of gems and draws the gems in case of true
                by calling the render method of the superclass for the gem object
*/
Gem.prototype.render = function () {
    if (this.available) {
        GameEntity.prototype.render.call(this);
    }
};

/*
 * @description: A subclass of superclass 'GameEntity' defined
 * @constructor: Rock
 */
var Rock = function () {
    GameEntity.call(this, "images/Rock.png");
};

// This creates 'Rock' a pseudoclassical subclass of superclass 'GameEntity'
Rock.prototype = Object.create(GameEntity.prototype);

/* Rock is a subclass so by default it points to the constructor of its superclass.
   This line will make Rock class point to its own constructor */
Rock.prototype.constructor = Rock;

// Creates an instance/object of Player class
var player = new Player();

// Creates instances/objects of Enemy class and pushes them in allEnemies array
var allEnemies = [];
for (var row = ROW_ROCK_FIRST; row <= ROW_ROCK_LAST; row++) {
    allEnemies.push(new Enemy());
}

/*
 * @description: This is a global function which resets the enemies position andd speed.
 */
var resetEnemies = function () {
    /*
      Loops through all the objects of allEnemies array and sets the x coordinate
      and speed of each enemy object
    */
    allEnemies.forEach(function (enemy) {
        enemy.x = COLUMN_WIDTH * (Math.floor(Math.random() * (NUM_COLUMNS - 1) - 0 + 1) + 0);
        enemy.speed = Math.floor(Math.random() * (250 - 50) + 50);
    });

    var i = 0;
    /*
      Loops over all the rows where enemy is drawn and sets the x, y coordinates
      and speed of all the enemies. The number of enemies is equal to the number
      of rows iterated here i.e from row 1 to row 3
    */
    for (var row = ROW_ROCK_FIRST; row <= ROW_ROCK_LAST; row++) {
        allEnemies[i].x = COLUMN_WIDTH * (Math.floor(Math.random() * (NUM_COLUMNS - 1) - 0 + 1) + 0);
        allEnemies[i].y = ROW_HEIGHT * row - 20;
        allEnemies[i].speed = Math.floor(Math.random() * (250 - 50) + 50);
        i++;
    }
};

// Creates/Instantiates the gems objects in an array allGems.
var allGems = [
    new Gem("images/Gem-Orange.png", 15),
    new Gem("images/Gem-Blue.png", 10),
    new Gem("images/Gem-Green.png", 5),
    new Gem("images/Star.png", 30),
    new Gem("images/Heart.png", 20),
    new Gem("images/Key.png", 25)
];

/*
 * @description: This is a global function which resets the gems position.
 */
var resetGems = function () {
    /*
      Loops over all the elements of allGems array and sets the x,y coordinates
      of each gem. Sets the available property of each gem to true.
    */
    for (var i = 0; i < allGems.length;) {
        allGems[i].x = COLUMN_WIDTH *
            (Math.floor(Math.random() * (NUM_COLUMNS - 1) - 0 + 1) + 0);
        allGems[i].y = ROW_HEIGHT *
            (Math.floor(Math.random() * (ROW_ROCK_LAST - ROW_ROCK_FIRST + 1)) + ROW_ROCK_FIRST) - 20;
        allGems[i].available = true;

        // Sets collision to false
        var collision = false;

        /*
          Checks if any two gems collides with each other and in case of collision
          breaks the loop.
        */
        for (var j = 0; j < i; j++) {
            if (isCollided(allGems[i], allGems[j])) {
                collision = true;
                break;
            }
        }
        /*
          In case of no collision increments to the next ith element in the allGems array to
          be checked for collision with all the remaining elements in the allGems array.
        */
        if (!collision) {
            i++;
        }
    }
};

// Creates/Instantiates the gems objects in an array allGems.
var allRocks = [
    new Rock(),
    new Rock(),
    new Rock()
];

/*
 * @description: This is a global function which resets the rocks position.
 */
var resetRocks = function () {

    //Loops over all rocks elements in allRocks array and sets its x and y coordinates.
    for (var j = 0; j < allRocks.length;) {
        allRocks[j].x = COLUMN_WIDTH *
            (Math.floor(Math.random() * (NUM_COLUMNS - 1) - 0 + 1) + 0);
        allRocks[j].y = ROW_HEIGHT *
            (Math.floor(Math.random() * (ROW_ROCK_LAST - ROW_ROCK_FIRST + 1)) + ROW_ROCK_FIRST) - 20;

        /* Sets the collision to false and then loops over all the elements of allGems
           array to check the collision with all the elements of allRocks array.
        */
        var collision = false;
        allGems.forEach(function (gem) {

            /*If the collision is detected between rock and gem the the function returns
              setting the collision variable to true.
            */
            if (isCollided(allRocks[j], gem)) {
                collision = true;
                return;
            }
        });

        /*
          In case of no collision increments to the next jth element in allRocks array to be
          checked for collision with all the elements in the allGEms array.
        */
        if (!collision) {
            j++;
        }
    }
};


//Collision condition for two objects
var isCollided = function (obj1, obj2) {
    if (obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y) {
        return true;
    }
    return false;
};

/*
* @ description: This is a global fnction which checks for the collisions
                 between 1)the enemy and player 2)the player and gems.
*/
var checkCollisions = function () {
    /*
      Loops over all the elements of objects/elements in the allEnemies array and
      checks for the collision between the enemy and player object.
    */
    allEnemies.forEach(function (enemy) {

        //Checks if the any enemy object collides with the player object.
        if (isCollided(enemy, player) === true) {

            // Calls the reset method for the player object.
            player.reset();

            //Decrements the score subtracting the bug penalty mentioned as a constant value
            score -= BUG_PENALTY;

            /*
              Checks if score is less than zero then sets the score to 0 and then returns from
              the if condition.
            */
            if (score < 0) {
                score = 0;
            }
            return;
        }
    });

    /*
      Loops over all the objects in the allGems array and checks for the collision between the
      player object and the gems array elements.
    */
    allGems.forEach(function (gem) {

        // Checks if the available gem object collides with the player object.
        if (isCollided(gem, player) && gem.available) {
            // Incrementing the score with the gem score with which the player collided
            score += gem.score;

            // Makes the collided gem unavailable
            gem.available = false;
        }
    });
};

/*
 * @description: Displays the score of the player
 */
var renderScore = function () {
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.fillRect(25, 20, 150, 25);
    ctx.fillStyle = "green";
    ctx.fillText("SCORE: " + score, 30, 40);
};

/*
* @description: This listens for key presses and sends the keys to
 Player.handleInput() method.
*/
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    // player obejct calls the handle input method
    player.handleInput(allowedKeys[e.keyCode]);
});