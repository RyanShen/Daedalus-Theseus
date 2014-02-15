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

            switch(eventTrigger.eventID){
                case 0:
                    this.event_LevelOne_FatherKidnapped(eventTrigger);
                    break;
                case 1:
                    this.event_LevelOne_Chat();
                    break;
                default :
                    console.log('Invalid eventID triggered.');
                    break;
            }
        },

        event_LevelOne_FatherKidnapped: function (eventTrigger) {
            this.fatherNPC = ig.game.getEntitiesByType(EntityFatherNPC)[0];
            this.dialogBox = ig.game.getEntitiesByType(EntityDialogPlayer)[0];

            this.eventChain = EventChain(this)
                .then(function ()
                {
                    ig.game.player.setMovementLock(true);
                    var fatherWalkDestination = ig.game.getEntityByName('fatherWalkDestination_1');
                    this.fatherNPC.setDestination(fatherWalkDestination.pos.x, fatherWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return this.fatherNPC.hasReachedDestination;
                })
                .then(function ()
                {
                    var fatherWalkDestination = ig.game.getEntityByName('fatherWalkDestination_2');
                    this.fatherNPC.setDestination(fatherWalkDestination.pos.x, fatherWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return this.fatherNPC.hasReachedDestination;
                })
                .then(function ()
                {
                    var dialogSetJSON = [
                        { name: 'Father', side: 'right', mediaNum: 0, text: 'Wow son! Just completed another CTF?' },
                        { name: 'Justin', side: 'left' , mediaNum: 1, text: 'Yup! Piece of cake!' },
                        { name: 'Father', side: 'right', mediaNum: 0, text: 'With your computer skills and my experience in robotics, we could do something really awesome! hahaha!' },
                        { name: 'Father', side: 'right', mediaNum: 0, text: 'But son.. always remember this. You must only use your skills for the good of people. Promise me that.' },
                        { name: 'Father', side: 'right', mediaNum: 0, text: 'Here. Take this flash drive. I need you to look after this' },
                        { name: 'Justin', side: 'noside' , mediaNum: 1, text: '<Received Flash Drive from Dad.>' },
                        { name: 'Justin', side: 'left' , mediaNum: 1, text: 'What\'s up dad? Why are you talking weird?' },
                        { name: 'Father', side: 'right', mediaNum: 0, text: 'It contains very important information. You have to keep it safe. Promis-' },
                        { name: 'Father', side: 'noside', mediaNum: 0, text: '<Doorbell rings.>' },
                        { name: 'Father', side: 'right', mediaNum: 0, text: 'Oh no. It\'s them! Why are they here!?' },
                        { name: 'Justin', side: 'left' , mediaNum: 1, text: 'Dad.. Whats going on?' },
                        { name: 'Father', side: 'right', mediaNum: 0, text: 'Son. Stay here and be quiet. I\'ll answer the door.' },
                        { name: 'Justin', side: 'left' , mediaNum: 1, text: 'Dad!' }
                    ];
                    this.dialogBox.playDialogSet( dialogSetJSON );
                })
                .waitUntil(function ()
                {
                    return !this.dialogBox.isPlaying;
                })
                .then(function ()
                {
                    var fatherWalkDestination = ig.game.getEntityByName('fatherWalkDestination_3');
                    this.fatherNPC.setDestination(fatherWalkDestination.pos.x, fatherWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return this.fatherNPC.hasReachedDestination;
                })
                .then(function ()
                {
                    var fatherWalkDestination = ig.game.getEntityByName('fatherWalkDestination_4');
                    this.fatherNPC.setDestination(fatherWalkDestination.pos.x, fatherWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return this.fatherNPC.hasReachedDestination;
                })
                .wait(1)
                .then(function ()
                {
                    this.fatherNPC.kill();

                    var dialogSetJSON = [
                        { name: 'Father', side: 'noside', mediaNum: 0, text: 'HEY!' },
                        { name: 'Justin', side: 'left' , mediaNum: 1, text: 'Huh? Dad?' },
                        { name: 'Father', side: 'noside', mediaNum: 0, text: 'WHAT ARE YOU GUYS DOING HERE!?' },
                        { name: 'Father', side: 'noside', mediaNum: 0, text: 'NO WAIT! WHERE ARE YOU TAKING ME!' },
                        { name: 'Father', side: 'noside', mediaNum: 0, text: 'LET GO!' },
                        { name: 'Justin', side: 'left' , mediaNum: 1, text: 'Oh my god. Dad!' },
                        { name: 'Justin', side: 'left' , mediaNum: 1, text: 'I have to head downstairs now!' }
                    ];
                    this.dialogBox.playDialogSet( dialogSetJSON );
                    ig.game.screenShaker.applyImpulse(600, 600);
                })
                .waitUntil(function ()
                {
                    return !this.dialogBox.isPlaying;
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
