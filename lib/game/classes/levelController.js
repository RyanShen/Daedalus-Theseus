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

        levelNameFont: new ig.Font('media/Calibri.png'),
        drawLevelNameText: false,
        currentLevelName: null,
        fadeOutTimer: new ig.Timer(),
        fadeOutDuration: 2,

        init: function() {
        },

        update: function() {
            this.fadeLevelNameSplash();
        },

        draw: function() {
            if (this.screenFader) {
                this.screenFader.draw();
            }

            if (this.drawLevelNameText)
                this.levelNameFont.draw(this.currentLevelName, 700, 100, ig.Font.ALIGN.RIGHT);
        },

        loadNewGameLevel: function() {
            ig.game.loadLevel(Level1_House_UpperFloor);
            ig.game.spawnEntity(EntityPlayer, 516, 328);
            ig.game.spawnEntity(EntityNPC, 723, 376, {name: 'Dad', media: 'Father'});
            this.loadGUIEntities();
            this.fadeScreenFromBlack();
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
            ig.game.camera.entityToFollow = ig.game.player;
        },

        loadGUIEntities: function() {
            ig.game.spawnEntity(EntityMouseArrow, -100, -100);
            ig.game.spawnEntity(EntityDialogPlayer, 0, 0);
            ig.game.dialogController.setDialogBox();
            ig.game.spawnEntity(EntityQuestions, 0, 0);
        },

        loadNPCEntities: function() {
            switch(ig.game.eventController.latestEventID){
                case 0:
                    if (this.currentLevel == '1_House_UpperFloor'){
                        ig.game.spawnEntity(EntityNPC, 723, 376, {name:'Dad', media:'Father'});
                    }
                    break;
                case 3:
                    if (this.currentLevel == '1_House_UpperFloor'){
                        ig.game.spawnEntity(EntityNPC, 0, 0, {name:'Police Officer Lisa', media:'Lisa'});
                        ig.game.spawnEntity(EntityNPC, 0, 0, {name:'Police Officer Steve', media:'Steve'});
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
                    this.currentLevelName = 'Home - Upper Floor';
                    break;
                case '1_House_GroundFloor':
                    this.currentLevelName = 'Home - Ground Floor';
                    break;
                default :
                    console.log('No NPC entities needed at this time.');
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
        }
    });

});
