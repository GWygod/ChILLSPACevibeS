'use strict';

// REQUIRED: define images we want to use
const IMAGES = {
  starting_system: 'https://i.imgur.com/57MFhAL.jpg',
  space: 'https://i.imgur.com/pCJVWNK.jpg',
  conquered_space: 'https://i.imgur.com/iRuYobi.jpg',
  tier_0: 'https://i.imgur.com/vPDXcgx.jpg',
  conquered_tier_0: 'https://i.imgur.com/OCa0rTA.jpg',
  tier_1: 'https://i.imgur.com/tYnOiEN.jpg',
  conquered_tier_1: 'https://i.imgur.com/pzAK6of.jpg',
  tier_2: 'https://i.imgur.com/kOdRPsQ.jpg',
  conquered_tier_2: 'https://i.imgur.com/d85MkKW.jpg',
  tier_3: 'https://i.imgur.com/045rm8B.jpg',
  conquered_tier_3: 'https://i.imgur.com/j6ZtYr7.jpg',
  tier_4: 'https://i.imgur.com/hbim1EP.jpg',
  conquered_tier_4: 'https://i.imgur.com/6FyfqR0.jpg'
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
const BACKGROUND_COLOR = [0,0,0]

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
    energy: 200,
    money: 100,
  },
  event: 0,
  trigger: 1,
  active: false,
  victory: null,
  Agri_system: 0,
  Ext_system: 0,
  Tax_system: 0,
  energy_production: 1
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
    return 'starting_system'
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

	init() {
		this.acquisition = false
	}

	get info() {
		return 'This is system is under your protection, GOD-QUEEN. You may use it as you wish. (Click on it)'
	}

	get image() {
		return 'conquered_tier_0'
	}

	onClick() {
		if (this.acquisition == false) {
			let cev = new Event('RESOURCE ACQUISITION', 'It is time for you to decide what to do with this system, GOD-QUEEN.', [
				new Action('Agricultural Terraforming *increases supplies*', {energy: 10},() => {
					STATE.Agri_system += 1
					this.acquisition = true
				}),
				new Action('Fuel Extraction *increases energy*', {energy: 10},() => {
					STATE.Ext_system += 1
					this.acquisition = true
				}),
				new Action('Taxation *increases money*', {energy: 10},() => {
					STATE.Tax_system += 1
					this.acquisition = true
				})
			]);
		}
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
					showMessage('Your army has failed to conquer this system. They will be taught a lesson, GOD-QUEEN.')
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

	init() {
		this.acquisition = false
	}

	get info() {
		return 'This is system is under your protection, GOD-QUEEN.'
	}

	get image() {
		return 'conquered_tier_1'
	}

	onClick() {
		if (this.acquisition == false) {
			let cev = new Event('RESOURCE ACQUISITION', 'It is time for you to decide what to do with this system, GOD-QUEEN.', [
				new Action('Agricultural Terraforming', {energy: 10},() => {
					STATE.Agri_system += 1
					this.acquisition = true
				}),
				new Action('Fuel Extraction', {energy: 10},() => {
					STATE.Ext_system += 1
					this.acquisition = true
				}),
				new Action('Taxation', {energy: 10},() => {
					STATE.Tax_system += 1
					this.acquisition = true
				})
			]);
		}
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
					showMessage('Your army has failed to conquer this system. They will be taught a lesson, GOD-QUEEN.')
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

	init() {
		this.acquisition = false
	}

	get info() {
		return 'This is system is under your protection, GOD-QUEEN.'
	}

	get image() {
		return 'conquered_tier_2'
	}

	onClick() {
		if (this.acquisition == false) {
			let cev = new Event('RESOURCE ACQUISITION', 'It is time for you to decide what to do with this system, GOD-QUEEN.', [
				new Action('Agricultural Terraforming', {energy: 10},() => {
					STATE.Agri_system += 1
					this.acquisition = true
				}),
				new Action('Fuel Extraction', {energy: 10},() => {
					STATE.Ext_system += 1
					this.acquisition = true
				}),
				new Action('Taxation', {energy: 10},() => {
					STATE.Tax_system += 1
					this.acquisition = true
				})
			]);
		}
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
					showMessage('Your army has failed to conquer this system. They will be taught a lesson, GOD-QUEEN.')
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

	init() {
		this.acquisition = false
	}

	get info() {
		return 'This is system is under your protection, GOD-QUEEN.'
	}

	get image() {
		return 'conquered_tier_3'
	}

	onClick() {
		if (this.acquisition == false) {
			let cev = new Event('RESOURCE ACQUISITION', 'It is time for you to decide what to do with this system, GOD-QUEEN.', [
				new Action('Agricultural Terraforming', {energy: 10},() => {
					STATE.Agri_system += 1
					this.acquisition = true
				}),
				new Action('Fuel Extraction', {energy: 10},() => {
					STATE.Ext_system += 1
					this.acquisition = true
				}),
				new Action('Taxation', {energy: 10},() => {
					STATE.Tax_system += 1
					this.acquisition = true
				})
			]);
		}
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
					showMessage('Your army has failed to conquer this system. They will be taught a lesson, GOD-QUEEN.')
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

	init() {
		this.acquisition = false
	}

	get info() {
		return 'This is system is under your protection, GOD-QUEEN.'
	}

	get image() {
		return 'conquered_tier_4'
	}

	onClick() {
		if (this.acquisition == false) {
			let cev = new Event('RESOURCE ACQUISITION', 'It is time for you to decide what to do with this system, GOD-QUEEN.', [
				new Action('Agricultural Terraforming', {energy: 10},() => {
					STATE.Agri_system += 1
					this.acquisition = true
				}),
				new Action('Fuel Extraction', {energy: 10},() => {
					STATE.Ext_system += 1
					this.acquisition = true
				}),
				new Action('Taxation', {energy: 10},() => {
					STATE.Tax_system += 1
					this.acquisition = true
				})
			]);
		}
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
					showMessage('Your army has failed to conquer this system. They will be taught a lesson, GOD-QUEEN.')
				}
			} else {
				showMessage('You must reach this system before conquering it.')
			}
		} else {
    	showMessage('You do not have the energy to move your ships to conquer this system, GOD-QUEEN.')
    }
	}
}

var supplies_meter, morale_meter

// Initial setup of the game
function init() {
  var system = new mySystem();
  place(system, 24, 24);
  STATE.resources.systems += 1;

  var tier0 = new tier_0();
  place(tier0, 20, 21);
  tier0 = new tier_0();
  place(tier0, 30, 31);
  tier0 = new tier_0 ();
  place(tier0, 35, 40);
  tier0 = new tier_0 ();
  place(tier0, 21, 27);
  tier0 = new tier_0 ();
  place(tier0, 30, 23);



  var tier1 = new tier_1();
  place(tier1, 30, 27);
  tier1 = new tier_1();
  place(tier1, 35, 22);
  tier1 = new tier_1();
  place(tier1, 40, 49);

  var tier2 = new tier_2();
  place(tier2, 40, 28);
  tier2 = new tier_2();
  place(tier2, 50, 50);
  tier2 = new tier_2();
  place(tier2, 45, 33);

  var tier3 = new tier_3();
  place(tier3, 35, 40);
  tier3 = new tier_3();
  place(tier3, 25, 45);

  var tier4 = new tier_4();

  defineHarvester('supplies', function() {
  	return STATE.Agri_system/10
  }, 1000)

  defineHarvester('energy', function() {
  	return (STATE.Ext_system/2)*STATE.energy_production
  }, 1000)

  defineHarvester('money', function() {
  	return STATE.Tax_system/10
  }, 1000)

  let HireMercenaries = new Bonus(
  'You have hired the greatest mercenaries this side of the Tannhauser Gate.',
  'They will rain blood upon your enemies.',
  {'money': 50},
  () => {
      STATE.resources.army += 50;
  });

  let UpdateSupplyInfrastructure = new Bonus(
  'You have decided to update your infrastructure.',
  'They will greatly improve your farms.',
  {'energy': 50},
  () => {
      STATE.resources.supplies += 50;
  });

  let BuildEnergyFacility = new Bonus(
  'You have hired the greatest civil engineers to build new energy facilities.',
  'Your energy production will double.',
  {'energy': 50},
  () => {
      STATE.energy_production = 2;
  });

  let InvokeSpiritoftheEmpire = new Bonus(
  'You have decided to send soldiers and money to your capital for a massive parade.',
  'It will be glorious.',
  {'money': 80, 'army': 80},
  () => {
  		STATE.resources.morale = 100
  })

  // Setup the Menu for buying stuff
  var menu = new Menu('Intergalactic Bureau of Defense', [
  	new BuyButton('Hire Mercenaries *increases army by 50*', HireMercenaries),
  	new BuyButton('Update Supply Infrastructure *increases supplies by 50*', UpdateSupplyInfrastructure),
  	new BuyButton('Build Energy Facility *doubles energy production*', BuildEnergyFacility),
  	new BuyButton('Invoke spirit of the Empire *restores morale to 100*', InvokeSpiritoftheEmpire)
  ]);

  let start = new Event('How To Play','You can drag the screen to see your surroundings. Click empty spaces next to systems you have conquered to conquer them. Click conquered systems to designate what resource they will produce.')

	var menu = new Menu('Zoom In/Out', [
		new Button('Zoom Out', () => {
		GAME.grid.setCellSize(25)
		}),
		new Button('Original Size', () => {
		GAME.grid.setCellSize(75)
		}),
	]);

  supplies_meter = new Meter('Supplies', 0, [255, 0, 0], [255, 255, 255]);
  morale_meter = new Meter('Morale', 0, [255, 0, 0], [255, 255, 255]);
}

// The game's main loop.
// We're just using it to set a background color
function main() {

  supplies_meter.update(STATE.resources.supplies)
  morale_meter.update(STATE.resources.morale)

  STATE.resources.supplies = Math.min(STATE.resources.supplies, 100)
  STATE.resources.morale = Math.min(STATE.resources.morale, 100)

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
