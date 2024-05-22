const { ComponentType } = require('../../../Common/Component.js');
const { TriggerCondition } = require('../../Gen/Types.js');

require('./TriggerQuest.js')

KillMonsterTrigger = TriggerQuest.extend({
    ctor:function()
    {
        this._super();
        this.Type = TriggerCondition.KillMonster;
    }
})


KillMonsterTrigger.prototype.RaiseEvent = function(eid,p1,p2,p3)
{
    if(Verify(this.Quest) && Verify(p1) && p1.GetNpcID() == this.Param1)
    {
        if(eid == "KillMonster") 
        {
            this.Quest.AddProcess(this.Type, this.Param1, 1);
        }
    }
}

exports.KillMonsterTrigger = KillMonsterTrigger