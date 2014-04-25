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
                    if (this.isSolved(3, 2, 7)) {
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
                    if (this.isSolved(4, 8, 15)) {
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
                    if (this.isSolved(2, 16, 18)) {
                        if (!ig.game.getEntitiesByType(EntityQuestions)[0].isActive) {
                            ig.game.spawnEntity(EntityEventTrigger, ig.game.player.pos.x, ig.game.player.pos.y, {eventID: 11});
                            this.questionNum = 0;
                            this.state = 0;
                        }
                    }
                    var bot1 = ig.game.getEntityByName('SecurityBot 17');
                    var bot2 = ig.game.getEntityByName('SecurityBot 11');
                    var bot3 = ig.game.getEntityByName('SecurityBot 88');
                    if (this.toaster1 && this.isSolved(1, 16, 16)) {
                        bot1.die();
                        this.toaster1 = false;
                    }
                    else if (this.toaster2 && this.isSolved(1, 17, 17)) {
                        bot2.die();
                        this.toaster2 = false;
                    }
                    else if (this.toaster3 && this.isSolved(1, 18, 18)) {
                        bot3.die();
                        this.toaster3 = false;
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
