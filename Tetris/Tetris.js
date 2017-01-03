/**
 * Created by xiangtianyu on 2016/12/29.
 */
(function(){
    var block_1 = [[0, 0], [1, 0], [0, 1], [1, 1]];   //same
    var block_2 = [[0, 0], [-1, 0], [1, 0], [2, 0]];    //----
    var block_3 = [[0, 0], [0, -1], [0, 1], [1, 1]];   //__|
    var block_4 = [[0, 0], [-1, 0], [1, 0], [0, -1]];    //_|_
    var block_5 = [[0, 0], [0, -1], [0, 1], [-1, 1]];   //|__
    var block_6 = [[0, 0], [-1, 0], [0, -1], [1, -1]];   //z
    var block_7 = [[0, 0], [1, 0], [0, -1], [-1, -1]];   //s

    var r1 = [0];
    var r2 = [1, 2];
    var r3 = [3, 4, 5, 6];
    var r4 = [7, 8, 9, 10];
    var r5 = [11, 12, 13, 14];
    var r6 = [15, 16, 17, 18];
    var r7 = [19, 20, 21, 22];
    var r = [r1, r2, r3, r4, r5, r6, r7];
    
    var ctx;

    var block_width = 10;
    var block_height = 10;
    var height = 600;
    var width = 400;
    var x = width / block_width;
    var y = height / block_height;

    var start_point = [x / 2, 0];

    var all_shape;

    var all_color = ["Green", "White", "Red", "Blue"];

    var isBottom = false;

    var now_shape;
    var now_color;
    var now_point;
    var next_shape;

    var down_height = 0;
    var side_width = x / 2;

    var block_used = [];

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

    function getOneShape() {
        down_height = 0;
        side_width = x / 2;
        var len = all_shape.length;
        var ran = Math.floor(Math.random()*len);
        now_point = ran;
        var s = all_shape[ran];
        var alen = s.length;
        var newShape = [];
        for (var i = 0; i < alen; i++) {
            newShape.push([s[i][0]+start_point[0], s[i][1]+start_point[1]]);
        }
        return newShape;
    }

    function getOneColor() {
        var len = all_color.length;
        var ran = Math.floor(Math.random()*len);
        return all_color[ran];
    }

    function pointToPosition(x, y) {
        var h = y * block_height;
        var w = x * block_width;
        return {width: w, height: h};
    }
    
    function redrawBlock(block, color) {
        ctx.fillStyle = color;
        var len = block.length;
        for (var i = 0; i < len; i++) {
            var position = pointToPosition(block[i][0], block[i][1]);
            ctx.fillRect(position.width, position.height, block_width, block_height);
        }
    }

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

    function findInGroup(num) {
        var len = r.length;
        for (var i = 0;i < len; i++) {
            num -= r[i].length;
            if (num < 0) {
                return {group:i, index:num+r[i].length};
            }
        }
    }

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

    function checkSide(block) {
        var ls = x;
        var rs = 0;
        block.forEach(function (e) {
            if (e[0] < ls)  ls = e[0];
            if (e[0] > rs)  rs = e[0];
        });
        return (ls >= 0 && rs < x);
    }

    function checkBottom(block) {
        var bottom = y;
    }

    function initBlockUsed() {
        for (var i = 0; i < y; i++) {
            var line = [];
            for (var j = 0; j < x; j++) {
                line.push(0);
            }
            block_used.push(line);
        }
    }
    
    window.onload = function() {
        all_shape = getAllShape();
        ctx = document.getElementById("snake").getContext("2d");
        document.getElementById("snake").setAttribute("height", height+"px");
        document.getElementById("snake").setAttribute("width", width+"px");

        now_shape = getOneShape();
        now_color = getOneColor();

        document.onkeydown = function(e) {
            var key = e.keyCode;
            var dir = key - 37;
            if (dir == 0) {
                next_shape = blockChange(now_shape, 0);
                if (checkSide(next_shape)) {
                    redrawBlock(now_shape, "Black");
                    now_shape = next_shape;
                    redrawBlock(now_shape, now_color);
                    side_width--;
                }
            }
            else if (dir == 2) {
                next_shape = blockChange(now_shape, 1);
                if (checkSide(next_shape)) {
                    redrawBlock(now_shape, "Black");
                    now_shape = next_shape;
                    redrawBlock(now_shape, now_color);
                    side_width++;
                }
            }
            else if (dir == 1) {
                var n = now_point;
                next_shape = rotation(now_point, now_shape);
                if (checkSide(next_shape)) {
                    redrawBlock(now_shape, "Black");
                    now_shape = next_shape;
                    redrawBlock(now_shape, now_color);
                }
                else {
                    now_point = n;
                }
            }
        };

        var interval = setInterval(function () {
            if (isBottom) {
                redrawBlock(now_shape, now_color);
                now_shape = getOneShape();
                now_color = getOneColor();
            }
            else {
                redrawBlock(now_shape, "Black");
                now_shape = blockChange(now_shape, 2);
                redrawBlock(now_shape, now_color);
            }
        }, 1000)
    }
})();