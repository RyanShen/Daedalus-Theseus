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
                this.createMainMenu();
                this.createPlayTestThankYouScreen();
            },

            update: function() {
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
                    size: { x: 343, y: 82 },
                    pos: { x: 353, y: 508 },
                    state: {
                        normal: {
                            image: new ig.Image('media/UI/StartMenu_btn_play.png')
                        },
                        hover: {
                            image: new ig.Image('media/UI/StartMenu_btn_play_hover.png')
                        }
                    },
                    click: function() {
                        if (ig.game.avatarID != 0 && ig.game.avatarID != 1) {
                            ig.gui.element.action('hideGroup', 'Group_MainMenu');
                            ig.game.levelController.loadCharacterSelect();
                        }
                        else {
                            ig.gui.element.action('hideGroup', 'Group_MainMenu');
                            ig.game.levelController.loadLevelfromSave();
                        }
                    }
                });

                ig.gui.element.add({
                    name: 'Button_Achievement',
                    group: 'Group_MainMenu',
                    size: { x: 343, y: 82 },
                    pos: { x: 353, y: 603 },
                    state: {
                        normal: {
                            image: new ig.Image('media/UI/StartMenu_btn_achievement.png')
                        },
                        hover: {
                            image: new ig.Image('media/UI/StartMenu_btn_achievement_hover.png')
                        }
                    },
                    click: function() {
                        ig.gui.element.action('hideGroup', 'Group_MainMenu');
                        ig.game.getEntitiesByType('EntityAchievementViewer')[0].display();

                    }
                });

                ig.gui.element.action('hideGroup', 'Group_MainMenu');
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
                    ig.gui.element.action('showGroup', 'Group_MainMenu');
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
