// Udacity Front End Developer Nanodegree Project 3 Take 2
// By: Patrick Roche
//     patrick.l.roche@gmail.com
//     https://github.com/plr108
//
// Note: I removed most of the default comments in app.js and engine.js for clarity.
//       No other project files were modified in creating this project.  See the
//       README file for more info on setting up the game and gameplay.
//       Code reformatted after Udacity sumbission to meet Udacity style rules.
//       No code functionality has been changed in Take 2.

// constructor for Game object.
// Used to store values about the game.
var Game = function() {

    var obj = Object.create(Game.prototype);

    // column size in pixels
    obj.columnSize = 101;

    // row size in pixels
    obj.rowSize = 83;

    // column numbering starts at 0.
    // The leftmost row is row 0.
    obj.columns = 5;

    // row number starts at 0.
    // the top row is row 0.
    obj.rows = 5;

    // gameMessage is used to display text to user
    // after wining or losing a level
    obj.gameMessage = "";

    return obj;
};

// Enemy constructor
var Enemy = function(row, delay, direction, speedMultiplier) {

    var obj = Object.create(Enemy.prototype);

    // The enemy sprite must be offset by the specified number of
    // pixels in order to appear in the middle of a row
    obj.spriteYOffset = 20;

    // These variables are the enemy sprite x pixel values
    // used when checking for a collision.
    obj.leftSide = 1;
    obj.rightSide = 98;

    // The enemy will start in row specified by the row parameter
    // The spriteYOffset is accounted for so the enemy
    // appears in the middle of the row.
    obj.y = row * game.rowSize - obj.spriteYOffset;

    // if enemy moving left to right
    if(direction === 1) {
        // The enemy will start delay-1 columns to the
        // left side of the canvas
        obj.x = -delay * game.columnSize-game.columnSize;

        // go left to right
        obj.direction = 1;
    }
    else {
        // The enemy will start delay+1 columns to the
        // right side of the canvas
        obj.x = delay * game.columnSize + (game.columns + 1) * game.columnSize;

        // go right to left
        obj.direction = -1;
    }

    // speedMultiplier will be used to
    // increase enemy speed as the player levels up
    obj.speedMultiplier = speedMultiplier;

    obj.sprite = 'images/enemy-bug.png';

    // delay is saved for use when the object is updated
    obj.delay = delay;

    return obj;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {

    // Move the enemy.
    // if enemy is moving left to right
    if(this.direction === 1) {

        // if the enemy is still on the canvas
        if(this.x < ctx.canvas.width) {
            // move enemy to the right by
            // columnSize * speedMultiplier * dt
            this.x = this.x + game.columnSize * this.speedMultiplier * dt;
        }
        else {
            // The enemy is off of the right side of the canvas.
            // Reset the x position so the enemy is delay-1 columns
            // to the left of the canvas.
            this.x = -this.delay * game.columnSize - game.columnSize;
        }
    }
    // else enemy is moving right to left
    else {
        // if the enemy is still on the canvas
        if(this.x > 0) {
            // move enemy to the left by
            // columnSize * speedMultiplier * dt
            this.x = this.x - game.columnSize * this.speedMultiplier * dt;
        }
        else {
            // The enemy is off of the left side of the canvas.
            // Reset the x position so the starts delay+1 colums
            // to the right of the canvas
            this.x = this.delay * game.columnSize + (game.columns + 1) * game.columnSize;
        }
    }

    // Check for a collision between the enemy and the player.
    // if enemy is moving left to right
    if(this.direction === 1) {
        // if the enemy and player are in the same row
        if(this.y === player.y - player.spriteYOffset) {
            // Check and see if the enemy and player collided.
            // if the x values of player and the enemy indicate the player and enemy are colliding
           if(player.x - this.x < (this.rightSide-player.leftSide) && player.x - this.x > (player.leftSide - this.rightSide)) {

                // The player collided with the enemy and has lost the level
                player.lostLevel = true;

                // Set the slide direction of the player
                // to the direction of the enemy
                player.slideDirection = this.direction;

                // now the enemy moves the player offscreen!
                if(player.x < ctx.canvas.width) {
                    player.x = this.x + 20;
                }
                else {
                    // after the player is offscreen, place player on bottom row
                    player.y = game.rows * game.rowSize-player.spriteYOffset;
                }
            }
        }
    }
    else {
        // if the enemy and player are in the same row
        if(this.y === player.y - player.spriteYOffset) {
            // Check and see if the enemy and player collided.
            // if the x values of player and the enemy indicate the player and enemy are colliding
            if(this.x - player.x < (player.rightSide + this.rightSide) && this.x - player.x > (this.leftSide + player.leftSide)) {

                // The player collided with the enemy and has lost the level
                player.lostLevel = true;

                // Set the slide direction of the player
                // to the direction of the enemy
                player.slideDirection = this.direction;

                // now the enemy moves the player offscreen!
                if(player.x > -player.rightSide) {
                    player.x = this.x - 99;
                }
                else {
                    // after the player is offscreen, place player on bottom row
                    player.y = game.rows * game.rowSize - player.spriteYOffset;
                }
            }
        }
    }
};

// flip enemy sprite horizontally and draw it so enemy faces left
Enemy.prototype.drawFlippedSprite = function(image,x,y) {
    // save the current coordinate system
    ctx.save();
    // flip the coordinate system horizontally
    ctx.scale(-1,1);
    ctx.drawImage(image,-x,y);
    // restore original coordinate system
    ctx.restore();
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    if(this.direction === 1) {
        // Draw enemy facing right
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
    else {
        // Draw enemy facing left
        this.drawFlippedSprite(Resources.get(this.sprite),this.x,this.y);
    }
};

// Player constructor
var Player = function() {
    var obj = Object.create(Player.prototype);
    obj.sprite = 'images/char-boy.png';

    // The player sprite must be offset by the specified number of
    // pixels in order to appear in the middle of the row
    obj.spriteYOffset = 10;

    // These variables are the x pixel values used when
    // checking for a collision.
    obj.leftSide = 17;
    obj.rightSide = 83;

    obj.wonLevel = false;
    obj.lostLevel = false;
    obj.gameOver = false;

    // level is incremented every time a player makes it to the water
    obj.level = 1;

    // losses is incremented every time the player loses.
    obj.losses = 0;

    // slideDirection determines which way player slides offscreen after losing level
    // -1: player must slide in from left
    //  0: no slide direction specified
    //  1: player must slide in from right
    obj.slideDirection = 0;

    // the player starts with two lives
    obj.lives = 2;

    // player starts in the third column
    obj.x = 2 * game.columnSize;

    // player starts on the bottom row
    obj.y = game.rows * game.rowSize - obj.spriteYOffset;
    return obj;
};

Player.prototype.update = function(dt) {
    if(this.y === -10) {
        // The player has reached the water and wins the level
        this.wonLevel = true;

        // set slide direction to the left
        this.slideDirection = -1;

        // Slide the player offscreen to the left
        if (this.x > -110) {
            this.x = (this.x - 10);
        }
        else {
            // increase the speed of the enemies and reset the player's position
            for(var i = 0; i < allEnemies.length; i++) {
                allEnemies[i].speedMultiplier = allEnemies[i].speedMultiplier * 1.1;
            }

            // after the player is offscreen, place player on bottom row
            this.y = game.rows * game.rowSize-this.spriteYOffset;
        }
    }

    // if the player is in the bottom row and just won
    // OR player just lost and slideDirection is 'left'
    if(this.y === game.rows * game.rowSize - 10 && (this.wonLevel === true || this.slideDirection === -1)) {

        // if the game is not about to be over
        if(this.lives > 1 || this.wonLevel === true) {

            // slide the player in from left
            if (this.x < 2 * game.columnSize) {

                // move player a little closer to starting point
                if(this.x < 2 * game.columnSize - 19) {
                    this.x = (this.x + 10);
                }
                else {
                    // if player is really close to starting point,
                    // set player's position to starting point
                    this.x = 2 * game.columnSize;
                    this.resetPosition();
                }
            }
        }
        // else Game Over
        else {
            this.resetPosition();
        }
    }

    if(this.y === game.rows * game.rowSize - 10 && (this.wonLevel === true || this.slideDirection === 1)) {

        // if the game is not about to be over
        if(this.lives > 1 || this.wonLevel === true) {
            // slide the player in from right
            if (this.x > 2 * game.columnSize) {
                if(this.x > 2 * game.columnSize + 19) {
                    // move player a little closer to starting point
                    this.x = (this.x - 10);
                }
                else {
                    //if we are really close to starting point
                    // reset player's position
                    this.resetPosition();
                }
            }
        }
        // else Game Over
        else {
            this.resetPosition();
        }
    }
};

Player.prototype.render = function(dt) {
    if(this.lostLevel === false) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
    else {
        if(this.slideDirection === -1) {
            player.drawRotatedSprite(Resources.get(this.sprite), this.x, this.y, 90);
        }
        else {
            player.drawRotatedSprite(Resources.get(this.sprite), this.x, this.y, 270);
        }
    }
};

Player.prototype.resetPosition = function(dt) {
    if(this.wonLevel === true) {
        // Level up!
        this.level++;
        // 1UP!
        this.lives++;
        game.gameMessage = "LEVEL UP!  Level " + this.level;
    }

    if(this.lostLevel === true) {
        this.losses++;
        this.lives--;
        if(this.lives === 0) {
            this.gameOver = true;
            game.gameMessage = "GAME OVER";
        }
        else {
            if(this.losses === 1) {
                game.gameMessage = "TRY AGAIN";
            }
            else if(this.lives === 1) {
                game.gameMessage = "DON'T LOSE AGAIN!";
            }
            else {
                game.gameMessage = this.losses + " LADYBUGS FED!";
            }
        }
    }

    this.wonLevel = false;
    this.lostLevel = false;
    this.slideDirection = 0;

    // keep player location offscreen if the game is over
    if(!player.gameOver) {
        this.x = 2 * game.columnSize;
        this.y = game.rows * game.rowSize - 10;
    }
};

Player.prototype.handleInput = function(direction) {

    // only handle input if the game is not over and player has not won or lost the level yet
    if(this.lostLevel === false && this.wonLevel === false && this.gameOver === false) {
        switch(direction) {
            case "up":
                // ignore input if moving up will take player off canvas
                if(this.y - game.rowSize + 10 >= 0) {
                    this.y = this.y - game.rowSize;
                    // reset gameMessage when player presses up
                    game.gameMessage = "";
                }
                break;
            case "down":
                // ignore input if moving down will take player off canvas
                if(this.y <= 322) {
                    this.y = this.y + game.rowSize;
                }
                break;
            case "left":
                // ignore input if moving left will take player off canvas
                if(this.x > 0) {
                    this.x = this.x - game.columnSize;
                }
                break;
            case "right":
                // ignore input if moving right will take player off canvas
                if(this.x < 404) {
                    this.x = this.x + game.columnSize;
                }
                break;
            default:
                // do nothing
        }
        // Draw image in updated position.
        // There is less lag if drawImage() is called here
        // as opposed to waiting for engine.js to call player.render()
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
};

// This function is a modified version of the function presented
// on this site: gamedev.stackexchange.com/questions/67274
Player.prototype.drawRotatedSprite = function (image, x, y, angle) {
    // save the current coordinate system
    ctx.save();

    // Translate so player is in middle of board square
    ctx.translate(x + 40, y + 100);

    // convert angle from degrees to radians and rotate
    ctx.rotate(angle * Math.PI / 180);

    // draw sprite up and to the left by half the width
    // and height of the sprite
    ctx.drawImage(image, -(image.width / 2), -(image.height / 2));

    // restore original coordinate system
    ctx.restore();
};

// Now instantiate your objects.

// create game object
var game = Game();

// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];

// Enemy costructor parameters: row, delay, direction, speedMultiplier
// Row is an integer betwen 1 and 3.
// The enemy will be drawn delay+1 columns offscreen of the canvas.
// Direction is -1 for right to left movement, 1 for left to right movement.
// speedMultiplier is a random speed between .75 and 1
allEnemies[0] = Enemy(1,   0, -1, .75 + Math.random() / 4);
allEnemies[1] = Enemy(2,   0,  1, .75 + Math.random() / 4);
allEnemies[2] = Enemy(3,   0, -1, .75 + Math.random() / 4);
allEnemies[3] = Enemy(1, 2.5, -1, .75 + Math.random() / 4);
allEnemies[4] = Enemy(2, 2.5,  1, .75 + Math.random() / 4);
allEnemies[5] = Enemy(3, 2.5, -1, .75 + Math.random() / 4);

// create player object
var player = Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});