/*
This entity calls ig.game.loadLevel() when its triggeredBy() method is called -
usually through an EntityTrigger entity.
Keys for Weltmeister:
level
        Name of the level to load. E.g. "LevelTest1" or just "test1" will load the 
        'LevelTest1' level.
*/
ig.module(
        'game.entities.levelchange'
)
.requires(
        'impact.entity'
)
.defines(function(){     
    EntityLevelchange = ig.Entity.extend({
        _wmDrawBox: true,
        _wmBoxColor: 'rgba(0, 0, 255, 0.7)',
        _wmScalable: true,
        size: {x: 8, y: 8},
        level: null,
        spawn : null, // NAME OF THE VOID FOR THE POS

        triggeredBy: function( entity, trigger ) {
            if(this.level) {
                this.loadNextLevel();
                this.loadPlayerAtSpawnPoint();
            }
        },

        update: function() {

        },

        loadNextLevel: function() {
            var levelName = this.level.replace(/^(Level)?(\w)(\w*)/, function( m, l, a, b ) {
                return a.toUpperCase() + b;
            });
            ig.game.player = ig.game.getEntitiesByType( EntityPlayer )[0];
            ig.game.loadLevel( ig.global['Level'+levelName] );
        },

        loadPlayerAtSpawnPoint: function() {
            if(this.spawn){
                var spawnpoint = ig.game.getEntityByName(this.spawn);
                if(spawnpoint){
                    ig.game.spawnEntity(EntityPlayer, spawnpoint.pos.x, spawnpoint.pos.y);
                    ig.game.player = ig.game.getEntitiesByType( EntityPlayer )[0];
                    ig.game.spawnEntity( EntityMouseArrow, -100, -100 );
                }

            }
        }
    });
});