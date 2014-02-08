ig.module(
	'game.entities.invisible-cursor'
)
.requires(
	'impact.entity'
)
.defines(function() {
EntityInvisibleCursor = ig.Entity.extend({

	// only check the entities having type B
	checkAgainst: ig.Entity.TYPE.B,

	size: {x: 1, y: 1},
	clicked: false,

	init: function(x, y, settings) {
		this.parent(x, y, settings);
	},

	update: function() {

		// update the position of invisible-cursor
		this.pos.x = ig.input.mouse.x;
		this.pos.y = ig.input.mouse.y;

		// set the value to true when the mouse is pressed
		this.clicked = ig.input.released('mouseLeft');
	},

	check: function(other) {
		if (this.clicked) {
			other.clicked();
		}
	} 

});


});