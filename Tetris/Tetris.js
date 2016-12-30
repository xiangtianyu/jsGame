/**
 * Created by xiangtianyu on 2016/12/29.
 */
(function(){
    var block_1 = [[-1, 1], [0, 1], [-1, 0], [0, 0]];   //same
    var block_2 = [[0, 2], [0, 1], [0, 0], [0, -1]];    //----
    var block_3 = [[-2, 0], [-1, 0], [0, 0], [0, 1]];   //__|
    var block_4 = [[-1, 0], [0, 0], [0, 1], [1, 0]];    //_|_
    var block_5 = [[-1, 1], [-1, 0], [0, 0], [0, 1]];   //|__
    var block_6 = [[-1, 2], [-1, 1], [0, 1], [0, 0]];   //s
    var block_7 = [[0, 2], [0, 1], [-1, 1], [-1, 0]];   //z
    
    var ctx;

    function rotate(block) {
        var rotate_1 = block.map(function (x, y) {
            return [-y, x];
        });
        var rotate_2 = block.map(function (x, y) {
            return [-x, -y];
        });
        var rotate_3 = block.map(function (x, y) {
            return [y, -x];
        });
        return [block, rotate_1, rotate_2, rotate_3];
    }

    function getAllShape() {
        var allshape = [];
        allshape.push(block_1);
        allshape.push(block_2);
        allshape.push([-2, 0], [-1, 0], [0, 0], [1, 0]);
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
    
    function redrawBlock(block, color) {
        ctx.fillStyle = color;
        
    }
    
    window.onload = function() {
        ctx = document.getElementById("snake").getContext("2d");
    }
})();