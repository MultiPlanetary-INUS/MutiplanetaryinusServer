const { ComponentType } = require("../../../Common/Component");
const { QueryType } = require("../../../Common/QueryType");
const { BufferType } = require("../../Gen/Types");
const { BaseBuffer } = require("./BaseBuffer");

AddMPBuffer = BaseBuffer.extend({
    ctor:function(){
        this.Type = BufferType.AddMP;
        this.ft = 0
    }
})

AddMPBuffer.prototype.OnUpdate = function(ms)
{
    this.ft += ms / 1000.0
    if(Verify(this.Owner) && this.ft > this.Param2)
    {
        ft = 0
        var ac = this.Owner.GetComponent(ComponentType.ECT_ATTR)
        if(Verify(ac))
        {
            ac.AddMP(this.Param1)
        }
    }
}


exports.AddMPBuffer = AddMPBuffer
