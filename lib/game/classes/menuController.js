ig.module(
    'game.classes.menuController'
)
    .requires(
    'impact.system',
    'game.classes.screen-fader'
)
    .defines(function(){ "use strict";

        ig.MenuController = ig.Class.extend({

            screenFader: null,

            fadeOutTimer: new ig.Timer(),
            fadeOutDuration: 2,


            init: function() {
                this.createPlayTestThankYouScreen();
            },

            update: function() {
            },

            draw: function() {
                if (this.screenFader) {
                    this.screenFader.draw();
                }
            },

            createPlayTestThankYouScreen: function() {
                ig.gui.element.add({
                    name: 'PlaytestText',
                    group: 'Group_PlayTest',
                    size: { x: 453, y: 51 },
                    pos: { x: 300, y: 200 },
                    state: {
                        normal: {
                            image: new ig.Image('media/playtest_text.png')
                        }
                    },
                    click: function() {
                        this.loadMainMenu();
                    }
                })

                ig.gui.element.action('hideGroup', 'Group_PlayTest');
            },

            loadMainMenu: function() {
                if (ig.game.dataLoader.connect()) {
                    ig.game.loadLevel(Level0_MainMenu);
                    ig.game.spawnEntity(EntityMainMenu);
                    ig.game.getEntitiesByType('EntityMainMenu')[0].show();
                    ig.game.spawnEntity(EntityAchievementViewer, 0, 0);
                    ig.game.inGameGUIController.toggleUI( false );
                }
                else {
                    this.loadThankYouScreen();
                }
                this.fadeScreenFromBlack();
            },

            loadThankYouScreen: function() {
                ig.game.loadLevel(Level0_ThankYou);
                ig.gui.element.action('showGroup', 'Group_PlayTest');

                this.fadeScreenFromBlack();
            },

            fadeScreenToBlack: function() {
                this.screenFader = new ig.ScreenFader({fade: 'in'});
            },

            fadeScreenFromBlack: function() {
                this.screenFader = new ig.ScreenFader({fade: 'out'});
            }
        });

    });
