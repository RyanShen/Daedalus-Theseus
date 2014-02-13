ig.module(
	'game.classes.eventController'
)
.requires(
	'impact.system',
    'game.classes.eventChain'
)
.defines(function(){ "use strict";


    ig.EventController = ig.Class.extend({

        eventIDs: {OpeningConversation:0,Kidnap:1},
        eventChain: null,

        fatherNPC: null,

        init: function() {
            this.eventChain = EventChain(this);
/*
            this.fatherNPC = ig.game.getEntitiesByType(EntityFatherNPC)[0];

            this.eventChain = EventChain(this)
                .then(this.fatherNPC.setDestination(500, 500))
                .waitUntil(this.fatherNPC.hasReachedDestination)
                .then(this.fatherNPC.setDestination(700, 500));
                */
        },

        update: function() {
            this.eventChain();
        },

        triggeredBy: function(entity, eventTrigger) {
            console.log('event controller triggered for some reason by ' + entity + " with evenTriggerID: " + eventTrigger.eventID);
        },

        startEvent: function (eventTrigger) {
            console.log('EVENT STARTING');

            switch(eventTrigger.eventID){
                case 0:
                    this.event_LevelOne_FatherMove(eventTrigger);
                    break;
                case 1:
                    this.event_LevelOne_Chat();
                    break;
                default :
                    console.log('Invalid eventID triggered.');
                    break;
            }
        },

        event_LevelOne_FatherMove: function (eventTrigger) {
            this.fatherNPC = ig.game.getEntitiesByType(EntityFatherNPC)[0];

            this.eventChain = EventChain(this)
                .then(function(){this.fatherNPC.setDestination(eventTrigger.pos.x, eventTrigger.pos.y)})
                .waitUntil(function (){return this.fatherNPC.hasReachedDestination})
                .then(function(){this.fatherNPC.setDestination(eventTrigger.pos.x +200, eventTrigger.pos.y)})
                .waitUntil(function (){return this.fatherNPC.hasReachedDestination})
                .repeat();

            //ig.game.player.setDestination(128, 128);
        },

        event_LevelOne_Chat: function () {
            var parameters = {text: 'I fucking pwn. period.', tracks: 'justin', margin: 0, lifeSpan: 5, shape: 'rounded', name: 'playerBubble', color:[255,255,255], opacity: 1};
            ig.game.spawnEntity(EntityChatbubble, 0, 0, parameters);
            console.log(ig.game.getEntitiesByType(EntityChatbubble)[0].text);
        }

    });

});
