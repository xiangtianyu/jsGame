/**
 * Created by xiangtianyu on 2016/12/29.
 */
(function(){
    //各种形状的俄罗斯方块各一种
    var block_1 = [[0, 0], [1, 0], [0, 1], [1, 1]];   //same
    var block_2 = [[0, 0], [-1, 0], [1, 0], [2, 0]];    //----
    var block_3 = [[0, 0], [0, -1], [0, 1], [1, 1]];   //__|
    var block_4 = [[0, 0], [-1, 0], [1, 0], [0, -1]];    //_|_
    var block_5 = [[0, 0], [0, -1], [0, 1], [-1, 1]];   //|__
    var block_6 = [[0, 0], [-1, 0], [0, -1], [1, -1]];   //z
    var block_7 = [[0, 0], [1, 0], [0, -1], [-1, -1]];   //s

    //辅助数组来判断现在使用的是哪一种方块
    var r1 = [0];
    var r2 = [1, 2];
    var r3 = [3, 4, 5, 6];
    var r4 = [7, 8, 9, 10];
    var r5 = [11, 12, 13, 14];
    var r6 = [15, 16, 17, 18];
    var r7 = [19, 20, 21, 22];
    var r = [r1, r2, r3, r4, r5, r6, r7];
    
    var ctx;                    //游戏的canvas
    var c;                      //展示分数的canvas

    var block_width = 20;       //一个block的宽度
    var block_height = 20;      //一个block的高度
    var height = 600;           //canvas的高度
    var width = 400;            //canvas的宽度
    var x = width / block_width;        //canvas的每行block的数目
    var y = height / block_height;      //canvas的每列block的数目

    var start_point = [x / 2, 1];       //俄罗斯方块的生成初始地

    var all_shape;                      //记录所有的形状

    var all_color = ["Green", "White", "Red", "Blue"];      //记录所有的颜色

    var now_shape;                      //记录当前的形状
    var now_color;                      //记录当前的颜色
    var now_point;                      //记录当前的形状在all_shape中的位置
    var next_shape;                     //记录下一时刻图形的状态
    var next_block;                     //记录下一个图形的形状
    var next_color;                     //记录下一个图形的颜色
    var next_point;                     //记录下一个图形在all_shape中的位置

    var down_height = 0;                //记录方块下坠的高度
    var side_width = x / 2;             //记录方块横向移动的距离

    var block_used = [];                //记录当前所有块的被占用情况
    var block_color = [];               //记录当前所有块中的颜色

    var score = 0;                      //记录得分

    //根据初始的块的形状，通过旋转90,180,270度获取该形状的四种不同形态
    function rotate(block) {
        var rotate_1 = block.map(function (x) {
            return [-x[1], x[0]];
        });
        var rotate_2 = block.map(function (x) {
            return [-x[0], -x[1]];
        });
        var rotate_3 = block.map(function (x) {
            return [x[1], -x[0]];
        });
        return [block, rotate_1, rotate_2, rotate_3];
    }

    //获取所有形状
    function getAllShape() {
        var allshape = [];
        allshape.push(block_1);
        allshape.push(block_2);
        allshape.push([[0, 0], [0, -1], [0, 1], [0, 2]]);
        rotate(block_3).forEach(function (b) {
            allshape.push(b);
        });
        rotate(block_4).forEach(function (b) {
            allshape.push(b);
        });
        rotate(block_5).forEach(function (b) {
            allshape.push(b);
        });
        rotate(block_6).forEach(function (b) {
            allshape.push(b);
        });
        rotate(block_7).forEach(function (b) {
            allshape.push(b);
        });
        return allshape;
    }

    //随机生成一个形状
    function getOneShape(flag) {
        down_height = 0;
        side_width = x / 2;
        var len = all_shape.length;
        var ran = Math.floor(Math.random()*len);
        if (flag == 1)  now_point = ran;
        else if (flag == 0){
            now_point = next_point;
            next_point = ran;
        }
        else {
            next_point = ran;
        }
        var s = all_shape[ran];
        var alen = s.length;
        var newShape = [];
        for (var i = 0; i < alen; i++) {
            newShape.push([s[i][0]+start_point[0], s[i][1]+start_point[1]]);
        }
        return newShape;
    }

    //随机生成一个颜色
    function getOneColor() {
        var len = all_color.length;
        var ran = Math.floor(Math.random()*len);
        return all_color[ran];
    }

    //点和canvas上的具体位置的转换
    function pointToPosition(x, y) {
        var h = y * block_height;
        var w = x * block_width;
        return {width: w, height: h};
    }

    //在canvas上重画块
    function redrawBlock(block, color) {
        ctx.fillStyle = color;
        var len = block.length;
        for (var i = 0; i < len; i++) {
            var position = pointToPosition(block[i][0], block[i][1]);
            ctx.fillRect(position.width, position.height, block_width-1, block_height-1);
        }
    }

    //在消除行后，重画所有
    function redrawAll() {
        for (var k = 0; k < y; k++) {
            for (var q = 0; q < x; q++) {
                var c = block_color[k][q];
                if (c == -1)    ctx.fillStyle = "Black";
                else            ctx.fillStyle = all_color[c];
                var position = pointToPosition(q, k);
                ctx.fillRect(position.width, position.height, block_width-1, block_height-1);
            }
        }
    }

    //控制方块的下降和左右移动行为
    function blockChange(block, dir) {
        var len = block.length;
        var newBlock = [];
        if (dir == 2) {
            down_height++;
        }
        for (var i = 0; i < len; i++) {
            var b = [];
            if (dir == 0) {
                b.push(block[i][0]-1);
                b.push(block[i][1]);
            }
            else if (dir == 1) {
                b.push(block[i][0]+1);
                b.push(block[i][1]);
            }
            else if (dir == 2) {
                b.push(block[i][0]);
                b.push(block[i][1]+1);
            }
            newBlock.push(b);
        }
        return newBlock;
    }


    //辅助函数
    function findInGroup(num) {
        var len = r.length;
        for (var i = 0;i < len; i++) {
            num -= r[i].length;
            if (num < 0) {
                return {group:i, index:num+r[i].length};
            }
        }
    }

    //方块的旋转控制
    function rotation(position) {
        var shape;
        var group = findInGroup(position).group;
        var index = findInGroup(position).index;
        var g = r[group];
        if (index == g.length-1) {
            now_point -= (g.length-1);
            shape = all_shape[g[0]];
        }
        else {
            now_point++;
            shape = all_shape[g[index+1]];
        }
        var newShape = [];
        for (var i = 0; i < shape.length; i++) {
            newShape.push([shape[i][0]+side_width, shape[i][1]+down_height]);
        }
        return newShape;
    }

    //两旁边际检查
    function checkSide(block) {
        var ls = x;
        var rs = 0;
        block.forEach(function (e) {
            if (e[0] < ls)  ls = e[0];
            if (e[0] > rs)  rs = e[0];
        });
        return (ls < 0 || rs >= x);
    }


    //底部边际检查
    function checkBottom(block) {
        var bottom = 0;
        block.forEach(function (e) {
            if (e[1] > bottom)  bottom = e[1];
        });
        return (bottom >= y);
    }

    //顶部边际检查
    function checkTop(block) {
        var top = y;
        block.forEach(function (e) {
            if (e[1] < top)     top = e[1];
        });
        return (top < 0);
    }

    //检查块是否停止运动并生成新的随机块
    function checkStop(block) {
        for (var i = 0; i < block.length; i++) {
            if (block_used[block[i][1]][block[i][0]] == 1){
                return true;
            }
        }
        return false;
    }

    //初始化全局块记录
    function initBlockUsed() {
        for (var i = 0; i < y; i++) {
            var line = [];
            var color = [];
            for (var j = 0; j < x; j++) {
                line.push(0);
                color.push(-1);
            }
            block_used.push(line);
            block_color.push(color);
        }
    }

    //改变全局块记录
    function changeBlockUsed(block, color) {
        var i = all_color.indexOf(color);
        block.forEach(function (e) {
            block_used[e[1]][e[0]] = 1;
            block_color[e[1]][e[0]] = i;
        })
    }

    //检查是否一行已经可以消除
    function checkLineFull() {
        var line = [];
        var color = [];
        var flag = 0;
        for (var l = 0; l < x; l++) {
            line.push(0);
            color.push(-1);
        }

        for (var i = 0; i < y; i++) {
            for (var j = 0; j < x; j++) {
                if (block_used[i][j] == 0)  break;
                if (j == x - 1) {
                    block_used.splice(i, 1);
                    block_color.splice(i, 1);
                    block_used.unshift(line);
                    block_color.unshift(color);
                    score += 20;
                    flag = 1;
                }
            }
        }

        if (flag == 1) {
            redrawAll();
            drawScore(score);
        }
    }

    //画出分数
    function drawScore(score) {
        c.fillStyle = "Black";
        c.fillRect(50, 2/3 * height, 100, 100);
        c.font = "30px Courier New";
        c.fillStyle = "White";
        c.fillText(score, 70, 2/3 * height + 50);
    }

    //画出下一个形状
    function drawNextShape(block, color) {
        c.fillStyle = color;
        var len = block.length;
        for (var i = 0; i < len; i++) {
            var position = pointToPosition(block[i][0]-start_point[0], block[i][1]);
            c.fillRect(position.width+70, position.height+100, block_width-1, block_height-1);
        }
    }

    window.onload = function() {
        initBlockUsed();
        all_shape = getAllShape();
        ctx = document.getElementById("game").getContext("2d");
        document.getElementById("game").setAttribute("height", height+"px");
        document.getElementById("game").setAttribute("width", width+"px");


        c = document.getElementById("score").getContext("2d");
        document.getElementById("score").setAttribute("height", height+"px");
        document.getElementById("score").setAttribute("width", "200px");
        drawScore(score);
        c.font = "30px Courier New";
        c.fillStyle = "White";
        c.fillText("Score:", 50, 2/3 * height);

        now_shape = getOneShape(1);
        next_block = getOneShape(2);
        now_color = getOneColor();
        next_color = getOneColor();
        drawNextShape(next_block, next_color);

        document.onkeydown = function(e) {
            var key = e.keyCode;
            var dir = key - 37;
            if (dir == 0) {
                next_shape = blockChange(now_shape, 0);
                if (!checkSide(next_shape) && !checkStop(next_shape)) {
                    redrawBlock(now_shape, "Black");
                    now_shape = next_shape;
                    redrawBlock(now_shape, now_color);
                    side_width--;
                }
            }
            else if (dir == 2) {
                next_shape = blockChange(now_shape, 1);
                if (!checkSide(next_shape) && !checkStop(next_shape)) {
                    redrawBlock(now_shape, "Black");
                    now_shape = next_shape;
                    redrawBlock(now_shape, now_color);
                    side_width++;
                }
            }
            else if (dir == 1) {
                var n = now_point;
                next_shape = rotation(now_point, now_shape);
                if (!checkSide(next_shape) && !checkStop(next_shape)) {
                    redrawBlock(now_shape, "Black");
                    now_shape = next_shape;
                    redrawBlock(now_shape, now_color);
                }
                else {
                    now_point = n;
                }
            }
            else if (dir == 3) {
                if (checkTop(now_shape) || checkStop(now_shape)){
                    clearInterval(interval);
                    alert("GAME, OVER!");
                }
                next_shape = blockChange(now_shape, 2);
                down_height--;
                if (checkBottom(next_shape) || checkStop(next_shape)) {
                    changeBlockUsed(now_shape, now_color);
                    redrawBlock(now_shape, now_color);
                    checkLineFull();
                    drawNextShape(next_block, "Black");
                    now_shape = next_block;
                    next_block = getOneShape(0);
                    now_color = next_color;
                    next_color = getOneColor();
                    drawNextShape(next_block, next_color);
                }
                else {
                    redrawBlock(now_shape, "Black");
                    now_shape = blockChange(now_shape, 2);
                    redrawBlock(now_shape, now_color);
                }
            }
        };

        var interval = setInterval(function () {
            if (checkTop(now_shape) || checkStop(now_shape)){
                clearInterval(interval);
                alert("GAME, OVER!");
            }
            next_shape = blockChange(now_shape, 2);
            down_height--;
            if (checkBottom(next_shape) || checkStop(next_shape)) {
                changeBlockUsed(now_shape, now_color);
                redrawBlock(now_shape, now_color);
                checkLineFull();
                drawNextShape(next_block, "Black");
                now_shape = next_block;
                next_block = getOneShape(0);
                now_color = next_color;
                next_color = getOneColor();
                drawNextShape(next_block, next_color);
            }
            else {
                redrawBlock(now_shape, "Black");
                now_shape = blockChange(now_shape, 2);
                redrawBlock(now_shape, now_color);
            }
        }, 500)
    }
})();