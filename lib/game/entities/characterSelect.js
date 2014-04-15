ig.module(
    'game.entities.characterSelect'
)
    .requires(
    'impact.entity'

)
    .defines(function() {
        EntityCharacterSelect = ig.Entity.extend({
            zIndex: 9999,
            boySelected: false,
            girlSelected: false,
            errorMessage: null,
            errorMessageTimer: new ig.Timer(),
            activeTimer: new ig.Timer(),

            boyStartPos: {x: 292, y: 330},
            girlStartPos: {x: 539, y: 326},

            boyMiddlePos: {x: 415, y: 330},
            girlMiddlePos: {x: 415, y: 326},

            boySidePos: {x: 255, y: 360},
            girlSidePos: {x: 615, y: 360},

            boyPos: {x: 0, y: 0},
            girlPos: {x: 0, y: 0},

            girlScale: 1,
            boyScale: 1,

            state: 0,
            boyPortrait: new ig.Image('media/Characters/BoyPortrait.png'),
            girlPortrait: new ig.Image('media/Characters/GirlPortrait.png'),
            playButton: null,
            confirm: new ig.Image('media/UI/Confirm.png'),
            confirmHover: new ig.Image('media/UI/ConfirmHover.png'),

            font: new ig.Font( 'media/Fonts/blue26.png' ),

            init: function(x, y, settings) {
                this.selectConfirmButton();
                ig.gui.element.action('showGroup', 'Group_CharacterSelection');
                this.boyPos = this.boyStartPos;
                this.girlPos = this.girlStartPos;
                this.activeTimer.set(0.5);
            },

            update: function() {
                if (this.errorMessageTimer.delta() > 0) {
                    this.errorMessage = null;
                }
                var xVel = 5.5;
                var yVel = 1;
                switch (this.state) {
                    // display two images, wait to select
                    case 0:
                        this.state = this.selectCharacter();
                        break;
                    // select boy
                    case 1:
                        if (this.boyPos.x < this.boyMiddlePos.x) {
                            this.boyPos.x += xVel;
                        }
                        if (this.boyPos.y < this.boyMiddlePos.y) {
                            this.boyPos.y += yVel;
                        }
                        if (this.girlPos.x < this.girlSidePos.x) {
                            this.girlPos.x += xVel;
                        }
                        if (this.girlPos.y < this.girlSidePos.y) {
                            this.girlPos.y += yVel;
                        }
                        if (this.girlScale > 0.6) {
                            this.girlScale -= 0.01;
                        }
                        if (this.boyScale < 1) {
                            this.boyScale += 0.01;
                        }
                        if (this.boyPos.x >= this.boyMiddlePos.x && this.boyPos.y >= this.boyMiddlePos.y
                            && this.girlPos.x >= this.girlSidePos.x && this.girlPos.y >= this.girlSidePos.y) {
                            this.state = 3;
                        }
                        break;
                    // select girl
                    case 2:
                        if (this.girlPos.x > this.girlMiddlePos.x) {
                            this.girlPos.x -= xVel;
                        }
                        if (this.girlPos.y > this.girlMiddlePos.y) {
                            this.girlPos.y -= yVel;
                        }
                        if (this.boyPos.x > this.boySidePos.x) {
                            this.boyPos.x -= xVel;
                        }
                        if (this.boyPos.y < this.boySidePos.y) {
                            this.boyPos.y += yVel;
                        }
                        if (this.girlScale < 1) {
                            this.girlScale += 0.01;
                        }
                        if (this.boyScale > 0.6) {
                            this.boyScale -= 0.01;
                        }
                        if (this.girlPos.x <= this.girlMiddlePos.x && this.girlPos.y <= this.girlMiddlePos.y
                            && this.boyPos.x <= this.boySidePos.x && this.boyPos.y <= this.boySidePos.y) {
                            this.state = 4;
                        }
                        break;
                    // boy selected
                    case 3:
                        this.state = this.selectBoy();
                        break;
                    // girl selected
                    case 4:
                        this.state = this.selectGirl();
                        break;
                }
            },

            draw: function() {
                if (this.errorMessage != null)
                    this.font.draw(this.errorMessage, 500, 600, ig.Font.ALIGN.CENTER);
                switch (this.state) {
                    case 0:
                    case 1:
                    case 2:
                        var ctx = ig.system.context;
                        ctx.save();
                        if (this.boyScale != 1)
                            ctx.globalAlpha = this.boyScale - 0.2;
                        ctx.translate(ig.system.getDrawPos(this.boyPos.x), ig.system.getDrawPos(this.boyPos.y));
                        ctx.scale(this.boyScale, this.boyScale);
                        this.boyPortrait.draw(0, 0);
                        ctx.restore();
                        ctx.save();
                        if (this.girlScale != 1)
                            ctx.globalAlpha = this.girlScale - 0.2;
                        ctx.translate(ig.system.getDrawPos(this.girlPos.x), ig.system.getDrawPos(this.girlPos.y));
                        ctx.scale(this.girlScale, this.girlScale);
                        this.girlPortrait.draw(0, 0);
                        ctx.restore();
                        break;
                    case 3:
                    case 4:
                        ctx = ig.system.context;
                        ctx.save();
                        if (this.boyScale != 1)
                            ctx.globalAlpha = this.boyScale - 0.2;
                        ctx.translate(ig.system.getDrawPos(this.boyPos.x), ig.system.getDrawPos(this.boyPos.y));
                        ctx.scale(this.boyScale, this.boyScale);
                        this.boyPortrait.draw(0, 0);
                        ctx.restore();
                        ctx.save();
                        if (this.girlScale != 1)
                            ctx.globalAlpha = this.girlScale - 0.2;
                        ctx.translate(ig.system.getDrawPos(this.girlPos.x), ig.system.getDrawPos(this.girlPos.y));
                        ctx.scale(this.girlScale, this.girlScale);
                        this.girlPortrait.draw(0, 0);
                        ctx.restore();

                        ig.gui.element.action('showGroup', 'Group_CharacterSelection');
                        break;


                }
            },

            selectCharacter: function() {
                if (this.activeTimer.delta() >= 0) {
                    if (!ig.input.released('leftclick')) {
                        return 0;
                    }
                    if (ig.input.mouse.x >= this.boyStartPos.x && ig.input.mouse.x <= this.boyStartPos.x + 194
                        && ig.input.mouse.y >= this.boyStartPos.y && ig.input.mouse.y <= this.boyStartPos.y + 299) {
                        this.girlSelected = false;
                        this.boySelected = true;
                        return 1;
                    }
                    if (ig.input.mouse.x >= this.girlStartPos.x && ig.input.mouse.x <= this.girlStartPos.x + 176
                        && ig.input.mouse.y >= this.girlStartPos.y && ig.input.mouse.y <= this.girlStartPos.y + 304) {
                        this.girlSelected = true;
                        this.boySelected = false;
                        return 2;
                    }
                }
                return 0;
            },

            selectBoy: function() {
                if (!ig.input.released('leftclick')) {
                    return 3;
                }
                if (ig.input.mouse.x >= this.boyMiddlePos.x && ig.input.mouse.x <= this.boyMiddlePos.x + 194
                    && ig.input.mouse.y >= this.boyMiddlePos.y && ig.input.mouse.y <= this.boyMiddlePos.y + 299) {
                    this.girlSelected = false;
                    this.boySelected = true;
                    return 1;
                }
                if (ig.input.mouse.x >= this.girlSidePos.x && ig.input.mouse.x <= this.girlSidePos.x + 140
                    && ig.input.mouse.y >= this.girlSidePos.y && ig.input.mouse.y <= this.girlSidePos.y + 244) {
                    this.girlSelected = true;
                    this.boySelected = false;
                    return 2;
                }
                return 3;
            },

            selectGirl: function() {
                if (!ig.input.released('leftclick')) {
                    return 4;
                }
                if (ig.input.mouse.x >= this.boySidePos.x && ig.input.mouse.x <= this.boySidePos.x + 155
                    && ig.input.mouse.y >= this.boySidePos.y && ig.input.mouse.y <= this.boySidePos.y + 240) {
                    this.girlSelected = false;
                    this.boySelected = true;
                    return 1;
                }
                if (ig.input.mouse.x >= this.girlMiddlePos.x && ig.input.mouse.x <= this.girlMiddlePos.x + 176
                    && ig.input.mouse.y >= this.girlMiddlePos.y && ig.input.mouse.y <= this.girlMiddlePos.y + 304) {
                    this.girlSelected = true;
                    this.boySelected = false;
                    return 2;
                }
                return 4;

            },

            selectConfirmButton: function() {
                ig.gui.element.add({
                    name: 'Button_Confirm',
                    group: 'Group_CharacterSelection',
                    size: {x: 150, y: 100},
                    pos: {x: 688, y: 653},
                    state: {
                        normal: { image: this.confirm },
                        hover:  { image: this.confirmHover }
                    },
                    click: function() {
                        ig.game.getEntitiesByType(EntityCharacterSelect)[0].submit();
                    }
                })
            },

            submit: function() {
                if (this.boySelected && this.girlSelected) {
                    this.displayMessage("Error: Select both characters");
                }
                else if (this.girlSelected || this.boySelected) {
                    if (this.girlSelected)
                        ig.game.avatarID = 1;
                    else
                        ig.game.avatarID = 0;
                    ig.gui.element.action('hideGroup', 'Group_CharacterSelection');
                    ig.game.levelController.loadNewGameLevel();
                    ig.game.dialogController = new DialogController();
                }
                else
                    this.displayMessage("Please select a character");
            },

            displayMessage: function(s) {
                this.errorMessage = s;
                this.errorMessageTimer.set(2);

            }


        });
    });