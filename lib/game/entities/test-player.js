ig.module( 
    'game.entities.test-player' 
)
.requires(
    'impact.entity'
)
.defines(function(){

EntityTestPlayer = ig.Entity.extend({
    
    size: { x: 25, y: 25 },
    collider: ig.Entity.COLLIDES.ACTIVE,
    
    init: function( x, y, settings ) {
        
        this.parent( x, y, settings );
        
    },
    animSheet : new ig.AnimationSheet( 'media/TestMedia/PlayerTest.png', 25, 25 ),
    update: function() {

        this.addAnim( 'idle', 0.1, [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 3, 3, 3, 2, 2, 1] );
        var spd = 120;
        
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
        
        this.parent();
        
    }
    


});

});