ig.module( 
    'game.entities.teamInfo'
)
.requires(
    'impact.entity'
)
.defines(function(){

EntityTeamInfo = ig.Entity.extend({

    teamID: 1
});

});