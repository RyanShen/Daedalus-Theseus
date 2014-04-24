ig.module(
    'game.entities.teamSelect'
)
    .requires(
    'impact.entity'

)
    .defines(function() {
        EntityTeamSelect = ig.Entity.extend({
            zIndex: 9999,

            state: 0,
            button1: new ig.Image('media/UI/TeamSelect/button1.png'),
            button2: new ig.Image('media/UI/TeamSelect/button2.png'),
            button3: new ig.Image('media/UI/TeamSelect/button3.png'),
            button4: new ig.Image('media/UI/TeamSelect/button4.png'),
            button1_gray: new ig.Image('media/UI/TeamSelect/button1_gray.png'),
            button2_gray: new ig.Image('media/UI/TeamSelect/button2_gray.png'),
            button3_gray: new ig.Image('media/UI/TeamSelect/button3_gray.png'),
            button4_gray: new ig.Image('media/UI/TeamSelect/button4_gray.png'),

            button: new Array(4),
            buttonGray: new Array(4),
            available: new Array(4),

            confirm: new ig.Image('media/UI/Confirm.png'),
            confirmHover: new ig.Image('media/UI/ConfirmHover.png'),

            font: new ig.Font( 'media/Fonts/blue26.png' ),

            buttonPos: {x: 150, y: 350},

            side: 120,

            selection: null,
            errorMessage: null,
            errorMessageTimer: new ig.Timer(),
            checkTakenTimer: new ig.Timer(),


            init: function() {
                this.button[0] = this.button1;
                this.button[1] = this.button2;
                this.button[2] = this.button3;
                this.button[3] = this.button4;
                this.buttonGray[0] = this.button1_gray;
                this.buttonGray[1] = this.button2_gray;
                this.buttonGray[2] = this.button3_gray;
                this.buttonGray[3] = this.button4_gray;
                for (var i = 0; i < 4; i++) {
                    this.checkTaken(i);
                }
                this.checkTakenTimer.set(10);
                ig.game.inGameGUIController.toggleUI(false);
            },

            update: function() {
                if (this.errorMessageTimer.delta() > 0) {
                    this.errorMessage = null;
                }
                for (var i = 0; i < 4; i++) {
                    if (ig.input.released("leftclick") && this.hovered(i) && this.available[i]) {
                        this.selection = i;
                    }
                    if (this.checkTakenTimer.delta() > 0) {
                        this.checkTaken(i);
                        this.checkTakenTimer.set(10);
                    }
                }
                if (this.selection != null && !this.available[this.selection]) {
                    this.selection = null;
                }
                for (i = 0; i < 4; i++) {
                    if (this.available[i]) {
                        break;
                    }
                    if (i == 3) {
                        this.displayMessage("Sorry, all the test players are taken\nPlease come back later");
                    }
                }
                this.submit();
            },

            draw: function() {
                if (this.errorMessage != null) {
                    this.font.draw(this.errorMessage, 500, 600, ig.Font.ALIGN.CENTER);
                }
                var ctx = ig.system.context;
                for (var i = 0; i < 4; i++) {
                    if (!this.available[i]) {
                        this.buttonGray[i].draw(this.buttonPos.x + i * 200, this.buttonPos.y);
                        this.font.draw("In Use",this.buttonPos.x + i * 200 + 10, this.buttonPos.y + 120);
                    }
                    else if (this.hovered(i)) {
                        ctx.save();
                        ctx.globalAlpha = 0.8;
                        ctx.translate(ig.system.getDrawPos(this.buttonPos.x + i * 200 - 15), ig.system.getDrawPos(this.buttonPos.y - 15));
                        ctx.scale(1.3, 1.3);
                        this.button[i].draw(0, 0);
                        ctx.restore();
                    }
                    else if (this.selection == i) {
                        ctx.save();
                        ctx.translate(ig.system.getDrawPos(this.buttonPos.x + i * 200 - 15), ig.system.getDrawPos(this.buttonPos.y - 15));
                        ctx.scale(1.3, 1.3);
                        this.button[i].draw(0, 0);
                        ctx.restore();
                    }
                    else {
                        ctx.save();
                        ctx.globalAlpha = 0.6;
                        this.button[i].draw(this.buttonPos.x + i * 200, this.buttonPos.y);
                        ctx.restore();
                    }
                }
                if (ig.input.mouse.x >= 688 && ig.input.mouse.x <= 688 + 150
                    && ig.input.mouse.y >= 653 && ig.input.mouse.y <= 753) {
                    this.confirm.draw(688, 653);
                }
                else {
                    this.confirmHover.draw(688, 653);
                }
            },

            checkTaken: function(i) {
                var sessionData = null;
                i = i + 1;
                $.ajax({
                    url: "http://128.2.239.135:3000/getsession?u=user"+i,
                    method: 'GET',
                    async: false,
                    cache: false,
                    dataType: 'json',
                    error: function(xhr, status, error) {
                        console.log(error);
                    },
                    success: function(data) {
                        sessionData = data;
                    }
                });
                if (sessionData.level == "Not Started") {
                    this.available[i-1] = true;
                }
                else {
                    this.available[i-1] = false;
                }
            },

            hovered: function(i) {
                if (ig.input.mouse.x >= this.buttonPos.x + i * 200 &&
                    ig.input.mouse.x <= this.buttonPos.x + i * 200 + this.side &&
                    ig.input.mouse.y >= this.buttonPos.y &&
                    ig.input.mouse.y <= this.buttonPos.y + this.side) {
                    if (this.selection != i) {
                        return true;
                    }
                }
                return false;
            },

            submit: function() {
                if (ig.input.released('leftclick')) {
                    if (ig.input.mouse.x >= 688 && ig.input.mouse.x <= 688 + 150
                        && ig.input.mouse.y >= 653 && ig.input.mouse.y <= 753) {
                        if (this.selection == null) {
                            this.displayMessage("Please select a test player");
                        }
                        else {
                            ig.game.teamID = parseInt(this.selection) + 1;
                            if (ig.game.teamID > 2) {
                                ig.game.userID = "user" + parseInt(ig.game.teamID - 2);
                            }
                            else {
                                ig.game.userID = "user" + ig.game.teamID;
                            }
                            ig.game.menuController.loadMainMenu();
                            ig.game.dialogController = new DialogController();
                            $.ajax({
                                url: "http://128.2.239.135:3000/updatesession?u="+ig.game.userID,
                                method: 'POST',
                                dataType: 'json',
                                async: true,
                                cache: false,
                                data: {
                                    aid: 3,
                                    tid: ig.game.teamID,
                                    eid: 0,
                                    level: "Started",
                                    pos: {x: 0, y: 0}
                                }
                            });
                            var solved = ig.game.storage.get('pico-solved');
                            for (var i = 0; i < solved.length; i++) {
                                ig.game.dataLoader.updateProblemData(solved[i]);
                            }
                            var achievement = ig.game.storage.get('pico-achivm');
                            for (i = 0; i < achievement.length; i++) {
                                ig.game.dataLoader.updateAchievements(i);
                            }
                            console.log("team id: " + ig.game.teamID+ " user id:  " + ig.game.userID);
                        }
                    }

                }
            },

            displayMessage: function(s) {
                this.errorMessage = s;
                this.errorMessageTimer.set(2);
            }


        });
    });