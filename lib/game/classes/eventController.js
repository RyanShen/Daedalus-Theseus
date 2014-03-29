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

            switch (eventTrigger.eventID){
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
                case 6:
                    this.event_LevelOne_PlayerLeavesForPoliceHQ(eventTrigger);
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
            this.fatherNPC = ig.game.getEntityByName('Dad');
            this.dialogBox = ig.game.getEntitiesByType(EntityDialogPlayer)[0];
            this.camera = ig.game.levelController.camera;

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
                        { name: 'Father', side: 'right', mediaNum: ig.game.dialogFigures.f_dad, autoprogress: 0, text: 'Wow son! Just completed another CTF?' },
                        { name: 'Justin', side: 'left' , mediaNum: 7, autoprogress: 0, text: 'Yup! Piece of cake!' },
                        { name: 'Father', side: 'right', mediaNum: 1, autoprogress: 0, text: 'With your computer skills and my experience in robotics, we could do something really awesome one day!' },
                        { name: 'Father', side: 'right', mediaNum: 1, autoprogress: 0, text: 'But son.. always remember this. You must only use your skills for the good of mankind. Promise me that.' },
                        { name: 'Father', side: 'right', mediaNum: 1, autoprogress: 0, text: 'Here. Take this flash drive. I need you to look after this.' },
                        { name: 'Justin', side: 'noside' , mediaNum: 0, autoprogress: 0, text: '<Received Flash Drive from Dad.>' },
                        { name: 'Justin', side: 'left' , mediaNum: 6, autoprogress: 0, text: 'What\'s up Dad? You\'re acting a little weird.' },
                        { name: 'Father', side: 'right', mediaNum: 1, autoprogress: 0, text: 'It contains a very important piece of software. You have to keep it safe. Promis-' },
                        { name: 'Father', side: 'noside', mediaNum: 1, autoprogress: 0, text: '<Doorbell rings.>' },
                        { name: 'Father', side: 'right', mediaNum: 1, autoprogress: 0, text: 'Oh no. It\'s them! This is not good.' },
                        { name: 'Justin', side: 'left' , mediaNum: 0, autoprogress: 0, text: 'Dad.. Whats going on?' },
                        { name: 'Father', side: 'right', mediaNum: 1, autoprogress: 0, text: 'Son. Stay here and be quiet. I\'ll answer the door.' },
                        { name: 'Father', side: 'right', mediaNum: 1, autoprogress: 0, text: 'Remember! DO NOT let anyone know about the flash drive!' },
                        { name: 'Justin', side: 'left' , mediaNum: 0, autoprogress: 0, text: 'Dad!' }
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
                        { name: 'Father', side: 'noside', mediaNum: 1, text: 'HEY!' },
                        { name: 'Justin', side: 'left' , mediaNum: 0, text: 'Huh? Dad!?' },
                        { name: 'Father', side: 'noside', mediaNum: 1, text: 'WHAT ARE YOU GUYS DOING HERE!?' },
                        { name: 'Father', side: 'noside', mediaNum: 1, text: 'NO WAIT! WHERE ARE YOU TAKING ME!' },
                        { name: 'Father', side: 'noside', mediaNum: 1, text: 'LET GO!' },
                        { name: 'Justin', side: 'left' , mediaNum: 0, text: 'Oh my gosh. Dad!' },
                        { name: 'Justin', side: 'left' , mediaNum: 0, text: 'I have to find out what\'s going on downstairs!' }
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
                    ig.game.inGameGUIController.updateObjectives(this.latestEventID);
                });
        },

        event_LevelOne_PlayerLooksForFather: function () {
            this.dialogBox = ig.game.getEntitiesByType(EntityDialogPlayer)[0];
            this.camera = ig.game.levelController.camera;

            this.eventChain = EventChain(this)
                .then(function ()
                {
                    ig.game.player.setMovementLock(true);
                    var dialogSetJSON = [
                        { name: 'Justin', side: 'left' , mediaNum: 0, text: 'It sounded like it came from the front door. I should go there.' }
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
                    ig.game.inGameGUIController.updateObjectives(this.latestEventID);
                });
        },

        event_LevelOne_PlayerDecidesToInvestigateFlashDrive: function () {
            this.dialogBox = ig.game.getEntitiesByType(EntityDialogPlayer)[0];
            this.camera = ig.game.levelController.camera;

            this.eventChain = EventChain(this)
                .then(function ()
                {
                    ig.game.player.setMovementLock(true);
                    var dialogSetJSON = [
                        { name: 'Justin', side: 'left' , mediaNum: 0, text: 'Dad\'s not here! What\'s going on?' },
                        { name: 'Justin', side: 'left' , mediaNum: 10, text: 'Who were those people?' },
                        { name: 'Justin', side: 'left' , mediaNum: 10, text: 'Where did they take Dad?' },
                        { name: 'Justin', side: 'left' , mediaNum: 10, text: 'I better call the police.' },
                        { name: 'Justin', side: 'left' , mediaNum: 10, text: '...' },
                        { name: 'Justin', side: 'left' , mediaNum: 10, text: 'Wait a minute.' },
                        { name: 'Justin', side: 'left' , mediaNum: 10, text: 'Does this have something to do with the flash drive?' },
                        { name: 'Justin', side: 'left' , mediaNum: 10, text: 'I should check it out on my computer first.' }
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
                    ig.game.inGameGUIController.updateObjectives(this.latestEventID);
                });
        },

        event_LevelOne_PlayerAccessesFlashDrive: function () {
            this.dialogBox = ig.game.getEntitiesByType(EntityDialogPlayer)[0];
            this.camera = ig.game.levelController.camera;

            this.eventChain = EventChain(this)
                .then(function ()
                {
                    ig.game.player.setMovementLock(true);
                    var dialogSetJSON = [
                        { name: 'Justin', side: 'left' , mediaNum: 10, text: 'Woah. Look\'s like THESEUS is some kind of fancy hacking software.' },
                        { name: 'Justin', side: 'left' , mediaNum: 10, text: 'Dad must have given me this for a reason.' },
                        { name: 'Justin', side: 'left' , mediaNum: 10, text: 'But what could it be?' },
                        { name: 'Justin', side: 'left' , mediaNum: 10, text: 'Hmm... I remember seeing some of Dad\'s work in his room before.' },
                        { name: 'Justin', side: 'left' , mediaNum: 8, text: 'I might be able to find some clues there.' }
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
                    ig.game.inGameGUIController.updateObjectives(this.latestEventID);
                });
        },

        event_LevelOne_PoliceArrives: function () {
            this.dialogBox = ig.game.getEntitiesByType(EntityDialogPlayer)[0];
            this.camera = ig.game.levelController.camera;

            var policeOfficerLisa = ig.game.getEntityByName('Police Officer Lisa');
            var policeOfficerSteve = ig.game.getEntityByName('Police Officer Steve');

            this.eventChain = EventChain(this)
                .then(function ()
                {
                    ig.game.player.setMovementLock(true);
                    var dialogSetJSON = [
                        { name: 'Justin', side: 'left' , mediaNum: 0, text: 'I got in! This THESEUS software seems pretty nifty. Now let\'s see if I can find anything on his computer...' },
                        { name: 'Justin', side: 'left' , mediaNum: 0, text: 'What\'s this? Looks like some kind of blueprint for a... WHAT!?' },
                        { name: 'Justin', side: 'left' , mediaNum: 0, text: 'A cyborg!?' },
                        { name: 'Justin', side: 'left' , mediaNum: 0, text: 'Is this what Dad has been working on?' },
                        { name: 'Justin', side: 'left' , mediaNum: 0, text: 'It looks like a weapon. Why is Dad working on a weapon!?' },
                        { name: 'Justin', side: 'left' , mediaNum: 10, text: 'Could this be what those people were looking for?' },
                        { name: 'Justin', side: 'left' , mediaNum: 0, text: 'This looks bad. I better go to the polic-' }
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
                    policeOfficerLisa.pos.x = policeOfficerSpawnOne.pos.x;
                    policeOfficerLisa.pos.y = policeOfficerSpawnOne.pos.y;

                    var policeOfficerSpawnTwo = ig.game.getEntityByName('policeOfficerSpawn_2');
                    policeOfficerSteve.pos.x = policeOfficerSpawnTwo.pos.x;
                    policeOfficerSteve.pos.y = policeOfficerSpawnTwo.pos.y;

                    var dialogSetJSON = [
                        { name: 'Police Officer', side: 'right' , mediaNum: 3, text: 'CHECK THE ROOMS!' }
                    ];
                    this.dialogBox.playDialogSet(dialogSetJSON);
                    ig.game.screenShaker.applyImpulse(600, 600);
                })
                .wait(1)
                .then(function ()
                {
                    var policeOfficerOneWalkDestination = ig.game.getEntityByName('policeOfficerWalkDestination_1');
                    policeOfficerLisa.setDestination(policeOfficerOneWalkDestination.pos.x, policeOfficerOneWalkDestination.pos.y);

                    var policeOfficerTwoWalkDestination = ig.game.getEntityByName('policeOfficerWalkDestination_2');
                    policeOfficerSteve.setDestination(policeOfficerTwoWalkDestination.pos.x, policeOfficerTwoWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return policeOfficerLisa.hasReachedDestination && policeOfficerSteve.hasReachedDestination;
                })
                .then(function ()
                {
                    var dialogSetJSON = [
                        { name: 'Justin', side: 'left' , mediaNum: 0, text: 'WOAH! WHAT\'s GOING ON!?' },
                        { name: 'Police Officer', side: 'right' , mediaNum: 3, text: 'ARE YOU JUSTIN DANSON?' },
                        { name: 'Justin', side: 'left' , mediaNum: 0, text: 'Ye..yes? What\'s going on here officer? Why are you in my house? I haven\'t even called you yet?' },
                        { name: 'Police Officer', side: 'right' , mediaNum: 3, text: 'We are looking for your father, Edwin Danson! WHERE IS HE?' },
                        { name: 'Justin', side: 'left' , mediaNum: 0, text: 'My dad just got kidnapped! I NEED YOUR HELP!' },
                        { name: 'Police Officer', side: 'right' , mediaNum: 3, text: 'WHAT!? Stop lying boy! We know he\'s here. TELL US WHERE IS HE HIDING!' },
                        { name: 'Justin', side: 'left' , mediaNum: 0, text: 'What! Why would I be lying!? Some people came and took him away just now!' },
                        { name: 'Police Officer', side: 'right' , mediaNum: 3, text: 'IF THAT IS SO, WHY DIDN\'T YOU CALL US!' },
                        { name: 'Justin', side: 'left' , mediaNum: 0, text: 'I was just about to when you guys showed up!' },
                        { name: 'Police Officer', side: 'right' , mediaNum: 3, text: '...' },
                        { name: 'Police Officer', side: 'right' , mediaNum: 3, text: 'Sergeant. Report this back to HQ.' },
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
                    policeOfficerSteve.setDestination(policeOfficerWalkDestination.pos.x, policeOfficerWalkDestination.pos.y);
                })
                .wait(1)
                .then(function ()
                {
                    var policeOfficerWalkDestination = ig.game.getEntityByName('policeOfficerWalkDestination_3');
                    policeOfficerLisa.setDestination(policeOfficerWalkDestination.pos.x, policeOfficerWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return policeOfficerLisa.hasReachedDestination;
                })
                .then(function ()
                {
                    var dialogSetJSON = [
                        { name: 'Justin', side: 'left' , mediaNum: 0, text: 'WAIT! Can you tell me what on earth is going on!?' },
                        { name: 'Police Officer', side: 'right' , mediaNum: 3, text: '...' },
                        { name: 'Police Officer', side: 'right' , mediaNum: 3, text: 'We have reason to suspect that your father is conspiring with an evil organisation to build a highly dangerous weapon.' },
                        { name: 'Police Officer', side: 'right' , mediaNum: 3, text: 'And we are here to arrest him.' },
                        { name: 'Justin', side: 'left' , mediaNum: 0, text: 'Are you serious!? My dad will never do such a thing!' }
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
                    policeOfficerLisa.setDestination(policeOfficerWalkDestination.pos.x, policeOfficerWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return policeOfficerLisa.hasReachedDestination;
                })
                .then(function ()
                {
                    var dialogSetJSON = [
                        { name: 'Justin', side: 'left' , mediaNum: 0, text: 'WAIT! Is this about the cyborg!?' }
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
                    policeOfficerLisa.setDestination(policeOfficerWalkDestination.pos.x, policeOfficerWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return policeOfficerLisa.hasReachedDestination;
                })
                .then(function ()
                {
                    var dialogSetJSON = [
                        { name: 'Police Officer', side: 'right' , mediaNum: 3, text: 'WHAT DO YOU KNOW ABOUT THE CYBORG!?' },
                        { name: 'Police Officer', side: 'right' , mediaNum: 3, text: 'TELL ME NOW BOY!' },
                        { name: 'Justin', side: 'left' , mediaNum: 0, text: 'I.. I.. I uhh.. overheard the kidnappers talking about it.' },
                        { name: 'Police Officer', side: 'right' , mediaNum: 3, text: 'ALRIGHT THAT\'S IT! YOU\'RE COMING WITH US BOY. YOU\'RE GOING TO TELL US EXACTLY WHAT HAPPENED.' },
                        { name: 'Justin', side: 'left' , mediaNum: 0, text: 'What now!? Am I under arrest?' },
                        { name: 'Police Officer', side: 'right' , mediaNum: 3, text: 'You will be if you DON\'T START COOPERATING!' },
                        { name: 'Police Officer', side: 'right' , mediaNum: 3, text: 'Be done with whatever you\'re doing and meet me downstairs at the front door when you are ready to leave.' },
                        { name: 'Police Officer', side: 'right' , mediaNum: 3, text: 'And don\'t you try anything funny boy. I\'m watching you.' }
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
                    policeOfficerLisa.setDestination(policeOfficerWalkDestination.pos.x, policeOfficerWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return policeOfficerLisa.hasReachedDestination;
                })
                .then(function ()
                {
                    var policeOfficerWalkDestination = ig.game.getEntityByName('policeOfficerWalkDestination_5');
                    policeOfficerLisa.setDestination(policeOfficerWalkDestination.pos.x, policeOfficerWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return policeOfficerLisa.hasReachedDestination;
                })
                .then(function ()
                {
                    var policeOfficerWalkDestination = ig.game.getEntityByName('policeOfficerSpawn_1');
                    policeOfficerLisa.setDestination(policeOfficerWalkDestination.pos.x, policeOfficerWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return policeOfficerLisa.hasReachedDestination;
                })
                .then(function ()
                {
                    var dialogSetJSON = [
                        { name: 'Justin', side: 'left' , mediaNum: 0, text: 'Oh man. I hope I don\'t get in trouble for lying to them.' },
                        { name: 'Justin', side: 'left' , mediaNum: 0, text: 'I\'m not sure if I should have told them the truth about the blueprint or the THESEUS software...' },
                        { name: 'Justin', side: 'left' , mediaNum: 0, text: 'But they don\'t seem to believe that Dad has been kidnapped. They think that he is behind all this.' },
                        { name: 'Justin', side: 'left' , mediaNum: 0, text: 'I better not give them anymore evidence to believe that my dad is the culprit.' },
                        { name: 'Justin', side: 'left' , mediaNum: 0, text: 'At least not until I figure out what is really going on.' },
                        { name: 'Justin', side: 'left' , mediaNum: 0, text: 'I\'ll do my own investigation while I\'m with the police. Maybe I can get some information from them.' },
                        { name: 'Justin', side: 'left' , mediaNum: 0, text: 'I better keep THESEUS and the blueprints with me. Just in case.' },
                        { name: 'Justin', side: 'left' , mediaNum: 0, text: 'Sigh... What on earth is going on Dad!?' }
                    ];
                    this.dialogBox.playDialogSet(dialogSetJSON);
                })
                .waitUntil(function ()
                {
                    return !this.dialogBox.isPlaying;
                })
                .then(function ()
                {
                    policeOfficerLisa.kill();
                    policeOfficerSteve.kill();
                    ig.game.player.setMovementLock(false);
                    ig.game.inGameGUIController.updateObjectives(this.latestEventID);
                });
        },

        event_LevelOne_PlayerLeavesForPoliceHQ: function () {
            this.dialogBox = ig.game.getEntitiesByType(EntityDialogPlayer)[0];
            this.camera = ig.game.levelController.camera;

            var policeOfficerLisa = ig.game.getEntityByName('Police Officer Lisa');

            this.eventChain = EventChain(this)
                .then(function ()
                {
                    var policeOfficerWalkDestination = ig.game.player;
                    policeOfficerLisa.setDestination(policeOfficerWalkDestination.pos.x, policeOfficerWalkDestination.pos.y - 50);
                })
                .waitUntil(function ()
                {
                    return policeOfficerLisa.hasReachedDestination;
                })
                .then(function ()
                {
                    ig.game.player.setMovementLock(true);
                    var dialogSetJSON = [
                        { name: 'Lisa', side: 'right' , mediaNum: 3, text: 'You sure took your time boy. Let\'s go.' }
                    ];
                    this.dialogBox.playDialogSet(dialogSetJSON);
                })
                .waitUntil(function ()
                {
                    return !this.dialogBox.isPlaying;
                })
                .then(function ()
                {
                    ig.game.menuController.loadThankYouScreen();
                    ig.game.player.setMovementLock(false);
                    ig.game.inGameGUIController.updateObjectives(this.latestEventID);
                    ig.game.inGameGUIController.toggleObjectiveBox(false);
                });
        },

        event_LevelOne_Chat: function () {
            var parameters = {text: 'I fucking pwn. period.', tracks: 'justin', margin: 0, lifeSpan: 5, shape: 'rounded', name: 'playerBubble', color:[255,255,255], opacity: 1};
            ig.game.spawnEntity(EntityChatbubble, 0, 0, parameters);
            console.log(ig.game.getEntitiesByType(EntityChatbubble)[0].text);
        }

    });

});
