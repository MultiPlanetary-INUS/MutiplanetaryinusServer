const { Class } = require("../../../Common/Util/Class");
const { BufferType } = require("../../Gen/Types");

BaseBuffer = Class.extend({
    ctor:function(){
        this.Type = BufferType.None;
        this.Owner = owner;
        this.LifeTime = 0.0;
        this.Param1 = 0;
        this.Param2 = 0;
    }
})

BaseBuffer.prototype.OnAttach = function(){}

BaseBuffer.prototype.OnDetach = function(){}

BaseBuffer.prototype.OnUpdate = function(ms){}

BaseBuffer.prototype.SetOwner = function(ent)
{
    if(this.Owner != null)
        this.OnDetach();

    this.Owner = ent;

    if(this.Owner != null)
        this.OnAttach();
}

exports.BaseBuffer = BaseBuffer