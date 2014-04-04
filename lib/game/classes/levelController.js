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
            ig.game.player.orientation = 'up';
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
                        ig.game.spawnEntity(EntityNPC, -100, 0, {name:'Police Officer Lisa', media:'Lisa'});
                        ig.game.spawnEntity(EntityNPC, -100, 0, {name:'Policeman', media:'Policeman'});
                    }
                    break;
                case 5:
                    if (this.currentLevel == '1_House_GroundFloor'){
                        var spawnpointLisa = ig.game.getEntityByName('lisaSpawn');
                        ig.game.spawnEntity(EntityNPC, spawnpointLisa.pos.x, spawnpointLisa.pos.y, {name:'Police Officer Lisa', media:'Lisa'});

                        var spawnpointGenericPolice = ig.game.getEntityByName('policeSpawn');
                        ig.game.spawnEntity(EntityNPC, spawnpointGenericPolice.pos.x, spawnpointGenericPolice.pos.y, {name:'Policeman', media:'Policeman'});
                    }
                    break;
                case 6:
                    if (this.currentLevel == '2_PoliceHQ_GroundFloor'){
                        ig.game.player.orientation = 'up';

                        var spawnpointLisa = ig.game.getEntityByName('lisaSpawn');
                        var entityLisa = ig.game.spawnEntity(EntityNPC, spawnpointLisa.pos.x, spawnpointLisa.pos.y, {name:'Police Officer Lisa', media:'Lisa'});
                        entityLisa.orientation = 'up';

                        var spawnpointSteve = ig.game.getEntityByName('steveSpawn');
                        var entitySteve = ig.game.spawnEntity(EntityNPC, spawnpointSteve.pos.x, spawnpointSteve.pos.y, {name:'Section Chief Steve', media:'Steve'});
                        entitySteve.orientation = 'left';

                        var spawnpointPoliceman1 = ig.game.getEntityByName('policeSpawn_1');
                        var entityPolice1 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman1.pos.x, spawnpointPoliceman1.pos.y, {name:'Policeman', media:'Policeman'});
                        entityPolice1.orientation = 'up';

                        var spawnpointPoliceman2 = ig.game.getEntityByName('policeSpawn_2');
                        var entityPolice2 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman2.pos.x, spawnpointPoliceman2.pos.y, {name:'Policeman', media:'Policeman'});
                        entityPolice2.orientation = 'up';

                        var spawnpointPoliceman3 = ig.game.getEntityByName('policeSpawn_3');
                        var entityPolice3 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman3.pos.x, spawnpointPoliceman3.pos.y, {name:'Policeman', media:'Policeman'});
                        entityPolice3.orientation = 'up';

                        var spawnpointPoliceman4 = ig.game.getEntityByName('policeSpawn_4');
                        var entityPolice4 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman4.pos.x, spawnpointPoliceman4.pos.y, {name:'Policeman', media:'Policeman'});
                        entityPolice4.orientation = 'up';

                        var spawnpointPoliceman5 = ig.game.getEntityByName('policeSpawn_5');
                        var entityPolice5 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman5.pos.x, spawnpointPoliceman5.pos.y, {name:'Policeman', media:'Policeman'});
                        entityPolice5.orientation = 'up';

                        var spawnpointPoliceman6 = ig.game.getEntityByName('policeSpawn_6');
                        var entityPolice6 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman6.pos.x, spawnpointPoliceman6.pos.y, {name:'Policeman', media:'Policeman'});
                        entityPolice6.orientation = 'left';

                        var spawnpointPoliceman7 = ig.game.getEntityByName('policeSpawn_7');
                        var entityPolice7 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman7.pos.x, spawnpointPoliceman7.pos.y, {name:'Policeman', media:'Policeman'});
                        entityPolice7.orientation = 'left';

                        var spawnpointPoliceman8 = ig.game.getEntityByName('policeSpawn_8');
                        var entityPolice8 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman8.pos.x, spawnpointPoliceman8.pos.y, {name:'Policeman', media:'Policeman'});
                        entityPolice8.orientation = 'left';

                        var spawnpointPoliceman9 = ig.game.getEntityByName('policeSpawn_9');
                        var entityPolice9 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman9.pos.x, spawnpointPoliceman9.pos.y, {name:'Policeman', media:'Policeman'});
                        entityPolice9.orientation = 'down';

                        var spawnpointPoliceman10 = ig.game.getEntityByName('policeSpawn_10');
                        var entityPolice10 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman10.pos.x, spawnpointPoliceman10.pos.y, {name:'Policeman', media:'Policeman'});
                        entityPolice10.orientation = 'up';

                        var spawnpointPoliceman11 = ig.game.getEntityByName('policeSpawn_11');
                        var entityPolice11 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman11.pos.x, spawnpointPoliceman11.pos.y, {name:'Policeman', media:'Policeman'});
                        entityPolice11.orientation = 'up';
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
                case '3_Tower_GroundFloor':
                    this.currentLevelName = 'Crete Robotics Tower (Ground Floor)';
                    break;
                case '3_Tower_TopFloor':
                    this.currentLevelName = 'Crete Robotics Tower (Top Floor)';
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
