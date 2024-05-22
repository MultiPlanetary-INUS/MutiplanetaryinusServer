const { Module } = require('../../Common/Module.js')

require('../../Common/CommonDefine.js')
require('../../Common/NetWork/NetPacket.js')
const { ComponentType } = require('../../Common/Component.js')
const { ConditionType, ActionType, ItemType, BufferType } = require('../Gen/Types.js')
const { LevelCondition } = require('../Logic/Conditions/LevelCondition')
const { GenderCondition } = require('../Logic/Conditions/GenderCondition.js')
const { VocationCondition } = require('../Logic/Conditions/VocationCondition.js')
const { PowerCondition } = require('../Logic/Conditions/PowerCondition.js')
const { PositionCondition } = require('../Logic/Conditions/PositionCondition.js')
const { AddAttrAction } = require('../Logic/Actions/AddAttr.js')
const { ItemStorage } = require('../Logic/Item/ItemStorage.js')
const { Item } = require('../Logic/Item/Item.js')
const { PlayerCountCondition } = require('../Logic/Conditions/PlayerCountCondition.js')
const { TimesLimitCondition } = require('../Logic/Conditions/TimesLimitConditions.js')
const { TimeLimitCondition } = require('../Logic/Conditions/TimeLimitConditions.js')
const { CompleteQuestCondition } = require('../Logic/Conditions/CompleteQuestCondition.js')
const { LoseQuestCondition } = require('../Logic/Conditions/LoseQuestCondition.js')
const { BagSpaceCondition } = require('../Logic/Conditions/BagSpaceCondition.js')
const { MoveMapAction } = require('../Logic/Actions/MoveMapAction.js')
const { SkillMgr } = require('../Logic/Skill/SkillMgr.js')
const { BufferMgr } = require('../Logic/Buffer/BufferMgr')
const { AddExpBuffer } = require('../Logic/Buffer/AddExpBuffer.js')
const { AddHPBuffer } = require('../Logic/Buffer/AddHPBuffer.js')
const { AddMPBuffer } = require('../Logic/Buffer/AddMPBuffer.js')
const { HPPoolBuffer } = require('../Logic/Buffer/HPPoolBuffer.js')
const { MPPoolBuffer } = require('../Logic/Buffer/MPPoolBuffer.js')
const { InvincibilityBuffer } = require('../Logic/Buffer/InvincibilityBuffer.js')
const { AttrCondition } = require('../Logic/Conditions/AttrCondition.js')
var ComponentFactory = require('../../Common/CompontentFactory').GetInstance()
var ConditionsFactory = require('../Logic/Conditions/ConditionsFactory').GetInstance()
var ActFactory = require('../Logic/Actions/ActionFactory').GetInstance()
var RoleMgr = require('../Logic/Player/RoleMgr').GetInstance()
var SkillTables = require('../Logic/Skill/SkillTables').GetInstance()
var BufferFactory = require('../Logic/Buffer/BufferFactory').GetInstance()

require('../Logic/Item/ItemMgr')

ModuleItem = Module.extend({
    ctor: function (solution) {
        this._super(solution)
        this.Name = "ModuleItem"
        this.ModuleID = GAMESERVER_MODULE_ITEM
    }
})

ModuleItem.prototype.OnInitialize = function () {
    ComponentFactory.RegisterType(ComponentType.ECT_PLAYER_ITEM_MGR, ItemMgr)
    ComponentFactory.RegisterType(ComponentType.ECT_ITEM_STORAGE, ItemStorage)
    ComponentFactory.RegisterType(ComponentType.ECT_BUFFER_MANAGER, BufferMgr)
    ComponentFactory.RegisterType(ComponentType.ECT_SKILL_MANAGER, SkillMgr)

    ConditionsFactory.RegisterType(ConditionType.Level, LevelCondition)
    ConditionsFactory.RegisterType(ConditionType.Gender, GenderCondition)
    ConditionsFactory.RegisterType(ConditionType.Vocation, VocationCondition)
    ConditionsFactory.RegisterType(ConditionType.Power, PowerCondition)
    ConditionsFactory.RegisterType(ConditionType.Position, PositionCondition)
    ConditionsFactory.RegisterType(ConditionType.PlayerCount, PlayerCountCondition)
    ConditionsFactory.RegisterType(ConditionType.TimeLimit, TimeLimitCondition)
    ConditionsFactory.RegisterType(ConditionType.TimesLimit, TimesLimitCondition)
    ConditionsFactory.RegisterType(ConditionType.CompleteQuest, CompleteQuestCondition)
    ConditionsFactory.RegisterType(ConditionType.LoseQuest, LoseQuestCondition)
    ConditionsFactory.RegisterType(ConditionType.BagSpace, BagSpaceCondition)
    ConditionsFactory.RegisterType(ConditionType.NeedAttr, AttrCondition)

    BufferFactory.RegisterType(BufferType.AddExp, AddExpBuffer)
    BufferFactory.RegisterType(BufferType.AddHP, AddHPBuffer)
    BufferFactory.RegisterType(BufferType.AddMP, AddMPBuffer)
    BufferFactory.RegisterType(BufferType.HPPool, HPPoolBuffer)
    BufferFactory.RegisterType(BufferType.MPPool, MPPoolBuffer)
    BufferFactory.RegisterType(BufferType.Invincibility, InvincibilityBuffer)

    ActFactory.RegisterType(ActionType.AddAttr, AddAttrAction)
    ActFactory.RegisterType(ActionType.MoveMap, MoveMapAction)

    SkillTables.Init()

    //Bind packet processing function
    BIND_PKG_HANDLER(proto.PKGTypeID.PKG_ENTER_GAME, this, 'OnEnterGame')
    BIND_PKG_HANDLER(proto.PKGTypeID.PKG_ITEM_CHANGE_POS, this, "OnItemChangePos")
    BIND_PKG_HANDLER(proto.PKGTypeID.PKG_USE_ITEM, this, "OnUseItem")
    BIND_PKG_HANDLER(proto.PKGTypeID.PKG_USE_SKILL, this, "OnUseSkill")
}

ModuleItem.prototype.OnUseSkill = function (pkg, hs) {

    if (Verify(pkg) && Verify(hs)) {
        var player = RoleMgr.Find(pkg.getRoleid())
        if (Verify(player)) {
            var skMgr = player.GetComponent(ComponentType.ECT_SKILLMGR)
            if (Verify(skMgr)) {
                var skill = skMgr.GetSkill(pkg.getSkillid())
                if (Verify(skill)) {
                    skill.Release()
                    player.NotifyAround(pkg)
                }
            }
        }
    }
}

ModuleItem.prototype.OnEnterGame = async function (pkg, hs) {
    if (Verify(pkg) && Verify(hs)) {
        var player = RoleMgr.Find(pkg.getRoleid())
        if (Verify(player)) {
            var itMgr = player.CreateComponent(ComponentType.ECT_PLAYER_ITEM_MGR)
            if (Verify(itMgr)) {
                itMgr.ReStore()
            }
        }
    }
}

ModuleItem.prototype.OnItemChangePos = function (pkg, hs) {
    if (Verify(pkg) && Verify(hs)) {
        var player = RoleMgr.Find(pkg.getRoleid())
        if (Verify(player)) {
            var itMgr = player.GetComponent(ComponentType.ECT_ITEMMGR)
            if (Verify(itMgr)) {
                var pItem = itMgr.GetItem(pkg.getOldpos().getContainer(), pkg.getOldpos().getIndex())
                if (Verify(pItem) && pItem.GetItemID() == pkg.getItemid()) {
                    if (!itMgr.MoveItem(pkg.getOldpos().getContainer(), pkg.getOldpos().getIndex(), pkg.getNewpos().getContainer(), pkg.getNewpos().getIndex())) {
                        //If the location change fails, please resend the original location information.
                        var pg = pItem.ItemCF
                        pg.setPkgid(proto.PKGTypeID.PKG_ITEM_INFO)
                        player.SendPkg(pg)
                    }
                }

                if (itMgr.NeedTrim)
                    itMgr.TrimContainer(proto.ItemContainerType.IC_BAG)
            }
        }
    }
}

ModuleItem.prototype.OnUseItem = function (pkg, hs) {
    if (Verify(pkg) && Verify(hs)) {
        var player = RoleMgr.Find(pkg.getRoleid())
        var tagPlayer = RoleMgr.Find(pkg.getTargetrole())
        if (Verify(player) && Verify(tagPlayer)) {
            var itMgr = player.GetComponent(ComponentType.ECT_ITEMMGR)
            if (Verify(itMgr)) {
                var it = itMgr.FindItemByID(pkg.getItemid())
                if (Verify(it) && it.CanUse(tagPlayer) &&
                    (it.GetContainerPos() == proto.ItemContainerType.IC_BAG || it.GetContainerPos() == proto.ItemContainerType.IC_QUICKITEM)) {
                    if (it.GetType() >= ItemType.Weapon && it.GetType() <= ItemType.Trinket) {
                        var newContainor = proto.ItemContainerType.IC_BODY
                        var newIndex = itMgr.GetEquipPosIdx(it)
                        if (newIndex >= 0) {
                            itMgr.MoveItem(it.GetContainerPos(), it.GetIndexPos(), newContainor, newIndex)
                        }
                    }
                    else if (it.GetType() >= ItemType.FashionHead && it.GetType() <= ItemType.FashionShoes) {
                        var containor = proto.ItemContainerType.IC_FASHION
                        var idx = itMgr.GetEquipPosIdx(it)
                        if (idx >= 0) {
                            itMgr.MoveItem(it.GetContainerPos(), it.GetIndexPos(), containor, idx)
                        }
                    }
                    else {
                        it.UseTo(tagPlayer)
                    }
                }

                if (itMgr.NeedTrim)
                    itMgr.TrimContainer(proto.ItemContainerType.IC_BAG)
            }
        }
    }
}

ModuleItem.prototype.OnUpdate = function (ms) { }

ModuleItem.prototype.OnRelease = function () {

}