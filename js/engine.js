var Engine = (function(global) {

    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    function main() {

        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        update(dt);
        render();

        lastTime = now;

        win.requestAnimationFrame(main);
    }

    function init() {
        lastTime = Date.now();
        main();
    }

    function update(dt) {
        updateEntities(dt);
    }

    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update();
    }

    function render() {

        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;


        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }
        renderEntities();
    }

    function renderEntities() {
        // I changed this to render the player first, then the enemies.
        // This way the player appears below the enemy when they are drawn in the same space
        player.render();

        allEnemies.forEach(function(enemy) {
            enemy.render();
        });
        // Display gameMessage
        ctx.textAlign = 'center';
        ctx.font = "64px Impact";
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.fillText(game.gameMessage,ctx.canvas.width / 2,ctx.canvas.height * .6);
        ctx.strokeText(game.gameMessage,ctx.canvas.width / 2,ctx.canvas.height * .6);

        // Display Lives Remaining.
        // This display is yellow if player has one life remaining,
        // red if player has one life remaining, and white otherwise.
        ctx.textAlign = 'left';
        ctx.font = "24px Impact";

        if(player.lives === 0) {
            ctx.fillStyle = "red";
        }
        else if(player.lives === 1) {
            ctx.fillStyle = "yellow";
        }
        else {
            ctx.fillStyle = "white";
        }
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;

        ctx.fillText("LIVES: " + player.lives,10,ctx.canvas.height-30);
        ctx.strokeText("LIVES: " + player.lives,10,ctx.canvas.height-30);

        // Display Level
        ctx.textAlign = 'right';
        ctx.font = "24px Impact";
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.fillText("LEVEL " + player.level,ctx.canvas.width-10,ctx.canvas.height-30);
        ctx.strokeText("LEVEL " + player.level,ctx.canvas.width-10,ctx.canvas.height-30);
    }

    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png'
    ]);
    Resources.onReady(init);

    global.ctx = ctx;
})(this);