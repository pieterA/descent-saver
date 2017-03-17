// tests/part1/cart-summary-test.js
var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var actions = require('./../play');

describe('Play with empty grid', function() {
    it('play(1, 1) should return 0', function() {
        const bombsList = [];
        expect(actions.play(bombsList, 1, 1)).to.eql({ success: true, bombs: 0 });
    });
});

describe('Play field contains one bomb', function() {
    const bombsList = [{x:2,y:2}];

    it('play(2, 2) should return a bomb', function() {
        expect(actions.play(bombsList, 2, 2)).to.eql({ success: false });
    });
    
    it('play(1, 1) should return a 1', function() {
        expect(actions.play(bombsList, 1, 1)).to.eql({ success: true, bombs: 1 });
    });
    it('play(1, 2) should return a 1', function() {
        expect(actions.play(bombsList, 1, 2)).to.eql({ success: true, bombs: 1 });
    });
    it('play(1, 3) should return a 1', function() {
        expect(actions.play(bombsList, 1, 3)).to.eql({ success: true, bombs: 1 });
    });

    it('play(2, 1) should return a 1', function() {
        expect(actions.play(bombsList, 1, 1)).to.eql({ success: true, bombs: 1 });
    });
    it('play(2, 3) should return a 1', function() {
        expect(actions.play(bombsList, 1, 1)).to.eql({ success: true, bombs: 1 });
    });
    
    it('play(3, 1) should return a 1', function() {
        expect(actions.play(bombsList, 1, 1)).to.eql({ success: true, bombs: 1 });
    });
    it('play(3, 2) should return a 1', function() {
        expect(actions.play(bombsList, 1, 2)).to.eql({ success: true, bombs: 1 });
    });
    it('play(3, 3) should return a 1', function() {
        expect(actions.play(bombsList, 1, 3)).to.eql({ success: true, bombs: 1 });
    });

});