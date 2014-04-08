ig.module(
    'game.entities.characterSelect'
)
.requires(
    'impact.entity'

)
.defines(function() {

        EntityCharacterSelect = ig.Entity.extend({

        zIndex: 9999,
        boySelected: false,
        girlSelected: false,
        errorMessage: null,
        errorMessageTimer: new ig.Timer(),

        boyPortrait: new ig.Image('media/Characters/BoyPortrait.png'),
        boyPortraitHover: new ig.Image('media/Characters/BoyPortraitHover.png'),
        boyPortraitActive: new ig.Image('media/Characters/BoyPortraitActive.png'),
        girlPortrait: new ig.Image('media/Characters/GirlPortrait.png'),
        girlPortraitHover: new ig.Image('media/Characters/GirlPortraitHover.png'),
        girlPortraitActive: new ig.Image('media/Characters/GirlPortraitActive.png'),
        confirm: new ig.Image('media/UI/Confirm.png'),
        confirmHover: new ig.Image('media/UI/ConfirmHover.png'),

        font: new ig.Font( 'media/Fonts/blue26.png' ),

        init: function(x, y, settings) {
            this.boyAvatarButton();
            this.girlAvatartButton();
            this.selectConfirmButton();
            ig.gui.element.action('showGroup', 'Group_CharacterSelection');
        },

        update: function() {
            if (this.errorMessageTimer.delta() > 0) {
                this.errorMessage = null;
            }
        },

        draw: function() {
            if (this.errorMessage != null)
                this.font.draw(this.errorMessage, 500, 600, ig.Font.ALIGN.CENTER);
        },

        boyAvatarButton: function() {
            ig.gui.element.add({
                name: 'Button_Boy',
                group: 'Group_CharacterSelection',
                size: {x: 250, y: 350},
                pos: {x: 200, y: 100},
                state: {
                    normal: { image: this.boyPortrait },
                    hover:  { image: this.boyPortraitHover },
                    active: { image: this.boyPortraitActive }
                },
                click: function() {
                    ig.game.getEntitiesByType(EntityCharacterSelect)[0].boyAvatarSelect();
                    ig.gui.element.action('select', 'Button_Boy');
                    ig.gui.element.action('deSelect', 'Button_Girl');
                }
            })
        },

        girlAvatartButton: function() {
            ig.gui.element.add({
                name: 'Button_Girl',
                group: 'Group_CharacterSelection',
                size: {x: 250, y: 350},
                pos: {x: 550, y: 100},
                state: {
                    normal: { image: this.girlPortrait },
                    hover:  { image: this.girlPortraitHover },
                    active: { image: this.girlPortraitActive }
                },
                click: function() {
                    ig.game.getEntitiesByType(EntityCharacterSelect)[0].girlAvatarSelect();
                    ig.gui.element.action('select', 'Button_Girl');
                    ig.gui.element.action('deSelect', 'Button_Boy');
                }
            })
        },

        selectConfirmButton: function() {
            ig.gui.element.add({
                name: 'Button_Confirm',
                group: 'Group_CharacterSelection',
                size: {x: 150, y: 100},
                pos: {x: 400, y: 500},
                state: {
                    normal: { image: this.confirm },
                    hover:  { image: this.confirmHover }
                },
                click: function() {
                    ig.game.getEntitiesByType(EntityCharacterSelect)[0].submit();
                }
            })
        },

        boyAvatarSelect: function() {
            this.boySelected = true;
            this.girlSelected = false;
        },

        girlAvatarSelect: function() {
            this.girlSelected = true;
            this.boySelected = false;
        },

        submit: function() {
            if (this.boySelected && this.girlSelected) {
                this.displayMessage("Error: Select both characters");
            }
            else if (this.girlSelected || this.boySelected) {
                if (this.girlSelected)
                    ig.game.avatarID = 1;
                else
                    ig.game.avatarID = 0;
                ig.gui.element.action('hideGroup', 'Group_CharacterSelection');
                ig.game.levelController.loadNewGameLevel();
            }
            else
                this.displayMessage("Please select a character");
        },

        displayMessage: function(s) {
            this.errorMessage = s;
            this.errorMessageTimer.set(2);

        }


    });
});