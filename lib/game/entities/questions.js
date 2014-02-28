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

        //art assets
        font : new ig.Font('media/smallfont.png'),
        animSheetBG: new ig.AnimationSheet('media/UI/QA_BG.jpg',1024,768),
        animSheetLoading: new ig.AnimationSheet('media/UI/QA_loading.jpg',500,500),
        animSheetPassword: new ig.AnimationSheet('media/UI/QA_password.png',800,550),
        animSheetAppearing: new ig.AnimationSheet('media/UI/QA_appearing.png',900,600),
        animSheet: new ig.AnimationSheet('media/questionsDialogTemp.png',1024,768),

        //animations
        animLoadingBG: null,
        animLoading: null,
        animPassword: null,

        animAppearing: null,

        animNormal: null,

        //status
        isActive: false,
        state: 'hidden',    //hidden, activating, loading, password, appearing, normal
        isFirstTime: true,

        passedQsId:null,
        qsAns:null,
        qsHint:null,
        qsDesc:null,
        qsScore:null,
        qsName:null,
        finalSetter:false,



        init: function(x,y,settings){
            this.parent(this.pos.x, this.pos.y, settings);
            /*this.addAnim('idle',1,[0]);
            this.currentAnim  = this.anims.idle;*/

            this.animLoadingBG = new ig.Animation( this.animSheetBG, 1, [0], true );
            this.animLoading = new ig.Animation( this.animSheetLoading, 0.04167, [
                0,1,2,3,4,5,6,7,8,9,10,11,
                12,13,14,15,16,17,18,19,20,21,22,23,
                24,25,26,27,28,29,30,31,32,33,34,35,
                36,37,38,39,40,41,42,43,44,45,46,47,
                48,49,50,51,52,53,54,55,56,57,58,59,
                60,61,62,63,64,65,66,67,68,69,70,71,
                72,73,74,75,76,77,78,79,80,81,82,83,
                84,85,86,87,88,89,90,91,92,93,94,95,
                96,97,98,99,100,101,102,103,104,105,106,107,
                108,109,110,111,112,113,114,115,116,117,118,119,
                120,121,122,123,124,125,126,127,128,129,130,131], true );

            this.animPassword = new ig.Animation( this.animSheetPassword, 0.04167, [
                0,1,2,3,4,5,6,7,8,9,
                10,11,12,13,14,15,16,17,18,19,
                20,21,22,23,24,25,26,27,28,29,
                30,31,32,33,34,35,36,37,38,39,
                40,41,42,43,44,45,46,47,48,49,
                50,51,52,53,54,55,56,57,58,59,
                60,61,62,63,64,65,66,67,68,69,
                70,71,72,73,74,75,76,77,78,79,
                80,81,82,83,84,85,86,87,88,89,
                90,91,92,93,94,95,96,97,98,99], true );

            this.animAppearing = new ig.Animation( this.animSheetAppearing, 0.04167, [
                0,1,2,3,4,5,
                6,7,8,9,10,11,
                12,13,14,15,16,17,
                18,19,20,21,22,23,
                24,25,26,27,28,29,
                30,31,32,33,34,35,
                36,37,38,39,40,41,
                33], true );

            this.animNormal = new ig.Animation( this.animSheetAppearing, 1, [41], true );
            this.ProblemHide();
        },

        update:function(){
           this.parent();

            switch( this.state )
            {
                case 'hidden':
                    break;
                case 'activating':
                    if( this.isFirstTime )
                    {
                        this.state = 'loading';
                        this.animLoading.rewind();
                        this.isFirstTime = false;
                    }
                    else
                    {
                        this.animAppearing.rewind();
                        this.state = 'appearing';
                    }
                    break;
                case 'loading':
                    if( this.animLoading.loopCount >= 1 )
                    {
                        this.animPassword.rewind();
                        this.state = 'password';
                    }
                    break;
                case 'password':
                    console.trace( this.animPassword.loopCount );
                    if( this.animPassword.loopCount >= 1 )
                    {
                        this.animAppearing.rewind();
                        this.state = 'appearing';
                    }
                    break;
                case 'appearing':
                    if( this.animAppearing.loopCount >= 1 )
                    {

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

                        this.state = 'normal';
                    }
                    break;
                case 'normal':
                    break;
                default:
                    break;
            }
        },

        draw:function(){
            this.parent();
            /*if (this.isActive){
                ig.gui.draw();
            }*/

            switch( this.state )
            {
                case 'hidden':
                    break;
                case 'activating':
                    break;
                case 'loading':
                    this.animLoadingBG.draw( 0, 0 );
                    this.animLoading.update();
                    this.animLoading.draw( 270, 61 );
                    break;
                case 'password':
                    this.animLoadingBG.draw( 0, 0 );
                    this.animPassword.update();
                    this.animPassword.draw( 85, 46 );
                    break;
                case 'appearing':
                    this.animLoadingBG.draw( 0, 0 );
                    this.animAppearing.update();
                    this.animAppearing.draw( 64, 45 );
                    break;
                case 'normal':
                    this.animLoadingBG.draw( 0, 0 );
                    this.animNormal.draw( 64, 45 );
                    break;
                default:
                    break;
            }
        },

        //This is the function that gets called when question is to be set based on trigger events
        ProblemDisplay:function(questionID) {
            this.passedQsId = questionID;                                           /* get the question id passed and store it in global variable to be used later */
            this.state = 'activating';
            this.isActive = true;                                                   /* this flag has to be used to toggle question on and off for triggers*/
            this.finalSetter = true;                                                /* this flag is used to retrieve database values only once per ProblemDisplay call */

            ig.game.player.setMovementLock(true);
        },

        //This is the function that gets called when question is to be hidden. Could be after the user presses a certain key or on trigger of some event
        ProblemHide: function(){
            this.pos = {x:-1000, y:-1000};
            this.state = 'hidden';
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
             toastr.success('That is correct!');
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

