const { Module } = require('../../Common/Module.js')

require('../../Common/CommonDefine.js')
require('../../Common/NetWork/NetPacket.js')
var fs = require('fs')
const { QuestStorage } = require('../Logic/Quest/QuestStorage.js')
const { HistoryComponent } = require('../Logic/Components/HistoryComponent.js')
const { TriggerMgr } = require('../Logic/Trigger/TriggerMgr.js')
const { ComponentType } = require('../../Common/Component.js')
const { QuestMgr } = require('../Logic/Quest/QuestMgr.js')
const { TriggerCondition } = require('../Gen/Types.js')
const { HasItemTrigger } = require('../Logic/Trigger/HasItemTrigger.js')
const { UseItemTrigger } = require('../Logic/Trigger/UseItemTrigger.js')
const { KillMonsterTrigger } = require('../Logic/Trigger/KillMonsterTrigger.js')
const { TimeLimitTrigger } = require('../Logic/Trigger/TimeLimitTrigger.js')
const { TalkAboutTrigger } = require('../Logic/Trigger/TalkAboutTrigger.js')
const { BagSpaceTrigger } = require('../Logic/Trigger/BagSpaceTrigger.js')
var Config = require('ini').parse(fs.readFileSync('../Config/Server.ini', 'utf-8'))
var EventCenter = require('../../Common/EventCenter.js').GetInstance()
var ManagerServer = require("../../CommonLogic/ManagerServer.js").GetInstance()
var GSManager = require('../../CommonLogic/GameServerMgr.js').GetInstance()
var GTManager = require('../../CommonLogic/GateServerMgr.js').GetInstance()
var GameServer = require('../../CommonLogic/GameServer.js').GameServer
var TriggerFactory = require('../Logic/Trigger/TriggerFactory.js').GetInstance()
var ComponentFactory = require('../../Common/CompontentFactory.js').GetInstance()
var QuestTable = require('../Logic/Quest/QuestTable').GetInstance()


ModuleQuest = Module.extend({
    ctor: function (solution) {
        this._super(solution)
        this.Name = "ModuleQuest"
        this.ModuleID = GAMESERVER_MODULE_QUEST
    }
})

ModuleQuest.prototype.OnInitialize = function () {
    ComponentFactory.RegisterType(ComponentType.ECT_PLAYER_QUEST_MGR, QuestMgr)
    ComponentFactory.RegisterType(ComponentType.ECT_PLAYER_HISTORY, HistoryComponent)
    ComponentFactory.RegisterType(ComponentType.ECT_QUEST_STORAGE, QuestStorage)
    ComponentFactory.RegisterType(ComponentType.ECT_PLAYER_TRIGGER_MGR, TriggerMgr)


    TriggerFactory.RegisterType(TriggerCondition.HasItem, HasItemTrigger)
    TriggerFactory.RegisterType(TriggerCondition.UseItem, UseItemTrigger)
    TriggerFactory.RegisterType(TriggerCondition.KillMonster, KillMonsterTrigger)
    TriggerFactory.RegisterType(TriggerCondition.TimeLimit, TimeLimitTrigger)
    TriggerFactory.RegisterType(TriggerCondition.TalkAbout, TalkAboutTrigger)
    TriggerFactory.RegisterType(TriggerCondition.BagSpace, BagSpaceTrigger)

    QuestTable.Init()

    //Bind packet processing function
}

ModuleQuest.prototype.OnUpdate = function (ms) { }

ModuleQuest.prototype.OnRelease = function () {

}