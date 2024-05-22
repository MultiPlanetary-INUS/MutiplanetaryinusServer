const { ComponentType } = require('../../../Common/Component.js')
const { TriggerCondition } = require('../../Gen/Types.js')

require('./TriggerQuest.js')

TimeLimitTrigger = TriggerQuest.extend({
    ctor: function () {
        this._super()
        this.Type = TriggerCondition.HasItem
        this.Time = 0
    }
})

TimeLimitTrigger.prototype.OnAttach = function () {
    this.Time = 0
    if (Verify(this.Owner) && Verify(this.Quest)) {
        var p = this.Param1 * 2 - (Date.now() - this.Quest.AcceptTime) / 1000
        this.Quest.ResetProcess(this.Type, this.Param1, p)
    }
}

TimeLimitTrigger.prototype.OnUpdate = function (ms) {
    this.Time += ms
    if (this.Time >= 1000)//Update time every second
    {
        this.Quest.AddProcess(this.Type, this.Param1, -1)
        this.Time -= 1000
    }
}

exports.TimeLimitTrigger = TimeLimitTrigger