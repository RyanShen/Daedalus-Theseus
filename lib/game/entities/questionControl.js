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
                        if (this.controller.questionNum >= 12) {
                            this.controller.state = 3;
                        }
                        else if (this.controller.questionNum >= 10) {
                            this.controller.state = 2;
                        }
                        else if (this.controller.questionNum >= 5) {
                            this.controller.state = 1;
                        }
                        break;

                    case 1:
//                console.log("In state 1");
                        /* state = 1, solve 2 questions of q2, q3, q4 to unlock q5 */
                        if (this.controller.isLocked(5) && this.controller.isSolved(2, 2, 4)) {
                            this.controller.unlock(5);
                            this.controller.state = 0;
                        }
                        break;
                    case 2:
//                console.log("In state 2");
                        if (this.controller.isLocked(10) && this.controller.isSolved(3, 6, 9)) {
                            this.controller.unlock(10);
                            this.controller.state = 0;
                        }
                        break;
                    case 3:
                        if (this.controller.isLocked(13) && this.controller.isSolved(2, 11, 12)) {
                            console.log("is here");
                            if (!ig.game.getEntitiesByType(EntityQuestions)[0].isActive) {
                                ig.game.spawnEntity(EntityEventTrigger, ig.game.player.pos.x, ig.game.player.pos.y, {eventID: 11});
                                this.controller.questionNum = 0;
                                this.controller.state = 0;
                            }


                        }
                        break;
                    default:
                        break;

                }
            }

        });

    });
