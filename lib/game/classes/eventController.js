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

        ends: true,

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
                case 7:
                    this.event_LevelTwo_PlayerArrivesAtPoliceHQ(eventTrigger);
                    break;
                case 8:
                    this.event_LevelTwo_PlayerGathersEnoughEvidence(eventTrigger);
                    break;
                case 9:
                    this.event_LevelTwo_PlayerReceivesCallFromDaedalus(eventTrigger);
                    break;
                case 10:
                    this.event_LevelThree_PlayerArrivesAtCreteRoboticsTower(eventTrigger);
                    break;
                case 11:
                    this.event_LevelThree_PlayerHeadsToBossRoom(eventTrigger);
                    break;
                case 12:
                    this.event_LevelThree_PlayerEntersBossRoom(eventTrigger);
                    break;
                case 13:
                    this.event_LevelThree_PlayerDefeatsBoss(eventTrigger);
                    //cyborg destroyed. make father go home
                    break;
                default :
                    console.log('Invalid eventID triggered.');
                    break;
            }
            this.latestEventID = eventTrigger.eventID;
            this.ends = false;
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
            this.ends = false;

            this.eventChain = EventChain(this)
                .then(function ()
                {
                    //ig.game.togglePlayerInteraction(true);
                    ig.game.toggleEventModeInteraction(false);
                    var dialogSetJSON = [
                        { name: 'TUTORIAL', side: 'right', mediaNum: ig.game.dialogFigures.f_EMPTY, autoprogress: 0, text: 'Left click on the mouse to progress through dialogue.' },
                        { name: 'TUTORIAL', side: 'right', mediaNum: ig.game.dialogFigures.f_EMPTY, autoprogress: 0, text: 'Perfect!' },
                        { name: 'TUTORIAL', side: 'right', mediaNum: ig.game.dialogFigures.f_EMPTY, autoprogress: 0, text: 'End of tutorial.' }
                    ];
                    this.dialogBox.playDialogSet(dialogSetJSON);
                })
                .waitUntil(function ()
                {
                    return !this.dialogBox.isPlaying;
                })
                .then(function ()
                {
                    ig.game.player.orientation = 'up';
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
                    ig.game.player.orientation = 'down-right';
                    var dialogSetJSON = [
                        { name: 'Father', side: 'right', mediaNum: ig.game.dialogFigures.f_dad, autoprogress: 0, text: 'Wow ' + ig.game.dialogController.avatar[ig.game.avatarID].name + '! Just completed another CTF?' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_cheerful, autoprogress: 0, text: 'Yup! Piece of cake!' },
                        { name: 'Father', side: 'right', mediaNum: ig.game.dialogFigures.f_dad, autoprogress: 0, text: 'With your computer skills and my experience in robotics, we could do something really awesome one day!' },
                        { name: 'Father', side: 'right', mediaNum: ig.game.dialogFigures.f_dad, autoprogress: 0, text: 'But ' + ig.game.dialogController.avatar[ig.game.avatarID].name + '.. always remember this. You must only use your skills for the good of mankind. Promise me that.' },
                        { name: 'Father', side: 'right', mediaNum: ig.game.dialogFigures.f_dad, autoprogress: 0, text: 'Here. Take this flash drive. I need you to look after this.' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'noside', mediaNum: ig.game.dialogFigures.f_EMPTY, autoprogress: 0, text: '<Received Flash Drive from Dad.>' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_hesitant, autoprogress: 0, text: 'What\'s up Dad? You\'re acting a little weird.' },
                        { name: 'Father', side: 'right', mediaNum: ig.game.dialogFigures.f_dad, autoprogress: 0, text: 'It contains a very important piece of software. You have to keep it safe. Promis-' },
                        { name: 'Father', side: 'noside', mediaNum: ig.game.dialogFigures.f_EMPTY, autoprogress: 0, text: '<Doorbell rings.>' },
                        { name: 'Father', side: 'right', mediaNum: ig.game.dialogFigures.f_dad, autoprogress: 0, text: 'Oh no. It\'s them! This is not good.' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_shock, autoprogress: 0, text: 'Dad.. What\'s going on?' },
                        { name: 'Father', side: 'right', mediaNum: ig.game.dialogFigures.f_dad, autoprogress: 0, text: ig.game.dialogController.avatar[ig.game.avatarID].name + '. Stay here and be quiet. I\'ll answer the door.' },
                        { name: 'Father', side: 'right', mediaNum: ig.game.dialogFigures.f_dad, autoprogress: 0, text: 'Remember! DO NOT let anyone know about the flash drive!' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_shock, autoprogress: 0, text: 'Dad!' }
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
                        { name: 'Father', side: 'noside', mediaNum: ig.game.dialogFigures.f_EMPTY, autoprogress: 0, text: 'HEY!' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_shock, autoprogress: 0, text: 'Huh? Dad!?' },
                        { name: 'Father', side: 'noside', mediaNum: ig.game.dialogFigures.f_EMPTY, autoprogress: 0, text: 'WHAT ARE YOU GUYS DOING HERE!?' },
                        { name: 'Father', side: 'noside', mediaNum: ig.game.dialogFigures.f_EMPTY, autoprogress: 0, text: 'NO WAIT! WHERE ARE YOU TAKING ME!' },
                        { name: 'Father', side: 'noside', mediaNum: ig.game.dialogFigures.f_EMPTY, autoprogress: 0, text: 'LET GO!' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_shock, autoprogress: 0, text: 'Oh my gosh. Dad!' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_shock, autoprogress: 0, text: 'I have to find out what\'s going on downstairs!' },
                        { name: 'TUTORIAL', side: 'right', mediaNum: ig.game.dialogFigures.f_EMPTY, autoprogress: 0, text: 'Left click to move around the world and interact with objects.' }
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
                    ig.game.toggleEventModeInteraction(true);
                    ig.game.inGameGUIController.updateObjectives(this.latestEventID);
                    this.ends = true;
                    ig.game.eventID = this.latestEventID;
                });
        },

        event_LevelOne_PlayerLooksForFather: function () {
            this.dialogBox = ig.game.getEntitiesByType(EntityDialogPlayer)[0];
            this.camera = ig.game.levelController.camera;
            this.ends = false;

            this.eventChain = EventChain(this)
                .then(function ()
                {
                    ig.game.toggleEventModeInteraction(false);
                    var dialogSetJSON = [
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_dilemma, autoprogress: 0, text: 'It sounded like it came from the front door. I should go there.' }
                    ];
                    this.dialogBox.playDialogSet(dialogSetJSON);
                })
                .waitUntil(function ()
                {
                    return !this.dialogBox.isPlaying;
                })
                .then(function ()
                {
                    ig.game.toggleEventModeInteraction(true);
                    ig.game.inGameGUIController.updateObjectives(this.latestEventID);
                    this.ends = true;
                    ig.game.eventID = this.latestEventID;
                });
        },

        event_LevelOne_PlayerDecidesToInvestigateFlashDrive: function () {
            this.dialogBox = ig.game.getEntitiesByType(EntityDialogPlayer)[0];
            this.camera = ig.game.levelController.camera;
            this.ends = false;

            this.eventChain = EventChain(this)
                .then(function ()
                {
                    ig.game.toggleEventModeInteraction(false);
                    ig.game.player.stop();
                    var dialogSetJSON = [
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_shock, autoprogress: 0, text: 'Dad\'s not here! What\'s going on?' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_shock, autoprogress: 0, text: 'Who were those people?' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_shock, autoprogress: 0, text: 'Where did they take Dad?' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_dilemma, autoprogress: 0, text: 'I better call the police.' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_dilemma, autoprogress: 0, text: '...' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_thinking, autoprogress: 0, text: 'Wait a minute.' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_thinking, autoprogress: 0, text: 'Does this have something to do with the flash drive?' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_thinking, autoprogress: 0, text: 'I should check it out on a computer first.' }
                    ];
                    this.dialogBox.playDialogSet(dialogSetJSON);
                })
                .waitUntil(function ()
                {
                    return !this.dialogBox.isPlaying;
                })
                .then(function ()
                {
                    var computer = ig.game.getEntityByName('q01');
                    this.camera.entityToFollow = computer;
                })
                .wait(2)
                .then(function ()
                {
                    this.camera.entityToFollow = ig.game.player;
                })
                .wait(1)
                .then(function ()
                {
                    ig.game.toggleEventModeInteraction(true);
                    ig.game.inGameGUIController.updateObjectives(this.latestEventID);
                    this.ends = true;
                    ig.game.eventID = this.latestEventID;
                });
        },

        event_LevelOne_PlayerAccessesFlashDrive: function () {
            this.dialogBox = ig.game.getEntitiesByType(EntityDialogPlayer)[0];
            this.camera = ig.game.levelController.camera;
            this.ends = false;

            this.eventChain = EventChain(this)
                .then(function ()
                {
                    ig.game.toggleEventModeInteraction(false);
                    var dialogSetJSON = [
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_hesitant, autoprogress: 0, text: 'Whoa. Looks like THESEUS is some kind of fancy hacking software.' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_thinking, autoprogress: 0, text: 'Dad must have given me this for a reason.' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_thinking, autoprogress: 0, text: 'But what could it be?' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_thinking, autoprogress: 0, text: 'Hmm... I remember seeing some of Dad\'s work in his room before.' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_hesitant, autoprogress: 0, text: 'I might be able to find some clues there.' }
                    ];
                    this.dialogBox.playDialogSet(dialogSetJSON);
                })
                .waitUntil(function ()
                {
                    return !this.dialogBox.isPlaying;
                })
                .then(function ()
                {
                    ig.game.toggleEventModeInteraction(true);
                    ig.game.inGameGUIController.updateObjectives(this.latestEventID);
                    this.ends = true;
                    ig.game.eventID = this.latestEventID;
                });
        },

        event_LevelOne_PoliceArrives: function () {
            this.dialogBox = ig.game.getEntitiesByType(EntityDialogPlayer)[0];
            this.camera = ig.game.levelController.camera;
            this.ends = false;

            var policeOfficerLisa = ig.game.getEntityByName('Police Officer Lisa');
            var policeman = ig.game.getEntityByName('Policeman');

            this.eventChain = EventChain(this)
                .then(function ()
                {
                    ig.game.player.orientation = 'down';
                    ig.game.toggleEventModeInteraction(false);
                    var dialogSetJSON = [
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: 'Wait a minute..' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_shock, autoprogress: 0, text: 'Those blueprints on the table..' }
                    ];
                    this.dialogBox.playDialogSet(dialogSetJSON);
                })
                .waitUntil(function ()
                {
                    return !this.dialogBox.isPlaying;
                })
                .then(function ()
                {
                    var playerWalkDestination = ig.game.getEntityByName('playerWalkDestination');
                    ig.game.player.setDestination(playerWalkDestination.pos.x, playerWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return ig.game.player.hasReachedDestination;
                })
                .then(function ()
                {
                    ig.game.player.orientation = 'down';
                    var dialogSetJSON = [
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: 'Project MINO-4... Maybe I can find some blueprints on it.' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: 'Let\'s see..' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: 'MINO-4...' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_shock, autoprogress: 0, text: '!' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: 'Here it is.. Project MINO-4.' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: 'What!? A cyborg!?' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_shock, autoprogress: 0, text: 'Is this what Dad has been working on?' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_shock, autoprogress: 0, text: 'It looks like a weapon. Why is Dad working on a weapon!?' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_shock, autoprogress: 0, text: 'Could this be what those people were looking for?' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_shock, autoprogress: 0, text: 'This looks bad. I better go to the polic-' }
                    ];
                    this.dialogBox.playDialogSet(dialogSetJSON);
                })
                .waitUntil(function ()
                {
                    return !this.dialogBox.isPlaying;
                })
                .then(function ()
                {
                    var policeOfficerSpawnOne = ig.game.getEntityByName('lisaSpawn');
                    policeOfficerLisa.pos.x = policeOfficerSpawnOne.pos.x;
                    policeOfficerLisa.pos.y = policeOfficerSpawnOne.pos.y;

                    var policeOfficerSpawnTwo = ig.game.getEntityByName('policeSpawn');
                    policeman.pos.x = policeOfficerSpawnTwo.pos.x;
                    policeman.pos.y = policeOfficerSpawnTwo.pos.y;

                    var dialogSetJSON = [
                        { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 1, text: 'CHECK THE ROOMS!' }
                    ];
                    this.dialogBox.playDialogSet(dialogSetJSON);
                    ig.game.screenShaker.applyImpulse(600, 600);
                })
                .wait(1)
                .then(function ()
                {
                    var policeOfficerOneWalkDestination = ig.game.getEntityByName('lisaWalkDestination_1');
                    policeOfficerLisa.setDestination(policeOfficerOneWalkDestination.pos.x, policeOfficerOneWalkDestination.pos.y);

                    var policeOfficerTwoWalkDestination = ig.game.getEntityByName('policeOfficerWalkDestination_1');
                    policeman.setDestination(policeOfficerTwoWalkDestination.pos.x, policeOfficerTwoWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return policeOfficerLisa.hasReachedDestination && policeman.hasReachedDestination;
                })
                .then(function ()
                {
                    var policeOfficerOneWalkDestination = ig.game.getEntityByName('lisaWalkDestination_2');
                    policeOfficerLisa.setDestination(policeOfficerOneWalkDestination.pos.x, policeOfficerOneWalkDestination.pos.y);

                    var policeOfficerTwoWalkDestination = ig.game.getEntityByName('policeOfficerWalkDestination_2');
                    policeman.setDestination(policeOfficerTwoWalkDestination.pos.x, policeOfficerTwoWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return policeOfficerLisa.hasReachedDestination && policeman.hasReachedDestination;
                })
                .then(function ()
                {
                    ig.game.player.orientation = 'down';

                    var dialogSetJSON = [
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_shock, autoprogress: 0, text: 'WOAH! WHAT\'s GOING ON!?' },
                        { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'ARE YOU ' + ig.game.dialogController.avatar[ig.game.avatarID].nameCaps + ' DANSON?' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_shock, autoprogress: 0, text: 'Ye..yes? What\'s going on here officer? Why are you in my house? I haven\'t even called you yet?' },
                        { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'We are looking for your father, James Danson! WHERE IS HE?' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_shock, autoprogress: 0, text: 'My dad just got kidnapped! I NEED YOUR HELP!' },
                        { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'WHAT!? Stop lying kid! TELL US WHERE HE IS HIDING!' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_shock, autoprogress: 0, text: 'What! Why would I be lying!? Some people came and took him away just now!' },
                        { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'IF THAT IS TRUE, WHY DIDN\'T YOU CALL US!' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_shock, autoprogress: 0, text: 'I was just about to when you guys showed up!' },
                        { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: '...' },
                        { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'Sergeant. Report this back to HQ.' },
                        { name: 'Policeman', side: 'right' , mediaNum: ig.game.dialogFigures.f_policeman1, autoprogress: 0, text: 'Yes, Ma\'am.' }
                    ];
                    this.dialogBox.playDialogSet(dialogSetJSON);
                })
                .waitUntil(function ()
                {
                    return !this.dialogBox.isPlaying;
                })
                .then(function ()
                {
                    var policeOfficerWalkDestination = ig.game.getEntityByName('policeSpawn');
                    policeman.setDestination(policeOfficerWalkDestination.pos.x, policeOfficerWalkDestination.pos.y);
                })
                .wait(1)
                .then(function ()
                {
                    var policeOfficerWalkDestination = ig.game.getEntityByName('lisaWalkDestination_3');
                    policeOfficerLisa.setDestination(policeOfficerWalkDestination.pos.x, policeOfficerWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return policeOfficerLisa.hasReachedDestination;
                })
                .then(function ()
                {
                    var dialogSetJSON = [
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_shock, autoprogress: 0, text: 'WAIT! Can you tell me what on earth is going on!?' },
                        { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: '...' },
                        { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'James Danson is building a dangerous weapon.' },
                        { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'And we are here to arrest him.' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_shock, autoprogress: 0, text: 'Are you serious!? My dad will never do such a thing!' }
                    ];
                    this.dialogBox.playDialogSet(dialogSetJSON);
                })
                .waitUntil(function ()
                {
                    return !this.dialogBox.isPlaying;
                })
                .then(function ()
                {
                    var policeOfficerWalkDestination = ig.game.getEntityByName('lisaWalkDestination_4');
                    policeOfficerLisa.setDestination(policeOfficerWalkDestination.pos.x, policeOfficerWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return policeOfficerLisa.hasReachedDestination;
                })
                .then(function ()
                {
                    var dialogSetJSON = [
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_shock, autoprogress: 0, text: 'WAIT! Is this about the cyborg!?' }
                    ];
                    this.dialogBox.playDialogSet(dialogSetJSON);
                })
                .waitUntil(function ()
                {
                    return !this.dialogBox.isPlaying;
                })
                .then(function ()
                {
                    var policeOfficerWalkDestination = ig.game.getEntityByName('lisaWalkDestination_2');
                    policeOfficerLisa.setDestination(policeOfficerWalkDestination.pos.x, policeOfficerWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return policeOfficerLisa.hasReachedDestination;
                })
                .then(function ()
                {
                    var dialogSetJSON = [
                        { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'WHAT DO YOU KNOW ABOUT THE CYBORG!?' },
                        { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'TELL ME NOW KID!' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: '(Shucks! It\'s going to implicate Dad more if I tell them about the blueprints..)' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: '(I have to lie to protect Dad.. At least until I find out what\'s going on.)' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_shock, autoprogress: 0, text: 'I.. I.. I uhh.. overheard the kidnappers talking about it.' },
                        { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'ALRIGHT THAT\'S IT! YOU\'RE COMING WITH US KID. YOU\'RE GOING TO TELL US EXACTLY WHAT HAPPENED.' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_shock, autoprogress: 0, text: 'What now!? Am I under arrest?' },
                        { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'You will be if you DON\'T START COOPERATING!' },
                        { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'Be done with whatever you\'re doing and meet me downstairs at the front door when you are ready to leave.' },
                        { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'And don\'t you try anything funny kid. I\'m watching you.' }
                    ];
                    this.dialogBox.playDialogSet(dialogSetJSON);
                })
                .waitUntil(function ()
                {
                    return !this.dialogBox.isPlaying;
                })
                .then(function ()
                {
                    var policeOfficerWalkDestination = ig.game.getEntityByName('lisaWalkDestination_4');
                    policeOfficerLisa.setDestination(policeOfficerWalkDestination.pos.x, policeOfficerWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return policeOfficerLisa.hasReachedDestination;
                })
                .then(function ()
                {
                    var policeOfficerWalkDestination = ig.game.getEntityByName('lisaWalkDestination_5');
                    policeOfficerLisa.setDestination(policeOfficerWalkDestination.pos.x, policeOfficerWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return policeOfficerLisa.hasReachedDestination;
                })
                .then(function ()
                {
                    var policeOfficerWalkDestination = ig.game.getEntityByName('lisaSpawn');
                    policeOfficerLisa.setDestination(policeOfficerWalkDestination.pos.x, policeOfficerWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return policeOfficerLisa.hasReachedDestination;
                })
                .then(function ()
                {
                    var dialogSetJSON = [
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_dilemma, autoprogress: 0, text: 'Oh man. I hope I don\'t get in trouble for lying to them.' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_dilemma, autoprogress: 0, text: 'I\'m not sure if I should have told them the truth about the blueprint or the THESEUS software...' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_thinking, autoprogress: 0, text: 'But they don\'t seem to believe that Dad has been kidnapped. They think that he is behind all this.' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_thinking, autoprogress: 0, text: 'I better not give them anymore evidence to believe that my dad is the culprit.' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_thinking, autoprogress: 0, text: 'At least not until I figure out what is really going on.' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_thinking, autoprogress: 0, text: 'I\'ll do my own investigation while I\'m with the police. Maybe I can get some information from them.' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_hesitant, autoprogress: 0, text: 'I better keep THESEUS with me. Just in case.' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_dilemma, autoprogress: 0, text: 'Sigh... What on earth is going on Dad!?' }
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
                    policeman.kill();
                    ig.game.toggleEventModeInteraction(true);
                    ig.game.inGameGUIController.updateObjectives(this.latestEventID);
                    this.ends = true;
                    ig.game.eventID = this.latestEventID;
                });
        },

        event_LevelOne_PlayerLeavesForPoliceHQ: function () {
            this.dialogBox = ig.game.getEntitiesByType(EntityDialogPlayer)[0];
            this.camera = ig.game.levelController.camera;
            this.ends = false;

            var policeOfficerLisa = ig.game.getEntityByName('Police Officer Lisa');

            this.eventChain = EventChain(this)
                .then(function ()
                {
                    ig.game.toggleEventModeInteraction(false);
                    ig.game.player.stop();
                    policeOfficerLisa.orientation = 'up';

                    var dialogSetJSON = [
                        { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, text: 'You sure took your time kid. Let\'s go.' }
                    ];
                    this.dialogBox.playDialogSet(dialogSetJSON);
                })
                .waitUntil(function ()
                {
                    return !this.dialogBox.isPlaying;
                })
                .then(function ()
                {
                    ig.game.levelController.changeLevel('2_PoliceHQ_GroundFloor');
                    ig.game.toggleEventModeInteraction(true);
                    ig.game.inGameGUIController.updateObjectives(this.latestEventID);
                    this.ends = true;
                    ig.game.eventID = this.latestEventID;
                });
        },

        event_LevelTwo_PlayerArrivesAtPoliceHQ: function () {
            this.dialogBox = ig.game.getEntitiesByType(EntityDialogPlayer)[0];
            this.camera = ig.game.levelController.camera;
            this.ends = false;

            var policeOfficerLisa = ig.game.getEntityByName('Police Officer Lisa');
            var policeOfficerSteve = ig.game.getEntityByName('Section Chief Steve');

            this.eventChain = EventChain(this)
                .then(function ()
                {
                    ig.game.toggleEventModeInteraction(false);
                })
                .wait(1)
                .then(function ()
                {
                    var officerLisaWalkDestination = ig.game.getEntityByName('lisaWalkDestination_1');
                    policeOfficerLisa.setDestination(officerLisaWalkDestination.pos.x, officerLisaWalkDestination.pos.y);
                    var playerWalkDestination = ig.game.getEntityByName('playerWalkDestination_1');
                    ig.game.player.setDestination(playerWalkDestination.pos.x, playerWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return policeOfficerLisa.hasReachedDestination;
                })
                .then(function ()
                {
                    var dialogSetJSON = [
                        { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'We\'re here. Follow me kid.' }
                    ];
                    this.dialogBox.playDialogSet(dialogSetJSON);
                })
                .waitUntil(function ()
                {
                    return !this.dialogBox.isPlaying;
                })
                .then(function ()
                {
                    var officerLisaWalkDestination = ig.game.getEntityByName('lisaWalkDestination_2');
                    policeOfficerLisa.setDestination(officerLisaWalkDestination.pos.x, officerLisaWalkDestination.pos.y);
                    var playerWalkDestination = ig.game.getEntityByName('playerWalkDestination_2');
                    ig.game.player.setDestination(playerWalkDestination.pos.x, playerWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return policeOfficerLisa.hasReachedDestination;
                })
                .then(function ()
                {
                    var officerLisaWalkDestination = ig.game.getEntityByName('lisaWalkDestination_3');
                    policeOfficerLisa.setDestination(officerLisaWalkDestination.pos.x, officerLisaWalkDestination.pos.y);
                    var playerWalkDestination = ig.game.getEntityByName('playerWalkDestination_3');
                    ig.game.player.setDestination(playerWalkDestination.pos.x, playerWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return policeOfficerLisa.hasReachedDestination;
                })
                .then(function ()
                {
                    var officerLisaWalkDestination = ig.game.getEntityByName('lisaWalkDestination_4');
                    policeOfficerLisa.setDestination(officerLisaWalkDestination.pos.x, officerLisaWalkDestination.pos.y);
                    var playerWalkDestination = ig.game.getEntityByName('playerWalkDestination_4');
                    ig.game.player.setDestination(playerWalkDestination.pos.x, playerWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return policeOfficerLisa.hasReachedDestination;
                })
                .then(function ()
                {
                    var officerLisaWalkDestination = ig.game.getEntityByName('lisaWalkDestination_5');
                    policeOfficerLisa.setDestination(officerLisaWalkDestination.pos.x, officerLisaWalkDestination.pos.y);
                    var playerWalkDestination = ig.game.getEntityByName('playerWalkDestination_5');
                    ig.game.player.setDestination(playerWalkDestination.pos.x, playerWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return policeOfficerLisa.hasReachedDestination;
                })
                .then(function ()
                {
                    var officerLisaWalkDestination = ig.game.getEntityByName('lisaWalkDestination_6');
                    policeOfficerLisa.setDestination(officerLisaWalkDestination.pos.x, officerLisaWalkDestination.pos.y);
                    var playerWalkDestination = ig.game.getEntityByName('playerWalkDestination_6');
                    ig.game.player.setDestination(playerWalkDestination.pos.x, playerWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return policeOfficerLisa.hasReachedDestination;
                })
                .then(function ()
                {
                    var dialogSetJSON = [
                        { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'Listen here kid.' },
                        { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'Your father is a suspected criminal, and we need to stop him from completing the cyborg ASAP.' },
                        { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'So you better cooperate and tell us everything you know.' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_dilemma, autoprogress: 0, text: 'So... You expect me to help you arrest my own dad!?' },
                        { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'Would you rather I arrest you FOR OBSTRUCTION OF JUSTICE INSTEAD!?' }
                    ];
                    this.dialogBox.playDialogSet(dialogSetJSON);
                })
                .waitUntil(function ()
                {
                    return !this.dialogBox.isPlaying;
                })
                .then(function ()
                {
                    var dialogSetJSON = [
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_shock, autoprogress: 0, text: 'I ALREADY TOLD YOU EVERYTHING BUT YOU REFUSE TO BELIEVE THAT MY DAD HAS BEEN KIDNAPPED!' }
                    ];
                    this.dialogBox.playDialogSet(dialogSetJSON);

                    var officerSteveWalkDestination = ig.game.getEntityByName('steveWalkDestination_1');
                    policeOfficerSteve.setDestination(officerSteveWalkDestination.pos.x, officerSteveWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return policeOfficerSteve.hasReachedDestination;
                })
                .then(function ()
                {
                    var dialogSetJSON = [
                        { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'YOU\'RE OBVIOUSLY LYING KID! THIS IS THE LAST WARNING BEFORE I ARREST Y-' },
                        { name: 'Section Chief Steve', side: 'right' , mediaNum: ig.game.dialogFigures.f_steve, autoprogress: 0, text: 'Ahem.' },
                        { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'Go-Good Afternoon Sir. I wa- I was just interrogating the suspect. ' + ig.game.dialogController.avatar[ig.game.avatarID].thirdSubCaps + ' is the ' + ig.game.dialogController.avatar[ig.game.avatarID].child + ' of James Danson, Sir.' },
                        { name: 'Section Chief Steve', side: 'right' , mediaNum: ig.game.dialogFigures.f_steve, autoprogress: 0, text: 'Take a break Lisa. Let me talk to ' + ig.game.dialogController.avatar[ig.game.avatarID].thirdObj + '.' },
                        { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'Yes, Sir.' },
                        { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'I\'m not done with you yet kid.' }
                    ];
                    this.dialogBox.playDialogSet(dialogSetJSON);
                })
                .waitUntil(function ()
                {
                    return !this.dialogBox.isPlaying;
                })
                .then(function ()
                {
                    var officerLisaWalkDestination = ig.game.getEntityByName('lisaWalkDestination_7');
                    policeOfficerLisa.setDestination(officerLisaWalkDestination.pos.x, officerLisaWalkDestination.pos.y);
                    var officerSteveWalkDestination = ig.game.getEntityByName('steveWalkDestination_2');
                    policeOfficerSteve.setDestination(officerSteveWalkDestination.pos.x, officerSteveWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return policeOfficerSteve.hasReachedDestination;
                })
                .then(function ()
                {
                    var officerSteveWalkDestination = ig.game.getEntityByName('steveWalkDestination_3');
                    policeOfficerSteve.setDestination(officerSteveWalkDestination.pos.x, officerSteveWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return policeOfficerSteve.hasReachedDestination;
                })
                .then(function ()
                {
                    var officerSteveWalkDestination = ig.game.getEntityByName('steveWalkDestination_4');
                    policeOfficerSteve.setDestination(officerSteveWalkDestination.pos.x, officerSteveWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return policeOfficerSteve.hasReachedDestination;
                })
                .then(function ()
                {
                    var officerSteveWalkDestination = ig.game.getEntityByName('steveWalkDestination_5');
                    policeOfficerSteve.setDestination(officerSteveWalkDestination.pos.x, officerSteveWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return policeOfficerSteve.hasReachedDestination;
                })
                .then(function ()
                {
                    ig.game.player.orientation = 'down-left';

                    var dialogSetJSON = [
                        { name: 'Section Chief Steve', side: 'right' , mediaNum: ig.game.dialogFigures.f_steve, autoprogress: 0, text: ig.game.dialogController.avatar[ig.game.avatarID].name + '. Am I right?' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_dilemma, autoprogress: 0, text: 'Yes.. Sir?' },
                        { name: 'Section Chief Steve', side: 'right' , mediaNum: ig.game.dialogFigures.f_steve, autoprogress: 0, text: 'Listen to me ' + ig.game.dialogController.avatar[ig.game.avatarID].name + '. Right now, the only lead we have is your father. And we need to find him immediately.' },
                        { name: 'Section Chief Steve', side: 'right' , mediaNum: ig.game.dialogFigures.f_steve, autoprogress: 0, text: 'We\'ve tried looking for him in his office at Thyrin Lab but unfortunately he was not around.' },
                        { name: 'Section Chief Steve', side: 'right' , mediaNum: ig.game.dialogFigures.f_steve, autoprogress: 0, text: 'We then went to your place and all we found was you.' },
                        { name: 'Section Chief Steve', side: 'right' , mediaNum: ig.game.dialogFigures.f_steve, autoprogress: 0, text: 'I\'m going to take the chance and believe you that your father has been kidnapped. But in return, you have to assist us in our investigation.' },
                        { name: 'Section Chief Steve', side: 'right' , mediaNum: ig.game.dialogFigures.f_steve, autoprogress: 0, text: 'Do we have a deal?' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_hesitant, autoprogress: 0, text: 'I don\'t really have a choice, do I?' },
                        { name: 'Section Chief Steve', side: 'right' , mediaNum: ig.game.dialogFigures.f_steve, autoprogress: 0, text: 'I\'m afraid not.' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_hesitant, autoprogress: 0, text: 'What do you need me to do then?' },
                        { name: 'Section Chief Steve', side: 'right' , mediaNum: ig.game.dialogFigures.f_steve, autoprogress: 0, text: 'We seized a bunch of evidence from his office but the problem is some of them are either corrupted or encrypted.' },
                        { name: 'Section Chief Steve', side: 'right' , mediaNum: ig.game.dialogFigures.f_steve, autoprogress: 0, text: 'Since computer security is not really our thing, you can start by helping some of the officers unlock information from the evidence they are working on.' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_disinterested, autoprogress: 0, text: 'What about my dad?' },
                        { name: 'Section Chief Steve', side: 'right' , mediaNum: ig.game.dialogFigures.f_steve, autoprogress: 0, text: 'Well. If what you said about him being kidnapped is true, then we need all the evidence we can get to find him don\'t we?' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_dilemma, autoprogress: 0, text: 'True..' },
                        { name: 'Section Chief Steve', side: 'right' , mediaNum: ig.game.dialogFigures.f_steve, autoprogress: 0, text: 'Good. Now that we have an understanding, get to work then. Come find me at my office when you find some useful information.' }
                    ];
                    this.dialogBox.playDialogSet(dialogSetJSON);
                })
                .waitUntil(function ()
                {
                    return !this.dialogBox.isPlaying;
                })
                .then(function ()
                {
                    var officerSteveWalkDestination = ig.game.getEntityByName('steveWalkDestination_1');
                    policeOfficerSteve.setDestination(officerSteveWalkDestination.pos.x, officerSteveWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return policeOfficerSteve.hasReachedDestination;
                })
                .then(function ()
                {
                    var officerSteveWalkDestination = ig.game.getEntityByName('steveWalkDestination_6');
                    policeOfficerSteve.setDestination(officerSteveWalkDestination.pos.x, officerSteveWalkDestination.pos.y);

                    var dialogSetJSON = [
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_dilemma, autoprogress: 0, text: 'I have to do this quickly... I need to save my Dad.' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_dilemma, autoprogress: 0, text: 'Better get to work.' }
                    ];
                    this.dialogBox.playDialogSet(dialogSetJSON);
                })
                .waitUntil(function ()
                {
                    return !this.dialogBox.isPlaying;
                })
                .then(function ()
                {
                    policeOfficerLisa.orientation = 'down';
                    ig.game.toggleEventModeInteraction(true);
                    ig.game.inGameGUIController.updateObjectives(this.latestEventID);
                    ig.game.getEntitiesByType(EntityLevelSelector)[0].unlockLevels(2);
                    this.ends = true;
                    ig.game.eventID = this.latestEventID;
                })
        },

        event_LevelTwo_PlayerGathersEnoughEvidence: function () {
            this.dialogBox = ig.game.getEntitiesByType(EntityDialogPlayer)[0];
            this.camera = ig.game.levelController.camera;
            this.ends = false;

            this.eventChain = EventChain(this)
                .then(function ()
                {
                    ig.game.toggleEventModeInteraction(false);

                    var dialogSetJSON = [
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_thinking, autoprogress: 0, text: 'I think I\'ve gathered enough evidences.' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_thinking, autoprogress: 0, text: 'I should report my findings to Section Chief Steve right away.' }
                    ];
                    this.dialogBox.playDialogSet(dialogSetJSON);
                })
                .waitUntil(function ()
                {
                    return !this.dialogBox.isPlaying;
                })
                .then(function ()
                {
                    ig.game.toggleEventModeInteraction(true);
                    ig.game.inGameGUIController.updateObjectives(this.latestEventID);
                    this.ends = true;
                    ig.game.eventID = this.latestEventID;
                })


        },

        event_LevelTwo_PlayerReceivesCallFromDaedalus: function () {
            this.dialogBox = ig.game.getEntitiesByType(EntityDialogPlayer)[0];
            this.camera = ig.game.levelController.camera;
            this.ends = false;

            var policeOfficerLisa = ig.game.getEntityByName('Police Officer Lisa');
            var policeOfficerSteve = ig.game.getEntityByName('Section Chief Steve');

            this.eventChain = EventChain(this)
                .then(function ()
                {
                    ig.game.toggleEventModeInteraction(false);
                    ig.game.player.stop();

                    var dialogSetJSON = [
                        { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: ig.game.dialogController.avatar[ig.game.avatarID].name + '!' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_disinterested, autoprogress: 0, text: 'Huh?' }
                    ];
                    this.dialogBox.playDialogSet(dialogSetJSON);
                })
                .waitUntil(function ()
                {
                    return !this.dialogBox.isPlaying;
                })
                .then(function ()
                {
                    var officerLisaWalkDestination = ig.game.getEntityByName('lisaWalkDestination_8');
                    policeOfficerLisa.setDestination(officerLisaWalkDestination.pos.x, officerLisaWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return policeOfficerLisa.hasReachedDestination;
                })
                .then(function ()
                {
                    var officerLisaWalkDestination = ig.game.getEntityByName('lisaWalkDestination_9');
                    policeOfficerLisa.setDestination(officerLisaWalkDestination.pos.x, officerLisaWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return policeOfficerLisa.hasReachedDestination;
                })
                .then(function ()
                {
                    ig.game.player.orientation = 'up-left';

                    var dialogSetJSON = [
                        { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'Did you find anything new?' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_disinterested, autoprogress: 0, text: 'Yeah. Somewhat..' },
                        { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'Good. Let\'s go to Steve. I want to hear what you have found too.' }
                    ];
                    this.dialogBox.playDialogSet(dialogSetJSON);
                })
                .waitUntil(function ()
                {
                    return !this.dialogBox.isPlaying;
                })
                .then(function ()
                {
                    var officerLisaWalkDestination = ig.game.getEntityByName('lisaWalkDestination_10');
                    policeOfficerLisa.setDestination(officerLisaWalkDestination.pos.x, officerLisaWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return policeOfficerLisa.hasReachedDestination;
                })
                .then(function ()
                {
                    var officerLisaWalkDestination = ig.game.getEntityByName('lisaWalkDestination_11');
                    policeOfficerLisa.setDestination(officerLisaWalkDestination.pos.x, officerLisaWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return policeOfficerLisa.hasReachedDestination;
                })
                .then(function ()
                {
                    var officerLisaWalkDestination = ig.game.getEntityByName('lisaWalkDestination_12');
                    policeOfficerLisa.setDestination(officerLisaWalkDestination.pos.x, officerLisaWalkDestination.pos.y);
                    var playerWalkDestination = ig.game.getEntityByName('playerWalkDestination_7');
                    ig.game.player.setDestination(playerWalkDestination.pos.x, playerWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return policeOfficerLisa.hasReachedDestination;
                })
                .then(function ()
                {
                    var officerLisaWalkDestination = ig.game.getEntityByName('lisaWalkDestination_13');
                    policeOfficerLisa.setDestination(officerLisaWalkDestination.pos.x, officerLisaWalkDestination.pos.y);
                    var playerWalkDestination = ig.game.getEntityByName('playerWalkDestination_8');
                    ig.game.player.setDestination(playerWalkDestination.pos.x, playerWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return policeOfficerLisa.hasReachedDestination;
                })
                .then(function ()
                {
                    var officerLisaWalkDestination = ig.game.getEntityByName('lisaWalkDestination_14');
                    policeOfficerLisa.setDestination(officerLisaWalkDestination.pos.x, officerLisaWalkDestination.pos.y);
                    var playerWalkDestination = ig.game.getEntityByName('playerWalkDestination_9');
                    ig.game.player.setDestination(playerWalkDestination.pos.x, playerWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return policeOfficerLisa.hasReachedDestination;
                })
                .then(function ()
                {
                    var officerSteveWalkDestination = ig.game.getEntityByName('steveWalkDestination_7');
                    policeOfficerSteve.setDestination(officerSteveWalkDestination.pos.x, officerSteveWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return policeOfficerLisa.hasReachedDestination;
                })
                .then(function ()
                {
                    var dialogSetJSON = [
                        { name: 'Section Chief Steve', side: 'right' , mediaNum: ig.game.dialogFigures.f_steve, autoprogress: 0, text: 'Ah ' + ig.game.dialogController.avatar[ig.game.avatarID].name + '. I see you\'ve been doing some excellent work. Tell me what you have found.' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_dilemma, autoprogress: 0, text: 'Well.. It seems like everything points to same organization named Daedalus Corp.' },
                        { name: 'Section Chief Steve', side: 'right' , mediaNum: ig.game.dialogFigures.f_steve, autoprogress: 0, text: 'Daedalus? As in the Greek mythology?' },
                        { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'At least we have a new lead now.' },
                        { name: 'Section Chief Steve', side: 'right' , mediaNum: ig.game.dialogFigures.f_steve, autoprogress: 0, text: 'But there is no record of such an organization here.' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_thinking, autoprogress: 0, text: 'Hang on.' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_thinking, autoprogress: 0, text: 'Dad works at Thyrin Lab..' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_thinking, autoprogress: 0, text: 'MINOT-4... Minotaur? Could it be?' },
                        { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'Seems like you\'re on to something kid. What is it?' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_thinking, autoprogress: 0, text: 'Well.. Based on the mythology, Daedalus created a labyrinth to house the Minotaur..' },
                        { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'And?' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_thinking, autoprogress: 0, text: 'If we rearrange the letters in \'Thyrin Lab\'..' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_thinking, autoprogress: 0, text: 'It spells \'Labyrinth\'.' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_thinking, autoprogress: 0, text: 'That\'s it! \'Thyrin Lab\' is an anagram for \'Labyrinth\'!' },
                        { name: 'Section Chief Steve', side: 'right' , mediaNum: ig.game.dialogFigures.f_steve, autoprogress: 0, text: 'You\'re not suggesting..' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_hesitant, autoprogress: 0, text: '<phone ring>' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_hesitant, autoprogress: 0, text: 'Oh? My phone is ringing.' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_hesitant, autoprogress: 0, text: 'Hmm it\'s an unknown number.' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_hesitant, autoprogress: 0, text: 'Hello?' },
                        { name: 'Unknown', side: 'right' , mediaNum: ig.game.dialogFigures.f_justin_silhouette, autoprogress: 0, text: 'Where is the flash drive?' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_hesitant, autoprogress: 0, text: 'Are you working for Daedalus?' },
                        { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: '!!!' },
                        { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'Let me try to trace the call. ' + ig.game.dialogController.avatar[ig.game.avatarID].name + ', keep them on the phone.' }
                    ];
                    this.dialogBox.playDialogSet(dialogSetJSON);
                })
                .waitUntil(function ()
                {
                    return !this.dialogBox.isPlaying;
                })
                .then(function ()
                {
                    var officerLisaWalkDestination = ig.game.getEntityByName('lisaWalkDestination_15');
                    policeOfficerLisa.setDestination(officerLisaWalkDestination.pos.x, officerLisaWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return policeOfficerLisa.hasReachedDestination;
                })
                .then(function ()
                {
                    var officerLisaWalkDestination = ig.game.getEntityByName('lisaWalkDestination_16');
                    policeOfficerLisa.setDestination(officerLisaWalkDestination.pos.x, officerLisaWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return policeOfficerLisa.hasReachedDestination;
                })
                .then(function ()
                {
                    var officerLisaWalkDestination = ig.game.getEntityByName('lisaWalkDestination_17');
                    policeOfficerLisa.setDestination(officerLisaWalkDestination.pos.x, officerLisaWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return policeOfficerLisa.hasReachedDestination;
                })
                .wait(1)
                .then(function ()
                {
                    var officerLisaWalkDestination = ig.game.getEntityByName('lisaWalkDestination_16');
                    policeOfficerLisa.setDestination(officerLisaWalkDestination.pos.x, officerLisaWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return policeOfficerLisa.hasReachedDestination;
                })
                .then(function ()
                {
                    var officerLisaWalkDestination = ig.game.getEntityByName('lisaWalkDestination_15');
                    policeOfficerLisa.setDestination(officerLisaWalkDestination.pos.x, officerLisaWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return policeOfficerLisa.hasReachedDestination;
                })
                .then(function ()
                {
                    var officerLisaWalkDestination = ig.game.getEntityByName('lisaWalkDestination_18');
                    policeOfficerLisa.setDestination(officerLisaWalkDestination.pos.x, officerLisaWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return policeOfficerLisa.hasReachedDestination;
                })
                .then(function ()
                {
                    var dialogSetJSON = [
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_hesitant, autoprogress: 0, text: 'Where is my dad!' },
                        { name: 'Unknown', side: 'right' , mediaNum: ig.game.dialogFigures.f_justin_silhouette, autoprogress: 0, text: 'Where is the flash drive?' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_hesitant, autoprogress: 0, text: 'I have the flash drive with me. Let me talk to my dad!' },
                        { name: 'Unknown', side: 'right' , mediaNum: ig.game.dialogFigures.f_justin_silhouette, autoprogress: 0, text: 'If you ever want to see your father again, you\'d do well to hand the flash drive over to me.' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_hesitant, autoprogress: 0, text: 'I want to talk to my Dad!' },
                        { name: 'Dad', side: 'right' , mediaNum: ig.game.dialogFigures.f_dad, autoprogress: 0, text: ig.game.dialogController.avatar[ig.game.avatarID].name + '! Whatever you do, don\'t hand them the flas-' },
                        { name: 'Unknown', side: 'right' , mediaNum: ig.game.dialogFigures.f_justin_silhouette, autoprogress: 0, text: 'You have till tomorrow to bring it to us.' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_hesitant, autoprogress: 0, text: 'Where am I supposed to meet you?!' },
                        { name: 'Unknown', side: 'right' , mediaNum: ig.game.dialogFigures.f_justin_silhouette, autoprogress: 0, text: 'Your police friends will know.' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_hesitant, autoprogress: 0, text: '<phone line cuts>' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_hesitant, autoprogress: 0, text: 'Hello!?' },
                        { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'Sir. I\'ve triangulated the position.' },
                        { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'The phone call came from a subsidiary of Thryin Lab - Crete Industries.' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: 'Crete.. Daedalus.. Labyrinth.. There\'s got to be a connection!' },
                        { name: 'Section Chief Steve', side: 'right' , mediaNum: ig.game.dialogFigures.f_steve, autoprogress: 0, text: 'You\'re right, ' + ig.game.dialogController.avatar[ig.game.avatarID].name + '.'},
                        { name: 'Section Chief Steve', side: 'right' , mediaNum: ig.game.dialogFigures.f_steve, autoprogress: 0, text: 'Everybody. We have to move out. NOW!' }
                    ];
                    this.dialogBox.playDialogSet(dialogSetJSON);
                })
                .waitUntil(function ()
                {
                    return !this.dialogBox.isPlaying;
                })
                .then(function ()
                {
                    ig.game.levelController.changeLevel('3_Tower_GroundFloor');
                    ig.game.toggleEventModeInteraction(true);
                    ig.game.inGameGUIController.updateObjectives(this.latestEventID);
                    this.ends = true;
                    ig.game.eventID = 9;
                })
        },

        event_LevelThree_PlayerArrivesAtCreteRoboticsTower: function () {
            this.dialogBox = ig.game.getEntitiesByType(EntityDialogPlayer)[0];
            this.camera = ig.game.levelController.camera;
            this.ends = false;

            var policeOfficerLisa = ig.game.getEntityByName('Police Officer Lisa');
            var policeOfficerSteve = ig.game.getEntityByName('Section Chief Steve');

            var policeman1 = ig.game.getEntityByName('Policeman1');
            var policeman2 = ig.game.getEntityByName('Policeman2');
            var policeman3 = ig.game.getEntityByName('Policeman3');
            var policeman4 = ig.game.getEntityByName('Policeman4');
            var policeman5 = ig.game.getEntityByName('Policeman5');
            var policeman6 = ig.game.getEntityByName('Policeman6');

            var toaster17 = ig.game.getEntityByName('SecurityBot 17');
            var toaster11 = ig.game.getEntityByName('SecurityBot 11');
            var toaster88 = ig.game.getEntityByName('SecurityBot 88');

            this.eventChain = EventChain(this)
                .then(function ()
                {
                    ig.game.toggleEventModeInteraction(false);
                })
                .wait(1)
                .then(function ()
                {
                    var police4WalkDestination = ig.game.getEntityByName('police1_walkDestination_1');
                    policeman1.setDestination(police4WalkDestination.pos.x, police4WalkDestination.pos.y);
                    var police6WalkDestination = ig.game.getEntityByName('police2_walkDestination_1');
                    policeman2.setDestination(police6WalkDestination.pos.x, police6WalkDestination.pos.y);
                    var police2WalkDestination = ig.game.getEntityByName('police3_walkDestination_1');
                    policeman3.setDestination(police2WalkDestination.pos.x, police2WalkDestination.pos.y);
                    var police1WalkDestination = ig.game.getEntityByName('police4_walkDestination_1');
                    policeman4.setDestination(police1WalkDestination.pos.x, police1WalkDestination.pos.y);
                    var police3WalkDestination = ig.game.getEntityByName('police5_walkDestination_1');
                    policeman5.setDestination(police3WalkDestination.pos.x, police3WalkDestination.pos.y);
                    var police5WalkDestination = ig.game.getEntityByName('police6_walkDestination_1');
                    policeman6.setDestination(police5WalkDestination.pos.x, police5WalkDestination.pos.y);
                })
                .wait(1)
                .then(function ()
                {
                    var officerLisaWalkDestination = ig.game.getEntityByName('lisaWalkDestination_1');
                    policeOfficerLisa.setDestination(officerLisaWalkDestination.pos.x, officerLisaWalkDestination.pos.y);
                    var officerSteveWalkDestination = ig.game.getEntityByName('steveWalkDestination_1');
                    policeOfficerSteve.setDestination(officerSteveWalkDestination.pos.x, officerSteveWalkDestination.pos.y);
                    var playerWalkDestination = ig.game.getEntityByName('playerWalkDestination_1');
                    ig.game.player.setDestination(playerWalkDestination.pos.x, playerWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return policeOfficerLisa.hasReachedDestination;
                })
                .then(function ()
                {
                    var dialogSetJSON = [
                        { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'Sir. It seems like the place is on lock down.' },
                        { name: 'Section Chief Steve', side: 'right' , mediaNum: ig.game.dialogFigures.f_steve, autoprogress: 0, text: 'I guess we\'re at the right place then.' },
                        { name: 'Section Chief Steve', side: 'right' , mediaNum: ig.game.dialogFigures.f_steve, autoprogress: 0, text: 'Stay alert.' },
                        { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'Yes Sir.' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_shock, autoprogress: 0, text: 'Uhh guys.. What are those?' }
                    ];
                    this.dialogBox.playDialogSet(dialogSetJSON);
                })
                .waitUntil(function ()
                {
                    return !this.dialogBox.isPlaying;
                })
                .then(function ()
                {
                    this.camera.entityToFollow = toaster17;
                })
                .wait(1.5)
                .then(function ()
                {
                    var toaster17WalkDestination = ig.game.getEntityByName('toaster1_walkDestination');
                    toaster17.setDestination(toaster17WalkDestination.pos.x, toaster17WalkDestination.pos.y);
                    var toaster11WalkDestination = ig.game.getEntityByName('toaster2_walkDestination');
                    toaster11.setDestination(toaster11WalkDestination.pos.x, toaster11WalkDestination.pos.y);
                    var toaster88WalkDestination = ig.game.getEntityByName('toaster3_walkDestination');
                    toaster88.setDestination(toaster88WalkDestination.pos.x, toaster88WalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return toaster17.hasReachedDestination;
                })
                .then(function ()
                {
                    var dialogSetJSON = [
                        { name: 'Security Bot 17', side: 'right' , mediaNum: ig.game.dialogFigures.f_toaster, autoprogress: 0, text: 'Defense Mode Activated.' },
                        { name: 'Security Bot 17', side: 'right' , mediaNum: ig.game.dialogFigures.f_toaster, autoprogress: 0, text: 'Deactivating elevator controls.' }
                    ];
                    this.dialogBox.playDialogSet(dialogSetJSON);
                })
                .waitUntil(function ()
                {
                    return !this.dialogBox.isPlaying;
                })
                .then(function ()
                {
                    this.camera.entityToFollow = ig.game.player;
                    var dialogSetJSON = [
                        { name: 'Section Chief Steve', side: 'right' , mediaNum: ig.game.dialogFigures.f_steve, autoprogress: 0, text: 'They are disabling the elevator.' },
                        { name: 'Section Chief Steve', side: 'right' , mediaNum: ig.game.dialogFigures.f_steve, autoprogress: 0, text: ig.game.dialogController.avatar[ig.game.avatarID].name + ', can you see if you can get close enough to deactivate them somehow?' }
                    ];
                    this.dialogBox.playDialogSet(dialogSetJSON);
                })
                .waitUntil(function ()
                {
                    return !this.dialogBox.isPlaying;
                })
                .then(function ()
                {
                    ig.game.toggleEventModeInteraction(true);
                    ig.game.inGameGUIController.updateObjectives(this.latestEventID);
                    ig.game.getEntitiesByType(EntityLevelSelector)[0].unlockLevels(3);
                    this.ends = true;
                    ig.game.eventID = this.latestEventID;
                })
        },

        event_LevelThree_PlayerHeadsToBossRoom: function () {
            this.dialogBox = ig.game.getEntitiesByType(EntityDialogPlayer)[0];
            this.camera = ig.game.levelController.camera;
            this.ends = false;

            var policeOfficerLisa = ig.game.getEntityByName('Police Officer Lisa');
            var policeOfficerSteve = ig.game.getEntityByName('Section Chief Steve');

            this.eventChain = EventChain(this)
                .then(function ()
                {
                    ig.game.toggleEventModeInteraction(false);

                    var officerLisaWalkDestination = ig.game.player;
                    policeOfficerLisa.setDestination(officerLisaWalkDestination.pos.x - 50, officerLisaWalkDestination.pos.y + 20);
                    var officerSteveWalkDestination = ig.game.player;
                    policeOfficerSteve.setDestination(officerSteveWalkDestination.pos.x + 100, officerSteveWalkDestination.pos.y + 20);

                    var dialogSetJSON = [
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'noside' , mediaNum: ig.game.dialogFigures.f_EMPTY, autoprogress: 0, text: '<Elevator whirls to life>' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_cheerful, autoprogress: 0, text: 'Alright! I did it!' }
                    ];
                    this.dialogBox.playDialogSet(dialogSetJSON);
                })
                .waitUntil(function ()
                {
                    return !this.dialogBox.isPlaying && policeOfficerSteve.hasReachedDestination;
                })
                .then(function ()
                {
                    ig.game.player.orientation = 'down';
                    var dialogSetJSON = [
                        { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'Nice work kid.' },
                        { name: 'Section Chief Steve', side: 'right' , mediaNum: ig.game.dialogFigures.f_steve, autoprogress: 0, text: 'Let\'s hurry. We got to find your father.' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_hesitant, autoprogress: 0, text: 'Okay.' }
                    ];
                    this.dialogBox.playDialogSet(dialogSetJSON);
                })
                .waitUntil(function ()
                {
                    return !this.dialogBox.isPlaying;
                })
                .then(function ()
                {
                    ig.game.player.orientation = 'up';
                    var officerSteveWalkDestination = ig.game.getEntityByName('steveWalkDestination_2');
                    policeOfficerSteve.setDestination(officerSteveWalkDestination.pos.x, officerSteveWalkDestination.pos.y);
                    var officerLisaWalkDestination = ig.game.getEntityByName('lisaWalkDestination_2');
                    policeOfficerLisa.setDestination(officerLisaWalkDestination.pos.x, officerLisaWalkDestination.pos.y);
                    var playerWalkDestination = ig.game.getEntityByName('playerWalkDestination_2');
                    ig.game.player.setDestination(playerWalkDestination.pos.x, playerWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return policeOfficerSteve.hasReachedDestination;
                })
                .wait(1)
                .then(function ()
                {
                    ig.game.toggleEventModeInteraction(true);
                    ig.game.levelController.changeLevel('3_Tower_TopFloor');
                    ig.game.inGameGUIController.updateObjectives(this.latestEventID);
                    this.ends = true;
                    ig.game.eventID = this.latestEventID;
                })
        },

        event_LevelThree_PlayerEntersBossRoom: function () {
            this.dialogBox = ig.game.getEntitiesByType(EntityDialogPlayer)[0];
            this.camera = ig.game.levelController.camera;
            this.ends = false;

            var policeOfficerLisa = ig.game.getEntityByName('Police Officer Lisa');
            var policeOfficerSteve = ig.game.getEntityByName('Section Chief Steve');

            var policeman1 = ig.game.getEntityByName('Policeman1');
            var policeman2 = ig.game.getEntityByName('Policeman2');

            var edwin = ig.game.getEntityByName('Edwin');
            var justin = ig.game.getEntityByName('Justin');
            var lilian = ig.game.getEntityByName('Lilian');

            var father = ig.game.getEntityByName('Dad');

            var bossPlatform = ig.game.getEntitiesByType('EntityBossPlatform');
            var boss = null;

            var lightStairs = ig.game.getEntityByName('LightStair');

            this.eventChain = EventChain(this)
                .then(function ()
                {
                    ig.game.toggleEventModeInteraction(false);
                    lightStairs.activate();
                })
                .wait(1.5)
                .then(function ()
                {
                    var police4WalkDestination = ig.game.getEntityByName('police1_walkDestination_1');
                    policeman1.setDestination(police4WalkDestination.pos.x, police4WalkDestination.pos.y);
                    var police6WalkDestination = ig.game.getEntityByName('police2_walkDestination_1');
                    policeman2.setDestination(police6WalkDestination.pos.x, police6WalkDestination.pos.y);

                    var officerLisaWalkDestination = ig.game.getEntityByName('lisaWalkDestination_1');
                    policeOfficerLisa.setDestination(officerLisaWalkDestination.pos.x, officerLisaWalkDestination.pos.y);
                    var officerSteveWalkDestination = ig.game.getEntityByName('steveWalkDestination_1');
                    policeOfficerSteve.setDestination(officerSteveWalkDestination.pos.x, officerSteveWalkDestination.pos.y);
                    var playerWalkDestination = ig.game.getEntityByName('playerWalkDestination_1');
                    ig.game.player.setDestination(playerWalkDestination.pos.x, playerWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return policeOfficerLisa.hasReachedDestination;
                })
                .then(function ()
                {
                    var dialogSetJSON = [
                        { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'Whoa. What is this place?' },
                        { name: 'Section Chief Steve', side: 'right' , mediaNum: ig.game.dialogFigures.f_steve, autoprogress: 0, text: 'Everyone keep your eyes peeled.' },
                        { name: 'Policeman', side: 'right' , mediaNum: ig.game.dialogFigures.f_policeman3, autoprogress: 0, text: 'Yes, Sir.' },
                        { name: 'Section Chief Steve', side: 'right' , mediaNum: ig.game.dialogFigures.f_steve, autoprogress: 0, text: ig.game.dialogController.avatar[ig.game.avatarID].name + ', stay close. This place looks dangerous.' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: 'Okay.' }
                    ];
                    this.dialogBox.playDialogSet(dialogSetJSON);
                })
                .waitUntil(function ()
                {
                    return !this.dialogBox.isPlaying;
                })
                .then(function ()
                {
                    var officerLisaWalkDestination = ig.game.getEntityByName('lisaWalkDestination_2');
                    policeOfficerLisa.setDestination(officerLisaWalkDestination.pos.x, officerLisaWalkDestination.pos.y);
                    var officerSteveWalkDestination = ig.game.getEntityByName('steveWalkDestination_2');
                    policeOfficerSteve.setDestination(officerSteveWalkDestination.pos.x, officerSteveWalkDestination.pos.y);
                    var playerWalkDestination = ig.game.getEntityByName('playerWalkDestination_2');
                    ig.game.player.setDestination(playerWalkDestination.pos.x, playerWalkDestination.pos.y);
                })
                .wait(0.5)
                .then(function ()
                {
                    var police4WalkDestination = ig.game.getEntityByName('police1_walkDestination_2');
                    policeman1.setDestination(police4WalkDestination.pos.x, police4WalkDestination.pos.y);
                })
                .wait(0.2)
                .then(function ()
                {
                    var police6WalkDestination = ig.game.getEntityByName('police2_walkDestination_2');
                    policeman2.setDestination(police6WalkDestination.pos.x, police6WalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return policeOfficerSteve.hasReachedDestination;
                })
                .then(function ()
                {
                    var police4WalkDestination = ig.game.getEntityByName('police1_walkDestination_3');
                    policeman1.setDestination(police4WalkDestination.pos.x, police4WalkDestination.pos.y);
                    var police6WalkDestination = ig.game.getEntityByName('police2_walkDestination_3');
                    policeman2.setDestination(police6WalkDestination.pos.x, police6WalkDestination.pos.y);

                    var officerLisaWalkDestination = ig.game.getEntityByName('lisaWalkDestination_3');
                    policeOfficerLisa.setDestination(officerLisaWalkDestination.pos.x, officerLisaWalkDestination.pos.y);
                    var officerSteveWalkDestination = ig.game.getEntityByName('steveWalkDestination_3');
                    policeOfficerSteve.setDestination(officerSteveWalkDestination.pos.x, officerSteveWalkDestination.pos.y);
                    var playerWalkDestination = ig.game.getEntityByName('playerWalkDestination_3');
                    ig.game.player.setDestination(playerWalkDestination.pos.x, playerWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return ig.game.player.hasReachedDestination;
                })
                .then(function ()
                {
                    this.camera.entityToFollow = ig.game.player;
                    var dialogSetJSON = [
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_shock, autoprogress: 0, text: 'DAD!' }
                    ];
                    this.dialogBox.playDialogSet(dialogSetJSON);
                })
                .waitUntil(function ()
                {
                    return !this.dialogBox.isPlaying;
                })
                .then(function ()
                {
                    this.camera.entityToFollow = edwin;

                    var police4WalkDestination = ig.game.getEntityByName('police1_walkDestination_4');
                    policeman1.setDestination(police4WalkDestination.pos.x, police4WalkDestination.pos.y);
                    var police6WalkDestination = ig.game.getEntityByName('police2_walkDestination_4');
                    policeman2.setDestination(police6WalkDestination.pos.x, police6WalkDestination.pos.y);

                    var officerLisaWalkDestination = ig.game.getEntityByName('lisaWalkDestination_4');
                    policeOfficerLisa.setDestination(officerLisaWalkDestination.pos.x, officerLisaWalkDestination.pos.y);
                    var officerSteveWalkDestination = ig.game.getEntityByName('steveWalkDestination_4');
                    policeOfficerSteve.setDestination(officerSteveWalkDestination.pos.x, officerSteveWalkDestination.pos.y);
                    var playerWalkDestination = ig.game.getEntityByName('playerWalkDestination_4');
                    ig.game.player.setDestination(playerWalkDestination.pos.x, playerWalkDestination.pos.y);

                    var dialogSetJSON = [
                        { name: 'Father', side: 'right' , mediaNum: ig.game.dialogFigures.f_dad_dirty_serious, autoprogress: 0, text: ig.game.dialogController.avatar[ig.game.avatarID].name + '!' }
                    ];
                    this.dialogBox.playDialogSet(dialogSetJSON);
                })
                .waitUntil(function ()
                {
                    return !this.dialogBox.isPlaying && ig.game.player.hasReachedDestination;
                })
                .then(function ()
                {
                    var fatherWalkDestination = ig.game.getEntityByName('fatherWalkDestination_1');
                    father.setDestination(fatherWalkDestination.pos.x, fatherWalkDestination.pos.y);
                    var justinWalkDestination = ig.game.getEntityByName('justinWalkDestination_1');
                    justin.setDestination(justinWalkDestination.pos.x, justinWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return justin.hasReachedDestination && father.hasReachedDestination;
                })
                .then(function ()
                {
                    justin.orientation = 'left';
                    father.orientation = 'down';
                    var dialogSetJSON = [
                        { name: 'Justin', side: 'right' , mediaNum: ig.game.dialogFigures.f_justin, autoprogress: 0, text: 'Not so fast old man.' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_shock, autoprogress: 0, text: 'No! Dad!' },
                        { name: 'Section Chief Steve', side: 'right' , mediaNum: ig.game.dialogFigures.f_steve, autoprogress: 0, text: 'Release the man immediately!' }
                    ];
                    this.dialogBox.playDialogSet(dialogSetJSON);
                })
                .waitUntil(function ()
                {
                    return !this.dialogBox.isPlaying;
                })
                .then(function ()
                {
                    var lilianWalkDestination = ig.game.getEntityByName('lilianWalkDestination_1');
                    lilian.setDestination(lilianWalkDestination.pos.x, lilianWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return lilian.hasReachedDestination;
                })
                .then(function ()
                {
                    var dialogSetJSON = [
                        { name: 'Lilian', side: 'right' , mediaNum: ig.game.dialogFigures.f_lilian, autoprogress: 0, text: 'Not until you hand us the flash drive.' },
                        { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'Enough with the talk!' },
                        { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'Men! Arrest them!' }
                    ];
                    this.dialogBox.playDialogSet(dialogSetJSON);
                })
                .waitUntil(function ()
                {
                    return !this.dialogBox.isPlaying;
                })
                .then(function ()
                {
                    var police4WalkDestination = ig.game.getEntityByName('police1_walkDestination_5');
                    policeman1.setDestination(police4WalkDestination.pos.x, police4WalkDestination.pos.y);
                    var police6WalkDestination = ig.game.getEntityByName('police2_walkDestination_5');
                    policeman2.setDestination(police6WalkDestination.pos.x, police6WalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return policeman1.hasReachedDestination;
                })
                .then(function ()
                {
                    ig.game.screenShaker.timedShake(70,0.3);
                    var dialogSetJSON = [
                        { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'What was that!?' },
                        { name: 'Father', side: 'right' , mediaNum: ig.game.dialogFigures.f_dad_dirty_serious, autoprogress: 0, text: 'No..' },
                        { name: 'Father', side: 'right' , mediaNum: ig.game.dialogFigures.f_dad_dirty_serious, autoprogress: 0, text: 'No.. You can\'t!' }
                    ];
                    this.dialogBox.playDialogSet(dialogSetJSON);
                })
                .waitUntil(function ()
                {
                    return !this.dialogBox.isPlaying;
                })
                .then(function ()
                {
                    bossPlatform[0].playOpenAnimation();
                    boss = bossPlatform[0].boss;
                })
                .wait(2)
                .then(function ()
                {
                    var police4WalkDestination = ig.game.getEntityByName('police1_walkDestination_6');
                    policeman1.setDestination(police4WalkDestination.pos.x, police4WalkDestination.pos.y);
                    var police6WalkDestination = ig.game.getEntityByName('police2_walkDestination_6');
                    policeman2.setDestination(police6WalkDestination.pos.x, police6WalkDestination.pos.y);

                    var officerLisaWalkDestination = ig.game.getEntityByName('lisaWalkDestination_5');
                    policeOfficerLisa.setDestination(officerLisaWalkDestination.pos.x, officerLisaWalkDestination.pos.y);
                    var officerSteveWalkDestination = ig.game.getEntityByName('steveWalkDestination_5');
                    policeOfficerSteve.setDestination(officerSteveWalkDestination.pos.x, officerSteveWalkDestination.pos.y);
                    var playerWalkDestination = ig.game.getEntityByName('playerWalkDestination_5');
                    ig.game.player.setDestination(playerWalkDestination.pos.x, playerWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return ig.game.player.hasReachedDestination;
                })
                .then(function ()
                {
                    policeman1.orientation = 'up';
                    policeman2.orientation = 'up';
                    policeOfficerLisa.orientation = 'up';
                    policeOfficerSteve.orientation = 'up';
                    ig.game.player.orientation = 'up';
                })
                .waitUntil(function ()
                {
                    return bossPlatform[0].state == 'closed' && boss.stateAnimation == 'floating';
                })
                .then(function ()
                {
                    var dialogSetJSON = [
                        { name: 'Section Chief Steve', side: 'right' , mediaNum: ig.game.dialogFigures.f_steve, autoprogress: 0, text: 'What on earth is that thing!?' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_shock, autoprogress: 0, text: 'They\'ve activated the cyborg!' },
                        { name: 'Edwin', side: 'right' , mediaNum: ig.game.dialogFigures.f_edwin, autoprogress: 0, text: 'Behold. Our secret weapon!' },
                        { name: 'Edwin', side: 'right' , mediaNum: ig.game.dialogFigures.f_edwin, autoprogress: 0, text: 'The MINO-4!' },
                        { name: 'Lilian', side: 'right' , mediaNum: ig.game.dialogFigures.f_lilian, autoprogress: 0, text: 'Isn\'t it magnificent?' },
                        { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'You\'re crazy!' },
                        { name: 'Edwin', side: 'right' , mediaNum: ig.game.dialogFigures.f_edwin, autoprogress: 0, text: 'With this, we can take over the world!' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: 'Not as long as I have the flash drive!' },
                        { name: 'Justin', side: 'right' , mediaNum: ig.game.dialogFigures.f_justin, autoprogress: 0, text: 'Hahaha! You don\'t get it yet do you?' },
                        { name: 'Justin', side: 'right' , mediaNum: ig.game.dialogFigures.f_justin, autoprogress: 0, text: 'We didn\'t invite you here to take the flash drive from you.' },
                        { name: 'Lilian', side: 'right' , mediaNum: ig.game.dialogFigures.f_lilian, autoprogress: 0, text: 'We lured you here to destroy it. Together with the rest of you pesky cops!' },
                        { name: 'Section Chief Steve', side: 'right' , mediaNum: ig.game.dialogFigures.f_steve, autoprogress: 0, text: 'This was a trap all along.' },
                        { name: 'Lilian', side: 'right' , mediaNum: ig.game.dialogFigures.f_lilian, autoprogress: 0, text: 'Good. You\'re getting it now.' },
                        { name: 'Edwin', side: 'right' , mediaNum: ig.game.dialogFigures.f_edwin, autoprogress: 0, text: 'Enough. We\'re wasting time here. Let\'s go.' }
                    ];
                    this.dialogBox.playDialogSet(dialogSetJSON);
                })
                .waitUntil(function ()
                {
                    return !this.dialogBox.isPlaying;
                })
                .then(function ()
                {
                    var edwinWalkDestination = ig.game.getEntityByName('edwinWalkDestination_1');
                    edwin.setDestination(edwinWalkDestination.pos.x, edwinWalkDestination.pos.y);
                })
                .wait(1)
                .then(function ()
                {
                    var justinWalkDestination = ig.game.getEntityByName('justinWalkDestination_2');
                    justin.setDestination(justinWalkDestination.pos.x, justinWalkDestination.pos.y);
                })
                .wait(1.5)
                .then(function ()
                {
                    var lilianWalkDestination = ig.game.getEntityByName('lilianWalkDestination_2');
                    lilian.setDestination(lilianWalkDestination.pos.x, lilianWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return lilian.hasReachedDestination;
                })
                .then(function ()
                {
                    lilian.orientation = 'down';
                    var dialogSetJSON = [
                        { name: 'Lilian', side: 'right' , mediaNum: ig.game.dialogFigures.f_lilian, autoprogress: 0, text: 'Bye~' }
                    ];
                    this.dialogBox.playDialogSet(dialogSetJSON);
                })
                .waitUntil(function ()
                {
                    return !this.dialogBox.isPlaying;
                })
                .then(function ()
                {
                    var lilianWalkDestination = ig.game.getEntityByName('lilianWalkDestination_3');
                    lilian.setDestination(lilianWalkDestination.pos.x, lilianWalkDestination.pos.y);

                    var dialogSetJSON = [
                        { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'STOP THEM!' }
                    ];
                    this.dialogBox.playDialogSet(dialogSetJSON);
                })
                .waitUntil(function ()
                {
                    return !this.dialogBox.isPlaying;
                })
                .wait(0.3)
                .then(function ()
                {
                    lightStairs.deactivate();
                    var police4WalkDestination = ig.game.getEntityByName('police1_walkDestination_5');
                    policeman1.setDestination(police4WalkDestination.pos.x, police4WalkDestination.pos.y);
                    var police6WalkDestination = ig.game.getEntityByName('police2_walkDestination_5');
                    policeman2.setDestination(police6WalkDestination.pos.x, police6WalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return policeman1.hasReachedDestination;
                })
                .then(function ()
                {
                    ig.game.screenShaker.timedShake(70,0.3);
                    var dialogSetJSON = [
                        { name: 'MINO-4', side: 'right' , mediaNum: ig.game.dialogFigures.f_EMPTY, autoprogress: 0, text: 'RAWRR!' },
                        { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'Tsk! They\'re getting away! The cyborg is cutting us off!' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: 'I have to get to Dad!' },
                        { name: 'Section Chief Steve', side: 'right' , mediaNum: ig.game.dialogFigures.f_steve, autoprogress: 0, text: 'No! Stay back! The cyborg is dangerous!' },
                        { name: 'Father', side: 'right' , mediaNum: ig.game.dialogFigures.f_dad_dirty_serious, autoprogress: 0, text: ig.game.dialogController.avatar[ig.game.avatarID].name + '! Use Theseus! It\'s the only way to stop the cyborg!'},
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: 'Theseus was built for that?' },
                        { name: 'Father', side: 'right' , mediaNum: ig.game.dialogFigures.f_dad_dirty_serious, autoprogress: 0, text: 'YES! NOW HURRY!'},
                        { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'You can do it kid! You\'re our only hope!' },
                        { name: 'Section Chief Steve', side: 'right' , mediaNum: ig.game.dialogFigures.f_steve, autoprogress: 0, text: 'EVERYONE! Protect ' + ig.game.dialogController.avatar[ig.game.avatarID].name + '! We\'ll buy ' + ig.game.dialogController.avatar[ig.game.avatarID].thirdObj + ' some time to hack into the cyborg!' },
                        { name: 'Policeman', side: 'right' , mediaNum: ig.game.dialogFigures.f_policeman2, autoprogress: 0, text: 'Yes, Sir.' },
                        { name: 'Section Chief Steve', side: 'right' , mediaNum: ig.game.dialogFigures.f_steve, autoprogress: 0, text: 'It\'s all up to you now!' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: 'Let\'s do this!' }
                    ];
                    this.dialogBox.playDialogSet(dialogSetJSON);
                })
                .waitUntil(function ()
                {
                    return !this.dialogBox.isPlaying;
                })
                .then(function ()
                {
                    this.camera.entityToFollow = ig.game.player;
                    ig.game.toggleEventModeInteraction(true);
                    ig.game.inGameGUIController.updateObjectives(this.latestEventID);
                    ig.game.getEntitiesByType(EntityLevelSelector)[0].unlockLevels(4);
                    this.ends = true;
                    ig.game.eventID = this.latestEventID;

                    ig.game.getEntitiesByType(EntityBossFight)[0].enterBossFight();
                })
        },

        event_LevelThree_PlayerDefeatsBoss: function () {
            this.dialogBox = ig.game.getEntitiesByType(EntityDialogPlayer)[0];
            this.camera = ig.game.levelController.camera;
            this.ends = false;

            var policeOfficerLisa = ig.game.getEntityByName('Police Officer Lisa');
            var policeOfficerSteve = ig.game.getEntityByName('Section Chief Steve');
            var policeman1 = ig.game.getEntityByName('Policeman1');
            var policeman2 = ig.game.getEntityByName('Policeman2');
            var father = ig.game.getEntityByName('Dad');

            var lightStairs = ig.game.getEntityByName('LightStair');

            this.eventChain = EventChain(this)
                .then(function ()
                {
                    ig.game.toggleEventModeInteraction(false);

                    policeman1.orientation = 'down';
                    policeman2.orientation = 'down';
                    var officerLisaWalkDestination = ig.game.getEntityByName('lisaWalkDestination_6');
                    policeOfficerLisa.setDestination(officerLisaWalkDestination.pos.x, officerLisaWalkDestination.pos.y);
                    var officerSteveWalkDestination = ig.game.getEntityByName('steveWalkDestination_6');
                    policeOfficerSteve.setDestination(officerSteveWalkDestination.pos.x, officerSteveWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return !policeOfficerSteve.hasReachedDestination;
                })
                .then(function ()
                {
                    var dialogSetJSON = [
                        { name: 'Section Chief Steve', side: 'right' , mediaNum: ig.game.dialogFigures.f_steve, autoprogress: 0, text: 'You did it!' },
                        { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'Nice work, kid!' },
                        { name: 'Father', side: 'right' , mediaNum: ig.game.dialogFigures.f_dad_dirty_happy, autoprogress: 0, text: ig.game.dialogController.avatar[ig.game.avatarID].name + '!'},
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_tearful, autoprogress: 0, text: 'Dad!' }
                    ];
                    this.dialogBox.playDialogSet(dialogSetJSON);
                })
                .waitUntil(function ()
                {
                    return !this.dialogBox.isPlaying;
                })
                .then(function ()
                {
                    var fatherWalkDestination = ig.game.getEntityByName('fatherWalkDestination_2');
                    father.setDestination(fatherWalkDestination.pos.x, fatherWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return father.hasReachedDestination;
                })
                .then(function ()
                {
                    var fatherWalkDestination = ig.game.getEntityByName('fatherWalkDestination_3');
                    father.setDestination(fatherWalkDestination.pos.x, fatherWalkDestination.pos.y);
                    var officerLisaWalkDestination = ig.game.getEntityByName('lisaWalkDestination_7');
                    policeOfficerLisa.setDestination(officerLisaWalkDestination.pos.x, officerLisaWalkDestination.pos.y);
                    var officerSteveWalkDestination = ig.game.getEntityByName('steveWalkDestination_7');
                    policeOfficerSteve.setDestination(officerSteveWalkDestination.pos.x, officerSteveWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return father.hasReachedDestination;
                })
                .then(function ()
                {
                    policeOfficerLisa.orientation = 'down';
                    policeOfficerSteve.orientation = 'down';

                    var dialogSetJSON = [
                        { name: 'Father', side: 'right' , mediaNum: ig.game.dialogFigures.f_dad_dirty_happy, autoprogress: 0, text: 'I am proud of you ' + ig.game.dialogController.avatar[ig.game.avatarID].name + '.'},
                        { name: 'Father', side: 'right' , mediaNum: ig.game.dialogFigures.f_dad_dirty_happy, autoprogress: 0, text: 'You have saved not only me..'},
                        { name: 'Father', side: 'right' , mediaNum: ig.game.dialogFigures.f_dad_dirty_happy, autoprogress: 0, text: 'But the entire world.'},
                        { name: 'Section Chief Steve', side: 'right' , mediaNum: ig.game.dialogFigures.f_steve, autoprogress: 0, text: 'Yeah we couldn\'t have done it without you, ' + ig.game.dialogController.avatar[ig.game.avatarID].name + '.'},
                        { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'But Daedalus has managed to escape and they have deactivated the bridge behind them.' },
                        { name: 'Father', side: 'right' , mediaNum: ig.game.dialogFigures.f_dad_dirty_happy, autoprogress: 0, text: 'I can fix that. I happen to have control over the building systems here.'},
                        { name: 'Father', side: 'right' , mediaNum: ig.game.dialogFigures.f_dad_dirty_happy, autoprogress: 0, text: 'It\'ll just take a second.'}
                    ];
                    this.dialogBox.playDialogSet(dialogSetJSON);
                })
                .waitUntil(function ()
                {
                    return !this.dialogBox.isPlaying;
                })
                .then(function ()
                {
                    policeOfficerLisa.orientation = 'up';
                    policeOfficerSteve.orientation = 'up';
                    policeman1.orientation = 'up';
                    policeman2.orientation = 'up';
                    father.orientation = 'up';
                })
                .wait(0.5)
                .then(function ()
                {
                    this.camera.entityToFollow = lightStairs;
                })
                .wait(1)
                .then(function ()
                {
                    lightStairs.activate();
                })
                .wait(1)
                .then(function ()
                {
                    this.camera.entityToFollow = ig.game.player;

                    policeOfficerLisa.orientation = 'down';
                    policeOfficerSteve.orientation = 'down';
                    policeman1.orientation = 'down';
                    policeman2.orientation = 'down';
                    father.orientation = 'down';

                    var dialogSetJSON = [
                        { name: 'Father', side: 'right' , mediaNum: ig.game.dialogFigures.f_dad_dirty_happy, autoprogress: 0, text: 'There we go.'},
                        { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'Alright!' },
                        { name: 'Section Chief Steve', side: 'right' , mediaNum: ig.game.dialogFigures.f_steve, autoprogress: 0, text: 'We should give chase. They couldn\'t have gone far.'},
                        { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'Yes, Sir.' },
                        { name: 'Father', side: 'right' , mediaNum: ig.game.dialogFigures.f_dad_dirty_serious, autoprogress: 0, text: 'Daedalus is probably gone by now.'},
                        { name: 'Father', side: 'right' , mediaNum: ig.game.dialogFigures.f_dad_dirty_serious, autoprogress: 0, text: 'They were planning to abandon this hideout from the start.'},
                        { name: 'Father', side: 'right' , mediaNum: ig.game.dialogFigures.f_dad_dirty_serious, autoprogress: 0, text: 'But they have left much of their work behind. You can probably investigate the place for leads.'},
                        { name: 'Father', side: 'right' , mediaNum: ig.game.dialogFigures.f_dad_dirty_serious, autoprogress: 0, text: 'There are secret rooms across the bridge. You should start there.'},
                        { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'Let\'s get to work then.' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_cheerful, autoprogress: 0, text: 'I\'ll to come to!' },
                        { name: 'Section Chief Steve', side: 'right' , mediaNum: ig.game.dialogFigures.f_steve, autoprogress: 0, text: 'You should stay with your dad, ' + ig.game.dialogController.avatar[ig.game.avatarID].name + '.'},
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: 'But..' },
                        { name: 'Father', side: 'right' , mediaNum: ig.game.dialogFigures.f_dad_dirty_happy, autoprogress: 0, text: 'It\'s alright, officer. Bring ' + ig.game.dialogController.avatar[ig.game.avatarID].name + ' with you.'},
                        { name: 'Father', side: 'right' , mediaNum: ig.game.dialogFigures.f_dad_dirty_happy, autoprogress: 0, text: ig.game.dialogController.avatar[ig.game.avatarID].thirdSubCaps + ' could be of help.'},
                        { name: 'Section Chief Steve', side: 'right' , mediaNum: ig.game.dialogFigures.f_steve, autoprogress: 0, text: 'Alright then. Thank you, Mr. Danson. We\'ll keep ' + ig.game.dialogController.avatar[ig.game.avatarID].name + ' safe.'},
                        { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'Let\'s go.' },
                        { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_cheerful, autoprogress: 0, text: 'Thanks, Dad!' },
                        { name: 'Father', side: 'right' , mediaNum: ig.game.dialogFigures.f_dad_dirty_happy, autoprogress: 0, text: 'Stay safe, ' + ig.game.dialogController.avatar[ig.game.avatarID].name + '. I\'ll see you at home.'}
                    ];
                    this.dialogBox.playDialogSet(dialogSetJSON);
                })
                .waitUntil(function ()
                {
                    return !this.dialogBox.isPlaying;
                })
                .then(function ()
                {
                    var fatherWalkDestination = ig.game.getEntityByName('fatherWalkDestination_4');
                    father.setDestination(fatherWalkDestination.pos.x, fatherWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return father.hasReachedDestination;
                })
                .then(function ()
                {
                    father.orientation = 'up';
                    var officerLisaWalkDestination = ig.game.getEntityByName('edwinWalkDestination_1');
                    policeOfficerLisa.setDestination(officerLisaWalkDestination.pos.x, officerLisaWalkDestination.pos.y);
                    var officerSteveWalkDestination = ig.game.getEntityByName('edwinWalkDestination_1');
                    policeOfficerSteve.setDestination(officerSteveWalkDestination.pos.x, officerSteveWalkDestination.pos.y);
                    var police1WalkDestination = ig.game.getEntityByName('edwinWalkDestination_1');
                    policeman1.setDestination(police1WalkDestination.pos.x, police1WalkDestination.pos.y);
                    var police2WalkDestination = ig.game.getEntityByName('edwinWalkDestination_1');
                    policeman2.setDestination(police2WalkDestination.pos.x, police2WalkDestination.pos.y);
                    var playerWalkDestination = ig.game.getEntityByName('edwinWalkDestination_1');
                    ig.game.player.setDestination(playerWalkDestination.pos.x, playerWalkDestination.pos.y);
                })
                .waitUntil(function ()
                {
                    return ig.game.player.hasReachedDestination;
                })
                .then(function ()
                {
                    ig.game.toggleEventModeInteraction(true);
                    ig.game.levelController.changeLevel('4_Tower_SecretFloor');
                    ig.game.inGameGUIController.updateObjectives(this.latestEventID);
                    this.ends = true;
                    ig.game.eventID = this.latestEventID;


//                        ig.game.menuController.loadThankYouScreen();
//                        ig.game.toggleEventModeInteraction(false);
                })
        },

        event_LevelOne_Chat: function () {
            var parameters = {text: 'I gnikcuf pwn. doirep.', tracks: ig.game.dialogController.avatar[ig.game.avatarID].name, margin: 0, lifeSpan: 5, shape: 'rounded', name: 'playerBubble', color:[255,255,255], opacity: 1};
            ig.game.spawnEntity(EntityChatbubble, 0, 0, parameters);
            console.log(ig.game.getEntitiesByType(EntityChatbubble)[0].text);
        }

    });

});
