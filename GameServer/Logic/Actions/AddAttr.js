const{AttrType} = require("../../Gen/Types.js")
require('./Action.js')

AddAttrAction = ActionBase.extend({
    ctor:function(cf)
    {
        this._super(cf);
    }
})

AddAttrAction.prototype.Execute = function(pl)
{
    if(Verify(pl))
    {
        var atc = pl.GetComponent(ComponentType.ECT_ATTR);
        if(Verify(atc))
        {
            switch(this.Param1)
            {
                case AttrType.Attr_HP:
                    atc.AddHP(this.Param2);
                    break;
                case AttrType.Attr_MP:
                    atc.AddMP(this.Param2);
                    break;
            }
        }
    }
    return false;
}

exports.AddAttrAction = AddAttrAction;