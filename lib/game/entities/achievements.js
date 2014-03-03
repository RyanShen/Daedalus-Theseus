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

             imgfirstAch : new ig.Image('media/Achievements/achievement.png'),
             animSheetAchievementUnlocked: new ig.AnimationSheet('media/Achievements/ach_animationm.png',550,550),
             probsSolved:null,
             timer : new ig.Timer(),
             spawnAch : false,
             check : null,
             animAchievementUnlocked:null,

             Achievements:{
                1:{name:'First_Achievement',status:0}
             },

             init: function(x,y,settings){
                 this.animAchievementUnlocked = new ig.Animation( this.animSheetAchievementUnlocked, 0.04167, [
                     0,1,2,3,4,5,
                     6,7,8,9,10,11,
                     12,13,14,15,16,17,
                     18,19,20,21,22,23,24], true );
                 this.parent(x, y, settings);
             },
             update:function(){
               if(this.spawnAch){
                  this.hideAchievements('First_Achievement');
               }
               this.parent();
             },
             draw:function(){
                 this.parent();
             },
             checkAchievements:function(){
                probsSolved = this.getTeamProbSolved();
                var firstAchProbCount = this.firstAch();
                console.log(firstAchProbCount);
                if( this.Achievements[1].status == 0 && firstAchProbCount >= 3 ){
                    this.triggerAchievements(1);
                }/*else{
                   console.log("no achievements yet");
                }*/
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
                 }
                 return counter;
             },
             triggerAchievements:function(achID){
                 switch(achID){
                     case 1:
                           this.updateAchievements(achID);
                           this.Achievements[achID].status = 1;
                           this.spawnAch = true;
                           this.check = this.timer.delta();
                         //  this.animAchievementUnlocked.rewind();
                           //this.animAchievementUnlocked.update();
                          // this.animAchievementUnlocked.draw( 300, 250 );
                           ig.gui.element.add({
                              name: 'First_Achievement',
                              group: 'Group_Ach',
                              size: { x: 101, y: 150 },
                              pos:  { x: 300, y: 250 },
                              state: {
                                 normal: { image: this.imgfirstAch }
                              }
                           });
                     break;
                 }
             },
             hideAchievements:function(name){
                 if((this.check + 3.5 < this.timer.delta())){
                     ig.gui.element.action('hide',name);
                     this.spawnAch = false;
                     this.check = this.timer.delta();
                 }
             },
             setToastrOptions:function(){
                toastr.options = {
                    "closeButton": false,
                    "debug": false,
                    "positionClass": "toast-bottom-left",
                    "onclick": null,
                    "showDuration": "100",
                    "hideDuration": "500",
                    "timeOut": "2000",
                    "extendedTimeOut": "1000",
                    "showEasing": "swing",
                    "hideEasing": "linear",
                    "showMethod": "fadeIn",
                    "hideMethod": "fadeOut"
                }
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