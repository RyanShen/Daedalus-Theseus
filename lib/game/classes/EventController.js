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
        latestEventID: 0,
        eventChain: null,

        camera:null,
        dialogBox: null,
        fatherNPC: null,

        init: function() {
            this.eventChain = EventChain(this);
        },

        update: function() {
            this.eventChain();
        },

        triggeredBy: function(entity, eventTrigger) {
            console.log('event controller triggered for some reason by ' + entity + " with evenTriggerID: " + eventTrigger.eventID);
        },

        loadEventsFromSave: function (eventID) {
            this.latestEventID = eventID;
        },

        startEvent: function (eventTrigger) {

            switch(eventTrigger.eventID){
                case 1:
                    this.event_LevelOne_FatherGetsKidnapped(eventTrigger);
                    break;
                case 2:
                    this.event_LevelOne_PlayerLooksForFather(eventTrigger);
                    break;
                case 3:
                    this.event_LevelOne_PlayerDecidesToInvestigateFlashDrive(eventTrigger);
                    break;
                case 4:
                    this.event_LevelOne_PlayerAccessesFlashDrive(eventTrigger);
                    break;
                case 5:
                    this.event_LevelOne_PoliceArrives(eventTrigger);
                    break;
                default :
                    console.log('Invalid eventID triggered.');
                    break;
            }
            this.latestEventID = eventTrigger.eventID;
        },

        startSubEvent: function (eventTrigger) {
/*
            switch(eventTrigger.eventID){
                case 1:
                    this.event_LevelOne_FatherGetsKidnapped(eventTrigger);
                    break;
                case 2:
                    this.event_LevelOne_PlayerLooksForFather(eventTrigger);
                    break;
                case 3:
                    this.event_LevelOne_PlayerDecidesToInvestigateFlashDrive(eventTrigger);
                    break;
                default :
                    console.log('Invalid eventID triggered.');
                    break;
            }
*/
        },

        event_LevelOne_FatherGetsKidnapped: function (eventTrigger) {
            this.fatherNPC = ig.game.getEntitiesByType(EntityFatherNPC)[0];
            this.dialogBox = ig.game.getEntitiesByType(EntityDialogPlayer)[0];
            this.camera = ig.game.camera;

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
                        { name: 'Father', side: 'left', mediaNum: 1, autoprogress: 0, text: 'Wow son! Just completed another CTF?' },
                        { name: 'Justin', side: 'right' , mediaNum: 0, autoprogress: 0, text: 'Yup! Piece of cake!' },
                        { name: 'Father', side: 'left', mediaNum: 1, autoprogress: 0, text: 'With your computer skills and my experience in robotics, we could do something really awesome! hahaha!' },
                        { name: 'Father', side: 'left', mediaNum: 1, autoprogress: 0, text: 'But son.. always remember this. You must only use your skills for the good of people. Promise me that.' },
                        { name: 'Father', side: 'left', mediaNum: 1, autoprogress: 0, text: 'Here. Take this flash drive. I need you to look after this.' },
                        { name: 'Justin', side: 'noside' , mediaNum: 0, autoprogress: 0, text: '<Received Flash Drive from Dad.>' },
                        { name: 'Justin', side: 'right' , mediaNum: 0, autoprogress: 0, text: 'What\'s up dad? Why are you talking weird?' },
                        { name: 'Father', side: 'left', mediaNum: 1, autoprogress: 0, text: 'It contains very important information. You have to keep it safe. Promis-' },
                        { name: 'Father', side: 'noside', mediaNum: 1, autoprogress: 0, text: '<Doorbell rings.>' },
                        { name: 'Father', side: 'left', mediaNum: 1, autoprogress: 0, text: 'Oh no. It\'s them! Why are they here!?' },
                        { name: 'Justin', side: 'right' , mediaNum: 0, autoprogress: 0, text: 'Dad.. Whats going on?' },
                        { name: 'Father', side: 'left', mediaNum: 1, autoprogress: 0, text: 'Son. Stay here and be quiet. I\'ll answer the door.' },
                        { name: 'Justin', side: 'right' , mediaNum: 0, autoprogress: 0, text: 'Dad!' }
                    ];
                    this.dialogBox.playDialogSet(dialogSetJSON);
                })
                .waitUntil(function ()
                {
                    return !this.dialogBox.isPlaying;
                })
                .then(function ()
                {
                    this.camera.entityToFollow = this.fatherNPC;
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
                .wait(0.1)
                .then(function ()
                {
                    this.camera.entityToFollow = ig.game.player;
                    this.fatherNPC.kill();
                })
                .wait(2)
                .then(function ()
                {
                    var dialogSetJSON = [
                        { name: 'Father', side: 'noside', mediaNum: 0, text: 'HEY!' },
                        { name: 'Justin', side: 'left' , mediaNum: 1, text: 'Huh? Dad?' },
                        { name: 'Father', side: 'noside', mediaNum: 0, text: 'WHAT ARE YOU GUYS DOING HERE!?' },
                        { name: 'Father', side: 'noside', mediaNum: 0, text: 'NO WAIT! WHERE ARE YOU TAKING ME!' },
                        { name: 'Father', side: 'noside', mediaNum: 0, text: 'LET GO!' },
                        { name: 'Justin', side: 'left' , mediaNum: 1, text: 'Oh my god. Dad!' },
                        { name: 'Justin', side: 'left' , mediaNum: 1, text: 'I have to find out what\'s going on downstairs!' }
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
        },

        event_LevelOne_PlayerLooksForFather: function () {
            this.dialogBox = ig.game.getEntitiesByType(EntityDialogPlayer)[0];
            this.camera = ig.game.camera;

            this.eventChain = EventChain(this)
                .then(function ()
                {
                    ig.game.player.setMovementLock(true);
                    var dialogSetJSON = [
                        { name: 'Justin', side: 'left' , mediaNum: 1, text: 'It sounded like it came from the front door. I should go there.' }
                    ];
                    this.dialogBox.playDialogSet(dialogSetJSON);
                })
                .waitUntil(function ()
                {
                    return !this.dialogBox.isPlaying;
                })
                .then(function ()
                {
                    ig.game.player.setMovementLock(false);
                });
        },

        event_LevelOne_PlayerDecidesToInvestigateFlashDrive: function () {
            this.dialogBox = ig.game.getEntitiesByType(EntityDialogPlayer)[0];
            this.camera = ig.game.camera;

            this.eventChain = EventChain(this)
                .then(function ()
                {
                    ig.game.player.setMovementLock(true);
                    var dialogSetJSON = [
                        { name: 'Justin', side: 'left' , mediaNum: 1, text: 'Dad\'s not here! What\'s going on?' },
                        { name: 'Justin', side: 'left' , mediaNum: 1, text: 'Who were those people?' },
                        { name: 'Justin', side: 'left' , mediaNum: 1, text: 'Where did they take Dad?' },
                        { name: 'Justin', side: 'left' , mediaNum: 1, text: '...' },
                        { name: 'Justin', side: 'left' , mediaNum: 1, text: 'Wait.' },
                        { name: 'Justin', side: 'left' , mediaNum: 1, text: 'Maybe it has something to do with this flash drive...' },
                        { name: 'Justin', side: 'left' , mediaNum: 1, text: 'I should check it out on my computer.' }
                    ];
                    this.dialogBox.playDialogSet(dialogSetJSON);
                })
                .waitUntil(function ()
                {
                    return !this.dialogBox.isPlaying;
                })
                .then(function ()
                {
                    ig.game.player.setMovementLock(false);
                });
        },

        event_LevelOne_PlayerAccessesFlashDrive: function () {
            this.dialogBox = ig.game.getEntitiesByType(EntityDialogPlayer)[0];
            this.camera = ig.game.camera;

            this.eventChain = EventChain(this)
                .then(function ()
                {
                    ig.game.player.setMovementLock(true);
                    var dialogSetJSON = [
                        { name: 'Justin', side: 'left' , mediaNum: 1, text: 'Dad must have given me this software for a reason.' },
                        { name: 'Justin', side: 'left' , mediaNum: 1, text: 'I remember him showing me some of his work in his room before.' },
                        { name: 'Justin', side: 'left' , mediaNum: 1, text: 'I might be able to find some clues there.' }
                    ];
                    this.dialogBox.playDialogSet(dialogSetJSON);
                })
                .waitUntil(function ()
                {
                    return !this.dialogBox.isPlaying;
                })
                .then(function ()
                {
                    ig.game.player.setMovementLock(false);
                });
        },

        event_LevelOne_PoliceArrives: function () {
            this.dialogBox = ig.game.getEntitiesByType(EntityDialogPlayer)[0];
            this.camera = ig.game.camera;

            var policeOfficerOne = ig.game.getEntitiesByType(EntityFatherNPC)[0];
            var policeOfficerTwo = ig.game.getEntitiesByType(EntityFatherNPC)[1];

            this.eventChain = EventChain(this)
                .then(function ()
                {
                    ig.game.player.setMovementLock(true);
                    var dialogSetJSON = [
                        { name: 'Justin', side: 'left' , mediaNum: 1, text: 'A cyborg!? Is this what Dad has been working on?' },
                        { name: 'Justin', side: 'left' , mediaNum: 1, text: 'And who are these people he\'s been talking to on email?' },
                        { name: 'Justin', side: 'left' , mediaNum: 1, text: 'Are these the same people who took him?' },
                        { name: 'Justin', side: 'left' , mediaNum: 1, text: 'This is too confusing. I better go to the police.' }
                    ];
                    this.dialogBox.playDialogSet(dialogSetJSON);
                })
                .waitUntil(function ()
                {
                    return !this.dialogBox.isPlaying;
                })
                .then(function ()
                {
                    var policeOfficerSpawnOne = ig.game.getEntityByName('policeOfficerSpawn_1');
                    policeOfficerOne.pos.x = policeOfficerSpawnOne.pos.x;
                    policeOfficerOne.pos.y = policeOfficerSpawnOne.pos.y;

                    var policeOfficerSpawnTwo = ig.game.getEntityByName('policeOfficerSpawn_2');
                    policeOfficerTwo.pos.x = policeOfficerSpawnTwo.pos.x;
                    policeOfficerTwo.pos.y = policeOfficerSpawnTwo.pos.y;

                    var dialogSetJSON = [
                        { name: 'Police Officer', side: 'right' , mediaNum: 2, text: 'CHECK THE ROOMS!' }
                    ];
                    this.dialogBox.playDialogSet(dialogSetJSON);
                    ig.game.screenShaker.applyImpulse(600, 600);
                })
                .wait(1)
                .then(function ()
                {
                    var policeOfficerOneWalkDestination = ig.game.getEntityByName('policeOfficerWalkDestination_1');
                    policeOfficerOne.setDestination(policeOfficerOneWalkDestination.pos.x, policeOfficerOneWalkDestination.pos.y);

                    var policeOfficerTwoWalkDestination = ig.game.getEntityByName('policeOfficerWalkDestination_2');
                    policeOfficerTwo.setDestination(policeOfficerTwoWalkDestination.pos.x, policeOfficerTwoWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return policeOfficerOne.hasReachedDestination && policeOfficerTwo.hasReachedDestination;
                })
                .then(function ()
                {
                    var dialogSetJSON = [
                        { name: 'Police Officer', side: 'right' , mediaNum: 2, text: 'ARE YOU JUSTIN DANSON?' },
                        { name: 'Justin', side: 'left' , mediaNum: 1, text: 'Ye..yes? What\'s going on officer? Why are you here?' },
                        { name: 'Police Officer', side: 'right' , mediaNum: 2, text: 'We are looking for your father, Edwin Danson! WHERE IS HE?' },
                        { name: 'Justin', side: 'left' , mediaNum: 1, text: 'He\'s not here..' },
                        { name: 'Police Officer', side: 'right' , mediaNum: 2, text: 'WHAT!? Stop lying boy! We know he\'s here. TELL US WHERE IS HE HIDING!' },
                        { name: 'Justin', side: 'left' , mediaNum: 1, text: 'Some people came and took him away just now..' },
                        { name: 'Justin', side: 'left' , mediaNum: 1, text: 'I was just about to call the police when you guys showed up.' },
                        { name: 'Police Officer', side: 'right' , mediaNum: 2, text: 'Sergeant. Report this back to HQ.' },
                        { name: 'Police Officer', side: 'right' , mediaNum: 2, text: 'Yes Sir.' }
                    ];
                    this.dialogBox.playDialogSet(dialogSetJSON);
                })
                .waitUntil(function ()
                {
                    return !this.dialogBox.isPlaying;
                })
                .then(function ()
                {
                    var policeOfficerWalkDestination = ig.game.getEntityByName('policeOfficerSpawn_1');
                    policeOfficerTwo.setDestination(policeOfficerWalkDestination.pos.x, policeOfficerWalkDestination.pos.y);
                })
                .wait(1)
                .then(function ()
                {
                    var policeOfficerWalkDestination = ig.game.getEntityByName('policeOfficerWalkDestination_3');
                    policeOfficerOne.setDestination(policeOfficerWalkDestination.pos.x, policeOfficerWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return policeOfficerOne.hasReachedDestination;
                })
                .then(function ()
                {
                    var dialogSetJSON = [
                        { name: 'Justin', side: 'left' , mediaNum: 1, text: 'WAIT! Can you tell me what is going on!?' },
                        { name: 'Police Officer', side: 'right' , mediaNum: 2, text: '...' },
                        { name: 'Police Officer', side: 'right' , mediaNum: 2, text: 'We have reason to suspect that your father is conspiring with an evil organisation to build a highly dangerous weapon.' },
                        { name: 'Police Officer', side: 'right' , mediaNum: 2, text: 'And we are here to arrest him.' },
                        { name: 'Justin', side: 'left' , mediaNum: 1, text: 'That\'s not possible! My dad will never do such a thing.' },
                        { name: 'Police Officer', side: 'right' , mediaNum: 2, text: 'We have the evidence to prove it.' }
                    ];
                    this.dialogBox.playDialogSet(dialogSetJSON);
                })
                .waitUntil(function ()
                {
                    return !this.dialogBox.isPlaying;
                })
                .then(function ()
                {
                    var policeOfficerWalkDestination = ig.game.getEntityByName('policeOfficerWalkDestination_4');
                    policeOfficerOne.setDestination(policeOfficerWalkDestination.pos.x, policeOfficerWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return policeOfficerOne.hasReachedDestination;
                })
                .then(function ()
                {
                    var dialogSetJSON = [
                        { name: 'Justin', side: 'left' , mediaNum: 1, text: 'WAIT! Is this about the cyborg!?' }
                    ];
                    this.dialogBox.playDialogSet(dialogSetJSON);
                })
                .waitUntil(function ()
                {
                    return !this.dialogBox.isPlaying;
                })
                .then(function ()
                {
                    var policeOfficerWalkDestination = ig.game.getEntityByName('policeOfficerWalkDestination_1');
                    policeOfficerOne.setDestination(policeOfficerWalkDestination.pos.x, policeOfficerWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return policeOfficerOne.hasReachedDestination;
                })
                .then(function ()
                {
                    var dialogSetJSON = [
                        { name: 'Police Officer', side: 'right' , mediaNum: 2, text: 'WHAT DO YOU KNOW ABOUT THE CYBORG!?' },
                        { name: 'Police Officer', side: 'right' , mediaNum: 2, text: 'TELL ME NOW BOY!' },
                        { name: 'Justin', side: 'left' , mediaNum: 1, text: 'I.. I.. I was looking through my dad\'s stuff and I found a blueprint of it.' },
                        { name: 'Police Officer', side: 'right' , mediaNum: 2, text: 'Where is it? Show it to me.' },
                        { name: 'Police Officer', side: 'right' , mediaNum: 2, text: 'Hmm.. I see...' },
                        { name: 'Police Officer', side: 'right' , mediaNum: 2, text: 'How did you gain access into your father\'s secret documents? They\'re suppose to be protected by an advanced security system.' },
                        { name: 'Justin', side: 'left' , mediaNum: 1, text: 'Well... I\'m kinda just good at this stuff...' },
                        { name: 'Police Officer', side: 'right' , mediaNum: 2, text: 'Hmm... You just might be of some use boy...' },
                        { name: 'Police Officer', side: 'right' , mediaNum: 2, text: 'Do you want to prove your father\'s innocence?' },
                        { name: 'Justin', side: 'left' , mediaNum: 1, text: 'Of.. OF COURSE!' },
                        { name: 'Police Officer', side: 'right' , mediaNum: 2, text: 'Then come with us to the police station. We could use your help there.' },
                        { name: 'Police Officer', side: 'right' , mediaNum: 2, text: 'Meet me downstairs at the front door when you are ready to leave.' }
                    ];
                    this.dialogBox.playDialogSet(dialogSetJSON);
                })
                .waitUntil(function ()
                {
                    return !this.dialogBox.isPlaying;
                })
                .then(function ()
                {
                    var policeOfficerWalkDestination = ig.game.getEntityByName('policeOfficerSpawn_1');
                    policeOfficerOne.setDestination(policeOfficerWalkDestination.pos.x, policeOfficerWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return policeOfficerOne.hasReachedDestination;
                })
                .then(function ()
                {
                    var dialogSetJSON = [
                        { name: 'Justin', side: 'left' , mediaNum: 1, text: 'Look\'s like I don\'t have a choice. I have to save Dad.' }

                    ];
                    this.dialogBox.playDialogSet(dialogSetJSON);
                })
                .waitUntil(function ()
                {
                    return !this.dialogBox.isPlaying;
                })
                .then(function ()
                {
                    ig.game.player.setMovementLock(false);
                });
        },

        event_LevelOne_Chat: function () {
            var parameters = {text: 'I fucking pwn. period.', tracks: 'justin', margin: 0, lifeSpan: 5, shape: 'rounded', name: 'playerBubble', color:[255,255,255], opacity: 1};
            ig.game.spawnEntity(EntityChatbubble, 0, 0, parameters);
            console.log(ig.game.getEntitiesByType(EntityChatbubble)[0].text);
        }

    });

});
