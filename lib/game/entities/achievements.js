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
            animCurTrophy: null,
            blackAnimBar: new ig.AnimationSheet('media/Achievements/ach_blackbar.png',1024,768),
            goldTrophy: new ig.AnimationSheet('media/Achievements/gold.png',233,200),
            silverTrophy: new ig.AnimationSheet('media/Achievements/silver.png',233,200),
            bronzeTrophy: new ig.AnimationSheet('media/Achievements/bronze.png',233,200),
            fontText: new ig.Font('media/Fonts/achievement_text.png'),
            fontTitle: new ig.Font('media/Fonts/achievement_title.png'),
            probsSolved:null,
            animAchievementUnlocked:null,
            lastAnimationCycle:null,
            reverseAnimationCycle:null,
            _context:null,
            trophyTimer: 0,
            trophyX: 0,
            trophyY: 0,
            trophyAngle: 0,
            trophyScale: 1,
            achText:null,
            achTextWrapWidth:0,
            achTextWidth:0,
            achTextheight:0,
            achType:null,
            achDesc:null,
            playReverseAnim:false,
            stateAnimation:'hidden',//appearing, trophy, stay, disappearing, trophyanim, hidden
            zIndex: 5500,

            init: function(x,y,settings){
                this._context = ig.system.context;
                this.animAchievementBlackBar = new ig.Animation( this.blackAnimBar, 1,[0], true );
                this.animGoldTrophy = new ig.Animation( this.goldTrophy,1,[0],true);
                this.animSilverTrophy = new ig.Animation( this.silverTrophy,1,[0],true);
                this.animBronzeTrophy = new ig.Animation( this.bronzeTrophy,1,[0],true);
                this.lastAnimationCycle = new ig.Animation(this.animSheetAchievementUnlocked,1,[65],true );
                this.animAchievementUnlocked = new ig.Animation( this.animSheetAchievementUnlocked, 0.04167, [
                    0,1,2,3,4,5,
                    6,7,8,9,10,11,
                    12,13,14,15,16,17,
                    18,19,20,21,22,23,
                    24,25,26,27,28,29,
                    30,31,32,33,34,35,
                    36,37,38,39,40,41,
                    42,43,44,45,46,47,
                    48,49,50,51,52,53,
                    54,55,56,57,58,59,
                    60,61,62,63,64,65
                ], true );
                this.reverseAnimationCycle = new ig.Animation(this.animSheetAchievementUnlocked,1,[65],true );
                this.animAchievementUnlocked.rewind();
                this.achText = null;
                this.achTextWrapWidth = 100;
                this.achTextWidth = 525;
                this.achTextheight = 380;
                this.parent(x, y, settings);
            },

            update:function(){

                //console.trace( this.stateAnimation );
                switch( this.stateAnimation )
                {
                    case 'appearing':
                        if( this.animAchievementBlackBar.alpha <= 0.9 )
                            this.animAchievementBlackBar.alpha += 0.1;
                        else
                            this.animAchievementBlackBar.alpha = 1;

                        if( this.animAchievementUnlocked.loopCount >= 1 )
                            this.stateAnimation = 'trophy';
                        break;
                    case 'trophy':
                        if( this.animCurTrophy.alpha <= 0.94 )
                        {
                            this.animCurTrophy.alpha += 0.06;
                            this.trophyY += 2;
                        }
                        else
                        {
                            this.animCurTrophy.alpha = 1;
                            this.reverseAnimationCycle.alpha = 1;
                            this.stateAnimation = 'stay';
                        }
                        break;
                    case 'stay':
                        if( ig.input.pressed('space') )
                            this.stateAnimation = 'disappearing';
                        break;
                    case 'disappearing':
                        if( this.animAchievementBlackBar.alpha >= 0.1 )
                        {
                            this.animAchievementBlackBar.alpha -= 0.1;
                            this.reverseAnimationCycle.alpha -= 0.1;
                        }
                        else
                        {
                            this.animAchievementBlackBar.alpha = 0;
                            this.reverseAnimationCycle.alpha = 0;

                            ig.game.toggleSubsystemsInteraction(true);
                            this.stateAnimation = 'trophyanim';
                        }

                        if( this.trophyTimer >= 0 )
                        {
                            this.trophyTimer -= ig.system.tick;


                            this.trophyX += (560-this.trophyX)/10;
                            this.trophyY += (100-this.trophyY)/10;
                            if( this.trophyScale <= 0.25 )
                                this.trophyScale = 0.25;
                            else
                            {
                                this.trophyScale -= 0.05;
                                //this.trophyAngle += 0.262;
                            }

                            //this.animCurTrophy.alpha -= 0.001;
                        }
                        else
                        {
                            this.animCurTrophy.alpha = 0;
                            this.stateAnimation = 'hidden';
                        }

                        break;
                    case 'trophyanim':
                        if( this.trophyTimer >= 0 )
                        {
                            this.trophyTimer -= ig.system.tick;


                            this.trophyX += (560-this.trophyX)/10;
                            this.trophyY += (100-this.trophyY)/10;
                            if( this.trophyScale <= 0.25 )
                                this.trophyScale = 0.25;
                            else
                            {
                                this.trophyScale -= 0.05;
                                //this.trophyAngle += 0.262;
                            }

                            //this.animCurTrophy.alpha -= 0.001;
                        }
                        else
                        {
                            this.animCurTrophy.alpha = 0;
                            this.stateAnimation = 'hidden';
                        }
                        break;
                    case 'hidden':
                        break;
                    default:
                        break;
                }

                this.parent();
            },

            draw:function(){



                switch( this.stateAnimation )
                {
                    case 'appearing':
                        this.animAchievementBlackBar.draw( 0 , 0);
                        this.animAchievementUnlocked.update();
                        this.animAchievementUnlocked.draw(0, this.achTextheight-95);
                        break;
                    case 'trophy':
                        this.animAchievementBlackBar.draw( 0 , 0);
                        this.lastAnimationCycle.draw(0, this.achTextheight-95);
                        this.animCurTrophy.draw(402,this.trophyY);
                        this.fontTitle.draw(this.TextWrap(this.achText,this.achTextWrapWidth+100),this.achTextWidth,this.achTextheight,ig.Font.ALIGN.CENTER);
                        this.fontText.draw(this.TextWrap(this.achDesc,this.achTextWrapWidth+100),this.achTextWidth,this.achTextheight+38,ig.Font.ALIGN.CENTER);
                        this.fontText.draw(this.TextWrap("Press SPACE to continue",200),this.achTextWidth,630,ig.Font.ALIGN.CENTER);
                        break;
                    case 'stay':
                        this.animAchievementBlackBar.draw( 0 , 0);
                        this.lastAnimationCycle.draw(0, this.achTextheight-95);
                        this.animCurTrophy.draw(402,this.trophyY);
                        this.fontTitle.draw(this.TextWrap(this.achText,this.achTextWrapWidth+100),this.achTextWidth,this.achTextheight,ig.Font.ALIGN.CENTER);
                        this.fontText.draw(this.TextWrap(this.achDesc,this.achTextWrapWidth+100),this.achTextWidth,this.achTextheight+38,ig.Font.ALIGN.CENTER);
                        this.fontText.draw(this.TextWrap("Press SPACE to continue",200),this.achTextWidth,630,ig.Font.ALIGN.CENTER);
                        break;
                    case 'disappearing':
                        this.animAchievementBlackBar.draw( 0 , 0);
                        //this.reverseAnimationCycle.update();
                        this.reverseAnimationCycle.draw(0, this.achTextheight-95);
                        //this.animCurTrophy.draw(402,this.trophyY);
                        this.drawTrophy( this.trophyScale, this.trophyAngle, this.trophyX, this.trophyY );
                        break;
                    case 'trophyanim':
                        this.animAchievementBlackBar.draw( 0 , 0);
                        //this.reverseAnimationCycle.update();
                        this.reverseAnimationCycle.draw(0, this.achTextheight-95);
                        //this.animCurTrophy.draw(402,this.trophyY);
                        this.drawTrophy( this.trophyScale, this.trophyAngle, this.trophyX, this.trophyY );
                        break;
                    case 'hidden':
                        break;
                    default:
                        break;
                }

                this.parent();
            },

            drawTrophy: function( scale, angle, x, y ){
                if( scale == 1 )
                {
                    this.animCurTrophy.angle = angle;
                    this.animCurTrophy.draw( x, y );
                }
                else
                {
                    var ctx = ig.system.context;
                    ctx.save();
                    ctx.translate( ig.system.getDrawPos( this.pos.x - this.offset.x - ig.game.screen.x ),
                        ig.system.getDrawPos( this.pos.y - this.offset.y - ig.game.screen.y ) );
                    ctx.scale( scale, scale );
                    this.animCurTrophy.angle = angle;
                    this.animCurTrophy.draw( x, y );
                    ctx.restore();
                }
            },

            displayAchievement:function(achName,achType,achDesc,TextWrapWidth,TextWidth,TextHeight){
                this.achText = achName;
                //this.achTextWrapWidth = TextWrapWidth;
                //this.achTextWidth = TextWidth;
                //this.achTextheight = TextHeight;
                this.achType = achType;
                this.achDesc = achDesc;
                this.achDesc = 'be the world\'s first team to solve all trivia questions within 50 attempts';

                this.animAchievementUnlocked.rewind();
                this.animCurTrophy = this.getAchievementType( achType );

                this.animAchievementBlackBar.alpha = 0;
                this.animCurTrophy.alpha = 0;
                this.trophyScale = 1;
                this.trophyAngle = 0;
                this.trophyX = this.achTextWidth;
                this.trophyY = this.achTextheight-230;
                this.trophyTimer = 1.6;

                ig.game.toggleSubsystemsInteraction(false);

                this.stateAnimation = 'appearing';
            },

            getAchievementType:function(achType){

                var anim;
                switch (achType){
                    case 'Gold':
                        anim = this.animGoldTrophy;
                        break;
                    case 'Silver':
                        anim = this.animSilverTrophy;
                        break;
                    case 'Bronze':
                        anim = this.animBronzeTrophy;
                        break;
                    default:
                        anim = this.animBronzeTrophy;
                        break;
                }
                return anim;
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