ig.module(
	'game.classes.menuController'
)
.requires(
	'impact.system',
    'game.classes.screen-fader'
)
.defines(function(){ "use strict";

    ig.MenuController = ig.Class.extend({

        currentLevel: null,
        screenFader: null,

        levelNameFont: new ig.Font('media/Calibri.png'),
        drawLevelNameText: false,
        currentLevelName: null,
        fadeOutTimer: new ig.Timer(),
        fadeOutDuration: 2,

        init: function() {
            this.createMainMenu();
        },

        update: function() {
            this.fadeLevelNameSplash();
        },

        draw: function() {
            if (this.screenFader) {
                this.screenFader.draw();
            }
        },

        createMainMenu: function() {
            ig.gui.element.add({
                name: 'Button_StartGame',
                group: 'Group_MainMenu',
                size: { x: 453, y: 51 },
                pos: { x: 300, y: 400 },
                state: {
                    normal: {
                        image: new ig.Image('media/startgame_button.png')
                    }
                },
                click: function() {
                    ig.game.levelController.loadNewGameLevel();
                    ig.gui.element.action('hideGroup', 'Group_MainMenu');
                }
            })

            ig.gui.element.action('hideGroup', 'Group_MainMenu');
        },

        loadMainMenu: function() {
            ig.game.loadLevel(Level0_MainMenu);
            ig.gui.element.action('showGroup', 'Group_MainMenu');

            this.fadeScreenFromBlack();
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
