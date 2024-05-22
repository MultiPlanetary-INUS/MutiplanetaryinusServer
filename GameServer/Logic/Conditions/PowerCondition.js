const { ComponentType } = require('../../../Common/Component.js');
require('./Condition.js')

PowerCondition = ConditionBase.extend({
    ctor:function(f, o)
    {
        this._super(f, o);
    }
})

PowerCondition.prototype.Match = function(pl)
{
    if(Verify(pl))
    {
        var attr = pl.GetComponent(ComponentType.ECT_ATTR);
        if(Verify(attr))
        {
            var pw = attr.Attr.getPower();
            if(this.Param2 > this.Param1)
                return pw >= this.Param1 && pw <= this.Param2;
            else
                return pw >= this.Param1;
        }
    }
    return false;
}

exports.PowerCondition = PowerCondition;