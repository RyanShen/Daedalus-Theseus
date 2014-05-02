ig.module( 
    'game.entities.dialog-box'
)
.requires(
    'impact.entity',
    'impact.font',

    'game.entities.dialog-figure'
)
.defines(function(){

EntityDialogBox = ig.Entity.extend({

    size: { x: 620, y: 170 },
    textPoolArray: [],
    textCurrent: '',
    _indexArray: 0,
    _indexChar: 0,
    paddingX: 0,
    paddingY: 0,
    lineWidthMax: 230,
    _lineWidthCurrent: 0,
    lineCountMax: 4,
    _lineCountCurrent: 1,
    font: 'Calibri',
    fontSize: 32,
    fontColor:[1,255,1],
    lineSpace: 0.5,
    printInterval: 0.01,
    _timer: 0,
    _paused: false,
    _finished: true,
    _drawFinished: true, //used for drawing content to remain on screen for one extra frame to avoid blinking effect caused by entity auto-sorting
    _autoProgressTimer: 0,
    _autoProgressMax: 0,
    _autoProgressing: false,
    zIndex: 2000,
    isSuspended: false,

    _context: null,

    firstRun: 0,

    collides: ig.Entity.COLLIDES.NONE,

    init: function(x, y, settings) {

        this.parent(x, y, settings);

        this._context = ig.system.context;
        this.font = new ig.Font( 'media/Fonts/dialog_text.png' );
        var animSheet = new ig.AnimationSheet( 'media/dialogbox.png', this.size.x, this.size.y );
        this.anim = new ig.Animation( animSheet, 0.1, [0] );

        if ( !(this.font instanceof ig.Font) )
            this._context.font = this.fontSize + 'px ' + this.font;

        if ( !(this.fontColor instanceof Array) )
           this.fontColor = this.hexToRgb(this.fontColor);

    },

    setSide: function( side ) {

        if( side == 'left' )
        {
            this.paddingX = 95;
            this.paddingY = 64;
            this.lineWidthMax = 320;
        }
        else if( side == 'right' )
        {
            this.paddingX = 55;
            this.paddingY = 64;
            this.lineWidthMax = 280;
        }
        else
        {
            this.paddingX = 55;
            this.paddingY = 35;
            this.lineWidthMax = 200;
        }

    },

    update: function() {

        if( this.isSuspended )
            return;


        if( this._finished )
            return;

        if( this._paused )
        {
            if( this._autoProgressing )
            {
                this._autoProgressTimer += ig.system.tick;
                if( this._autoProgressTimer >= this._autoProgressMax )
                {
                    this._autoProgressTimer = 0;
                    this._autoProgressing = false;
                    this.resume();
                }
            }

            if( ig.input.pressed("space") || ig.input.pressed( "leftclick" ) )
                this.resume();

            return;
        }
        else
        {
            if( ig.input.pressed("space") || ig.input.pressed( "leftclick" ) )
            {
                //show all content til reach the max line count
                while( true )
                {
                    if( this._indexChar >= this.textPoolArray[this._indexArray].length )
                    {
                        //get next word
                        this._indexArray++;
                        if( this._indexArray < this.textPoolArray.length )
                        {
                            this.textCurrent += ' ';
                            this._lineWidthCurrent += this._context.measureText( this.textPoolArray[this._indexArray]).width;
                            if( this._lineWidthCurrent > this.lineWidthMax )
                            {
                                //line break or clear all text
                                if( this._lineCountCurrent >= this.lineCountMax )
                                {
                                    this.pause();
                                    return;
                                }
                                else
                                {
                                    this.textCurrent += '\n';
                                    this._lineCountCurrent ++;
                                }

                                this._lineWidthCurrent = this._context.measureText( this.textPoolArray[this._indexArray] + ' ').width;
                            }

                            this._lineWidthCurrent += this._context.measureText(' ').width;
                            this._indexChar = 0;
                        }
                        else
                        {
                            this.pause();
                            return;
                        }
                    }

                    //type in one character everytime timer ticks
                    this.textCurrent += this.textPoolArray[this._indexArray][this._indexChar];
                    this._indexChar++;
                }

            }
        }


        if( this._timer >= this.printInterval )
        {
            this._timer = 0;

            if( this._indexArray >= this.textPoolArray.length - 1 )
            {
               // console.trace('11');
            }
            if( this._indexChar < this.textPoolArray[this._indexArray].length )
            {
                //type in one character everytime timer ticks
                this.textCurrent += this.textPoolArray[this._indexArray][this._indexChar];
                this._indexChar++;
            }
            else
            {
                //get next word
                this._indexArray++;
                if( this._indexArray < this.textPoolArray.length )
                {
                    this.textCurrent += ' ';
                    this._lineWidthCurrent += this._context.measureText( this.textPoolArray[this._indexArray]).width;
                    if( this._lineWidthCurrent > this.lineWidthMax )
                    {
                        //line break or clear all text
                        if( this._lineCountCurrent >= this.lineCountMax )
                        {
                            this.pause();
                            return;
                        }
                        else
                        {
                            this.textCurrent += '\n';
                            this._lineCountCurrent ++;
                        }

                        this._lineWidthCurrent = this._context.measureText( this.textPoolArray[this._indexArray] + ' ').width;
                    }

                    this._lineWidthCurrent += this._context.measureText(' ').width;
                    this._indexChar = 0;
                }
                else
                {

                    this.pause();
                    return;
                }
            }
        }
        else
        {
            this._timer += ig.system.tick;
        }

    },

    draw: function() {

        if( this.firstRun < 10 )
        {
            //this.anim.draw( this.pos.x, this.pos.y);
            this.firstRun ++;
        }

        if( this._finished )
        {
            if( this._drawFinished )
                return;
            else
                this._drawFinished = true;
        }

        this.anim.draw( this.pos.x, this.pos.y );
        this._context.save();

        if ( !(this.font instanceof ig.Font) )
        {
            this._context.textAlign = 'left';
            this._context.fillStyle = 'rgb(' + this.fontColor[0] + ',' + this.fontColor[1] + ',' + this.fontColor[2] + ')';

            this._context.fillText( this.textCurrent,
                this.pos.x + this.paddingX,
                this.pos.y + this.paddingY);
            this._context.restore();

        }
        else
        {
            this._context.restore();
            this.font.draw( this.textCurrent,
                this.pos.x + this.paddingX,
                this.pos.y + this.paddingY );
        }
    },

    hexToRgb: function( hex ) {
        var parseHex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return [parseInt(parseHex[1], 16),parseInt(parseHex[2], 16),parseInt(parseHex[3], 16)];
    },

    /* Method to calculate the height of text on canvas by "ellisbben" from
     http://stackoverflow.com/questions/1134586/how-can-you-find-the-height-of-text-on-an-html-canvas
     */

    determineFontHeight: function() {
        var body = document.getElementsByTagName("body")[0];
        var dummy = document.createElement("div");
        var dummyText = document.createTextNode(this.text);
        dummy.appendChild(dummyText);
        dummy.setAttribute("style", 'font-family:' + this.font + ';font-size:' + this.fontSize + 'px');
        body.appendChild(dummy);
        var result = dummy.offsetHeight;
        body.removeChild(dummy);
        return result;
    },

    playSingleDialog: function( side, name, text, autoprogress ) {

        this.start();
        this.setSide( side );
        this._lineCountCurrent = 1;
        this._indexArray = 0;
        this._indexChar = 0;
        this._lineWidthCurrent = 0;
        this._timer = 0;
        this.textCurrent = '';
        this.textPoolArray = text.split( ' ' );

        this._autoProgressMax = autoprogress;
        this._autoProgressTimer = 0;

    },

    pause: function() {

        this._paused = true;

        if( this._autoProgressMax > 0 )
        {
            this._autoProgressTimer = 0;
            this._autoProgressing = true;
        }
        //console.trace('pause');
    },

    resume: function(){

        if( this._indexArray >= this.textPoolArray.length )
        {
            this.finish();
            //console.trace('finish');
        }
        else
        {
            this._paused = false;
            if( this._lineCountCurrent >= this.lineCountMax )
            {
                this.textCurrent = '';
                this._lineCountCurrent = 1;
                this._lineWidthCurrent = 0;
                this._indexChar = 0;
                this.textCurrent += ' ';

                this.textCurrent += this.textPoolArray[this._indexArray][this._indexChar];
                this._indexChar++;
            }
            //console.trace('resume');
        }

    },

    start: function()
    {
        this._finished = false;
        this._paused = false;
        this._drawFinished = false;
    },

    finish: function()
    {
        this._finished = true;
    }


});

});