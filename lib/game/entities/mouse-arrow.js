ig.module( 
    'game.entities.mouse-arrow'
)
.requires(
    'impact.entity'
)
.defines(function(){

EntityMouseArrow = ig.Entity.extend({

    size: { x: 1, y: 1 },
    offset: { x:30, y: 62 },
    name: 'mouseArrow',
    zIndex: 500,

    animSheet: new ig.AnimationSheet( 'media/NavigationSign_60x78.png', 60, 78 ),

    init: function( x, y, settings ) {

        this.addAnim( 'idle', 1, [23] );
        this.addAnim( 'point', 0.042, [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23] );
        this.addAnim( 'block', 0.042, [24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47] );
        this.parent( x, y, settings );

    },

    pointAt: function( x, y, blocked ){

        this.pos.x = x;
        this.pos.y = y;

        if( blocked )
        {
            this.currentAnim = this.anims.block.rewind();
        }
        else
        {
            this.currentAnim = this.anims.point.rewind();
        }

    },

    update: function() {

        if( this.currentAnim.frame >= 23 )
        {
            this.pos.x = -100;
            this.pos.y = -100;
            this.currentAnim = this.anims.idle;

        }
        this.parent();
    }

});

});