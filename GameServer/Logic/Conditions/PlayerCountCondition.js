require('./Condition.js')
var TeamMgr = require('../Team/TeamMgr').GetInstance()

//The number of players, usually the map copy limits the number of players
PlayerCountCondition = ConditionBase.extend({
    ctor: function (f, o) {
        this._super(f, o)
    }
})

PlayerCountCondition.prototype.Match = function (pl) {
    if (Verify(pl)) {
        var team = TeamMgr.Find(pl.TeamID)
        if (Verify(team)) {
            if (this.Param2 > 0) {
                return team.CountMember() >= this.Parma1 && team.CountMember() <= this.Param2
            }
            else {
                return team.CountMember() >= this.Parma1
            }
        }
    }
    return false
}

exports.PlayerCountCondition = PlayerCountCondition