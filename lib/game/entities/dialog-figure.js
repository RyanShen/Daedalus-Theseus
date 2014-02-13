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
    _xNameLeft: 180,
    _xNameRight: 800,
    _xName: 0,
    _yName: 680,
    _xDesLeft: 0,
    _xDesRight: 684,
    _xDelta: 90,
    _yDes: 428,
    _yDelta: 40,
    _alphaDes: 1,
    animationSheet: null,

    _xDesCurrent: 0,
    _yDesCurrent: 0,

    isAnimating: false,
    isActivated: false,

    zIndex: 920,


    init: function( x, y, settings ){
        this.parent(x, y, settings);
        this.animationSheet = new ig.AnimationSheet( 'media/figure.png', 340, 340 );
        this.font = new ig.Font( 'media/Calibri48.png' );
    },

    setFigure: function( side, name, tileNum ) {
        this.side = side;
        this.name = 'dialogFigure-' + name;
        this.characterName = name;


        this.anim = new ig.Animation( this.animationSheet, 0.1, [tileNum] );

        if( side == 'left' )
        {
            this.pos.x = this._xDesLeft - this._xDelta;
            this.pos.y = this._yDes + this._yDelta;
            this._xName = this._xNameLeft;
        }
        else
        {
            this.pos.x = this._xDesRight + this._xDelta;
            this.pos.y = this._yDes + this._yDelta;
            this._xName = this._xNameRight;
        }
    },

    replaceFigure: function( tileNum ) {

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
            this._yDesCurrent = this._yDes;
        }
        else
        {
            this._xDesCurrent = this._xDesRight;
            this._yDesCurrent = this._yDes;
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
            this._yDesCurrent = this._yDes + this._yDelta;
        }
        else
        {
            this._xDesCurrent = this._xDesRight + this._xDelta;
            this._yDesCurrent = this._yDes + this._yDelta;
        }

        this._alphaDes = 0;

        this.isAnimating = true;
        this.isActivated = false;
    },

    update: function(){

        if( this.isAnimating == true )
        {

            var dis = this._xDesCurrent - this.pos.x ;
            if( dis >= 0.05 || dis <= -0.05 )
            {
                this.pos.x += dis/10;
                this.pos.y += ( this._yDesCurrent - this.pos.y )/10;
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
                this._yName );
        }


        //this.anim.draw( 0, 0 );
    }
});

});