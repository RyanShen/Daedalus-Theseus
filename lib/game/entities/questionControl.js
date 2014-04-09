ig.module(
	'game.entities.questionControl'
)
.requires(
	'impact.entity'

)
.defines(function() {
EntityQuestionControl = ig.Entity.extend({

	controller: null,

	init: function(x, y, settings) {
		this.parent(x, y, settings);
		 this.controller = ig.game.questionController;

	},

	update: function() {
        this.parent();
		switch(this.controller.state) {
			/* default state, check if enough questions are loaded */
			case 0:
//                console.log("In state 0");
                if (this.controller.questionNum >= 10) {
					this.controller.state = 2;
				}
				else if (this.controller.questionNum >= 5) {
					this.controller.state = 1;
				}
				break;
			/* state = 1, solve 2 questions of q2, q3, q4 to unlock q5 */
			case 1:
//                console.log("In state 1");
    			if (this.controller.isLocked(5) && this.controller.isSolved(2, 2, 4)) {
					this.controller.unlock(5);
					this.controller.state = 0;
				}
                break;
			case 2:
//                console.log("In state 2");
                /*
				if (this.controller.isLocked(10) && this.controller.isSolved(2, 7, 9)) {
					this.controller.unlock(10);
					this.controller.state = 0;
				}
				*/
                if (this.controller.isSolved(4, 6, 10)) {
                    ig.game.spawnEntity(EntityEventTrigger, 1184, 550, {size: {x: 128, y: 96}, eventID: 8});
                    ig.game.spawnEntity(EntityEventTrigger, 736, 608, {size: {x: 128, y: 96}, eventID: 9});
                    this.controller.questionNum = 0;
                    this.controller.state = 0;

                }
				break;
			default:
				break;

		}
	}

});

});
