'use strict';

// REQUIRED: define images we want to use
const IMAGES = {
  flag: 'https://i.imgur.com/M8u25cr.png',
  space: 'https://i.imgur.com/hucO1lV.jpg',
  conquered_space: 'https://i.imgur.com/9JvxNJg.jpg'
};

class emptySpace extends Cell {

  init() {
    this.status = 0;
    this.conquerable = false;
  }

  get info() {
    return 'This is empty space. You must traverse it to find other planets.'
  }

  get image() {
    return 'space'
  }

  update(neighbors) {
    var self = this;

    neighbors.forEach(function(neighbor) {
      if (neighbor.item instanceof myemptySpace) {
        self.conquerable = true
      } else if (neighbor.item instanceof mySystem) {
        self.conquerable = true
      }
    })
  }

  onClick() {
    console.log(this.conquerable)
    if (this.conquerable == true) {
      this.status += 1;
      if (this.status >= 1) {
        STATE.resources.energy = STATE.resources.energy - 5
        var mySpace = new myemptySpace()
        place(mySpace, this.x, this.y)
        showMessage('You have conquered free space. Your troops are free to move.')
      }
    } else {
        showMessage('You must reach this tile before conquering it, GOD-QUEEN.')
    }
  }
}

// REQUIRED: configure the grid
const GRID_ROWS = 50;
const GRID_COLS = 50;
const GRID_CELL_SIZE = 75;
const GRID_EMPTY = [234, 234, 234];
const GRID_TYPE = 'hex';
const GRID_DEFAULT_CELL = emptySpace;
const TEXT_DEFAULT_COLOR = [250,250,250];

// REQUIRED: define how our resources will be represented
const RESOURCES = {
  systems: 'Systems:',
  army: 'Army:',
  supplies: 'Supplies:',
  morale: 'Morale:',
  energy: 'Energy:',
  money: 'Money:'
}

// REQUIRED: define our game state.
// At minimum this must define initial values for your resources.
const STATE = {
  resources: {
    systems: 0,
    army: 150,
    supplies: 30,
    morale: 90,
    energy: 100,
    money: 0,
  }
}

class mySystem extends Item {

  get info() {
    return 'This system is part of your Hegemony, GOD-QUEEN!'
  }

  get image() {
    return 'flag'
  }

  onPlace() {
    STATE.resources.systems++;
  }

  onDestroy() {
    STATE.resources.systems--;
  }
}

class myemptySpace extends Item {
  get info() {
    return 'This is empty space that is under your protection. Your troops may move through it.'
  }

  get image() {
    return 'conquered_space'
  }
}

// Initial setup of the game
function init() {
  var systems = new mySystem();
  place(systems, 24, 24);
  STATE.systems += 1;

  // Setup the Menu for buying stuff
  var menu = new Menu('Intergalactic Bureau of Defense', [
  ]);
}

// The game's main loop.
// We're just using it to set a background color
function main() {
  background((0, 0, 0));
}
