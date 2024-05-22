const { Clone } = require('../../../Common/Util/Clone.js');
const { Class } = require('../../../Common/Util/Class.js');
const { ConditionType } = require('../../Gen/Types.js');
const { Quest } = require('./Quest.js');
var DataCenter = require('../../Gen/DataCenter.js').GetInstance();
var ActionsFactory = require('../Actions/ActionFactory').GetInstance();
var ConditonsFactory = require('../Conditions/ConditionsFactory.js').GetInstance();


QuestTable = Class.extend({
    ctor:function()
    {
        this.QuestMap={};
    }
});


QuestTable.prototype.CreateQuest = function(qid)
{
    var qd = DataCenter.GetQuestData(qid)
    if(Verify(qd))
    {
        var quest = new Quest();
        quest.ID = qid;
        quest.Name = qd.QuestName;
        quest.Desc = qd.QuestDesc;
        quest.State = 0;
        quest.QuestType = qd.QuestType;
        quest.AcceptNPC = qd.AcceptNPC;
        quest.CompleteNpc = qd.CompleteNpc;
        quest.TargetStr = qd.TargetStr;
        quest.ContinueStr = qd.ContinueStr;
        quest.EndStr = qd.EndStr;
        quest.RewardStr = qd.RewardStr;

        for(var i=0; i < qd.AcceptActions.length; ++i)
        {
            var act = ActionsFactory.Create(qd.AcceptActions[i])
            if(Verify(act))
            {
                quest.AcceptActions.push(act);
            }
        }

        for(var i=0; i < qd.NeedConditions.length; ++i)
        {
            var con = ConditonsFactory.Create(qd.NeedConditions[i], this);
            if(Verify(con))
            {
                if(qd.NeedConditions[i].ConditionTypeID == ConditionType.TimesLimit)
                    quest.bRepeat = true;

                quest.NeedConditions.push(con);
            }
        }
        quest.NeedAllConditions = qd.NeedAllConditions;

        quest.QuestContent = Clone(qd.QuestContent);
        quest.NeedAllTrigger = qd.NeedAllTrigger;

        for(var i=0; i < qd.AcceptActions.length; ++i)
        {
            var act = ActionsFactory.Create(qd.AcceptActions[i])
            if(Verify(act))
            {
                quest.AcceptActions.push(act);
            }
        }

        for(var i=0; i < qd.RewardActions.length; ++i)
        {
            var act = ActionsFactory.Create(qd.RewardActions[i])
            if(Verify(act))
            {
                quest.RewardActions.push(act);
            }
        }

        for(var i=0; i < qd.ChooseRewardActions.length; ++i)
        {
            var act = ActionsFactory.Create(qd.ChooseRewardActions[i])
            if(Verify(act))
            {
                quest.ChooseRewardActions.push(act);
            }
        }
    }
    return null;
}

QuestTable.prototype.GetQuest = function(id)
{
    return this.QuestMap[id];
}

QuestTable.prototype.Init = function()
{
    var ql = DataCenter.GetQuestList();
    for(var i=0; i < ql.length; ++i)
    {
        var quest = this.CreateQuest(ql.ID);
        if(Verify(quest))
        {
            this.QuestMap[ql.ID] = quest;
        }
    }
}


var ThisInstance = null;
exports.GetInstance = function()
{
	if(!Verify(ThisInstance))
	{
		ThisInstance = new QuestTable();
	}
	
	return ThisInstance;
};