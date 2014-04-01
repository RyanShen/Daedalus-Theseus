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

        init: function() {
            this.createObjectiveBox();
        },

        update: function() {
        },

        draw: function() {
            if (this.screenFader) {
                this.screenFader.draw();
            }

            if (this.showObjectiveBox)
                this.objectiveFont.draw(this.objectiveText, 730, 20, ig.Font.ALIGN.LEFT);
        },

        createObjectiveBox: function() {
            ig.gui.element.add({
                name: 'ObjectiveBox_BG',
                group: 'Group_GUI',
                size: { x: 261, y: 299 },
                pos: { x: 720, y: 0 },
                state: {
                    normal: {
                        image: new ig.Image('media/objectiveBox.png')
                    }
                }
            })

            ig.gui.element.action('hideGroup', 'Group_GUI');

        },

        updateObjectives: function(eventID) {
            switch (eventID){
                case 1:
                    this.objectiveText = this.TextWrap('OBJECTIVE:\nLook for your father downstairs.', 100);
                    break;
                case 2:
                    this.objectiveText = this.TextWrap('OBJECTIVE:\nLook for your father at the front door.', 100);
                    break;
                case 3:
                    this.objectiveText = this.TextWrap('OBJECTIVE:\nUse the computer in your room to investigate the flash drive.', 100);
                    break;
                case 4:
                    this.objectiveText = this.TextWrap('OBJECTIVE:\nInvestigate your \nfather\'s room for more clues', 100);
                    break;
                case 5:
                    this.objectiveText = this.TextWrap('OBJECTIVE:\nGo to the front door to leave for the Police HQ when you are ready to leave.', 100);
                case 7:
                    this.objectiveText = this.TextWrap('OBJECTIVE:\nHelp police officers retrieve information from the pieces of evidence they are working on.', 100);
                    break;
            }

            this.showObjectiveBox = true;
        },

        toggleObjectiveBox: function(toggle) {
            this.showObjectiveBox = toggle;

            if (toggle)
                ig.gui.element.action('showGroup', 'Group_GUI');
            else
                ig.gui.element.action('hideGroup', 'Group_GUI');
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
                lineWidth += ig.system.context.measureText( words[index] + ' ').width;
                if( lineWidth >= width )
                {
                    newText += '\n';
                    newText += words[index];
                    newText += ' ';
                    lineWidth = 0;
                }
                else
                {
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
