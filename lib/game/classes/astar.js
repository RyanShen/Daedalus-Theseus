ig.module(
    'game.classes.astar'
)
.requires(
    'impact.game'
)
.defines(function () {

        // 8 directional (vector-based) a star path finding
Node = ig.Class.extend({

    /*
     node for astar search

     */
    init: function( x, y )
    {
        this.x = x;
        this.y = y;
        this.parentNode;                //previous node
        this.g = 0;                    //cost from start to current node
        this.h = 0;                    //cost from current node to end
        this.f = 0;                    //cost from start to end going through current node
    },

    refresh: function(){
        this.parentNode = null;
        this.g = 0;
        this.h = 0;
        this.f = 0;
    }


});

Grid = ig.Class.extend({

    gridData: null,
    tileSize: 1,
    init: function(){
        this.gridData = new Array( ig.game.collisionMap.width );
        for( var x = 0; x < ig.game.collisionMap.width; x++ )
        {
            this.gridData[x] = new Array( ig.game.collisionMap.height );
            for( var y = 0; y < ig.game.collisionMap.height; y++ )
            {
                this.gridData[x][y] = new Node( x, y );
            }
        }

        this.tileSize = ig.game.collisionMap.tilesize;
    },

    refresh: function(){

        for( var x = 0; x < this.gridData.length; x++ )
        {
            for( var y = 0; y < this.gridData[x].length; y++ )
            {
                this.gridData[x][y].refresh();
            }
        }
    },

    getNodeByPosition: function( x, y ){
        //.trace( x + "::" + y );
        return this.gridData[ Math.floor(x/ig.game.collisionMap.tilesize) ][ Math.floor(y/ig.game.collisionMap.tilesize) ];
    },

    hasReachedNode: function( x, y, nodeX, nodeY ) {

        return Math.abs( x - nodeX * this.tileSize ) <= 8
                && Math.abs( y - nodeY * this.tileSize ) <= 8;
    }
});

AStar = ig.Class.extend({

    tileSize: 1,
    init: function(){

        this.tileSize = ig.game.collisionMap.tilesize;
    },

    searchPath: function( start, end, gridObj ){

        /*console.trace("pathfinding from "
            + start.x + "," + start.y + " to "
            + end.x + "," + end.y);*/

        //refresh lists and grid data for new atart search
        var openNodes = [];
        var closedNodes = [];
        gridObj.refresh();
        var grid = gridObj.gridData;

        openNodes.push( start );

        while( openNodes.length > 0 ) {

            //start next search from the node that has lowest f value in the open node list
            var lowestFIndex = 0;
            for( var i = 0; i < openNodes.length; i++ )
            {
                if( openNodes[i].f < openNodes[lowestFIndex].f )
                {
                    lowestFIndex = i;
                }
            }
            var currentNode = openNodes[lowestFIndex];

            //console.trace("currentNode " + currentNode.x + "," + currentNode.y);
            //End case:
            if( currentNode.x == end.x && currentNode.y == end.y )
            {
                var curN = currentNode;
                var path = [];
                while( curN ){
                    path.push( curN );
                    curN = curN.parentNode;
                }
                return path;//the path is a reversed node list of the path
            }

            //Normal case
            //finsh examing this node, put it from open list to close list
            openNodes.splice( openNodes.indexOf( currentNode ), 1 );
            closedNodes.push( currentNode );

            //start search its neighbors
            //we use 4 directions instead of 8, since it makes no difference under vector-based path search
            var neighborNodes = this.getNeighborNodes( currentNode, grid  );
            for( var i = 0; i< neighborNodes.length; i++ )
            {
                var neighborNode = neighborNodes[i];

                if( -1 != closedNodes.indexOf( neighborNode ) || ig.game.collisionMap.data[neighborNode.y][neighborNode.x] )
                {
                    //console.trace("currentNode " + currentNode.x + "," + currentNode.y + "skip " + neighborNode.x + "," + neighborNode.y);
                    continue;
                }

                /*the worst situation of vector-based movement is that
                there is no direct connection (not blocked by walls) between this neighbor node
                and any of currentNode's previous turn nodes, then the g is currentNode.g + 1 which
                mean it creates a new vector from currentNode to this neighbor.

                Should there be any connection between this neighbor and any previous turn nodes of currentNode,
                the smaller g will apply as the turn node appears earlier in the vector array. That is to create a
                new vector from that point (the earliest turn node in currentNode's previous turn nodes) to this
                neighbor.
                */
                var gScore = currentNode.g + 1;
                var gScoreBest = false;
                var turnNode = currentNode;
                var bestTurnNode = turnNode;

                /*
                for accuracy reason, we test 4 corners (4 size 1,1 objects) of the object for trace test
                instead of using the object ( one 32x32 objects )
                And we use -0.5 for traceDX and traceDY to avoid edge cases where a calculated float number could
                exceed the boundary of a tile. ( 32 could be 32.0001 which is larger than 32 and we want even 32
                to be exclusive because tile 1 is from 0 to 31.9999 )
                */
                //console.trace("turn node search for " + neighborNode.x + "," + neighborNode.y);
                while( turnNode.parentNode !=null )
                {
                    turnNode = turnNode.parentNode;

                    var traceX1 = turnNode.x * this.tileSize + 1;
                    var traceY1 = turnNode.y * this.tileSize + 1;
                    var traceX2 = traceX1 + this.tileSize - 2;
                    var traceY2 = traceY1 + this.tileSize - 2;

                    var traceDX = ( neighborNode.x - turnNode.x ) * this.tileSize - 0.5;
                    var traceDY = ( neighborNode.y - turnNode.y ) * this.tileSize - 0.5;
                    /*Note that we use -0.5 for traceDX and traceDY to avoid edge cases where a calculated float
                    number could exceed the boundary of a tile. ( 32 could be 32.0001 which is larger than 32
                    and we want even 32 to be exclusive because tile 1 is from 0 to 31.9999 )
                    */

                    /*console.trace("collision test from " + turnNode.x + "," + turnNode.y
                        + " to " + neighborNode.x + "," + neighborNode.y );*/

                    var cRes1 = ig.game.collisionMap.trace( traceX1, traceY1, traceDX, traceDY, 1, 1 );
                    /*console.trace("1 from " + traceX1 + "," + traceY1
                        + " to " + (traceDX + traceX1) + "," + (traceDY+traceY1) );
                    console.trace( cRes1 );*/
                    if( cRes1.collision.x || cRes1.collision.y )
                    {
                        //console.trace( "Blocked" );
                        continue;
                    }
                    var cRes2 = ig.game.collisionMap.trace( traceX1, traceY2, traceDX, traceDY, 1, 1 );
                    /*console.trace("2 from " + traceX1 + "," + traceY2
                        + " to " + (traceDX + traceX1) + "," + (traceDY+traceY2) );
                    console.trace( cRes2 );*/
                    if( cRes2.collision.x || cRes2.collision.y )
                    {
                        //console.trace( "Blocked");
                        continue;
                    }
                    var cRes3 = ig.game.collisionMap.trace( traceX2, traceY1, traceDX, traceDY, 1, 1 );
                    /*console.trace("3 from " + traceX2 + "," + traceY1
                        + " to " + (traceDX + traceX2) + "," + (traceDY+traceY1) );
                    console.trace( cRes3 );*/
                    if( cRes3.collision.x || cRes3.collision.y )
                    {
                        //console.trace( "Blocked" );
                        continue;
                    }
                    var cRes4 = ig.game.collisionMap.trace( traceX2, traceY2, traceDX, traceDY, 1, 1 );
                    /*console.trace("4 from " + traceX2 + "," + traceY2
                        + " to " + (traceDX + traceX2) + "," + (traceDY+traceY2) );
                    console.trace( cRes4 );*/
                    if( cRes4.collision.x || cRes4.collision.y )
                    {
                        //console.trace( "Blocked" );
                        continue;
                    }

                    /*var traceX = turnNode.x * this.tileSize + this.tileSize/2;
                    var traceY = turnNode.y * this.tileSize + this.tileSize/2;

                    var traceDX = ( neighborNode.x - turnNode.x ) * this.tileSize - 0.5;
                    var traceDY = ( neighborNode.y - turnNode.y ) * this.tileSize - 0.5;

                    var cRes4 = ig.game.collisionMap.trace( traceX, traceY, traceDX, traceDY, 30, 30 );
                    if( cRes4.collision.x || cRes4.collision.y )
                    {
                        console.trace( "Blocked" );
                        continue;
                    }*/

                    //console.trace( "Not Blocked" );
                    //add this node as best for now
                    //as we will keep looping to find more previous non-block node as the final best node
                    bestTurnNode = turnNode;
                    gScore = turnNode.g +
                        this.diagonalDistance( neighborNode.x, neighborNode.y, turnNode.x, turnNode.y );
                }

                //console.trace("try to push " + neighborNode.x + "," + neighborNode.y);
                //always mark the first visited node as best point as initial state
                if( -1 == openNodes.indexOf( neighborNode ) )
                {
                    //console.trace("add "+ neighborNode.x + "," + neighborNode.y + " to open list");

                    gScoreBest = true;
                    neighborNode.h = this.heuristic( neighborNode.x, neighborNode.y, end.x, end.y );
                    openNodes.push( neighborNode );
                    //console.trace( openNodes.length );
                }
                else if( gScore < neighborNode.g )
                {
                    //console.trace( " " + neighborNode.x + "," + neighborNode.y + "is a better way");
                    gScoreBest = true;
                }

                if( gScoreBest )
                {
                    neighborNode.parentNode = bestTurnNode;
                    neighborNode.g = gScore;
                    neighborNode.f = neighborNode.g + neighborNode.h;
                    /*console.trace( neighborNode.x + "," + neighborNode.y + " parent: "
                        + neighborNode.parentNode.x + "," + neighborNode.parentNode.y );*/
                }
            }

        }

        return [];
    },

    getNeighborNodes: function( node, grid ){

        var res = [];
        var x = node.x;
        var y = node.y;

        //console.trace( grid );

        if( grid[x-1] && grid[x-1][y] )
        {
            res.push( grid[x-1][y] );
        }

        if( grid[x+1] && grid[x+1][y] )
        {
            res.push( grid[x+1][y] );
        }

        if( grid[x] && grid[x][y-1] )
        {
            res.push( grid[x][y-1] );
        }

        if( grid[x] && grid[x][y+1] )
        {
            res.push( grid[x][y+1] );
        }

        return res;
    },

    heuristic: function( x1, y1, x2, y2 ) {

        this.diagonalDistance( x1, y1, x2, y2 );
    },

    diagonalDistance: function( x1, y1, x2, y2 ) {

        var dx = x1 - x2;
        var dy = y1 - y2;
        return dx*dx + dy*dy;
    }


});

});