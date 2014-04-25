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
                this.levelNameFont.draw(this.currentLevelName, 512, 100, ig.Font.ALIGN.CENTER);
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
            ig.game.spawnpos = {x: 516, y: 228};
            ig.game.player.orientation = 'up';
            var spawnpointFather = ig.game.getEntityByName('fatherSpawn');
            ig.game.spawnEntity(EntityNPC, spawnpointFather.pos.x, spawnpointFather.pos.y, {name:'Dad', media:'Father'});
            this.loadGUIEntities();
            this.setupCamera();
            this.fadeScreenFromBlack();
            ig.game.inGameGUIController.toggleUI( true );
            ig.game.level = '1_House_UpperFloor';
            this.currentLevel = '1_House_UpperFloor';
        },

        loadNewGameLevel1: function() {
            ig.game.eventController.latestEventID = 1;
            ig.game.spawnEntity(EntityPlayer, 0, 0);
            this.setupCamera();
            this.loadLevel('Level1_House_UpperFloor');
        },

        loadNewGameLevel2: function() {
            ig.game.eventController.latestEventID = 6;
            ig.game.spawnEntity(EntityPlayer, 0, 0);
            this.setupCamera();
            this.loadLevel('Level2_PoliceHQ_GroundFloor');
        },

        loadNewGameLevel3_1: function() {
            ig.game.eventController.latestEventID = 9;
            ig.game.spawnEntity(EntityPlayer, 0, 0);
            this.setupCamera();
            this.loadLevel('Level3_Tower_GroundFloor');
        },

        loadNewGameLevel3_2: function() {
            ig.game.eventController.latestEventID = 11;
            ig.game.spawnEntity(EntityPlayer, 0, 0);
            this.setupCamera();
            this.loadLevel('Level3_Tower_TopFloor');
        },

        loadLevelfromSave: function() {
            if (this.isValid(ig.game.level)) {
                ig.game.eventController.latestEventID = ig.game.eventID;
                ig.game.spawnEntity(EntityPlayer, 0, 0);
                this.setupCamera();
                this.loadLevel(ig.game.level);
                this.loadPlayerAtSpawnPoint();
                ig.game.inGameGUIController.toggleUI( true );
            }
            else {
                this.loadNewGameLevel();
            }
        },

        loadLevel: function(levelName) {
            this.loadLevelMap(levelName);
            this.loadGUIEntities();
            this.loadNPCEntities();
            this.fadeScreenFromBlack();
            this.drawLevelNameSplash();
            ig.game.eventController.latestEventID = ig.game.eventID;
            ig.game.level = levelName;
            ig.game.inGameGUIController.updateObjectives(ig.game.eventID);
        },

        changeLevel: function(levelName) {
            this.loadLevelMap(levelName);
            this.loadPlayerAtSpawnPoint();
            this.loadGUIEntities();
            this.loadNPCEntities();
            this.fadeScreenFromBlack();
            this.drawLevelNameSplash();
            ig.game.level = levelName;
            ig.game.inGameGUIController.updateObjectives(ig.game.eventID);
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
        },

        loadLevelMap: function(levelName) {
            this.currentLevel = levelName.replace(/^(Level)?(\w)(\w*)/, function( m, l, a, b ) {
                return a.toUpperCase() + b;
            });
            ig.game.loadLevel(ig.global['Level' + this.currentLevel]);
        },

        loadPlayerAtSpawnPoint: function() {
            var spawnpoint = ig.game.getEntityByName('playerSpawn');
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
                var paceDestinationPoliceman12 = ig.game.getEntityByName('police12_paceDestination');
                var entityPolice12 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman12.pos.x, spawnpointPoliceman12.pos.y, {name: 'Policeman', media: 'Policeman'});
                entityPolice12.orientation = 'up';

                entityPolice12.addPacingDestination(spawnpointPoliceman12.pos.x, spawnpointPoliceman12.pos.y, 10);
                entityPolice12.addPacingDestination(paceDestinationPoliceman12.pos.x, paceDestinationPoliceman12.pos.y, 10);
                entityPolice12.startPacing();

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
                    var entityToaster1 = ig.game.spawnEntity(EntityToaster, spawnpointToaster1.pos.x, spawnpointToaster1.pos.y, {name: 'SecurityBot 17'});
                    entityToaster1.speed = 100;

                    var spawnpointToaster2 = ig.game.getEntityByName('toasterSpawn_2');
                    var entityToaster2 = ig.game.spawnEntity(EntityToaster, spawnpointToaster2.pos.x, spawnpointToaster2.pos.y, {name: 'SecurityBot 11'});
                    entityToaster2.speed = 100;

                    var spawnpointToaster3 = ig.game.getEntityByName('toasterSpawn_3');
                    var entityToaster3 = ig.game.spawnEntity(EntityToaster, spawnpointToaster3.pos.x, spawnpointToaster3.pos.y, {name: 'SecurityBot 88'});
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
                    var entityToaster1 = ig.game.spawnEntity(EntityToaster, spawnpointToaster1.pos.x, spawnpointToaster1.pos.y, {name: 'SecurityBot 17'});
                    entityToaster1.speed = 100;

                    var spawnpointToaster2 = ig.game.getEntityByName('toaster2_walkDestination');
                    var entityToaster2 = ig.game.spawnEntity(EntityToaster, spawnpointToaster2.pos.x, spawnpointToaster2.pos.y, {name: 'SecurityBot 11'});
                    entityToaster2.speed = 100;

                    var spawnpointToaster3 = ig.game.getEntityByName('toaster3_walkDestination');
                    var entityToaster3 = ig.game.spawnEntity(EntityToaster, spawnpointToaster3.pos.x, spawnpointToaster3.pos.y, {name: 'SecurityBot 88'});
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
                    var entityToaster1 = ig.game.spawnEntity(EntityToaster, spawnpointToaster1.pos.x, spawnpointToaster1.pos.y, {name: 'SecurityBot 17'});
                    entityToaster1.speed = 100;

                    var spawnpointToaster2 = ig.game.getEntityByName('toaster2_walkDestination');
                    var entityToaster2 = ig.game.spawnEntity(EntityToaster, spawnpointToaster2.pos.x, spawnpointToaster2.pos.y, {name: 'SecurityBot 11'});
                    entityToaster2.speed = 100;

                    var spawnpointToaster3 = ig.game.getEntityByName('toaster3_walkDestination');
                    var entityToaster3 = ig.game.spawnEntity(EntityToaster, spawnpointToaster3.pos.x, spawnpointToaster3.pos.y, {name: 'SecurityBot 88'});
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
                    // spawn dead cyborg
                    var bossFightScene = ig.game.spawnEntity(EntityBoss, 699, 226);
                    ig.game.getEntitiesByType('EntityBoss')[0].stateAnimation = 'dead';

                }
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
            console.log(currentLevel + " check is valid");
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

        /*
        loadNPCEntities: function() {
            if (ig.game.eventController.latestEventID <= 0) {
                if (this.currentLevel == '1_House_UpperFloor') {
                    var spawnpointFather = ig.game.getEntityByName('fatherSpawn');
                    ig.game.spawnEntity(EntityNPC, spawnpointFather.pos.x, spawnpointFather.pos.y, {name: 'Dad', media: 'Father'});
                }
            }
            else if (ig.game.eventController.latestEventID <= 4) {
                if (this.currentLevel == '1_House_UpperFloor') {
                    ig.game.spawnEntity(EntityNPC, -100, 0, {name: 'Police Officer Lisa', media: 'Lisa'});
                    ig.game.spawnEntity(EntityNPC, -100, 0, {name: 'Policeman', media: 'Policeman'});
                }
            }
            else if (ig.game.eventController.latestEventID == 5) {
                if (this.currentLevel == '1_House_GroundFloor') {
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
                    entityPolice4.orientation = 'right';

                    var spawnpointPoliceman5 = ig.game.getEntityByName('policeSpawn_5');
                    var entityPolice5 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman5.pos.x, spawnpointPoliceman5.pos.y, {name: 'Policeman', media: 'Policeman'});
                    entityPolice5.orientation = 'left';

                    var spawnpointPoliceman6 = ig.game.getEntityByName('policeSpawn_6');
                    var entityPolice6 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman6.pos.x, spawnpointPoliceman6.pos.y, {name: 'Policeman', media: 'Policeman'});
                    entityPolice6.orientation = 'right';

                    var spawnpointPoliceman7 = ig.game.getEntityByName('policeSpawn_7');
                    var entityPolice7 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman7.pos.x, spawnpointPoliceman7.pos.y, {name: 'Policeman', media: 'Policeman'});
                    entityPolice7.orientation = 'down';
                }
            }
            else if (ig.game.eventController.latestEventID == 6) {
                if (this.currentLevel == '2_PoliceHQ_GroundFloor') {
                    ig.game.player.orientation = 'up';

                    var spawnpointLisa = ig.game.getEntityByName('lisaSpawn');
                    var entityLisa = ig.game.spawnEntity(EntityNPC, spawnpointLisa.pos.x, spawnpointLisa.pos.y, {name: 'Police Officer Lisa', media: 'Lisa'});
                    entityLisa.orientation = 'up';

                    var spawnpointSteve = ig.game.getEntityByName('steveSpawn');
                    var entitySteve = ig.game.spawnEntity(EntityNPC, spawnpointSteve.pos.x, spawnpointSteve.pos.y, {name: 'Section Chief Steve', media: 'Steve'});
                    entitySteve.orientation = 'left';

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
                    var paceDestinationPoliceman12 = ig.game.getEntityByName('police12_paceDestination');
                    var entityPolice12 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman12.pos.x, spawnpointPoliceman12.pos.y, {name: 'Policeman', media: 'Policeman'});
                    entityPolice12.orientation = 'up';

                    entityPolice12.addPacingDestination(spawnpointPoliceman12.pos.x, spawnpointPoliceman12.pos.y, 10);
                    entityPolice12.addPacingDestination(paceDestinationPoliceman12.pos.x, paceDestinationPoliceman12.pos.y, 10);
                    entityPolice12.startPacing();

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
            }
            else if (ig.game.eventController.latestEventID <= 8) {
                if (this.currentLevel == '2_PoliceHQ_GroundFloor') {
                    ig.game.player.orientation = 'up';

                    var spawnpointLisa = ig.game.getEntityByName('lisaWalkDestination_7');
                    var entityLisa = ig.game.spawnEntity(EntityNPC, spawnpointLisa.pos.x, spawnpointLisa.pos.y, {name: 'Police Officer Lisa', media: 'Lisa'});
                    entityLisa.orientation = 'up';

                    var spawnpointSteve = ig.game.getEntityByName('steveWalkDestination_6');
                    var entitySteve = ig.game.spawnEntity(EntityNPC, spawnpointSteve.pos.x, spawnpointSteve.pos.y, {name: 'Section Chief Steve', media: 'Steve'});
                    entitySteve.orientation = 'left';

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
                    var paceDestinationPoliceman12 = ig.game.getEntityByName('police12_paceDestination');
                    var entityPolice12 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman12.pos.x, spawnpointPoliceman12.pos.y, {name: 'Policeman', media: 'Policeman'});
                    entityPolice12.orientation = 'up';

                    entityPolice12.addPacingDestination(spawnpointPoliceman12.pos.x, spawnpointPoliceman12.pos.y, 10);
                    entityPolice12.addPacingDestination(paceDestinationPoliceman12.pos.x, paceDestinationPoliceman12.pos.y, 10);
                    entityPolice12.startPacing();

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
            }
            else if (ig.game.eventController.latestEventID == 9) {
                if (this.currentLevel == '3_Tower_GroundFloor') {
                    ig.game.player.orientation = 'up';

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
                    var entityToaster1 = ig.game.spawnEntity(EntityToaster, spawnpointToaster1.pos.x, spawnpointToaster1.pos.y, {name: 'SecurityBot 17'});
                    entityToaster1.speed = 100;

                    var spawnpointToaster2 = ig.game.getEntityByName('toasterSpawn_2');
                    var entityToaster2 = ig.game.spawnEntity(EntityToaster, spawnpointToaster2.pos.x, spawnpointToaster2.pos.y, {name: 'SecurityBot 11'});
                    entityToaster2.speed = 100;

                    var spawnpointToaster3 = ig.game.getEntityByName('toasterSpawn_3');
                    var entityToaster3 = ig.game.spawnEntity(EntityToaster, spawnpointToaster3.pos.x, spawnpointToaster3.pos.y, {name: 'SecurityBot 88'});
                    entityToaster3.speed = 100;
                }
            }
            else if (ig.game.eventController.latestEventID <= 10) {
                if (this.currentLevel == '3_Tower_GroundFloor') {
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
                    var entityToaster1 = ig.game.spawnEntity(EntityToaster, spawnpointToaster1.pos.x, spawnpointToaster1.pos.y, {name: 'SecurityBot 17'});
                    entityToaster1.speed = 100;

                    var spawnpointToaster2 = ig.game.getEntityByName('toaster2_walkDestination');
                    var entityToaster2 = ig.game.spawnEntity(EntityToaster, spawnpointToaster2.pos.x, spawnpointToaster2.pos.y, {name: 'SecurityBot 11'});
                    entityToaster2.speed = 100;

                    var spawnpointToaster3 = ig.game.getEntityByName('toaster3_walkDestination');
                    var entityToaster3 = ig.game.spawnEntity(EntityToaster, spawnpointToaster3.pos.x, spawnpointToaster3.pos.y, {name: 'SecurityBot 88'});
                    entityToaster3.speed = 100;
                }
            }
            else if (ig.game.eventController.latestEventID >= 11) {
                if (this.currentLevel == '3_Tower_TopFloor') {
                    ig.game.player.orientation = 'down';

                    var spawnpointLisa = ig.game.getEntityByName('lisaSpawn');
                    var entityLisa = ig.game.spawnEntity(EntityNPC, spawnpointLisa.pos.x, spawnpointLisa.pos.y, {name: 'Police Officer Lisa', media: 'Lisa'});
                    entityLisa.orientation = 'down';

                    var spawnpointSteve = ig.game.getEntityByName('steveSpawn');
                    var entitySteve = ig.game.spawnEntity(EntityNPC, spawnpointSteve.pos.x, spawnpointSteve.pos.y, {name: 'Section Chief Steve', media: 'Steve'});
                    entitySteve.orientation = 'down';

                    var spawnpointPoliceman1 = ig.game.getEntityByName('policeSpawn_1');
                    var entityPolice1 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman1.pos.x, spawnpointPoliceman1.pos.y, {name: 'Policeman', media: 'Policeman'});
                    entityPolice1.orientation = 'down';

                    var spawnpointPoliceman2 = ig.game.getEntityByName('policeSpawn_2');
                    var entityPolice2 = ig.game.spawnEntity(EntityNPC, spawnpointPoliceman2.pos.x, spawnpointPoliceman2.pos.y, {name: 'Policeman', media: 'Policeman'});
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
                }
            }
            else {
                console.log('No NPC entities needed at this time.');
            }
        }
        */
    });

});
