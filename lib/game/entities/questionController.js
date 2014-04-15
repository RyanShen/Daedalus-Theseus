ig.module(
	'game.entities.questionController'
)
.requires(
	'impact.entity'

)
.defines(function() {
EntityQuestionController = ig.Entity.extend({

	questions: new Array(0),
    questionNum: 0,

    state: 0,

	init: function(x, y, settings) {
		this.parent(x, y, settings);

	},

    update: function() {
        this.parent();
        switch(this.state) {
            /* default state, check if enough questions are loaded */
            case 0:
//                console.log("In state 0");
                if (this.questionNum >= 12) {
                    this.state = 3;
                }
                else if (this.questionNum >= 10) {
                    this.state = 2;
                }
                else if (this.questionNum >= 5) {
                    this.state = 1;
                }
                break;

            case 1:
//                console.log("In state 1");
                /* state = 1, solve 2 questions of q2, q3, q4 to unlock q5 */
                if (this.isSolved(3, 2, 5)) {
                    if (!ig.game.getEntitiesByType(EntityQuestions)[0].isActive) {
                        ig.game.eventController.latestEventID = 4;
                        ig.game.eventID = 4;
                        ig.game.spawnEntity(EntityEventTrigger, ig.game.player.pos.x, ig.game.player.pos.y, {eventID: 5});
                        this.questionNum = 0;
                        this.state = 0;
                    }
                }
                break;
            case 2:
//                console.log("In state 2");
                if (this.isSolved(3, 6, 10)) {
                    if (!ig.game.getEntitiesByType(EntityQuestions)[0].isActive) {
                        ig.game.eventController.latestEventID = 7;
                        ig.game.eventID = 7;
                        ig.game.spawnEntity(EntityEventTrigger, ig.game.player.pos.x, ig.game.player.pos.y, {eventID: 8});
                        this.questionNum = 0;
                        this.state = 0;
                    }
                }
                break;
            case 3:
                if (this.isSolved(2, 11, 13)) {
                    if (!ig.game.getEntitiesByType(EntityQuestions)[0].isActive) {
                        ig.game.spawnEntity(EntityEventTrigger, ig.game.player.pos.x, ig.game.player.pos.y, {eventID: 11});
                        this.questionNum = 0;
                        this.state = 0;
                    }


                }
                break;
            default:
                break;

        }
    },

    add: function(name) {
        var i = parseInt(name[1] * 10) + parseInt(name[2]);
        this.questions[i] = ig.game.getEntityByName(name);
        if (this.questionNum < i) {
            this.questionNum = i;
        }
    },

    isSolved: function(numToSolve, start, end) {
        var count = 0;
        for (var i = start; i <= end; i++) {
            if (this.questions[i].solved) {
                count++;
            }
        }
        return count >= numToSolve;
    },

    isLocked: function(n) {
        return this.questions[n].locked;
    },

    unlock: function(n) {
        this.questions[n].unlock();
    }


});

});
