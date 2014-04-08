/**
 * Created by Jimit on 3/14/14.
 */

ig.module(
    'game.classes.achievement'
)
.requires(
    'impact.system'
)
.defines(function(){
ig.Achievement = ig.Class.extend({

       Achievements:{
               1:{name:'First_Achievement',status:1}
       },
       timer: new ig.Timer(),
       probsSolved:null,
       achievmentBox:null,

       init: function() {
       },

       update:function(){
          if (this.timer.delta() >= 1) {
                //console.log("inside the timer " +this.Achievements[1].status);
                this.checkAchievements();
                this.timer.set(5);
          }
       },
       checkAchievements:function(){
           this.probsSolved = this.getTeamProbSolved();
           if(  this.Achievements[1].status == 1 && this.probsSolved.length >= 3 ){
              this.triggerAchievements(1);
           }
       },

       triggerAchievements:function(achID){
        switch(achID){
            case 1:
                this.Achievements[achID].status =  this.updateAchievements(achID).success;
                ig.game.spawnEntity(EntityAch);
                this.achievmentBox = ig.game.getEntitiesByType(EntityAch)[0];
                this.achievmentBox.draw();
                break;
        }
       },

       getTeamProbSolved:function(){
        var requestURL = "http://128.2.239.135:3000/team?tid="+ig.game.teamID;
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
        var requestURL = "http://128.2.239.135:3000/achievementunlocked?aid=".concat(achID) + "&tid="+ig.game.teamID;
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