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
        1:{name:'KNOW IT ALL',type:'Bronze',desc:'Solved all trivia questions'},
        2:{name:'FORENSIC MASTERY',type:'Silver',desc:'Solved 3 forensic questions'},
        3:{name:'JACK OF ALL TRADES',type:'Bronze',desc:'Solved questions of 4 different categories'},
        4:{name:'JACK OF ALL TRADES',type:'Bronze',desc:'Solved questions of 4 different categories'},
        5:{name:'JACK OF ALL TRADES',type:'Bronze',desc:'Solved questions of 4 different categories'},
        14:{name:'JACK OF ALL TRADES',type:'Bronze',desc:'Solved questions of 4 different categories'},
        17:{name:'ACH 17',type:'Bronze17',desc:'Solved 17 qs'},
        19:{name:'ACH 19',type:'Bronze19',desc:'Solved 19 qs'},
        18:{name:'ACH 18',type:'Bronze18',desc:'Solved 18 qs'},
        20:{name:'ACH 20',type:'Bronze20',desc:'Solved 20 qs'},
        21:{name:'ACH 21',type:'Bronze21',desc:'Solved 21 qs'},
        22:{name:'ACH 22',type:'Bronze22',desc:'Solved 22 qs'},
        23:{name:'ACH 23',type:'Bronze23',desc:'Solved 23 qs'},
        24:{name:'ACH 24',type:'Bronze24',desc:'Solved 24 qs'}
       },
       timer: new ig.Timer(0),
       probsSolved:null,
       achGained:null,
       storage: new ig.Storage(),
       achievementDisplay: null,
       teamAchievements: null,
       teamMembers:null,
       qsEntity:null,
       achEntity:null,
       isQsActive:false,
       isAchActive:false,

       init: function() {

       },

       update:function(){

           console.log("user name is" +ig.game.dataLoader.userID+ " team id is " +ig.game.teamID);
           //fetch the active status of questions interface and achievements interface
           this.qsEntity = ig.game.getEntitiesByType(EntityQuestions)[0];
           this.achEntity = ig.game.getEntitiesByType(EntityAchievements)[0];

           if(this.qsEntity != null){
               this.isQsActive = this.qsEntity.isActive;
           }
           if(this.achEntity != null){
               this.isAchActive = this.achEntity.isActive;
           }
          // console.log("ach active " +this.isAchActive);
          // console.log("qs active " +this.isQsActive);
           if (this.timer.delta() >= 0) {
               /*
               * This is where you can set any number of achievements dynamically which gets checked every 4 seconds in the game
               * Add as many processAchievements as you want. The first field is the achievement ID and from second parameter onwards you can set problems for your achievements
               * */
               this.processAchievements(1,1);
               this.processAchievements(2,3,4);
               /*
                * perform initial checks for question entity and achievements entity itself. We do not want to display achievements when question and achievement interface is active
                * */
               if(!this.isQsActive && !this.isAchActive)
                  this.checkAchievements();
               this.timer.set(4);
           }
           if(ig.input.pressed('up')){
               this.triggerAchievements(1,this.Achievements[1].type,this.Achievements[1].name,this.Achievements[1].desc,this.Achievements[1].isActive,100,525,400);
           }
       },

     /*
     *  We create an internal array for all our probList which will fetch us an achievement
      *  We then check if this internal array is subset of the problem solved array in the database
      *  If the subset conditions are met we update the achievement in the backend database for that team
     * */
      processAchievements:function(achID,probList){
        this.probsSolved = ig.game.dataLoader.getTeamData().problemsolved;
        var inputArray = [];
        for(var i = 1; i < arguments.length; i++){
            inputArray.push(arguments[i]);
        }
       // console.log("subset array contains problem " +inputArray);
        for(var j = 0; j < inputArray.length; j++){
              for(var k = 0; k < this.probsSolved.length; k++){
                  if(inputArray[j] == this.probsSolved[k]){
                    // console.log("subset array now contains problems " +inputArray[j]);
                      break;
                  }
              }
              if(k == this.probsSolved.length)
                  return;
         }
         ig.game.dataLoader.updateAchievements(achID);
      },

    /*
    * We get the entire team achievements information in an array first along with all the team members information stored in another array
    * We loop through all the team achievements and inner team members
    * We check if our current user is inside that team members list and perform all calculations for that user
    * We fetch the users aDisplayed array. This acts like a flag in the backend database. We only want to display achievements once so this checks whether the achievement is already displayed or not
    * If not displayed we trigger the achievement entity with all the information taken from the main Achievements defined at the very top of the class
    * Finally the most important step, we update the aDisplayed field with that particular achievement if it is not displayed and return
    * I used return because if there are two achievements lined up in queue in the for loops then both of them will be displayed at once. Instead just return so that if a 2nd achievement is lined up it will pop up in the next 4th second
    * If the aDisplayed field already contains the achievement in it, it simply does nothing!!!!!!!!
    * */
      checkAchievements:function(){
         this.teamAchievements = ig.game.dataLoader.getTeamData().achievements;
         this.teamMembers = ig.game.dataLoader.getTeamData().teammates;
         if(this.teamAchievements.length <= 0 )
            return;

         for(var i = 0; i < this.teamAchievements.length; i++){
            for(var j = 0; j < this.teamMembers.length; j++){
                if(ig.game.dataLoader.userID == this.teamMembers[j].username){
                  var achievementDisplayed = this.teamMembers[j].adisplayed;
                   if( achievementDisplayed.indexOf(this.teamAchievements[i]) < 0){
                    // console.log( this.teamAchievements[i] + " " +this.Achievements[this.teamAchievements[i]].type +" " +this.Achievements[this.teamAchievements[i]].name);
                     this.triggerAchievements(this.teamAchievements[i],this.Achievements[this.teamAchievements[i]].type,this.Achievements[this.teamAchievements[i]].name,this.Achievements[this.teamAchievements[i]].desc,100,525,400);
                     ig.game.dataLoader.achievementDisplay(this.teamAchievements[i]);
                     return;
                   }
                }
              }
            }
       },

       /*
       * Trigger the achievements which takes us to the Achievements Entity file
       * */
       triggerAchievements:function(achID,achType,achName,achDesc,TextWrapperWidth,TextWidth,TextHeight){
          if(ig.game.getEntitiesByType(EntityAchievements)[0]){
            ig.game.getEntitiesByType(EntityAchievements)[0].displayAchievement( achName,achType,achDesc,TextWrapperWidth,TextWidth,TextHeight );
          }
       }
});

});