/**
 * Created by Jimit and Ryan on 2/26/14.
 */

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
        zIndex: 2000,

        //debug
        isServerOn: true,
        isAlwaysSuccess: false,

        //art assets
        font : new ig.Font('media/Fonts/question_text.png'),
        animSheetBG: new ig.AnimationSheet('media/UI/QA_BG.jpg',1024,768),
        animSheetLoading: new ig.AnimationSheet('media/UI/QA_loading.jpg',500,500),
        animSheetLoadingShort: new ig.AnimationSheet('media/UI/QA_loading_short.png',850,250),
        animSheetPassword: new ig.AnimationSheet('media/UI/QA_password.png',800,550),
        animSheetAppearing: new ig.AnimationSheet('media/UI/QA_appearing.png',900,600),
//        animSheet: new ig.AnimationSheet('media/questionsDialogTemp.png',1024,768),
        animSheetHint: new ig.AnimationSheet('media/UI/QA_hint.png',467.5,408),
        animSheetSuccess: new ig.AnimationSheet( 'media/UI/QA_success.png', 650, 500 ),
        animSheetLogo: new ig.AnimationSheet( 'media/UI/QA_logo.png', 270, 50 ),

        imgBtnRun: new ig.Image('media/UI/QA_btn_run.png'),
        imgBtnRunHover: new ig.Image('media/UI/QA_btn_run_hover.png'),
        imgBtnPass: new ig.Image('media/UI/QA_btn_pass.png'),
        imgBtnPassHover: new ig.Image('media/UI/QA_btn_pass_hover.png'),
        imgBtnHelp: new ig.Image('media/UI/QA_btn_help.png'),
        imgBtnHelpHover: new ig.Image('media/UI/QA_btn_help_hover.png'),
        imgBtnClose: new ig.Image('media/UI/QA_btn_leave.png'),
        imgBtnCloseHover: new ig.Image('media/UI/QA_btn_leave_hover.png'),
        imgMsgFail: new ig.Image('media/UI/QA_fail.png'),

        //animations
        animLoadingBG: null,
        animLoading: null,
        animLoadingShort: null,
        animPassword: null,
        animAppearing: null,
        animNormal: null,
        animHintAppearing: null,
        animHintDisappearing: null,
        animHintNormal: null,
        animMsgSuccess: null,
        animLogoAppearing: null,
        animLogoNormal: null,
        animLogoCurrent: null,

        //status and timer
        isActive: false,
        state: 'hidden',    //hidden, activating, loading, password, appearing, normal
        isFirstTime: true,
        stateHint: 'hidden', //hidden, appearing, normal, disappearing
        stateMsg: 'none', //none, success, fail, solved_success, solved_fail
        _msgFadeTime: 2,
        _msgTimer: 0,
        _bgTimer: 0,

        _context: null,
        passedQsId:null,
        qsAns:null,
        qsHint:null,
        qsDesc:null,
        qsScore:'0',
        qsName:null,
        finalSetter:false,

        init: function(x,y,settings){
            this.parent(this.pos.x, this.pos.y, settings);
            this._context = ig.system.context;
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
                120,121,122,123,124,125,126,127,128,129,130,131,
                3,2,1,0], true );

            this.animLoadingShort = new ig.Animation( this.animSheetLoadingShort, 0.04167, [
                0,1,2,3,4,5,
                6,7,8,9,10,11,
                12,13,14,15,16,17,
                18,19,20,21,22,23], true );

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
                90,91,92,93,94,95,96,97,98,99,
                0], true );

            this.animAppearing = new ig.Animation( this.animSheetAppearing, 0.04167, [
                0,1,2,3,4,5,
                6,7,8,9,10,11,
                12,13,14,15,16,17,
                18,19,20,21,22,23,
                24,25,26,27,28,29,
                30,31,32,33 ], true );

            this.animNormal = new ig.Animation( this.animSheetAppearing, 1, [33], true );

            this.animHintAppearing = new ig.Animation( this.animSheetHint, 0.04, [
                0,1,2,3,4,5,6,7,
                8,9,10,11,12,13,14,15,
                16,17,18,19,20,21,22,23,
                24,25,26,27,28,29,30,31,
                32,33,34,35,36,37,38,39,
                40,41,42,43,44,45], true );

            this.animHintDisappearing = new ig.Animation( this.animSheetHint, 0.02, [
                45,44,43,42,41,40,
                39,38,37,36,35,34,33,32,
                31,30,29,28,27,26,25,24,
                23,22,21,20,19,18,17,16,
                15,14,13,12,11,10,9,8,
                7,6,5,4,3,2,1,0], true );

            this.animHintNormal = new ig.Animation( this.animSheetHint, 1, [45], true);
            this.animMsgSuccess = new ig.Animation( this.animSheetSuccess, 0.04167, [
                0,1,2,3,4,5,6,7,8,9], true );

            this.animLogoAppearing = new ig.Animation( this.animSheetLogo, 0.25, [
                0,1,2,3,4
                ], true );

            this.animLogoNormal = new ig.Animation( this.animSheetLogo, 0.25, [
                5,6,7,8] );

            ig.gui.element.add({
                name: 'Button_Run',
                group: 'Group_QA',
                size: { x: 214, y: 48 },
                pos: { x: 575, y: 501 },
                state: {
                    normal: { image: this.imgBtnRun },
                    hover: { image: this.imgBtnRunHover }
                },
                click: function() {
                   //run it
                   //trigger the html element 'Submit'
                    ig.game.getEntitiesByType(EntityQuestions)[0].Submit();
                }
            });

            /*ig.gui.element.add({
                name: 'Button_Pass',
                group: 'Group_QA',
                size: { x: 100, y: 42 },
                pos: { x: 576, y: 446 },
                state: {
                    normal: { image: this.imgBtnPass },
                    hover: { image: this.imgBtnPassHover }
                },
                click: function() {
                    //pass
                    ig.game.getEntitiesByType(EntityQuestions)[0].ProblemHide();
                }
            });*/

            ig.gui.element.add({
                name: 'Button_Help',
                group: 'Group_QA',
                size: { x: 101, y: 43 },
                pos: { x: 685, y: 446 },
                state: {
                    normal: { image: this.imgBtnHelp },
                    hover: { image: this.imgBtnHelpHover }
                },
                click: function() {
                    //show hint
                    ig.game.getEntitiesByType(EntityQuestions)[0].HintDisplay();
                    ig.gui.element.action('disableGroup', 'Group_QA');
                    ig.gui.element.action('enable', 'Button_Close');
                }
            });

            ig.gui.element.add({
                name: 'Button_Close',
                group: 'Group_QA',
                size: { x: 36, y: 37 },
                pos: { x: 788, y: 108 },
                state: {
                    normal: { image: this.imgBtnClose },
                    hover: { image: this.imgBtnCloseHover }
                },
                click: function() {
                    ig.game.getEntitiesByType(EntityQuestions)[0].ProblemHide();
                }
            });

            ig.gui.element.add({
                name: 'Button_Hint_Close',
                group: 'Group_QA_Hint',
                size: { x: 36, y: 37 },
                pos: { x: 507, y: 573 },
                state: {
                    normal: { image: this.imgBtnClose },
                    hover: { image: this.imgBtnCloseHover }
                },
                click: function() {
                    ig.game.getEntitiesByType(EntityQuestions)[0].HintHide();
                }
            });

            ig.gui.element.add({
                name: 'MSG_Fail',
                group: 'Group_QA_MSG',
                size: { x: 238, y: 27 },
                pos: { x: 187, y: 565 },
                state: {
                    normal: { image: this.imgMsgFail }
                }
            });

            this.ProblemHide();
        },

        update:function(){
           this.parent();

            switch( this.state )
            {
                case 'hidden':
                    break;
                case 'activating':
                    this.state = 'loading';
                    if( this.isFirstTime )
                        this.animLoading.rewind();
                    else
                        this.animLoadingShort.rewind();
                    break;
                case 'loading':
                    if( this.isFirstTime )
                    {
                        if( this.animLoading.loopCount >= 1 )
                        {
                            this.isFirstTime = false;
                            this.animPassword.rewind();
                            this.state = 'password';
                        }
                    }
                    else
                    {
                        if( this.animLoadingShort.loopCount >= 1 )
                        {
                            this.animAppearing.rewind();
                            this.animLogoCurrent = this.animLogoAppearing;
                            this.animLogoCurrent.rewind();
                            this.state = 'appearing';
                        }
                    }
                    break;
                case 'password':
                    if( this.animPassword.loopCount >= 1 )
                    {
                        this.animAppearing.rewind();
                        this.animLogoCurrent = this.animLogoAppearing;
                        this.animLogoCurrent.rewind();
                        this.state = 'appearing';
                    }
                    break;
                case 'appearing':
                    if( this.animLogoAppearing.loopCount >= 1 )
                    {
                        this.animLogoAppearing.rewind();
                        this.animLogoCurrent = this.animLogoNormal;
                        this.animLogoCurrent.rewind();
                    }
                    if( this.animAppearing.loopCount >= 1 )
                    {
                        this.ProblemDisplayHelper();
                        ig.gui.element.action('showGroup', 'Group_QA');
                        this.state = 'normal';
                    }
                    break;
                case 'normal':
                    this._bgTimer += ig.system.tick;
                    if( this._bgTimer >= 20*Math.PI )
                        this._bgTimer = 0;
                    switch( this.stateHint )
                    {
                        case 'hidden':
                            break;
                        case 'appearing':
                            if( this.animHintAppearing.loopCount >= 1 )
                            {
                                this.HintDisplayHelper();
                                this.stateHint = 'normal';
                            }
                            break;
                        case 'normal':
                            break;
                        case 'disappearing':
                            if( this.animHintDisappearing.loopCount >= 1 )
                            {
                                this.HintHideHelper();
                                this.stateHint = 'hidden';
                            }
                            break;
                        default:
                            break;
                    }

                    switch( this.stateMsg )
                    {
                        case 'none':
                            break;
                        case 'success':
                            if( this.animMsgSuccess.loopCount >= 4 )
                            {
                                this.stateMsg = 'none';
                                this.ProblemHide();
                            }
                            break;
                        case 'fail':
                            this._msgTimer += ig.system.tick;
                            if( this._msgTimer > this._msgFadeTime )
                            {
                                this._msgTimer = 0;
                                this.stateMsg = 'none';
                                ig.gui.element.action('hide', 'MSG_Fail');
                            }
                            else
                            {
                                ig.gui.element.action('getByName', 'MSG_Fail').alpha =
                                    (1 - this._msgTimer/this._msgFadeTime)*8;
                            }
                            break;
                        case 'solved_success':
                            break;
                        case 'solved_fail':
                            break;
                        default:
                            break;
                    }
                    break;
                default:
                    break;
            }
        },

        draw:function(){
            this.parent();

            switch( this.state )
            {
                case 'hidden':
                    break;
                case 'activating':
                    break;
                case 'loading':
                    this.animLoadingBG.draw( 0, 0 );
                    if( this.isFirstTime )
                    {
                        this.animLoading.update();
                        this.animLoading.draw( 270, 61 );
                    }
                    else
                    {
                        this.animLoadingShort.update();
                        this.animLoadingShort.draw( 46, 238 );
                    }
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
                    this.animLogoCurrent.update();
                    this.animLogoCurrent.draw( 150, 100 );
                    break;
                case 'normal':
                    this.animLoadingBG.draw( 0, 0 );
                    this.animNormal.alpha = 0.85 + 0.3*Math.cos( 2*this._bgTimer );
                    this.animNormal.draw( 64, 45 );
                    this.font.draw( this.qsScore, 781, 174 );
                    this.animLogoCurrent.update();
                    this.animLogoCurrent.draw( 150, 100 );
                    //this.font.draw( this.qsName,207,218 );
                    //this.font.draw( this.qsDesc,207,248 );
                    switch( this.stateHint )
                    {
                        case 'hidden':
                            break;
                        case 'appearing':
                            this.animHintAppearing.update();
                            this.animHintAppearing.draw( 284, 279 );
                            break;
                        case 'normal':
                            this.animHintNormal.draw( 284, 279 );
                            this.font.draw( this.qsHint, 336, 413 );
                            break;
                        case 'disappearing':
                            this.animHintDisappearing.update();
                            this.animHintDisappearing.draw( 284, 279 );
                            break;
                        default:
                            break;
                    }

                    switch( this.stateMsg )
                    {
                        case 'none':
                            break;
                        case 'success':
                            this.animMsgSuccess.update();
                            this.animMsgSuccess.draw( 150, 30 );
                            break;
                        case 'fail':
                            break;
                        case 'solved_success':
                            break;
                        case 'solved_fail':
                            break;
                        default:
                            break;
                    }
                    break;
                default:
                    break;
            }
        },

        TextWrap: function( text, width ){
            if( text == null || text == '' || text == undefined )
                return '';

            var words = text.split( ' ' );
            var index = 0;
            var newText = '';
            var lineWidth = 0;

            while( index < words.length )
            {
               lineWidth += this._context.measureText( words[index] + ' ').width;
               if( lineWidth >= width )
               {
                   newText += '\n';
                   newText += words[index];
                   newText += ' ';
                   lineWidth = 0;
               }
               else
               {
                   newText += words[index];
                   newText += ' ';
               }
               index++;
            }

            return newText;

        },

        //This is the function that gets called when question is to be set based on trigger events
        //A series of animations will be displayed before the actual question info show up
        ProblemDisplay:function(questionID) {
            this.passedQsId = questionID;                                           /* get the question id passed and store it in global variable to be used later */
            this.state = 'activating';
            this.isActive = true;                                                   /* this flag has to be used to toggle question on and off for triggers*/
            this.finalSetter = true;                                                /* this flag is used to retrieve database values only once per ProblemDisplay call */
            ig.game.inGameGUIController.toggleObjectiveBox(false);
            ig.game.player.setMovementLock(true);
        },

        //This is the internal function for actual question info display
        ProblemDisplayHelper: function()
        {
            if( this.isServerOn )
                this.getQsData();                                                       /* get all the question related data from the ajax call to database server */
            else
            {
                this.qsName = 'Debug:Problem Title';
                this.qsDesc = 'Debug:Problem Description';
                this.qsHint = 'Debug:Problem Hint';
                this.qsScore = 0;
            }

            this.qsHint = this.TextWrap( this.qsHint, 120 );
            this.qsDesc = this.TextWrap( this.qsDesc, 200 );
            this.setQuestion(this.qsName , this.qsDesc, this.qsHint, this.qsScore );              /* set the question name, description and hints to be displayed on GUI */                                                                                                /* check the on submit click function when user enters an answer */
            var form = $("#problemform");                                                        /* fetches the css elements to be displayed on the gui */
            var inputBox = $("#probleminput");
            form.show();
            inputBox.show();
        },

        //This is the function that gets called when question is to be hidden. Could be after the user presses a certain key or on trigger of some event
        ProblemHide: function(){

            this.HintHideForceTo();
            this.showMSG('none');
            this.state = 'hidden';

            this.pos = {x:-1000, y:-1000};
            this.isActive = false;
            ig.game.player.setMovementLock(false);
            var form = $("#problemform");
            var inputBox = $("#probleminput");
            var submitButton = $("#problemsubmit");
            var hintButton = $("#hintsubmit");
            form.hide();
            inputBox.hide();
            inputBox.val('');
            submitButton.hide();
            hintButton.hide();
            this.hideQuestionData();

            ig.gui.element.action('hideGroup', 'Group_QA');
            ig.game.inGameGUIController.toggleObjectiveBox(true);
        },

        //This is the function that gets called when 'help' button is clicked
        //A series of animations will be displayed before the actual hint text show up
        //Other QA ui elements will be disabled immediately (except close button)
        HintDisplay: function(){
            this.animHintAppearing.rewind();
            this.stateHint = 'appearing';
            ig.gui.element.action('hideGroup', 'Group_QA');
            ig.gui.element.action('show', 'Button_Close');
        },

        //This is the internal function for actual hint text display
        HintDisplayHelper: function(){
            //show hint text
            ig.gui.element.action('showGroup', 'Group_QA_Hint');
        },


        //This is the function that gets called when 'close hint' button is clicked
        //the hint text will be hide immediately as well as the ui
        //A series of animations will be displayed before the whole hint interface disappeared
        //and then the QA ui elements will be enable again
        HintHide: function(){
            //hide hint text
            ig.gui.element.action('hideGroup', 'Group_QA_Hint');
            this.animHintDisappearing.rewind();
            this.stateHint = 'disappearing';
        },

        HintHideHelper: function(){
            ig.gui.element.action('showGroup', 'Group_QA');
            ig.gui.element.action('enableGroup', 'Group_QA');
        },

        //hide hint without disappearing animation
        HintHideForceTo: function(){
            //hide hint text
            ig.gui.element.action('hideGroup', 'Group_QA_Hint');
            ig.gui.element.action('enableGroup', 'Group_QA');
            this.stateHint = 'hidden';
        },

        //get all the qs related data from ajax calls to database
        getQsData:function(){
           if(this.finalSetter){
               this.finalSetter = false;

               //use this for testing the questions with key press in the main

               /*
               this.qsAns = this.getQuestionInfo().ans;
               this.qsHint = this.getQuestionInfo().hint;
               this.qsDesc = this.getQuestionInfo().desc;
               this.qsName = this.getQuestionInfo().name;
               this.qsScore = this.getQuestionInfo().points;*/
               //use this block of code for actual game
                var qsData = ig.game.getEntityByName('q'+this.passedQsId).data;
                this.qsAns   =  qsData.ans;
                this.qsHint  =  qsData.hint;
                this.qsDesc  =  qsData.desc;
                this.qsName  =  qsData.name;
                this.qsScore =  qsData.points;
           }
        },

        //after fetching question data, store it in different div tags and display them on GUI
        setQuestion : function(titleString, bodyString, hintString, scoreString){
            var prob_title =  $("#disp_prob_title");
            var prob_desc =  $("#disp_desc");
            prob_title.append(titleString);
            prob_desc.append(bodyString);
            prob_title.show();
            prob_desc.show();
        },

        //This is called inside the ProblemHide to clear the appended tags and hide all question data
        hideQuestionData : function(){
            var prob_title =  $("#disp_prob_title");
            var prob_desc =  $("#disp_desc");
            var prob_score = $("#disp_score");
            prob_title.empty();
            prob_desc.empty();
            prob_score.empty();
            prob_title.hide();
            prob_desc.hide();
            prob_score.hide();
        },

        //When user clicks on submit fetch whatever data is entered in the input box and call the check answer function
        Submit: function(){

            if( this.isServerOn )
            {
                $('#prob_submit_mssg').text( $("#probleminput").val() );
                this.checkAnswer();
            }
            else
            {
                if( this.isAlwaysSuccess )
                    this.showMSG( 'success' );
                else
                    this.showMSG( 'fail' );
            }

        },

        //this function is yet to be expanded. For now just compare the user enetered answer with the answer in the database
        checkAnswer:function(){
            //if the answer matches the answer in database then update the backend team database
            if($('#prob_submit_mssg').text().toLowerCase() == this.qsAns.toLowerCase()){
                this.setSuccessNotification();   // this is where you update the backend team database
                ig.game.getEntityByName('q' + this.passedQsId).solved = true;
                $("#probleminput").val('');
            }
            //if incorrect answer and first attempts
            else if( !ig.game.dataLoader.checkSolve(this.passedQsId) && $("#probleminput").val().length >= 1 && $('#prob_submit_mssg').text() != this.qsAns ){
                this.setFailureNotification();
                $("#probleminput").val('');
            }
        },


        //IMPORTANT BLOCK OF CODE
        //This block updates the backend database when a team answered correctly. It updates the team database
        //and the problem solved array based on the problem they answered correctly

        setSuccessNotification:function(){
            var outcome = ig.game.dataLoader.updateProblemData(this.passedQsId);
            // problem is correct message
            if(outcome.success == 1){
                this.showMSG( 'success' );
                // problem already solved message
            }else if(outcome.success == 0){
                this.showMSG( 'success' );
            }
        },

        //Sets failure notification when they enter wrong answer on first attempts
        setFailureNotification:function(){
            this.showMSG( 'fail' );
        },

        showMSG: function( type ){
            ig.gui.element.action('hideGroup', 'Group_QA_MSG');
            this.stateMsg = type;
            switch( type )
            {
                case 'none':
                    break;
                case 'success':
                    this.animMsgSuccess.rewind();
                    this.stateMsg = 'success';
                    ig.gui.element.action('disableGroup', 'Group_QA');
                    $("#disp_prob_title").hide();
                    $("#disp_desc").hide();
                    $("#disp_score").hide();
                    break;
                case 'fail':
                    ig.gui.element.action('show', 'MSG_Fail');
                    ig.gui.element.action('getByName', 'MSG_Fail').alpha = 1;
                    this._msgTimer = 0;
                    break;
                case 'solved_success':
                    break;
                case 'solved_fail':
                    break;
                default:
                    break;
            }
        }

        /*
         * The below are all the ajax calls to backend database
         * We fetch team information for problems they solved.
         * We also update the backend database when a problem is solved for the registered team based on team id

          getQuestionInfo:function(){
            var requestURL = "http://128.2.239.135:3000/problem?pid=".concat(this.passedQsId);
            var qsInfo;
            $.ajax({
                type:'GET',
                url: requestURL,
                async: false,
                cache: false,
                dataType: 'json',
                success: function(data) {
                    qsInfo = data;
                },
                error: function(xhr, status, error) {
                    answer = "ERROR";
                }
            })
            return qsInfo;
          },
          getTeamProbSolved:function(){
            var requestURL = "http://128.2.239.135:3000/team?tid="+ig.game.teamID;
            var teamProbSolved;
            $.ajax({
                type:'GET',
                url: requestURL,
                async: false,
                cache: false,
                dataType: 'json',
                success: function(data) {
                    teamProbSolved = data.problemsolved;
                },
                error: function(xhr, status, error) {
                }
            })
            return teamProbSolved;
         },
         updateProblem:function(){
            var requestURL = "http://128.2.239.135:3000/problemsolved?pid=".concat(this.passedQsId) + "&tid="+ig.game.teamID;
            var successMessage;
            $.ajax({
                type:'GET',
                url: requestURL,
                async: false,
                cache: false,
                dataType: 'json',
                success: function(data) {
                    successMessage = data;
                },
                error: function(xhr, status, error) {
                }
            })
            return successMessage;
         }
         * */
    });
});

