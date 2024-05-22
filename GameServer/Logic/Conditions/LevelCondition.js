require('./Condition.js')

LevelCondition = ConditionBase.extend({
    ctor:function(f, o)
    {
        this._super(f, o);
    }
})

LevelCondition.prototype.Match = function(pl)
{
    if(Verify(pl))
    {
        var atc = pl.GetComponent(ComponentType.ECT_ATTR);
        if(Verify(atc))
        {
            var level = atc.GetLevel();
            if(this.Param2 > this.Param1)
                return level >= this.Param1 && level <= this.Param2;
            else
                return level >= this.Param1;
        }
    }
    return false;
}

exports.LevelCondition = LevelCondition;