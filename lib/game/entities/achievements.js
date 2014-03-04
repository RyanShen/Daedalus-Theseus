/**
 * Created by jbhalani on 2/28/14.
 */

/**
 * Created by jbhalani on 2/28/14.
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

             font : new ig.Font('media/A.png'),
             animSheetAchievementUnlocked: new ig.AnimationSheet('media/Achievements/anim1.png',1024,300),
             probsSolved:null,
             timer : new ig.Timer(),
             spawnAch : false,
             check : null,
             animAchievementUnlocked:null,
             achText:null,
            _context:null,
             Achievements:{
                1:{name:'First_Achievement',status:0}
             },
             probHide:false,
            timer: new ig.Timer(),


             init: function(x,y,settings){
                 this._context = ig.system.context;
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
                 this.parent(x, y, settings);
                 this.timer.set(5);
             },
             update:function(){
               this.parent();
                 if (this.timer.delta() >= 1) {
                     this.checkAchievements();
                     this.timer.set(5);
                 }
             },
             draw:function(){
                 if(this.spawnAch && this.probHide){
                     this.animAchievementUnlocked.update();
                     this.animAchievementUnlocked.draw(0, 225 );
                    this.hideAch();
                 }
                 this.parent();
             },
             checkAchievements:function(){
                probsSolved = this.getTeamProbSolved();
                var firstAchProbCount = this.firstAch();
                console.log(firstAchProbCount);
                if( this.Achievements[1].status == 0 && firstAchProbCount >= 3){
                    this.triggerAchievements(1);
                }
             },
             setProbHide:function(){
               this.probHide = true;
             },
             firstAch:function(){
                 var counter = 0;
                 for(var i = 0; i < probsSolved.length; i++){
                     if(probsSolved[i] == 1){
                         counter++;
                     }else if(probsSolved[i] == 2){
                         counter++;
                     }
                     else if(probsSolved[i] == 3){
                         counter++;
                     }
                     else if(probsSolved[i] == 4){
                         counter++;
                     }
                     else if(probsSolved[i] == 5){
                         counter++;
                     }
                 }
                 return counter;
             },
             triggerAchievements:function(achID){
                 switch(achID){
                     case 1:
                           this.updateAchievements(achID);
                           this.Achievements[achID].status = 1;
                           this.animAchievementUnlocked.rewind();
                           this.spawnAch = true;
                           this.check = this.timer.delta();
                     break;
                 }
             },

             hideAch:function(){
                if((this.check + 10.0 < this.timer.delta())){
                    this.spawnAch = false;
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

             },
             getTeamProbSolved:function(){
                var requestURL = "http://128.2.238.182:3000/team?tid=1";
                var teamProbSolved;
                $.ajax({
                    type:'GET',
                    url: requestURL,
                    async: false,
                    cache: false,
                    dataType: 'json',
                    success: function(data) {
                        teamProbSolved = data.problemsolved;
                    },
                    error: function(xhr, status, error) {
                    }
                })
                return teamProbSolved;
            },
            updateAchievements:function(achID){
                var requestURL = "http://128.2.238.182:3000/achievementunlocked?aid=".concat(achID) + "&tid=1";
                var successMessage;
                $.ajax({
                    type:'GET',
                    url: requestURL,
                    async: false,
                    cache: false,
                    dataType: 'json',
                    success: function(data) {
                        successMessage = data;
                    },
                    error: function(xhr, status, error) {
                    }
                })
                return successMessage;
            }
        });
    });