ig.module(
    'game.entities.inGamePrompt'
)
.requires(
    'impact.entity'
)
.defines(function() {
    EntityInGamePrompt = ig.Entity.extend({
        zIndex: 9999,

        blackAnimBar: new ig.AnimationSheet('media/Achievements/ach_blackbar.png',1024,768),
        secretRoomsUnlockedPrompt: new ig.Image('media/UI/Prompts/Prompt_SecretRoomsUnlocked.png'),
        gameCompletePrompt: new ig.Image('media/UI/Prompts/Prompt_GameComplete.png'),
        prompt: this.secretRoomsUnlockedPrompt,

        font: new ig.Font('media/Fonts/viewer_content.png'),

        isScalingUp: false,
        isScalingDown: false,
        isDisplayed: false,
        isComplete: false,

        scale: 0,

        init: function() {
            this.animAchievementBlackBar = new ig.Animation( this.blackAnimBar, 1,[0], true );
        },

        update: function() {
            this.scalePrompt();

            if(this.isDisplayed && ig.input.pressed('leftclick'))
                this.hide();
        },

        draw: function() {
            if(this.isScalingUp || this.isScalingDown || this.isDisplayed) {
                this.animAchievementBlackBar.draw( 0 , 0);
                var ctx = ig.system.context;
                ctx.save();
                ctx.translate(ig.system.width/2 - (this.prompt.width/2) * this.scale, ig.system.height/2 - (this.prompt.height/2) * this.scale);
                ctx.scale(this.scale, this.scale);
                this.prompt.draw(0,0);
                this.font.draw("Click to continue", this.prompt.width/2, this.prompt.height, ig.Font.ALIGN.CENTER);
                ctx.restore();
           }
        },

        setPrompt: function(promptNumber) {
            if (promptNumber == 1)
                this.prompt = this.secretRoomsUnlockedPrompt;
            else if (promptNumber == 2)
                this.prompt = this.gameCompletePrompt;
        },

        display: function(promptNumber) {
            this.setPrompt(promptNumber);
            ig.game.inGameGUIController.toggleUI(false);
            this.isScalingUp = true;
        },

        hide: function() {
            this.isScalingDown = true;
        },

        hideComplete: function() {
            this.isComplete = true;
            ig.game.inGameGUIController.toggleUI(true);
        },

        scalePrompt: function() {
            if (this.isScalingUp) {
                if(this.scale < 0.9) {
                    this.scale += 0.1;
                }
                else {
                    this.scale = 1.0;
                    this.isScalingUp = false;
                    this.isDisplayed = true;
                }

                if( this.animAchievementBlackBar.alpha <= 0.9 )
                    this.animAchievementBlackBar.alpha += 0.1;
                else
                    this.animAchievementBlackBar.alpha = 1;
            }

            if (this.isScalingDown) {
                if(this.scale > 0.1) {
                    this.scale -= 0.1;
                }
                else {
                    this.scale = 0.0;
                    this.isScalingDown = false;
                    this.isDisplayed = false;
                    this.hideComplete();
                }

                if( this.animAchievementBlackBar.alpha >= 0.1 )
                {
                    this.animAchievementBlackBar.alpha -= 0.1;
                    this.reverseAnimationCycle.alpha -= 0.1;
                }
            }
        }
    });
});