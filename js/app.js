// Udacity Front End Developer Nanodegree Project 3 Take 1
// By: Patrick Roche 
//     patrick.l.roche@gmail.com 
//     https://github.com/plr108
//
// Note: I removed most of the default comments in app.js and engine.js for clarity.
//       No other project files were modified in creating this project.  See the 
//       README file for more info on setting up the game and gameplay. 
//
// Enemies our player must avoid
// row determines what row the Enemy will appear on
// delay determines the delay before Enemy appears on the screen
//
//
// Global Variables

// column size in pixels
var columnSize = 101;

// row size in pixels
var rowSize = 83;

// The sprites must be offset by the specified number of
// pixels in order to appear in the middle of the row 
var enemySpriteYOffset = 20;
var playerSpriteYOffset = 10;

// collisionXOffset is used to account for the transparent
// parts of the enemy and player sprites when checking fo 
// a collision
var collisionXOffset = 80;

// playerSlideSpeedMultiplier affects how fast a player
// leaves/enters the canvas after winning/losing
var playerSlideSpeedMultiplier = 20;

// Enemy constructor
var Enemy = function(row, delay, direction, speedMultiplier) {
    
    var obj = Object.create(Enemy.prototype);

    // The enemy will start in the row specified by
    // row.  The enemySpriteYOffset is accounted for
    // so the enemy appears in the middle of the row.
    obj.y = row*rowSize-enemySpriteYOffset;
    
    if(direction === 1)
    {
        // The enemy will start delay+1 columns to the 
        // left side of the canvas
        obj.x = -delay*columnSize-columnSize;
        
        // go left to right
        obj.direction = 1;
    }
    else
    {
        // The enemy will start delay+1 columns to the 
        // right side of the canvas
        obj.x = delay*columnSize+5*columnSize;

        // go right to left
        obj.direction = -1
    }

    // speedMultiplier will  be used to 
    // increase enemy speed as the player levels up
    obj.speedMultiplier = speedMultiplier;
    obj.sprite = 'images/enemy-bug.png';

    return obj;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {

    // move the enemy
    if(this.direction === 1) {
        if(this.x < ctx.canvas.width * 1.2)
        {
            // move enemy to the right by
            // columnSize * speedMultiplier * dt
            this.x = this.x + columnSize * this.speedMultiplier * dt;
        }
        else
        {
            // The enemy is off of the side of the canvas.
            // Reset the x position so the enemy reappears on the other side
            this.x = -columnSize;
        }
    } 
    else {
        // if enemy is not well off of the side of the canvas
        if(this.x > -ctx.canvas.width * 1.2)
        {
            // move enemy to the left by
            // columnSize * speedMultiplier * dt
            this.x = this.x - columnSize * this.speedMultiplier * dt;
        }
        else
        {
            // The enemy is off of the side of the canvas.
            // Reset the x position so the enemy reappears on the other side
            this.x = ctx.canvas.width+columnSize;
        }
    }

    

    // if the player is in the same row as the enemy, check for a collision
    if(this.direction === 1) {
        if(this.y === player.y - playerSpriteYOffset)
        {
            // check and see if the enemy and player collided.
            // collisionXOffset accounts for the transparent parts
            // of the enemy and player sprites.

            // Pixels to bug nose: 98
            // Piexels to bug end: 1
            // Pixels to player start: 17
            // Pixels to player end: 83
            //if(Math.abs(player.x - this.x) < collisionXOffset) {
            //temp = this.x-player.x;
            //console.log("player.x: " + player.x + "\nthis.x: " + this.x + "\nthis.x-player.x: " + temp);    
           if(player.x - this.x < (98-17) && player.x-this.x > (17-98)) {
            
                // The player collided with the enemy and has lost
                player.losing = true;

                // now the enemy moves the player offscreen!
                if(player.x < ctx.canvas.width * 1.1)
                {
                    player.x = this.x + playerSlideSpeedMultiplier;
                }
                else
                {
                    // place player on bottom row
                    player.y = 5*rowSize-playerSpriteYOffset;
                }
            }

        }
    } else {
        if(this.y === player.y - playerSpriteYOffset)
        {

            // check and see if the enemy and player collided.
            // collisionXOffset accounts for the transparent parts
            // of the enemy and player sprites.


            // Pixels to bug nose: 2
            // Pixels to bug end: 99
            // Pixels to player start: 17
            // Pixels to player end: 83
            if(this.x-player.x < (83+99) && this.x-player.x > (2+17)) {
                
                // The player collided with the enemy and has lost
                player.losing = true;

                // now the enemy moves the player offscreen!
                if(player.x > ctx.canvas.width * 1.1)
                {
                    player.x = this.x - playerSlideSpeedMultiplier;
                }
                else
                {
                    // place player on bottom row
                    player.y = 5*rowSize-playerSpriteYOffset;
                }
            }

        } 
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    if(this.direction === 1) {
        // Enemy faces right
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }    
    else
    {
        // Enemy faces left
        flipImage(Resources.get(this.sprite),this.x,this.y);
    }
};

// Player constructor
var Player = function() {
    var obj = Object.create(Player.prototype);
    obj.sprite = 'images/char-boy.png';
    
    // winning is set to true true when player has won the level
    obj.winning = false;

    //losing is set to true true when player has lost the level
    obj.losing = false;

    // level is incremented every time a player makes it to the water
    obj.level = 0;

    // column multipler = 101, row multiplier = 83
    obj.x = 2*101;
    obj.y = 5*83-playerSpriteYOffset;
    return obj;
};

Player.prototype.update = function(dt) {
    if(this.y === -10) {
        // The player has reached the water and wins the level
        // increase the difficulty level
        this.level++;
        this.winning=true;

        // Slide the player offscreen to the left
        if (this.x > -110) {
            this.x = (this.x - 10);
        }
        else
        {
            // increase the speed of the enemies and reset the player's position
            for(var i=0; i < allEnemies.length; i++)
            {
                allEnemies[i].speedMultiplier++;
            }
            this.y=5*83-10;
        }
    }

    // if the player is in the bottom row and just won    
    if(this.y === 5*83-10 && player.winning === true) {

        // slide the player in from left 
        if (this.x < 2*101) {
            
            if(this.x < 2*101-19) {
                // move player a little closer to starting point
                this.x = (this.x + 10);
            }
            else
            {
                //if we are really close, set player's position to starting point 
                this.x = 2*101;
                player.resetPosition();
            }
        }
    }

    // if the player is off the right side of the canvas and just lost    
    // <START HERE> issue: player is stuck at x=691 after losing 
    if(this.y === 5*83-10 && player.losing === true) {

        // slide the player in from right 
        if (this.x > 2*101) {            
            if(this.x > 2*101+19) {
                // move player a little closer to starting point
                this.x = (this.x - 10);
            }
            else
            {
                //if we are really close, set player's position to starting point 
                this.x = 2*101;
                player.resetPosition();
            }
        }
    }
    
};

Player.prototype.render = function(dt) {    
    if(this.losing === false){
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
    else
    {
        drawRotatedImage(Resources.get(this.sprite), this.x, this.y, 270);
    }
};

Player.prototype.resetPosition = function(dt) {    

    this.y = 5*83-10;    
    this.winning = false;
    this.losing = false;    
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


Player.prototype.handleInput = function(direction) {

    // only handle input if the player has not won or lost yet
    if(this.losing === false && this.winning === false){
        switch(direction) {
            case "up":
                if(this.y - 83 + 10 >= 0) {
                    this.y = this.y - 83;
                }
                //console.log("y = " + this.y);
                break;
            case "down":
                if(this.y <= 322) {
                    this.y = this.y + 83;
                }
                //console.log("y = " + this.y);
                    break;
            case "left":
                if(this.x > 0)
                {
                    this.x = this.x - 101;
                }
                //console.log("x = " + this.x);
                break;
            case "right":
                if(this.x < 404) {
                    this.x = this.x + 101;
                }
                //console.log("x = " + this.x);
                break;
            default:
                // do nothing
        }
        // draw image in updated position
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
};

// This function is a modified version of the function presented
// on this site: gamedev.stackexchange.com/questions/67274
function drawRotatedImage(image, x, y, angle) { 
    // save the current coordinate system 
    ctx.save(); 

    // Translate so player is in middle of board square
    ctx.translate(x+40, y+100);

    // convert angle from degrees to radians and rotate  
    ctx.rotate(angle * Math.PI/180);

    // draw it up and to the left by half the width
    // and height of the image 
    ctx.drawImage(image, -(image.width/2), -(image.height/2));

    // restore original coordinate system
    ctx.restore(); 
}

// flip image horizontally
function flipImage(image,x,y) {
    // save the current coordinate system 
    ctx.save(); 

    // Translate so player is in middle of board square
    //ctx.translate(x+40, y+100);

    // convert angle from degrees to radians and rotate  
    //ctx.rotate(angle * Math.PI/180);

    // draw it up and to the left by half the width
    // and height of the image 
    //ctx.drawImage(image, -(image.width/2), -(image.height/2));
    ctx.scale(-1,1);
    ctx.drawImage(image,-x,y);
    ctx.restore();    

    // restore original coordinate system
    
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];

//Enemy parameters: row, delay, direction, speedMultiplier
// Row is a random integer betwen 1 and 3

allEnemies[0] = Enemy(1, 0, -1, 1);
allEnemies[1] = Enemy(2, 0, 1, 1);
allEnemies[2] = Enemy(3, 0, -1, 1);
allEnemies[3] = Enemy(1, 3, -1, 1);
allEnemies[4] = Enemy(2, 3, 1, 1);
allEnemies[5] = Enemy(3, 3, -1, 1);
allEnemies[6] = Enemy(1, 6, -1, 1);
allEnemies[7] = Enemy(2, 6, 1, 1);
allEnemies[8] = Enemy(3, 6, -1, 1);

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