ig.module(
    'game.entities.levelSelector'
)
.requires(
    'impact.entity'
)
.defines(function(){

    EntityLevelSelector = ig.Entity.extend({

        visible: false,
        levelsUnlocked: 1,
        zIndex: 2000,

        background: new ig.Image('media/UI/LevelSelector/levelSelector_BG.jpg'),
        btn_level1_default: new ig.Image('media/UI/LevelSelector/level1_default.png'),
        btn_level1_hover: new ig.Image('media/UI/LevelSelector/level1_hover.png'),
        btn_level2_default: new ig.Image('media/UI/LevelSelector/level2_default.png'),
        btn_level2_hover: new ig.Image('media/UI/LevelSelector/level2_hover.png'),
        btn_level3_1_default: new ig.Image('media/UI/LevelSelector/level3-1_default.png'),
        btn_level3_1_hover: new ig.Image('media/UI/LevelSelector/level3-1_hover.png'),
        btn_level3_2_default: new ig.Image('media/UI/LevelSelector/level3-2_default.png'),
        btn_level3_2_hover: new ig.Image('media/UI/LevelSelector/level3-2_hover.png'),
        btn_level4_default: new ig.Image('media/UI/LevelSelector/level4_default.png'),
        btn_level4_hover: new ig.Image('media/UI/LevelSelector/level4_hover.png'),
        btn_close_default: new ig.Image('media/UI/QA_btn_leave.png'),
        btn_close_hover: new ig.Image('media/UI/QA_btn_leave_hover.png'),

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.createGUI();
            this.checkUnlockedLevels();
        },

        update: function() {
            if(this.visible)
            {
                this.highlightCurrentLevel();

                var alpha = ig.gui.element.action('getByName', 'LS_Background').alpha;
                if( alpha < 0.9 )
                {
                    ig.gui.element.action('show', 'LS_Background');
                    ig.gui.element.action('show', 'LS_Button_Close');

                    ig.gui.element.action('show', 'LS_Button_Level_1');
                    if (this.levelsUnlocked >= 2)
                        ig.gui.element.action('show', 'LS_Button_Level_2');
                    if (this.levelsUnlocked >= 3)
                        ig.gui.element.action('show', 'LS_Button_Level_3-1');
                    if (this.levelsUnlocked >= 4)
                        ig.gui.element.action('show', 'LS_Button_Level_3-2');
                    if (this.levelsUnlocked >= 5)
                        ig.gui.element.action('show', 'LS_Button_Level_4');

                    alpha += 0.1;

                    ig.gui.element.action('getByName', 'LS_Background').alpha = alpha;
                    ig.gui.element.action('getByName', 'LS_Button_Close').alpha = alpha;

                    ig.gui.element.action('getByName', 'LS_Button_Level_1').alpha = alpha;
                    ig.gui.element.action('getByName', 'LS_Button_Level_2').alpha = alpha;
                    ig.gui.element.action('getByName', 'LS_Button_Level_3-1').alpha = alpha;
                    ig.gui.element.action('getByName', 'LS_Button_Level_3-2').alpha = alpha;
                    ig.gui.element.action('getByName', 'LS_Button_Level_4').alpha = alpha;

                }
                else
                {
                    ig.gui.element.action('getByName', 'LS_Background').alpha = 1;
                    ig.gui.element.action('getByName', 'LS_Button_Close').alpha = 1;

                    ig.gui.element.action('getByName', 'LS_Button_Level_1').alpha = 1;
                    ig.gui.element.action('getByName', 'LS_Button_Level_2').alpha = 1;
                    ig.gui.element.action('getByName', 'LS_Button_Level_3-1').alpha = 1;
                    ig.gui.element.action('getByName', 'LS_Button_Level_3-2').alpha = 1;
                    ig.gui.element.action('getByName', 'LS_Button_Level_4').alpha = 1;
                }
            }
            else
            {
                var alpha = ig.gui.element.action('getByName', 'LS_Background').alpha;
                if( alpha > 0.1 )
                {
                    alpha -= 0.1;
                    ig.gui.element.action('getByName', 'LS_Background').alpha = alpha;
                    ig.gui.element.action('getByName', 'LS_Button_Close').alpha = alpha;

                    ig.gui.element.action('getByName', 'LS_Button_Level_1').alpha = alpha;
                    ig.gui.element.action('getByName', 'LS_Button_Level_2').alpha = alpha;
                    ig.gui.element.action('getByName', 'LS_Button_Level_3-1').alpha = alpha;
                    ig.gui.element.action('getByName', 'LS_Button_Level_3-2').alpha = alpha;
                    ig.gui.element.action('getByName', 'LS_Button_Level_4').alpha = alpha;
                }
                else
                {
                    ig.gui.element.action('getByName', 'LS_Background').alpha = 0;
                    ig.gui.element.action('getByName', 'LS_Button_Close').alpha = 0;

                    ig.gui.element.action('getByName', 'LS_Button_Level_1').alpha = 0;
                    ig.gui.element.action('getByName', 'LS_Button_Level_2').alpha = 0;
                    ig.gui.element.action('getByName', 'LS_Button_Level_3-1').alpha = 0;
                    ig.gui.element.action('getByName', 'LS_Button_Level_3-2').alpha = 0;
                    ig.gui.element.action('getByName', 'LS_Button_Level_4').alpha = 0;

                    ig.gui.element.action('hideGroup', 'Group_LevelSelector');
                }
            }
        },

        display: function() {
            ig.game.toggleUIPlayerInteraction(false);
            this.visible = true;
        },

        hide: function() {
            ig.game.toggleUIPlayerInteraction(true);
            this.visible = false;
        },

        draw: function() {

        },

        createGUI: function() {
            if (!ig.gui.element.action('getByName', 'LS_Background')) {
                ig.gui.element.add({
                    name: 'LS_Background',
                    group: 'Group_LevelSelector',
                    size: {x: 1024, y: 768},
                    pos: {x: 0, y: 0},
                    alpha: 0,
                    state: {
                        normal: {image: this.background}
                    }
                });
            }

            if (!ig.gui.element.action('getByName', 'LS_Button_Level_1')) {
                ig.gui.element.add({
                    name: 'LS_Button_Level_1',
                    group: 'Group_LevelSelector',
                    size: {x: 165, y: 170},
                    pos: {x: 85, y: 130},
                    alpha: 0,
                    state: {
                        normal: {image: this.btn_level1_default},
                        hover: {image: this.btn_level1_hover},
                        active: {image: this.btn_level1_hover}
                    },
                    click: function() {
                        ig.game.getEntitiesByType(EntityLevelSelector)[0].jumpToLevel('1_House_UpperFloor');
                    }
                });
            }

            if (!ig.gui.element.action('getByName', 'LS_Button_Level_2')) {
                ig.gui.element.add({
                    name: 'LS_Button_Level_2',
                    group: 'Group_LevelSelector',
                    size: {x: 169, y: 172},
                    pos: {x: 86, y: 313},
                    alpha: 0,
                    state: {
                        normal: {image: this.btn_level2_default},
                        hover: {image: this.btn_level2_hover},
                        active: {image: this.btn_level2_hover}
                    },
                    click: function() {
                        ig.game.getEntitiesByType(EntityLevelSelector)[0].jumpToLevel('2_PoliceHQ_GroundFloor');
                    }
                });
            }

            if (!ig.gui.element.action('getByName', 'LS_Button_Level_3-1')) {
                ig.gui.element.add({
                    name: 'LS_Button_Level_3-1',
                    group: 'Group_LevelSelector',
                    size: {x: 193, y: 178},
                    pos: {x: 725, y: 503},
                    alpha: 0,
                    state: {
                        normal: {image: this.btn_level3_1_default},
                        hover: {image: this.btn_level3_1_hover},
                        active: {image: this.btn_level3_1_hover}
                    },
                    click: function() {
                        ig.game.getEntitiesByType(EntityLevelSelector)[0].jumpToLevel('3_Tower_GroundFloor');
                    }
                });
            }

            if (!ig.gui.element.action('getByName', 'LS_Button_Level_3-2')) {
                ig.gui.element.add({
                    name: 'LS_Button_Level_3-2',
                    group: 'Group_LevelSelector',
                    size: {x: 184, y: 168},
                    pos: {x: 731, y: 312},
                    alpha: 0,
                    state: {
                        normal: {image: this.btn_level3_2_default},
                        hover: {image: this.btn_level3_2_hover},
                        active: {image: this.btn_level3_2_hover}
                    },
                    click: function() {
                        ig.game.getEntitiesByType(EntityLevelSelector)[0].jumpToLevel('3_Tower_TopFloor');
                    }
                });
            }

            if (!ig.gui.element.action('getByName', 'LS_Button_Level_4')) {
                ig.gui.element.add({
                    name: 'LS_Button_Level_4',
                    group: 'Group_LevelSelector',
                    size: {x: 162, y: 167},
                    pos: {x: 746, y: 117},
                    alpha: 0,
                    state: {
                        normal: {image: this.btn_level4_default},
                        hover: {image: this.btn_level4_hover},
                        active: {image: this.btn_level4_hover}
                    },
                    click: function() {
                        ig.game.getEntitiesByType(EntityLevelSelector)[0].jumpToLevel('4_Tower_SecretFloor');
                    }
                });
            }

            if (!ig.gui.element.action('getByName', 'LS_Button_Close')) {
                ig.gui.element.add({
                    name: 'LS_Button_Close',
                    group: 'Group_LevelSelector',
                    size: { x: 36, y: 37 },
                    pos: { x: 928, y: 29 },
                    alpha: 0,
                    state: {
                        normal: { image: this.btn_close_default },
                        hover: { image: this.btn_close_hover }
                    },
                    click: function() {
                        ig.game.getEntitiesByType(EntityLevelSelector)[0].hide();
                    }
                });
            }
            ig.gui.element.action('hideGroup', 'Group_LevelSelector');
        },

        unlockLevels: function(level) {
            if (level > this.levelsUnlocked)
                this.levelsUnlocked = level;
        },


        checkUnlockedLevels: function() {
            var latestID = ig.game.eventController.latestEventID;

            if (latestID >= 13)
                this.unlockLevels(5);

            else if (latestID >= 12)
                this.unlockLevels(4);

            else if (latestID >= 10)
                this.unlockLevels(3);

            else if (latestID >= 7)
                this.unlockLevels(2);

            else
                this.unlockLevels(1);
        },

        jumpToLevel: function(level) {
            if (ig.game.levelController.currentLevel != level)
            {
                ig.game.toggleUIPlayerInteraction(true);
                ig.game.levelController.changeLevel(level);
            }
        },

        highlightCurrentLevel: function() {
            ig.gui.element.action('getByName', 'LS_Button_Level_1').toggle = false;
            ig.gui.element.action('getByName', 'LS_Button_Level_1').active = false;
            ig.gui.element.action('getByName', 'LS_Button_Level_2').toggle = false;
            ig.gui.element.action('getByName', 'LS_Button_Level_2').active = false;
            ig.gui.element.action('getByName', 'LS_Button_Level_3-1').toggle = false;
            ig.gui.element.action('getByName', 'LS_Button_Level_3-1').active = false;
            ig.gui.element.action('getByName', 'LS_Button_Level_3-2').toggle = false;
            ig.gui.element.action('getByName', 'LS_Button_Level_3-2').active = false;
            ig.gui.element.action('getByName', 'LS_Button_Level_4').toggle = false;
            ig.gui.element.action('getByName', 'LS_Button_Level_4').active = false;

            if (ig.game.levelController.currentLevel == '1_House_UpperFloor' || ig.game.levelController.currentLevel == '1_House_GroundFloor' ) {
                ig.gui.element.action('getByName', 'LS_Button_Level_1').toggle = true;
                ig.gui.element.action('getByName', 'LS_Button_Level_1').active = true;
            }
            else if (ig.game.levelController.currentLevel == '2_PoliceHQ_GroundFloor') {
                ig.gui.element.action('getByName', 'LS_Button_Level_2').toggle = true;
                ig.gui.element.action('getByName', 'LS_Button_Level_2').active = true;
            }
            else if (ig.game.levelController.currentLevel == '3_Tower_GroundFloor') {
                ig.gui.element.action('getByName', 'LS_Button_Level_3-1').toggle = true;
                ig.gui.element.action('getByName', 'LS_Button_Level_3-1').active = true;
            }
            else if (ig.game.levelController.currentLevel == '3_Tower_TopFloor') {
                ig.gui.element.action('getByName', 'LS_Button_Level_3-2').toggle = true;
                ig.gui.element.action('getByName', 'LS_Button_Level_3-2').active = true;
            }
            else if (ig.game.levelController.currentLevel == '3_Tower_SecretFloor') {
                ig.gui.element.action('getByName', 'LS_Button_Level_4').toggle = true;
                ig.gui.element.action('getByName', 'LS_Button_Level_4').active = true;
            }
        }
    });
});