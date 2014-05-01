ig.module(
	'game.classes.levelController'
)
.requires(
	'impact.system',
    'game.classes.screen-fader'
)
.defines(function(){ "use strict";

    ig.LevelController = ig.Class.extend({

        currentLevel: null,
        screenFader: null,

        levelNameFont: new ig.Font('media/Fonts/levelname_text.png'),
        drawLevelNameText: false,
        currentLevelName: null,
        fadeOutTimer: new ig.Timer(),
        fadeOutDuration: 3,

        camera: null,

        init: function() {
        },

        update: function() {
            if (this.camera)
                this.camera.follow();

            this.fadeLevelNameSplash();

        },

        draw: function() {
            /*if(this.camera)
                this.camera.draw();*/
            if (this.screenFader) {
                this.screenFader.draw();
            }

            if (this.drawLevelNameText)
                this.levelNameFont.draw(this.currentLevelName, 512, 200, ig.Font.ALIGN.CENTER);
        },

        loadTeamSelect: function() {
            ig.game.loadLevel(Level0_TeamSelect);
            ig.game.spawnEntity(EntityTeamSelect, 0, 0);
            this.fadeScreenFromBlack();
        },

        /* Load Character Selector Entity */
        loadCharacterSelect: function() {
            ig.game.loadLevel(Level0_CharacterSelect);
            ig.game.spawnEntity(EntityCharacterSelect, 0, 0);
            this.fadeScreenFromBlack();
        },

        loadNewGameLevel: function() {
            ig.game.loadLevel(Level1_House_UpperFloor);
            var spawnpoint = ig.game.getEntityByName('newGameSpawn');
            ig.game.spawnEntity(EntityPlayer, spawnpoint.pos.x, spawnpoint.pos.y);
            //ig.game.togglePlayerInteraction(false);
            //ig.game.spawnpos = {x: 516, y: 228};
            ig.game.player.orientation = 'up';
            var spawnpointFather = ig.game.getEntityByName('fatherSpawn');
            ig.game.spawnEntity(EntityNPC, spawnpointFather.pos.x, spawnpointFather.pos.y, {name:'Dad', media:'Father'});
            this.loadGUIEntities();
            this.setupCamera();
            this.fadeScreenFromBlack();
            ig.game.inGameGUIController.toggleUI( true );
            ig.game.level = '1_House_UpperFloor';
            this.currentLevel = '1_House_UpperFloor';
            ig.game.dataLoader.setSessionStatus();
        },

        loadLevelfromSave: function() {
            if (this.isValid(ig.game.level)) {
                ig.game.dialogController = new DialogController();
                ig.game.spawnEntity(EntityPlayer, 0, 0);
                this.setupCamera();
                this.loadLevel(ig.game.level);
                this.loadPlayerAtSpawnPoint();
                ig.game.inGameGUIController.toggleUI( true );
                ig.game.dataLoader.setSessionStatus();
            }
            else {
                this.loadNewGameLevel();
            }
        },

        loadLevelfromURL: function() {
            if (this.isValid(ig.game.level)) {
                ig.game.dialogController = new DialogController();
                ig.game.spawnEntity(EntityPlayer, 0, 0);
                this.setupCamera();
                this.loadLevel(ig.game.level);
                ig.game.spawnEntity(EntityPlayer, ig.game.spawnpos.x, ig.game.spawnpos.y);
                ig.game.player = ig.game.getEntitiesByType(EntityPlayer)[0];
                this.camera.entityToFollow = ig.game.player;
                ig.game.inGameGUIController.toggleUI( true );
                ig.game.getEntitiesByType(EntityQuestionController)[0].checkEvent();
            }
            else {
                this.loadNewGameLevel();
            }
        },

        loadLevel: function(levelName) {
            this.loadLevelMap(levelName);
            ig.game.eventController.latestEventID = ig.game.eventID;
            ig.game.level = levelName;
            ig.game.inGameGUIController.updateObjectives(ig.game.eventID);
            this.loadGUIEntities();
            this.loadNPCEntities();
            this.fadeScreenFromBlack();
            this.drawLevelNameSplash();

            // ig.game.dataLoader.setSessionStatus();
        },

        changeLevel: function(levelName) {
            this.loadLevelMap(levelName);
            ig.game.level = levelName;
            ig.game.inGameGUIController.updateObjectives(ig.game.eventID);
            ig.game.dataLoader.setSessionStatus();
            this.loadPlayerAtSpawnPoint();
            this.loadGUIEntities();
            this.loadNPCEntities();
            this.fadeScreenFromBlack();
            this.drawLevelNameSplash();

        },

        changeLevelWithSpecificSpawnPoint: function(levelName, spawnPointName) {
            this.loadLevelMap(levelName);
            this.loadPlayerAtSpecificSpawnPoint(spawnPointName);
            this.loadGUIEntities();
            this.loadNPCEntities();
            this.fadeScreenFromBlack();
            this.drawLevelNameSplash();
            ig.game.level = levelName;
            ig.game.inGameGUIController.updateObjectives(ig.game.eventID);
            ig.game.dataLoader.setSessionStatus();
        },

        loadLevelMap: function(levelName) {
            this.currentLevel = levelName.replace(/^(Level)?(\w)(\w*)/, function( m, l, a, b ) {
                return a.toUpperCase() + b;
            });
            ig.game.loadLevel(ig.global['Level' + this.currentLevel]);
        },

        loadPlayerAtSpawnPoint: function() {
            var spawnpoint = ig.game.getEntityByName('playerSpawn');
            if (ig.game.eventID == 0) {
                spawnpoint = ig.game.getEntityByName('newGameSpawn');
            }
            ig.game.spawnEntity(EntityPlayer, spawnpoint.pos.x, spawnpoint.pos.y);
            ig.game.spawnpos = {x: spawnpoint.pos.x, y: spawnpoint.pos.y};
            ig.game.player = ig.game.getEntitiesByType(EntityPlayer)[0];
            this.camera.entityToFollow = ig.game.player;
        },

        loadPlayerAtSpecificSpawnPoint: function(spawnPointName) {
            var spawnpoint = ig.game.getEntityByName(spawnPointName);
            ig.game.spawnEntity(EntityPlayer, spawnpoint.pos.x, spawnpoint.pos.y);
            ig.game.spawnpos = {x: spawnpoint.pos.x, y: spawnpoint.pos.y};
            ig.game.player = ig.game.getEntitiesByType(EntityPlayer)[0];
            this.camera.entityToFollow = ig.game.player;
        },

        loadGUIEntities: function() {
            ig.game.spawnEntity(EntityQuestionController, 0, 0);
            ig.game.spawnEntity(EntityMouseArrow, -100, -100);
            ig.game.spawnEntity(EntityDialogPlayer, 0, 0);
            ig.game.dialogController.setDialogBox();
            ig.game.spawnEntity(EntityQuestions, 0, 0);
            ig.game.spawnEntity(EntityAchievementViewer, 0, 0);
            ig.game.spawnEntity(EntityAchievements);
            ig.game.spawnEntity(EntityLevelSelector, 0, 0);
        },

        loadNPCEntities: function() {
            if (this.currentLevel == '1_House_UpperFloor') {
                ig.game.player.orientation = 'left';

                if (ig.game.eventController.latestEventID == 0) {
                    var spawnpointFather = ig.game.getEntityByName('fatherSpawn');
                    ig.game.spawnEntity(EntityNPC, spawnpointFather.pos.x, spawnpointFather.pos.y, {name: 'Dad', media: 'Father'});
                }
                else if (ig.game.eventController.latestEventID <= 4) {
                    ig.game.spawnEntity(EntityNPC, -100, 0, {name: 'Police Officer Lisa', media: 'Lisa'});
                    ig.game.spawnEntity(EntityNPC, -100, 0, {name: 'Policeman', media: 'Policeman'});
                }
            }
            else if (this.currentLevel == '1_House_GroundFloor') {
                ig.game.player.orientation = 'right';

                if (ig.game.eventController.latestEventID == 5) {
                    var spawnpointLisa = ig.game.getEntityByName('lisaSpawn');
                    ig.game.spawnEntity(EntityNPC, spawnpointLisa.pos.x, spawnpointLisa.pos.y, {name: 'Police Officer Lisa', media: 'Lisa'});

                    var spawnpointGenericPolice = ig.game.getEntityByName('policeSpawn');
                    ig.game.spawnEntity(EntityNPC, spawnpointGenericPolice.pos.x, spawnpointGenericPolice.pos.y, {name: 'Policeman', media: 'Policeman'});

                    var spawnpointPoliceman1 = ig.game.getEntityByName('policeSpawn_1');
                    var entityPolice1 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman1.pos.x, spawnpointPoliceman1.pos.y, {name: 'Policeman', media: 'Policeman'});
                    entityPolice1.orientation = 'right';

                    var spawnpointPoliceman2 = ig.game.getEntityByName('policeSpawn_2');
                    var paceDestinationPoliceman2 = ig.game.getEntityByName('police2_paceDestination');
                    var entityPolice2 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman2.pos.x, spawnpointPoliceman2.pos.y, {name: 'Policeman', media: 'Policeman'});
                    entityPolice2.orientation = 'down';

                    entityPolice2.addPacingDestination(spawnpointPoliceman2.pos.x, spawnpointPoliceman2.pos.y, 2);
                    entityPolice2.addPacingDestination(paceDestinationPoliceman2.pos.x, paceDestinationPoliceman2.pos.y, 2);
                    entityPolice2.startPacing();

                    var spawnpointPoliceman3 = ig.game.getEntityByName('policeSpawn_3');
                    var paceDestinationPoliceman3 = ig.game.getEntityByName('police3_paceDestination');
                    var entityPolice3 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman3.pos.x, spawnpointPoliceman3.pos.y, {name: 'Policeman', media: 'Policeman'});
                    entityPolice3.orientation = 'up';

                    entityPolice3.addPacingDestination(spawnpointPoliceman3.pos.x, spawnpointPoliceman3.pos.y, 3);
                    entityPolice3.addPacingDestination(paceDestinationPoliceman3.pos.x, paceDestinationPoliceman3.pos.y, 3);
                    entityPolice3.startPacing();

                    var spawnpointPoliceman4 = ig.game.getEntityByName('policeSpawn_4');
                    var entityPolice4 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman4.pos.x, spawnpointPoliceman4.pos.y, {name: 'Policeman', media: 'Policeman'});
                    entityPolice4.orientation = 'left';

                    var spawnpointPoliceman5 = ig.game.getEntityByName('policeSpawn_5');
                    var entityPolice5 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman5.pos.x, spawnpointPoliceman5.pos.y, {name: 'Policeman', media: 'Policeman'});
                    entityPolice5.orientation = 'up';

                    var spawnpointPoliceman6 = ig.game.getEntityByName('policeSpawn_6');
                    var entityPolice6 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman6.pos.x, spawnpointPoliceman6.pos.y, {name: 'Policeman', media: 'Policeman'});
                    entityPolice6.orientation = 'left';

                    var spawnpointPoliceman7 = ig.game.getEntityByName('policeSpawn_7');
                    var entityPolice7 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman7.pos.x, spawnpointPoliceman7.pos.y, {name: 'Policeman', media: 'Policeman'});
                    entityPolice7.orientation = 'down';
                }
                else if (ig.game.eventController.latestEventID >= 13) {
                    var spawnpointFather = ig.game.getEntityByName('policeSpawn_3');
                    var paceDestinationFather = ig.game.getEntityByName('police3_paceDestination');
                    var father = ig.game.spawnEntity(EntityNPC, spawnpointFather.pos.x, spawnpointFather.pos.y, {name: 'Dad', media: 'Father'});

                    father.addPacingDestination(spawnpointFather.pos.x, spawnpointFather.pos.y, 3);
                    father.addPacingDestination(paceDestinationFather.pos.x, paceDestinationFather.pos.y, 3);
                    father.startPacing();
                }
            }
            else if (this.currentLevel == '2_PoliceHQ_GroundFloor') {
                ig.game.player.orientation = 'up';

                if (ig.game.eventController.latestEventID == 6) {
                    var spawnpointLisa = ig.game.getEntityByName('lisaSpawn');
                    var entityLisa = ig.game.spawnEntity(EntityNPC, spawnpointLisa.pos.x, spawnpointLisa.pos.y, {name: 'Police Officer Lisa', media: 'Lisa'});
                    entityLisa.orientation = 'up';

                    var spawnpointSteve = ig.game.getEntityByName('steveSpawn');
                    var entitySteve = ig.game.spawnEntity(EntityNPC, spawnpointSteve.pos.x, spawnpointSteve.pos.y, {name: 'Section Chief Steve', media: 'Steve'});
                    entitySteve.orientation = 'left';
                }
                else if (ig.game.eventController.latestEventID <= 8) {
                    var spawnpointLisa = ig.game.getEntityByName('lisaWalkDestination_7');
                    var entityLisa = ig.game.spawnEntity(EntityNPC, spawnpointLisa.pos.x, spawnpointLisa.pos.y, {name: 'Police Officer Lisa', media: 'Lisa'});
                    entityLisa.orientation = 'up';

                    var spawnpointSteve = ig.game.getEntityByName('steveWalkDestination_6');
                    var entitySteve = ig.game.spawnEntity(EntityNPC, spawnpointSteve.pos.x, spawnpointSteve.pos.y, {name: 'Section Chief Steve', media: 'Steve'});
                    entitySteve.orientation = 'left';
                }

                var spawnpointPoliceman1 = ig.game.getEntityByName('policeSpawn_1');
                var entityPolice1 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman1.pos.x, spawnpointPoliceman1.pos.y, {name: 'Policeman', media: 'Policeman'});
                entityPolice1.orientation = 'up';

                var spawnpointPoliceman2 = ig.game.getEntityByName('policeSpawn_2');
                var paceDestinationPoliceman2 = ig.game.getEntityByName('police2_paceDestination');
                var entityPolice2 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman2.pos.x, spawnpointPoliceman2.pos.y, {name: 'Policeman', media: 'Policeman'});
                entityPolice2.orientation = 'up';

                entityPolice2.addPacingDestination(spawnpointPoliceman2.pos.x, spawnpointPoliceman2.pos.y, 2);
                entityPolice2.addPacingDestination(paceDestinationPoliceman2.pos.x, paceDestinationPoliceman2.pos.y, 2);
                entityPolice2.startPacing();

                var spawnpointPoliceman3 = ig.game.getEntityByName('policeSpawn_3');
                var entityPolice3 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman3.pos.x, spawnpointPoliceman3.pos.y, {name: 'Policeman', media: 'Policeman'});
                entityPolice3.orientation = 'up';

                var spawnpointPoliceman4 = ig.game.getEntityByName('policeSpawn_4');
                var entityPolice4 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman4.pos.x, spawnpointPoliceman4.pos.y, {name: 'Policeman', media: 'Policeman'});
                entityPolice4.orientation = 'up';

                var spawnpointPoliceman5 = ig.game.getEntityByName('policeSpawn_5');
                var entityPolice5 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman5.pos.x, spawnpointPoliceman5.pos.y, {name: 'Policeman', media: 'Policeman'});
                entityPolice5.orientation = 'up';

                var spawnpointPoliceman6 = ig.game.getEntityByName('policeSpawn_6');
                var entityPolice6 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman6.pos.x, spawnpointPoliceman6.pos.y, {name: 'Policeman', media: 'Policeman'});
                entityPolice6.orientation = 'left';

                var spawnpointPoliceman7 = ig.game.getEntityByName('policeSpawn_7');
                var entityPolice7 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman7.pos.x, spawnpointPoliceman7.pos.y, {name: 'Policeman', media: 'Policeman'});
                entityPolice7.orientation = 'left';

                var spawnpointPoliceman8 = ig.game.getEntityByName('policeSpawn_8');
                var entityPolice8 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman8.pos.x, spawnpointPoliceman8.pos.y, {name: 'Policeman', media: 'Policeman'});
                entityPolice8.orientation = 'left';

                var spawnpointPoliceman9 = ig.game.getEntityByName('policeSpawn_9');
                var entityPolice9 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman9.pos.x, spawnpointPoliceman9.pos.y, {name: 'Policeman', media: 'Policeman'});
                entityPolice9.orientation = 'down';

                var spawnpointPoliceman10 = ig.game.getEntityByName('policeSpawn_10');
                var entityPolice10 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman10.pos.x, spawnpointPoliceman10.pos.y, {name: 'Policeman', media: 'Policeman'});
                entityPolice10.orientation = 'up';

                var spawnpointPoliceman11 = ig.game.getEntityByName('policeSpawn_11');
                var entityPolice11 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman11.pos.x, spawnpointPoliceman11.pos.y, {name: 'Policeman', media: 'Policeman'});
                entityPolice11.orientation = 'up';

                var spawnpointPoliceman12 = ig.game.getEntityByName('policeSpawn_12');
                var entityPolice12 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman12.pos.x, spawnpointPoliceman12.pos.y, {name: 'Policeman', media: 'Policeman'});
                entityPolice12.orientation = 'up';

                var spawnpointPoliceman13 = ig.game.getEntityByName('policeSpawn_13');
                var paceDestinationPoliceman13 = ig.game.getEntityByName('police13_paceDestination');
                var entityPolice13 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman13.pos.x, spawnpointPoliceman13.pos.y, {name: 'Policeman', media: 'Policeman'});
                entityPolice13.orientation = 'up';

                entityPolice13.addPacingDestination(spawnpointPoliceman13.pos.x, spawnpointPoliceman13.pos.y, 3);
                entityPolice13.addPacingDestination(paceDestinationPoliceman13.pos.x, paceDestinationPoliceman13.pos.y, 3);
                entityPolice13.startPacing();

                var spawnpointPoliceman14 = ig.game.getEntityByName('policeSpawn_14');
                var paceDestinationPoliceman14_1 = ig.game.getEntityByName('police14_paceDestination_1');
                var paceDestinationPoliceman14_2 = ig.game.getEntityByName('police14_paceDestination_2');
                var entityPolice14 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman14.pos.x, spawnpointPoliceman14.pos.y, {name: 'Policeman', media: 'Policeman'});
                entityPolice14.orientation = 'up';

                entityPolice14.addPacingDestination(spawnpointPoliceman14.pos.x, spawnpointPoliceman14.pos.y, 3);
                entityPolice14.addPacingDestination(paceDestinationPoliceman14_1.pos.x, paceDestinationPoliceman14_1.pos.y, 0);
                entityPolice14.addPacingDestination(paceDestinationPoliceman14_2.pos.x, paceDestinationPoliceman14_2.pos.y, 3);
                entityPolice14.addPacingDestination(paceDestinationPoliceman14_1.pos.x, paceDestinationPoliceman14_1.pos.y, 0);
                entityPolice14.startPacing();
            }
            else if (this.currentLevel == '3_Tower_GroundFloor') {
                ig.game.player.orientation = 'up';

                if (ig.game.eventController.latestEventID == 9) {
                    var spawnpointLisa = ig.game.getEntityByName('lisaSpawn');
                    var entityLisa = ig.game.spawnEntity(EntityNPC, spawnpointLisa.pos.x, spawnpointLisa.pos.y, {name: 'Police Officer Lisa', media: 'Lisa'});
                    entityLisa.orientation = 'up';

                    var spawnpointSteve = ig.game.getEntityByName('steveSpawn');
                    var entitySteve = ig.game.spawnEntity(EntityNPC, spawnpointSteve.pos.x, spawnpointSteve.pos.y, {name: 'Section Chief Steve', media: 'Steve'});
                    entitySteve.orientation = 'up';

                    var spawnpointPoliceman1 = ig.game.getEntityByName('policeSpawn_1');
                    var entityPolice1 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman1.pos.x, spawnpointPoliceman1.pos.y, {name: 'Policeman1', media: 'Policeman'});
                    entityPolice1.orientation = 'up';

                    var spawnpointPoliceman2 = ig.game.getEntityByName('policeSpawn_2');
                    var entityPolice2 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman2.pos.x, spawnpointPoliceman2.pos.y, {name: 'Policeman2', media: 'Policeman'});
                    entityPolice2.orientation = 'up';

                    var spawnpointPoliceman3 = ig.game.getEntityByName('policeSpawn_3');
                    var entityPolice3 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman3.pos.x, spawnpointPoliceman3.pos.y, {name: 'Policeman3', media: 'Policeman'});
                    entityPolice3.orientation = 'up';

                    var spawnpointPoliceman4 = ig.game.getEntityByName('policeSpawn_4');
                    var entityPolice4 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman4.pos.x, spawnpointPoliceman4.pos.y, {name: 'Policeman4', media: 'Policeman'});
                    entityPolice4.orientation = 'up';

                    var spawnpointPoliceman5 = ig.game.getEntityByName('policeSpawn_5');
                    var entityPolice5 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman5.pos.x, spawnpointPoliceman5.pos.y, {name: 'Policeman5', media: 'Policeman'});
                    entityPolice5.orientation = 'up';

                    var spawnpointPoliceman6 = ig.game.getEntityByName('policeSpawn_6');
                    var entityPolice6 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman6.pos.x, spawnpointPoliceman6.pos.y, {name: 'Policeman6', media: 'Policeman'});
                    entityPolice6.orientation = 'up';

                    var spawnpointToaster1 = ig.game.getEntityByName('toasterSpawn_1');
                    var entityToaster1 = ig.game.spawnEntity(EntityToaster, spawnpointToaster1.pos.x, spawnpointToaster1.pos.y, {name: 'SecurityBot 17', question: 'q16'});
                    entityToaster1.speed = 100;

                    var spawnpointToaster2 = ig.game.getEntityByName('toasterSpawn_2');
                    var entityToaster2 = ig.game.spawnEntity(EntityToaster, spawnpointToaster2.pos.x, spawnpointToaster2.pos.y, {name: 'SecurityBot 11', question: 'q17'});
                    entityToaster2.speed = 100;

                    var spawnpointToaster3 = ig.game.getEntityByName('toasterSpawn_3');
                    var entityToaster3 = ig.game.spawnEntity(EntityToaster, spawnpointToaster3.pos.x, spawnpointToaster3.pos.y, {name: 'SecurityBot 88', question: 'q18'});
                    entityToaster3.speed = 100;
                }
                else if (ig.game.eventController.latestEventID == 10) {
                    ig.game.player.orientation = 'up';

                    var spawnpointLisa = ig.game.getEntityByName('lisaWalkDestination_1');
                    var entityLisa = ig.game.spawnEntity(EntityNPC, spawnpointLisa.pos.x, spawnpointLisa.pos.y, {name: 'Police Officer Lisa', media: 'Lisa'});
                    entityLisa.orientation = 'up';

                    var spawnpointSteve = ig.game.getEntityByName('steveWalkDestination_1');
                    var entitySteve = ig.game.spawnEntity(EntityNPC, spawnpointSteve.pos.x, spawnpointSteve.pos.y, {name: 'Section Chief Steve', media: 'Steve'});
                    entitySteve.orientation = 'up';

                    var spawnpointPoliceman1 = ig.game.getEntityByName('police1_walkDestination_1');
                    var entityPolice1 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman1.pos.x, spawnpointPoliceman1.pos.y, {name: 'Policeman', media: 'Policeman'});
                    entityPolice1.orientation = 'up';

                    var spawnpointPoliceman2 = ig.game.getEntityByName('police2_walkDestination_1');
                    var entityPolice2 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman2.pos.x, spawnpointPoliceman2.pos.y, {name: 'Policeman', media: 'Policeman'});
                    entityPolice2.orientation = 'up';

                    var spawnpointPoliceman3 = ig.game.getEntityByName('police3_walkDestination_1');
                    var entityPolice3 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman3.pos.x, spawnpointPoliceman3.pos.y, {name: 'Policeman', media: 'Policeman'});
                    entityPolice3.orientation = 'up';

                    var spawnpointPoliceman4 = ig.game.getEntityByName('police4_walkDestination_1');
                    var entityPolice4 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman4.pos.x, spawnpointPoliceman4.pos.y, {name: 'Policeman', media: 'Policeman'});
                    entityPolice4.orientation = 'up';

                    var spawnpointPoliceman5 = ig.game.getEntityByName('police5_walkDestination_1');
                    var entityPolice5 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman5.pos.x, spawnpointPoliceman5.pos.y, {name: 'Policeman', media: 'Policeman'});
                    entityPolice5.orientation = 'up';

                    var spawnpointPoliceman6 = ig.game.getEntityByName('police6_walkDestination_1');
                    var entityPolice6 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman6.pos.x, spawnpointPoliceman6.pos.y, {name: 'Policeman', media: 'Policeman'});
                    entityPolice6.orientation = 'up';

                    var spawnpointToaster1 = ig.game.getEntityByName('toaster1_walkDestination');
                    var entityToaster1 = ig.game.spawnEntity(EntityToaster, spawnpointToaster1.pos.x, spawnpointToaster1.pos.y, {name: 'SecurityBot 17', question: 'q16'});
                    entityToaster1.speed = 100;

                    var spawnpointToaster2 = ig.game.getEntityByName('toaster2_walkDestination');
                    var entityToaster2 = ig.game.spawnEntity(EntityToaster, spawnpointToaster2.pos.x, spawnpointToaster2.pos.y, {name: 'SecurityBot 11', question: 'q17'});
                    entityToaster2.speed = 100;

                    var spawnpointToaster3 = ig.game.getEntityByName('toaster3_walkDestination');
                    var entityToaster3 = ig.game.spawnEntity(EntityToaster, spawnpointToaster3.pos.x, spawnpointToaster3.pos.y, {name: 'SecurityBot 88', question: 'q18'});
                    entityToaster3.speed = 100;
                }
                else {
                    var spawnpointPoliceman1 = ig.game.getEntityByName('police1_walkDestination_1');
                    var entityPolice1 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman1.pos.x, spawnpointPoliceman1.pos.y, {name: 'Policeman', media: 'Policeman'});
                    entityPolice1.orientation = 'up';

                    var spawnpointPoliceman2 = ig.game.getEntityByName('police2_walkDestination_1');
                    var entityPolice2 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman2.pos.x, spawnpointPoliceman2.pos.y, {name: 'Policeman', media: 'Policeman'});
                    entityPolice2.orientation = 'up';

                    var spawnpointPoliceman3 = ig.game.getEntityByName('police3_walkDestination_1');
                    var entityPolice3 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman3.pos.x, spawnpointPoliceman3.pos.y, {name: 'Policeman', media: 'Policeman'});
                    entityPolice3.orientation = 'up';

                    var spawnpointPoliceman4 = ig.game.getEntityByName('police4_walkDestination_1');
                    var entityPolice4 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman4.pos.x, spawnpointPoliceman4.pos.y, {name: 'Policeman', media: 'Policeman'});
                    entityPolice4.orientation = 'up';

                    var spawnpointPoliceman5 = ig.game.getEntityByName('police5_walkDestination_1');
                    var entityPolice5 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman5.pos.x, spawnpointPoliceman5.pos.y, {name: 'Policeman', media: 'Policeman'});
                    entityPolice5.orientation = 'up';

                    var spawnpointPoliceman6 = ig.game.getEntityByName('police6_walkDestination_1');
                    var entityPolice6 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman6.pos.x, spawnpointPoliceman6.pos.y, {name: 'Policeman', media: 'Policeman'});
                    entityPolice6.orientation = 'up';

                    var spawnpointToaster1 = ig.game.getEntityByName('toaster1_walkDestination');
                    var entityToaster1 = ig.game.spawnEntity(EntityToaster, spawnpointToaster1.pos.x, spawnpointToaster1.pos.y, {name: 'SecurityBot 17', question: 'q16'});
                    entityToaster1.speed = 100;

                    var spawnpointToaster2 = ig.game.getEntityByName('toaster2_walkDestination');
                    var entityToaster2 = ig.game.spawnEntity(EntityToaster, spawnpointToaster2.pos.x, spawnpointToaster2.pos.y, {name: 'SecurityBot 11', question: 'q17'});
                    entityToaster2.speed = 100;

                    var spawnpointToaster3 = ig.game.getEntityByName('toaster3_walkDestination');
                    var entityToaster3 = ig.game.spawnEntity(EntityToaster, spawnpointToaster3.pos.x, spawnpointToaster3.pos.y, {name: 'SecurityBot 88', question: 'q18'});
                    entityToaster3.speed = 100;
                }
            }
            else if (this.currentLevel == '3_Tower_TopFloor') {
                ig.game.player.orientation = 'down';

                var bossplatform = ig.game.spawnEntity(EntityBossPlatform, 0 ,0);

                if (ig.game.eventController.latestEventID == 11) {
                    var spawnpointLisa = ig.game.getEntityByName('lisaSpawn');
                    var entityLisa = ig.game.spawnEntity(EntityNPC, spawnpointLisa.pos.x, spawnpointLisa.pos.y, {name: 'Police Officer Lisa', media: 'Lisa'});
                    entityLisa.orientation = 'down';

                    var spawnpointSteve = ig.game.getEntityByName('steveSpawn');
                    var entitySteve = ig.game.spawnEntity(EntityNPC, spawnpointSteve.pos.x, spawnpointSteve.pos.y, {name: 'Section Chief Steve', media: 'Steve'});
                    entitySteve.orientation = 'down';

                    var spawnpointPoliceman1 = ig.game.getEntityByName('policeSpawn_1');
                    var entityPolice1 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman1.pos.x, spawnpointPoliceman1.pos.y, {name: 'Policeman1', media: 'Policeman'});
                    entityPolice1.orientation = 'down';

                    var spawnpointPoliceman2 = ig.game.getEntityByName('policeSpawn_2');
                    var entityPolice2 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman2.pos.x, spawnpointPoliceman2.pos.y, {name: 'Policeman2', media: 'Policeman'});
                    entityPolice2.orientation = 'down';

                    var spawnpointEdwin = ig.game.getEntityByName('edwinSpawn');
                    var entityEdwin = ig.game.spawnEntity(EntityNPC, spawnpointEdwin.pos.x, spawnpointEdwin.pos.y, {name: 'Edwin', media: 'Edwin'});
                    entityEdwin.orientation = 'down';

                    var spawnpointJustin = ig.game.getEntityByName('justinSpawn');
                    var entityJustin = ig.game.spawnEntity(EntityNPC, spawnpointJustin.pos.x, spawnpointJustin.pos.y, {name: 'Justin', media: 'Justin'});
                    entityJustin.orientation = 'down';

                    var spawnpointLilian = ig.game.getEntityByName('lilianSpawn');
                    var entityLilian = ig.game.spawnEntity(EntityNPC, spawnpointLilian.pos.x, spawnpointLilian.pos.y, {name: 'Lilian', media: 'Lilian'});
                    entityLilian.orientation = 'down';

                    var spawnpointFather = ig.game.getEntityByName('fatherSpawn');
                    var entityFather = ig.game.spawnEntity(EntityNPC, spawnpointFather.pos.x, spawnpointFather.pos.y, {name: 'Dad', media: 'Father'});
                    entityFather.orientation = 'down';

                    var bossFightScene = ig.game.spawnEntity(EntityBossFight, 0, 0);
                }
                else if (ig.game.eventController.latestEventID == 12) {
                    var spawnpointLisa = ig.game.getEntityByName('lisaWalkDestination_4');
                    var entityLisa = ig.game.spawnEntity(EntityNPC, spawnpointLisa.pos.x, spawnpointLisa.pos.y, {name: 'Police Officer Lisa', media: 'Lisa'});
                    entityLisa.orientation = 'up';

                    var spawnpointSteve = ig.game.getEntityByName('steveWalkDestination_4');
                    var entitySteve = ig.game.spawnEntity(EntityNPC, spawnpointSteve.pos.x, spawnpointSteve.pos.y, {name: 'Section Chief Steve', media: 'Steve'});
                    entitySteve.orientation = 'up';

                    var spawnpointPoliceman1 = ig.game.getEntityByName('police1_walkDestination_6');
                    var entityPolice1 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman1.pos.x, spawnpointPoliceman1.pos.y, {name: 'Policeman1', media: 'Policeman'});
                    entityPolice1.orientation = 'up';

                    var spawnpointPoliceman2 = ig.game.getEntityByName('police2_walkDestination_6');
                    var entityPolice2 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman2.pos.x, spawnpointPoliceman2.pos.y, {name: 'Policeman2', media: 'Policeman'});
                    entityPolice2.orientation = 'up';

                    var spawnpointFather = ig.game.getEntityByName('fatherWalkDestination_1');
                    var entityFather = ig.game.spawnEntity(EntityNPC, spawnpointFather.pos.x, spawnpointFather.pos.y, {name: 'Dad', media: 'Father'});
                    entityFather.orientation = 'down';

                    var boss = ig.game.spawnEntity(EntityBoss, 699, 226);
                    boss.stateAnimation = 'floating';

                    var bossFightScene = ig.game.spawnEntity(EntityBossFight, 0, 0);
                }

                else if (ig.game.eventController.latestEventID >= 13) {
                    var bossFightScene = ig.game.spawnEntity(EntityBoss, 699, 226);
                    ig.game.getEntitiesByType('EntityBoss')[0].stateAnimation = 'dead';
                    var lightStairs = ig.game.getEntityByName('LightStair');
                    lightStairs.activate();
                }
            }
            else if (this.currentLevel == '4_Tower_SecretFloor') {
                if (ig.game.eventController.latestEventID == 13) {
                    var spawnpointLisa = ig.game.getEntityByName('lisaSpawn');
                    var entityLisa = ig.game.spawnEntity(EntityNPC, spawnpointLisa.pos.x, spawnpointLisa.pos.y, {name: 'Police Officer Lisa', media: 'Lisa'});
                    entityLisa.orientation = 'up';

                    var spawnpointSteve = ig.game.getEntityByName('steveSpawn');
                    var entitySteve = ig.game.spawnEntity(EntityNPC, spawnpointSteve.pos.x, spawnpointSteve.pos.y, {name: 'Section Chief Steve', media: 'Steve'});
                    entitySteve.orientation = 'up';

                    var spawnpointPoliceman1 = ig.game.getEntityByName('policeSpawn_1');
                    var entityPolice1 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman1.pos.x, spawnpointPoliceman1.pos.y, {name: 'Policeman1', media: 'Policeman'});
                    entityPolice1.orientation = 'up';

                    var spawnpointPoliceman2 = ig.game.getEntityByName('policeSpawn_2');
                    var entityPolice2 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman2.pos.x, spawnpointPoliceman2.pos.y, {name: 'Policeman2', media: 'Policeman'});
                    entityPolice2.orientation = 'up';

                }
                else if (ig.game.eventController.latestEventID >= 14) {
                    var spawnpointLisa = ig.game.getEntityByName('lisaWalkDestination');
                    var entityLisa = ig.game.spawnEntity(EntityNPC, spawnpointLisa.pos.x, spawnpointLisa.pos.y, {name: 'Police Officer Lisa', media: 'Lisa'});
                    entityLisa.orientation = 'down';

                    var spawnpointSteve = ig.game.getEntityByName('steveWalkDestination');
                    var entitySteve = ig.game.spawnEntity(EntityNPC, spawnpointSteve.pos.x, spawnpointSteve.pos.y, {name: 'Section Chief Steve', media: 'Steve'});
                    entitySteve.orientation = 'down';

                    var spawnpointPoliceman1 = ig.game.getEntityByName('police1_WalkDestination');
                    var entityPolice1 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman1.pos.x, spawnpointPoliceman1.pos.y, {name: 'Policeman1', media: 'Policeman'});
                    entityPolice1.orientation = 'down';

                    var spawnpointPoliceman2 = ig.game.getEntityByName('police2_WalkDestination');
                    var entityPolice2 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman2.pos.x, spawnpointPoliceman2.pos.y, {name: 'Policeman2', media: 'Policeman'});
                    entityPolice2.orientation = 'down';
                }
            }
            else if (this.currentLevel == '4_Tower_BinaryExploitRoom') {
                var spawnpointToaster1 = ig.game.getEntityByName('toasterSpawn_1');
                var entityToaster1 = ig.game.spawnEntity(EntityToaster, spawnpointToaster1.pos.x, spawnpointToaster1.pos.y, {name: 'SecurityBot 00000', question: 'q24'});
                entityToaster1.speed = 100;

                var spawnpointToaster2 = ig.game.getEntityByName('toasterSpawn_2');
                var entityToaster2 = ig.game.spawnEntity(EntityToaster, spawnpointToaster2.pos.x, spawnpointToaster2.pos.y, {name: 'SecurityBot 00001', question: 'q24'});
                entityToaster2.speed = 100;

                var spawnpointToaster3 = ig.game.getEntityByName('toasterSpawn_3');
                var entityToaster3 = ig.game.spawnEntity(EntityToaster, spawnpointToaster3.pos.x, spawnpointToaster3.pos.y, {name: 'SecurityBot 00010', question: 'q32'});
                entityToaster3.speed = 100;

                var spawnpointToaster4 = ig.game.getEntityByName('toasterSpawn_4');
                var entityToaster4 = ig.game.spawnEntity(EntityToaster, spawnpointToaster4.pos.x, spawnpointToaster4.pos.y, {name: 'SecurityBot 00011', question: 'q32'});
                entityToaster4.speed = 100;

                var spawnpointToaster5 = ig.game.getEntityByName('toasterSpawn_5');
                var entityToaster5 = ig.game.spawnEntity(EntityToaster, spawnpointToaster5.pos.x, spawnpointToaster5.pos.y, {name: 'SecurityBot 00100', question: 'q33'});
                entityToaster5.speed = 100;

                var spawnpointToaster6 = ig.game.getEntityByName('toasterSpawn_6');
                var entityToaster6 = ig.game.spawnEntity(EntityToaster, spawnpointToaster6.pos.x, spawnpointToaster6.pos.y, {name: 'SecurityBot 00101', question: 'q33'});
                entityToaster6.speed = 100;

                var spawnpointToaster7 = ig.game.getEntityByName('toasterSpawn_7');
                var entityToaster7 = ig.game.spawnEntity(EntityToaster, spawnpointToaster7.pos.x, spawnpointToaster7.pos.y, {name: 'SecurityBot 00111', question: 'q26'});
                entityToaster7.speed = 100;

                var spawnpointToaster8 = ig.game.getEntityByName('toasterSpawn_8');
                var entityToaster8 = ig.game.spawnEntity(EntityToaster, spawnpointToaster8.pos.x, spawnpointToaster8.pos.y, {name: 'SecurityBot 01000', question: 'q26'});
                entityToaster8.speed = 100;

                var spawnpointToaster9 = ig.game.getEntityByName('toasterSpawn_9');
                var entityToaster9 = ig.game.spawnEntity(EntityToaster, spawnpointToaster9.pos.x, spawnpointToaster9.pos.y, {name: 'SecurityBot 01001', question: 'q28'});
                entityToaster9.speed = 100;

                var spawnpointToaster10 = ig.game.getEntityByName('toasterSpawn_10');
                var entityToaster10 = ig.game.spawnEntity(EntityToaster, spawnpointToaster10.pos.x, spawnpointToaster10.pos.y, {name: 'SecurityBot 01010', question: 'q28'});
                entityToaster10.speed = 100;

                var spawnpointToaster11 = ig.game.getEntityByName('toasterSpawn_11');
                var entityToaster11 = ig.game.spawnEntity(EntityToaster, spawnpointToaster11.pos.x, spawnpointToaster11.pos.y, {name: 'SecurityBot 01011', question: 'q31'});
                entityToaster11.speed = 100;

                var spawnpointToaster12 = ig.game.getEntityByName('toasterSpawn_12');
                var entityToaster12 = ig.game.spawnEntity(EntityToaster, spawnpointToaster12.pos.x, spawnpointToaster12.pos.y, {name: 'SecurityBot 01100', question: 'q31'});
                entityToaster12.speed = 100;

                var spawnpointToaster13 = ig.game.getEntityByName('toasterSpawn_13');
                var entityToaster13 = ig.game.spawnEntity(EntityToaster, spawnpointToaster13.pos.x, spawnpointToaster13.pos.y, {name: 'SecurityBot 01101', question: 'q27'});
                entityToaster13.speed = 100;

                var spawnpointToaster14 = ig.game.getEntityByName('toasterSpawn_14');
                var entityToaster14 = ig.game.spawnEntity(EntityToaster, spawnpointToaster14.pos.x, spawnpointToaster14.pos.y, {name: 'SecurityBot 01110', question: 'q27'});
                entityToaster14.speed = 100;

                var spawnpointToaster15 = ig.game.getEntityByName('toasterSpawn_15');
                var entityToaster15 = ig.game.spawnEntity(EntityToaster, spawnpointToaster15.pos.x, spawnpointToaster15.pos.y, {name: 'SecurityBot 01111', question: 'q25'});
                entityToaster15.speed = 100;

                var spawnpointToaster16 = ig.game.getEntityByName('toasterSpawn_16');
                var entityToaster16 = ig.game.spawnEntity(EntityToaster, spawnpointToaster16.pos.x, spawnpointToaster16.pos.y, {name: 'SecurityBot 10000', question: 'q25'});
                entityToaster16.speed = 100;

                var spawnpointToaster17 = ig.game.getEntityByName('toasterSpawn_17');
                var entityToaster17 = ig.game.spawnEntity(EntityToaster, spawnpointToaster17.pos.x, spawnpointToaster17.pos.y, {name: 'SecurityBot 10001', question: 'q30'});
                entityToaster17.speed = 100;

                var spawnpointToaster18 = ig.game.getEntityByName('toasterSpawn_18');
                var entityToaster18 = ig.game.spawnEntity(EntityToaster, spawnpointToaster18.pos.x, spawnpointToaster18.pos.y, {name: 'SecurityBot 10010', question: 'q30'});
                entityToaster18.speed = 100;

                var spawnpointToaster19 = ig.game.getEntityByName('toasterSpawn_19');
                var entityToaster19 = ig.game.spawnEntity(EntityToaster, spawnpointToaster19.pos.x, spawnpointToaster19.pos.y, {name: 'SecurityBot 10011', question: 'q29'});
                entityToaster19.speed = 100;

                var spawnpointToaster20 = ig.game.getEntityByName('toasterSpawn_20');
                var entityToaster20 = ig.game.spawnEntity(EntityToaster, spawnpointToaster20.pos.x, spawnpointToaster20.pos.y, {name: 'SecurityBot 1010', question: 'q29'});
                entityToaster20.speed = 100;
            }
            else {
                console.log('No NPCs to spawn.');
            }
        },

        fadeScreenToBlack: function() {
            this.screenFader = new ig.ScreenFader({fade: 'in'});
        },

        fadeScreenFromBlack: function() {
            this.screenFader = new ig.ScreenFader({fade: 'out'});
        },

        drawLevelNameSplash: function() {
            switch(this.currentLevel){
                case '1_House_UpperFloor':
                    this.currentLevelName = 'Home (Upper Floor)';
                    break;
                case '1_House_GroundFloor':
                    this.currentLevelName = 'Home (Ground floor)';
                    break;
                case '2_PoliceHQ_GroundFloor':
                    this.currentLevelName = 'Police Headquarters';
                    break;
                case '3_Tower_GroundFloor':
                    this.currentLevelName = 'Crete Tower (Ground Floor)';
                    break;
                case '3_Tower_TopFloor':
                    this.currentLevelName = 'Crete Tower (Top Floor)';
                    break;
                case '4_Tower_SecretFloor':
                    this.currentLevelName = 'Crete Tower (Secret Floor)';
                    break;
                case '4_Tower_ReverseEngyRoom':
                    this.currentLevelName = 'Reverse Engineering Room';
                    break;
                case '4_Tower_CryptologyRoom':
                    this.currentLevelName = 'Cryptology Room';
                    break;
                case '4_Tower_TriviaRoom':
                    this.currentLevelName = 'Trivia Room';
                    break;
                case '4_Tower_WebExploitRoom':
                    this.currentLevelName = 'Web Exploitation Room';
                    break;
                case '4_Tower_ForensicsRoom':
                    this.currentLevelName = 'Forensics Room';
                    break;
                case '4_Tower_BinaryExploitRoom':
                    this.currentLevelName = 'Binary Exploitation Room';
                    break;
                case '4_Tower_ScriptExploitRoom':
                    this.currentLevelName = 'Script Exploitation Room';
                    break;
                default :
                    console.log('Missing Level Name Splash');
                    break;
            }

            this.fadeOutTimer.set(this.fadeOutDuration);
            this.levelNameFont.alpha = 1;
            this.drawLevelNameText = true;
        },

        fadeLevelNameSplash: function() {
            if (this.drawLevelNameText) {
                if (this.fadeOutTimer.delta() > 0) {
                    this.drawLevelNameText = false;
                    this.levelNameFont.alpha = 1;
                }
                else
                    this.levelNameFont.alpha = this.fadeOutTimer.delta().map(-this.fadeOutDuration, 0, 1, 0);
            }
        },

        setupCamera: function() {
            // Set up the camera. The camera's center is at a third of the screen
            // size, i.e. somewhat shift left and up. Damping is set to 3px.
            this.camera = new ig.Camera( ig.system.width/3, ig.system.height/3, 3);

            // The camera's trap (the deadzone in which the player can move with the
            // camera staying fixed) is set to according to the screen size as well.
            this.camera.trap.size.x = ig.system.width/5;
            this.camera.trap.size.y = ig.system.height/5;

            // The lookahead always shifts the camera in walking position; you can
            // set it to 0 to disable.
            this.camera.lookAhead.x = 0;

            // Set camera's screen bounds and reposition the trap on the player
            this.camera.max.x = ig.system.width;
            this.camera.max.y = ig.system.height*2;
            this.camera.set( ig.game.player );
        },

        isValid: function(levelName) {
            var currentLevel = levelName.replace(/^(Level)?(\w)(\w*)/, function( m, l, a, b ) {
                return a.toUpperCase() + b;
            });
            switch(currentLevel) {
                case '1_House_UpperFloor':
                case '1_House_GroundFloor':
                case '2_PoliceHQ_GroundFloor':
                case '3_Tower_GroundFloor':
                case '3_Tower_TopFloor':
                case '4_Tower_SecretFloor':
                case '4_Tower_ReverseEngyRoom':
                case '4_Tower_CryptologyRoom':
                case '4_Tower_TriviaRoom':
                case '4_Tower_WebExploitRoom':
                case '4_Tower_ForensicsRoom':
                case '4_Tower_BinaryExploitRoom':
                case '4_Tower_ScriptExploitRoom':
                    return true;
                default :
                    return false;
            }
        }
    });

});
