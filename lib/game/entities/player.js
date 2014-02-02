ig.module(
	'game.entities.player'
)
.requires(
	'impact.entity'
)
.defines(function() {

EntityPlayer = ig.Entity.extend({

	size: {x: 40, y: 88},
	offset: {x: 17, y: 10},
	
	maxVel: {x: 400, y: 800},
	friction: {x: 800, y: 0},
	
	collides: ig.Entity.COLLIDES.PASSIVE,
	
	animSheet: new ig.AnimationSheet( 'media/playercopy.png', 75, 100 ),

	flip: false,
	accelGround: 1200,
	walkup: false,
	walkdown: false,

	init: function( x, y, settings ) {

		this.parent( x, y, settings );
		
		// Add the animations
		this.addAnim( 'idle', 1, [20] );
		this.addAnim( 'walkx', 0.07, [0,1,2,3,4,5,6,7] );
		this.addAnim( 'walkdown', 0.1, [8,9,10,11,12,13,14,15]);
		this.addAnim( 'walkup', 0.15, [16,17,18,19]);

		// Set a reference to the player on the game instance
		ig.game.player = this;
	},


	update: function() {

		var accel = this.accelGround;

		// Handle user input; move left or right
		if (ig.input.state('left')) {
			this.accel.x = -accel;
			this.flip = true;
			console.log('left');
		}
		else if (ig.input.state('right')) {
			this.accel.x = accel;
			this.flip = false;
			console.log('right');
		}
		else if (ig.input.state('up')) {
			this.walkup = true;
			this.walkdown = false;
			this.flip = false;
			console.log('up');
		}
		else if (ig.input.state('down')) {
			this.walkup = false;
			this.walkdown = true;
			this.flip = false;
			console.log('down');
		}
		else {
			this.accel.x = 0;
			this.walkup = false;
			this.walkdown = false;
		}

		// handle walk up and walk down update
		if (this.walkup) {
			//this.vel.y = -400;
			this.accel.y = -accel
			this.vel.x = 0;
			this.currentAnim = this.anims.walkup;
		}
		else if (this.walkdown) {
			//this.vel.y = 400;
			this.accel.y = accel;
			this.vel.x = 0;
			this.currentAnim = this.anims.walkdown;
		}
		else {
			this.accel.y = 0;
			this.vel.y = 0;
		}


		// update the animation
		if (this.vel.x != 0) {
			this.currentAnim = this.anims.walkx;
		}
		else if (this.vel.y == 0) {
			this.currentAnim = this.anims.idle;
		}

		this.currentAnim.flip.x = this.flip;

		this.parent();
	}

});

});
