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

    size: { x: 830, y: 150 },
    textPoolArray: [],
    textCurrent: '',
    _indexArray: 0,
    _indexChar: 0,
    padding: 0,
    lineWidthMax: 250,
    _lineWidthCurrent: 0,
    lineCountMax: 3,
    _lineCountCurrent: 1,
    font: 'Calibri',
    fontSize: 32,
    fontColor:[1,255,1],
    lineSpace: 0.5,
    printInterval: 0.01,
    _timer: 0,
    _paused: false,
    _finished: true,
    _autoProgressTimer: 0,
    _autoProgressMax: 0,
    _autoProgressing: false,
    zIndex: 900,

    _context: null,

    collides: ig.Entity.COLLIDES.NONE,

    init: function(x, y, settings) {

        this.parent(x, y, settings);

        ig.input.bind( ig.KEY.SPACE, 'space' );
        this._context = ig.system.context;
        this.font = new ig.Font( 'media/Calibri.png' );
        var animSheet = new ig.AnimationSheet( 'media/dialogbox.png', 830, 150 );
        this.anim = new ig.Animation( animSheet, 0.1, [0] );

        if ( !(this.font instanceof ig.Font) )
            this._context.font = this.fontSize + 'px ' + this.font;

        if ( !(this.fontColor instanceof Array) )
           this.fontColor = this.hexToRgb(this.fontColor);

    },

    setSide: function( side ) {

        if( side == 'left' )
            this.padding = 200;
        else
            this.padding = 35;
    },

    update: function() {

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
                            this._lineWidthCurrent += this._context.measureText( this.textPoolArray[this._indexArray] + ' ').width;
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

                                this._lineWidthCurrent = 0;
                            }

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
                    this._lineWidthCurrent += this._context.measureText( this.textPoolArray[this._indexArray] + ' ').width;
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

                        this._lineWidthCurrent = 0;
                    }

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

        if( this._finished )
            return;

        this.anim.draw( this.pos.x, this.pos.y );
        this._context.save();

        if ( !(this.font instanceof ig.Font) )
        {
            this._context.textAlign = 'left';
            this._context.fillStyle = 'rgb(' + this.fontColor[0] + ',' + this.fontColor[1] + ',' + this.fontColor[2] + ')';

            this._context.fillText( this.textCurrent,
                this.pos.x + this.padding,
                this.pos.y + 28 );
            this._context.restore();

        }
        else
        {
            this._context.restore();
            this.font.draw( this.textCurrent,
                this.pos.x + this.padding,
                this.pos.y + 28 );
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
            console.trace('finish');
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
            console.trace('resume');
        }

    },

    start: function()
    {
        this._finished = false;
        this._paused = false;
    },

    finish: function()
    {
        this._finished = true;
    }


});

});