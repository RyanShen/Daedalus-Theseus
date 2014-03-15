ig.module(
	'game.entities.clickable'
)
.requires(
	'impact.entity'

)
.defines(function() {
EntityClickable = ig.Entity.extend({

	// define the type entity type B
	type: ig.Entity.TYPE.B,

	_wmScalable: true,
	_wmDrawBox: true,
    _wmBoxColor: 'rgba(255, 0, 0, 0.7)',

	/*
	/* Must have Attributes
	/*
	/* name:      1, 2, 3, computer, fridge, ...     ( -1 is null )
	/* eventType: Dialog, CutScene, Problem, ...    
	/* eventID:   Events are assigned with an ID   
	/* next:      Next obj name to be triggered, default is -1      ( -1 is null )
	*/                               
	name: 0,
	eventType: null,
	eventID: -1,
	nextEvent: -1,
	nextQuestion: null,
	passive: false,

	/*
	/* Optional Attributes
	/*
	/* distance:   	
	/*			   	if 0, will not check distance
	/*              else, trigger depend on distance                             
	/* orientation: if not null, will only trigger when player has corresponding orientation
	/*			   	if null, will not check orientation                                  
	/* dispose:     if true, the trigger can only be triggered once; default is false                                  
	*/   
	distance: 0,
	orientation: null,
	dispose: false,

	life: 10000,

	auto: false,

	activated: false,
	eventTriggered: false,
	size: {x: 25, y: 25},

	init: function(x, y, settings) {
		this.parent(x, y, settings);
		this.auto = this.auto == 'true';

	},

	update: function() {
			this.parent();

			if (ig.game.eventController.latestEventID < this.life) {
				
				if (!this.passive && !this.auto) {
					if (this.clickedOn()){
						
						if (!this.activated && this.checkDistance() && this.checkOrientation()) {
							this.activated = true;
						}
					}

					if (this.activated) {
						this.activate();
					}
				}

				if (!this.passive && this.auto) {
					if (!this.eventTriggered && !this.activated && this.checkDistance() && this.checkOrientation()) {
						this.activated = true;
					}
					else if (!this.checkDistance()) {
						this.deactivate();
					}

					if (this.activated) {
						this.activate();
					}
				}
			}

		//console.log("activated: " + this.activated + "  clicked: " + this.clickedOn());


	},

	isHover: function() {
		if (ig.input.mouse.x + ig.game.screen.x >= this.pos.x && 
			ig.input.mouse.x + ig.game.screen.x <= this.pos.x + this.size.x*2 && 
			ig.input.mouse.y + ig.game.screen.y >= this.pos.y && 
			ig.input.mouse.y + ig.game.screen.y <= this.pos.y + this.size.y*2 ){

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
		if (this.distance > 0) {
			return this.distanceTo(ig.game.player) <= this.distance;
		}
		return true;
	},

	/*
	/* check if the player is facing the object, possible facing conditions are:
	/*	object		player
	/*	down		up-right, up, up-left
	/*	up 			down-right, down, down-left
	/*	left 		up-right, right, down-right
	/*	right 		down-left, left, up-left
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
		switch (this.eventType) {
			case 'Dialog':
				if (!this.eventTriggered) {
					ig.game.dialogController.loadDialog(this.eventID);
					this.eventTriggered = true;
				}
				// trigger another event after the dialog is over			
				if (this.eventTriggered) {
					if (this.nextEvent != -1) {
						ig.game.getEntityByName(this.nextEvent).activate();
					}
					if (this.nextQuestion != null) {
						for(var i = 1; i < this.nextQuestion.length; i+=2) {
	     					var nextItem = this.nextQuestion.charAt(i) * 10 + this.nextQuestion.charAt(i+1);
	     					ig.game.getEntityByName("q" + nextItem).unlock();
	     				}
					}

					if (!this.dispose && !this.passive && !this.auto) {
						this.activated = false;
						this.eventTriggered = false;

					}
				}				
				break;

			case 'CutScene':
				if (!this.eventTriggered) {
					ig.game.eventController.startEvent(this);
					this.eventTriggered = true;				
					console.log("cut scene time!");
				}
				// event chain, no need to check subsequent event
				break;

			default:
				console.log("nothing happens!");
				break;
		}


	},

	deactivate: function() {
		if (!this.dispose) {
			this.activated = false;
			this.eventTriggered = false;
		}

	}

});


});