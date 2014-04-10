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
        1:{id:1,name:'First_Achievement',status:null,isActive:'key1'},
        2:{id:2,name:'Second_Achievement',status:null,isActive:'key2'},
        3:{id:3,name:'Third_Achievement',status:null,isActive:'key3'},
        4:{id:4,name:'Fourth_Achievement',status:null,isActive:'key4'}
       },
       timer: new ig.Timer(0),
       probsSolved:null,
       achGained:null,
       achievmentBox:null,
       storage: new ig.Storage(),

       init: function() {

       },

       update:function(){
           if (this.timer.delta() >= 0) {
              this.checkAchievements();
              this.performAchievementChecks();
              this.timer.set(4);
           }
       },

       checkAchievements:function(){
           this.achGained = this.getTeamData().achievements;

           if(this.achGained.length <= 0)
              return;

           else {
               if(this.achGained.indexOf(this.Achievements[1].id) > -1 && this.storage.get(this.Achievements[1].isActive) == null){
                   this.triggerAchievements(this.Achievements[1].id,this.Achievements[1].name,this.Achievements[1].isActive,100,525,400);
               }
               if(this.achGained.indexOf(this.Achievements[2].id) > -1 && this.storage.get(this.Achievements[2].isActive) == null){
                   this.triggerAchievements(this.Achievements[2].id,this.Achievements[2].name,this.Achievements[2].isActive,100,525,400);
               }
               if(this.achGained.indexOf(this.Achievements[3].id) > -1 && this.storage.get(this.Achievements[3].isActive) == null){
                   this.triggerAchievements(this.Achievements[3].id,this.Achievements[3].name,this.Achievements[3].isActive,100,525,400);
               }
               if(this.achGained.indexOf(this.Achievements[4].id) > -1 && this.storage.get(this.Achievements[4].isActive) == null){
                   this.triggerAchievements(this.Achievements[4].id,this.Achievements[4].name,this.Achievements[4].isActive,100,525,400);
               }
           }
       },

       performAchievementChecks:function(){
           this.probsSolved = this.getTeamData().problemsolved;
           this.spawnAchievements(1,"achkey1","arrkey1","setarray1",1);
           this.spawnAchievements(2,"achkey2","arrkey2","setarray2",2,3);
           this.spawnAchievements(3,"achkey3","arrkey3","setarray3",4);
           this.spawnAchievements(4,"achkey4","arrkey4","setarray4",5);
       },

       spawnAchievements:function(achID,achKey,arrKey,arrSetKey,probList){
        if(this.storage.get(achKey) == 1){
            return;
        }
        console.log("arry key contents" +this.storage.get(arrKey) + " ach key: " +this.storage.get(achKey));
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

       triggerAchievements:function(achID,achName,achKey,TextWrapperWidth,TextWidth,TextHeight){
            ig.game.spawnEntity(EntityAchievements);
            this.achievmentBox = ig.game.getEntitiesByType(EntityAchievements)[0];
            this.achievmentBox.setAchName(achName,TextWrapperWidth,TextWidth,TextHeight);
            this.achievmentBox.draw();
            var self = this;
            setTimeout(function(){
               console.log("reached here");
               self.storage.set(self.Achievements[achID].isActive,1);
            },3950);
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