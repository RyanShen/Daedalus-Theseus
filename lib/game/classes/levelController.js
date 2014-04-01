ig.module(
	'game.classes.levelController'
)
.requires(
	'impact.system',
    'game.classes.screen-fader'
)
.defines(function(){ "use strict";

    ig.LevelController = ig.Class.extend({

        currentLevel: null,
        screenFader: null,

        levelNameFont: new ig.Font('media/Fonts/levelname_text.png'),
        drawLevelNameText: false,
        currentLevelName: null,
        fadeOutTimer: new ig.Timer(),
        fadeOutDuration: 3,

        camera: null,

        init: function() {
        },

        update: function() {
            if (this.camera)
                this.camera.follow();

            this.fadeLevelNameSplash();
        },

        draw: function() {
            if (this.screenFader) {
                this.screenFader.draw();
            }

            if (this.drawLevelNameText)
                this.levelNameFont.draw(this.currentLevelName, 512, 100, ig.Font.ALIGN.CENTER);
        },

        loadNewGameLevel: function() {
            ig.game.loadLevel(Level1_House_UpperFloor);
            ig.game.spawnEntity(EntityPlayer, 516, 228);
            var spawnpointFather = ig.game.getEntityByName('fatherSpawn');
            ig.game.spawnEntity(EntityNPC, spawnpointFather.pos.x, spawnpointFather.pos.y, {name:'Dad', media:'Father'});
            this.loadGUIEntities();
            this.setupCamera();
            this.fadeScreenFromBlack();
        },

        loadNewGameLevel2: function() {
            ig.game.eventController.latestEventID = 6;
            ig.game.spawnEntity(EntityPlayer, 0, 0);
            this.setupCamera();
            this.loadLevel('Level2_PoliceHQ_GroundFloor');
        },

        loadLevelfromSave: function() {

        },

        loadLevel: function(levelName) {
            this.loadLevelMap(levelName);
            this.loadPlayerAtSpawnPoint();
            this.loadGUIEntities();
            this.loadNPCEntities();
            this.fadeScreenFromBlack();
            this.drawLevelNameSplash();
        },

        loadLevelMap: function(levelName) {
            this.currentLevel = levelName.replace(/^(Level)?(\w)(\w*)/, function( m, l, a, b ) {
                return a.toUpperCase() + b;
            });
            ig.game.loadLevel(ig.global['Level' + this.currentLevel]);
        },

        loadPlayerAtSpawnPoint: function() {
            var spawnpoint = ig.game.getEntityByName('playerSpawn');
            ig.game.spawnEntity(EntityPlayer, spawnpoint.pos.x, spawnpoint.pos.y);
            ig.game.player = ig.game.getEntitiesByType(EntityPlayer)[0];
            this.camera.entityToFollow = ig.game.player;
        },

        loadGUIEntities: function() {
            ig.game.spawnEntity(EntityMouseArrow, -100, -100);
            ig.game.spawnEntity(EntityDialogPlayer, 0, 0);
            ig.game.dialogController.setDialogBox();
            ig.game.spawnEntity(EntityQuestions, 0, 0);
            //ig.game.spawnEntity(EntityAchievements);
        },

        loadNPCEntities: function() {
            switch(ig.game.eventController.latestEventID){
                case 0:
                    if (this.currentLevel == '1_House_UpperFloor'){
                        var spawnpointFather = ig.game.getEntityByName('fatherSpawn');
                        ig.game.spawnEntity(EntityNPC, spawnpointFather.pos.x, spawnpointFather.pos.y, {name:'Dad', media:'Father'});
                    }
                    break;
                case 3:
                    if (this.currentLevel == '1_House_UpperFloor'){
                        ig.game.spawnEntity(EntityNPC, 0, 0, {name:'Police Officer Lisa', media:'Lisa'});
                        ig.game.spawnEntity(EntityNPC, 0, 0, {name:'Police Officer Steve', media:'Steve'});
                    }
                    break;
                case 5:
                    if (this.currentLevel == '1_House_GroundFloor'){
                        var spawnpointLisa = ig.game.getEntityByName('lisaSpawn');
                        var spawnpointGenericPolice = ig.game.getEntityByName('policeOfficerGenericSpawn');
                        ig.game.spawnEntity(EntityNPC, spawnpointLisa.pos.x, spawnpointLisa.pos.y, {name:'Police Officer Lisa', media:'Lisa'});
                        ig.game.spawnEntity(EntityNPC, spawnpointGenericPolice.pos.x, spawnpointGenericPolice.pos.y, {name:'Police Officer Steve', media:'Steve'});
                    }
                    break;
                case 6:
                    if (this.currentLevel == '2_PoliceHQ_GroundFloor'){
                        var spawnpointLisa = ig.game.getEntityByName('lisaSpawn');
                        ig.game.spawnEntity(EntityNPC, spawnpointLisa.pos.x, spawnpointLisa.pos.y, {name:'Police Officer Lisa', media:'Lisa'});
                        var spawnpointSteve = ig.game.getEntityByName('steveSpawn');
                        ig.game.spawnEntity(EntityNPC, spawnpointSteve.pos.x, spawnpointSteve.pos.y, {name:'Section Chief Steve', media:'Steve'});
                    }
                    break;
                default :
                    console.log('No NPC entities needed at this time.');
                    break;
            }
        },

        fadeScreenToBlack: function() {
            this.screenFader = new ig.ScreenFader({fade: 'in'});
        },

        fadeScreenFromBlack: function() {
            this.screenFader = new ig.ScreenFader({fade: 'out'});
        },

        drawLevelNameSplash: function() {
            switch(this.currentLevel){
                case '1_House_UpperFloor':
                    this.currentLevelName = 'Home (Upper Floor)';
                    break;
                case '1_House_GroundFloor':
                    this.currentLevelName = 'Home (Ground floor)';
                    break;
                case '2_PoliceHQ_GroundFloor':
                    this.currentLevelName = 'Police Headquarters';
                    break;
                default :
                    console.log('Missing Level Name Splash');
                    break;
            }

            this.fadeOutTimer.set(this.fadeOutDuration);
            this.levelNameFont.alpha = 1;
            this.drawLevelNameText = true;
        },

        fadeLevelNameSplash: function() {
            if (this.drawLevelNameText) {
                if (this.fadeOutTimer.delta() > 0) {
                    this.drawLevelNameText = false;
                    this.levelNameFont.alpha = 1;
                }
                else
                    this.levelNameFont.alpha = this.fadeOutTimer.delta().map(-this.fadeOutDuration, 0, 1, 0);
            }
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
            this.camera.max.y = ig.system.height*2;
            this.camera.set( ig.game.player );
        }
    });

});
