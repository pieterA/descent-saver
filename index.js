var express = require('express');
var _ = require('lodash');
var router = express.Router();

var action = require('play');

var database = {
  boards: [],
  games: []
};

/* GET home page. */
router.get('/', function(req, res, next) {
	res.json({
		boards: database.boards,
		games: database.games
	});
});

router.post('/create', function (req, res, next) {
  const width = req.body.dimensions.width;
  const heigth = req.body.dimensions.heigth;
  const bombs = req.body.bombs;

  if (width < 1) { res.status(400).json({ error: 'wrong width' }); return; }
  if (heigth < 1) { res.status(400).json({ error: 'wrong heigth' }); return; }
  if (bombs < 1) { res.status(400).json({ error: 'wrong bombs' }); return; }
  if (bombs > (width * heigth)/3) { res.status(400).json({ error: 'to much bombs' }); return; }

  const bombsGrid = [];
  for(let i = 0; i < bombs; i++) {
    let generatedBomb = getRandomBomb(width, heigth);
    while(_.some(bombsGrid, (bomb) => bomb.x === generatedBomb.x && bomb.y === generatedBomb.y)){
      generatedBomb = getRandomBomb(width, heigth);
    }
    bombsGrid.push(generatedBomb);
  }

  const boardId = database.boards.length + 1;
  database.boards.push({
    id: boardId,
    width, heigth, bombsGrid
  });

  
  res.json({ id: boardId });
});

router.get('/list', function(req, res, next) {
  const outputGames = [];

  for (let i = 0; i < database.boards.length; i++)
  {
    outputGames.push({
      id: database.boards[i].id, 
      dimensions: { x: database.boards[i].width, y: database.boards[i].heigth },
      bombs: database.boards[i].bombsGrid.length
    });
  }

  res.json(outputGames);
});

router.post('/start', function(req, res, next) {
  const boardId = req.body.boardId;
  const board = _.find(database.boards, {id: boardId});

  if (board == undefined ){
    res.status(400).json({ error: 'board not found' });
    return;
  }
  
  let newGame = { id: createUUID(), board, tries: 0, isFinished: false };
  database.games.push(newGame);

  res.json({ id: newGame.id });
});

router.post('/play', function(req, res, next) {
  const gameId = req.body.gameId;
  const x = req.body.x;
  const y = req.body.y;
  const game = _.find(database.games, {id: gameId});

  if (game == undefined ) { res.status(400).json({ error: 'game not found' }); return; }
  if (x <= 0 || game.board.width <= x ) { res.status(400).json({ error: 'x position not on board' }); return; }
  if (y <= 0 || game.board.heigth <= y ) { res.status(400).json({ error: 'y position not on board' }); return; }
  if (game.isFinished) { res.status(400).json({ error: 'game allready finished' }); return; }
  
  const result = actions.play(game.board.bombsGrid, x, y);

  game.tries++;

  // if it is a bomb:
  if (!result.success)
  {
    game.isFinished = true;
  }

  res.json(result);
});

module.exports = router;


function getRandomBomb(maxX, maxY) {
  return {
    x:  Math.floor(Math.random() * Math.floor(maxX)) + 1,
    y:  Math.floor(Math.random() * Math.floor(maxY)) + 1
  };
}

function createUUID() {
    // http://www.ietf.org/rfc/rfc4122.txt
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}
