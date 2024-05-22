require('./Condition.js')

AttrCondition = ConditionBase.extend({
    ctor:function(f, o)
    {
        this._super(f, o);
    }
})

AttrCondition.prototype.Match = function(pl)
{
    if(Verify(pl))
    {
        var atc = pl.GetComponent(ComponentType.ECT_ATTR);
        if(Verify(atc))
        {
            var value = 0;
            if(this.Param1 == 0)
                value = atc.GetHP();
            else if(this.Param1 == 1)
                value =  atc.GetMP();
            else
                return false;

            if(this.Param3 > this.Param2)
                return value >= this.Param2 && value <= this.Param3;
            else
                return value >= this.Param2;
        }
    }
    return false;
}

exports.AttrCondition = AttrCondition;