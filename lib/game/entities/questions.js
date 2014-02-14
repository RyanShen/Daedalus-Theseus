ig.module(
    'game.entities.questions'
)
.requires(
    'impact.entity',
    'impact.system'
)
.defines( function(){

     WordWrap = ig.Class.extend({
        text:"",
        maxWidth:10,
        cut: false,

        init:function (text, maxWidth, cut) {
            this.text = text;
            this.maxWidth = maxWidth;
            this.cut = cut;
        },
        wrap:function(){
            var regex = '.{1,' +this.maxWidth+ '}(\\s|$)' + (this.cut ? '|.{' +this.maxWidth+ '}|.+$' : '|\\S+?(\\s|$)');
            return this.text.match( RegExp(regex, 'g') ).join( '\n' );
        }
     }),

    EntityQuestions = ig.Entity.extend({
        pos:{x:0,y:0},
        size:{x:50,y:50},
        lifeTime:200,

        font : new ig.Font('media/questionsFont.png'),
        animSheet: new ig.AnimationSheet('media/questionsDialogTemp.png',1024,768),

        showtext: false,
        titleWrapper : null,
        bodyWrapper : null,
        hintWrapper : null,

        init: function(x,y,settings){
            this.parent(this.pos.x, this.pos.y, settings);
            this.addAnim('idle',1,[0]);
            this.currentAnim  = this.anims.idle;

            this.ProblemHide();
        },

        update:function(){
            if(ig.input.pressed('generate')){
                this.ProblemDisplay();
            }
            else if(ig.input.pressed('kill')){
                this.ProblemHide();
            }
            this.parent();
        },

        draw:function(){
            this.parent();

            if (this.showtext){
                this.font.draw(this.titleWrapper.wrap(),235, 210,ig.Font.ALIGN.LEFT);
                this.font.draw(this.bodyWrapper.wrap(),235, 245,ig.Font.ALIGN.LEFT);
                this.font.draw(this.hintWrapper.wrap(),235, 400,ig.Font.ALIGN.LEFT);
            }
        },

        setQuestion : function(titleString, bodyString, hintString){
            this.titleWrapper = new WordWrap(titleString,35);
            this.bodyWrapper = new WordWrap(bodyString,35);
            this.hintWrapper = new WordWrap(hintString,35);
        },

        ProblemDisplay:function() {
            this.pos = ig.game.camera.pos;

            this.setQuestion('This is a title','this is where the body will go and it will be super long and impossible to read or understand.', 'This is a hint');
            this.showtext = true;

            var form = $("#problemform");
            var inputBox = $("#probleminput");
            var submitButton = $("#problemsubmit");

            form.show();
            inputBox.show();
            submitButton.show();
        },

        ProblemHide: function(){
            this.pos = {x:-1000, y:-1000};
            this.showtext = false;

            var form = $("#problemform");
            var inputBox = $("#probleminput");
            var submitButton = $("#problemsubmit");

            form.hide();
            inputBox.hide();
            inputBox.val('');
            submitButton.hide();
        }
		
    });
});