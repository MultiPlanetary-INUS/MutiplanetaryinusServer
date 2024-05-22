const { ComponentType } = require('../../../Common/Component.js');
const {ConditionType, ConditionsCF} = require('../../Gen/Types.js')


LoseQuestCondition = ConditionBase.extend({
    ctor:function(f, o)
    {
        this._super(f, o);
    }
})


LoseQuestCondition.prototype.Match = function(pl)
{
    if(Verify(pl))
    {
        var qm = pl.GetComponent(ComponentType.ECT_QUESTMGR);
        if(Verify(qm))
        {
            return qm.IsFailed(this.Param1);
        }
    }

    return false;
}

exports.LoseQuestCondition = LoseQuestCondition;