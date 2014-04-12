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

      //set of defined achievements. isActive is a field for their localStorage key. As we do want achievements to pop up every time we start the game, we define localStorage for each of them
       Achievements:{
        1:{id:1,name:'First_Achievement',status:null,isActive:'key1',type:'Gold'},
        2:{id:2,name:'Second_Achievement',status:null,isActive:'key2',type:'Silver'},
        3:{id:3,name:'Third_Achievement',status:null,isActive:'key3',type:'Bronze'},
        4:{id:4,name:'Fourth_Achievement',status:null,isActive:'key4',type:'Gold'}
       },
       timer: new ig.Timer(0),
       probsSolved:null,
       achGained:null,
       achievmentBox:null,
       storage: new ig.Storage(),

       init: function() {

       },

      //checks for achievements in the backend database every 5 seconds
       update:function(){
           if (this.timer.delta() >= 0) {
              this.checkAchievements();
              this.performAchievementChecks();
              this.timer.set(4);
           }
       },

      //Currently there are 4 achievements defined. We check for all the 4 achievements if they have been updated in the backend database.
      //If they are updated in the backend database, we update them and set the localStorage to 1 for each of them.
      checkAchievements:function(){
           var achID;
           this.achGained = this.getTeamData().achievements;

           if(this.achGained.length <= 0)
              return;

           for(var i = 0; i < this.achGained.length; i++){
              achID = this.achGained[i];
              if(this.achGained.indexOf(this.Achievements[achID].id) > -1 && this.storage.get(this.Achievements[achID].isActive) == null){
                   this.triggerAchievements(this.Achievements[achID].id,this.Achievements[achID].type,this.Achievements[achID].name,this.Achievements[achID].isActive,100,525,400);
              }
           }
       },

       //Check for each achievements by using the spawnAchievements function which is a dynamic tool to check if problems are solved from backend database
       performAchievementChecks:function(){
           this.probsSolved = this.getTeamData().problemsolved;
           this.setAchievements(1,"achkey1","arrkey1","setarray1",1);
           this.setAchievements(2,"achkey2","arrkey2","setarray2",2,3);
           this.setAchievements(3,"achkey3","arrkey3","setarray3",4);
           this.setAchievements(4,"achkey4","arrkey4","setarray4",5);
       },

       //we use a localStorage array for all the problems that are solved by a team. We pop them out when a question is solved. if the localStorage Array goes null, we update the
       //achievement in backend database
       setAchievements:function(achID,achKey,arrKey,arrSetKey,probList){
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

       triggerAchievements:function(achID,achType,achName,achKey,TextWrapperWidth,TextWidth,TextHeight){
            ig.game.spawnEntity(EntityAchievements);
            this.achievmentBox = ig.game.getEntitiesByType(EntityAchievements)[0];
            this.achievmentBox.setAchVariables(achName,achType,TextWrapperWidth,TextWidth,TextHeight);
            this.achievmentBox.draw();
            var self = this;
            setTimeout(function(){
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