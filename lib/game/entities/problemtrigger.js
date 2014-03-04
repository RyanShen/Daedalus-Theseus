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

	_wmScalable: true,
	_wmDrawBox: true,
    _wmBoxColor: 'rgba(0, 0, 255, 0.7)',

                            
	name: null, // name format: q01, q22, q60
	key: 'false',
	problemID: -1,
	problemType: null,
	problemScore: 0,
	nextEvent: null, 
	nextQuestion: null, // next format: 020304, 223970
	locked: 'true',
	eventID: -1,
	thisdata: null,

  	xOffset: 0,
	yOffset: 0,
	distance: 50,
	orientation: null,
	dispose: false,

	imageID: -1,
	uiAnimSheet: null,
	showScore: false,
	anim: null,
	solved: 'false',
	activated: false,
	eventTriggered: false,
	nextEventTriggered: false,

	qaInterface: null,

	destinationSet: false,
	animated: true,
	nothover: true,
	zIndex: 999,
	_text: '',
	_textLength: 0,
	_sTargetX: 0,
	_eTargetX: 0,
	_start: {x: 0, y: 0},
	_end: {x: 0, y: 0},
	_rel: 5,
	animSpeed: 4,

	size: {x: 60, y: 60},

	timer: new ig.Timer(),

	mouseoverPlayed: false,

	animSheet: new ig.AnimationSheet( 'media/problemIcon.png', 67, 71),
	font: new ig.Font( 'media/smallfont-light.png' ),
	font2: new ig.Font('media/smallfont-dark.png'),
	font3: new ig.Font('media/smallfont-gray.png'),

	init: function(x, y, settings) {
		this.parent(x, y, settings);

	},

	update: function() {
		this.parent();
		if (this.locked) {
			if (ig.game.eventController.latestEventID >= this.eventID) {
				this.unlock();
			}
		}
		else {
			if (this.clickedOn()){
				
				if (!this.activated && this.checkDistance()) {
					this.activated = true;
					this.qaInterface = ig.game.getEntitiesByType(EntityQuestions)[0];
					
				}

				// walk to the question and trigger the question
				else if (!this.activated && !this.checkDistance() && !this.destinationSet) {
					ig.game.player.setDestination(this.pos.x, this.pos.y);
					this.destinationSet = true;
				}

			}

			if (this.destinationSet && !this.activated && this.distanceTo(ig.game.player) < this.distance) {
				this.activated = true;
				this.qaInterface = ig.game.getEntitiesByType(EntityQuestions)[0];
				

			}

			if (this.activated) {
				this.activate();
			}

			// every 30s, send request to get solved info
			if (!this.solved && this.timer.delta() >= 1) {
				this.solved = this.checkSolve();
				this.timer.set(5);
				console.log(this.solved);
			}


			
		}
	},

	activate: function() {

		if (!this.eventTriggered && !this.solved && !this.qaInterface.isActive) {
			this.eventTriggered = true;
			this.solved = this.checkSolve();
			if (!this.solved) {
	     		this.qaInterface.ProblemDisplay(this.problemID);
	     	}
	     }

	     if (!this.eventTriggered && this.solved && !this.qaInterface.isActive) {
	     	this.eventTriggered = true;
	     }

	     if (this.eventTriggered && this.solved && !this.qaInterface.isActive) {
	     	if(this.nextQuestion != null) {
	     		for(var i = 1; i < this.nextQuestion.length; i+=2) {
	     			var nextItem = this.nextQuestion.charAt(i) * 10 + this.nextQuestion.charAt(i+1);
	     			ig.game.getEntityByName("q" + nextItem).unlock();
	     		}
	     	}

	     	if (this.nextEvent != null && !this.nextEventTriggered) {
	     		ig.game.getEntityByName(this.nextEvent).activate();
	     		this.nextEventTriggered = true;
	     	}

	     	if (!this.dispose) {
	     		this.activated = false;
	     		this.eventTriggered = true;
	     		this.destinationSet = false;
	     		if (this.nextEvent != null) {
	     			ig.game.getEntityByName(this.nextEvent).deactivate();
	     		}
	     	}
	     }
	     else if (this.eventTriggered && !this.solved && !this.qaInterface.isActive) {
	     	if (!this.dispose) {
	     		this.activated = false;
	     		this.eventTriggered = false;
	     		this.destinationSet = false;
	     	}
	     }

	     

	    
	},

	draw: function() {
		//this.parent();
		if (!this.locked) {
			if (this.imageID != -1 ) {

				if (!this.solved) {
					this.currentAnim = this.anims.notsolved;
				}
				else {
					if (this.key && !this.eventTriggered) {
						this.currentAnim = this.anims.solvedkey;
					}
					else {
						this.currentAnim = this.anims.solvednotkey;
					}
				}

				if (this.isHover()) {
					if (!this.mouseoverPlayed) {
						ig.game.audioController.play('mouseover');
						this.mouseoverPlayed = true;
					}
					if (this._rel  < this._eTargetX) {
						this._rel += this.animSpeed;
					}
				}
				else {
					if (this._rel > this._sTargetX) {
						this._rel -= this.animSpeed;
					}
					this.mouseoverPlayed = false;
				}

				this._start.x = this.pos.x + this._rel + this.xOffset - ig.game.screen.x;
				this._start.y = this.pos.y + 10 + this.yOffset - ig.game.screen.y;
				if (this.problemType.length < 15) {
					this._end.x = this._start.x + this.problemType.length * 15;
				}
				else {
					this._end.x = this._start.x + this.problemType.length * 13;
				}
				this._end.y = this._start.y;
			}
			this.currentAnim.draw(this.pos.x + this.xOffset - ig.game.screen.x, this.pos.y + this.yOffset - ig.game.screen.y);
			// color for the bar
			var blue1 = "rgba(79, 186, 225, ";
			var blue2 = "rgba(66, 230, 255, ";
			var green1 = "rgba(80, 200, 100, ";
			var green2 = "rgba(136, 200, 136, ";
			var yellow1 = "rgba(220, 224, 128, ";
			var yellow2 = "rgba(238, 206, 106, ";

			var curColor1, curColor2;
			if (this.solved) {
				if (this.key && !this.eventTriggered) {
					curColor1 = yellow1;
					curColor2 = yellow2;
					this._text = "Problem\nSolved";
				}
				else {
					curColor1 = green1;
					curColor2 = green2;
					this._text = "Problem\nSolved";
				}

				this._end.x = this._start.x + "ProblemSol".length * 13;
				this._end.y = this._start.y;
			}
			else {
				curColor1 = blue1;
				curColor2 = blue2;
			}

			var ctx = ig.system.context;

			// shadow for the bar
			var centerX = (this._start.x + this._end.x) / 2;
			var centerY = this._start.y + 43 / 2;
			var gradout = ctx.createRadialGradient(centerX, centerY, 150, centerX, centerY, 200);
			gradout.addColorStop(0, "rgba(41, 56, 79, " + (this._rel-5)/200 + ")");
			gradout.addColorStop(1, "rgba(255, 255, 255," + (this._rel-5)/60 + ")");

			var offset = 2;
			ctx.fillStyle = gradout;
			ctx.beginPath();
			ctx.moveTo(this._start.x - offset, this._start.y - offset);
			ctx.lineTo(this._end.x + offset + 2, this._end.y - offset);
			ctx.lineTo(this._end.x - 20 + offset, this._end.y + 43 + offset);
			ctx.lineTo(this._start.x - offset, this._start.y + 43 + offset);
			ctx.closePath();
			ctx.fill();

			var gradient = ctx.createLinearGradient(this._start.x, this._start.y, this._end.x, this._end.y);
			gradient.addColorStop(0, curColor1 + (this._rel-5) / 70 + ")");
			gradient.addColorStop(1, curColor2 + (this._rel-5) / 70 + ")");

			ctx.fillStyle = gradient; 
			ctx.beginPath();
			ctx.moveTo(this._start.x, this._start.y);
			ctx.lineTo(this._end.x, this._end.y);
			ctx.lineTo(this._end.x - 20, this._end.y + 43);
			ctx.lineTo(this._start.x, this._start.y + 43);
			ctx.closePath();
			ctx.fill();

			ctx.globalAlpha = (this._rel-5) / 60;
			this.font2.draw(this._text, this._start.x + 12, this._start.y + 4);
			this.font3.draw(this._text, this._start.x + 11, this._start.y + 3.5);
			this.font.draw(this._text, this._start.x + 10, this._start.y + 3);
			ctx.globalAlpha = 1;

		}


	},


	isHover: function() {
		if (ig.input.mouse.x + ig.game.screen.x >= this.pos.x + this.xOffset && 
			ig.input.mouse.x + ig.game.screen.x <= this.pos.x + this.xOffset + 60 && 
			ig.input.mouse.y + ig.game.screen.y >= this.pos.y + this.yOffset && 
			ig.input.mouse.y + ig.game.screen.y <= this.pos.y + this.yOffset + 60){
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
		}
		return ig.game.player.orientation.indexOf(dirString) != -1;
	},

	unlock: function() {
		this.locked = false;
		// initialize question
		this.thisdata = this.getProblemData();
		this.problemType = this.thisdata.type;
		this.problemScore = this.thisdata.points;
		this.getImageID();
		this.solved = this.solved != "false";
		this.key = this.key != "false";
		this.solved = this.checkSolve();
		this.addAnim( 'notsolved', 1, [this.imageID] );
		this.addAnim( 'solvedkey', 1, [this.imageID + 14] );
		this.addAnim( 'solvednotkey', 1, [this.imageID + 7]);
		this.timer.set(5);
		this._text = this.problemType + '\nScore: ' + this.problemScore;
		this._sTargetX = 5;
		this._eTargetX = 65;
		this._start.x = this.pos.x + this._rel - ig.game.screen.x;
		this._start.y = this.pos.y + 10 - ig.game.screen.y;
	},

	getProblemData: function() {
		this.problemID = (this.name+"").charAt(1) * 10 + (this.name+"").charAt(2);
		 var requestURL = "http://128.2.238.182:3000/problem?pid=".concat(this.problemID);
		 var thisdata;
         $.ajax({
             type:'GET',
             url: requestURL,
             async: false,
             cache: false,
             dataType: 'json',
             success: function(data) {
             	thisdata = data;
             },
             error: function(xhr, status, error) {
                 answer = "ERROR";
             }
         });
         return thisdata;

	},

	checkSolve: function() {
		var requestURL = "http://128.2.238.182:3000/team?tid="+ig.Game.getEntitiesByType(EntityTeamInfo)[0].teamID;
		var solved = false;
		var problemSolved;
		var thisID = this.problemID;
         $.ajax({
             type:'GET',
             url: requestURL,
             async: false,
             cache: false,
             dataType: 'json',
             success: function(data) {
                 problemSolved = data.problemsolved;
                 for (var i in problemSolved) {
                 	if (problemSolved[i] == thisID){
                 		solved = true;
                 		break;
                 	}
                 }
             },
             error: function(xhr, status, error) {
                 answer = "ERROR";
             }
         });
         return solved;
	},


	getImageID: function() {
		
		if (this.problemType != null) {
			switch (this.problemType) {
				case 'Binary':
					this.imageID = 0;
					break;
				case 'Web Exploitation':
					this.imageID = 1;
					break;
				case 'Script Exploitation':
					this.imageID = 2;
					break;
				case 'Reverse Engineering':
					this.imageID = 3;
					break;
				case 'Trivia/Misc':
					this.imageID = 4;
					break;
				case 'Forensics':
					this.imageID = 5;
					break;
				case 'Cryptology':
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