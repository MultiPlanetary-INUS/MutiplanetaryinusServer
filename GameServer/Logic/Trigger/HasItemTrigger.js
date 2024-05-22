const { ComponentType } = require('../../../Common/Component.js');
const { TriggerCondition } = require('../../Gen/Types.js');

require('./TriggerQuest.js')

HasItemTrigger = TriggerQuest.extend({
    ctor:function()
    {
        this._super();
        this.Type = TriggerCondition.HasItem;
    }
})


HasItemTrigger.prototype.RaiseEvent = function(eid,p1,p2,p3)
{
    if(Verify(this.Quest) && Verify(p1) && p1.GetTypeID() == this.Param1)
    {
        if(eid == "RemoveItem")
        {
            this.Quest.AddProcess(this.Type, this.Param1, -p2);
        }
        else if(eid == "UseItem") 
        {
            this.Quest.AddProcess(this.Type, this.Param1, -1);
        }  
        else if(eid == "AddItem") 
        {
            this.Quest.AddProcess(this.Type, this.Param1, p2);
        }    
    }
}


HasItemTrigger.prototype.OnAttach = function()
{
    if(Verify(this.Owner) && Verify(this.Quest))
    {
        var ItemMgr = this.Owner.GetComponent(ComponentType.ECT_ITEMMGR)
        if(Verify(ItemMgr))
        {
            var itemCount = ItemMgr.CountItemByDefID(this.Param1);
            this.Quest.ResetProcess(this.Type, this.Param1, itemCount);
        }
    }
};

exports.HasItemTrigger = HasItemTrigger
