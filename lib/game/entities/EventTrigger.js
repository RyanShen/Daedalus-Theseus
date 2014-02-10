/*
This entity calls the triggeredBy( entity, trigger ) method of each of its
targets. #entity# is the entity that triggered this trigger and #trigger# 
is the trigger entity itself.


Keys for Weltmeister:

checks
        Specifies which type of entity can trigger this trigger. A, B or BOTH 
        Default: A

wait
        Time in seconds before this trigger can be triggered again. Set to -1
        to specify "never" - e.g. the trigger can only be triggered once.
        Default: -1
        
target.1, target.2 ... target.n
        Names of the entities whose triggeredBy() method will be called.
*/

ig.module(
    'game.entities.EventTrigger'
)
.requires(
    'impact.entity',
    'plugins.EventController'
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

        triggerOnce: false,
        hasTriggered: false,
        eventID: 0,

        eventController: new ig.EventController( ),

        init: function(x, y, settings){
            this.parent(x, y, settings);
        },


        check: function(other){
            if (!this.hasTriggered){
                console.log(this.eventID + ' starting.');
                this.eventController.startEvent(this.eventID);
                console.log(this.eventID + ' ended.');
                this.hasTriggered = true;
            }
        },


        update: function(){

        }
    });

});