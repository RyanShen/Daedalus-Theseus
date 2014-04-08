ig.module(
	'game.classes.soundmanager'
)
.requires(
	'impact.sound'
)
.defines(function(){

SoundManager = ig.Class.extend({

	disabled: false,
	sounds: {},
	targetVolume: 1,
	mute: false,

	soundList: {
		'mouseover': 'media/sound/mouseover.*'

	},

    init: function() {
        ig.Sound.channels = 10;
        if (this.disabled) {
            return;
        }
        for (s in this.soundList) {
            this.sounds[s] = new ig.Sound(this.soundList[s]);
        }
    },

	isMute: function() {
		return this.mute;
	},

	toggleMute: function() {
		if (ig.soundManager.volume > 0) {
			ig.soundManager.volume = 0;
			this.mute = true;
		}
		else {
			ig.soundManager.volume = targetVolume;
			this.mute = false;
		}
	},

	toggleVolume: function(volume) {
		if (this.disabled) {
			return;
		}
		if (!this.mute) {
			this.targetVolume = volume;
		}
	},

	play: function(s) {
		if (this.disabled) {
			return;
		}
		if (s in this.sounds) {
			this.sounds[s].play();
		}
		else {
			console.log("Unexpected sound file");
		}
	}


});

})