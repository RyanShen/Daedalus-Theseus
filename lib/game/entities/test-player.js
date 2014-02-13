ig.module( 
    'game.entities.test-player' 
)
.requires(
    'impact.entity'
)
.defines(function(){

    EntityTestPlayer = ig.Entity.extend({

        size: { x: 25, y: 25 },
        collider: ig.Entity.COLLIDES.PASSIVE,
        type: ig.Entity.TYPE.A,
        checkAgainst: ig.Entity.TYPE.B,
        maxVel:{x:400,y:400},
        zIndex:999,

        animSheet : new ig.AnimationSheet( 'media/Level Art Assets/PlayerTest.png', 25, 25 ),

        init: function( x, y, settings ) {

            this.parent( x, y, settings );
            ig.game.player = this;
            this.addAnim( 'idle', 0.1, [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 3, 3, 3, 2, 2, 1] );

        },

        update: function() {

            var spd = 400;

            if ( ig.input.state('up') ) {
                this.vel.y = -spd;
            }
            else if ( ig.input.state('down') ) {
                this.vel.y = spd;
            }
            else
            {
                 this.vel.y = 0;
            }

            if ( ig.input.state('left') ) {
                this.vel.x = -spd;
            }
            else if ( ig.input.state('right') ) {
                this.vel.x = spd;
            }
            else {
                this.vel.x = 0;
            }
            this.currentAnim = this.anims.idle;
            this.parent();
        }

    });

});