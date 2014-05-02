ig.module(
    'game.entities.mainMenu'
)
.requires(
'impact.entity',
'game.classes.screen-fader'
)
.defines(function() {
    EntityMainMenu = ig.Entity.extend({

        playHover: new ig.Image('media/UI/StartMenu_btn_play_hover.png'),
        achvHover: new ig.Image('media/UI/StartMenu_btn_achievement_hover.png'),

        hidden: true,

        init: function() {

        },

        update: function() {
            if (this.hidden) {
                return;
            }
            ig.game.inGameGUIController.toggleUI(false);
            if (!ig.input.released('leftclick')) {
                return;
            }
            if (ig.input.mouse.x >= 353 && ig.input.mouse.x <= 698 &&
                ig.input.mouse.y >= 510 && ig.input.mouse.y <= 590) {
                if (ig.game.avatarID != 0 && ig.game.avatarID != 1) {
                    ig.game.levelController.loadCharacterSelect();
                    this.hide();
                }
                else {
                    ig.game.levelController.loadLevelfromSave();
                    this.hide();
                }

            }
            if (ig.input.mouse.x >= 353 && ig.input.mouse.x <= 698 &&
                ig.input.mouse.y >= 604 && ig.input.mouse.y <= 684) {
                ig.game.getEntitiesByType('EntityAchievementViewer')[0].display();
            }
        },

        draw: function() {
            if (this.hidden) {
                return;
            }
            if (ig.input.mouse.x >= 353 && ig.input.mouse.x <= 698 &&
                ig.input.mouse.y >= 510 && ig.input.mouse.y <= 590) {
                this.playHover.draw(352, 508);

            }
            if (ig.input.mouse.x >= 353 && ig.input.mouse.x <= 698 &&
                ig.input.mouse.y >= 604 && ig.input.mouse.y <= 684) {
                this.achvHover.draw(352, 602);
            }
        },

        show: function() {
            if (this.hidden) {
                this.hidden = false;
            }
        },

        hide: function() {
            if (!this.hidden) {
                this.hidden = true;
            }
        }

    });
});