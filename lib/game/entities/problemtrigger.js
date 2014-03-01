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

                            
	name: -1,
	problemID: 1,
	problemType: 'Reverse Engineering',
	problemScore: 0,
	next: -1,

  
	distance: 200,
	orientation: null,
	dispose: false,

	imageID: 1,
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
	_text: '',
	_textLength: 0,
	_sTargetX: 0,
	_eTargetX: 0,
	_start: {x: 0, y: 0},
	_end: {x: 0, y: 0},
	_rel: 5,
	animSpeed: 4,

	animSheet: new ig.AnimationSheet( 'media/problemIcon.png', 67, 71),
	font: new ig.Font( 'media/smallFont-light.png' ),

	init: function(x, y, settings) {
		this.parent(x, y, settings);
		this.getProblemInfo();
		this.getImageID();
		this.addAnim( 'icon', 1, [this.imageID] );
		this._text = this.problemType + '\nScore: ' + this.problemScore;
		this._sTargetX = 5;
		this._eTargetX = 65; // length of text
		this._start.x = this.pos.x + this._rel - ig.game.screen.x;
		this._start.y = this.pos.y + 10 - ig.game.screen.y;
		this._end.x = this._start.x + this.problemType.length * 13.5;
		this._end.y = this._start.y;

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

			this.currentAnim = this.anims.icon;

			if (this.isHover()) {
				if (this._rel  < this._eTargetX) {
					this._rel += this.animSpeed;
				}
			}
			else {
				if (this._rel > this._sTargetX) {
					this._rel -= this.animSpeed;
				}
			}

			this._start.x = this.pos.x + this._rel - ig.game.screen.x;
			this._start.y = this.pos.y + 10 - ig.game.screen.y;
			this._end.x = this._start.x + this.problemType.length * 13.5;
			this._end.y = this._start.y;
		}

	},

	draw: function() {
		this.parent();

		var ctx = ig.system.context;
		var gradient = ctx.createLinearGradient(this._start.x, this._start.y, this._end.x, this._end.y);
		gradient.addColorStop(0, "rgba(73, 184, 225, " + (this._rel-5) / 60 + ")");
		gradient.addColorStop(1, "rgba(60, 226, 247, " + (this._rel-5) / 60 + ")");

		ctx.fillStyle = gradient; 
		ctx.beginPath();
		ctx.moveTo(this._start.x, this._start.y);
		ctx.lineTo(this._end.x, this._end.y);
		ctx.lineTo(this._end.x - 20, this._end.y + 45);
		ctx.lineTo(this._start.x, this._start.y + 45);
		ctx.closePath();

		ctx.fill();
		ctx.globalAlpha = (this._rel-5) / 60;
		this.font.draw(this._text, this._start.x + 10, this._start.y + 3);
		ctx.globalAlpha = 1;

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
					this.imageID = 1;
					break;
				case 'forensics':
					this.imageID = 2;
					break;
				case 'misc':
					this.imageID = 3;
					break;
				case 'reverse':
					this.imageID = 4;
					break;
				case 'script':
					this.imageID = 5;
					break;
				case 'web':
					this.imageID = 6;
					break;
				case 'default':
					this.imageID = -1;
					break;
			}
		}
	}

});


});