const { Class } = require('../../../Common/Util/Class.js')

Trigger = Class.extend({
    ctor:function()
    {
        this.Type = 0;
        this.Owner = null;
    }
})

Trigger.prototype.RaiseEvent = function(eid,p1,p2,p3){}
Trigger.prototype.OnUpdate = function(ms){};
Trigger.prototype.OnAttach = function(){};
Trigger.prototype.OnDetach = function(){};

Trigger.prototype.SetType = function(tp)
{
    this.Type = tp;
}

Trigger.prototype.GetType = function()
{
    return this.Type;
}

Trigger.prototype.GetOwner = function()
{
    return this.Owner;
}

Trigger.prototype.SetOwner= function(own)
{
    if(Verify(this.Owner))
        this.OnDetach();
    
    this.Owner = own;

    if(Verify(this.Owner))
        this.OnAttach();
}
