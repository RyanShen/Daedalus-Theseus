ig.module( 
    'game.entities.dialog-figure'
)
.requires(
    'impact.entity'
)
.defines(function(){

EntityDialogFigure = ig.Entity.extend({

    size: { x: 340, y: 340 },
    side: null,
    anim: null,
    characterName: null,
    _xNameLeft: 330,
    _xNameRight: 254,
    _xNameCenter: 190,
    _yNameSide: 620,
    _yNameCenter: 550,
    _xName: 0,
    _yName: 0,
    _xDesLeft: -50,
    _xDesRight: 704,
    _xDesCenter: 312,
    _xDelta: 90,
    _yDesSide: 374,
    _yDesCenter: 200,
    _yDelta: 40,
    _alphaDes: 1,
    animationSheet: null,

    _xDesCurrent: 0,
    _yDesCurrent: 0,

    isAnimating: false,
    isActivated: false,

    zIndex: 2001,

    /* boy or girl */
    offset: 0,


    init: function( x, y, settings ){
        this.parent(x, y, settings);
        this.animationSheet = new ig.AnimationSheet( 'media/Characters/figure.png', 400, 400 );
        this.font = new ig.Font( 'media/Fonts/dialog_character_name.png' );
        this.offset = ig.game.avatarID * 18;
    },

    setFigure: function( side, name, tileNum ) {
        this.side = side;
        this.name = 'dialogFigure-' + name;
        this.characterName = name;
        if (tileNum < 12) {
            tileNum += this.offset;
        }
        this.anim = new ig.Animation( this.animationSheet, 0.1, [tileNum] );

        if( side == 'left' )
        {
            this.pos.x = this._xDesLeft - this._xDelta;
            this.pos.y = this._yDesSide + this._yDelta;
            this._xName = this._xNameLeft;
            this._yName = this._yNameSide;
        }
        else if( side == 'right' )
        {
            this.pos.x = this._xDesRight + this._xDelta;
            this.pos.y = this._yDesSide + this._yDelta;
            this._xName = this._xNameRight;
            this._yName = this._yNameSide;
        }
        else
        {
            this.pos.x = this._xDesCenter;
            this.pos.y = this._yDesCenter  + this._yDelta;
            this._xName = this._xNameCenter;
            this._yName = this._yNameCenter;
        }
    },

    replaceFigure: function( tileNum ) {
        if (tileNum < 12) {
            tileNum += this.offset;
        }
        this.anim = new ig.Animation( this.animationSheet, 0.1, [tileNum] );
    },

    isSamePerson: function( side, name ) {

        if( this.side == side && this.characterName == name )
            return true;
        else
            return false;
    },

    activate: function() {

        if( this.isActivated )
            return;

        //console.trace('activate '+ this.name);
        if( this.side == 'left' )
        {
            this._xDesCurrent = this._xDesLeft;
            this._yDesCurrent = this._yDesSide;
        }
        else if( this.side == 'right' )
        {
            this._xDesCurrent = this._xDesRight;
            this._yDesCurrent = this._yDesSide;
        }
        else
        {
            this._xDesCurrent = this._xDesCenter;
            this._yDesCurrent = this._yDesCenter;
        }

        this._alphaDes = 1;

        this.isAnimating = true;
        this.isActivated = true;
    },

    deactivate: function() {

        if( !this.isActivated )
            return;

        //console.trace('deactivate '+ this.name);
        if( this.side == 'left' )
        {
            this._xDesCurrent = this._xDesLeft - this._xDelta;
            this._yDesCurrent = this._yDesSide + this._yDelta;
        }
        else if( this.side == 'right' )
        {
            this._xDesCurrent = this._xDesRight + this._xDelta;
            this._yDesCurrent = this._yDesSide + this._yDelta;
        }
        else
        {
            this._xDesCurrent = this._xDesCenter;
            this._yDesCurrent = this._yDesCenter;
        }

        this._alphaDes = 0;

        this.isAnimating = true;
        this.isActivated = false;
    },

    update: function(){

        if( this.isAnimating == true )
        {

            var dis = this._yDesCurrent - this.pos.y;
            if( dis >= 0.05 || dis <= -0.05 )
            {
                this.pos.y += dis/10;
                this.pos.x += ( this._xDesCurrent - this.pos.x )/10;
                this.anim.alpha += ( this._alphaDes - this.anim.alpha )/10;
            }
            else
            {
                this.isAnimating = false;
            }
        }
    },

    draw: function(){

        if( !this.isAnimating && !this.isActivated )
            return;

        this.anim.draw( this.pos.x, this.pos.y );
        if( this.isActivated )
        {
            this.font.draw( this.characterName,
                this._xName,
                this._yName,
            ig.Font.ALIGN.LEFT );
        }


        //this.anim.draw( 0, 0 );
    }
});

});