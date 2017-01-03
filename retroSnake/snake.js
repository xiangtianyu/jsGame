/**
 * Created by xiangtianyu on 2016/12/29.
 */
(function(){
    var speed = 300;
    var snake = [21, 22];
    var height = 0;
    var width = 0;
    var direction = 2;
    var block_width = 10;
    var block_height = 10;
    var w, h;
    var random_block = 23;
    var ctx;

    function drawSnake(sn, flag) {
        if (flag == 0) ctx.fillStyle = "White";
        else    ctx.fillStyle = "Black";
        ctx.fillRect(sn%w * block_height + 1,
            ~~(sn/w) * block_height + 1, block_width, block_height);
    }

    function randomBlock() {
        while (true) {
            var ran = Math.floor(Math.random()*((width/block_width) * (height/block_height)));
            if (checkBlock(ran) == true){
                return ran;
            }
        }
    }

    function checkBlock(r) {
        for (var i = 0; i < snake.length; i++) {
            if (r == snake[i]) {
                return false;
            }
        }
        return true;
    }

    function checkGameOver(loc) {
        if (loc <= 0 || loc >= w * h || loc/w >= h
            || loc%w == 0&&direction == 2 || loc%w == (h-1)&&direction == 0 || !checkBlock(loc)) {
            return false;
        }
        return true;
    }

    window.onload = function(){
        ctx = document.getElementById("snake").getContext("2d");
        height = document.getElementById("snake").getAttribute("height");
        width = document.getElementById("snake").getAttribute("width");
        w = width/block_width;
        h = height/block_height;

        for (var i = 0; i < snake.length; i++) {
            drawSnake(snake[i], 0);
        }
        drawSnake(random_block, 0);

        document.onkeydown = function(e) {
            var key = e.keyCode;
            var dir = key - 37;
            if (Math.abs(direction - dir) !== 2 && dir >= 0 && dir <= 3) {
                direction = dir;
            }
        };

        var interval = setInterval(function () {
            var now_block = snake[snake.length-1];
            if (direction == 0) now_block--;
            else if (direction == 1) now_block -= (width/block_width);
            else if (direction == 2) now_block++;
            else now_block += (width/block_width);
            if (!checkGameOver(now_block)) {
                alert("GAME OVER!");
                clearInterval(interval);
            }
            else {
                if (now_block == random_block) {
                    snake.push(now_block);
                    random_block = randomBlock();
                    drawSnake(random_block, 0);
                }
                else {
                    snake.push(now_block);
                    drawSnake(now_block, 0);
                    drawSnake(snake[0], 1);
                    snake = snake.slice(1);
                }
            }

        }, speed)
    }
})();
