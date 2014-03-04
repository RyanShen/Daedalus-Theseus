ig.module(
    'game.classes.dialogController'
)
.requires(
    'impact.system'
)
.defines(function(){


    DialogController = ig.Class.extend({
        
         dialogSetJSON: [{id: 1, content: [
                            { name: 'Father', side: 'right', mediaNum: 0, text: 'Wow son! Just completed another CTF?' },
                            { name: 'Justin', side: 'left' , mediaNum: 1, text: 'Yup! Piece of cake!' },
                            { name: 'Father', side: 'right', mediaNum: 0, text: 'With your computer skills and my experience in robotics, we could do something really awesome! hahaha!' },
                            { name: 'Father', side: 'right', mediaNum: 0, text: 'But son.. always remember this. You must only use your skills for the good of people. Promise me that.' },
                            { name: 'Father', side: 'right', mediaNum: 0, text: 'Here. Take this flash drive. I need you to look after this.' },
                            { name: 'Justin', side: 'noside' , mediaNum: 1, text: '<Received Flash Drive from Dad.>' },
                            { name: 'Justin', side: 'left' , mediaNum: 1, text: 'What\'s up dad? Why are you talking weird?' },
                            { name: 'Father', side: 'right', mediaNum: 0, text: 'It contains very important information. You have to keep it safe. Promis-' },
                            { name: 'Father', side: 'noside', mediaNum: 0, text: '<Doorbell rings.>' },
                            { name: 'Father', side: 'right', mediaNum: 0, text: 'Oh no. It\'s them! Why are they here!?' },
                            { name: 'Justin', side: 'left' , mediaNum: 1, text: 'Dad.. Whats going on?' },
                            { name: 'Father', side: 'right', mediaNum: 0, text: 'Son. Stay here and be quiet. I\'ll answer the door.' },
                            { name: 'Justin', side: 'left' , mediaNum: 1, text: 'Dad!' }
                        ]},
                        {id: 2, content: [
                            { name: 'Father', side: 'noside', mediaNum: 0, text: 'HEY!' },
                            { name: 'Justin', side: 'left' , mediaNum: 1, text: 'Huh? Dad?' },
                            { name: 'Father', side: 'noside', mediaNum: 0, text: 'WHAT ARE YOU GUYS DOING HERE!?' },
                            { name: 'Father', side: 'noside', mediaNum: 0, text: 'NO WAIT! WHERE ARE YOU TAKING ME!' },
                            { name: 'Father', side: 'noside', mediaNum: 0, text: 'LET GO!' },
                            { name: 'Justin', side: 'left' , mediaNum: 1, text: 'Oh my god. Dad!' },
                            { name: 'Justin', side: 'left' , mediaNum: 1, text: 'I have to find out what\'s going on downstairs!' }
                        ]},
                        {id: 3, content: [
                            { name: 'Bed', side: 'noside', mediaNum: 1, text: 'It\'s not time for me to sleep' }
                        ]},
                        {id: 4, content: [
                            { name: 'Closet', side: 'noside', mediaNum: 1, text: 'I cannot open this!' }
                        ]},
                        {id: 5, content: [
                            { name: 'Book', side: 'noside', mediaNum: 1, text: 'I never read books' }
                        ]},
                        {id: 6, content: [
                            { name: 'Justin', side: 'noside', mediaNum: 1, text: 'I should look for more clues' }
                        ]},
                        {id: 7, content: [
                            { name: 'Justin', side: 'noside', mediaNum: 1, text: 'I think I should investigate for more clues first.' }
                        ]},
                        {id: 8, content: [
                            { name: 'Justin', side: 'noside', mediaNum: 1, text: 'I have gathered enough information... Oh wait, what is on dad\'s computer?' }
                        ]}
                    ],


        dialogBox: null,
        isLoaded: false,

        init: function() {

        },


        setDialogBox: function() {
            this.dialogBox = ig.game.getEntitiesByType(EntityDialogPlayer)[0];
        },

        // load the dialog according to the event id on trigger - called by interactive object (clickable)
        loadDialog: function (eventID) {

            var dialogs = null;

            // search for dialog in the dialogSetJSON file
            for (var i = 0; i < this.dialogSetJSON.length; i++) {
                if (this.dialogSetJSON[i].id == eventID) {
                    dialogs = this.dialogSetJSON[i].content;
                    break;
                }
            }

            if (dialogs != null) {
 //               if (!this.isLoaded) {
                    this.dialogBox.playDialogSet( dialogs );
                    this.isLoaded = true;
 //               }
            }
            else {
                // error handling
                console.log("dialog not found");
                this.isLoaded = false;
            }

        },

        // check if the dialog is loaded and has just ended
        ends: function() {
            if (this.isLoaded && !this.dialogBox.isPlaying) {
                this.isLoaded = false;
                return true;
            }
            return false;
        }
    });

});