'use strict';

// REQUIRED: define images we want to use
const IMAGES = {
  symbol: 'https://i.imgur.com/8H0bKkv.png',
  space: 'https://i.imgur.com/hucO1lV.jpg',
  conquered_space: 'https://i.imgur.com/9JvxNJg.jpg',
  tier_0: 'https://i.imgur.com/plKeH7v.png',
  conquered_tier_0: 'https://i.imgur.com/4E87Q2W.png'
  tier_1: 'https://i.imgur.com/yXwcjIY.png',
  conquered_tier_1: ''
  tier_2:
  conquered_tier_2:
  tier_3:
  conquered_tier_3:
  tier_4:
  conquered_tier_4:
};

class emptySpace extends Cell {

  init() {
    this.status = 0;
    this.conquerable = false;
  }

  get info() {
    return 'This is empty space. You must traverse it to find other systems.'
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
      } else if (neighbor.item instanceof mytier_0) {
      	self.conquerable = true
      }
    })
  }

  onClick() {
    console.log(this.conquerable)
    if (STATE.resources.energy >=5) {
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
		    showMessage('You must reach this position before conquering it, GOD-QUEEN.')
			}
    } else {
    	showMessage('You do not have the energy to move your ships to this position, GOD-QUEEN.')
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
    money: 100,
  },
  event: 0,
  trigger: 1,
  active: false,
  victory: null 
}

function battle(d1,mod1,mod2) {
	var opposedroll = Math.floor(Math.random() * (d1/10)) + 1
	var yourroll = Math.floor(Math.random() * (STATE.resources.army/20)) + 1
	console.log(opposedroll)
	console.log(yourroll)
	if (opposedroll + (mod1/10) + (mod2/10) >= yourroll + (STATE.resources.supplies/10) + (STATE.resources.morale/10)) {
		STATE.victory = false
		var loss = yourroll/4
		return loss
	} else if (opposedroll + (mod1/10) + (mod2/10) < yourroll + (STATE.resources.supplies/10) + (STATE.resources.morale/10)) {
		STATE.victory = true
		var gain = opposedroll/4
		return gain
	}
}

class mySystem extends Item {

  get info() {
    return 'This system is part of your Hegemony, GOD-QUEEN!'
  }

  get image() {
    return 'symbol'
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

class mytier_0 extends Item {
	get info() {
		return 'This is system is under your protection, GOD-QUEEN.'
	}

	get image() {
		return 'conquered_tier_0'
	}
}

class tier_0 extends Item {

	init() {
    this.army = 0;
    this.supplies = 0;
    this.morale = 0;
    this.conquerable = false;
  }

	get info() {
		return 'This is an unprotected system.'
	}

	get image() {
		return 'tier_0'
	}

  update(neighbors) {
    var self = this;

    neighbors.forEach(function(neighbor) {
      if (neighbor.item instanceof myemptySpace) {
        self.conquerable = true
      } else if (neighbor.item instanceof mySystem) {
        self.conquerable = true
      } else if (neighbor.item instanceof mytier_0) {
      	self.conquerable = true
      }
    })
  }

	onClick() {
		if (STATE.resources.energy >= 5 * (STATE.resources.army/20)) {
			if (this.conquerable == true) {
				var army_mod = battle(this.army,this.supplies,this.morale)
				if (STATE.victory == true) {
					STATE.resources.energy = STATE.resources.energy - (5 * (STATE.resources.army/20))
					STATE.resources.army = STATE.resources.army + (army_mod * 20)
					STATE.trigger += 1
					STATE.resources.systems += 1
					console.log(STATE.trigger)
					var my0 = new mytier_0()
					place(my0, this.x, this.y)
					showMessage('You have conquered this system. Glory be to the GOD-QUEEN!')
				} else if (STATE.victory == false) {
					STATE.resources.energy = STATE.resources.energy - (5 * (STATE.resources.army/20))
					STATE.resources.army = STATE.resources.army - (army_mod * 20)
					STATE.trigger += 1
					console.log(STATE.trigger)
					showMessage('Your army has failed to conqquer this system. They will be taught a lesson, GOD-QUEEN.')
				}
			} else {
				showMessage('You must reach this system before conquering it.')
			}
		} else {
    	showMessage('You do not have the energy to move your ships to conquer this system, GOD-QUEEN.')
    }
	}
}




class mytier_1 extends Item {
	get info() {
		return 'This is system is under your protection, GOD-QUEEN.'
	}

	get image() {
		return 'conquered_tier_1'
	}
}

class tier_1 extends Item {

	init() {
    this.army = 50;
    this.supplies = 30;
    this.morale = 50;
    this.conquerable = false;
  }

	get info() {
		return 'This is an unprotected system.'
	}

	get image() {
		return 'tier_1'
	}

  update(neighbors) {
    var self = this;

    neighbors.forEach(function(neighbor) {
      if (neighbor.item instanceof myemptySpace) {
        self.conquerable = true
      } else if (neighbor.item instanceof mySystem) {
        self.conquerable = true
      } else if (neighbor.item instanceof mytier_1) {
      	self.conquerable = true
      }
    })
  }

	onClick() {
		if (STATE.resources.energy >= 5 * (STATE.resources.army/20)) {
			if (this.conquerable == true) {
				var army_mod = battle(this.army,this.supplies,this.morale)
				if (STATE.victory == true) {
					STATE.resources.energy = STATE.resources.energy - (5 * (STATE.resources.army/20))
					STATE.resources.army = STATE.resources.army + (army_mod * 20)
					STATE.trigger += 1
					STATE.resources.systems += 1
					console.log(STATE.trigger)
					var my1 = new mytier_1()
					place(my1, this.x, this.y)
					showMessage('You have conquered this system. Glory be to the GOD-QUEEN!')
				} else if (STATE.victory == false) {
					STATE.resources.energy = STATE.resources.energy - (5 * (STATE.resources.army/20))
					STATE.resources.army = STATE.resources.army - (army_mod * 20)
					STATE.trigger += 1
					console.log(STATE.trigger)
					showMessage('Your army has failed to conqquer this system. They will be taught a lesson, GOD-QUEEN.')
				}
			} else {
				showMessage('You must reach this system before conquering it.')
			}
		} else {
    	showMessage('You do not have the energy to move your ships to conquer this system, GOD-QUEEN.')
    }
	}
}




class mytier_2 extends Item {
	get info() {
		return 'This is system is under your protection, GOD-QUEEN.'
	}

	get image() {
		return 'conquered_tier_2'
	}
}

class tier_2 extends Item {

	init() {
    this.army = 100;
    this.supplies = 50;
    this.morale = 60;
    this.conquerable = false;
  }

	get info() {
		return 'This is an unprotected system.'
	}

	get image() {
		return 'tier_2'
	}

  update(neighbors) {
    var self = this;

    neighbors.forEach(function(neighbor) {
      if (neighbor.item instanceof myemptySpace) {
        self.conquerable = true
      } else if (neighbor.item instanceof mySystem) {
        self.conquerable = true
      } else if (neighbor.item instanceof mytier_1) {
      	self.conquerable = true
      }
    })
  }

	onClick() {
		if (STATE.resources.energy >= 5 * (STATE.resources.army/20)) {
			if (this.conquerable == true) {
				var army_mod = battle(this.army,this.supplies,this.morale)
				if (STATE.victory == true) {
					STATE.resources.energy = STATE.resources.energy - (5 * (STATE.resources.army/20))
					STATE.resources.army = STATE.resources.army + (army_mod * 20)
					STATE.trigger += 1
					STATE.resources.systems += 1
					console.log(STATE.trigger)
					var my2 = new mytier_2()
					place(my2, this.x, this.y)
					showMessage('You have conquered this system. Glory be to the GOD-QUEEN!')
				} else if (STATE.victory == false) {
					STATE.resources.energy = STATE.resources.energy - (5 * (STATE.resources.army/20))
					STATE.resources.army = STATE.resources.army - (army_mod * 20)
					STATE.trigger += 1
					console.log(STATE.trigger)
					showMessage('Your army has failed to conqquer this system. They will be taught a lesson, GOD-QUEEN.')
				}
			} else {
				showMessage('You must reach this system before conquering it.')
			}
		} else {
    	showMessage('You do not have the energy to move your ships to conquer this system, GOD-QUEEN.')
    }
	}
}



class mytier_3 extends Item {
	get info() {
		return 'This is system is under your protection, GOD-QUEEN.'
	}

	get image() {
		return 'conquered_tier_3'
	}
}

class tier_3 extends Item {

	init() {
    this.army = 150;
    this.supplies = 70;
    this.morale = 70;
    this.conquerable = false;
  }

	get info() {
		return 'This is an unprotected system.'
	}

	get image() {
		return 'tier_3'
	}

  update(neighbors) {
    var self = this;

    neighbors.forEach(function(neighbor) {
      if (neighbor.item instanceof myemptySpace) {
        self.conquerable = true
      } else if (neighbor.item instanceof mySystem) {
        self.conquerable = true
      } else if (neighbor.item instanceof mytier_1) {
      	self.conquerable = true
      }
    })
  }

	onClick() {
		if (STATE.resources.energy >= 5 * (STATE.resources.army/20)) {
			if (this.conquerable == true) {
				var army_mod = battle(this.army,this.supplies,this.morale)
				if (STATE.victory == true) {
					STATE.resources.energy = STATE.resources.energy - (5 * (STATE.resources.army/20))
					STATE.resources.army = STATE.resources.army + (army_mod * 20)
					STATE.trigger += 1
					STATE.resources.systems += 1
					console.log(STATE.trigger)
					var my3 = new mytier_3()
					place(my3, this.x, this.y)
					showMessage('You have conquered this system. Glory be to the GOD-QUEEN!')
				} else if (STATE.victory == false) {
					STATE.resources.energy = STATE.resources.energy - (5 * (STATE.resources.army/20))
					STATE.resources.army = STATE.resources.army - (army_mod * 20)
					STATE.trigger += 1
					console.log(STATE.trigger)
					showMessage('Your army has failed to conqquer this system. They will be taught a lesson, GOD-QUEEN.')
				}
			} else {
				showMessage('You must reach this system before conquering it.')
			}
		} else {
    	showMessage('You do not have the energy to move your ships to conquer this system, GOD-QUEEN.')
    }
	}
}




class mytier_4 extends Item {
	get info() {
		return 'This is system is under your protection, GOD-QUEEN.'
	}

	get image() {
		return 'conquered_tier_4'
	}
}

class tier_4 extends Item {

	init() {
    this.army = 200;
    this.supplies = 90;
    this.morale = 80;
    this.conquerable = false;
  }

	get info() {
		return 'This is an unprotected system.'
	}

	get image() {
		return 'tier_4'
	}

  update(neighbors) {
    var self = this;

    neighbors.forEach(function(neighbor) {
      if (neighbor.item instanceof myemptySpace) {
        self.conquerable = true
      } else if (neighbor.item instanceof mySystem) {
        self.conquerable = true
      } else if (neighbor.item instanceof mytier_1) {
      	self.conquerable = true
      }
    })
  }

	onClick() {
		if (STATE.resources.energy >= 5 * (STATE.resources.army/20)) {
			if (this.conquerable == true) {
				var army_mod = battle(this.army,this.supplies,this.morale)
				if (STATE.victory == true) {
					STATE.resources.energy = STATE.resources.energy - (5 * (STATE.resources.army/20))
					STATE.resources.army = STATE.resources.army + (army_mod * 20)
					STATE.trigger += 1
					STATE.resources.systems += 1
					console.log(STATE.trigger)
					var my4 = new mytier_4()
					place(my4, this.x, this.y)
					showMessage('You have conquered this system. Glory be to the GOD-QUEEN!')
				} else if (STATE.victory == false) {
					STATE.resources.energy = STATE.resources.energy - (5 * (STATE.resources.army/20))
					STATE.resources.army = STATE.resources.army - (army_mod * 20)
					STATE.trigger += 1
					console.log(STATE.trigger)
					showMessage('Your army has failed to conqquer this system. They will be taught a lesson, GOD-QUEEN.')
				}
			} else {
				showMessage('You must reach this system before conquering it.')
			}
		} else {
    	showMessage('You do not have the energy to move your ships to conquer this system, GOD-QUEEN.')
    }
	}
}

// Initial setup of the game
function init() {
  var system = new mySystem();
  place(system, 24, 24);
  STATE.resources.systems += 1;

  var tier0 = new tier_0();
  place(tier0, 20, 21);

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
