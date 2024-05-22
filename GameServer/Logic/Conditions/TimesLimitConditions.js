const { ComponentType } = require('../../../Common/Component.js')
const { GameObjectType } = require('../../../Common/GameObject.js')

require('./Condition.js')
require('../../../Common/Util/Util.js')
var TeamMgr = require('../Team/TeamMgr').GetInstance()

//Number of times limit within time period
TimesLimitCondition = ConditionBase.extend({
    ctor: function (f, o) {
        this._super(f, o)
    }
})

TimesLimitCondition.prototype.Match = function (pl) {
    if (Verify(pl)) {
        var now = new Date()

        if (Verify(this.Owner)) {
            var hc = pl.GetComponent(ComponentType.ECT_HISTORY)
            if (Verify(hc)) {
                var ql = null

                if (this.Owner.ObjType = GameObjectType.GOT_MAP) {
                    ql = hc.GetDuplicateHistory(this.Owner.ID)
                }
                else if (this.Owner.ObjType = GameObjectType.GOT_QUEST) {
                    ql = hc.GetQuestHistory(this.Owner.ID)
                }

                if (ql != null) {
                    switch (this.Param1) {
                        case 3://Per year
                            if (now.getFullYear() != ql.DoneTime.getFullYear()) {
                                return true
                            }
                            else {
                                return ql.YearTimes < this.Param2
                            }
                        case 2://per month
                            if (now.getFullYear() != ql.DoneTime.getFullYear()) {
                                return true
                            }
                            else {
                                if (now.getMonth() != ql.DoneTime.getMonth())
                                    return true
                                else
                                    return ql.MonthTimes < this.Param2
                            }
                        case 1://weekly
                            if (IsSameWeek(ql.DoneTime, now)) {
                                return ql.WeekTimes < this.Param2
                            }
                            else {
                                return true
                            }
                        case 0://every day
                            if (now.getFullYear() != ql.DoneTime.getFullYear()) {
                                return true
                            }
                            else {
                                if (now.getMonth() != ql.DoneTime.getMonth())
                                    return true
                                else {
                                    if (now.getDate() != ql.DoneTime.getDate())
                                        return true
                                    else
                                        return ql.DayTimes < this.Param2
                                }
                            }
                    }
                }
                else
                    return true
            }
        }
    }
    return false
}

exports.TimesLimitCondition = TimesLimitCondition