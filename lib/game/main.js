ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',

    'game.classes.camera',
    'game.classes.eventController',

	'game.entities.player',
    'game.entities.mouse-arrow',
    'game.entities.levelchange',
    'game.entities.trigger',
    'game.entities.eventTrigger',
    'game.entities.fatherNPC',
    'game.entities.chatbubble',
    'game.entities.dialog-player',

    'game.levels.1_House_UpperFloor',
    'game.levels.1_House_GroundFloor'
)
.defines(function(){

MyGame = ig.Game.extend({
	
	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),
    eventController: new ig.EventController( ),
	
	init: function() {
		// Initialize your game here; bind keys etc.
		ig.input.bind( ig.KEY.UP_ARROW, 'up' );
		ig.input.bind( ig.KEY.DOWN_ARROW, 'down' );
		ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );

        ig.input.initMouse();
        ig.input.bind( ig.KEY.MOUSE2, 'click' );

        this.loadLevel( Level1_House_UpperFloor );

        this.spawnEntity( EntityPlayer, 523, 176 );
        this.spawnEntity( EntityFatherNPC, 723, 376 );
        this.spawnEntity( EntityMouseArrow, -100, -100 );

        var dialogSetJSON = [
            { name: 'justin', side: 'left', mediaNum: 0, text: 'Father father father father father father!'  },
            { name: 'father', side: 'right', mediaNum: 1, text: 'Hello, fefw fewno opwn wiw noiwen wnotn nioewn nowetn n eniwtnw.'  },
            { name: 'justin', side: 'left', mediaNum: 0, text: 'ffewnl fenf;n fnonf w nfeiwo 342o 2o 2'  },
            { name: 'father', side: 'right', mediaNum: 1, text: 'nfr r 2 r23 w wer r wewedrf rewwerfw rion32 bnuio gbui yu vyu v y vyug vbyuvbu vuyvy vuv'  },
            { name: 'justin', side: 'left', mediaNum: 0, text: 'Father!'  }
        ];
        var dialogPlayer = this.spawnEntity( EntityDialogPlayer, 0, 0 );
        dialogPlayer.playDialogSet( dialogSetJSON );


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
        this.eventController.update();
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
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, 1024, 768, 1 );

});
