const { ComponentType } = require("../../../Common/Component");
const { QueryType } = require("../../../Common/QueryType");
const { BufferType } = require("../../Gen/Types");
const { BaseBuffer } = require("./BaseBuffer");

MPPoolBuffer = BaseBuffer.extend({
    ctor:function(){
        this.Type = BufferType.MPPool;
        this.ft = 0
    }
})

MPPoolBuffer.prototype.OnUpdate = function(ms)
{
    this.ft += ms / 1000.0
    if(Verify(this.Owner) && this.ft > this.Param2)
    {
        ft = 0

        if(this.Param1 <= 0)
        {
            this.LifeTime = 0;
            return;
        }

        var ac = this.Owner.GetComponent(ComponentType.ECT_ATTR)
        if(Verify(ac))
        {
            var lv = ac.GetMaxMP()-ac.GetMP()
            if(lv > 0)
            {
                if(this.Param1 >lv)
                    this.Param1 -= lv
                else
                    lv = this.Param1
            }
            ac.AddMP(lv)
        }
    }
}


exports.MPPoolBuffer = MPPoolBuffer
