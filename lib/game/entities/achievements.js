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
            font: new ig.Font('media/Fonts/question_text.png'),
            probsSolved:null,
            spawnAch : false,
            animAchievementUnlocked:null,
            _context:null,
            achText:null,
            achTextWrapWidth:0,
            achTextWidth:0,
            achTextheight:0,

            init: function(x,y,settings){
                this._context = ig.system.context;
                this.spawnAch = true;
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
                this.animAchievementUnlocked.rewind();
                this.achText = null;
                this.achTextWrapWidth = 0;
                this.achTextWidth = 0;
                this.achTextheight = 0;
                this.parent(x, y, settings);
            },

            update:function(){
                this.parent();
            },

            draw:function(){
                if(this.spawnAch){
                    this.animAchievementUnlocked.update();
                    this.animAchievementUnlocked.draw(0, 225 );
                    this.font.draw(this.TextWrap(this.achText,this.achTextWrapWidth),this.achTextWidth,this.achTextheight,ig.Font.ALIGN.CENTER);
                    if(this.animAchievementUnlocked.loopCount >= 1){
                        this.spawnAch = false;
                        this.kill();
                     }
                }
                this.parent();
            },

            setAchName:function(achName,TextWrapWidth,TextWidth,TextHeight){
                this.achText = achName;
                this.achTextWrapWidth = TextWrapWidth;
                this.achTextWidth = TextWidth;
                this.achTextheight = TextHeight;
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