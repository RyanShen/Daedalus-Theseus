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
    isWalking: false,
    hasReachedDestination: false,

    init: function( x, y, settings ) {

        this.grid = new Grid();
        this.astar = new AStar();
        this.nodeSize = ig.game.collisionMap.tilesize;
        this.parent( x, y, settings );

    },

    setSpeed: function( spd ) {

        this.speed = spd;
    },

    setDestination: function( x, y ) {

        this.path = this.astar.searchPath(
            this.grid.getNodeByPosition( this.pos.x + this.size.x/2, this.pos.y + this.size.y/2 ),
            this.grid.getNodeByPosition( x, y ),
            this.grid );

        //this.debugPrintPath( this.path );
        if( this.path != undefined && this.path.length > 0 )
        {
            this.path.pop();//remove the last node which is the current node
            this.node = this.path.pop();
            //console.trace( "heading to" + this.node.x + "," + this.node.y  );
            var angle = Math.atan2(
                this.node.y * this.nodeSize - this.pos.y,
                this.node.x * this.nodeSize - this.pos.x );
            this.vel.x = this.speed * Math.cos( angle );
            this.vel.y = this.speed * Math.sin( angle );

            this.isWalking = true;
            this.hasReachedDestination = false;
            return true;
        }
        else
        {
            return false;
        }


    },


    update: function() {

        this.zIndex = this.pos.y;

        //console.trace( this.vel.x );
        //update while there is a target node
        if( this.node != null )
        {
            //find next node on the path when this reached the current node
            if( this.grid.hasReachedNode(  this.pos.x, this.pos.y, this.node.x, this.node.y ) == true )
            {
                //console.trace( "arrived" + this.node.x + "," + this.node.y  );
                if( this.path.length > 0 )
                {
                    this.node = this.path.pop();
                    //console.trace( "heading to" + this.node.x + "," + this.node.y  );
                    //console.trace( "x: " + this.vel.x + "y: " + this.vel.y );
                }
                else
                {
                    this.node = null;
                    this.vel.x = 0;
                    this.vel.y = 0;

                    this.isWalking = false;
                    this.hasReachedDestination = true;
                }
            }
            else
            {
                var angle = Math.atan2(
                    this.node.y * this.nodeSize - this.pos.y,
                    this.node.x * this.nodeSize - this.pos.x );
                this.vel.x = this.speed * Math.cos( angle );
                this.vel.y = this.speed * Math.sin( angle );

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