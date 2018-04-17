'use strict';

// REQUIRED: define images we want to use
const IMAGES = {
  flag: 'https://i.imgur.com/M8u25cr.png'
};

// REQUIRED: configure the grid
const GRID_ROWS = 50;
const GRID_COLS = 50;
const GRID_CELL_SIZE = 75;
const GRID_EMPTY = [234, 234, 234];
const GRID_TYPE = 'hex';

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
    energy: 500,
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


// Initial setup of the game
function init() {
  // Create a starting wheat plot
  var systems = new mySystem();
  place(systems, 25, 30);
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
