const { Class } = require('../../../Common/Util/Class.js')
const {ConditionType, ConditionsCF} = require('../../Gen/Types.js')

ConditionBase = Class.extend({
    ctor:function(cf, Owner = null)
    {
        this.Type = cf.ConditionType;
        this.Param1 = cf.Param1;
        this.Param2 = cf.Param2;
        this.Param3 = cf.Param3;
        this.Owner = Owner;
    }
})

ConditionBase.prototype.Match = function(pl)
{
    if(Verify(pl))
    {
        return true;
    }
    return false;
}

