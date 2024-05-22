require('./Condition.js')

PositionCondition = ConditionBase.extend({
    ctor:function(f, o)
    {
        this._super(f, o);
    }
})

PositionCondition.prototype.Match = function(pl)
{
    if(Verify(pl))
    {
        var move = pl.GetComponent(ComponentType.ECT_MOVE);
        if(Verify(move))
        {
            var pos = move.transform.position;
            return move.MapId == this.Param1 && Math.abs(pos.x - this.Param2) < 1 && Math.abs(pos.z - this.Param3) < 1
        }
    }
    return false;
}

exports.PositionCondition = PositionCondition;