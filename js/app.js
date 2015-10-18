// Enemies our player must avoid
// row determines what row the Enemy will appear on
// delay determines the delay before Enemy appears on the screen
var Enemy = function(row, delay, speed) {
    
    var obj = Object.create(Enemy.prototype);
     
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started    
    
    // column multipler = 101, row multiplier = 83
    obj.x = (delay*-1)*101-101;
    obj.y = row*83-20;
    obj.speed = speed;

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    obj.sprite = 'images/enemy-bug.png';

    return obj;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    
    // if enemy is not well off of the right side of the canvas
    if(this.x < 1000)
    {
        // move enemy to the right
        this.x = this.x + 200 * dt * this.speed;
    }
    else
    {
        // The enemy is off of the right side of the canvas.
        // Reset the x position so the enemy reappears on the left side
        this.x = -110;
    }

    // if the player is in the same row as the enemy, check for a collision
    if(this.y === player.y - 10)
    {
        // check and see if the enemy and player collided.
        // The offset accounts for the whitespace in the enemy and player sprites
        if(Math.abs(player.x - this.x) < 80) {

            // The player collided with the enemy and has lost
            player.losing = true;

            // now the enemy moves the player offscreen!
            if(player.x < 700)
            {
                player.x = this.x + 20;
            }
            else
            {
                // place player on bottom row
                player.y = 5*83-10;
            }
        }
        else {
            // no collision, so do nothing
        }
    }
};

var TO_RADIANS = Math.PI/180; 

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
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
    obj.y = 5*83-10;
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
                allEnemies[i].speed++;
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


function drawRotatedImage(image, x, y, angle)
{ 
    // save the current coordinate system 
    ctx.save(); 

    // Translate so player is in middle of board square
    ctx.translate(x+40, y+100);

    // convert angle from degrees to radians and rotate  
    ctx.rotate(angle * TO_RADIANS);

    // draw it up and to the left by half the width
    // and height of the image 
    ctx.drawImage(image, -(image.width/2), -(image.height/2));

    // restore original coordinate system
    ctx.restore(); 
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
allEnemies[0] = Enemy(3,0,1);
allEnemies[1] = Enemy(2,1,.75);
allEnemies[2] = Enemy(3,2,.5);
allEnemies[3] = Enemy(1,5,1);
allEnemies[4] = Enemy(3,6,1);
allEnemies[5] = Enemy(2,7,.5);
allEnemies[6] = Enemy(2,8,1);
allEnemies[7] = Enemy(1,11,.5);
allEnemies[8] = Enemy(3,12,.75);

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
