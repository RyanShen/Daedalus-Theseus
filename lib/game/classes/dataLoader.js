ig.module(
    'game.classes.dataLoader'
)
.requires(
    'impact.system'
)
.defines(function(){
    ig.DataLoader = ig.Class.extend({

        serverURL: 'http://128.2.239.135:3000/',

        init: function() {
            var isServerOn = this.connect();
            if (!isServerOn) {
               alert('Server is not on');
            }
        },

        connect: function() {
            var on;
            $.ajax({
                type:'GET',
                url: this.serverURL+"problem?pid=1",
                async: false,
                cache: false,
                error: function(xhr, status, error) {
                    on = false;
                },
                success: function(){
                    on = true;
                }
            });
            return on;
        },

        getAvatarName: function() {
            var name;
            /*
            var requestURL = this.serverURL + 'player?pid=' + ig.game.playerID;
            $.ajax({
                type:'GET',
                url: requestURL,
                async: false,
                cache: false,
                dataType: 'json',
                success: function(data) {
                    name = data.name;
                },
                error: function(xhr, status, error) {
                    answer = "ERROR";
                }
            });
            */
            return name;
        },

        checkSolve: function(name) {
            var requestURL = this.serverURL+"team?tid="+ig.game.teamID;
            var solved = false;
            var problemSolved;
            var thisID = name;
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

        getProblemData: function(name) {
            var requestURL = this.serverURL+"problem?pid="+name;
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

        updateProblemData: function(name) {
            var requestURL = this.serverURL+"problemsolved?pid="+name+"&tid="+ig.game.teamID;
            var successMessage;
            $.ajax({
                type:'GET',
                url: requestURL,
                async: false,
                cache: false,
                dataType: 'json',
                success: function(data) {
                    successMessage = data;
                },
                error: function(xhr, status, error) {
                }
            })
            return successMessage;
        },

        checkAchievementStatus: function(name) {
            var requestURL = this.serverURL+"achievementunlocked?aid="+name+"&tid="+ig.game.teamID;
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
            return !(thisdata.lock == 'false');
        }
    });

});
