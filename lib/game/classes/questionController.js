ig.module(
	'game.classes.questionController'
)
.requires(
	'impact.system'
)
.defines(function(){

    QuestionController = ig.Class.extend({
    	
    	questions: new Array(0),
    	questionNum: 0,
    	state: 0,

    	init: function() {
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

		add: function(name) {
			var i = parseInt(name[1] * 10) + parseInt(name[2]);
			this.questions[i] = ig.game.getEntityByName(name);
			if (this.questionNum < i) {
				this.questionNum = i;
			}
		},

        isLocked: function(n) {
            return this.questions[n].locked;
        },

        unlock: function(n) {
            this.questions[n].unlock();
        }

    });
});