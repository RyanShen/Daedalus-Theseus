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

            status: 0,
            eventStatus: 0,

            before: null,
            beforeType: null,

            after: null,
            afterType: null,

            name: null, // name format: q01, q22, q60
            key: 0,
            problemID: -1,
            problemType: null,
            problemScore: 0,
            nextEvent: null,
            nextQuestion: null, // next format: 020304, 223970
            locked: true,
            eventID: -1,
            data: null,

            xOffset: 0,
            yOffset: 0,
            distance: 50,
            orientation: null,
            dispose: false,

            imageID: -1,
            uiAnimSheet: null,
            showScore: false,
            anim: null,
            solved: false,
            activated: false,
            eventTriggered: false,
            nextEventTriggered: false,

            qaInterface: null,

            destinationSet: false,
            animated: true,
            nothover: true,
            zIndex: 2900,
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

            added: false,

            problemTriggerLock: false,

            animSheet: new ig.AnimationSheet( 'media/UI/QA_problemIcon.png', 67, 71),
            font: new ig.Font( 'media/Fonts/problemtrigger_light.png' ),
            font2: new ig.Font('media/Fonts/problemtrigger_dark.png'),
            font3: new ig.Font('media/Fonts/problemtrigger_gray.png'),

            init: function(x, y, settings) {
                this.parent(x, y, settings);
            },

            update: function() {
                this.parent();
                if (!this.problemTriggerLock) {
                    if (!this.added) {
                        ig.game.getEntitiesByType(EntityQuestionController)[0].add(this.name);
                        this.added = true;
                    }
                    if (this.locked) {
                        if (ig.game.eventController.latestEventID >= this.eventID && ig.game.eventController.ends) {
                            this.unlock();
                        }
                    }

                    if (!this.locked && !this.key && this.solved && this.nextQuestion && !this.eventTriggered) {
                        this.unlockNextQuestions();
                        this.eventTriggered = true;
                    }
                    else {
                        switch (this.status) {
                            case 0:
                                if (this.clickedOn() && !this.locked) {
                                    this.eventTriggered = false;
                                    if (!this.checkDistance()) {
                                        ig.game.player.setDestination(this.pos.x, this.pos.y);
                                        this.destinationSet = true;
                                    }
                                    else {
                                        this.status = 1;
                                    }
                                }
                                if (this.destinationSet && this.checkDistance()) {
                                    this.destinationSet = false;
                                    this.status = 1;
                                }
                                break;
                            case 1:
                                switch (this.eventStatus) {
                                    case 0:
                                        if ((!this.solved || this.key) && this.before && !this.eventTriggered) {

                                            this.eventTriggered = true;
                                            if (this.beforeType == 'Dialog') {
                                                ig.game.toggleProblemInteraction(this, false);
                                                ig.game.toggleUIPlayerInteraction(false);
                                                ig.game.dialogController.loadDialog(this.before);
                                            }
                                            else if (this.beforeType == 'CutScene') {
                                                ig.game.eventController.startEvent({eventID: this.before});
                                            }
                                        }

                                        else if (this.eventTriggered) {
                                            if (this.beforeType == 'Dialog' && ig.game.dialogController.ends()) {
                                                ig.game.toggleProblemInteraction(this, true);
                                                ig.game.toggleUIPlayerInteraction(true);
                                                if (!this.solved) {
                                                    this.eventStatus = 1;
                                                }
                                                else {
                                                    this.eventStatus = 2;
                                                }
                                                this.eventTriggered = false;
                                            }

                                            else if (this.beforeType == 'CutScene' && ig.game.eventController.ends) {
                                                if (!this.solved) {
                                                    this.eventStatus = 1;
                                                }
                                                else {
                                                    this.eventStatus = 2;
                                                }
                                                this.eventTriggered = false;
                                            }
                                        }
                                        else if (!this.solved && !this.before) {
                                            this.eventStatus = 1;
                                        }
                                        else if (this.solved && !this.key) {
                                            return;
                                        }
                                        else if (this.solved && this.key && !this.before) {
                                            this.eventStatus = 2;
                                            this.eventTriggered = false;
                                        }
                                        break;
                                    case 1:
                                        if (!this.solved && !this.eventTriggered) {
                                            this.solved = ig.game.dataLoader.checkSolve(this.problemID);
                                            this.eventTriggered = true;
                                            this.qaInterface.ProblemDisplay(this.problemID);
                                            //ig.game.toggleProblemInteraction(this, false);
                                            //ig.game.toggleUIPlayerInteraction(false);
                                        }
                                        if (!this.qaInterface.isActive) {
                                            console.log("I am not!!!! active!!!");
                                            if (this.solved) {
                                                //ig.game.toggleProblemInteraction(this, true);
                                                //ig.game.toggleUIPlayerInteraction(true);
                                                this.eventStatus = 2;
                                                this.eventTriggered = false;

                                            }
                                            else {
                                                //ig.game.toggleProblemInteraction(this, true);
                                                //ig.game.toggleUIPlayerInteraction(true);
                                                this.status = 0;
                                                return;
                                            }
                                        }

                                        break;
                                    case 2:
                                        if ((this.solved || this.key) && this.after && !this.eventTriggered) {
                                            this.eventTriggered = true;
                                            if (this.afterType == 'Dialog') {
                                                ig.game.dialogController.loadDialog(this.after);
                                                ig.game.toggleProblemInteraction(this, false);
                                                ig.game.toggleUIPlayerInteraction(false);
                                            }
                                            else if (this.afterType == 'CutScene') {
                                                ig.game.eventController.startEvent({eventID: this.after});
                                            }

                                        }
                                        else if (this.eventTriggered) {
                                            if (this.afterType == 'Dialog' && ig.game.dialogController.ends()) {
                                                this.eventStatus = 3;
                                                this.eventTriggered = false;
                                                ig.game.toggleProblemInteraction(this, true);
                                                ig.game.toggleUIPlayerInteraction(true);
                                            }
                                            else if (this.afterType == 'CutScene' && ig.game.eventController.ends) {
                                                this.eventStatus = 3;
                                                this.eventTriggered = false;
                                            }
                                        }
                                        else if (!this.after) {
                                            this.eventStatus = 3;
                                            this.eventTriggered = false;
                                        }
                                        break;
                                    case 3:
                                        if (!this.eventTriggered && this.nextQuestion) {
                                            this.unlockNextQuestions();
                                        }
                                        this.eventTriggered = true;
                                        ig.game.getEntitiesByType(EntityQuestionController)[0].checkEvent();
                                        this.status = 4;
                                        break;
                                    default:
                                        break;
                                }
                                break;
                            default:
                                break;
                        }

                        // every 30s, send request to get solved info
                        if (!this.solved && this.timer.delta() > 0) {
                            this.solved = ig.game.dataLoader.checkSolve(this.problemID);
                            this.timer.set(5);
                        }
                    }
                }
            },

            draw: function() {
                //this.parent();
                if (!this.problemTriggerLock) {
                    if (!this.locked) {
                        if (this.imageID != -1) {

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
                                this.zIndex  = 3000;
                                if (!this.mouseoverPlayed) {
                                    //ig.game.audioController.play('mouseover');
                                    this.mouseoverPlayed = true;
                                }
                                if (this._rel < this._eTargetX) {
                                    this._rel += this.animSpeed;
                                }
                            }
                            else {
                                this.zIndex = 2900;
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
                        gradout.addColorStop(0, "rgba(41, 56, 79, " + (this._rel - 5) / 200 + ")");
                        gradout.addColorStop(1, "rgba(255, 255, 255," + (this._rel - 5) / 60 + ")");

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
                        gradient.addColorStop(0, curColor1 + (this._rel - 5) / 70 + ")");
                        gradient.addColorStop(1, curColor2 + (this._rel - 5) / 70 + ")");

                        ctx.fillStyle = gradient;
                        ctx.beginPath();
                        ctx.moveTo(this._start.x, this._start.y);
                        ctx.lineTo(this._end.x, this._end.y);
                        ctx.lineTo(this._end.x - 20, this._end.y + 43);
                        ctx.lineTo(this._start.x, this._start.y + 43);
                        ctx.closePath();
                        ctx.fill();

                        ctx.globalAlpha = (this._rel - 5) / 60;
                        this.font2.draw(this._text, this._start.x + 12, this._start.y + 4);
                        this.font3.draw(this._text, this._start.x + 11, this._start.y + 3.5);
                        this.font.draw(this._text, this._start.x + 10, this._start.y + 3);
                        ctx.globalAlpha = 1;

                    }
                }
            },


            isHover: function() {
                return ig.input.mouse.x + ig.game.screen.x >= this.pos.x + this.xOffset &&
                    ig.input.mouse.x + ig.game.screen.x <= this.pos.x + this.xOffset + 60 &&
                    ig.input.mouse.y + ig.game.screen.y >= this.pos.y + this.yOffset &&
                    ig.input.mouse.y + ig.game.screen.y <= this.pos.y + this.yOffset + 60;

            },

            clickedOn: function() {
                if (!ig.input.released('leftclick')) {
                    return false;
                }
                this.destinationSet = false;
                return this.isHover();
            },

            checkDistance: function() {
                if (this.distance == -1) {
                    return true;
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
                this.status = 0;
                this.eventStatus = 0;
                // initialize question
                this.problemID = parseInt(this.name[1] * 10) + parseInt(this.name[2]);
                if (this.problemID < 10) {
                    this.problemID = "0" + this.problemID;
                }
                //this.problemID = (this.name+"").charAt(1)*10+(this.name+"").charAt(2);
                this.data = ig.game.dataLoader.getProblemData(this.problemID);
                this.problemType = this.data.type;
                this.problemScore = this.data.points;
                this.getImageID();
                this.solved = ig.game.dataLoader.checkSolve(this.problemID);
                this.addAnim( 'notsolved', 1, [this.imageID] );
                this.addAnim( 'solvedkey', 1, [this.imageID + 14] );
                this.addAnim( 'solvednotkey', 1, [this.imageID + 7]);
                this.timer.set(5);
                this._text = this.problemType + '\nScore: ' + this.problemScore;
                this._sTargetX = 5;
                this._eTargetX = 65;
                this._start.x = this.pos.x + this._rel - ig.game.screen.x;
                this._start.y = this.pos.y + 10 - ig.game.screen.y;
                this.qaInterface = ig.game.getEntitiesByType(EntityQuestions)[0];
            },

            unlockNextQuestions: function() {
                for(var i = 1; i < this.nextQuestion.length; i+=2) {
                    var nextItem = this.nextQuestion.charAt(i) * 10 + this.nextQuestion.charAt(i+1);
                    ig.game.getEntityByName("q" + nextItem).unlock();
                }
            },

            hide: function() {
                this.locked = true;
            },

            getImageID: function() {

                if (this.problemType != null) {
                    switch (this.problemType) {
                        case 'Binary':
                            this.imageID = 0;
                            this.problemType = 'Binary Exploitation';
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
                        case 'Trivia':
                            this.imageID = 4;
                            this.problemType = 'Trivia/Misc';
                            break;
                        case 'Forensics':
                            this.imageID = 5;
                            break;
                        case 'Cryptology':
                            this.imageID = 6;
                            break;
                        case 'default':
                            this.imageID = -1;
                            this.problemType = 'Undefined';
                            break;
                    }
                }
            }

        });


    });