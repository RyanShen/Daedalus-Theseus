/**
 * Created by Jimit on 3/14/14.
 */
ig.module(
        'game.entities.ach'
    )
    .requires(
        'impact.entity',
        'impact.system'
    )
    .defines( function(){

        EntityAch = ig.Entity.extend({

            font : new ig.Font('media/A.png'),
            animSheetAchievementUnlocked: new ig.AnimationSheet('media/Achievements/anim1.png',1024,300),
            probsSolved:null,
            spawnAch : false,
            animAchievementUnlocked:null,
            _context:null,

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
                    42,43,44,45,46,47,48,49,
                    50,51,52,53,54,55,56,57,
                    58,59,60,61,62,63,64,65,
                    66,67,68,69,70,71,72,73,
                    74,75,76,77,78,79,80,81,
                    82,83,84,85,86,87,88,89,
                    90,91,92,93,94,95,96,97
                ], true );
                this.animAchievementUnlocked.rewind();
                this.parent(x, y, settings);
            },
            update:function(){
                this.parent();
            },
            draw:function(){
                if(this.spawnAch){
                    this.animAchievementUnlocked.update();
                    this.animAchievementUnlocked.draw(0, 225 );
                    if(this.animAchievementUnlocked.loopCount >= 1){
                        this.spawnAch = false;
                    }
                }
                this.parent();
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