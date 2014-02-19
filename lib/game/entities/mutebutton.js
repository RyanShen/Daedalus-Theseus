ig.module( 
    'game.entities.player'
)
.requires(
    'impact.entity'
)
.defines(function(){

EntityMutebutton = ig.Entity.extend ({

    activated: false,

    init: function() {
        this.parent(x, y, settings);
    },

    update: function() {
        this.update();
        if (this.activated) {
            ig.audio.toggleMute();
        }
    }


});

});