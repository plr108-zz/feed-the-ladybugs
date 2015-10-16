// Enemies our player must avoid
// row determines what row the Enemy will appear on
// delay determines the delay before Enemy appears on the screen
var Enemy = function(row, delay) {
    
    var obj = Object.create(Enemy.prototype);
     
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    

    // column multipler = 101, row multiplier = 83
    obj.x = (delay*-1)*101-101;
    obj.y = row*83-20;

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
    this.x = this.x + 500 * dt;
};

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
    
    // column multipler = 101, row multiplier = 83
    obj.x = 2*101;
    obj.y = 5*83-10;
    return obj;
};

Player.prototype.update = function(dt) {
};

Player.prototype.render = function(dt) {    
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(direction) {
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
            console.log("x = " + this.x);
            break;
        default:
            // do nothing
    }
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
allEnemies[0] = Enemy(1,0);
allEnemies[1] = Enemy(2,1);
allEnemies[2] = Enemy(3,2);
allEnemies[3] = Enemy(1,5);
allEnemies[4] = Enemy(2,6);
allEnemies[5] = Enemy(3,8);
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
