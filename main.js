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
        STATE.trigger += 1
        console.log(STATE.trigger)
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
  },
  event: 0,
  trigger: 1,
  active: false
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

  if (STATE.trigger % 11 == 0) {
  	STATE.active = true
  }

  if (STATE.active == true) {
    console.log('triggered')
    var event = Math.floor(Math.random() * 20) + 1
    STATE.event = event
    console.log(STATE.event)
    if (STATE.event >= 20) {
      let ev1 = new Event('ARMY UPDATE', 'National pride is up! Your glory has rallied your people, GOD-QUEEN!');
      STATE.trigger = 1
      STATE.active = false
      STATE.resources.army = STATE.resources.army + 50;
    } else if (STATE.event >= 19) {
      let ev2 = new Event('ARMY UPDATE', 'Positive PsyOps Succesful!');
      STATE.trigger = 1
      STATE.active = false
      STATE.resources.army = STATE.resources.army + 100;
    } else if (STATE.event >= 18) {
      let ev3 = new Event('ARMY UPDATE', 'Ship lost in space.');
      STATE.trigger = 1
      STATE.active = false
      STATE.resources.army = STATE.resources.army - 50;
    } else if (STATE.event >= 17) {
      let ev4 = new Event('ARMY UPDATE', 'Unsuccessful rebellion.');
      STATE.trigger = 1
      STATE.active = false
      STATE.resources.army = STATE.resources.army - 100;
    } else if (STATE.event >= 16) {
      let ev5 = new Event('MONEY UPDATE', 'Stock market is booming!');
      STATE.trigger = 1
      STATE.active = false
      STATE.resources.money = STATE.resources.money + 50;
    } else if (STATE.event >= 15) {
      let ev6 = new Event('MONEY UPDATE', 'Inflation');
      STATE.trigger = 1
      STATE.active = false
      STATE.resources.money = STATE.resources.money + 100;
    } else if (STATE.event >= 14) {
      let ev7 = new Event('MONEY UPDATE', 'Government lost track of funds');
      STATE.trigger = 1
      STATE.active = false
      STATE.resources.money = STATE.resources.money - 50;
    } else if (STATE.event >= 13) {
      let ev8 = new Event('MONEY UPDATE', 'Embezzlement');
      STATE.trigger = 1
      STATE.active = false
      STATE.resources.money = STATE.resources.money - 100;
    } else if (STATE.event >= 12) {
      let ev9 = new Event('ENERGY UPDATE', 'Technological breakthrough');
      STATE.trigger = 1
      STATE.active = false
      STATE.resources.energy = STATE.resources.energy + 20;
    } else if (STATE.event >= 11) {
      let ev10 = new Event('ENERGY UPDATE', 'New energy source discovered');
      STATE.trigger = 1
      STATE.active = false
      STATE.resources.energy = STATE.resources.energy + 40;
    } else if (STATE.event >= 10) {
      let ev11 = new Event('ENERGY UPDATE', 'Attack on a fuel ship');
      STATE.trigger = 1
      STATE.active = false
      STATE.resources.energy = STATE.resources.energy - 20;
    } else if (STATE.event >= 9) {
      let ev12 = new Event('ENERGY UPDATE', 'Space Eco-Terrorists attack energy supply');
      STATE.trigger = 1
      STATE.active = false
      STATE.resources.energy = STATE.resources.energy - 40;
    } else if (STATE.event >= 8) {
      let ev13 = new Event('SUPPLY UPDATE', 'New supply harvesting tools');
      STATE.trigger = 1
      STATE.active = false
      STATE.resources.supplies = STATE.resources.supplies + 10;
    } else if (STATE.event >= 7) {
      let ev14 = new Event('SUPPLY UPDATE', 'New agricultural system implemented');
      STATE.trigger = 1
      STATE.active = false
      STATE.resources.supplies = STATE.resources.supplies + 20;
    } else if (STATE.event >= 6) {
      let ev15 = new Event('SUPPLY UPDATE', 'A drought has struck');
      STATE.trigger = 1
      STATE.active = false
      STATE.resources.supplies = STATE.resources.supplies - 10;
    } else if (STATE.event >= 5) {
      let ev16 = new Event('SUPPLY UPDATE', 'Inedible invasive species kills crops');
      STATE.trigger = 1
      STATE.active = false
      STATE.resources.supplies = STATE.resources.supplies - 20;
    } else if (STATE.event >= 4) {
      let ev17 = new Event('MORALE UPDATE', 'An Intergalactic celebrity endorses you');
      STATE.trigger = 1
      STATE.active = false
      STATE.resources.morale = STATE.resources.morale + 10;
    } else if (STATE.event >= 3) {
      let ev18 = new Event('MORALE UPDATE', 'You have survived an assassination attempt, GOD-QUEEN!');
      STATE.trigger = 1
      STATE.active = false
      STATE.resources.morale = STATE.resources.morale + 20;
    } else if (STATE.event >= 2) {
      let ev19 = new Event('MORALE UPDATE', 'Your dog has died, GOD-QUEEN. May they forever be remembered.');
      STATE.trigger = 1
      STATE.active = false
      STATE.resources.morale = STATE.resources.morale - 10;
    } else if (STATE.event >= 1) {
      let ev20 = new Event('MORALE UPDATE', 'Famous TV show has ended');
      STATE.trigger = 1
      STATE.active = false
      STATE.resources.morale = STATE.resources.morale - 20;
    }
  }
}
