var _ = require('lodash');

exports.play = function play(bombsList, x, y) {
    let counter = 0;
    function isBomb(x, y) {
        return _.find(bombsList, {x, y});
    }

    if (isBomb(x, y)) return { success: false };

    if (isBomb(x+1, y+1)) counter++;
    if (isBomb(x+1, y)) counter++;
    if (isBomb(x+1, y-1)) counter++;

    if (isBomb(x, y+1)) counter++;
    if (isBomb(x, y-1)) counter++;

    if (isBomb(x-1, y+1)) counter++;
    if (isBomb(x-1, y)) counter++;
    if (isBomb(x-1, y-1)) counter++;

    return { success: true, bombs: counter };
};
