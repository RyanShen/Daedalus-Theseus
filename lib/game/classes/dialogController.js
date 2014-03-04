ig.module(
    'game.classes.dialogController'
)
.requires(
    'impact.system'
)
.defines(function(){


    DialogController = ig.Class.extend({
        
         dialogSetJSON: [{id: 1, content: [
                            { name: 'Justin', side: 'left' , mediaNum: 10, text: 'Hmm I managed to fix it. Maybe I could put into Dad\'s PC later.' }
                        ]},
                        {id: 2, content: [
                            { name: 'Justin', side: 'left' , mediaNum: 10, text: 'An encrypted text. Seems like Dad is hiding a password in it. It might be a password for his computer.' }
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
                            { name: 'Justin', side: 'left', mediaNum: 10, text: 'I should look for more clues' }
                        ]},
                        {id: 7, content: [
                            { name: 'Justin', side: 'left', mediaNum: 10, text: 'I think I should investigate for more clues first.' }
                        ]},
                        {id: 8, content: [
                            { name: 'Justin', side: 'left', mediaNum: 10, text: 'Hmm.. There\'s a link to what seems to be a diary log. I should take a look at it.' }
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