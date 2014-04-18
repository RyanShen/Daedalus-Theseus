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
            saved: false,

            sessionData: null,

            init: function() {
                var isServerOn = this.connect();
                if (!isServerOn) {
                    alert('Server is not on');
                }
                else {
                    saved = false;
                    //this.loadUserIDFromLocalFile();
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
                    url: this.serverURL+"getsession?u="+this.userID,
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
                ig.game.avatarID = sessionData.aid;
                ig.game.teamID = sessionData.tid;
                ig.game.eventID = sessionData.eid;
                ig.game.level = sessionData.level;
                ig.game.spawnpos.x = sessionData.pos.x;
                ig.game.spawnpos.y = sessionData.pos.y;
                ig.game.eventController.latestEventID = ig.game.eventID;


            },

            setSessionStatus: function() {
                var position = ig.game.spawnpos;
                if (ig.game.player) {
                    position = ig.game.player.pos;
                }
                $.ajax({
                    url: this.serverURL+"updatesession?u="+this.userID,
                    method: 'POST',
                    dataType: 'json',
                    async: true,
                    cache: false,
                    data: {
                        aid: ig.game.avatarID,
                        tid: ig.game.teamID,
                        eid: ig.game.eventID,
                        level: ig.game.level,
                        pos: {x: position.x, y: position.y}
                    }
                });
            },

            save: function() {
                if (!this.saved) {
                    this.saved = true;
                    this.setSessionStatus();
                }
            },

            clear: function() {
                if (!this.saved && ig.game.teamID != -1) {
                    this.saved = true;
                    $.ajax({
                        url: this.serverURL+"updatesession?u="+ig.game.userID,
                        method: 'POST',
                        dataType: 'json',
                        async: false,
                        cache: false,
                        data: {
                            aid: 3,
                            tid: ig.game.teamID,
                            eid: 0,
                            level: "Not Started",
                            pos: {x: 0, y: 0}
                        }
                    });

                    $.ajax({
                        url: this.serverURL+"clearrecords?tid="+ig.game.teamID,
                        method: 'GET',
                        dataType: 'json',
                        async: false,
                        cache: false
                    })
                }
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
                        for (var i = 0; i < problemSolved.length; i++) {
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

                var requestURL = this.serverURL+"team?tid="+ig.game.teamID;
                var thisdata = null;
                $.ajax({
                    type:'GET',
                    url: requestURL,
                    async: false,
                    cache: false,
                    dataType: 'json',
                    success: function(data) {
                        thisdata = data.achievements;
                    },
                    error: function(xhr, status, error) {
                        answer = "ERROR";
                    }
                });

                for (var i = 0; i < thisdata.length; i++) {
                    if (thisdata[i] == name) {
                        return true;
                    }
                }

                return false;
            }
        });

    });
