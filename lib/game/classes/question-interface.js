ig.module( 
    'game.classes.question-interface'
)
.requires(
    'impact.game'
)
.defines(function(){

        QuestionInterface = ig.Class.extend({

            ProblemHide: function(){
                var problemInput = $("#probleminput");
                var problemSubmit = $("#problemsubmit");
                problemInput.hide();
                problemInput.val('');
                problemSubmit.hide();
            },

            ProblemDisplay:function() {
                var problemInput = $("#probleminput");
                var problemSubmit = $("#problemsubmit");
                problemInput.show();
                problemSubmit.show();
            }
        });

});