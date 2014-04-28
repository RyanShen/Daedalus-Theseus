ig.module(
	'game.classes.inGameGUIController'
)
.requires(
	'impact.system',
    'game.classes.screen-fader'
)
.defines(function(){ "use strict";

    ig.InGameGUIController = ig.Class.extend({

        screenFader: null,
        fadeOutTimer: new ig.Timer(),
        fadeOutDuration: 2,

        objectiveFont: new ig.Font('media/Fonts/objectivebox_text.png'),
        objectiveText: '',
        showObjectiveBox: false,
        showUI: true,
        isHover: false,

        init: function() {

            //level number icon
            /*ig.gui.element.add({
                name: 'Button_IG_Level',
                group: 'Group_IG',
                size: { x: 115, y: 114 },
                pos: { x: 32, y: 24 },
                state: {
                    normal: {
                        image: new ig.Image('media/UI/InGame/IG_btn_blank.png')
                    }
                }
            });*/

            //achievements button
            ig.gui.element.add({
                name: 'Button_IG_Achievements',
                group: 'Group_IG',
                size: { x: 65, y: 65 },
                pos: { x: 87, y: 14 },
                state: {
                    normal: {
                        image: new ig.Image('media/UI/InGame/IG_btn_achievements.png')
                    },
                    hover: {
                        image: new ig.Image('media/UI/InGame/IG_btn_achievements_hover.png')
                    },
                    active: {
                        image: new ig.Image('media/UI/InGame/IG_btn_achievements.png')
                    }
                },
                click: function() {
                    ig.game.inGameGUIController.toggleAchievements();
                }
            });

            //map button
            ig.gui.element.add({
                name: 'Button_IG_Map',
                group: 'Group_IG',
                size: { x: 65, y: 65 },
                pos: { x: 22, y: 14 },
                state: {
                    normal: {
                        image: new ig.Image('media/UI/InGame/IG_btn_map.png')
                    },
                    hover: {
                        image: new ig.Image('media/UI/InGame/IG_btn_map_hover.png')
                    },
                    active: {
                        image: new ig.Image('media/UI/InGame/IG_btn_map.png')
                    }
                },
                click: function() {
                    ig.game.inGameGUIController.toggleMap();
                }
            });

            //objective box
            ig.gui.element.add({
                name: 'Box_IG_Objectivebox',
                group: 'Group_IG',
                size: { x: 240, y: 138 },
                pos: { x: 750, y: 42 },
                state: {
                    normal: {
                        image: new ig.Image('media/UI/InGame/IG_objectivebox.png')
                    },
                    hover: {
                        image: new ig.Image('media/UI/InGame/IG_objectivebox.png')
                    }
                },
                alpha: 0
            });

            //objective button
            ig.gui.element.add({
                name: 'Button_IG_Objective',
                group: 'Group_IG',
                size: { x: 65, y: 65 },
                pos: { x: 937, y: 14 },
                state: {
                    normal: {
                        image: new ig.Image('media/UI/InGame/IG_btn_objective.png')
                    },
                    hover: {
                        image: new ig.Image('media/UI/InGame/IG_btn_objective_hover.png')
                    },
                    active: {
                        image: new ig.Image('media/UI/InGame/IG_btn_objective.png')
                    }
                },
                click: function() {
                    ig.game.inGameGUIController.toggleObjectiveBox();
                }
            });

        },

        toggleAchievements: function() {
            //open achievements overlay
            //console.trace('GUI: open achievements overlay');
            ig.gui.element.action('hideGroup', 'Group_MainMenu');
            ig.game.getEntitiesByType('EntityAchievementViewer')[0].display();
        },

        toggleMap: function() {
           //open map overlay
           //console.trace('GUI: open map overlay');
            ig.game.getEntitiesByType('EntityLevelSelector')[0].display();
        },

        toggleObjectiveBox: function() {
            this.showObjectiveBox = !this.showObjectiveBox;
            //console.trace('GUI: ' + (this.showObjectiveBox==true?'open':'close') + 'objective box');
            //console.trace(this.showObjectiveBox);
            if( this.showObjectiveBox )
            {
                //this.updateObjectives(11);
                ig.gui.element.action('show', 'Box_IG_Objectivebox');
                ig.gui.element.action('getByName', 'Box_IG_Objectivebox').alpha = 0;
            }
        },

        toggleUI: function( toggle ){

            if( toggle )
            {
                this.showUI = true;
                ig.gui.element.action('showGroup', 'Group_IG');
            }
            else
            {
                this.showUI = false;
                ig.gui.element.action('hideGroup', 'Group_IG');
                ig.gui.element.action('disableGroup', 'Group_IG');
            }
        },

        update: function() {

            if( this.showUI )
            {
                var alpha = ig.gui.element.action('getByName', 'Button_IG_Map').alpha;
                if( alpha < 0.9 )
                {
                    alpha += 0.1;
                    //ig.gui.element.action('getByName', 'Button_IG_Level').alpha = alpha;
                    ig.gui.element.action('getByName', 'Button_IG_Achievements').alpha = alpha;
                    ig.gui.element.action('getByName', 'Button_IG_Map').alpha = alpha;
                    ig.gui.element.action('getByName', 'Button_IG_Objective').alpha = alpha;
                    if( this.showObjectiveBox )
                        ig.gui.element.action('getByName', 'Box_IG_Objectivebox').alpha = alpha;
                }
                else
                {
                    //ig.gui.element.action('getByName', 'Button_IG_Level').alpha = 1;
                    ig.gui.element.action('getByName', 'Button_IG_Achievements').alpha = 1;
                    ig.gui.element.action('getByName', 'Button_IG_Map').alpha = 1;
                    ig.gui.element.action('getByName', 'Button_IG_Objective').alpha = 1;

                    ig.gui.element.action('enableGroup', 'Group_IG');
                }

                this.isHover =
                    ig.gui.element.action('getByName', 'Button_IG_Achievements').stateString == 'hover'
                ||  ig.gui.element.action('getByName', 'Button_IG_Map').stateString == 'hover'
                ||  ig.gui.element.action('getByName', 'Button_IG_Objective').stateString == 'hover'
                || ( this.showObjectiveBox && ig.gui.element.action('getByName', 'Box_IG_Objectivebox').stateString == 'hover');


                if( this.showObjectiveBox )
                {
                    var alpha = ig.gui.element.action('getByName', 'Box_IG_Objectivebox').alpha;
                    if( alpha < 0.9 )
                    {
                        alpha += 0.1;
                        ig.gui.element.action('getByName', 'Box_IG_Objectivebox').alpha = alpha;
                        //ig.gui.element.action('getByName', 'Box_IG_Objectivebox').pos.y += 0.3;
                    }
                    else
                        ig.gui.element.action('getByName', 'Box_IG_Objectivebox').alpha = 1;
                }
                else
                {
                    var alpha = ig.gui.element.action('getByName', 'Box_IG_Objectivebox').alpha;
                    if( alpha > 0.1 )
                    {
                        alpha -= 0.1;
                        ig.gui.element.action('getByName', 'Box_IG_Objectivebox').alpha = alpha;
                        //ig.gui.element.action('getByName', 'Box_IG_Objectivebox').pos.y -= 0.3;
                    }
                    else
                    {
                        ig.gui.element.action('getByName', 'Box_IG_Objectivebox').alpha = 0;
                        ig.gui.element.action('hide', 'Box_IG_Objectivebox');
                    }
                }

            }
            else
            {
                var alpha = ig.gui.element.action('getByName', 'Button_IG_Map').alpha;
                if( alpha > 0.1 )
                {
                    alpha -= 0.1;
                    ig.gui.element.action('getByName', 'Button_IG_Achievements').alpha = alpha;
                    ig.gui.element.action('getByName', 'Button_IG_Map').alpha = alpha;
                    ig.gui.element.action('getByName', 'Button_IG_Objective').alpha = alpha;
                    if( this.showObjectiveBox )
                        ig.gui.element.action('getByName', 'Box_IG_Objectivebox').alpha = alpha;
                }
                else
                {
                    ig.gui.element.action('getByName', 'Button_IG_Achievements').alpha = 0;
                    ig.gui.element.action('getByName', 'Button_IG_Map').alpha = 0;
                    ig.gui.element.action('getByName', 'Button_IG_Objective').alpha = 0;

                    ig.gui.element.action('hideGroup', 'Group_IG');
                }

                this.isHover = false;
            }


        },

        draw: function() {
            if (this.screenFader) {
                this.screenFader.draw();
            }

            if ( this.showObjectiveBox && this.showUI && ig.gui.element.action('getByName', 'Box_IG_Objectivebox').alpha >= 0.2 )
            {
                this.objectiveFont.draw(this.objectiveText, 766, 90, ig.Font.ALIGN.LEFT);
            }
        },

        updateObjectives: function(eventID) {

            var wrapWidth = 23;
            switch (eventID){
                case 1:
                    this.objectiveText = this.TextWrap('Look for your father downstairs.', wrapWidth);
                    break;
                case 2:
                    this.objectiveText = this.TextWrap('Look for your father at the front door.', wrapWidth);
                    break;
                case 3:
                    this.objectiveText = this.TextWrap('Use the computer on the kitchen table to investigate the flash drive.', wrapWidth);
                    break;
                case 4:
                    this.objectiveText = this.TextWrap('Investigate your father\'s room for more clues.', wrapWidth);
                    break;
                case 5:
                    this.objectiveText = this.TextWrap('Go to the front door to leave for the Police HQ when you are ready.', wrapWidth);
                    break;
                case 7:
                    this.objectiveText = this.TextWrap('Help police officers with the evidence they are working on.', wrapWidth);
                    break;
                case 8:
                    this.objectiveText = this.TextWrap('Report to Section Chief Steve\'s office.', wrapWidth);
                    break;
                case 10:
                    this.objectiveText = this.TextWrap('Deactivate the SecurityBots.', wrapWidth);
                    break;
                case 12:
                    this.objectiveText = this.TextWrap('Destroy MINO-4.', wrapWidth);
                    break;
                case 14:
                    this.objectiveText = this.TextWrap('Investigate the secret rooms for clues.', wrapWidth);
                    break;
                default:
                    this.objectiveText = this.TextWrap('', wrapWidth);
                    break;
            }

            if( this.showObjectiveBox == false )
            {
                this.toggleObjectiveBox();
            }
        },


        TextWrap: function( text, width ){
            if( text == null || text == '' || text == undefined )
                return '';

            var words = text.split( ' ' );
            var index = 0;
            var newText = '';
            var lineWidth = 0;

            while( index < words.length )
            {
                //lineWidth += ig.system.context.measureText( words[index] + ' ').width;
                lineWidth += words[index].length;
                if( lineWidth >= width )
                {
                    newText += '\n';
                    newText += words[index];
                    newText += ' ';
                    lineWidth = words[index].length;
                }
                else
                {
                    lineWidth += 1;
                    newText += words[index];
                    newText += ' ';
                }
                index++;
            }

            return newText;

        },

        fadeScreenToBlack: function() {
            this.screenFader = new ig.ScreenFader({fade: 'in'});
        },

        fadeScreenFromBlack: function() {
            this.screenFader = new ig.ScreenFader({fade: 'out'});
        }
    });

});
