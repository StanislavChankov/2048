function GameMachineLearning(StorageManager, gridSize) {
  // this.storageManager = new StorageManager;
 // BiggestNumberX	BiggestNumberY	SecondBiggestNumberX	SecondBiggestNumberY	TilesCount	FreePlacesCount	BiggestNumber	HasBottomMerger	HasLeftMerger	HasRightMerger	MoveToSide
  // this.inputManager.on("move", this.move.bind(this));
  this.size = gridSize;
  this.tilesCount = 0;
}

GameMachineLearning.prototype.extractFeatures = function (grid, direction) {
  var biggestNumber = this.getBiggestTile(grid);
  var secondBiggestNumber = this.getSecondBiggestTile(grid, biggestNumber);
  var FreePlacesCount = 16 - this.tilesCount;
  var mergers = this.getMergers(grid);
  debugger;
  console.log(mergers);
  // console.log(biggestNumber.value + '|' + secondBiggestNumber.value);
};

GameMachineLearning.prototype.getBiggestTile = function (grid) {
  var biggestTile = undefined;
  this.tilesCount = 0;
  var self = this; 

  grid.cells.forEach(function (row) {
      row.forEach(function (cell) {
        if (cell) {
          self.tilesCount++;
          if (!biggestTile) {
            biggestTile = cell;
          } else if (biggestTile.value < cell.value) {
            biggestTile = cell;
          }
        }
      });
  });

  this.tilesCount = self.tilesCount;

  return biggestTile;
};

GameMachineLearning.prototype.getSecondBiggestTile = function (grid, biggestTile) {
  var secondBiggestTile = undefined;

  grid.cells.forEach(function (row) {
      row.forEach(function (cell) {
        if (cell) {
          if (cell.x !== biggestTile.x || cell.y !== biggestTile.y) {
            if (!secondBiggestTile) {
              secondBiggestTile = cell;
            } else if (secondBiggestTile.value < cell.value) {
              secondBiggestTile = cell;
            }
          }
        }
      });
  });

  return secondBiggestTile;
};

GameMachineLearning.prototype.getMergers = function (grid) {
  for (var x = 0; x < grid.cells.length; x++) {
    for (var y = 0; y < grid.cells.length; y++) {
      var mergers = { 
        hasTopMerger:    false,
        hasRightMerger:  false,
        hasBottomMerger: false,
        hasLeftMerger:   false 
      };
      
      var cell = grid.cells[x][y];
      if (cell) {
        var top = this.getClosestCellOrNull(cell.x, cell.y, grid, this.sideMoveOptions.topSide);// grid.cells[cell.x][cell.y - 1];
        var right = this.getClosestCellOrNull(cell.x, cell.y, grid, this.sideMoveOptions.rightSide);// grid.cells[cell.x + 1][cell.y];
        var bottom = this.getClosestCellOrNull(cell.x, cell.y, grid, this.sideMoveOptions.bottomSide);// grid.cells[cell.x][cell.y + 1];
        var left = this.getClosestCellOrNull(cell.x, cell.y, grid, this.sideMoveOptions.leftSide);// grid.cells[cell.x - 1][cell.y];

        mergers.hasTopMerger = (top && top.value === cell.value) || mergers.hasTopMerger;
        mergers.hasRightMerger = (right && right.value === cell.value) || mergers.hasRightMerger;
        mergers.hasBottomMerger = (bottom && bottom.value === cell.value) || mergers.hasBottomMerger;
        mergers.hasLeftMerger = (left && left.value === cell.value) || mergers.hasLeftMerger;
      }
    }
  }

  return mergers;
};

GameMachineLearning.prototype.getClosestCellOrNull = function (x, y, grid, sideMoveOption) {
  if (this.isAbscissaOrOrdinateBoundsGrid(x) || this.isAbscissaOrOrdinateBoundsGrid(y)) {
    confirm("BUG IN game_manager.js :92!");
  }

//TODO: FIX - working only for neighbour cells.
// Should be working for the whole grid,
// but cells can merge only if there is no other cell with different number between them.
// switch (sideMoveOption) {
//   case this.sideMoveOptions.topSide:
//       if (this.isAbscissaOrOrdinateBoundsGrid(y - 1)) {
//         return null;
//       }

//       return grid.cells[x][y - 1];
//     break;
//   case this.sideMoveOptions.rightSide:
//       if (this.isAbscissaOrOrdinateBoundsGrid(x + 1)) {
//         return null;
//       }

//       return grid.cells[x + 1][y];   
//     break;
//   case this.sideMoveOptions.bottomSide:
//         if (this.isAbscissaOrOrdinateBoundsGrid(y + 1)) {
//           return null;
//         }
      
//       return grid.cells[x][y + 1];
//     break;
//   case this.sideMoveOptions.leftSide:
//         if (this.isAbscissaOrOrdinateBoundsGrid(x - 1)) {
//           return null;
//         }

//       return grid.cells[x - 1][y];
//     break;
//   default:
//       return null;
//     break;
// }

  switch (sideMoveOption) {
    case this.sideMoveOptions.topSide:
    case this.sideMoveOptions.bottomSide:
        // finding top cell.
        for (let i = 1; i < this.size; i++) {
          // if find top bounding cell then break the array, since we cannot find cell further top.
          if (this.isAbscissaOrOrdinateBoundsGrid(y - i)) {
            i = this.size;

            continue;
          }

          if (grid.cells[x][y - i]) {
            return grid.cells[x][y - i];
          }
        }

        // finding bottom cell.
        for (let z = 0; z < this.size; z++) {
          // if find bottom bounding cell then break the array, since we cannot find cell further bottom.
          if (this.isAbscissaOrOrdinateBoundsGrid(y + z)) {
            z = this.size;

            continue;
          }

          if (grid.cells[x][y + z]) {
            return grid.cells[x][y + z];
          }
        }

        // topSide grid.cells[x][y - 1];
        // bottomSide grid.cells[x][y + 1];

        return null;
      break;
    case this.sideMoveOptions.rightSide:
    case this.sideMoveOptions.leftSide:
        // finding right cell.
        for (let i = 1; i < this.size; i++) {
          // if find right bounding cell then break the array, since we cannot find cell further right.
          if (this.isAbscissaOrOrdinateBoundsGrid(x + i)) {
            i = this.size;

            continue;
          }

          if (grid.cells[x + i][y]) {
            return grid.cells[x + i][y];
          }
        }

        // finding left cell.
        for (let z = 1; z < this.size; z++) {
          // if find left bounding cell then break the array, since we cannot find cell further left.
          if (this.isAbscissaOrOrdinateBoundsGrid(x - z)) {
            z = this.size;

            continue;
          }

          if (grid.cells[x - z][y]) {
            return grid.cells[x - z][y];
          }
        }

        // rightSide grid.cells[x + 1][y];
        // leftSide grid.cells[x - 1][y];

        return null;   
      break;
    default:
        return null;
      break;
  }

  return null;
};

GameMachineLearning.prototype.isAbscissaOrOrdinateBoundsGrid = function (abscissaOrOrdinate) {
  return abscissaOrOrdinate >= this.size || abscissaOrOrdinate < 0;
};

GameMachineLearning.prototype.getTilesCount = function (grid) {
  var tilesCount = 0;
  grid.forEach(row => {

  });
};

GameMachineLearning.prototype.sideMoveOptions = { 
  'topSide': 'top',
  'rightSide':'right',
  'bottomSide': 'bottom',
  'leftSide': 'left' };

function GameManager(size, InputManager, Actuator, StorageManager) {
  this.size             = size; // Size of the grid
  this.inputManager     = new InputManager;
  this.storageManager   = new StorageManager;
  this.actuator         = new Actuator;
  this.machineLearning  = new GameMachineLearning(this.storageManager, size);

  this.startTiles     = 2;

  this.inputManager.on("move", this.move.bind(this));
  this.inputManager.on("restart", this.restart.bind(this));
  this.inputManager.on("keepPlaying", this.keepPlaying.bind(this));

  this.setup();
}

// Restart the game
GameManager.prototype.restart = function () {
  this.storageManager.clearGameState();
  this.actuator.continueGame(); // Clear the game won/lost message
  this.setup();
};

// Keep playing after winning (allows going over 2048)
GameManager.prototype.keepPlaying = function () {
  this.keepPlaying = true;
  this.actuator.continueGame(); // Clear the game won/lost message
};

// Return true if the game is lost, or has won and the user hasn't kept playing
GameManager.prototype.isGameTerminated = function () {
  return this.over || (this.won && !this.keepPlaying);
};

// Set up the game
GameManager.prototype.setup = function () {
  var previousState = this.storageManager.getGameState();

  // Reload the game from a previous game if present
  if (previousState) {
    this.grid        = new Grid(previousState.grid.size,
                                previousState.grid.cells); // Reload grid
    this.score       = previousState.score;
    this.over        = previousState.over;
    this.won         = previousState.won;
    this.keepPlaying = previousState.keepPlaying;
  } else {
    this.grid        = new Grid(this.size);
    this.score       = 0;
    this.over        = false;
    this.won         = false;
    this.keepPlaying = false;

    // Add the initial tiles
    this.addStartTiles();
  }

  // Update the actuator
  this.actuate();
};

// Set up the initial tiles to start the game with
GameManager.prototype.addStartTiles = function () {
  for (var i = 0; i < this.startTiles; i++) {
    this.addRandomTile();
  }
};

// Adds a tile in a random position
GameManager.prototype.addRandomTile = function () {
  if (this.grid.cellsAvailable()) {
    var value = Math.random() < 0.9 ? 2 : 4;
    var tile = new Tile(this.grid.randomAvailableCell(), value);

    this.grid.insertTile(tile);
  }
};

// Sends the updated grid to the actuator
GameManager.prototype.actuate = function () {
  if (this.storageManager.getBestScore() < this.score) {
    this.storageManager.setBestScore(this.score);
  }

  // Clear the state when the game is over (game over only, not win)
  if (this.over) {
    this.storageManager.clearGameState();
  } else {
    this.storageManager.setGameState(this.serialize());
  }

  this.actuator.actuate(this.grid, {
    score:      this.score,
    over:       this.over,
    won:        this.won,
    bestScore:  this.storageManager.getBestScore(),
    terminated: this.isGameTerminated()
  });

};

// Represent the current game as an object
GameManager.prototype.serialize = function () {
  return {
    grid:        this.grid.serialize(),
    score:       this.score,
    over:        this.over,
    won:         this.won,
    keepPlaying: this.keepPlaying
  };
};

// Save all tile positions and remove merger info
GameManager.prototype.prepareTiles = function () {
  this.grid.eachCell(function (x, y, tile) {
    if (tile) {
      tile.mergedFrom = null;
      tile.savePosition();
    }
  });
};

// Move a tile and its representation
GameManager.prototype.moveTile = function (tile, cell) {
  this.grid.cells[tile.x][tile.y] = null;
  this.grid.cells[cell.x][cell.y] = tile;
  tile.updatePosition(cell);
};

// Move tiles on the grid in the specified direction
GameManager.prototype.move = function (direction) {
  // 0: up, 1: right, 2: down, 3: left
  var self = this;

  if (this.isGameTerminated()) return; // Don't do anything if the game's over

  var cell, tile;

  var vector     = this.getVector(direction);
  var traversals = this.buildTraversals(vector);
  var moved      = false;
  
  // Save the current tile positions and remove merger information
  this.prepareTiles();

  // Extracts the features from the current position.
  this.machineLearning.extractFeatures(self.grid, direction);

  // Traverse the grid in the right direction and move tiles
  traversals.x.forEach(function (x) {
    traversals.y.forEach(function (y) {
      cell = { x: x, y: y };
      tile = self.grid.cellContent(cell);

      if (tile) {
        var positions = self.findFarthestPosition(cell, vector);
        var next      = self.grid.cellContent(positions.next);

        // Only one merger per row traversal?
        if (next && next.value === tile.value && !next.mergedFrom) {
          var merged = new Tile(positions.next, tile.value * 2);
          merged.mergedFrom = [tile, next];

          self.grid.insertTile(merged);
          self.grid.removeTile(tile);

          // Converge the two tiles' positions
          tile.updatePosition(positions.next);

          // Update the score
          self.score += merged.value;

          // The mighty 2048 tile
          if (merged.value === 2048) self.won = true;
        } else {
          self.moveTile(tile, positions.farthest);
        }

        if (!self.positionsEqual(cell, tile)) {
          moved = true; // The tile moved from its original cell!
        }
      }
    });
  });

  if (moved) {
    this.addRandomTile();

    if (!this.movesAvailable()) {
      this.over = true; // Game over!
    }

    this.actuate();
  }
};

// Get the vector representing the chosen direction
GameManager.prototype.getVector = function (direction) {
  // Vectors representing tile movement
  var map = {
    0: { x: 0,  y: -1 }, // Up
    1: { x: 1,  y: 0 },  // Right
    2: { x: 0,  y: 1 },  // Down
    3: { x: -1, y: 0 }   // Left
  };

  return map[direction];
};

// Build a list of positions to traverse in the right order
GameManager.prototype.buildTraversals = function (vector) {
  var traversals = { x: [], y: [] };

  for (var pos = 0; pos < this.size; pos++) {
    traversals.x.push(pos);
    traversals.y.push(pos);
  }

  // Always traverse from the farthest cell in the chosen direction
  if (vector.x === 1) traversals.x = traversals.x.reverse();
  if (vector.y === 1) traversals.y = traversals.y.reverse();

  return traversals;
};

GameManager.prototype.findFarthestPosition = function (cell, vector) {
  var previous;

  // Progress towards the vector direction until an obstacle is found
  do {
    previous = cell;
    cell     = { x: previous.x + vector.x, y: previous.y + vector.y };
  } while (this.grid.withinBounds(cell) &&
           this.grid.cellAvailable(cell));

  return {
    farthest: previous,
    next: cell // Used to check if a merge is required
  };
};

GameManager.prototype.movesAvailable = function () {
  return this.grid.cellsAvailable() || this.tileMatchesAvailable();
};

// Check for available matches between tiles (more expensive check)
GameManager.prototype.tileMatchesAvailable = function () {
  var self = this;

  var tile;

  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {
      tile = this.grid.cellContent({ x: x, y: y });

      if (tile) {
        for (var direction = 0; direction < 4; direction++) {
          var vector = self.getVector(direction);
          var cell   = { x: x + vector.x, y: y + vector.y };

          var other  = self.grid.cellContent(cell);

          if (other && other.value === tile.value) {
            return true; // These two tiles can be merged
          }
        }
      }
    }
  }

  return false;
};

GameManager.prototype.positionsEqual = function (first, second) {
  return first.x === second.x && first.y === second.y;
};
