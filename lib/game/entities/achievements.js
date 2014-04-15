/**
 * Created by Jimit on 3/14/14.
 */
ig.module(
        'game.entities.achievements'
    )
    .requires(
        'impact.entity',
        'impact.system'
    )
    .defines( function(){

        EntityAchievements = ig.Entity.extend({

            animSheetAchievementUnlocked: new ig.AnimationSheet('media/Achievements/ach_anim.png',1024,300),
            blackAnimBar: new ig.AnimationSheet('media/Achievements/ach_blackbar.png',1024,768),
            goldTrophy: new ig.AnimationSheet('media/Achievements/gold.png',233,200),
            silverTrophy: new ig.AnimationSheet('media/Achievements/silver.png',233,200),
            bronzeTrophy: new ig.AnimationSheet('media/Achievements/bronze.png',233,200),
            font: new ig.Font('media/Fonts/question_text.png'),
            probsSolved:null,
            animAchievementUnlocked:null,
            lastAnimationCycle:null,
            reverseAnimationCycle:null,
            _context:null,
            achText:null,
            achTextWrapWidth:0,
            achTextWidth:0,
            achTextheight:0,
            achType:null,
            achDesc:null,
            playReverseAnim:false,
            zIndex: 2500,

            init: function(x,y,settings){
                this._context = ig.system.context;
                this.animAchievementBlackBar = new ig.Animation( this.blackAnimBar, 1,[0], true );
                this.animGoldTrophy = new ig.Animation( this.goldTrophy,1,[0],true);
                this.animSilverTrophy = new ig.Animation( this.silverTrophy,1,[0],true);
                this.animBronzeTrophy = new ig.Animation( this.bronzeTrophy,1,[0],true);
                this.lastAnimationCycle = new ig.Animation(this.animSheetAchievementUnlocked,1,[46],true );
                this.animAchievementUnlocked = new ig.Animation( this.animSheetAchievementUnlocked, 0.04167, [
                    0,1,2,3,4,5,
                    6,7,8,9,10,11,
                    12,13,14,15,16,17,
                    18,19,20,21,22,23,24,25,
                    26,27,28,29,30,31,32,33,
                    34,35,36,37,38,39,40,41,
                    42,43,44,45,46,47,48,49,50,
                    51,52,53,54,55,56,57,58,59,60,
                    61,62,63,64,65,66,67,68
                ], true );
                this.reverseAnimationCycle = new ig.Animation( this.animSheetAchievementUnlocked, 0.04167, [
                    49,48,47,46,45,44,43,42,41,
                    40,39,38,37,36,35,34,33,32,
                    31,30,29,28,27,26,25,24,23,
                    22,21,20,19,18,17,16,15,14,
                    13,12,11,10,9,8,7,6,5,4,3,2,1,0
                ], true );
                this.animAchievementUnlocked.rewind();
                this.achText = null;
                this.achTextWrapWidth = 0;
                this.achTextWidth = 0;
                this.achTextheight = 0;
                this.parent(x, y, settings);
            },

            update:function(){
                if(this.playReverseAnim){
                    this.reverseAnimationCycle.rewind();
                }
                this.parent();
            },

            draw:function(){
                if (ig.input.pressed('space')) {
                    this.playReverseAnim = true;
                }

                if(this.playReverseAnim){
                    this.animAchievementBlackBar.draw( 0 , 0);
                    this.reverseAnimationCycle.update();
                    this.reverseAnimationCycle.draw(0, 225);

                    if(this.reverseAnimationCycle.loopCount >= 1){
                        ig.game.toggleSubsystemsInteraction(true);
                        this.kill();
                    }
                }

                else {
                    this.animAchievementBlackBar.draw( 0 , 0);
                    this.animAchievementUnlocked.update();
                    this.animAchievementUnlocked.draw(0, 225);

                    if(this.animAchievementUnlocked.loopCount >= 1){
                        this.lastAnimationCycle.draw(0, 225);
                        this.drawAchievementType(this.achType);
                        this.font.draw(this.TextWrap(this.achText,this.achTextWrapWidth+100),this.achTextWidth,this.achTextheight,ig.Font.ALIGN.CENTER);
                        this.font.draw(this.TextWrap(this.achDesc,this.achTextWrapWidth+100),this.achTextWidth,this.achTextheight+30,ig.Font.ALIGN.CENTER);
                        this.font.draw(this.TextWrap("Press SPACE to continue",200),525,525,ig.Font.ALIGN.CENTER);
                    }
                }
                this.parent();
            },

            setAchVariables:function(achName,achType,achDesc,TextWrapWidth,TextWidth,TextHeight){
                this.achText = achName;
                this.achTextWrapWidth = TextWrapWidth;
                this.achTextWidth = TextWidth;
                this.achTextheight = TextHeight;
                this.achType = achType;
                this.achDesc = achDesc;
            },

            drawAchievementType:function(achType){
                switch (achType){
                    case 'Gold':
                        this.animGoldTrophy.draw(525,25);
                        break;
                    case 'Silver':
                        this.animSilverTrophy.draw(450,75);
                        break;
                    case 'Bronze':
                        this.animBronzeTrophy.draw(400,75);
                        break;
                    default:
                        break;
                }
            },

            TextWrap: function( text, width ){
                if( text == null || text == '' || text == undefined )
                    return '';

                var words = text.split( ' ' );
                var index = 0;
                var newText = '';
                var lineWidth = 0;

                while( index < words.length )
                {
                    lineWidth += this._context.measureText( words[index] + ' ').width;
                    if( lineWidth >= width )
                    {
                        newText += '\n';
                        newText += words[index];
                        newText += ' ';
                        lineWidth = 0;
                    }
                    else
                    {
                        newText += words[index];
                        newText += ' ';
                    }
                    index++;
                }
                return newText;
            }

        });
    });