ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
	
	'plugins.camera',
    'plugins.EventController',
	
	'game.entities.test-player',
	'game.entities.levelchange',
	'game.entities.trigger',
    'game.entities.EventTrigger',
    'game.entities.Father',
    'game.entities.chatbubble',
	
	'game.levels.1_House_UpperFloor',
	'game.levels.1_House_GroundFloor'
)
.defines(function(){

MyGame = ig.Game.extend({
	
	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),
	
	
	init: function() {
		// Initialize your game here; bind keys etc.
		ig.input.bind( ig.KEY.W, 'up' );
		ig.input.bind( ig.KEY.S, 'down' );
		ig.input.bind( ig.KEY.A, 'left' );
		ig.input.bind( ig.KEY.D, 'right' );
		
		this.loadLevel( Level1_House_UpperFloor );
		
		this.setupCamera();
	},
	
	setupCamera: function() {
		// Set up the camera. The camera's center is at a third of the screen
		// size, i.e. somewhat shift left and up. Damping is set to 3px.		
		this.camera = new ig.Camera( ig.system.width/3, ig.system.height/3, 3);
		
		// The camera's trap (the deadzone in which the player can move with the
		// camera staying fixed) is set to according to the screen size as well.
    	this.camera.trap.size.x = ig.system.width/10;
    	this.camera.trap.size.y = ig.system.height/3;
		
		// The lookahead always shifts the camera in walking position; you can 
		// set it to 0 to disable.
    	this.camera.lookAhead.x = 0;
		
		// Set camera's screen bounds and reposition the trap on the player
    	this.camera.max.x = ig.system.width;
    	this.camera.max.y = ig.system.height;
    	this.camera.set( this.player );
	},
	
	update: function() {
		// Update all entities and backgroundMaps
		this.parent();
		this.camera.follow( this.player );
		// Add your own, additional update code here
	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
		
		
		// Add your own drawing code here
		//var x = ig.system.width/2,
			//y = ig.system.height/2;
		
		
		//this.font.draw( 'It Works!', x, y, ig.Font.ALIGN.CENTER );
	}
});


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 1
ig.main( '#canvas', MyGame, 60, 1024, 768, 1 );

});