ig.module(
	'game.classes.questionController'
)
.requires(
	'impact.system'
)
.defines(function(){

    QuestionController = ig.Class.extend({
    	
    	questions: null,
    	questionNum: 0,
    	state: 0,

    	init: function() {
    		this.questions = new Array();
    	},

    	isSolved: function(numToSolve, start, end) {
    		var count = 0;
    		for (var i = start; i <= end; i++) {
    			if (this.questions[i].solved) {
    				count++;
    			}
    		}
    		if (count >= numToSolve) {
    			return true;
    		}
    		return false;
    	},

		add: function(name) {
			var i = name[1] * 10 + name[2];
			this.questions[i] = ig.game.getEntityByName(name);
			if (this.questionNum < i) {
				this.questionNum = i;
			}
			console.log(i + "       " + this.questionNum);

		},

        isLocked: function(n) {
            console.log(this.questions[1]);
            return this.questions[n].locked;
        },

        unlock: function(n) {
            this.questions[n].unlock();
        }

    });
});

