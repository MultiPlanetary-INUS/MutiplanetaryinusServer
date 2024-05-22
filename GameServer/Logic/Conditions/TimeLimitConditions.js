require('./Condition.js')
require('../../../Common/Util/Util.js')
var TeamMgr = require('../Team/TeamMgr').GetInstance()

//time period limit
TimeLimitCondition = ConditionBase.extend({
    ctor: function (f, o) {
        this._super(f, o)
    }
})

TimeLimitCondition.prototype.Match = function (pl) {
    if (Verify(pl)) {
        var now = new Date()
        var BeginTime = GetDateTimeFromLong(this.Param2)
        var EndTime = GetDateTimeFromLong(this.Param3)
        var res = true
        switch (this.Param1) {
            case 3://Per year
                res = res && now.getMonth() >= BeginTime.month && now.getMonth() <= EndTime.month
            case 2://per month
                res = res && now.getDate() >= BeginTime.day && now.getDate() <= EndTime.day
            case 1://weekly
                if (this.Param1 == 1)
                    res = res && now.getDay() >= BeginTime.day && now.getDay() <= EndTime.day
            case 0://every day
                res = res && now.getHours() >= BeginTime.hours && now.getHours() <= EndTime.hours &&
                    now.getMinutes() >= BeginTime.minutes && now.getMinutes() <= EndTime.minutes &&
                    now.getSeconds() >= BeginTime.seconds && now.getSeconds() <= EndTime.seconds
        }
        return res
    }
    return false
}

exports.TimeLimitCondition = TimeLimitCondition