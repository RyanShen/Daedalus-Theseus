/**
 * Created by Jimit on 3/14/14.
 */

ig.module(
    'game.classes.achievement'
)
.requires(
    'impact.system',
    'plugins.impact-storage'
)
.defines(function(){
ig.Achievement = ig.Class.extend({

       Achievements:{
        1:{id:1,name:'KNOW IT ALL',status:null,isActive:'key1',type:'Bronze',desc:'Solved all trivia questions'},
        2:{id:2,name:'FORENSIC MASTERY',status:null,isActive:'key2',type:'Silver',desc:'Solved 3 forensic questions'},
        3:{id:3,name:'JACK OF ALL TRADES',status:null,isActive:'key3',type:'Bronze',desc:'Solved questions of 4 different categories'}
       },
       timer: new ig.Timer(0),
       probsSolved:null,
       achGained:null,
       storage: new ig.Storage(),
       achievementDisplay: null,

       init: function() {
       },

       update:function(){
           //console.trace( ig.game.getEntitiesByType(EntityAchievements).length );
           if (this.timer.delta() >= 0) {
              this.checkAchievements();
              this.performAchievementChecks();
              this.timer.set(4);
           }

           if(ig.input.pressed('up')){
               this.triggerAchievements(1,this.Achievements[1].type,this.Achievements[1].name,this.Achievements[1].desc,this.Achievements[1].isActive,100,525,400);
           }
       },

       checkAchievements:function(){
           var achID;
           if (ig.game.teamID != -1) {
               this.achGained = this.getTeamData().achievements;
               //console.trace(this.getTeamData());
               if (this.achGained.length <= 0)
                   return;

               for (var i = 0; i < this.achGained.length; i++) {
                   achID = this.achGained[i];
                   if (this.achGained.indexOf(this.Achievements[achID].id) > -1 && this.storage.get(this.Achievements[achID].isActive) == null) {
                       this.triggerAchievements(this.Achievements[achID].id, this.Achievements[achID].type, this.Achievements[achID].name, this.Achievements[achID].desc, this.Achievements[achID].isActive, 100, 525, 400);
                   }
               }
           }
       },

       performAchievementChecks:function(){
           if (ig.game.teamID != -1) {
               this.probsSolved = this.getTeamData().problemsolved;
               this.setAchievements(1, "achkey1", "arrkey1", "setarray1", 1, 6, 10, 11);
               this.setAchievements(2, "achkey2", "arrkey2", "setarray2", 2, 7, 8);
               this.setAchievements(3, "achkey3", "arrkey3", "setarray3", 2, 3, 4, 5, 12);
           }
       },

       setAchievements:function(achID,achKey,arrKey,arrSetKey,probList){
        if(this.storage.get(achKey) == 1){
            return;
        }
        //console.log("arry key contents" +this.storage.get(arrKey) + " ach key: " +this.storage.get(achKey));
        if(this.storage.get(arrSetKey) == null){
            var inputArray = [];
            for(var i = 4; i < arguments.length; i++){
                inputArray.push(arguments[i]);
            }
            this.storage.set(arrKey,JSON.stringify(inputArray));
            console.log("first time array set key" +this.storage.get(arrKey));
            this.storage.set(arrSetKey,1);
        }else{
            var tempArray = JSON.parse(this.storage.get(arrKey));
            if(tempArray.length >= 1 && this.Achievements[achID].status == this.storage.get(achKey)){
                for(var j = 0; j < tempArray.length; j++){
                    for(var k = 0; k < this.probsSolved.length; k++){
                        if(tempArray[j] == this.probsSolved[k]){
                            tempArray.splice(j,1);
                            this.storage.set(arrKey,JSON.stringify(tempArray));
                            if(tempArray.length <= 0){
                                this.storage.set(achKey,1);
                                this.performAchievementsUpdate(achID);
                                return;
                            }
                        }
                    }
                }
            }
         }
      },

       performAchievementsUpdate:function(achID){
           this.updateAchievements(achID);
       },

       triggerAchievements:function(achID,achType,achName,achDesc,achKey,TextWrapperWidth,TextWidth,TextHeight){
           if(ig.game.getEntitiesByType(EntityAchievements)[0])
           {
               ig.game.getEntitiesByType(EntityAchievements)[0].displayAchievement( achName,achType,achDesc,TextWrapperWidth,TextWidth,TextHeight );
           }

        var self = this;
        setTimeout(function(){
            self.storage.set(self.Achievements[achID].isActive,1);
        },3900);
       },

       resetLocalStorageValues:function(){
            this.storage.clear();
       },

       getTeamData:function(){
        var requestURL = "http://128.2.239.135:3000/team?tid="+ig.game.teamID;
        var teamdata;
        $.ajax({
            type:'GET',
            url: requestURL,
            async: false,
            cache: false,
            dataType: 'json',
            success: function(data) {
                teamdata = data;
            },
            error: function(xhr, status, error) {
            }
        })
        return teamdata;
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