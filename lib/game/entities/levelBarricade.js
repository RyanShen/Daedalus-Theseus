ig.module(
    'game.entities.levelBarricade'
)
.requires(
    'impact.entity',
    'game.classes.eventChain'
)
.defines(function(){

    EntityLevelBarricade = ig.Entity.extend({
        size: {x: 32, y: 32},

        _wmScalable: true,
        _wmDrawBox: true,
        _wmBoxColor: 'rgba(0, 0, 255, 0.7)',

        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.NEVER,

        eventChain: null,
        eventIDToCross: 0,
        eventController: null,
        dialogBox: null,
        isTriggered: false,

        init: function(x, y, settings){
            this.parent(x, y, settings);
            this.eventController = ig.game.eventController;
            this.eventChain = EventChain(this);
        },

        check: function(other){
            this.blockPlayerFromLeavingMap();
        },

        update: function(){
            this.eventChain();
        },

        blockPlayerFromLeavingMap: function(){
            if (this.eventIDToCross > this.eventController.latestEventID && !this.isTriggered){
                this.dialogBox = ig.game.getEntitiesByType(EntityDialogPlayer)[0];

                this.eventChain = EventChain(this)
                    .then(function ()
                    {
                        this.isTriggered = true;
                        ig.game.toggleEventModeInteraction(false);
                        ig.game.player.stop();

                        var dialogSetJSON = [
                            { name: ig.game.dialogController.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: 'I still have things to do here.' }
                        ];
                        this.dialogBox.playDialogSet(dialogSetJSON);
                    })
                    .waitUntil(function ()
                    {
                        return !this.dialogBox.isPlaying;
                    })
                    .then(function ()
                    {
                        var barricadeDestination = ig.game.getEntityByName('barricadeDestination');
                        ig.game.player.setDestination(ig.game.player.pos.x, barricadeDestination.pos.y);
                    })
                    .waitUntil(function ()
                    {
                        return ig.game.player.hasReachedDestination;
                    })
                    .then(function ()
                    {
                        this.isTriggered = false;
                        ig.game.toggleEventModeInteraction(true);
                    })
            }
            else {
                if (!ig.game.getEntitiesByType('EntityLevelSelector')[0].visible) {
                    ig.game.getEntitiesByType('EntityLevelSelector')[0].display();
                    var barricadeDestination = ig.game.getEntityByName('barricadeDestination');
                    ig.game.player.setDestination(ig.game.player.pos.x, barricadeDestination.pos.y);
                }
            }
        }
    });

});