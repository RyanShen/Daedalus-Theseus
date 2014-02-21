ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',

    'game.classes.camera',
    'game.classes.eventController',
    'game.classes.levelController',
    'game.classes.screenshaker',
    'game.classes.screen-fader',
    'game.classes.gui',
    'game.classes.dialogController',
    'game.classes.soundmanager',

	'game.entities.player',
    'game.entities.mouse-arrow',
    'game.entities.levelchange',
    'game.entities.trigger',
    'game.entities.eventTrigger',
    'game.entities.fatherNPC',
    'game.entities.chatbubble',
    'game.entities.dialog-player',
    'game.entities.questions',
    'game.entities.clickable',

    'game.levels.1_House_UpperFloor',
    'game.levels.1_House_GroundFloor'
)
.defines(function(){

MyGame = ig.Game.extend({
	
	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),
    eventController: new ig.EventController( ),
    levelController: new ig.LevelController( ),
    screenShaker: new ScreenShaker( ),

	init: function() {
		// Initialize your game here; bind keys etc.
		ig.input.bind( ig.KEY.UP_ARROW, 'up' );
		ig.input.bind( ig.KEY.DOWN_ARROW, 'down' );
		ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );

        ig.input.initMouse();
        ig.input.bind( ig.KEY.MOUSE1, 'leftclick' );
        ig.input.bind( ig.KEY.MOUSE2, 'rightclick' );

        //question interface
        ig.input.bind( ig.KEY.A, 'toggleQInterface' );

        this.levelController.loadNewGameLevel();
        this.setupCamera();

        ig.audio = new SoundManager();
        ig.dialog = new DialogController();
        ig.audio.play('bgm');
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
        this.camera.follow();
        this.eventController.update();
        this.screenShaker.update();
        this.screenShaker.shakeScreen( this.screen );
	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
        this.levelController.draw();
	}
});


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, 1024, 768, 1 );

});
