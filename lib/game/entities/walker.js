ig.module( 
    'game.entities.walker'
)
.requires(
    'impact.entity',
    'game.classes.astar'
)
.defines(function(){

/*
 Walker is an in-game character class with movement (pathfinding) ability.
 */
EntityWalker = ig.Entity.extend({

    size: { x: 25, y: 25 },

    grid: null,
    astar: null,
    speed: 120,
    orientation: 'down',
    path: [],
    node: null,
    nodeSize: 0,
    state: 'stop', //stop: no destination request, walk: moving towards destination, stay: has destinations queued up but in stay time
    destinationQueue: [],
    pacingDestinationQueue: [],
    isPacing: false,
    hasReachedDestination: false,
    paceDestinationIndex: 0,

    init: function( x, y, settings ) {

        this.grid = new Grid();
        this.astar = new AStar();
        this.nodeSize = ig.game.collisionMap.tilesize;
        this.parent( x, y, settings );

    },

    setSpeed: function( spd ) {

        this.speed = spd;
    },

    _gotoDestination: function( x, y ) {

        this.path = this.astar.searchPath(
            this.grid.getNodeByPosition( this.pos.x + this.size.x/2, this.pos.y + this.size.y/2 ),
            this.grid.getNodeByPosition( x, y ),
            this.grid );

        //this.debugPrintPath( this.path );
        if( this.path != undefined && this.path.length > 1 )
        {
            //console.trace( this.path.length );
            this.path.pop();//remove the last node which is the current node
            this.node = this.path.pop();
            //console.trace( "heading to" + this.node.x + "," + this.node.y  );
            var angle = Math.atan2(
                this.node.y * this.nodeSize - this.pos.y,
                this.node.x * this.nodeSize - this.pos.x );
            this.vel.x = this.speed * Math.cos( angle );
            this.vel.y = this.speed * Math.sin( angle );

            this.state = 'walk';
            return true;
        }
        else if( this.path != undefined && this.path.length == 1 )//which mean start and end are the same
        {
            this.state = 'stay';
            return true;
        }
        else
        {
            return false;
        }
    },

    setDestination: function( x, y ){
        this.stop();
        this.destinationQueue = [];
        this.destinationQueue.push( {x:x, y:y, stay:0} );

        return this._gotoDestination( x, y);
    },

    addDestination: function( x, y, stay ){
        this.destinationQueue.push( {x:x, y:y, stay:stay} );
    },

    addPacingDestination: function( x, y, stay ){
        this.pacingDestinationQueue.push( {x:x, y:y, stay:stay, remain:stay} );
    },

    startPacing: function(){
        this.isPacing = true;
        this.paceDestinationIndex = 0;
    },

    stopPacing: function(){
        this.isPacing = false;
        this.path = [];
        this.node = null;
        this.vel.x = 0;
        this.vel.y = 0;
        this.state = 'stop';
    },

    stop: function( ){

        this.path = [];
        this.destinationQueue = [];
        this.pacingDestinationQueue = [];
        this.node = null;
        this.vel.x = 0;
        this.vel.y = 0;

        this.state = 'stop';
    },


    update: function() {

        this.zIndex = this.pos.y;

        if( this.state == 'stop' )
        {
            this.hasReachedDestination = true;
            if( this.isPacing == true )
            {
                //try to process the next destination of pacing
                if( this.pacingDestinationQueue.length > 0 )
                    this._gotoDestination( this.pacingDestinationQueue[0].x, this.pacingDestinationQueue[0].y);
            }
            else
            {
                //try to process the next destination
                if( this.destinationQueue.length > 0 )
                    this._gotoDestination( this.destinationQueue[0].x, this.destinationQueue[0].y);
                //otherwise remain stop
            }
        }
        else if( this.state == 'stay' )
        {
            this.hasReachedDestination = true;
            //console.trace( this.name );
            if( this.isPacing == true )
            {
                if( this.pacingDestinationQueue.length <= 0 )
                    return;
                if( this.pacingDestinationQueue[this.paceDestinationIndex].remain <= 0 )
                {
                    this.paceDestinationIndex = (this.paceDestinationIndex+1)%this.pacingDestinationQueue.length;
                    var jsonQueueDes = this.pacingDestinationQueue[this.paceDestinationIndex];
                    jsonQueueDes.remain = jsonQueueDes.stay;
                    this._gotoDestination(
                        jsonQueueDes.x,
                        jsonQueueDes.y);
                }
                else
                    this.pacingDestinationQueue[this.paceDestinationIndex].remain -= ig.system.tick;
            }
            else
            {
                if( this.destinationQueue[0].stay <= 0 )
                {
                    this.destinationQueue.shift();
                    if( this.destinationQueue.length > 0 )
                        this._gotoDestination( this.destinationQueue[0].x, this.destinationQueue[0].y);
                    else
                        this.state = 'stop';
                }
                else
                    this.destinationQueue[0].stay -= ig.system.tick;
            }

        }
        else if( this.state == 'walk' )
        {
            this.hasReachedDestination = false;
            //update while there is a target node
            if( this.node != null )
            {
                //find next node on the path when this reached the current node
                if( this.grid.hasReachedNode(  this.pos.x, this.pos.y, this.node.x, this.node.y ) == true )
                {
                    if( this.path.length > 0 )
                    {
                        this.node = this.path.pop();
                    }
                    else
                    {
                        this.node = null;
                        this.vel.x = 0;
                        this.vel.y = 0;
                        /*if( this.isPacing == true )
                        {
                            if( this.pacingDestinationQueue.length >= 2 )
                                this.state = 'stay';
                            else
                                this.state = 'stop';
                        }
                        else
                        {
                            if( this.destinationQueue.length >= 2 )
                                this.state = 'stay';
                            else
                                this.state = 'stop';
                        }*/
                        this.state = 'stay';
                    }
                }
                else
                {
                    var angle = Math.atan2(
                        this.node.y * this.nodeSize - this.pos.y,
                        this.node.x * this.nodeSize - this.pos.x );
                    this.vel.x = this.speed * Math.cos( angle );
                    this.vel.y = this.speed * Math.sin( angle ) * 0.7;

                    //update orientation
                    var angle360 = angle * 180 / Math.PI;

                    if( angle360 <= -22.5 && angle360 > -67.5 )
                        this.orientation = 'up-right';
                    else if( angle360 <= -67.5 && angle360 > -112.5 )
                        this.orientation = 'up';
                    else if( angle360 <= -112.5 && angle360 > -157.5 )
                        this.orientation = 'up-left';
                    else if( angle360 <= -157.5 || angle360 > 157.5 )
                        this.orientation = 'left';
                    else if( angle360 <= 157.5 && angle360 > 112.5 )
                        this.orientation = 'down-left';
                    else if( angle360 <= 112.5 && angle360 > 67.5 )
                        this.orientation = 'down';
                    else if( angle360 <= 67.5 && angle360 > 22.5 )
                        this.orientation = 'down-right';
                    else
                        this.orientation = 'right';

                }

            }
        }


        this.parent();
    },

    debugPrintPath: function( path ) {

        for( var i = 0; i < path.length; i++ )
        {
            console.trace( path[i].x + ":::" + path[i].y );
        }
    }

});

});