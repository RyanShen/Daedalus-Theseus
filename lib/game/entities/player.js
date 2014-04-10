ig.module( 
    'game.entities.player'
)
.requires(
    'impact.entity',
    'game.entities.walker',
    'game.classes.astar'
)
.defines(function(){

EntityPlayer = EntityWalker.extend({

    collider: ig.Entity.COLLIDES.PASSIVE,
    type: ig.Entity.TYPE.A,
    checkAgainst: ig.Entity.TYPE.B,
    size: { x: 32, y: 32 },
    offset: { x:29, y: 110 },
    animSheetDir: null,
    animSheet: null,
    maxVel:{ x: 400, y: 400},
    speed: 220,
    animInterval: 0.06,
    //animInterval: 1,
    zIndex:997,
    movementLock: false,

    init: function( x, y, settings ) {
        this.animSheetDir = 'media/Characters/MainCharacter_'+ig.game.dialogController.avatar[ig.game.avatarID].name+'.png';
        this.animSheet = new ig.AnimationSheet( this.animSheetDir, 87.5, 161 );

        //animation
        //down
        this.addAnim( 'stand_d', 1, [0] );
        this.addAnim( 'walk_d', this.animInterval*2, [8,9,10,11,12,13,14,15] );
        //down-left
        this.addAnim( 'stand_dl', 1, [1] );
        this.addAnim( 'walk_dl', this.animInterval, [16,17,18,19,20,21,22,23] );
        //left
        this.addAnim( 'stand_l', 1, [2] );
        this.addAnim( 'walk_l', this.animInterval*1.6, [24,25,26,27,28,29,30,31] );
        //up-left
        this.addAnim( 'stand_ul', 1, [3] );
        this.addAnim( 'walk_ul', this.animInterval, [32,33,34,35,36,37,38,39] );
        //down-right
        this.addAnim( 'stand_dr', 1, [4] );
        this.addAnim( 'walk_dr', this.animInterval, [40,41,42,43,44,45,46,47] );
        //right
        this.addAnim( 'stand_r', 1, [5] );
        this.addAnim( 'walk_r', this.animInterval*1.6, [48,49,50,51,52,53,54,55] );
        //up-right
        this.addAnim( 'stand_ur', 1, [6] );
        this.addAnim( 'walk_ur', this.animInterval, [56,57,58,59,60,61,62,63] );
        //up
        this.addAnim( 'stand_u', 1, [7] );
        this.addAnim( 'walk_u', this.animInterval*2, [64,65,66,67,68,69,70,71] );


        ig.game.player = this;
        this.parent( x, y, settings );

    },

    handleMovementTrace: function( res ) {

        if( this.node != null )
        {
            this.standing = false;
            this.pos.x += this.vel.x * ig.system.tick;
            this.pos.y += this.vel.y * ig.system.tick;
        }
        else
        {
            this.standing = false;

            if( res.collision.y ) {
                if( this.bounciness > 0 && Math.abs(this.vel.y) > this.minBounceVelocity ) {
                    this.vel.y *= -this.bounciness;
                }
                else {
                    if( this.vel.y > 0 ) {
                        this.standing = true;
                    }
                    this.vel.y = 0;
                }
            }
            if( res.collision.x ) {
                if( this.bounciness > 0 && Math.abs(this.vel.x) > this.minBounceVelocity ) {
                    this.vel.x *= -this.bounciness;
                }
                else {
                    this.vel.x = 0;
                }
            }
            if( res.collision.slope ) {
                var s = res.collision.slope;

                if( this.bounciness > 0 ) {
                    var proj = this.vel.x * s.nx + this.vel.y * s.ny;

                    this.vel.x = (this.vel.x - s.nx * proj * 2) * this.bounciness;
                    this.vel.y = (this.vel.y - s.ny * proj * 2) * this.bounciness;
                }
                else {
                    var lengthSquared = s.x * s.x + s.y * s.y;
                    var dot = (this.vel.x * s.x + this.vel.y * s.y)/lengthSquared;

                    this.vel.x = s.x * dot;
                    this.vel.y = s.y * dot;

                    var angle = Math.atan2( s.x, s.y );
                    if( angle > this.slopeStanding.min && angle < this.slopeStanding.max ) {
                        this.standing = true;
                    }
                }
            }

            this.pos = res.pos;
        }
    },

    update: function() {


        /*if ( ig.input.state('up') ) {
            this.vel.y = -this.speed;
        }
        else if ( ig.input.state('down') ) {
            this.vel.y = this.speed;
        }
        else
        {
            //this.vel.y = 0;
        }

        if ( ig.input.state('left') ) {
            this.vel.x = -this.speed;
        }
        else if ( ig.input.state('right') ) {
            this.vel.x = this.speed;
        }
        else {
            //this.vel.x = 0;
        }*/

        if( ig.input.pressed("rightclick") )
        {

            if ( this.movementLock == true ) {
                return;
            }
            var desX = ig.input.mouse.x + ig.game.screen.x;
            var desY = ig.input.mouse.y + ig.game.screen.y;

            var hasPath = this.setDestination( desX, desY );
            var mouseArrow = ig.game.getEntityByName('mouseArrow');
            mouseArrow.pointAt( desX, desY, !hasPath );


            /*var path = this.astar.searchPath(
                this.grid.getNodeByPosition( this.pos.x, this.pos.y ),
                this.grid.getNodeByPosition( desX, desY ),
                this.grid.grid );

            var traceX =  63;
            var traceY =  63;
            var traceEX = 30.5;
            var traceEY = 94.5;
            var traceDX = traceEX - traceX;
            var traceDY = traceEY - traceY;
            var collisionRes = ig.game.collisionMap.trace(
                traceX,
                traceY,
                traceDX,
                traceDY,
                0.5,
                0.5 );

            console.trace("collisionMap.trace" + traceX + "," + traceY
                + " to " + traceEX + "," + traceEY );
            console.trace( collisionRes );

            this.debugPrintPath( path );*/
        }

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

    //assign new speed to the player while updating animation frame interval to match the new speed
    setSpeed: function( newspd ){

        animInterval *= newspd / this.speed ;
        if( this.vel.x != 0 || this.vel.y != 0 )
            this.currentAnim.frameTime = animInterval;
        this.speed = newspd;
    },

    setMovementLock: function( isLocked ) {
        this.movementLock = isLocked;
    }

});

});