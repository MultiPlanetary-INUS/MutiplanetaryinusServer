const { ComponentType } = require("../../../Common/Component");
const { GameObject } = require("../../../Common/GameObject");
const { TriggerMgr } = require("../Trigger/TriggerMgr");
var TriggerFactory = require('../Trigger/TriggerFactory.js').GetInstance();

Quest = GameObject.extend({
    ctor: function ()
    {
        this.ID = 0;
        this.Name = "";
        this.Desc = "";
        this.State=0;
        this.QuestType = 0;
        this.AcceptNPC = 0;
        this.CompleteNpc = 0;
        this.AcceptActions=[];

        this.TargetStr="";
        this.ContinueStr="";
        this.EndStr="";
        this.RewardStr="";
        
        this.NeedConditions=[];
        this.NeedAllConditions = true;

        this.QuestContent=[];
        this.NeedAllTrigger = true;

        this.RewardActions=[];
        this.ChooseRewardActions=[];

        this.Owner = null;
        this.bModify = false;

        this.bRepeat = false;
        this.AcceptTime = null;
    }
})

Quest.prototype.OnAttach = function()
{
    this.CreateComponent(ComponentType.ECT_QUEST_STORAGE)

    var triggerMgr = role.GetComponent(ComponentType.ECT_TRIGGERMGR)
    if(Verify(triggerMgr))
    {
        for(var i=0; i<this.QuestContent.length; ++i)
        {
            var trigger = TriggerFactory.Create(this.QuestContent[i].Type)
            if(Verify(trigger))
            {
                trigger.SetQuest(this);
                trigger.Param1 = this.QuestContent[i].Param1;
                triggerMgr.Add(trigger);
            }
        }
    }
}

Quest.prototype.OnDetach = function()
{
    var role = this.GetOwner();
    if(Verify(role))
    {
        var triggerMgr = role.GetComponent(ComponentType.ECT_TRIGGERMGR)
        if(Verify(triggerMgr))
        {
            triggerMgr.RemoveQuestTrigger(this);
        }
    }
}

Quest.prototype.Destory = function()
{
    var store = this.GetComponent(ComponentType.ECT_STORAGE)
    if(Verify(store))
    {
        store.Delete();
        this.bModify = false;
    }
}

Quest.prototype.GetOwner = function()
{
    return this.Owner;
}

Quest.prototype.SetOwner = function(own)
{
    if(Verify(own))
    {
        this.Owner = own;
        this.OnAttach();
    }
    else
    {
        this.OnDetach();
        this.Destory();
    }
}

Quest.prototype.Store = function()
{
    var store = this.GetComponent(ComponentType.ECT_STORAGE)
    if(Verify(store))
    {
        store.Store();
    }
}

Quest.prototype.CanAccept = function(player)
{
    if(this.NeedAllConditions)
    {
        for(var i=0; i < this.NeedConditions.length; ++i)
        {
            if(!this.NeedConditions[i].Match(player))
                return false;
        }

        return true;
    }
    else
    {
        for(var i=0; i < this.NeedConditions.length; ++i)
        {
            if(this.NeedConditions[i].Match(player))
                return true;
        }
    }

    return false;
}

Quest.prototype.IsCompleted = function()
{
    var player = this.GetOwner();
    if(!Verify(player))
        return false;

    if(this.NeedAllTrigger)
    {
        for(var i=0; i<this.QuestContent.length; ++i)
        {
            if(this.QuestContent[i].Param3 < this.QuestContent[i].Param2)
                return false;
        }
    }
    else
    {
        for(var i=0; i<this.QuestContent.length; ++i)
        {
            if(this.QuestContent[i].Param3 >= this.QuestContent[i].Param2)
                return true;
        }
        return false;
    }

    return true;
}

Quest.prototype.ResetProcess = function(type, param1, val)
{
    for(var i=0; i<this.QuestContent.length; ++i)
    {
        if(this.QuestContent[i].Type == type && this.QuestContent[i].Param1 == param1)
        {
            this.QuestContent[i].Param3 = val;
            this.bModify = true;
            return;
        }
    }
}

Quest.prototype.AddProcess = function(type, param1, val)
{
    for(var i=0; i<this.QuestContent.length; ++i)
    {
        if(this.QuestContent[i].Type == type && this.QuestContent[i].Param1 == param1)
        {
            this.QuestContent[i].Param3 += val;
            this.bModify = true;
            return;
        }
    }
}

Quest.prototype.SetFailed = function()
{
    this.State = -1;
    this.bModify = true;
    this.Store();

    this.GetOwner().RaiseEvent("LoseQuest", this);
}

Quest.prototype.IsFailed = function()
{
    return this.State < 0;
}

Quest.prototype.IsProgress = function()
{
    return !this.IsCompleted() && !this.IsFailed();
}

Quest.prototype.Finish = function(choose = -1)
{
    if(Verify(this.Owner))
    {
        for(var i=0; i < this.RewardActions.length; ++i)
        {
            this.RewardActions[i].Execute(this.Owner);
        }
    }
    if(choose >= 0 && choose < this.ChooseRewardActions.length)
    {
        this.ChooseRewardActions[choose].Execute(this.Owner);
    }
}


exports.Quest = Quest;