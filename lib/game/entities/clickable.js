ig.module(
	'game.entities.clickable'
)
.requires(
	'impact.entity',
    'game.entities.player'
)
.defines(function() {
EntityClickable = ig.Entity.extend({

	// define the type entity type B
	type: ig.Entity.TYPE.B,

	_wmDrawBox: true,
    _wmBoxColor: 'rgba(255, 0, 0, 0.7)',
	// imported from settings
	name: 0,
	size: {x: 25, y: 25},
	eventType: null,
	distance: 0,

	// absolute position of the object

	activated: false,
	clicked: false,
	orientation: null,

	player: null,

	init: function(x, y, settings) {
		this.parent(x, y, settings);
		this.xpos = x;
		this.ypos = y;
	},

	update: function() {
		this.parent();
		if (!this.activated) {
			this.player = ig.game.getEntitiesByType( EntityPlayer )[0];

			if (this.clickedOn() && this.checkDistance(this.distance) 
				&& this.checkOrientation()) {
				this.activated = true;
				this.activate();
				console.log("Activated");
			}
		}

		//console.log("activated: " + this.activated + "clicked: " + this.clicked);


	},


	clickedOn: function() {
		if (!ig.input.released('leftClick')) {
			return false;
		}
		if (ig.input.mouse.x + ig.game.screen.x >= this.pos.x && 
			ig.input.mouse.x + ig.game.screen.x <= this.pos.x + this.size.x * 2 && 
			ig.input.mouse.y + ig.game.screen.y >= this.pos.y && 
			ig.input.mouse.y + ig.game.screen.y <= this.pos.y + this.size.y * 2 ){
			return true;
		}
		return false;
	},

	checkDistance: function() {
		if (distance > 0) {
			return this.distanceTo(this.player) <= this.distance;
		}
		return true;
	},

	// check if the player is facing the object, possible facing conditions are:
	/*	object		player
		down		up-right, up, up-left
		up 			down-right, down, down-left
		left 		up-right, right, down-right
		right 		down-left, left, up-left
	*/
	checkOrientation: function() {
		if (this.orientation == null) {
			return true;
		}
		var dirString;
		switch (this.orientation) {
			case 'down':
				dirString = 'up';
				break;
			case 'up':
				dirString = 'down';
				break;
			case 'left':
				dirString = 'right';
				break;
			case 'right':
				dirString = 'left';
				break;
			default:
				return false;
				break;
		}

		//indexOf returns the position of the string in the other string
		//If not found, it will return -1:
		return this.player.orientation.indexOf(dirString) != -1;
	},

	activate: function() {
		switch (this.eventType) {
			case 'dialog':
				console.log("dialog time!");
				// var event = this.spawnEntity();
				break;
			case 'cutScene':
				console.log("cut scene time!");
				break;
			default:
				console.log("nothing happens!");
				break;
		} 

	}

});


});