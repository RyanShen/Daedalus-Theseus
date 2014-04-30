ig.module(
    'game.entities.eventTrigger'
)
.requires(
    'impact.entity'
)
.defines(function(){

    EntityEventTrigger = ig.Entity.extend({
        size: {x: 32, y: 32},

        _wmScalable: true,
        _wmDrawBox: true,
        _wmBoxColor: 'rgba(255, 0, 0, 0.7)',

        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.NEVER,

        isSubEvent: false,
        hasTriggered: false,
        eventID: 0,

        eventController: null,

        init: function(x, y, settings){
            this.parent(x, y, settings);
            this.eventController = ig.game.eventController;
        },

        check: function(other){
            if (this.isSubEvent && this.eventID == this.eventController.latestEventID){
                this.eventController.startSubEvent(this);
                this.hasTriggered = true;
            }
            else if (this.eventID == this.eventController.latestEventID + 1){
                this.eventController.startEvent(this);
                this.hasTriggered = true;
            }
        },

        update: function(){

        }
    });

});