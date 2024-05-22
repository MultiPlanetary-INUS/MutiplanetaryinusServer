const { ComponentType } = require('../../../Common/Component.js');
const {ConditionType, ConditionsCF} = require('../../Gen/Types.js')

CompleteQuestCondition = ConditionBase.extend({
    ctor:function(f, o)
    {
        this._super(f, o);
    }
})


CompleteQuestCondition.prototype.Match = function(pl)
{
    if(Verify(pl))
    {
        var qm = pl.GetComponent(ComponentType.ECT_QUESTMGR);
        if(Verify(qm))
        {
            var hs = qm.FindHistory(this.Param1);
            if(Verify(hs))
            {
                return true;
            }
        }
    }
    return false;
}

exports.CompleteQuestCondition = CompleteQuestCondition