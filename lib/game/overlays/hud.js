/*
	This is an example of a simple HUD, displaying health, stamina, and XP.

	If you want to test it out:
		1) make sure you've included jQuery and Bootstrap in index.html, or whatever your main page is
		2) make sure you've included lib/impact/overlay.js in the project structure
		3) save this file as lib/game/overlays/hud.js (you'll need to create the lib/game/overlays folder)
		4) add this inside your player character's init() function:
				this.hud = new HUD();
		5) add this at the end of your player character's update() function:
				// Update the hud (it won't automatically get updated by Impact)
				this.hud.update({
					healthPct:     45,
					healthLabel:  '90 / 200',
					staminaPct:    25,
					staminaLabel: '20 / 80'
					xpPct:         22,
					xpLabel:      'Level 3'
				});
		6) hit the tab key in your game to toggle it

	In case you're wondering, you're totally free to use this in whatever project you want, I don't care -
	but if you've got any good feedback or you do something really cool with it, definitely let me know!
*/

ig.module(
	'game.overlays.hud'
)
.requires(
	'impact.overlay'
)
.defines(function() {

HUD = ig.Overlay.extend({
	className: 'player-hud',
	toggleKey: ig.KEY.TAB,

	init: function() {
		this.parent();
		console.log('initialized HUD');

		// Status bars section (health, stamina, xp)
		this.$statusBarsSection = $('<div>').css({
			position: 'absolute',
			right:        '10px',
			bottom:        '0px',
			width:       '200px'
		});

		this.$overlay.append(this.$statusBarsSection);

		// Health bar section
		this.$healthBarSection = $('<div>')
			.addClass('progress')
			.css({marginBottom: '10px'})
			.append(
				$('<div>')
					.addClass('bar bar-success'))
			.append(
				$('<span>')
					.addClass('bar-label')
					.css({
						color: 'black',
						position: 'absolute',
						width: '200px',
						textAlign: 'center',
						left: '0px'
					}));

		// Create the stamina and XP bar sections by cloning the health bar and changing the color classes
		this.$staminaBarSection = this.$healthBarSection.clone();
		this.$xpBarSection      = this.$healthBarSection.clone();
		$('.bar', this.$staminaBarSection).addClass('bar-warning'); // yellow
		$('.bar', this.$xpBarSection     ).addClass('bar-info'   ); // blue

		// Add the individual bars to the status bar container
		this.$statusBarsSection.append(this.$healthBarSection );
		this.$statusBarsSection.append(this.$staminaBarSection);
		this.$statusBarsSection.append(this.$xpBarSection     );
	},

	update: function(config) {
		if (ig.input.pressed('toggle-'+this.className))
		{
			this.$overlay.toggle();
		}

		// Update the width of the bar under the health bar section, and then update the text of the label
		$('.bar',       this.$healthBarSection ).width(config.healthPct+'%');
		$('.bar-label', this.$healthBarSection ).text( config.healthLabel  );

		// Likewise for stamina and XP
		$('.bar',       this.$staminaBarSection).width(config.staminaPct+'%');
		$('.bar-label', this.$staminaBarSection).text( config.staminaLabel  );
		$('.bar',       this.$xpBarSection     ).width(config.xpPct+'%'     );
		$('.bar-label', this.$xpBarSection     ).text( config.xpLabel       );
	}
});

});