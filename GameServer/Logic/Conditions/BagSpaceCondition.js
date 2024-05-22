const { ComponentType } = require('../../../Common/Component.js');
require('./Condition.js')

BagSpaceCondition = ConditionBase.extend({
    ctor:function(f, o)
    {
        this._super(f, o);
    }
})

BagSpaceCondition.prototype.Match = function(pl)
{
    if(Verify(pl))
    {
        var itmgr = pl.GetComponent(ComponentType.ECT_ITEMMGR);
        if(Verify(itmgr))
        {
            return itmgr.GetBagSpace() >= this.Param1;
        }
    }
    return false;
}

exports.BagSpaceCondition = BagSpaceCondition;