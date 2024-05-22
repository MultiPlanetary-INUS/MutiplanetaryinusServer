const { ComponentType } = require("../../../Common/Component");
const { QueryType } = require("../../../Common/QueryType");
const { BufferType } = require("../../Gen/Types");
const { BaseBuffer } = require("./BaseBuffer");

AddExpBuffer = BaseBuffer.extend({
    ctor:function(){
        this.Type = BufferType.AddExp;
    }
})

AddExpBuffer.prototype.OnAttach = function()
{
    this.Owner.Regist(QueryType.QT_AddExp, this.OnAddExp)
}

AddExpBuffer.prototype.OnDetach = function()
{
    this.Owner.UnRegist(QueryType.QT_AddExp, this.OnAddExp)
}

AddExpBuffer.prototype.OnAddExp = function(obj, param1, param2)
{
    if(Verify(this.Owner))
    {
        var atc = this.Owner.GetComponent(ComponentType.ECT_ATTR);
        if(atc != null && atc.GetLevel() < this.Param2)
            return param1 * this.Param1 / 100;

        return 0;
    }
}

exports.AddExpBuffer = AddExpBuffer
