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

            saveStorage: false,

            sessionData: null,

            init: function() {
                var isServerOn = this.connect();
                if (!isServerOn) {
                    alert('Server is not on');
                }
                else {
                    saved = false;
                    this.loadUserIDFromLocalFile();
                }
            },

            loadUserIDFromLocalFile: function() {
                var xmlhttp, xmlDoc;
                if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
                    xmlhttp=new XMLHttpRequest();
                }
                else {// code for IE6, IE5
                    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
                }
                xmlhttp.open("GET","lib/game/account.xml",false);
                xmlhttp.send();
                xmlDoc=xmlhttp.responseXML;
                this.userID = xmlDoc.getElementsByTagName("user")[0].attributes.getNamedItem("id").nodeValue;
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

            parseURI: function() {
                if (window.location.hash) {
                    var link = window.location.hash.split('#');
                    // #level#xpos#ypos#eventID#teamID#avatarID
                    this.decrypt(link);
                    ig.game.level = this.getLevelName(parseInt(link[1]));
                    ig.game.spawnpos = {x: parseInt(link[2]), y: parseInt(link[3])};
                    ig.game.eventID = parseInt(link[4]);
                    ig.game.teamID = parseInt(link[5]);
                    ig.game.avatarID = parseInt(link[6]);

                    ig.game.userID = this.userID;
                    //this.getSessionStatus();
                    ig.game.levelController.loadLevelfromURL();
                }
                else {
                    ig.game.levelController.loadTeamSelect();
                }
            },

            getSessionFromLocalStorage: function() {
                ig.game.avatarID = ig.game.storage.get('pico-aid');
                ig.game.teamID = ig.game.storage.get('pico-tid');
                ig.game.eventID = ig.game.storage.get('pico-eid');
                ig.game.level = ig.game.storage.get('pico-level');
                ig.game.eventController.latestEventID = ig.game.eventID;
            },

            saveSessionToLocalStorage: function() {
                if (!this.saveStorage) {
                    if (ig.game.storage.isCapable()) {
                        var date = new Date();
                        var time = date.getTime();
                        ig.game.storage.set('pico-TimeStamp', time);
                        console.log("save session to local storage");
                        ig.game.storage.set('pico-aid', ig.game.avatarID);
                        ig.game.storage.set('pico-tid', ig.game.teamID);
                        ig.game.storage.set('pico-eid', ig.game.eventID);
                        ig.game.storage.set('pico-level', ig.game.level);
                        ig.game.storage.set('pico-solved', this.getTeamData().problemsolved);
                        ig.game.storage.set('pico-achivm', this.getTeamData().achievements);
                    }
                    this.saveStorage = true;
                }
            },

            getSessionStatus: function() {
                var sessionData = null;
                $.ajax({
                    url: this.serverURL+"getsession?u="+ig.game.userID,
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
                    url: this.serverURL+"updatesession",
                    method: 'POST',
                    dataType: 'json',
                    async: false,
                    cache: false,
                    data: {
                        username: ig.game.userID,
                        aid: ig.game.avatarID,
                        tid: ig.game.teamID,
                        eid: ig.game.eventID,
                        level: ig.game.level,
                        pos: {x: parseInt(position.x), y: parseInt(position.y)}
                    }
                });
                var link = "#" + this.setLevelNum(ig.game.level) +
                    "#" + parseInt(position.x) + "#" + parseInt(position.y) +
                    "#" + ig.game.eventID +
                    "#" + ig.game.teamID +
                    "#" + ig.game.avatarID;
                link = this.encrypt(link);
                history.pushState(null, null, link);
            },

            encrypt: function(link) {
                return link;
            },

            decrypt: function(link) {
                return link;
            },

            achievementDisplay: function(achID) {
                $.ajax({
                    url: this.serverURL+"achievementdisplayed",
                    method: 'POST',
                    dataType: 'json',
                    async: false,
                    cache: false,
                    data: {
                        username: ig.game.userID,
                        tid: ig.game.teamID,
                        aid: achID
                    }
                });
            },

            checkProblemDisplayed: function(name) {
                var pid = parseInt(name[1] * 10) + parseInt(name[2]);
                var teammate = this.getTeamData().teammates;
                var i;
                for (i = 0; i < teammate.length; i++) {
                    if (teammate[i].username == ig.game.userID) {
                        break;
                    }
                }
                if (i == teammate.length) {
                    console.log("Error: Cannot find teammate");
                    return;
                }
                var problemdisplayed = teammate[i].pdisplayed;
                return problemdisplayed.indexOf(pid) != -1;

            },

            setProblemDisplayed: function(name) {
                var pid = parseInt(name[1] * 10) + parseInt(name[2]);
                /*
                var teammate = this.getTeamData().teammates;
                var i;
                for (i = 0; i < teammate.length; i++) {
                    if (teammate[i].username == ig.game.userID) {
                        break;
                    }
                }
                if (i == teammate.length) {
                    console.log("Error: Cannot find teammate");
                    return;
                }
                var problemdisplayed = teammate[i].pdisplayed;
                problemdisplayed.push(pid);
                */
                $.ajax({
                    url: this.serverURL+"problemdisplayed",
                    method: 'POST',
                    dataType: 'json',
                    async: false,
                    cache: false,
                    data: {
                        username: ig.game.userID,
                        tid: ig.game.teamID,
                        pid: pid
                    }
                });

            },

            updateAchievements:function(achID){
                var requestURL = "http://128.2.239.135:3000/achievementunlocked";
                var successMessage;
                $.ajax({
                    type:'POST',
                    url: requestURL,
                    async: false,
                    cache: false,
                    dataType: 'json',
                    data: {
                        aid: achID,
                        tid: ig.game.teamID
                    },
                    success: function(data) {
                        successMessage = data;
                    },
                    error: function(xhr, status, error) {
                    }
                });
                return successMessage;
            },

            save: function() {
                if (!this.saved) {
                    console.trace();
                    this.saved = true;
                    this.setSessionStatus();
                }
            },

            clear: function() {
                if (!this.saved && ig.game.teamID != -1) {
                    this.saved = true;
                    $.ajax({
                        url: this.serverURL+"updatesession",
                        method: 'POST',
                        dataType: 'json',
                        async: false,
                        cache: false,
                        data: {
                            username: ig.game.userID,
                            aid: 3,
                            tid: ig.game.teamID,
                            eid: 0,
                            level: "Not Started",
                            pos: {x: 0, y: 0}
                        }
                    });

                    $.ajax({
                        url: this.serverURL+"clearrecords",
                        method: 'POST',
                        dataType: 'json',
                        async: false,
                        cache: false,
                        data: {
                            tid: ig.game.teamID
                        }
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

            getTeamData: function() {
                var requestURL = this.serverURL+"team?tid="+ig.game.teamID;
                var teamData = null;
                $.ajax({
                    type:'GET',
                    url: requestURL,
                    async: false,
                    cache: false,
                    dataType: 'json',
                    success: function(data) {
                        teamData = data;
                    },
                    error: function(xhr, status, error) {
                        answer = "ERROR";
                    }
                });
                return teamData;
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
                var requestURL = this.serverURL+"problemsolved";
                var successMessage;
                $.ajax({
                    type:'POST',
                    url: requestURL,
                    async: false,
                    cache: false,
                    dataType: 'json',
                    data: {
                        pid: name,
                        tid: ig.game.teamID
                    },
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
                return thisdata.indexOf(name) != -1;
            },

            getLevelName: function(name) {
                var levelName = '0_MainMenu';
                switch (name) {
                    case 1:
                        levelName = '1_House_UpperFloor';
                        break;
                    case 2:
                        levelName = '1_House_GroundFloor';
                        break;
                    case 3:
                        levelName = '2_PoliceHQ_GroundFloor';
                        break;
                    case 4:
                        levelName = '3_Tower_GroundFloor';
                        break;
                    case 5:
                        levelName = '3_Tower_TopFloor';
                        break;
                    case 6:
                        levelName = '4_Tower_SecretFloor';
                        break;
                    case 7:
                        levelName = '4_Tower_ReverseEngyRoom';
                        break;
                    case 8:
                        levelName = '4_Tower_CryptologyRoom';
                        break;
                    case 9:
                        levelName = '4_Tower_TriviaRoom';
                        break;
                    case 10:
                        levelName = '4_Tower_WebExploitRoom';
                        break;
                    case 11:
                        levelName = '4_Tower_ForensicsRoom';
                        break;
                    case 12:
                        levelName = '4_Tower_BinaryExploitRoom';
                        break;
                    case 13:
                        levelName = '4_Tower_ScriptExploitRoom';
                        break;

                }
                return levelName;
            },

            setLevelNum: function(name) {
                var levelNum = 0;
                switch (name) {
                    case '1_House_UpperFloor':
                        levelNum = 1;
                        break;
                    case '1_House_GroundFloor':
                        levelNum = 2;
                        break;
                    case '2_PoliceHQ_GroundFloor':
                        levelNum = 3;
                        break;
                    case '3_Tower_GroundFloor':
                        levelNum = 4;
                        break;
                    case '3_Tower_TopFloor':
                        levelNum = 5;
                        break;
                    case '4_Tower_SecretFloor':
                        levelNum = 6;
                        break;
                    case '4_Tower_ReverseEngyRoom':
                        levelNum = 7;
                        break;
                    case '4_Tower_CryptologyRoom':
                        levelNum = 8;
                        break;
                    case '4_Tower_TriviaRoom':
                        levelNum = 9;
                        break;
                    case '4_Tower_WebExploitRoom':
                        levelNum = 10;
                        break;
                    case '4_Tower_ForensicsRoom':
                        levelNum = 11;
                        break;
                    case '4_Tower_BinaryExploitRoom':
                        levelNum = 12;
                        break;
                    case '4_Tower_ScriptExploitRoom':
                        levelNum = 13;
                        break;


                }
                return levelNum;
            }
        });

    });
