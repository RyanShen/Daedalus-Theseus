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
                        break
                    case 7:
                        this.event_LevelTwo_PlayerArrivesAtPoliceHQ(eventTrigger);
                        break;
                    case 9:
                        this.event_LevelTwo_PlayerGathersEnoughEvidence(eventTrigger);
                        break;
                    case 8:
                        this.event_LevelTwo_PlayerReceivesCallFromDaedalus(eventTrigger);
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
                        ig.game.player.orientation = 'down-right';
                        var dialogSetJSON = [
                            { name: 'Father', side: 'right', mediaNum: ig.game.dialogFigures.f_dad, autoprogress: 0, text: 'Wow '+ ig.game.dialogController.avatar[ig.game.avatarID].nickname+'! Just completed another CTF?' },
                            { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_cheerful, autoprogress: 0, text: 'Yup! Piece of cake!' },
                            { name: 'Father', side: 'right', mediaNum: ig.game.dialogFigures.f_dad, autoprogress: 0, text: 'With your computer skills and my experience in robotics, we could do something really awesome one day!' },
                            { name: 'Father', side: 'right', mediaNum: ig.game.dialogFigures.f_dad, autoprogress: 0, text: 'But '+ ig.game.dialogController.avatar[ig.game.avatarID].nickname+'.. always remember this. You must only use your skills for the good of mankind. Promise me that.' },
                            { name: 'Father', side: 'right', mediaNum: ig.game.dialogFigures.f_dad, autoprogress: 0, text: 'Here. Take this flash drive. I need you to look after this.' },
                            { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'noside', mediaNum: ig.game.dialogFigures.f_EMPTY, autoprogress: 0, text: '<Received Flash Drive from Dad.>' },
                            { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_hesitant, autoprogress: 0, text: 'What\'s up Dad? You\'re acting a little weird.' },
                            { name: 'Father', side: 'right', mediaNum: ig.game.dialogFigures.f_dad, autoprogress: 0, text: 'It contains a very important piece of software. You have to keep it safe. Promis-' },
                            { name: 'Father', side: 'noside', mediaNum: ig.game.dialogFigures.f_EMPTY, autoprogress: 0, text: '<Doorbell rings.>' },
                            { name: 'Father', side: 'right', mediaNum: ig.game.dialogFigures.f_dad, autoprogress: 0, text: 'Oh no. It\'s them! This is not good.' },
                            { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_shock, autoprogress: 0, text: 'Dad.. Whats going on?' },
                            { name: 'Father', side: 'right', mediaNum: ig.game.dialogFigures.f_dad, autoprogress: 0, text: ''+ ig.game.dialogController.avatar[ig.game.avatarID].nickname+'. Stay here and be quiet. I\'ll answer the door.' },
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
                            { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_shock, autoprogress: 0, text: 'I have to find out what\'s going on downstairs!' }
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
                        this.ends = true;
                    });
            },

            event_LevelOne_PlayerLooksForFather: function () {
                this.dialogBox = ig.game.getEntitiesByType(EntityDialogPlayer)[0];
                this.camera = ig.game.levelController.camera;
                this.ends = false;

                this.eventChain = EventChain(this)
                    .then(function ()
                    {
                        ig.game.player.setMovementLock(true);
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
                        ig.game.player.setMovementLock(false);
                        ig.game.inGameGUIController.updateObjectives(this.latestEventID);
                        this.ends = true;
                    });
            },

            event_LevelOne_PlayerDecidesToInvestigateFlashDrive: function () {
                this.dialogBox = ig.game.getEntitiesByType(EntityDialogPlayer)[0];
                this.camera = ig.game.levelController.camera;
                this.ends = false;

                this.eventChain = EventChain(this)
                    .then(function ()
                    {
                        ig.game.player.setMovementLock(true);
                        ig.game.player.stop();
                        var dialogSetJSON = [
                            { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_shock, autoprogress: 0, text: 'Dad\'s not here! What\'s going on?' },
                            { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_shock, autoprogress: 0, text: 'Who were those people?' },
                            { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_shock, autoprogress: 0, text: 'Where did they take Dad?' },
                            { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_dilemma, autoprogress: 0, text: 'I better call the police.' },
                            { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_dilemma, autoprogress: 0, text: '...' },
                            { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_thinking, autoprogress: 0, text: 'Wait a minute.' },
                            { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_thinking, autoprogress: 0, text: 'Does this have something to do with the flash drive?' },
                            { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_thinking, autoprogress: 0, text: 'I should check it out on my computer first.' }
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
                        this.ends = true;
                    });
            },

            event_LevelOne_PlayerAccessesFlashDrive: function () {
                this.dialogBox = ig.game.getEntitiesByType(EntityDialogPlayer)[0];
                this.camera = ig.game.levelController.camera;
                this.ends = false;

                this.eventChain = EventChain(this)
                    .then(function ()
                    {
                        ig.game.player.setMovementLock(true);
                        var dialogSetJSON = [
                            { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_hesitant, autoprogress: 0, text: 'Woah. Look\'s like THESEUS is some kind of fancy hacking software.' },
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
                        ig.game.player.setMovementLock(false);
                        ig.game.inGameGUIController.updateObjectives(this.latestEventID);
                        this.ends = true;
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
                        ig.game.player.setMovementLock(true);
                        var dialogSetJSON = [
                            { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_cheerful, autoprogress: 0, text: 'I got in! This THESEUS software seems pretty nifty. Now let\'s see if I can find anything on his computer...' },
                            { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_shock, autoprogress: 0, text: 'What\'s this? Looks like some kind of blueprint for a... WHAT!?' },
                            { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_shock, autoprogress: 0, text: 'A cyborg!?' },
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
                            { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'ARE YOU JUSTIN DANSON?' },
                            { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_shock, autoprogress: 0, text: 'Ye..yes? What\'s going on here officer? Why are you in my house? I haven\'t even called you yet?' },
                            { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'We are looking for your father, Edwin Danson! WHERE IS HE?' },
                            { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_shock, autoprogress: 0, text: 'My dad just got kidnapped! I NEED YOUR HELP!' },
                            { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'WHAT!? Stop lying '+ ig.game.dialogController.avatar[ig.game.avatarID].nickname+'! TELL US WHERE IS HE HIDING!' },
                            { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_shock, autoprogress: 0, text: 'What! Why would I be lying!? Some people came and took him away just now!' },
                            { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'IF THAT IS SO, WHY DIDN\'T YOU CALL US!' },
                            { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_shock, autoprogress: 0, text: 'I was just about to when you guys showed up!' },
                            { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: '...' },
                            { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'Sergeant. Report this back to HQ.' },
                            { name: 'Policeman', side: 'right' , mediaNum: ig.game.dialogFigures.f_policeman1, autoprogress: 0, text: 'Yes Ma\'am.' }
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
                            { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'Edwin Danson is building a dangerous weapon.' },
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
                            { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'TELL ME NOW BOY!' },
                            { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_shock, autoprogress: 0, text: 'I.. I.. I uhh.. overheard the kidnappers talking about it.' },
                            { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'ALRIGHT THAT\'S IT! YOU\'RE COMING WITH US BOY. YOU\'RE GOING TO TELL US EXACTLY WHAT HAPPENED.' },
                            { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_shock, autoprogress: 0, text: 'What now!? Am I under arrest?' },
                            { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'You will be if you DON\'T START COOPERATING!' },
                            { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'Be done with whatever you\'re doing and meet me downstairs at the front door when you are ready to leave.' },
                            { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'And don\'t you try anything funny boy. I\'m watching you.' }
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
                            { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_hesitant, autoprogress: 0, text: 'I better keep THESEUS and the blueprints with me. Just in case.' },
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
                        ig.game.player.setMovementLock(false);
                        ig.game.inGameGUIController.updateObjectives(this.latestEventID);
                        this.ends = true;
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
                        ig.game.player.setMovementLock(true);
                        ig.game.player.stop();
                        policeOfficerLisa.orientation = 'up';

                        var dialogSetJSON = [
                            { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, text: 'You sure took your time boy. Let\'s go.' }
                        ];
                        this.dialogBox.playDialogSet(dialogSetJSON);
                    })
                    .waitUntil(function ()
                    {
                        return !this.dialogBox.isPlaying;
                    })
                    .then(function ()
                    {
                        /*                    ig.game.menuController.loadThankYouScreen();
                         ig.game.player.setMovementLock(false);
                         ig.game.inGameGUIController.updateObjectives(this.latestEventID);
                         ig.game.inGameGUIController.toggleObjectiveBox(false);
                         */
                        ig.game.levelController.loadLevel('2_PoliceHQ_GroundFloor');
                        ig.game.player.setMovementLock(false);
                        ig.game.inGameGUIController.updateObjectives(this.latestEventID);
                        this.ends = true;
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
                        ig.game.player.setMovementLock(true);
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
                            { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'We\'re here. Follow me boy.' }
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
                            { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'Listen here boy.' },
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
                            { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'YOU\'RE OBVIOUSLY LYING BOY! THIS IS THE LAST WARNING BEFORE I ARREST Y-' },
                            { name: 'Section Chief Steve', side: 'right' , mediaNum: ig.game.dialogFigures.f_steve, autoprogress: 0, text: 'Ahem.' },
                            { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'Go-Good Afternoon Sir. I wa- I was just interrogating the suspect. He is the son of Edwin Danson, Sir.' },
                            { name: 'Section Chief Steve', side: 'right' , mediaNum: ig.game.dialogFigures.f_steve, autoprogress: 0, text: 'Take a break Lisa. Let me talk to him.' },
                            { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'Yes Sir.' },
                            { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'I\'m not done with you yet boy.' }
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
                            { name: 'Section Chief Steve', side: 'right' , mediaNum: ig.game.dialogFigures.f_steve, autoprogress: 0, text: 'Justin. Am I right?' },
                            { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_dilemma, autoprogress: 0, text: 'Yes.. Sir?' },
                            { name: 'Section Chief Steve', side: 'right' , mediaNum: ig.game.dialogFigures.f_steve, autoprogress: 0, text: 'Listen to me Justin. Right now, the only lead we have is your father. And we need to find him immediately.' },
                            { name: 'Section Chief Steve', side: 'right' , mediaNum: ig.game.dialogFigures.f_steve, autoprogress: 0, text: 'I\'m going to take the chance and believe you that your father has been kidnapped. But in return, you have to assist us in our investigation.' },
                            { name: 'Section Chief Steve', side: 'right' , mediaNum: ig.game.dialogFigures.f_steve, autoprogress: 0, text: 'Do we have a deal?' },
                            { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_hesitant, autoprogress: 0, text: 'I don\'t really have a choice, do I?' },
                            { name: 'Section Chief Steve', side: 'right' , mediaNum: ig.game.dialogFigures.f_steve, autoprogress: 0, text: 'I\'m afraid not.' },
                            { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_hesitant, autoprogress: 0, text: 'What do you need me to do then?' },
                            { name: 'Section Chief Steve', side: 'right' , mediaNum: ig.game.dialogFigures.f_steve, autoprogress: 0, text: 'We have a bunch of evidence for this case but the problem is some of them are either corrupted or encrypted.' },
                            { name: 'Section Chief Steve', side: 'right' , mediaNum: ig.game.dialogFigures.f_steve, autoprogress: 0, text: 'We know about your hacking abilities. So you can start by helping some of the officers unlock information from the evidence they are working on.' },
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
                        ig.game.player.setMovementLock(false);
                        ig.game.inGameGUIController.updateObjectives(this.latestEventID);
                        this.ends = true;
                    })
            },

            event_LevelTwo_PlayerGathersEnoughEvidence: function () {
                this.dialogBox = ig.game.getEntitiesByType(EntityDialogPlayer)[0];
                this.camera = ig.game.levelController.camera;
                this.ends = false;

                this.eventChain = EventChain(this)
                    .then(function ()
                    {
                        ig.game.player.setMovementLock(true);

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
                        ig.game.player.setMovementLock(false);
                        ig.game.inGameGUIController.updateObjectives(this.latestEventID);
                        this.ends = true;
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
                        ig.game.player.setMovementLock(true);
                        ig.game.player.stop();

                        var dialogSetJSON = [
                            { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'Justin!' },
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
                            { name: 'Section Chief Steve', side: 'right' , mediaNum: ig.game.dialogFigures.f_steve, autoprogress: 0, text: 'Ah. Justin I see you\'ve been doing some excellent work. Tell me what you have found.' },
                            { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_dilemma, autoprogress: 0, text: 'Well.. It seems like everything points to same organization named Daedalus Corp.' },
                            { name: 'Section Chief Steve', side: 'right' , mediaNum: ig.game.dialogFigures.f_steve, autoprogress: 0, text: 'Daedalus? As in the Greek mythology?' },
                            { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'At least we have a new lead now.' },
                            { name: 'Section Chief Steve', side: 'right' , mediaNum: ig.game.dialogFigures.f_steve, autoprogress: 0, text: 'But there is no record of such an organization here.' },
                            { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_hesitant, autoprogress: 0, text: 'I don\'t really have a choice, do I?' },
                            { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_hesitant, autoprogress: 0, text: '<phone ring>' },
                            { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_hesitant, autoprogress: 0, text: 'Oh? My phone is ringing.' },
                            { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_hesitant, autoprogress: 0, text: 'Hmm it\'s an unknown number.' },
                            { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_hesitant, autoprogress: 0, text: 'Hello?' },
                            { name: 'Unknown', side: 'right' , mediaNum: ig.game.dialogFigures.f_EMPTY, autoprogress: 0, text: 'Where is the flash drive?' },
                            { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_hesitant, autoprogress: 0, text: 'WHO IS THIS!? WHAT HAVE YOU DONE WITH MY DAD!?' },
                            { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: '!!!' },
                            { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'Let me try to trace the call. Justin keep them on the phone.' },
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
                            { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_hesitant, autoprogress: 0, text: 'I have the flash drive with me. Let me talk to my dad!' },
                            { name: 'Unknown', side: 'right' , mediaNum: ig.game.dialogFigures.f_EMPTY, autoprogress: 0, text: 'If you ever want to see your father again, you\'d do well to hand the flash drive over to me.' },
                            { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_hesitant, autoprogress: 0, text: 'I want to talk to my Dad!' },
                            { name: 'Dad', side: 'right' , mediaNum: ig.game.dialogFigures.f_dad, autoprogress: 0, text: 'Son! Whatever you do, don\'t hand them the flas-' },
                            { name: 'Unknown', side: 'right' , mediaNum: ig.game.dialogFigures.f_EMPTY, autoprogress: 0, text: 'You have till tomorrow to bring it to us.' },
                            { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_hesitant, autoprogress: 0, text: 'Where am I suppose to meet you?!' },
                            { name: 'Unknown', side: 'right' , mediaNum: ig.game.dialogFigures.f_EMPTY, autoprogress: 0, text: 'Your police friends will know.' },
                            { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_hesitant, autoprogress: 0, text: '<phone line cuts>' },
                            { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_hesitant, autoprogress: 0, text: 'Hello!?' },
                            { name: 'Officer Lisa', side: 'right' , mediaNum: ig.game.dialogFigures.f_lisa, autoprogress: 0, text: 'Sir. I\'ve triangulated the position. It\'s coming from a building a couple of blocks away.' },
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
                        ig.game.levelController.loadLevel('3_Tower_GroundFloor');
                        ig.game.player.setMovementLock(false);
                        ig.game.inGameGUIController.updateObjectives(this.latestEventID);
                        this.ends = true;
                    })
            },

            event_LevelOne_Chat: function () {
                var parameters = {text: 'I fucking pwn. period.', tracks: ig.game.dialogController.avatar[ig.game.avatarID].name, margin: 0, lifeSpan: 5, shape: 'rounded', name: 'playerBubble', color:[255,255,255], opacity: 1};
                ig.game.spawnEntity(EntityChatbubble, 0, 0, parameters);
                console.log(ig.game.getEntitiesByType(EntityChatbubble)[0].text);
            }

        });

    });
