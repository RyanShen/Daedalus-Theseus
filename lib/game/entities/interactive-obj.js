ig.module(
	'game.entities.interactive-obj'
)
.requires(
	'impact.entity'
)
.defines(function() {
EntityInteractiveObj = ig.Entity.extend({

	// define the type entity type B
	type: ig.Entity.TYPE.B,
	size: {x: 100, y: 100},

	init: function(x, y, settings) {
		this.parent(x, y, settings);
	},

	update: function() {

		this.parent();
	},

	clicked: function() {
		// trigger Events
		console.log("Trigger clicking on event");
	}

});


});