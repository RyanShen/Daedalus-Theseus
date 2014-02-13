ig.module( 
    'game.entities.fatherNPC'
)
.requires(
    'impact.entity',
    'game.entities.walker',
    'game.classes.astar'
)
.defines(function(){

    EntityFatherNPC = EntityWalker.extend({

        name: 'dad',
        collider: ig.Entity.COLLIDES.PASSIVE,
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        size: { x: 25, y: 25 },
        offset: { x:9, y: 47 },
        animSheet : new ig.AnimationSheet( 'media/Characters/Hunter_8x9_small_red.png', 50, 92 ),
        maxVel:{ x: 400, y: 400},
        speed: 220,
        animInterval: 0.04,
        zIndex:998,

        init: function( x, y, settings ) {
            //animation
            //down
            this.addAnim( 'stand_d', 1, [0] );
            this.addAnim( 'walk_d', this.animInterval, [8,9,10,11,12,13,14,15] );
            //down-left
            this.addAnim( 'stand_dl', 1, [1] );
            this.addAnim( 'walk_dl', this.animInterval, [16,17,18,19,20,21,22,23] );
            //left
            this.addAnim( 'stand_l', 1, [2] );
            this.addAnim( 'walk_l', this.animInterval, [24,25,26,27,28,29,30,31] );
            //up-left
            this.addAnim( 'stand_ul', 1, [3] );
            this.addAnim( 'walk_ul', this.animInterval, [32,33,34,35,36,37,38,39] );
            //down-right
            this.addAnim( 'stand_dr', 1, [4] );
            this.addAnim( 'walk_dr', this.animInterval, [40,41,42,43,44,45,46,47] );
            //right
            this.addAnim( 'stand_r', 1, [5] );
            this.addAnim( 'walk_r', this.animInterval, [48,49,50,51,52,53,54,55] );
            //up-right
            this.addAnim( 'stand_ur', 1, [6] );
            this.addAnim( 'walk_ur', this.animInterval, [56,57,58,59,60,61,62,63] );
            //up
            this.addAnim( 'stand_u', 1, [7] );
            this.addAnim( 'walk_u', this.animInterval, [64,65,66,67,68,69,70,71] );

            this.parent( x, y, settings );
        },

        update: function() {

            //update animation according to movement state and orientation
            if( this.vel.x == 0 && this.vel.y == 0 )
            {
                switch( this.orientation )
                {
                    case 'down':
                        this.currentAnim = this.anims.stand_d;
                        break;
                    case 'down-right':
                        this.currentAnim = this.anims.stand_dr;
                        break;
                    case 'right':
                        this.currentAnim = this.anims.stand_r;
                        break;
                    case 'up-right':
                        this.currentAnim = this.anims.stand_ur;
                        break;
                    case 'up':
                        this.currentAnim = this.anims.stand_u;
                        break;
                    case 'up-left':
                        this.currentAnim = this.anims.stand_ul;
                        break;
                    case 'left':
                        this.currentAnim = this.anims.stand_l;
                        break;
                    case 'down-left':
                        this.currentAnim = this.anims.stand_dl;
                        break;
                }
            }
            else
            {
                switch( this.orientation )
                {
                    case 'down':
                        this.currentAnim = this.anims.walk_d;
                        break;
                    case 'down-right':
                        this.currentAnim = this.anims.walk_dr;
                        break;
                    case 'right':
                        this.currentAnim = this.anims.walk_r;
                        break;
                    case 'up-right':
                        this.currentAnim = this.anims.walk_ur;
                        break;
                    case 'up':
                        this.currentAnim = this.anims.walk_u;
                        break;
                    case 'up-left':
                        this.currentAnim = this.anims.walk_ul;
                        break;
                    case 'left':
                        this.currentAnim = this.anims.walk_l;
                        break;
                    case 'down-left':
                        this.currentAnim = this.anims.walk_dl;
                        break;
                }
            }
            this.parent();
        },

        check: function(other){
            this.parent();
        }

    });

});