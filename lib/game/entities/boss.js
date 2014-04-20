ig.module(
    'game.entities.boss'
)
.requires(
    'impact.entity',
    'game.entities.walker',
    'game.classes.astar'
)
.defines(function(){

EntityBoss = EntityWalker.extend({

    collider: ig.Entity.COLLIDES.PASSIVE,
    type: ig.Entity.TYPE.B,
    checkAgainst: ig.Entity.TYPE.A,
    size: { x: 200, y: 200 },
    offset: { x:0, y: 0 },
    maxVel:{ x: 400, y: 400},
    speed: 220,
    zIndex:100,

    animSheet: new ig.AnimationSheet( 'media/Characters/Boss.png', 200, 200 ),
    animSheetDebris: new ig.AnimationSheet( 'media/Characters/BossDebris.png', 255, 168 ),
    animIdle: null,
    animAscending: null,
    animFloating: null,
    animDebris: null,
    floatingRange: 6,
    floatingHeight: 30,
    floatingSpd: 0.05,
    bodyY: 0,
    timer: 0,
    stateAnimation: 'appearing', //appearing: stand on platform, ascending: ascending into midair, floating: float in the air, dead: debris
    isSuspended: false,

    init: function( x, y, settings ) {

        this.name = settings.name;

        this.animIdle =  new ig.Animation( this.animSheet, 1, [0], true );
        this.animAscending =  new ig.Animation( this.animSheet, 0.015,
            [0,1,2,3,
            4,5,6,7,
            8,9,10,11,
            12,13,14,15,
            16,17,18,19,
            20,21,22,23,
            24,25,26,27,
            28,29,30,31,
            32,33,34,35,
            36,37,38,39,
            40,41,42,43,
            44,45,46,47], false );
        this.animFloating =  new ig.Animation( this.animSheet, 0.06,
            [48,49,50,51,
            52,53,54,55,
            56,57,58,59,
            60,61,62,63,
            64,65,66,67,
            68,69,70,71], false );
        this.animDebris =  new ig.Animation( this.animSheetDebris, 1, [0], true );
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

    update: function(){

        if( this.isSuspended )
            return;

        switch( this.stateAnimation )
        {
            case 'appearing':
                this.zIndex = this.pos.y + 130;
                break;
            case 'ascending':
                this.zIndex = this.pos.y + 130;
                this.parent();
                break;
            case 'floating':
                this.zIndex = this.pos.y + 130;
                this.parent();
                break;
            case 'dead':
                this.zIndex = this.pos.y;
                this.parent();
                break;
            default:
                this.parent();
                break;
        }


    },

    drawAppearing: function()
    {
        this.animIdle.draw( this.pos.x - ig.game.screen.x, this.pos.y - ig.game.screen.y );
    },

    draw: function() {

        //this.parent();
        switch( this.stateAnimation )
        {
            case 'appearing':
                break;
            case 'ascending':
                if( this.timer < 1.5 )
                {
                    this.timer += ig.system.tick;
                    this.animIdle.draw( this.pos.x - ig.game.screen.x, this.bodyY - ig.game.screen.y );
                    this.animAscending.gotoFrame(0);
                }
                else
                {

                    if( this.animAscending.frame == 47 )
                    {
                        this.animFloating.rewind();
                        this.stateAnimation = 'floating';
                        this.pos.y = this.bodyY;
                    }
                    else
                    {
                        this.bodyY -= 0.8;
                    }
                    this.animAscending.draw( this.pos.x - ig.game.screen.x, this.bodyY - ig.game.screen.y );
                    this.animAscending.update();

                }

                break;
            case 'floating':

                this.animFloating.draw( this.pos.x - ig.game.screen.x, this.pos.y - ig.game.screen.y );
                this.animFloating.update();
                break;
            case 'dead':
                this.animDebris.draw( this.pos.x - ig.game.screen.x - 23, this.pos.y - ig.game.screen.y + 52 );
                break;
            default:
                break;
        }

    },

    activate: function(){

        this.stateAnimation = 'ascending';
        this.animAscending.gotoFrame(0);
        this.bodyY = this.pos.y;
        timer = 0;
    },

    reset: function(){
        this.stateAnimation = 'appearing';
        this.bodyY = 0;
        this.timer = 0;
    },

    die: function(){
        this.stateAnimation = 'dead';
    },

    check: function(other){
        this.parent();
    }

});
});