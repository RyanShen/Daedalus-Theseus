ig.module('game.entities.questions'
	)
  .requires(
            'impact.entity',
            'impact.debug.debug'
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
		
		//media used by text balloon
		font : new ig.Font('media/questionsFont.png'),								
		animSheet: new ig.AnimationSheet('media/questionsDialog.png',640,480),	// the animation
		wrapper : null,
		
		setQuestion : function(name,width){
		    this.wrapper = new WordWrap(name,width);
		},
		
		init: function(x,y,settings){																// always show on top
		this.addAnim('idle',1,[0]);											
		this.currentAnim  = this.anims.idle;								
		this.parent(x,y,settings);
		//var question = 'acdb';
		//this.wrapper = new WordWrap('  asdasdasdasdsadsadsadsadasd sad asd asd ad  adwd asd asd asd asd asd ',75);
		//this.setQuestion('I AM AWESOME? IS IT????!!!');
		},

		update:function(){
			if(ig.input.pressed('kill'))
                           this.kill();
			this.parent();													
		},
		draw:function(){
			this.parent();													
			var x = this.pos.x - ig.game.screen.x + 150;						
        	        var y = this.pos.y - ig.game.screen.y + 150;
			this.font.draw(this.wrapper.wrap(),x, y,ig.Font.ALIGN.LEFT);	
			
		}
		
    });
});