ig.module(
    'game.entities.levelChangeTrigger'
)
.requires(
    'impact.entity'
)
.defines(function(){

    EntityLevelChangeTrigger = ig.Entity.extend({
        size: {x: 32, y: 32},

        _wmScalable: true,
        _wmDrawBox: true,
        _wmBoxColor: 'rgba(0, 255, 0, 0.7)',

        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.NEVER,

        nextLevelName: null,

        levelController: null,

        init: function(x, y, settings){
            this.parent(x, y, settings);
            this.levelController = ig.game.levelController;
        },

        check: function(other){
            console.log(this.nextLevelName);
                this.levelController.loadLevel(this.nextLevelName);
        },

        update: function(){

        }
    });

});