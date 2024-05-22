require('./Trigger.js')

TriggerQuest = Trigger.extend({
    ctor:function()
    {
        this._super();
        this.Quest = null;
        this.Param1 = 0;
    }
})

TriggerQuest.prototype.SetQuest = function(ques)
{
    this.Quest = ques;
}

TriggerQuest.prototype.GetQuest = function()
{
    return this.Quest;
}

TriggerQuest.prototype.RaiseEvent = function(eid, p1,p2,p3){}
TriggerQuest.prototype.OnUpdate = function(ms){};
TriggerQuest.prototype.OnAttach = function(){};
TriggerQuest.prototype.OnDetach = function(){};

exports.TriggerQuest = TriggerQuest