require('./Condition.js')

VocationCondition = ConditionBase.extend({
    ctor:function(f, o)
    {
        this._super(f, o);
    }
})

VocationCondition.prototype.Match = function(pl)
{
    if(Verify(pl))
    {
        var rin = pl.RoleInfo;
        if(Verify(rin))
        {
            var v = rin.getVocation()
            return v == this.Param1 || v == this.Param2 || v == this.Param3;
        }
    }
    return false;
}

exports.VocationCondition = VocationCondition;