"use strict";
var _ = require('lodash');

var whatItem = function (grandType) {
    switch (grandType) {
        case 0:
            return null;
            break;
        case 1:
            return 'A';
            break;
        case 2:
            return 'B';
            break;
        case 3:
            if (_.random(1, 2) == 1) {
                return 'A';
            } else {
                return 'B';
            }
            break;
        case 4:
            return 'C';
            break;
        case 5:
            var rand = _.random(1, 3);
            if (rand == 1) {
                return 'C';
            } else if (rand == 2) {
                return 'D';
            } else {
                return 'E';
            }
            break;
        case 6:
            return 'E';
            break;
    }
};

var whatLevel = function (grandType, col, row) {
    var mapResult = this.result[grandType];
    // +1 for box board
    var dis = mapResult.disMap[col + 1][row + 1];
    if (dis == 1 && dis == Number.MIN_VALUE && dis == Number.MAX_VALUE) {
        return 1;
    } else {
        return parseInt(dis) >= 6 ? 6 : parseInt(dis);
    }
};

var Lilith = function (mapData) {
    //init indexMap
    var initMap = function (height, width) {
        var map = [];

        for (var row = 0; row < height; row++) {
            var rowIndex = [];
            map.push(rowIndex);
            for (var col = 0; col < width; col++) {
                map[row][col] = Number.MAX_VALUE;
            }
        }
        return map;
    };


    var addBox = function (map, boxColor) {
        var result = [];
        var firstRow = new Array(map[0].length + 2);
        result.push(_.fill(firstRow, boxColor));
        for (var row = 0; row < map.length; row++) {
            var newRow = [boxColor];
            newRow = newRow.concat(map[row]);
            newRow = newRow.concat(boxColor);
            result.push(newRow);
        }
        var lastRow = new Array(map[0].length + 2);
        result.push(_.fill(lastRow, boxColor));
        return result;
    };

    var foregroundColors = [1, 2, 3, 4, 5, 6];
    var backgroundColor = 0;
    this.result = [];

    for (var colorIndex in foregroundColors) {

        var height = mapData.height;
        var width = mapData.width;
        var map = mapData.map;
        var inPixels = map;

        var numOfFC = 0;
        var foregroundColor = foregroundColors[colorIndex];
        var dis = initMap(height, width);
        this.result[foregroundColor] = {minDis: Number.MAX_VALUE, maxDis: Number.MIN_VALUE};
        for (var row = 0; row < height; row++) {
            for (var col = 0; col < width; col++) {
                if (inPixels[row][col] != foregroundColor) {
                    dis[row][col] = backgroundColor;
                    numOfFC++;
                }
            }
        }
        dis = addBox(dis, backgroundColor);

        //console.log(dis.toString());

        var d1 = 1;
        var d2 = Math.sqrt(d1 * d1 + d1 * d1);
        //console.log(numOfFC);
        var nd, nd_tmp;

// 1 2 3
// 0 i 4
// 7 6 5
// first pass: forward -> L->R, T-B
        width += 2;
        height += 2;
        for (var rows = 1; rows < height - 1; rows++) {
            for (var cols = 1; cols < width - 1; cols++) {

                nd = dis[rows][cols];
                if (nd != 0) { // skip background pixels

                    if ((nd_tmp = d1 + dis[rows][cols - 1]) < nd) {
                        nd = nd_tmp;
                    }

                    if ((nd_tmp = d2 + dis[rows - 1][cols - 1]) < nd) {
                        nd = nd_tmp;
                    }

                    if ((nd_tmp = d1 + dis[rows - 1][cols]) < nd) {
                        nd = nd_tmp;
                    }

                    if ((nd_tmp = d2 + dis[rows - 1][cols + 1]) < nd) {
                        nd = nd_tmp;
                    }

                    dis[rows][cols] = parseInt(nd);
                    if (nd > this.result[foregroundColor].maxDis) {
                        //console.log('nd', nd, rows, cols);
                        this.result[foregroundColor].maxDis = parseInt(nd);
                    }
                    if (nd < this.result[foregroundColor].minDis) {
                        this.result[foregroundColor].minDis = parseInt(nd);
                    }
                }
            }
        }


// second pass: backwards -> R->L, B-T
// exactly same as first pass, just in the reverse direction
        for (var rows = height - 2; rows >= 1; rows--) {
            for (var cols = width - 2; cols >= 1; cols--) {

                nd = dis[rows][cols];
                if (nd != 0) {

                    if ((nd_tmp = d1 + dis[rows][cols + 1]) < nd) {
                        nd = nd_tmp;
                    }

                    if ((nd_tmp = d2 + dis[rows + 1][cols + 1]) < nd) {
                        nd = nd_tmp;
                    }

                    if ((nd_tmp = d1 + dis[rows + 1][cols]) < nd) {
                        nd = nd_tmp;
                    }

                    if ((nd_tmp = d2 + dis[rows + 1][cols - 1]) < nd) {
                        nd = nd_tmp;
                    }
                    dis[rows][cols] = parseInt(nd);
                    if (nd > this.result[foregroundColor].maxDis) {
                        //console.log('nd', nd);
                        this.result[foregroundColor].maxDis = parseInt(nd);
                    }
                    if (nd < this.result[foregroundColor].minDis) {
                        this.result[foregroundColor].minDis = parseInt(nd);
                    }
                }
            }
        }
        this.result[foregroundColor].disMap = dis;

        //setTimeout(function (dis) {
        //    //console.log(dis.toString());
        //    var x = ndarray(_.flatten(dis), [102, 102]);
        //    imshow(x);
        //}, Math.random() * 1000, dis);
    }
};


module.exports = Lilith;

var pro = Lilith.prototype;

pro.generate = function () {
    // todo
    return 1;
};