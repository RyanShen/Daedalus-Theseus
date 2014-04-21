ig.module( 
    'game.entities.bossPlatform'
)
.requires(
    'impact.entity',
    'game.entities.boss'
)
.defines(function(){

EntityBossPlatform = ig.Entity.extend({

    pos:{x:0,y:0},
    zIndex: 100,
    state: 'closed', //closed: initial state, opening: boss appearing
    bossPosOffset: {x:-10,y:-80},
    boss: null,

    posXDoorLeft: 0,
    posXDoorLeftOrigin: 709,
    posXDoorRight: 0,
    posXDoorRightOrigin: 801,
    posYDoorOrigin: 306,
    posYPlatform: 0,
    posYPlatformOrigin: 506,
    alphaLaser: 0,
    alphaGlow: 0,

    //media
    animSheetDoor: new ig.AnimationSheet('media/Level Art Assets/BossPlatform/platform_door.png', 92, 122 ),
    animSheetPlatform: new ig.AnimationSheet('media/Level Art Assets/BossPlatform/platform_door.png', 184, 122 ),
    animSheetLaser: new ig.AnimationSheet('media/Level Art Assets/BossPlatform/platform_laser.png', 888, 262 ),
    animSheetGlow: new ig.AnimationSheet('media/Level Art Assets/BossPlatform/platform_glow.png', 513, 894 ),
    animSheetOverlay: new ig.AnimationSheet('media/Level Art Assets/BossPlatform/Level3_platform_overlay.jpg', 1600, 1600 ),

    imgMaskBack: new ig.Image('media/Level Art Assets/BossPlatform/platform_mask_back.png'),
    imgMaskFront: new ig.Image('media/Level Art Assets/BossPlatform/platform_mask_front.png'),

    animDoorLeft: null,
    animDoorRight: null,
    animPlatform: null,
    animLaser: null,
    animGlow: null,
    animOverlay: null,

    //screen flash
    timesRemain: 0,
    timePeriod: 0,
    alphaOverlay: 0,
    timerOverlay: 0,

    isSuspended: false,

    firstRun: 0,

    init: function(x,y,settings){

        this.parent(this.pos.x, this.pos.y, settings);

        this.animDoorLeft = new ig.Animation( this.animSheetDoor, 1, [0], true );
        this.animDoorRight = new ig.Animation( this.animSheetDoor, 1, [1], true );
        this.animPlatform = new ig.Animation( this.animSheetPlatform, 1, [0], true );
        this.animLaser = new ig.Animation( this.animSheetLaser, 1, [0], true );
        this.animGlow = new ig.Animation( this.animSheetGlow, 1, [0], true );
        this.animOverlay = new ig.Animation( this.animSheetOverlay, 1, [0], true );

        this.firstRun = 0;
        this.state = 'closed';
    },

    update: function(){

        if( this.isSuspended )
            return;

        switch( this.state )
        {
            case 'closed':

                if( this.alphaGlow > 0.015 )
                    this.alphaGlow -= 0.015;
                else
                    this.alphaGlow = 0;

                if( this.alphaLaser > 0.02 )
                    this.alphaLaser *= 0.9;
                else
                    this.alphaLaser = 0;


                this.animLaser.alpha = this.alphaLaser;

                this.animGlow.alpha = this.alphaGlow;


                break;
            case 'opening':
                if( this.alphaLaser < 5.0 )
                {
                    this.alphaLaser *= 1.1;
                    if( this.animLaser.alpha > 1 )
                    {
                        this.animLaser.alpha = 1 + Math.random()*0.4 - 0.2;
                    }
                    else
                    {
                        this.animLaser.alpha = this.animLaser.alpha + Math.random()*0.1;
                    }

                }
                else
                {
                    this.animLaser.alpha = 1.0 + Math.random()*0.4 - 0.2;
                    if( this.posXDoorLeftOrigin - this.posXDoorLeft <= 30 )
                    {
                        this.posXDoorLeft -= 0.5;
                        this.posXDoorRight += 0.5;
                    }
                    else if( this.posXDoorLeftOrigin - this.posXDoorLeft <= 100 )
                    {
                        this.posXDoorLeft -= 0.5;
                        this.posXDoorRight += 0.5;
                        this.posYPlatform -= 0.5;
                    }
                    else if( this.posYPlatform > this.posYDoorOrigin )
                    {
                        this.posYPlatform -= 0.5;
                        if( this.posYPlatform - this.posYDoorOrigin > 0.01 )
                        {
                            this.alphaGlow = 0;
                        }
                        else
                        {
                            this.alphaGlow = (0.01 - this.posYPlatform + this.posYDoorOrigin)*100;
                        }
                    }
                    else
                    {
                        this.state = 'closed';
                        ig.game.screenShaker.applyImpulse(0, 100);
                        this.boss.zIndex = this.boss.pos.y;
                        this.boss.activate();
                    }
                }



                //boss
                this.boss.pos.y = this.posYPlatform + this.bossPosOffset.y;

                this.animGlow.alpha = this.alphaGlow;


                break;
            default:
                break;
        }

        if( this.alphaOverlay > 0.05 )
        {
            this.alphaOverlay /= 2;
        }
        else
        {
            this.alphaOverlay = 0;
        }

        if( this.timerOverlay < this.timePeriod )
            this.timerOverlay += ig.system.tick;
        else
        {
            this.timerOverlay = 0;
            if( this.timesRemain > 0 )
            {
                this.timesRemain --;
                this.alphaOverlay = 1;
            }
        }
        this.animOverlay.alpha = this.alphaOverlay;
    },

    draw: function(){

        if( this.firstRun < 6 )
        {
            this.animOverlay.alpha = 1;
            this.animOverlay.draw( 0, 0);
            this.animLaser.draw( 0, 0);
            this.animGlow.alpha = 1;
            this.animGlow.draw( 0, 0 );
            this.firstRun ++;
            if( this.firstRun >= 6 )
            {
                this.animGlow.alpha = 0;
                this.animOverlay.alpha = 0;
            }
        }

        this.parent();

        var sx = -ig.game.screen.x;
        var sy = -ig.game.screen.y;

        switch( this.state )
        {
            case 'closed':


                this.animDoorLeft.draw( this.posXDoorLeftOrigin + sx, this.posYDoorOrigin + sy );
                this.animDoorRight.draw( this.posXDoorRightOrigin + sx, this.posYDoorOrigin + sy );
                this.imgMaskBack.draw( 606 + sx, 297 +sy );
                this.animPlatform.draw( this.posXDoorLeftOrigin + sx, this.posYPlatformOrigin + sy );
                this.imgMaskFront.draw( 606 + sx, 372 + sy );

                this.animLaser.draw( 356 + sx, 550 + sy);

                this.animGlow.draw( 546 + sx, 179 + sy );

                break;
            case 'opening':

                this.animLaser.draw( 356 + sx, 550 + sy);
                this.animDoorLeft.draw( this.posXDoorLeft + sx, this.posYDoorOrigin + sy );
                this.animDoorRight.draw( this.posXDoorRight + sx, this.posYDoorOrigin + sy );
                this.imgMaskBack.draw( 606 + sx, 297 +sy );
                this.animPlatform.draw( this.posXDoorLeftOrigin + sx, this.posYPlatform + sy );


                this.boss.drawAppearing();

                this.imgMaskFront.draw( 606 + sx, 372 + sy );


                this.animGlow.draw( 546 + sx, 179 + sy );

                break;
            default:
                break;
        }

        this.animOverlay.draw( 0 + sx, 0 + sy );

    },

    playOpenAnimation: function(){

        ig.game.screenShaker.timedShake(70,0.6);
        this.overlayFlash(3,0.08);
        //ig.game.screenShaker.applyImpulse(50, 200);
        this.state = 'opening';
        this.alphaLaser = 0.01;
        this.alphaGlow = 0;
        this.posXDoorLeft = this.posXDoorLeftOrigin;
        this.posXDoorRight = this.posXDoorRightOrigin;
        this.posYPlatform = this.posYPlatformOrigin;

        //boss
        this.boss = ig.game.getEntitiesByType(EntityBoss)[0];
        if( this.boss != null )
            this.boss.reset();
        else
        {
            ig.game.spawnEntity(EntityBoss,
                this.posXDoorLeftOrigin + this.bossPosOffset.x,
                this.posYPlatform + this.bossPosOffset.y,
                'Boss');
            this.boss = ig.game.getEntitiesByType(EntityBoss)[0];
        }

        this.boss.zIndex = this.zIndex + 1;
    },

    overlayFlash: function( times, period ){

        this.timesRemain = times;
        if( times < 2 )
            this.timePeriod = 0;
        else
            this.timePeriod = period/(times-1);
    }
});
});