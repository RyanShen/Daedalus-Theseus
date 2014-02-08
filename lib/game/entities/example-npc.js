ig.module(
	'game.entities.example-npc'
)
.requires(
	'impact.entity',
	'game.entities.interactive-obj'
)
.defines(function() {
EntityInteractiveObj = ig.Entity.extend({

	// define the type entity type B
	type: ig.Entity.TYPE.B,
	size: {x: 100, y: 100},

	size: {x: 40, y: 88},
	offset: {x: 17, y: 10},

	animSheet: new ig.AnimationSheet( 'media/playercopy.png', 75, 100 )

	init: function(x, y, settings) {
		this.parent(x, y, settings);
		this.addAnim( 'idle', 1, [20] );
	},

	update: function() {

		this.parent();
	},

	clicked: function() {
		// dialogue
		speak();
	}

});


});