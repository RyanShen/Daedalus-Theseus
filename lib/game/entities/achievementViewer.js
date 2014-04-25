ig.module(
    'game.entities.achievementViewer'
)
    .requires(
    'impact.entity'
).defines(function(){
        EntityAchievementViewer = ig.Entity.extend({

            collection: [],
            itemBg: new ig.Image('media/UI/Achievement_Icon/Achievement_item_lock.png'),
            mask: new ig.Image('media/UI/Achievement_Icon/mask.png'),
            scroll: new ig.Image('media/UI/Achievement_Icon/scroll.png'),
            upArrow: new ig.Image('media/UI/Achievement_Icon/Arrow_up.png'),
            upArrowActive: new ig.Image('media/UI/Achievement_Icon/Arrow_up_active.png'),
            downArrow: new ig.Image('media/UI/Achievement_Icon/Arrow_down.png'),
            downArrowActive: new ig.Image('media/UI/Achievement_Icon/Arrow_down_active.png'),

            titleFont: new ig.Image('media/Fonts/achievement_text.png'),
            contentFont: new ig.Image('media/Fonts/problemtrigger_light.png'),

            scrollx: 575,
            scrolly: 95,

            _xbase: 156,
            _ybase: 130,
            _offset: 114,
            _trophyOffset: -82,
            _wordOffset: 20,

            _base: 0,
            _baseMin: 0,

            show: false,

            typeCount: new Array(7),
            solveCount: new Array(7),
            ///////change the max problem number here/////
            maxProblemCount: 23,
            ///////change the max achievement number here/////
            maxAchievementCount: 7,
            totalSolveCount: 0,

            drawDeg: 0.05,
            drawLen: new Array(7),

            degSpeed: 80,
            barSpeed: 80,

            zIndex: 3050,

            list:[

                {title: '1KNOW IT ALL', type: 'bronze', content: 'Solved all trivia questions'},
                {title: '2FORENSIC MASTERY', type: 'silver', content: 'Solved 3 forensic questions'},
                {title: '3JACK OF ALL TRADES', type: 'bronze', content: 'Solved questions of 4 different categories'},
                {title: '4JACK OF ALL TRADES', type: 'bronze', content: 'Solved questions of 4 different categories'},
                {title: '5JACK OF ALL TRADES', type: 'bronze', content: 'Solved questions of 4 different categories'},
                {title: '6JACK OF ALL TRADES', type: 'bronze', content: 'Solved questions of 4 different categories'},
                {title: '7JACK OF ALL TRADES', type: 'bronze', content: 'Solved questions of 4 different categories'}
            ],

            tooltip: [
                'Forensics',
                'Binary Exploitation',
                'Web Exploitation',
                'Cryptology',
                'Reverse Engineering',
                'Script Exploitation',
                'Trivia/Misc'
            ],

            init: function(x, y, settings) {
                this.parent(x, y, settings);
                this.initAchievement();
                this.initBackButton();
                CanvasRenderingContext2D.prototype.sector = function (x, y, radius, sDeg, eDeg) {
                    this.save();
                    this.translate(x, y);
                    this.beginPath();
                    this.arc(0,0,radius,sDeg, eDeg);
                    this.save();
                    this.rotate(eDeg);
                    this.moveTo(radius,0);
                    this.lineTo(0,0);
                    this.restore();
                    this.rotate(sDeg);
                    this.lineTo(radius,0);
                    this.closePath();
                    this.restore();
                    return this;
                };
                this._baseMin = -1 * this._offset * (this.maxAchievementCount - 5);
            },

            add: function(e) {
                this.collection.push(e);
            },

            update: function() {
                // scroll up
                if (ig.input.state('scrolldown')) {
                    this._base-=15;
                    if (this._base < this._baseMin) {
                        this._base = this._baseMin;
                    }
                }
                // scroll down
                else if (ig.input.state('scrollup')) {
                    this._base+=15;
                    if (this._base > 0) {
                        this._base = 0;
                    }
                }
            },

            buttonUpPressed: function() {
                if (ig.input.state('leftclick')) {
                    if (ig.input.mouse.x >= this.scrollx &&
                        ig.input.mouse.x <= this.scrollx + 32 &&
                        ig.input.mouse.y >= this.scrolly &&
                        ig.input.mouse.y <= this.scrolly + 32) {
                        this.upArrowActive.draw(this.scrollx, this.scrolly);
                        this._base += 10;
                        if (this._base > 0) {
                            this._base = 0;
                        }
                    }
                }
            },

            buttonDownPressed: function() {
                if (ig.input.state('leftclick')) {
                    if (ig.input.mouse.x >= this.scrollx &&
                        ig.input.mouse.x <= this.scrollx + 32 &&
                        ig.input.mouse.y >= this.scrolly + 35 &&
                        ig.input.mouse.y <= this.scrolly + 67) {
                        this.downArrowActive.draw(this.scrollx, this.scrolly + 35);
                        this._base -= 10;
                        if (this._base < this._baseMin) {
                            this._base = this._baseMin;
                        }
                    }
                }
            },

            display: function() {
                ig.game.toggleEventModeInteraction(false);
                if (!this.show) {
                    this.show = true;
                    this.collection = [];
                    this.initAchievement();
                    this.calculateQuestion();
                }
            },

            hide: function() {
                if (this.show) {
                    ig.game.toggleEventModeInteraction(true);
                    this.show = false;
                }
                if (ig.game.level == "MainMenu") {
                    ig.game.inGameGUIController.toggleUI(false);
                    ig.gui.element.action('showGroup', 'Group_MainMenu');
                }

            },

            draw: function() {
                if (this.show) {
                    this.scroll.draw(0, 0);
                    var ctx = ig.system.context;
                    // draw achievement status
                    for (var i = 1; i <= this.maxAchievementCount; i++) {
                        var xpos, ypos;
                        xpos = this._xbase;
                        ypos = this._ybase + parseInt(i-1) * this._offset + this._base;
                        var img = null;
                        var title = this.list[i-1].title;
                        var content = this.generateContent(this.list[i-1].content);
                        this.itemBg.draw(xpos, ypos);
                        if (!this.collection[i-1]) {
                            img = new ig.Image('media/UI/Achievement_Icon/'+this.list[i-1].type+'_lock.png');
                            ctx.save();
                            ctx.globalAlpha = 0.4;
                            this.titleFont.draw(title, xpos + this._wordOffset, ypos + 10);
                            this.contentFont.draw(content,xpos + this._wordOffset, ypos + 35);
                            ctx.restore();
                        }
                        else {
                            img = new ig.Image('media/UI/Achievement_Icon/'+this.list[i-1].type+'_unlock.png');
                            this.titleFont.draw(title, xpos + this._wordOffset, ypos + 10);
                            this.contentFont.draw(content, xpos + this._wordOffset, ypos + 35);
                        }
                        img.draw(xpos + this._trophyOffset, ypos);
                    }
                    this.mask.draw(0, 0);
                    this.upArrow.draw(this.scrollx, this.scrolly);
                    this.downArrow.draw(this.scrollx, this.scrolly + 35);
                    this.buttonDownPressed();
                    this.buttonUpPressed();
                    if (ig.input.pressed('scrolldown')) {
                        this.downArrowActive.draw(this.scrollx, this.scrolly + 35);
                    }
                    else if (ig.input.pressed('scrollup')) {
                        this.upArrowActive.draw(this.scrollx, this.scrolly);
                    }

                    // draw problem status
                    var barChartDeg = this.totalSolveCount / this.maxProblemCount * 360 * Math.PI / 180;
                    this.contentFont.draw(this.totalSolveCount + "/" + this.maxProblemCount, 872, 130);

                    if (this.drawDeg < barChartDeg) {
                        this.drawDeg += barChartDeg / this.degSpeed;
                    }

                    var grd = ctx.createRadialGradient(776.5, 184.5, 0, 776.5, 184.5, 59);
                    grd.addColorStop(0, "rgba(22, 137, 202, 255)");
                    grd.addColorStop(1, "rgba(8, 216, 220, 255)");
                    ctx.fillStyle = grd;
                    ctx.sector(776.5, 184.5, 59, 0, this.drawDeg).fill();

                    var barX = 677;
                    var barY = 278;
                    var barLength = 234;
                    for (i = 0; i < 7; i++) {
                        var x = barX;
                        var y = barY + i * 60;
                        var width = this.solveCount[i] / this.typeCount[i] * barLength;
                        if (this.drawLen[i] < width) {
                            this.drawLen[i]+=width/this.barSpeed;
                        }
                        grd = ctx.createLinearGradient(x, y, x, parseInt(y + 25));
                        grd.addColorStop(0, "rgba(8, 216, 220, 255)");
                        grd.addColorStop(1, "rgba(22, 137, 202, 255)");
                        ctx.save();
                        ctx.beginPath();
                        ctx.fillStyle = grd;
                        ctx.rect(x, y, this.drawLen[i], 25);
                        ctx.fill();
                        ctx.closePath();
                        ctx.restore();
                        this.contentFont.draw(this.solveCount[i] + "/" + this.typeCount[i], 875, y + 5);
                        if (ig.input.mouse.x >= barX - 50 && ig.input.mouse.x <= barX - 15
                            && ig.input.mouse.y >= y && ig.input.mouse.y <= y + 35) {
                            // show problem type tooltip

                            this.contentFont.draw(this.tooltip[i], barX, y + 35);


                        }
                    }

                    // draw back button
                    ig.gui.element.action('show', 'Button_BackToMainMenu');
                }
            },

            initAchievement: function() {
                for (var i = 0; i < this.maxAchievementCount; i++) {
                    this.add(ig.game.dataLoader.checkAchievementStatus(i+1));
                }
            },

            calculateQuestion: function() {
                for (var i = 0; i < 7; i++) {
                    this.solveCount[i] = 0;
                    this.typeCount[i] = 0;
                    this.drawLen[i] = 1;
                }
                this.drawDeg = 0.05;
                this.totalSolveCount = 0;
                var problems = ig.game.dataLoader.getTeamData().problemsolved;
                if (problems != null) {
                    for (i = 1; i <= this.maxProblemCount; i++) {
                        var index = this.lookUpType(ig.game.dataLoader.getProblemData(i).type);
                        this.typeCount[index]++;
                        if (problems.indexOf(i) != -1) {
                            this.solveCount[index]++;
                            this.totalSolveCount++;
                        }
                    }
                }

            },

            lookUpType: function(name) {
                switch (name) {
                    case 'Binary':
                        return 1;
                    case 'Web Exploitation':
                        return 2;
                    case 'Script Exploitation':
                        return 5;
                    case 'Reverse Engineering':
                        return 4;
                    case 'Trivia/Misc':
                    case 'Trivia':
                        return 6;
                    case 'Forensics':
                        return 0;
                    case 'Cryptology':
                        return 3;
                    case 'default':
                        return 0;
                }
            },

            initBackButton: function() {
                ig.gui.element.add({
                    name: 'Button_BackToMainMenu',
                    group: 'Group_Achievement',
                    size: {x: 30, y: 30},
                    pos: {x: 929, y: 30},
                    state: {
                        normal: {image: new ig.Image('media/UI/Achievement_Icon/Achievement_btn_leave.png')},
                        hover: {image: new ig.Image('media/UI/Achievement_Icon/Achievement_btn_leave_hover.png')}
                    },
                    click: function() {
                        ig.gui.element.action('hide', 'Button_BackToMainMenu');
                        ig.game.getEntitiesByType('EntityAchievementViewer')[0].hide();

                    }
                });
                ig.gui.element.action('hide', 'Button_BackToMainMenu');
            },

            generateContent: function(s) {
                var result = '';
                for (var i = 0; i < s.length; i++) {
                    result += s.charAt(i);
                    if (i > 0 && i % 30 == 0) {

                        if (s.charAt(i+1) == ' ') {
                            i++;
                        }
                        result += '\n';
                    }
                }
                return result;
            }


        });
    });