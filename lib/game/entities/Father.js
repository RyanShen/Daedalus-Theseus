ig.module( 
    'game.entities.Father'
)
.requires(
    'impact.entity'
)
.defines(function(){

    EntityFather = ig.Entity.extend({

        size: { x: 25, y: 25 },
        collider: ig.Entity.COLLIDES.FIXED,
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        maxVel:{x:400,y:400},
        zIndex:998,

        animSheet : new ig.AnimationSheet( 'media/Level Art Assets/PlayerTest.png', 25, 25 ),

        init: function( x, y, settings ) {

            this.parent( x, y, settings );
            this.addAnim( 'idle', 0.1, [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 3, 3, 3, 2, 2, 1] );
        },

        update: function() {
            this.currentAnim = this.anims.idle;
            this.parent();
        },

        check: function(other){
            this.parent();
        },

        moveMe: function () {

            console.log('im moving');
            this.vel.y = 50;
        }
    });

});