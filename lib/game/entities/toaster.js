ig.module(
    'game.entities.toaster'
)
.requires(
    'impact.entity',
    'game.entities.walker',
    'game.classes.astar'
)
.defines(function(){

EntityToaster = EntityWalker.extend({

    collider: ig.Entity.COLLIDES.PASSIVE,
    type: ig.Entity.TYPE.B,
    checkAgainst: ig.Entity.TYPE.A,
    size: { x: 64, y: 64 },
    offset: { x:0, y: 0 },
    maxVel:{ x: 400, y: 400},
    speed: 220,
    zIndex:998,

    animSheetBody: new ig.AnimationSheet( 'media/Characters/Toaster.png', 64, 64 ),
    animBody: null,
    floatingRange: 4,
    floatingHeight: 28,
    floatingSpd: 0.05,
    random: 0,
    timer: 0,
    bodyY: 0,
    stateAnimation: 'floating', //floating: float in the air, dying: dying animation, dead: dead

    init: function( x, y, settings ) {

        this.name = settings.name;

        this.animSheet = new ig.AnimationSheet( 'media/Characters/ToasterShadow.png', 64, 64 );
        this.addAnim( 'floating', 1, [0] );
        this.currentAnim = this.anims.floating;
        this.animBody = new ig.Animation( this.animSheetBody, 1, [0,1], true );
        this.animBody.gotoFrame(0);

        this.random = 2 * Math.PI * Math.random();

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

        if( ig.input.pressed("space") )
        {
            this.die();
        }


        this.parent();
        this.zIndex = this.pos.y + 10;
    },

    draw: function() {

        this.parent();

        switch( this.stateAnimation )
        {
            case 'floating':
                this.bodyY = this.pos.y +
                    this.floatingRange * Math.sin( this.random + this.floatingSpd * this.timer++ ) -
                    this.floatingHeight;
                this.animBody.draw( this.pos.x - ig.game.screen.x, this.bodyY - ig.game.screen.y );
                break;
            case 'dying':
                if( this.bodyY < this.pos.y - 14 )
                {
                    this.bodyY += 2;
                }
                else
                {
                    this.bodyY = this.pos.y - 14;
                    this.stateAnimation = 'dead';
                }
                this.animBody.draw( this.pos.x - ig.game.screen.x, this.bodyY - ig.game.screen.y );
                break;
            case 'dead':
                this.animBody.draw( this.pos.x - ig.game.screen.x, this.bodyY - ig.game.screen.y );
                break;
            default:
                break;
        }

    },

    die: function(){

        this.stateAnimation = 'dying';
        this.animBody.gotoFrame(1);
    },

    check: function(other){
        this.parent();
    }

});
});