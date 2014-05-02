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
    //'game.classes.soundmanager',
    'game.classes.inGameGUIController',
    'game.classes.achievement',
    'game.classes.dataLoader',

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
    'game.entities.achievements',
    'game.entities.questionController',
    'game.entities.characterSelect',
    'game.entities.achievementViewer',
    'game.entities.toaster',
    'game.entities.boss',
    'game.entities.bossPlatform',
    'game.entities.bossFight',
    'game.entities.teamSelect',
    'game.entities.levelSelector',
    'game.entities.inGamePrompt',
    'game.entities.mainMenu',

    'game.levels.0_MainMenu',
    'game.levels.0_ThankYou',
    'game.levels.0_CharacterSelect',
    'game.levels.0_TeamSelect',
    'game.levels.1_House_UpperFloor',
    'game.levels.1_House_GroundFloor',
    'game.levels.2_PoliceHQ_GroundFloor',
    'game.levels.3_Tower_GroundFloor',
    'game.levels.3_Tower_TopFloor',
    'game.levels.4_Tower_SecretFloor',
    'game.levels.4_Tower_BinaryExploitRoom',
    'game.levels.4_Tower_CryptologyRoom',
    'game.levels.4_Tower_ForensicsRoom',
    'game.levels.4_Tower_ReverseEngyRoom',
    'game.levels.4_Tower_ScriptExploitRoom',
    'game.levels.4_Tower_TriviaRoom',
    'game.levels.4_Tower_WebExploitRoom',
    //'impact.debug.debug'

    'plugins.impact-storage'
)
    .defines(function(){

        MyGame = ig.Game.extend({

            userID: null,
            avatarID: 3,
            teamID: 1,
            eventID: 0,
            level: null,
            spawnpos: {x: 0, y: 0},
            menuController: new ig.MenuController( ),
            eventController: new ig.EventController( ),
            inGameGUIController: new ig.InGameGUIController( ),
            levelController: new ig.LevelController( ),
            //audioController: new SoundManager( ),
            dialogFigures: new DialogFigures(),
            dialogController: null,
            screenShaker: new ScreenShaker( ),
            achievement: null,
            dataLoader: new ig.DataLoader(),
            storage: null,

            autoSort: true,

            uiLock: 0,
            playerLock: 0,
            clickableLock: 0,
            problemLock: 0,

            init: function() {
                // Initialize your game here; bind keys etc.
                //ig.input.bind( ig.KEY.UP_ARROW, 'up' );
                //ig.input.bind( ig.KEY.DOWN_ARROW, 'down' );
                //ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
                //ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
                //ig.input.bind( ig.KEY.ENTER, 'enter' );
                ig.input.bind( ig.KEY.SPACE, 'space' );
                ig.input.bind( ig.KEY.ESC, 'skip' );
                ig.input.bind( ig.KEY.F6, 'resetAll');

                ig.input.initMouse();
                ig.input.bind( ig.KEY.MOUSE1, 'leftclick' );
                //ig.input.bind( ig.KEY.MOUSE2, 'rightclick' );
                //question interface
                //ig.input.bind( ig.KEY.A, 'toggleQInterface' );
                //ig.input.bind( ig.KEY.V, 'toggleQInterface1' );
                //ig.input.bind( ig.KEY.B, 'toggleQInterface2' );
                //ig.input.bind( ig.KEY.N, 'toggleQInterface3' );
                //ig.input.bind( ig.KEY.M, 'toggleQInterface4' );
                //ig.input.bind( ig.KEY.R, 'resetLocalStorage' );
                ig.input.bind(ig.KEY.MWHEEL_UP,'scrollup');
                ig.input.bind(ig.KEY.MWHEEL_DOWN,'scrolldown');

                //ig.game.dataLoader.getSessionStatus();

                // local storage on client side:
                // check if key exists in local storage
                // if yes, and timestamp within certain range,
                // regard this session as a refresh session
                // if not, get information from the web
                // To ensure full restful
                // compare timestamp with server timestamp
                this.storage = new ig.Storage();


                this.dialogController = new DialogController( );
                this.achievement =  new ig.Achievement( );

                //this.menuController.loadMainMenu();

                ig.game.dataLoader.parseURI();
            },

            update: function() {

                // Update all entities and backgroundMaps
                this.parent();
                //console.log(ig.game.teamID + "  " + ig.game.dataLoader.userID);
                //console.log(ig.game.eventController.latestEventID);
                //console.log(ig.game.level);
                //console.log(this.playerLock);


                this.menuController.update();
                this.eventController.update();
                this.levelController.update();
                this.screenShaker.update();
                this.screenShaker.shakeScreen( this.screen );
                this.achievement.update();
                this.inGameGUIController.update();

                /*
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

                if (ig.input.pressed('toggleQInterface1')){
                    var qaInterface = ig.game.getEntitiesByType(EntityQuestions)[0];
                    if(!qaInterface.isActive){
                        this.player.setMovementLock(true);
                        qaInterface.ProblemDisplay(2);
                    }
                    else{
                        this.player.setMovementLock(false);
                        qaInterface.ProblemHide();
                    }
                }
                if (ig.input.pressed('toggleQInterface2')){
                    var qaInterface = ig.game.getEntitiesByType(EntityQuestions)[0];
                    if(!qaInterface.isActive){
                        this.player.setMovementLock(true);
                        qaInterface.ProblemDisplay(3);
                    }
                    else{
                        this.player.setMovementLock(false);
                        qaInterface.ProblemHide();
                    }
                }
                if (ig.input.pressed('toggleQInterface3')){
                    var qaInterface = ig.game.getEntitiesByType(EntityQuestions)[0];
                    if(!qaInterface.isActive){
                        this.player.setMovementLock(true);
                        qaInterface.ProblemDisplay(4);
                    }
                    else{
                        this.player.setMovementLock(false);
                        qaInterface.ProblemHide();
                    }
                }
                if (ig.input.pressed('toggleQInterface4')){
                    var qaInterface = ig.game.getEntitiesByType(EntityQuestions)[0];
                    if(!qaInterface.isActive){
                        this.player.setMovementLock(true);
                        qaInterface.ProblemDisplay(5);
                    }
                    else{
                        this.player.setMovementLock(false);
                        qaInterface.ProblemHide();
                    }
                }
                */

                if(ig.input.pressed('resetLocalStorage')){
                    this.achievement.resetLocalStorageValues();
                }

                if(ig.input.pressed('resetAll')) {
                    ig.game.storage.clear();
                    ig.game.dataLoader.clear();
                    var tid = ig.game.teamID;
                    var aid = ig.game.avatarID;
                    ig.game.dataLoader.getSessionStatus();
                    ig.game.avatarID = aid;
                    ig.game.teamID = tid;
                    ig.game.levelController.loadNewGameLevel();
                }

                $(window).bind('beforeunload', function(){
                    ig.game.dataLoader.save();
                });

            },

            draw: function() {
                // Draw all entities and backgroundMaps
                this.parent();
                this.menuController.draw();
                this.levelController.draw();
                if(ig.gui.show)
                    ig.gui.draw();

                this.inGameGUIController.draw();
            },

            togglePlayerInteraction: function( toggle ){

                if( toggle)
                {
                    if (this.playerLock > 0) this.playerLock--;
                    if (!this.playerLock) {
                        var player = ig.game.getEntitiesByType(EntityPlayer)[0];
                        if (player)
                            player.movementLock = false;
                    }
                }
                else
                {
                    var player = ig.game.getEntitiesByType(EntityPlayer)[0];
                    if( player )
                        player.movementLock = true;
                    this.playerLock++;
                }
            },

            toggleClickableInteraction: function(object, toggle) {
                if (toggle) {
                    this.toggleInteractiveObjects(true);
                }
                else {
                    var clickables = ig.game.getEntitiesByType(EntityClickable);
                    for (var i = 0; i < clickables.length; i++) {
                        if (object && clickables[i] != object) {
                            clickables[i].clickableLock = true;
                        }
                    }
                    var problemTriggers = ig.game.getEntitiesByType(EntityProblemtrigger);
                    for (i = 0; i < problemTriggers.length; i++) {
                        problemTriggers[i].problemTriggerLock = true;
                    }

                    this.clickableLock++;
                    this.problemLock++;
                }
            },

            toggleProblemInteraction: function(object, toggle) {
                if (toggle) {
                    this.toggleInteractiveObjects(true);
                }
                else {
                    var problemTriggers = ig.game.getEntitiesByType(EntityProblemtrigger);
                    for (var i = 0; i < problemTriggers.length; i++) {
                        if (object && problemTriggers[i] != object) {
                            problemTriggers[i].problemTriggerLock = true;
                        }
                    }
                    var clickables = ig.game.getEntitiesByType(EntityClickable);
                    for (i = 0; i < clickables.length; i++) {
                        clickables[i].clickableLock = true;
                    }

                    this.clickableLock++;
                    this.problemLock++;
                }
            },

            toggleInteractiveObjects: function(toggle) {
                if (toggle) {
                    if (this.clickableLock > 0) this.clickableLock--;
                    if (this.problemLock > 0) this.problemLock--;
                    if (!this.problemLock) {
                        var problemTriggers = ig.game.getEntitiesByType(EntityProblemtrigger);
                        for (i = 0; i < problemTriggers.length; i++) {
                            problemTriggers[i].problemTriggerLock = false;
                        }
                    }

                    if (!this.clickableLock) {
                        var clickables = ig.game.getEntitiesByType(EntityClickable);
                        for (i = 0; i < clickables.length; i++) {
                            clickables[i].clickableLock = false;
                        }
                    }
                }
                else {
                    problemTriggers = ig.game.getEntitiesByType(EntityProblemtrigger);
                    for (i = 0; i < problemTriggers.length; i++) {
                        problemTriggers[i].problemTriggerLock = true;
                    }
                    clickables = ig.game.getEntitiesByType(EntityClickable);
                    for (i = 0; i < clickables.length; i++) {
                        clickables[i].clickableLock = true;
                    }
                    this.problemLock++;
                    this.clickableLock++;
                }
            },

            toggleEventModeInteraction: function(toggle){
                this.toggleUIPlayerInteraction(toggle);
                this.toggleInteractiveObjects(toggle);
            },

            toggleUIPlayerInteraction: function( toggle ){
                this.togglePlayerInteraction(toggle);
                this.inGameGUIController.toggleUI( toggle );
            },

            toggleSubsystemsInteraction: function( toggle ) {
                if( !toggle )
                {
                    var toasters = ig.game.getEntitiesByType(EntityToaster);
                    if( toasters )
                    {
                        for( var i in toasters )
                            i.isSuspended = true;
                    }
                    var boss = ig.game.getEntitiesByType(EntityBoss)[0];
                    if( boss )
                        boss.isSuspended = true;
                    var bossPlat = ig.game.getEntitiesByType(EntityBossPlatform)[0];
                    if( bossPlat )
                        bossPlat.isSuspended = true;
                    var npcs = ig.game.getEntitiesByType(EntityNPC);
                    if( npcs )
                    {
                        for( var n in npcs )
                            n.isSuspended = true;
                    }
                    var dialogbox = ig.game.getEntitiesByType(EntityDialogBox)[0];
                    if( dialogbox )
                        dialogbox.isSuspended = true;

                    var dialogplayer = ig.game.getEntitiesByType(EntityDialogPlayer)[0];
                    if( dialogplayer )
                        dialogplayer.isSuspended = true;
                }
                else
                {
                    var toasters = ig.game.getEntitiesByType(EntityToaster);
                    if( toasters )
                    {
                        for( var i in toasters )
                            i.isSuspended = false;
                    }
                    var boss = ig.game.getEntitiesByType(EntityBoss)[0];
                    if( boss )
                        boss.isSuspended = false;
                    var bossPlat = ig.game.getEntitiesByType(EntityBossPlatform)[0];
                    if( bossPlat )
                        bossPlat.isSuspended = false;
                    var npcs = ig.game.getEntitiesByType(EntityNPC);
                    if( npcs )
                    {
                        for( var n in npcs )
                            n.isSuspended = false;
                    }
                    var dialogbox = ig.game.getEntitiesByType(EntityDialogBox)[0];
                    if( dialogbox )
                        dialogbox.isSuspended = false;
                    var dialogplayer = ig.game.getEntitiesByType(EntityDialogPlayer)[0];
                    if( dialogplayer )
                        dialogplayer.isSuspended = false;
                }

                this.toggleUIPlayerInteraction(toggle);
            }
        });

        MyLoader = ig.Loader.extend({

            draw: function() {
                // Add your drawing code here

                // This one clears the screen and draws the
                // percentage loaded as text

                var ctx = ig.system.context;
                this._drawStatus += (this.status - this._drawStatus)/5;
                var percentage = (this.status * 100).round() + '%';
                var s = ig.system.scale;
                var w = ig.system.width * 0.7;
                var h = ig.system.height * 0.01;
                var x = ig.system.width * 0.5-w/2;
                var y = ig.system.height * 0.5-h/2;

                ctx.fillStyle = '#000';
                ctx.fillRect( 0, 0, ig.system.width, ig.system.height );

                ctx.fillStyle = '#54c5e7';
                ctx.fillRect( x*s, y*s+50, w*s, h*s );

                ctx.fillStyle = '#000';
                ctx.fillRect( x*s+s, y*s+s+50, w*s-s-s, h*s-s-s );

                ctx.fillStyle = '#0fa6d3';
                ctx.fillRect( x*s+1, y*s+50+1, w*s*this._drawStatus-2, h*s-2 );

                ctx.font="18px Helvetica"
                ctx.fillStyle = '#0fa6d3';
                var str = 'INITIALIZING...';
                //str = 'Oops, server is down';
                ctx.fillText( str, x*s,  y*s+30  );
                ctx.fillText( percentage, x*s + w*s - 50,  y*s + 90 );
            }
        });


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
        ig.main( '#canvas', MyGame, 60, 1024, 768, 1, MyLoader );

    });
