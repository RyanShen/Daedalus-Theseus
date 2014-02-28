ig.module(
	'game.entities.problemtrigger'
)
.requires(
	'impact.entity'

)
.defines(function() {
EntityProblemtrigger = ig.Entity.extend({

	// define the type entity type B
	type: ig.Entity.TYPE.B,

	_wmDrawBox: true,
    _wmBoxColor: 'rgba(0, 0, 255, 0.7)',

	/*
	 * Must have Attributes
	 *
	 * name:      1, 2, 3, computer, fridge, ...     ( -1 is null )   
	 * next:      Next obj name to be triggered, default is -1      ( -1 is null )
	 */                               
	name: -1,
	problemID: 1,
	problemType: null,
	problemScore: 0,
	next: -1,

	/*
	 * Optional Attributes
	 *
	 * distance:   	if -1, passively trigger
	 *			   	if 0, will not check distance
	 *              else, trigger depend on distance                             
	 * orientation: if not null, will only trigger when player has corresponding orientation
	 *			   	if null, will not check orientation                                  
	 * sizeX:      	define the size of trigger, default is 25 * 25                                  
	 * sizeY
	 * dispose:     if true, the trigger can only be triggered once; default is false                                  
	 */   
	distance: 200,
	orientation: null,
	dispose: false,

	imageID: 0,
	uiAnimSheet: null,
	showScore: false,
	anim: null,
	locked: false,
	solved: false,
	activated: false,
	eventTriggered: false,
	animated: true,
	nothover: true,
	xOffset: 0,
	zIndex: 0,
	size: {x: 25, y: 25},

	animSheet: new ig.AnimationSheet( 'media/problemIcon.png', 208, 75),
	font: new ig.Font( 'media/smallFont-light.png' ),

	init: function(x, y, settings) {
		this.parent(x, y, settings);
		this.getProblemInfo();
		this.getImageID();
		var n = this.imageID;
		this.addAnim( 'icon', 1, [n] );
		this.addAnim( 'text', 1, [n+7] );
		this.addAnim( 'out', 0.02, [n, n+1, n+2, n+3, n+4, n+5, n+6, n+7]);
		this.addAnim( 'in', 0.02, [n+7, n+6, n+5, n+4, n+3, n+2, n+1, n]);
	},

	update: function() {
		this.parent();
		if (this.clickedOn()){
			
			if (!this.activated && this.checkDistance() && this.checkOrientation()) {
				this.activated = true;
				console.log("Activated");
			}
		}

		if (this.activated) {
			this.activate();
		}

		if (!this.locked && !this.solved && this.imageID != -1) {


			if (this.animated) {
				this.showQuestionMark();
			}
			if (!this.animated) {
				this.hover();
			}

			if (this.nothover && this.isHover()) {
				this.animated = false;
				this.nothover = false;
				this.currentAnim = this.anims.out.rewind();
			}
			else if (!this.nothover && !this.isHover()) {
				this.animated = false;
				this.nothover = true;
				this.currentAnim = this.anims.in.rewind();
			}
		}

	},

	showQuestionMark: function() {
		if (!this.isHover()) {
			this.currentAnim = this.anims.icon;
		}
		else {
			this.currentAnim = this.anims.text;
			
		}
	},

	draw: function() {
		this.parent();
		if (this.showScore) {
			this.font.draw(this.problemScore, this.pos.x + 110 - ig.game.screen.x, this.pos.y + 35 - ig.game.screen.y);
		}

	},
	hover: function() {
		if (this.currentAnim.frame >= 7) {
			this.animated = true;
			this.showScore = !this.showScore;
		}

	},

	isHover: function() {
		if (ig.input.mouse.x + ig.game.screen.x >= this.pos.x && 
			ig.input.mouse.x + ig.game.screen.x <= this.pos.x + this.size.x * 2 && 
			ig.input.mouse.y + ig.game.screen.y >= this.pos.y && 
			ig.input.mouse.y + ig.game.screen.y <= this.pos.y + this.size.y * 2 ){
			return true;
		}
		return false;
	
	},

	clickedOn: function() {
		if (!ig.input.released('leftclick')) {
			return false;
		}
		return this.isHover();
	},

	checkDistance: function() {
		if (this.distance == -1) {
			return false;
		}
		if (this.distance > 0) {
			return this.distanceTo(ig.game.player) <= this.distance;
		}
		return true;

	},

	/*
	 * check if the player is facing the object, possible facing conditions are:
	 *	object		player
	 *	down		up-right, up, up-left
	 *	up 			down-right, down, down-left
	 *	left 		up-right, right, down-right
	 *	right 		down-left, left, up-left
	 */
	checkOrientation: function() {
		if (this.orientation == null) {
			return true;
		}
		var dirString;
		switch (this.orientation) {
			case 'down':
				dirString = 'up';
				break;
			case 'up':
				dirString = 'down';
				break;
			case 'left':
				dirString = 'right';
				break;
			case 'right':
				dirString = 'left';
				break;
			default:
				return false;
				break;
		}
		//string.indexOf() returns the position of the string in the other string
		//If not found, it will return -1:
		return ig.game.player.orientation.indexOf(dirString) != -1;
	},

	activate: function() {
		var qaInterface = ig.game.getEntitiesByType(EntityQuestions)[0];
		if (!this.eventTriggered && !qaInterface.isActive) {
			this.eventTriggered = true;
	     	qaInterface.ProblemDisplay(this.problemID);
	     }
	     console.log(qaInterface.isActive);
	     if (this.eventTriggered && !qaInterface.isActive) {
	     	if(this.next != -1) {
	     		ig.game.getEntityByName(this.next).activate();
	     	}
	     	if (!this.dispose) {
	     		this.activated = false;
	     		this.eventTriggered = false;
	     	}
	     }


	},

	unlock: function() {
		this.locked = false;
	},

	getProblemInfo: function() {
		 var requestURL = "http://128.2.238.182:3000/problem?pid=".concat(this.problemID);
         var answer;
         $.ajax({
             type:'GET',
             url: requestURL,
             async: false,
             cache: false,
             dataType: 'json',
             success: function(data) {
                 this.problemType = data.type;
                 this.problemScore = data.points;
                 this.solved = false;
             },
             error: function(xhr, status, error) {
                 answer = "ERROR";
             }
         })
	},

	getImageID: function() {
		if (this.problemType != null) {
			switch (this.problemType) {
				case 'binary':
					this.imageID = 0;
					break;
				case 'crypt':
					this.imageID = 8;
					break;
				case 'forensics':
					this.imageID = 16;
					break;
				case 'misc':
					this.imageID = 32;
					break;
				case 'reverse':
					this.imageID = 40;
					break;
				case 'script':
					this.imageID = 48;
					break;
				case 'web':
					this.imageID = 56;
					break;
				case 'default':
					this.imageID = -1;
					break;
			}
		}
	}

});


});