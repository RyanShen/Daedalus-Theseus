ig.module(
    'game.classes.dataLoader'
)
.requires(
    'impact.system'
)
.defines(function(){
    ig.DataLoader = ig.Class.extend({

        serverURL: 'http://128.2.239.135:3000/',
        userID: null,
        session: null,

        sessionData: {
            eid:1,
            tid:1,
            aid: 1,
            pos:{x:1, y:1},
            level:"level0"
        },

        init: function() {
            var isServerOn = this.connect();
            if (!isServerOn) {
               alert('Server is not on');
            }
            else {
                //this.loadUserIDFromLocalFile();

                this.getSessionStatus();
            }
        },

        loadUserIDFromLocalFile: function() {
            var xmlhttp, xmlDoc;
            if (window.XMLHttpRequest)
            {// code for IE7+, Firefox, Chrome, Opera, Safari
                xmlhttp=new XMLHttpRequest();
            }
            else
            {// code for IE6, IE5
                xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
            }
            xmlhttp.open("GET","lib/game/account.xml",false);
            xmlhttp.send();
            xmlDoc=xmlhttp.responseXML;
            this.userID = xmlDoc.getElementsByTagName("user")[0].attributes.getNamedItem("id").nodeValue;
            console.log(this.userID);
        },

        connect: function() {
            var on = false;
            $.ajax({
                type:"GET",
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

        getSessionStatus: function() {
            var sessionData = null;
            $.ajax({
                url: this.serverURL+"getsession?u=1",
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
            this.session = sessionData;
        },

        setSessionStatus: function() {
            $.ajax({
                url: this.serverURL+"updatesession?u=xinghu",
                method: 'GET',
                dataType: 'json',
                data: this.sessionData,
                error: function(error, response, body) {
                    console.log(body);
                },
                success: function(data) {
                    console.log(data);
                }
            });
            console.log("Finish set");
        },

        getAvatarID: function() {
            return this.session.aid;
        },

        getTeamID: function() {
            return this.session.tid;
        },

        getEventID: function() {
            return this.session.eid;
        },

        getLevel: function() {
            return this.session.level;
        },

        getPosition: function() {
            return this.session.pos;
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
