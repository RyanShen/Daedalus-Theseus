ig.module( 
    'game.entities.dialog-player'
)
.requires(
    'impact.entity',

    'game.entities.dialog-figure',
    'game.entities.dialog-box'
)
.defines(function(){

EntityDialogPlayer = ig.Entity.extend({

    dialogBox: null,
    dialogJSON: null,
    dialogIndex: 0,
    dialogFigures: [],
    isPlaying: false,


    init: function(){

        this.dialogBox = ig.game.spawnEntity( EntityDialogBox, 97, 600 );

        this.dialogFigures.push( ig.game.spawnEntity( EntityDialogFigure, 0, 0 ) );
        this.dialogFigures.push( ig.game.spawnEntity( EntityDialogFigure, 0, 0 ) );
    },

    playDialogSet: function( dialogJSON ){

        this.isPlaying = true;
        this.dialogJSON = dialogJSON;
        var newdialog =  this.dialogJSON[this.dialogIndex];
        this.dialogBox.playSingleDialog(
            newdialog.side,
            newdialog.name,
            newdialog.text );

        this.playDialogFigure( newdialog.side, newdialog.name, newdialog.mediaNum );
    },

    playDialogFigure: function( side, name, tileNum ){

        var dialogFigureCur;
        var dialogFigureIdle;
        if( this.dialogFigures[0].isActivated )
        {
            dialogFigureCur = this.dialogFigures[0];
            dialogFigureIdle = this.dialogFigures[1];
        }
        else if( this.dialogFigures[1].isActivated )
        {
            dialogFigureCur = this.dialogFigures[1];
            dialogFigureIdle = this.dialogFigures[0];
        }
        else
        {
            dialogFigureCur = null;
            dialogFigureIdle = this.dialogFigures[0];
        }

        if( dialogFigureCur != null )
        {
            console.trace( dialogFigureCur.isSamePerson( side, name ) );
            //test replace media but don't reactivate the same person's dialog
            if( dialogFigureCur.isSamePerson( side, name ) )
                dialogFigureCur.replaceFigure( tileNum );
            else
            {
                dialogFigureCur.deactivate();
                if( side == 'noside' )
                    return;
                dialogFigureIdle.setFigure( side, name, tileNum );
                dialogFigureIdle.activate();
            }
        }
        else
        {
            if( side == 'noside' )
                return;
            dialogFigureIdle.setFigure( side, name, tileNum );
            dialogFigureIdle.activate();
        }




    },


    update: function(){


        if( this.dialogBox._finished )
        {
            this.dialogIndex++;
            if(  this.dialogJSON && this.dialogIndex <  this.dialogJSON.length )
            {
                var newdialog =  this.dialogJSON[this.dialogIndex];
                this.dialogBox.playSingleDialog(
                    newdialog.side,
                    newdialog.name,
                    newdialog.text );

                this.playDialogFigure( newdialog.side, newdialog.name, newdialog.mediaNum );
            }
            else
            {
                this.playDialogFigure( 'noside', null, null, null );

                this.isPlaying = false;
                this.dialogIndex = 0;
                this.dialogJSON = null;
            }
        }
    }

});

});