ig.module( 
    'game.entities.bossFight'
)
.requires(
    'impact.entity'
)
.defines(function(){

EntityBossFight = ig.Entity.extend({

    pos:{x:0,y:0},
    size:{x:32,y:32},
    zIndex: 2400,
    stateInterface: 'closed', //closed: initial state, idle: boss idle, closed
    stateBodyParts: ['alive','alive','alive','alive','alive'],
    //[0] body [1-4] four legs
    // alive, exploding, dead

    firstRun: 0,

    _wmScalable: true,
    _wmDrawBox: true,
    _wmBoxColor: 'rgba(255, 255, 0, 0.7)',

    //media
    animSheetBody: new ig.AnimationSheet('media/Characters/BossBody.png', 300, 500 ),
    animSheetLeg: new ig.AnimationSheet('media/Characters/BossLeg.png', 433.34, 400 ),
    animSheetBG: new ig.AnimationSheet('media/Characters/BossBG.jpg', 1024, 768 ),
    animSheetExpSmall: new ig.AnimationSheet('media/Characters/BossExplosionSmall.png', 64, 64 ),
    animSheetExpBig: new ig.AnimationSheet('media/Characters/BossExplosionBig.png', 128, 128 ),

    animBody: null,
    animLegs: [],
    animBG: null,
    animExpSmall: [],
    animExpBig: [],
    animExpCurrent: [],
    explosionPosArray: [],
    explodeInterval: 1, // interval frame counts to spawn explosion
    explodeIntervalTimer: 0,
    explodeCount: 1, // numbers of explosion to spawn at each spawning frame
    explodeRate: 0.55, // random number ( [0,1) ) less than this will spawn small explosion, otherwise spawns big one
    explodeFrameTimer: 0,
    explodeFrameTimerMax: 120,

    shakeIntensity: 0,
    shakeTimerMax: 120,
    shakeTimer: 0,
    shakeX: 0,
    shakeY: 0,
    screenFader: null,

    isSuspended: false,

    q1: null,
    q2: null,
    q3: null,
    q4: null,
    q5: null,

    damage: 0,
    deathTimer: null,

    init: function(x,y,settings){

        this.firstRun = 0;
        this.parent(this.pos.x, this.pos.y, settings);


        this.animBG = new ig.Animation( this.animSheetBG, 1, [0], true );
        this.animBody = new ig.Animation( this.animSheetBody, 0.04, [
            0,1,2,3,4,5,
            6,7,8,9,10,11,
            12,13,14,15,16,17,
            18,19,20,21,22,23,
            24,25,26,27,28,29,
            30,31,32,33,34,35,
            36,37,38,39,40,41,
            42,43,44,45,46,47], false );
        this.animBody.rewind();
        for(var i=0; i<4; i++)
        {
            this.animLegs.push( new ig.Animation( this.animSheetLeg, 0.04, [
                0,1,2,3,4,5,
                6,7,8,9,10,11,
                12,13,14,15,16,17,
                18,19,20,21,22,23,
                24,25,26,27,28,29,
                30,31,32,33,34,35,
                36,37,38,39,40,41,
                42,43,44,45,46,47], false ) );
            this.animLegs[i].rewind();
        }
        this.animLegs[0].flip.x = true;
        this.animLegs[0].angle = 0.6;
        this.animLegs[1].flip.x = true;
        //this.animLegs[1].angle = -0.25;
        this.animLegs[2].angle = -0.6;
        //this.animLegs[3].angle = 0.25;

        var arrayPos = [];
        //body
        arrayPos.push(
            {x:478,y:226},{x:450,y:252},{x:448,y:213},{x:424,y:299},{x:471,y:332},
            {x:478,y:427},{x:399,y:425},{x:504,y:369},{x:445,y:383},{x:500,y:294},
            {x:437,y:350},{x:442,y:517},{x:486,y:544},{x:432,y:590},{x:472,y:604},{x:534,y:436});
        this.explosionPosArray.push(arrayPos);

        //left up
        arrayPos = [];
        arrayPos.push(
            {x:386,y:279},{x:368,y:248},{x:331,y:246},{x:310,y:213},{x:281,y:236},
            {x:270,y:174},{x:236,y:196},{x:264,y:217},{x:246,y:261},{x:212,y:237},
            {x:243,y:305},{x:190,y:294},{x:126,y:309},{x:194,y:173},{x:301,y:183},{x:289,y:279});
        this.explosionPosArray.push(arrayPos);

        //left down
        arrayPos = [];
        arrayPos.push(
            {x:359,y:343},{x:340,y:323},{x:319,y:346},{x:287,y:323},{x:263,y:344},
            {x:233,y:331},{x:212,y:374},{x:180,y:347},{x:151,y:366},{x:195,y:413},
            {x:230,y:446},{x:165,y:407},{x:162,y:471},{x:125,y:509},{x:233,y:496},{x:181,y:383});
        this.explosionPosArray.push(arrayPos);

        //right up
        arrayPos = [];
        arrayPos.push(
            {x:528,y:295},{x:537,y:263},{x:574,y:264},{x:595,y:233},{x:646,y:207},
            {x:618,y:183},{x:675,y:193},{x:669,y:228},{x:648,y:255},{x:689,y:248},
            {x:728,y:240},{x:685,y:285},{x:663,y:306},{x:757,y:300},{x:560,y:221},{x:714,y:202});
        this.explosionPosArray.push(arrayPos);

        //right down
        arrayPos = [];
        arrayPos.push(
            {x:569,y:350},{x:598,y:332},{x:635,y:347},{x:553,y:340},{x:652,y:320},
            {x:676,y:343},{x:697,y:386},{x:704,y:324},{x:741,y:295},{x:733,y:337},
            {x:735,y:379},{x:770,y:355},{x:764,y:430},{x:698,y:446},{x:739,y:442},{x:657,y:510});
        this.explosionPosArray.push(arrayPos);

        var frames = [];
        for(var i=0; i<64; i++)
        {
            frames.push( i );
        }
        for(var k=0; k<16; k++ )
        {
            this.animExpSmall.push( new ig.Animation( this.animSheetExpSmall, 0.01, frames, false ) );
            this.animExpBig.push( new ig.Animation( this.animSheetExpBig, 0.01, frames, false ) );
            this.animExpCurrent.push( null );
        }

        if( !ig.gui.element.action('getByName', 'BOSS_Button_Close') )
        {
            ig.gui.element.add({
                name: 'BOSS_Button_Close',
                group: 'Group_BOSS',
                size: { x: 36, y: 37 },
                pos: { x: 900, y: 58 },
                state: {
                    normal: { image: new ig.Image('media/UI/QA_btn_leave.png') },
                    hover: { image: new ig.Image('media/UI/QA_btn_leave_hover.png') }
                },
                click: function() {
                    ig.game.getEntitiesByType(EntityBossFight)[0].exitBossFight();
                }
            });
            ig.gui.element.action('hide', 'BOSS_Button_Close');
        }


        this.firstRun = 0;
        this.stateInterface = 'closed';

        ig.game.spawnEntity(EntityProblemtrigger, 230 + ig.game.screen.x, 200 + ig.game.screen.y, {name: 'q19', distance: -1, key: 1, eventID: 50}); // body top left
        ig.game.spawnEntity(EntityProblemtrigger, 250 + ig.game.screen.x, 631 + ig.game.screen.y, {name: 'q20', distance: -1, key: 1, eventID: 50}); // body bottom left
        ig.game.spawnEntity(EntityProblemtrigger, 755 + ig.game.screen.x, 195 + ig.game.screen.y, {name: 'q21', distance: -1, key: 1, eventID: 50}); // body top right
        ig.game.spawnEntity(EntityProblemtrigger, 800 + ig.game.screen.x, 625 + ig.game.screen.y, {name: 'q22', distance: -1, key: 1, eventID: 50}); // body bottom right
        ig.game.spawnEntity(EntityProblemtrigger, 539 + ig.game.screen.x, 150 + ig.game.screen.y, {name: 'q23', distance: -1, key: 1, eventID: 50}); // body part middle
        q1 = ig.game.getEntityByName('q19');
        q2 = ig.game.getEntityByName('q20');
        q3 = ig.game.getEntityByName('q21');
        q4 = ig.game.getEntityByName('q22');
        q5 = ig.game.getEntityByName('q23');

    },

    update: function(){

        if( this.isSuspended )
            return;

        if (this.deathTimer && this.deathTimer.delta() > 0) {
            ig.game.spawnEntity(EntityEventTrigger, ig.game.player.pos.x, ig.game.player.pos.y, {eventID: 13});
            q1.kill();
            q2.kill();
            q3.kill();
            q4.kill();
            q5.kill();
            ig.game.getEntitiesByType('EntityBossFight')[0].kill();
        }
        if(ig.input.pressed('up'))
        {
            //console.trace('enterboss fight');
            this.enterBossFight();
        }
        if(ig.input.pressed('down'))
        {
            this.exitBossFight();
        }

        if( ig.input.pressed('zero') )
            this.destroyBodyParts( 0 );
        if( ig.input.pressed('one') )
            this.destroyBodyParts( 1 );
        if( ig.input.pressed('two') )
            this.destroyBodyParts( 2 );
        if( ig.input.pressed('three') )
            this.destroyBodyParts( 3 );
        if( ig.input.pressed('four') )
            this.destroyBodyParts( 4 );

        q1.pos = {x: 230 + ig.game.screen.x, y: 200 + ig.game.screen.y};
        q2.pos = {x: 250 + ig.game.screen.x, y: 631 + ig.game.screen.y};
        q3.pos = {x: 755 + ig.game.screen.x, y: 195 + ig.game.screen.y};
        q4.pos = {x: 800 + ig.game.screen.x, y: 625 + ig.game.screen.y};
        q5.pos = {x: 539 + ig.game.screen.x, y: 150 + ig.game.screen.y};



        this.parent();
        var qaInterface = ig.game.getEntitiesByType('EntityQuestions')[0];
        if (!qaInterface.isActive) {
            if (q1.solved && q1.eventTriggered && this.stateBodyParts[1] == 'alive') {
                this.destroyBodyParts(1);
                q1.problemTriggerLock = true;
            }
            else if (q1.solved && this.stateBodyParts[1] == 'dead') {
                q1.problemTriggerLock = true;
            }
            if (q2.solved && q2.eventTriggered && this.stateBodyParts[2] == 'alive') {
                this.destroyBodyParts(2);
                q2.problemTriggerLock = true;
            }
            else if (q2.solved && this.stateBodyParts[2] == 'dead') {
                q2.problemTriggerLock = true;
            }
            if (q3.solved && q3.eventTriggered && this.stateBodyParts[3] == 'alive') {
                this.destroyBodyParts(3);
                q3.problemTriggerLock = true;
            }
            else if (q3.solved && this.stateBodyParts[3] == 'dead') {
                q3.problemTriggerLock = true;
            }
            if (q4.solved && q4.eventTriggered && this.stateBodyParts[4] == 'alive') {
                this.destroyBodyParts(4);
                q4.problemTriggerLock = true;
            }
            else if (q4.solved && this.stateBodyParts[4] == 'dead') {
                q4.problemTriggerLock = true;
            }
            if (q5.solved && q5.eventTriggered &&this.stateBodyParts[0] == 'alive') {
                this.destroyBodyParts(0);
                q5.problemTriggerLock = true;
            }
            else if (q5.solved && this.stateBodyParts[0] == 'dead') {
                q5.problemTriggerLock = true;
            }
        }

        if( this.shakeTimer < this.shakeTimerMax )
        {
            this.shakeTimer ++;
            this.shakeX = 2*this.shakeIntensity*Math.random() - this.shakeIntensity;
            this.shakeY = 2*this.shakeIntensity*Math.random() - this.shakeIntensity;
        }
        else
        {
            this.shakeX = 0;
            this.shakeY = 0;

        }
        switch( this.stateInterface )
        {
            case 'closed':
                break;
            case 'idle':

                for( var i = 4; i >= 0; i-- )
                {
                    switch( this.stateBodyParts[i] )
                    {
                        case 'alive':

                            break;
                        case 'exploding':
                            if( this.explodeFrameTimer < this.explodeFrameTimerMax )
                            {
                                this.explodeFrameTimer ++;

                                if( this.explodeFrameTimer >= this.explodeFrameTimerMax - 30 )
                                    return;
                                if( this.explodeIntervalTimer < this.explodeInterval )
                                    this.explodeIntervalTimer ++;
                                else
                                {
                                    this.explodeIntervalTimer = 0;
                                    //spawn explosion
                                    for(var c = 0; c < this.explodeCount; c++)
                                    {
                                        var index = Math.floor( 16*Math.random() );

                                        var retryCount = 0;
                                        while( this.animExpCurrent[index] != null && retryCount < 5 )
                                        {
                                            index = Math.floor( 16*Math.random() );
                                            retryCount++;
                                        }
                                        if( Math.random() < this.explodeRate )
                                            this.animExpCurrent[index] = this.animExpSmall[index];
                                        else
                                            this.animExpCurrent[index] = this.animExpBig[index];
                                        //console.trace(index);
                                        this.animExpCurrent[index].gotoFrame(0);
                                    }
                                }
                            }
                            else
                            {
                                this.stateBodyParts[i] = 'dead';
                                for(var c = 0; c < 16; c++)
                                {
                                    if( this.animExpCurrent[c] != null )
                                    {
                                        this.animExpCurrent[c].rewind();
                                        this.animExpCurrent[c] = null;
                                    }
                                }

                                if( this.damage >= 3 )
                                    this.stateInterface = 'closed';
                            }
                            break;
                        case 'dead':
                            break;
                        default:
                            break;
                    }
                }

                break;
            default:
                break;
        }


    },

    draw: function(){

        if( this.firstRun < 4 )
        {
            this.animBG.draw( 0, 0 );
            this.animBody.update();
            this.animBody.draw( 0, 0);
            this.animLegs[0].draw( 0, 0);
            this.animLegs[1].draw( 0, 0);
            this.animLegs[2].draw( 0, 0);
            this.animLegs[3].draw( 0, 0);
            this.animLegs[0].update();
            this.animLegs[1].update();
            this.animLegs[2].update();
            this.animLegs[3].update();
            this.firstRun ++;
        }

        this.parent();
        switch( this.stateInterface )
        {
            case 'closed':
                break;
            case 'idle':
                //quick and dirty fix of UI remaining when this interface is open
                ig.game.inGameGUIController.toggleUI( false );
                
                this.animBG.draw( 0, 0 );

                for( var i = 4; i >= 0; i-- )
                {
                    switch( this.stateBodyParts[i] )
                    {
                        case 'alive':
                            switch ( i )
                            {
                                case 0:
                                    this.animBody.update();
                                    this.animBody.draw( 362+this.shakeX, 200+this.shakeY );
                                    break;
                                case 1:
                                    this.animLegs[0].update();
                                    this.animLegs[0].draw( 110+this.shakeX, 210+this.shakeY );
                                    break;
                                case 2:
                                    this.animLegs[1].update();
                                    this.animLegs[1].draw( 100+this.shakeX, 320+this.shakeY );
                                    break;
                                case 3:
                                    this.animLegs[2].update();
                                    this.animLegs[2].draw( 480+this.shakeX, 210+this.shakeY );
                                    break;
                                case 4:
                                    this.animLegs[3].update();
                                    this.animLegs[3].draw( 490+this.shakeX, 320+this.shakeY );
                                    break;
                                default:
                                    break;
                            }
                            break;
                        case 'exploding':
                            switch ( i )
                            {
                                case 0:

                                    //this.animBody.update();
                                    if( this.animBody.alpha > 0.005 )
                                        this.animBody.alpha -= 0.005;
                                    else
                                        this.animBody.alpha = 0;
                                    this.animBody.draw( 362+this.shakeX, 200+this.shakeY );

                                    break;
                                case 1:
                                    //this.animLegs[0].update();
                                    if( this.animLegs[0].alpha > 0.01 )
                                        this.animLegs[0].alpha -= 0.01;
                                    else
                                        this.animLegs[0].alpha = 0;
                                    this.animLegs[0].draw( 110+this.shakeX, 210+this.shakeY );
                                    break;
                                case 2:
                                    //this.animLegs[1].update();
                                    if( this.animLegs[1].alpha > 0.01 )
                                        this.animLegs[1].alpha -= 0.01;
                                    else
                                        this.animLegs[1].alpha = 0;
                                    this.animLegs[1].draw( 100+this.shakeX, 320+this.shakeY );
                                    break;
                                case 3:
                                    //this.animLegs[2].update();
                                    if( this.animLegs[2].alpha > 0.01 )
                                        this.animLegs[2].alpha -= 0.01;
                                    else
                                        this.animLegs[2].alpha = 0;
                                    this.animLegs[2].draw( 480+this.shakeX, 210+this.shakeY );
                                    break;
                                case 4:
                                    //this.animLegs[3].update();
                                    if( this.animLegs[3].alpha > 0.01 )
                                        this.animLegs[3].alpha -= 0.01;
                                    else
                                        this.animLegs[3].alpha = 0;
                                    this.animLegs[3].draw( 490+this.shakeX, 320+this.shakeY );
                                    break;
                                default:
                                    break;
                            }
                            //update explosion
                            for(var c = 0; c < 16; c++)
                            {
                                if( this.animExpCurrent[c] != null )
                                {
                                    this.animExpCurrent[c].update();
                                    this.animExpCurrent[c].draw( this.explosionPosArray[i][c].x, this.explosionPosArray[i][c].y );

                                    if( this.animExpCurrent[c].loopCount >= 1 )
                                    {
                                        this.animExpCurrent[c].rewind();
                                        this.animExpCurrent[c] = null;
                                    }
                                }
                            }
                            if( this.damage >= 3) {
                                this.screenFader.draw();
                                if (this.stateBodyParts[0] == 'alive') {
                                    this.destroyBodyParts(0);
                                }
                                this.deathTimer = new ig.Timer();
                                this.deathTimer.set(1);
                            }
                            break;
                        case 'dead':
                            break;
                        default:
                            break;
                    }
                }

                break;
            default:
                break;
        }



    },

    enterBossFight: function() {
        if (this.stateBodyParts[0] == 'dead') {
            return;
        }

        if (this.stateBodyParts[1] == 'alive') {
            q1.unlock();
            q1.problemTriggerLock = false;
        }
        else {
            q1.problemTriggerLock = true;
        }
        if (this.stateBodyParts[2]  == 'alive') {
            q2.unlock();
            q1.problemTriggerLock = false;
        }
        else {
            q2.problemTriggerLock = true;
        }
        if (this.stateBodyParts[3]  == 'alive') {
            q3.unlock();
            q3.problemTriggerLock = false;
        }
        else {
            q3.problemTriggerLock = true;
        }
        if (this.stateBodyParts[4]  == 'alive') {
            q4.unlock();
            q4.problemTriggerLock = false;
        }
        else {
            q4.problemTriggerLock = true;
        }

        if (ig.game.getEntitiesByType('EntityQuestionController')[0].isSolved(2, 19, 22)) {
            if (!ig.game.getEntitiesByType(EntityQuestions)[0].isActive) {
                q5.unlock();
            }
        }
        this.stateInterface = 'idle';

        ig.game.player.setDestination(ig.game.player.pos.x, ig.game.player.pos.y + 50);
        ig.game.player.orientation = 'down';
        ig.game.toggleUIPlayerInteraction(false);
        ig.gui.element.action('show', 'BOSS_Button_Close');
    },

    exitBossFight: function(){

        this.stateInterface = 'closed';

        console.log("Exit boss fight");
        for( var i = 4; i >= 0; i-- )
        {
            if( this.stateBodyParts[i] == 'exploding' )
                this.stateBodyParts[i] = 'dead';
        }

        ig.game.toggleUIPlayerInteraction(true);
        q1.problemTriggerLock = true;
        q2.problemTriggerLock = true;
        q3.problemTriggerLock = true;
        q4.problemTriggerLock = true;
        q5.problemTriggerLock = true;

        ig.gui.element.action('hide', 'BOSS_Button_Close');

    },

    //0 body, 1 upleft, 2 downleft, 3 upright, 4 downright
    destroyBodyParts: function( num ){

        if( num > 4 || num <0 )
            return;
        this.damage++;
        console.log(this.damage);
        if( this.stateBodyParts[num] == 'alive' )
        {

            this.stateBodyParts[num] = 'exploding';
            this.explodeIntervalTimer = 0;
            if( this.damage >= 3)
            {
                ig.gui.element.action('hide', 'BOSS_Button_Close');
                this.explodeFrameTimer = -200;
                this.shakeBody( 8, this.explodeFrameTimerMax-20+200 );

                this.screenFader = new ig.ScreenFader({
                    color: { r: 250, g: 250, b: 255, a: 1 },
                    fade: 'in',
                    speed: 0.5,
                    delayBefore: 1.0});
                q1.problemTriggerLock = true;
                q2.problemTriggerLock = true;
                q3.problemTriggerLock = true;
                q4.problemTriggerLock = true;
                q5.problemTriggerLock = true;
                ig.game.toggleUIPlayerInteraction(true);
                ig.game.getEntitiesByType('EntityBoss')[0].stateAnimation = 'dead';
            }
            else
            {
                this.explodeFrameTimer = 0;
                this.shakeBody( 3, this.explodeFrameTimerMax-20 );
            }

        }
        if (q5.locked && ig.game.getEntitiesByType('EntityQuestionController')[0].isSolved(2, 19, 22)) {
            if (!ig.game.getEntitiesByType(EntityQuestions)[0].isActive) {
                q5.unlock();
            }
        }
    },

    shakeBody: function( intensity, time ){

        this.shakeTimer = 0;
        this.shakeTimerMax = time;
        this.shakeIntensity = intensity;
    }
});
});