ig.module(
	'game.classes.EventController'
)
.requires(
	'impact.system'
)
.defines(function(){ "use strict";


    ig.EventController = ig.Class.extend({

        init: function() {
            ig.EventController.Event = { OpeningConversation:0,Kidnap:1};
        },

        triggeredBy: function(entity, eventTrigger) {
            console.log('HI');
        },

        startEvent: function (eventID) {
            console.log('EVENT STARTING');

            switch(eventID){
                case 0:
                    this.event_LevelOne_FatherMove();
                    break;
                case 1:
                    this.event_LevelOne_Chat();
                    break;
                default :
                    console.log('Invalid eventID triggered.');
                    break;
            }
        },

        event_LevelOne_FatherMove: function () {
            var father  = ig.game.getEntitiesByType(EntityFather)[0];
            father.moveMe();
        },

        event_LevelOne_Chat: function () {
            var parameters = {text: 'I fucking pwn. period.', tracks: 'justin', margin: 0, lifeSpan: 5, shape: 'rounded', name: 'playerBubble', color:[255,255,255], opacity: 1};
            ig.game.spawnEntity(EntityChatbubble, 0, 0, parameters);
            console.log(ig.game.getEntitiesByType(EntityChatbubble)[0].text);
        }
    });

});
