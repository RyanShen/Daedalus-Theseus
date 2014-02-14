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
        dialogBox: null,

        init: function() {
            this.eventChain = EventChain(this);
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
            this.dialogBox = ig.game.getEntitiesByType(EntityDialogPlayer)[0];

            this.eventChain = EventChain(this)
                .then(function ()
                {
                    ig.game.player.setMovementLock(true);
                    this.fatherNPC.setDestination(eventTrigger.pos.x, eventTrigger.pos.y);
                })
                .waitUntil(function ()
                {
                    return this.fatherNPC.hasReachedDestination;
                })
                .then(function ()
                {
                    var dialogSetJSON = [
                        { name: 'Father', side: 'right', mediaNum: 0, text: 'Wow son! Just completed another CTF?' },
                        { name: 'Father', side: 'right', mediaNum: 0, text: 'With your computer skills and my experience in robotics, we could do something really awesome! hahaha!' },
                        { name: 'Father', side: 'right', mediaNum: 0, text: 'But son.. always remember this. You must only use your skills for the good of people. Promise me that.' },
                        { name: 'Father', side: 'right', mediaNum: 0, text: 'Here. Take this flash drive. I need you to look after this' },
                        { name: 'Justin', side: 'noside' , mediaNum: 1, text: '<Received Flash Drive from Dad>' },
                        { name: 'Father', side: 'right', mediaNum: 0, text: 'It contains very important information. You have to keep it safe. Promis-' },
                        { name: 'Father', side: 'noside', mediaNum: 0, text: '<Doorbell rings>' },
                        { name: 'Father', side: 'right', mediaNum: 0, text: 'Oh no. It\'s them! Why are they here!?' },
                        { name: 'Father', side: 'right', mediaNum: 0, text: 'Son. Stay here and be quiet. I\'ll answer the door.' },
                    ];
                    this.dialogBox.playDialogSet( dialogSetJSON );
                })
                .waitUntil(function ()
                {
                    return !this.dialogBox.isPlaying;
                })
                .then(function ()
                {
                    this.fatherNPC.setDestination(eventTrigger.pos.x +200, eventTrigger.pos.y);
                })
                .waitUntil(function ()
                {
                    return this.fatherNPC.hasReachedDestination;
                })
                .then(function ()
                {
                    ig.game.player.setMovementLock(false);
                });

            //ig.game.player.setDestination(128, 128);
        },

        event_LevelOne_Chat: function () {
            var parameters = {text: 'I fucking pwn. period.', tracks: 'justin', margin: 0, lifeSpan: 5, shape: 'rounded', name: 'playerBubble', color:[255,255,255], opacity: 1};
            ig.game.spawnEntity(EntityChatbubble, 0, 0, parameters);
            console.log(ig.game.getEntitiesByType(EntityChatbubble)[0].text);
        }

    });

});
