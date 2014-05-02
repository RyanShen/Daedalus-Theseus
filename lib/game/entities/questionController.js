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

            spawnEvent: false,

            state: 0,

            toaster1: true,
            toaster2: true,
            toaster3: true,

            checked: false,

            init: function(x, y, settings) {
                this.parent(x, y, settings);

            },

            update: function() {
            },

            checkEvent: function() {
                if (this.state === 0) {
                    if (this.questionNum >= 23) {
                        this.state = 4;
                    }
                    else if (this.questionNum >= 18) {
                        this.state = 3;
                    }
                    else if (this.questionNum >= 15) {
                        this.state = 2;
                    }
                    else if (this.questionNum >= 7) {
                        this.state = 1;
                    }
                }
                if (this.state === 1) {
                    if (this.isSolved(3, 2, 7) && ig.game.eventController.latestEventID < 5) {
                        if (!ig.game.getEntitiesByType(EntityQuestions)[0].isActive) {
                            ig.game.eventController.latestEventID = 4;
                            ig.game.eventID = 4;
                            ig.game.spawnEntity(EntityEventTrigger, ig.game.player.pos.x, ig.game.player.pos.y, {eventID: 5});
                            this.questionNum = 0;
                            this.state = 0;
                        }
                    }
                }
                else if (this.state === 2) {
                    if (this.isSolved(4, 8, 15) && ig.game.eventController.latestEventID < 8) {
                        if (!ig.game.getEntitiesByType(EntityQuestions)[0].isActive) {
                            ig.game.eventController.latestEventID = 7;
                            ig.game.eventID = 7;
                            ig.game.spawnEntity(EntityEventTrigger, ig.game.player.pos.x, ig.game.player.pos.y, {eventID: 8});
                            this.questionNum = 0;
                            this.state = 0;
                        }
                    }
                }
                else if (this.state === 3) {
                    if (this.isSolved(2, 16, 18) && ig.game.eventController.latestEventID < 11) {
                        if (!ig.game.getEntitiesByType(EntityQuestions)[0].isActive) {
                            ig.game.spawnEntity(EntityEventTrigger, ig.game.player.pos.x, ig.game.player.pos.y, {eventID: 11});
                            this.questionNum = 0;
                            this.state = 0;
                        }
                    }

                }
                if (ig.game.eventController.latestEventID == 14) {
                    var solveAll = true;
                    for (var i = 1; i <= 93; i++) {
                        if (!ig.game.dataLoader.checkSolve(i)) {
                            solveAll = false;
                            break;
                        }
                    }
                    if (solveAll && !ig.game.getEntitiesByType(EntityQuestions)[0].isActive) {
                        ig.game.spawnEntity(EntityEventTrigger, ig.game.player.pos.x, ig.game.player.pos.y, {eventID: 15});
                        this.questionNum = 0;
                        this.state = 0;
                    }
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
