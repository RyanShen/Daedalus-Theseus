ig.module(
    'game.entities.questions'
)
.requires(
    'impact.entity',
    'impact.system'
)
.defines( function(){

     EntityQuestions = ig.Entity.extend({
        pos:{x:0,y:0},
        size:{x:50,y:50},
        lifeTime:200,
        font : new ig.Font('media/smallfont.png'),
        animSheet: new ig.AnimationSheet('media/questionsDialogTemp.png',1024,768),
        isActive: false,
	    passedQsId:null,
        qsAns:null,
        qsHint:null,
        qsDesc:null,
        qsScore:null,
        qsName:null,
        finalSetter:false,

        init: function(x,y,settings){
            this.parent(this.pos.x, this.pos.y, settings);
            this.addAnim('idle',1,[0]);
            this.currentAnim  = this.anims.idle;
            ig.gui.element.add({
                name:'background',
                group:'questionInterface',
                size: {x:1024, y:768},
                pos: {x:0, y:0},
                state:{
                    normal:{
                        image: new ig.Image('media/questionsDialogTemp.png')
                    }
                }
           })
           this.ProblemHide();
        },

        update:function(){
           this.parent();
        },

        draw:function(){
            this.parent();
            if (this.isActive){
                ig.gui.draw();
            }
        },

        //This is the function that gets called when question is to be set based on trigger events
	    ProblemDisplay:function(questionID) {
            this.passedQsId = questionID;                                           /* get the question id passed and store it in global variable to be used later */
            this.isActive = true;                                                   /* this flag has to be used to toggle question on and off for triggers*/
            this.finalSetter = true;                                                /* this flag is used to retrieve database values only once per ProblemDisplay call */
            this.getQsData();                                                       /* get all the question related data from the ajax call to database server */
            this.setQuestion(this.qsName , this.qsDesc, this.qsHint, this.qsScore );              /* set the question name, description and hints to be displayed on GUI */
            this.OnSubmit();                                                        /* check the on submit click function when user enters an answer */
            this.checkAnswer();                                                     /* once the user enters an answer, verify it with the answer in the database */
            var form = $("#problemform");                                           /* fetches the css elements to be displayed on the gui */
            var inputBox = $("#probleminput");
            var submitButton = $("#problemsubmit");
            form.show();
            inputBox.show();
            submitButton.show();
            ig.game.player.setMovementLock(true);
        },

        //This is the function that gets called when question is to be hidden. Could be after the user presses a certain key or on trigger of some event
        ProblemHide: function(){
            this.pos = {x:-1000, y:-1000};
            this.isActive = false;
            var form = $("#problemform");
            var inputBox = $("#probleminput");
            var submitButton = $("#problemsubmit");
            form.hide();
            inputBox.hide();
            inputBox.val('');
            submitButton.hide();
            this.hideQuestionData();
            ig.game.player.setMovementLock(false);
        },

        //get all the qs related data from ajax calls to database
        getQsData:function(){
           if(this.finalSetter){
                this.finalSetter = false;
                this.qsAns   =  this.getAnswer();
                this.qsHint  =  this.getHint();
                this.qsDesc  =  this.getDesc();
                this.qsName  =  this.getName();
                this.qsScore =  this.getScore();
           }
        },

        //after fetching question data, store it in different div tags and display them on GUI
        setQuestion : function(titleString, bodyString, hintString, scoreString){
            var prob_title =  $("#disp_prob_title");
            var prob_desc =  $("#disp_desc");
          //  var prob_hints =  $("#disp_hints");
            var prob_score = $("#disp_score");
            prob_title.append(titleString);
            prob_desc.append(bodyString);
          //  prob_hints.append(hintString);
            prob_score.append("SCORE " +scoreString);
            prob_title.show();
            prob_desc.show();
          //  prob_hints.show();
            prob_score.show();
        },

        //This is called inside the ProblemHide to clear the appended tags and hide all question data
        hideQuestionData : function(){
            var prob_title =  $("#disp_prob_title");
            var prob_desc =  $("#disp_desc");
         // var prob_hints =  $("#disp_hints");
            var prob_score = $("#disp_score");
            prob_title.empty();
            prob_desc.empty();
         // prob_hints.empty();
            prob_score.empty();
            prob_title.hide();
            prob_desc.hide();
          //prob_hints.hide();
            prob_score.hide();
        },

        //When user clicks on submit fetch whatever data is entered in the input box and call the check answer function
	    OnSubmit: function(){
            self = this;
	        $("#problemsubmit").click(function(){
                var value = $("#probleminput").val();
                $('#prob_submit_mssg').text(value);
              //  $("#probleminput").val('');
                self.checkAnswer();
            });
	    },

        //this function is yet to be expanded. For now just compare the user enetered answer with the answer in the database
        checkAnswer:function(){
            if($('#prob_submit_mssg').text() == this.qsAns){
                this.setSuccessNotification();
                $("#probleminput").val('');
            }else if($("#probleminput").val().length >= 1 && $('#prob_submit_mssg').text() != this.qsAns){
                this.setFailureNotification();
                $("#probleminput").val('');
            }
        },
         setSuccessNotification:function(){
             this.setToastrOptions();
             toastr.options.showMethod = 'slideDown';
             toastr.success('That is correct HACKSTER!');
         },
         setFailureNotification:function(){
             this.setToastrOptions();
             toastr.options.showMethod = 'slideDown';
             toastr.error('Wrong. Try again!');
         },
         setToastrOptions:function(){
             toastr.options = {
                 "closeButton": false,
                 "debug": false,
                 "positionClass": "toast-bottom-left",
                 "onclick": null,
                 "showDuration": "100",
                 "hideDuration": "500",
                 "timeOut": "2000",
                 "extendedTimeOut": "1000",
                 "showEasing": "swing",
                 "hideEasing": "linear",
                 "showMethod": "fadeIn",
                 "hideMethod": "fadeOut"
             }
         },
        /*
        * The below are all the ajax calls to database
        * We fetch the question description, the question title, question hint, question answer and question score.
        * We fetch the question based on the passedQsId previously stored in ProblemDisplay function
        * */
        getAnswer:function(){
             var requestURL = "http://128.2.238.182:3000/problem?pid=".concat(this.passedQsId);
             var answer;
             $.ajax({
                 type:'GET',
                 url: requestURL,
                 async: false,
                 cache: false,
                 dataType: 'json',
                 success: function(data) {
                     answer = data.ans;
                 },
                 error: function(xhr, status, error) {
                     answer = "ERROR";
                 }
             })
             return answer;
        },

        getHint:function(){
            var hint;
            var requestURL = "http://128.2.238.182:3000/problem?pid=".concat(this.passedQsId);
            $.ajax({
                type:'GET',
                url: requestURL,
                async: false,
                cache: false,
                dataType: 'json',
                success: function(data)
                {
                    hint = data.hint;
                },
                error: function(data)
                {
                    hint = "";
                }
            })
            return hint;
        },

        getDesc:function(){
             var requestURL = "http://128.2.238.182:3000/problem?pid=".concat(this.passedQsId);
             var desc;
             $.ajax({
                 type:'GET',
                 url: requestURL,
                 async: false,
                 cache: false,
                 dataType: 'json',
                 success: function(data) {
                     desc = data.desc;
                 },
                 error: function(xhr, status, error) {
                     desc = "ERROR";
                 }
             })
             return desc;
        },

        getScore:function(){
             var requestURL = "http://128.2.238.182:3000/problem?pid=".concat(this.passedQsId);
             var score;
             $.ajax({
                 type:'GET',
                 url: requestURL,
                 async: false,
                 cache: false,
                 dataType: 'json',
                 success: function(data) {
                     score = data.score;
                 },
                 error: function(xhr, status, error) {
                     score = "ERROR";
                 }
             })
             return score;
        },

        getName:function(){
             var requestURL = "http://128.2.238.182:3000/problem?pid=".concat(this.passedQsId);
             var name;
             $.ajax({
                 type:'GET',
                 url: requestURL,
                 async: false,
                 cache: false,
                 dataType: 'json',
                 success: function(data) {
                     name = data.name;
                 },
                 error: function(xhr, status, error) {
                     name = "ERROR";
                 }
             })
             return name;
        }
    });
});

