window.utility = function(utility){
	utility.screen = {
	    rtime : new Date(1, 1, 2000, 12,00,00),
	    timeout : false,
	    delta : 200
	};
	utility.getBrowser = function(){
	    var $b = $.browser;
	    $.extend(utility.screen,$.browser);
	    utility.screen.isZoomed = false;
	    var screen  = utility.screen;
	    screen.zoomf  = screen.zoom = 1;
	    screen.width = window.screen.width;
	    screen.height = window.screen.height;
	    if($b.mozilla){ //FOR MOZILLA
	        screen.isZoomed  = window.matchMedia('(max--moz-device-pixel-ratio:0.99), (min--moz-device-pixel-ratio:1.01)').matches;
	    } else {
	        if($b.chrome){ //FOR CHROME
	            screen.zoom = (window.outerWidth - 8) / window.innerWidth;
	            screen.isZoomed = (screen.zoom < .98 || screen.zoom > 1.02)
	        } else if($b.msie){//FOR IE7,IE8,IE9
	            var _screen = document.frames.screen;
	            screen.zoom = ((((_screen.deviceXDPI / _screen.systemXDPI) * 100 + 0.9).toFixed())/100);
	            screen.isZoomed = (screen.zoom < .98 || screen.zoom > 1.02);
	            if(screen.isZoomed) screen.zoomf = screen.zoom;
	            screen.width = window.screen.width*screen.zoomf;
	            screen.height = window.screen.height*screen.zoomf;
	        }
	    }
	    return utility.screen;
	};
	window.onresize = function(e){
	   utility.screen.rtime = new Date();
	    if (utility.screen.timeout === false) {
	          utility.screen.timeout = true;
	          setTimeout(window.resizeend, utility.screen.delta);
	    }
	};
	window.resizeend = function() {
	    if (new Date() - utility.screen.rtime < utility.screen.delta) {
	        setTimeout(window.resizeend, utility.screen.delta);
	    } else {
	        utility.screen.timeout = false;
	        utility.screen = utility.getBrowser();
	        if(window.onresizeend) window.onresizeend (utility.screen);
	        if(utility.onResize) utility.onResize(utility.screen);
	    }               
	};
	window.onresizeend = function(screen){
	    if(screen.isZoomed)
	        $('body').text('zoom is not 100%');
	    else{
	        $('body').text('zoom is 100% & browser resolution is'+[screen.width+'X'+screen.height]);
	    }
	};
	$(document).ready(function(){
	    window.onresize();
	});
	return utility;
}({});
