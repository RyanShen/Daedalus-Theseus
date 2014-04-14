ig.module(
    'game.entities.lightStair'
)
.requires(
    'impact.entity'
)
.defines(function(){

EntityLightStair = ig.Entity.extend({

    //collider: ig.Entity.COLLIDES.PASSIVE,
    //type: ig.Entity.TYPE.B,
    //checkAgainst: ig.Entity.TYPE.A,
    size: { x: 200, y: 45 },
    zIndex:0,

    animSheet: new ig.AnimationSheet( 'media/Level Art Assets/BossPlatform/light_step.png', 200, 45 ),
    anim: [],
    alphaStep: 0,
    alphaSteps: [0,0,0],
    bodyY: 0,
    timer: 0,
    stateAnimation: 'deactivated', //deactivated, appearing, activated, disappearing

    init: function( x, y, settings ) {

        this.name = 'LightStair';

        this.anim.push( new ig.Animation( this.animSheet, 1, [0], true ) );
        this.anim.push( new ig.Animation( this.animSheet, 1, [0], true ) );
        this.anim.push( new ig.Animation( this.animSheet, 1, [0], true ) );

        this.parent( x, y, settings );
    },

    draw: function() {

        //this.parent();
        if( ig.input.pressed("up") )
        {
            this.activate();
        }
        if( ig.input.pressed("down") )
        {
            this.deactivate();
        }

        var sx = -ig.game.screen.x;
        var sy = -ig.game.screen.y;

        switch( this.stateAnimation )
        {
            case 'deactivated':
                break;
            case 'appearing':
                if( this.alphaStep < 2 )
                    this.alphaStep += 0.075;
                else
                    this.alphaStep = 2;

                this.alphaSteps[0] = Math.min( 1, Math.max( 0, this.alphaStep ) );
                this.alphaSteps[1] = Math.min( 1, Math.max( 0, this.alphaStep - 0.5 ) );
                this.alphaSteps[2] = Math.min( 1, Math.max( 0, this.alphaStep - 1 ) );
                break;
            case 'activated':

                break;
            case 'disappearing':
                if( this.alphaStep > 0 )
                    this.alphaStep -= 0.085;
                else
                    this.alphaStep = 0;

                this.alphaSteps[0] = Math.min( 1, Math.max( 0, this.alphaStep - 1 ) );
                this.alphaSteps[1] = Math.min( 1, Math.max( 0, this.alphaStep - 0.5 ) );
                this.alphaSteps[2] = Math.min( 1, Math.max( 0, this.alphaStep ) );
                break;
            default:
                break;
        }

        for( var i = 0; i<3; i++ )
        {
            this.anim[i].alpha = this.alphaSteps[i];
            this.anim[i].draw( this.pos.x + sx,  this.pos.y + sy - i*50 );
        }

    },

    activate: function(){
        this.stateAnimation = 'appearing';
    },

    deactivate: function(){
        this.stateAnimation = 'disappearing';
    }

});
});