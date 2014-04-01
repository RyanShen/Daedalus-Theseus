ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',

    'game.classes.camera',
    'game.classes.menuController',
    'game.classes.eventController',
    'game.classes.levelController',
    'game.classes.screenshaker',
    'game.classes.screen-fader',
    'game.classes.gui',
    'game.classes.dialogController',
    'game.classes.dialogFigures',
    'game.classes.soundmanager',
    'game.classes.inGameGUIController',
    'game.classes.achievement',

	'game.entities.player',
    'game.entities.mouse-arrow',
    'game.entities.levelchange',
    'game.entities.trigger',
    'game.entities.eventTrigger',
    'game.entities.NPC',
    'game.entities.chatbubble',
    'game.entities.dialog-player',
    'game.entities.questions',
    'game.entities.clickable',
    'game.entities.problemtrigger',
    'game.entities.ach',

    'game.levels.0_MainMenu',
    'game.levels.0_ThankYou',
    'game.levels.1_House_UpperFloor',
    'game.levels.1_House_GroundFloor',
    'game.levels.2_PoliceHQ_GroundFloor'
)
.defines(function(){

MyGame = ig.Game.extend({

    teamID: 1,
    menuController: new ig.MenuController( ),
    eventController: new ig.EventController( ),
    inGameGUIController: new ig.InGameGUIController( ),
    levelController: new ig.LevelController( ),
    audioController: new SoundManager( ),
    dialogFigures: new DialogFigures(),
    dialogController: null,
    screenShaker: new ScreenShaker( ),
    achievement: new ig.Achievement( ),

    autoSort: true,


	init: function() {
		// Initialize your game here; bind keys etc.
		ig.input.bind( ig.KEY.UP_ARROW, 'up' );
		ig.input.bind( ig.KEY.DOWN_ARROW, 'down' );
		ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
        ig.input.bind( ig.KEY.ENTER, 'enter' );
        ig.input.bind( ig.KEY.SPACE, 'space' );

        ig.input.initMouse();
        ig.input.bind( ig.KEY.MOUSE1, 'leftclick' );
        ig.input.bind( ig.KEY.MOUSE2, 'rightclick' );
        //question interface
        ig.input.bind( ig.KEY.A, 'toggleQInterface' );

        this.dialogController = new DialogController( );
        this.menuController.loadMainMenu();

	},

	update: function() {
		// Update all entities and backgroundMaps
		this.parent();
        this.menuController.update();
        this.eventController.update();
        this.levelController.update();
        this.screenShaker.update();
        this.screenShaker.shakeScreen( this.screen );
        this.achievement.update();

        if (ig.input.pressed('toggleQInterface')){
            var qaInterface = ig.game.getEntitiesByType(EntityQuestions)[0];
            if(!qaInterface.isActive){
                this.player.setMovementLock(true);
                qaInterface.ProblemDisplay(1);
            }
            else{
                this.player.setMovementLock(false);
                qaInterface.ProblemHide();
            }
        }
	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
        this.menuController.draw();
        this.levelController.draw();
        if(ig.gui.show)
            ig.gui.draw();

        this.inGameGUIController.draw();
	}
});


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, 1024, 768, 1 );

});
