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

        init: function() {
        },

        update: function() {

        },

        draw: function() {
            if (this.screenFader) {
                this.screenFader.draw();
            }
        },

        loadNewGameLevel: function() {
            ig.game.loadLevel(Level1_House_UpperFloor);
            ig.game.spawnEntity(EntityPlayer, 520, 176);
            ig.game.spawnEntity(EntityFatherNPC, 723, 376);
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
            ig.game.spawnEntity(EntityQuestions, 0, 0);
        },

        loadNPCEntities: function() {
            switch(ig.game.eventController.latestEventID){
                case 0:
                    if (this.currentLevel == '1_House_UpperFloor'){
                        ig.game.spawnEntity(EntityFatherNPC, 723, 376);
                    }
                    break;
                case 3:
                    if (this.currentLevel == '1_House_UpperFloor'){
                        ig.game.spawnEntity(EntityFatherNPC, 0, 0);
                        ig.game.spawnEntity(EntityFatherNPC, 0, 0);
                        console.log("loaded");
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
        }
    });

});
