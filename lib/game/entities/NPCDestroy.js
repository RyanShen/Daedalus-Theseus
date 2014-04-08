ig.module(
    'game.entities.NPCDestroy'
)
.requires(
    'impact.entity'
)
.defines(function(){

    EntityNPCDestroy = ig.Entity.extend({
        size: {x: 32, y: 32},

        _wmScalable: true,
        _wmDrawBox: true,
        _wmBoxColor: 'rgba(255, 255, 0, 0.7)',

        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.B,
        collides: ig.Entity.COLLIDES.NEVER,

        init: function(x, y, settings){
            this.parent(x, y, settings);
        },

        check: function(other){
            other.kill();
        },

        update: function(){

        }
    });

});