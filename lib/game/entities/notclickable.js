ig.module(
	'game.entities.notclickable'
)
.requires(
	'impact.entity',
    'game.entities.player'
)
.defines(function() {
EntityNotclickable = ig.Entity.extend({

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

			if (this.checkDistance(this.distance)) {
				this.activated = true;
				this.activate();
				console.log("Activated");
			}
		}
		//console.log("activated: " + this.activated + "clicked: " + this.clicked);


	},


	checkDistance: function() {
		return this.distanceTo(this.player) <= this.distance;
	},

	activate: function() {
		switch (this.eventType) {
			case 'dialog':
				console.log("dialog time!");
				// var event = this.spawnEntity(dialog, 0, 0, {name: this.name, next: this.next});
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