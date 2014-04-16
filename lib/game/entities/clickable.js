ig.module(
    'game.entities.clickable'
)
    .requires(
    'impact.entity'

)
.defines(function() {
    EntityClickable = ig.Entity.extend({

        // define the type entity type B
        type: ig.Entity.TYPE.B,

        _wmScalable: true,
        _wmDrawBox: true,
        _wmBoxColor: 'rgba(255, 0, 0, 0.7)',

        status: 'unactivated',

        /*
         /* Must have Attributes
         /*
         /* name:      1, 2, 3, computer, fridge, ...     ( -1 is null )
         /* eventType: Dialog, CutScene, Problem, ...
         /* eventID:   Events are assigned with an ID
         /* next:      Next obj name to be triggered, default is -1      ( -1 is null )
         */
        name: 0,
        eventType: null,
        eventID: -1,
        nextEvent: -1,
        nextQuestion: null,
        passive: false,
        interactionID: null,

        /*
         /* Optional Attributes
         /*
         /* distance:
         /*			   	if 0, will not check distance
         /*              else, trigger depend on distance
         /* orientation: if not null, will only trigger when player has corresponding orientation
         /*			   	if null, will not check orientation
         /* dispose:     if true, the trigger can only be triggered once; default is false
         */
        distance: 0,
        orientation: null,
        dispose: 0,

        life: 10000,

        auto: 0,
        timer: new ig.Timer(),

        active: true,
        eventTriggered: false,
        size: {x: 25, y: 25},


        clickableLock: false,

        init: function(x, y, settings) {
            this.parent(x, y, settings);

        },

        update: function() {
            this.parent();
            if (!this.clickableLock) {
                if (ig.game.eventController.latestEventID < this.life) {
                    switch (this.status) {
                        case 'unactivated':
                            if (!this.eventTriggered &&
                                this.checkDistance() &&
                                this.checkOrientation() &&
                                (this.auto != this.clickedOn())) {
                                this.status = 'activated';
                            }
                            break;
                        case 'activated':
                            this.activate();
                            ig.game.toggleClickableInteraction(this, false);
                            ig.game.toggleUIPlayerInteraction(false);
                            this.status = 'eventTriggered';
                            break;
                        case 'eventTriggered':
                            if (this.eventType == 'Dialog' && ig.game.dialogController.ends() ||
                                this.eventType == 'CutScene' && ig.game.eventController.ends) {
                                if (this.nextEvent != -1) {
                                    ig.game.getEntityByName(this.nextEvent).status = 'activated';
                                }
                                if (this.nextQuestion != null) {
                                    for (var i = 1; i < this.nextQuestion.length; i += 2) {
                                        var nextItem = this.nextQuestion.charAt(i) * 10 + this.nextQuestion.charAt(i + 1);
                                        ig.game.getEntityByName("q" + nextItem).unlock();
                                    }
                                }
                                this.timer.set(0.5);
                                this.status = 'cooldown';
                                if (!this.dispose) {
                                    this.eventTriggered = false;
                                }
                                ig.game.toggleClickableInteraction(this, true);
                                ig.game.toggleUIPlayerInteraction(true);
                            }
                            break;
                        case 'cooldown':
                            if (this.timer.delta() >= 0) {
                                this.status = 'unactivated';
                            }
                            break;
                        default :
                            break;
                    }
                }
            }
        },

        activate: function() {
            switch (this.eventType) {
                case 'Dialog':
                    ig.game.dialogController.loadDialog(this.interactionID);
                    break;

                case 'CutScene':
                    ig.game.eventController.startEvent(this);
                    break;

                default:
                    break;
            }


        },

        deactivate: function() {
            if (!this.dispose) {
                this.activated = false;
                this.eventTriggered = false;
            }

        },

        isHover: function() {
            return ig.input.mouse.x + ig.game.screen.x >= this.pos.x &&
                ig.input.mouse.x + ig.game.screen.x <= this.pos.x + this.size.x &&
                ig.input.mouse.y + ig.game.screen.y >= this.pos.y &&
                ig.input.mouse.y + ig.game.screen.y <= this.pos.y + this.size.y;
        },

        clickedOn: function() {
            if (!ig.input.released('leftclick')) {
                return false;
            }
            return this.isHover();
        },

        checkDistance: function() {
            if (this.distance > 0) {
                return this.distanceTo(ig.game.player) <= this.distance;
            }
            return true;
        },

        /*
         /* check if the player is facing the object, possible facing conditions are:
         /*	object		player
         /*	down		up-right, up, up-left
         /*	up 			down-right, down, down-left
         /*	left 		up-right, right, down-right
         /*	right 		down-left, left, up-left
         */
        checkOrientation: function() {
            if (this.orientation == null) {
                return true;
            }
            var dirString;
            switch (this.orientation) {
                case 'down':
                    dirString = 'up';
                    break;
                case 'up':
                    dirString = 'down';
                    break;
                case 'left':
                    dirString = 'right';
                    break;
                case 'right':
                    dirString = 'left';
                    break;
                default:
                    return false;
                    break;
            }
            //string.indexOf() returns the position of the string in the other string
            //If not found, it will return -1:
            return ig.game.player.orientation.indexOf(dirString) != -1;
        }

    });


});