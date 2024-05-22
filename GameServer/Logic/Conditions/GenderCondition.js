require('./Condition.js')

GenderCondition = ConditionBase.extend({
    ctor:function(f, o)
    {
        this._super(f, o);
    }
})

GenderCondition.prototype.Match = function(pl)
{
    if(Verify(pl))
    {
        var rin = pl.RoleInfo;
        if(Verify(rin))
        {
            return rin.getGender() == this.Param1;
        }
    }
    return false;
}

exports.GenderCondition = GenderCondition;