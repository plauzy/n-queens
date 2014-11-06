// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      // console.log(this)
      // debugger
      var row = this.attributes[rowIndex];
      var counter = 0;
      counter = _.reduce(row, function(item, memo) {
        return memo += item;
      }, counter);

      if (counter > 1 ) {
        return true;
      }
      return false; // fixme
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      for (var i = 0; i < this.attributes['n']; i++) {
        if (this.hasRowConflictAt(i) ) {
          return true;
        };
      };
      return false; // fixme
    },


    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      // console.log(this);
      var column = [];
      for (var i = 0; i < this.attributes['n']; i++) {
        column.push(this.attributes[i][colIndex]);
      };
      // console.log(column);
      var counter = 0;
      counter = _.reduce(column, function(item, memo){
        return  memo+= item;
      }, counter);

      if (counter > 1) {
        return true;
      };

      return false; // fixme
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      for (var i = 0; i < this.attributes['n']; i++) {
        if (this.hasColConflictAt(i)){
          return true;
        }   
      };
      return false; // fixme
    },



    // Major Diagonals - go from top-left to bottom-right ... down and to the right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    // [[1,0,0,1],
    //  [0,1,0,0],
    //  [1,0,0,0],
    //  [1,1,0,0]]
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      
      // console.log(majorDiagonalColumnIndexAtFirstRow);
      // 0, 1, 2, 3, 
      // -1, 0, 1, 2, 
      // -2, -1, 0, 1, 
      // -3, -2, -1, 0
      var board = this.attributes
      //startingCol
      // 0 => [0,0]
      // 1 => [0,1]
      // +2 => [0,2]
      // 3 => [0,3]
      //-1 => [1,0]
      //-2 => [2,0]
      //-3 => [3,0]
      var input = majorDiagonalColumnIndexAtFirstRow;
      var startingCol, startingRow;
      // if input is positive num, then set the startingCol to that num
      if (input >= 0){
        startingCol = input;
        startingRow = 0;
      } else {
      // if input is negative num, then set the startingRow to that absolute value (num)
        startingRow = Math.abs(input);
        startingCol = 0;
      }

      // starting point: [0, 0]
      var startingPoint = board[startingRow][startingCol];
      
      // ending point: [3, 3]

      // create empty array
      var diagonal = [];
      // while loop:
      var playable = true;
      var max = this.attributes['n'] - 1;
      while (playable){
        diagonal.push(startingPoint);
        startingCol++;
        startingRow++;
        if (startingCol > max || startingRow > max) {
          playable = false;
        } else {
          startingPoint = board[startingRow][startingCol];
        }
      }


      var counter = 0;
      counter = _.reduce(diagonal, function(item, memo){
        return  memo+= item;
      }, counter);

      if (counter > 1) {
        return true;
      };

      // set the flag is true to begin with
      // while the flag is true
        // push starting point into array
        // starting col & row +1
        // if starting col/row > 3 --> (n - 1)
          // set flag false

      // eventually: array of 4 elements

      //0 => [0,0], [1,1], [2,2], [3,3]
      //1 => [0,1], [0+1,1+1], [1+1,2+1]
      //2 => [0,2], [0+1,2+1]
      //3 => [0,3]
      //-1 => [1,0], [2,1], [3,2]



      return false; // fixme
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
     //find length of board => this.attributes[n] - 1
     var max = this.attributes['n'] - 1;
     //generate values from -max to +max, including 0
     for (var i = -max; i < max; i++) {
       if (this.hasMajorDiagonalConflictAt(i)){
        return true;
       }
     };
     //for each of those values
      // if (hasMajorDiagonalConflictAt(value) == true)
        //then return true

    //return false
      return false; // fixme
    },



    // Minor Diagonals - go from top-right to bottom-left .. down and to the left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      // 0, 1, 2, 3, 
      // -1, 0, 1, 2, 
      // -2, -1, 0, 1, 
      // -3, -2, -1, 0

      // 0 1 2 3
      // 1 2 3 4
      // 2 3 4 5
      // 3 4 5 6

      // 0 1 2 
      // 1 2 3 
      // 2 3 4 

      // 0 => [0,0]
      // 1 => [0,1], [1,0]
      // 2 => [0,2], [1,1], [2,0]


      // 0 => [0,0]
      // 1 => [0,1], [1,0]
      // 2 => [0,2], [1,1], [2,0]
      // 3 => [0,3], [1,2], [2,1], [3,0] --- >>>> [4, -1]
      // 4 => [1,3], [2,2], [3,1]
      // 5 => [2,3], [3,2]
      // 6 => [3,3]

      // max = 4-1 =3
      // index 4 --> input - max = 1
      // index 5 --> input - max = 2
      // index 6 --> input - max = 3


      // index 4 --> 
      // index 5 --> 
      // index 6 --> 

      var index = minorDiagonalColumnIndexAtFirstRow;
      var board = this.attributes;
      var startingRow; 
      var startingCol;
      var max = board['n'] - 1;



      //if (input <= (max/2) ) ... then row will be 0, column will be input
      //else ... row will be (input - max/2 ) and column is max/2
//[0,2]
      if (index <= max ) {
        startingRow = 0;
        startingCol = index;
      } else {
        startingRow = index - max;
        startingCol = max;
      }
      console.log("");
      console.log(index);
      console.log(startingRow, startingCol);
      var startingPoint = board[startingRow][startingCol];

      var diagonal = [];
      var playable = true;
      while (playable) {
        diagonal.push(startingPoint);
        startingRow++;
        startingCol--;
        if (startingRow > max  || startingCol < 0) {
          playable = false;
        } else {
          startingPoint = board[startingRow][startingCol];
        }
      }

      var counter = 0;
      counter = _.reduce(diagonal, function(item, memo){
        return  memo+= item;
      }, counter);

      if (counter > 1) {
        return true;
      };






      return false; // fixme
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
     var max = this.attributes['n'] - 1;
     //generate values from -max to +max, including 0
     for (var i = 0; i < max * 2; i++) {
       if (this.hasMinorDiagonalConflictAt(i)){
        return true;
       }
     };
      return false; // fixme
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
