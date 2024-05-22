const { Class } = require('../../../Common/Util/Class.js')
const {ActionType, ActionsCF} = require('../../Gen/Types.js')

ActionBase = Class.extend({
    ctor:function(cf)
    {
        this.Type = cf.ActionTypeID;
        this.Param1 = cf.Param1;
        this.Param2 = cf.Param2;
        this.Param3 = cf.Param3;
    }
})

ActionBase.prototype.Execute = function(pl)
{
    if(Verify(pl))
    {
        return true;
    }
    return false;
}
