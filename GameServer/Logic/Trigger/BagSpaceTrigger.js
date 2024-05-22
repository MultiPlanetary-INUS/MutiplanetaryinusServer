const { ComponentType } = require('../../../Common/Component.js');
const { TriggerCondition } = require('../../Gen/Types.js');

require('./TriggerQuest.js')

BagSpaceTrigger = TriggerQuest.extend({
    ctor:function()
    {
        this._super();
        this.Type = TriggerCondition.BagSpace;
    }
})


BagSpaceTrigger.prototype.RaiseEvent = function(eid,p1,p2,p3)
{
    if(Verify(this.Quest))
    {
        if(eid == "RemoveItem" || eid == "UseItem" || eid == "AddItem") 
        {
            var ItemMgr = this.Owner.GetComponent(ComponentType.ECT_ITEMMGR)
            if(Verify(ItemMgr))
            {
                this.Quest.ResetProcess(this.Type, this.Param1, ItemMgr.GetBagSpace());
            }
        }    
    }
}


BagSpaceTrigger.prototype.OnAttach = function()
{
    if(Verify(this.Owner) && Verify(this.Quest))
    {
        var ItemMgr = this.Owner.GetComponent(ComponentType.ECT_ITEMMGR)
        if(Verify(ItemMgr))
        {
            this.Quest.ResetProcess(this.Type, this.Param1, ItemMgr.GetBagSpace());
        }
    }
};

exports.BagSpaceTrigger = BagSpaceTrigger