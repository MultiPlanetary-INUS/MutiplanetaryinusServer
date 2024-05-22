const { Module } = require('../../Common/Module.js')
const { Component, ComponentType } = require('../../Common/Component')
require('../../Common/CommonDefine.js')
require('../../Common/NetWork/NetPacket.js')
var fs = require('fs')
const { Vector3, Quaternion } = require('math3d')
var EventCenter = require('../../Common/EventCenter.js').GetInstance()
var ComponentFactory = require('../../Common/CompontentFactory').GetInstance()
var ServerRole = require('../Logic/Player/ServerRole').ServerRole
var RoleMgr = require('../Logic/Player/RoleMgr').GetInstance()
var SysLog = require('../../Common/LogService.js').GetInstance()
var SceneMgr = require('../Logic/Map/SceneMgr').GetInstance()
var RedisMgr = require('../../Common/DataBase/Redis/RedisMgr').GetInstance()
var ConditionsFactory = require("../Logic/Conditions/ConditionsFactory.js").GetInstance()
require('../Logic/Components/AttrComponent')
require('../Logic/Components/MoveComponent.js')
require('../Logic/Components/PlayerMgrComponent')
const { PlayerCountCondition } = require('../Logic/Conditions/PlayerCountCondition.js')
const { TimeLimitCondition } = require('../Logic/Conditions/TimeLimitConditions.js')
const { TimesLimitCondition } = require('../Logic/Conditions/TimesLimitConditions.js')
const { ConditionType, ActionType } = require('../Gen/Types.js')
const { NpcAttrComponent } = require('../Logic/NPC/NpcAttrComponent.js')
const { NpcMgr } = require('../Logic/NPC/NpcMgr.js')
const { NpcMoveComponent } = require('../Logic/NPC/NpcMoveComponent.js')
const { MapItemMgr } = require('../Logic/Map/MapItemMgr.js')
const { Item } = require('../Logic/Item/Item.js')
const { NPCAI } = require('../Logic/NPC/NpcAI.js')
const { CombatComponent } = require('../Logic/Components/CombatComponent.js')
const { MoveMapAction } = require('../Logic/Actions/MoveMapAction.js')
var ActFactory = require('../Logic/Actions/ActionFactory').GetInstance()

ModuleMap = Module.extend({
    ctor: function (solution) {
        this._super(solution)
        this.Name = "ModuleMap"
        this.ModuleID = GAMESERVER_MODULE_MAP
    }
})

ModuleMap.prototype.OnInitialize = function () {
    ConditionsFactory.RegisterType(ConditionType.PlayerCount, PlayerCountCondition)
    ConditionsFactory.RegisterType(ConditionType.TimeLimit, TimeLimitCondition)
    ConditionsFactory.RegisterType(ConditionType.TimesLimit, TimesLimitCondition)

    //Register component type
    ComponentFactory.RegisterType(ComponentType.ECT_MOVE_ROLE, MoveComponent)
    ComponentFactory.RegisterType(ComponentType.ECT_ATTR_ROLE, AttrComponent)
    ComponentFactory.RegisterType(ComponentType.ECT_MAP_PLAYER_MGR, PlayerMgrComponent)
    ComponentFactory.RegisterType(ComponentType.ECT_MOVE_NPC, NpcMoveComponent)
    ComponentFactory.RegisterType(ComponentType.ECT_ATTR_NPC, NpcAttrComponent)
    ComponentFactory.RegisterType(ComponentType.ECT_MAP_NPC_MGR, NpcMgr)
    ComponentFactory.RegisterType(ComponentType.ECT_MAP_ITEM_MGR, MapItemMgr)
    ComponentFactory.RegisterType(ComponentType.ECT_NPC_AI_NORMAL, NPCAI)
    ComponentFactory.RegisterType(ComponentType.ECT_COMBAT_BASE, CombatComponent)


    ActFactory.RegisterType(ActionType.MoveMap, MoveMapAction)

    //Bind packet processing function
    BIND_PKG_HANDLER(proto.PKGTypeID.PKG_ENTER_GAME, this, 'OnEnterGame')
    BIND_PKG_HANDLER(proto.PKGTypeID.PKG_PLAYER_CONTROL, this, 'OnPLayerControl')
    BIND_PKG_HANDLER(proto.PKGTypeID.PKG_CHANGE_MAP, this, 'OnChangeMap')
    BIND_PKG_HANDLER(proto.PKGTypeID.PKG_PICK_UP_ITEM, this, "OnPickUpItem")
    BIND_PKG_HANDLER(proto.PKGTypeID.PKG_ATTACK_INFO, this, "OnAttackInfo")
    EventCenter.RegisterEvent("PlayerDisconnect", this, "OnPlayerDisconnect")


    SceneMgr.Init()
}


//eid  Entity ID
//tid  Entity type ID
//oid  Other auxiliary data
ModuleMap.prototype.GetEntityByType = function (eid, tid, otd) {
    switch (tid) {
        case 1://Player
            return RoleMgr.Find(eid)
        case 2://NPC
            {
                var player = RoleMgr.Find(otd)
                if (Verify(player)) {
                    var map = SceneMgr.GetMapByPlayer(player)
                    if (Verify(map)) {
                        var npm = map.GetComponent(ComponentType.ECT_NPCMGR)
                        if (Verify(npm)) {
                            return npm.FindNpc(eid)
                        }
                    }
                }
            }
            break
        case 3://Map
            {
                var player = RoleMgr.Find(otd)
                if (Verify(player)) {
                    return SceneMgr.GetInstance().TryGetMap(eid, player)
                }
            }
            break
        case 4://Item
        case 5://Quest
    }
    return null
}

ModuleMap.prototype.OnAttackInfo = function (pkg, hs) {
    if (Verify(pkg) && Verify(hs)) {
        var player = RoleMgr.Find(pkg.getRoleid())
        if (Verify(player)) {
            var Attacker = this.GetEntityByType(pkg.getAttackerid(), pkg.getAttackertype(), pkg.getRoleid())
            var BeHiter = this.GetEntityByType(pkg.getBehiterid(), pkg.getBehitertype(), pkg.getRoleid())

            //Only process combat information related to current client players
            if (Verify(Attacker) && Verify(BeHiter) && (Attacker == player || BeHiter == player)) {
                //Temporarily use all client location information
                var amv = Attacker.GetComponent(ComponentType.ECT_MOVE)
                var bmv = BeHiter.GetComponent(ComponentType.ECT_MOVE)
                if (Verify(amv)) {
                    amv.SetPosition(new Vector3(pkg.getAttackposx(), pkg.getAttackposy(), pkg.getAttackposz()))
                }
                if (Verify(bmv)) {
                    bmv.SetPosition(new Vector3(pkg.getBhiterposx(), pkg.getBhiterposy(), pkg.getBhiterposz()))
                }

                var cmbc = BeHiter.GetComponent(ComponentType.ECT_COMBAT)
                if (Verify(cmbc)) {
                    cmbc.BeHit(Attacker, pkg.getAttacktypeid(), pkg)
                }
            }
        }
    }
}

ModuleMap.prototype.OnPickUpItem = function (pkg, hs) {
    if (Verify(pkg) && Verify(hs)) {
        var player = RoleMgr.Find(pkg.getRoleid())
        if (Verify(player)) {
            var itMgr = player.GetComponent(ComponentType.ECT_ITEMMGR)
            var map = SceneMgr.TryGetMap(pkg.getMapid(), player)
            if (Verify(map) && Verify(itMgr)) {
                var im = map.GetComponent(ComponentType.ECT_ITEMMGR)
                if (Verify(im)) {
                    var iif = im.GetItemInfo(pkg.getItemid())
                    if (Verify(iif)) {
                        //Unowned items, your own items, or other people's items can be picked up when the remaining time is less than 180 seconds.
                        if (iif.getRoleid() == 0 || iif.getRoleid() == pkg.getRoleid() || iif.getLifeTime() < 180 * 1000) {
                            var it = new Item()
                            if (it.Create(pkg.getTypeid(), iif.getCount(), pkg.getItemid())) {
                                it.SetOwner(player)
                                var isc = it.CreateComponent(ComponentType.ECT_ITEM_STORAGE)
                                itMgr.AddItem(it, true)
                                im.Remove(pkg.getItemid())
                                if (Verify(isc)) {
                                    isc.ReStore()
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}


ModuleMap.prototype.OnChangeMap = function (pkg, hs) {
    if (Verify(pkg) && Verify(hs)) {
        var player = RoleMgr.Find(pkg.getRoleid())
        if (Verify(player)) {
            var acf = {}
            acf.ActionTypeID = ActionType.MoveMap
            acf.Param1 = pkg.getMapid()
            acf.Param2 = pkg.getPosx()
            acf.Param3 = pkg.getPosz()
            var act = ActFactory.Create(acf)
            if (Verify(act)) {
                act.Execute(player)
            }
        }
    }
}

ModuleMap.prototype.OnPLayerControl = function (pkg, hs) {
    if (Verify(pkg) && Verify(hs)) {
        var player = RoleMgr.Find(pkg.getRoleid())
        if (Verify(player)) {
            var MVC = player.GetComponent(ComponentType.ECT_MOVE)
            if (Verify(MVC)) {
                var ClientPos = new Vector3(pkg.getPosx(), pkg.getPosy(), pkg.getPosz())
                var distance = MVC.Distance(ClientPos)
                if (distance < 1.0)//Directly use client location information within a reasonable moving distance
                {
                    MVC.SetPosition(ClientPos)
                }
                else {
                    //console.log("Location exception needs to be handled by Client:"+ClientPos+"   Server:"+MVC.transform.position);
                    MVC.SetPosition(ClientPos)
                }
                MVC.transform.rotation = Quaternion.Euler(0, pkg.getDirection(), 0)
                var map = SceneMgr.TryGetMap(MVC.MapId, player)
                if (Verify(map)) {
                    map.NotifyAllPlayer(pkg)
                }
            }
        }
    }
}

ModuleMap.prototype.OnPlayerDisconnect = function (uid) {
    var role = RoleMgr.FindPlayerByUserID(uid)
    var rid = role != null ? role.RoleID : 0
    SceneMgr.RemovePlayer(uid, rid)
}

ModuleMap.prototype.OnEnterGame = async function (pkg, hs) {
    if (Verify(pkg) && Verify(hs)) {
        var player = RoleMgr.Find(pkg.getRoleid())
        if (!Verify(player)) {
            //If there are no players, go to Redis to get the player data.
            player = new ServerRole()
            var AccountInfo = await RedisMgr.Read("AccountInfo_" + pkg.getUserid(), proto.PKGTypeID.PKG_REGIST_RESULT)
            var RoleInfo = await RedisMgr.Read("RoleInfo_" + pkg.getRoleid(), proto.PKGTypeID.PKG_ROLE_INFO)
            if (!Verify(AccountInfo) || !Verify(RoleInfo)) {
                SysLog.Log("player" + player.RoleID + "Failed to enter the game! May not be logged in normally!")
                player.Release()
                delete player
                return
            }

            player.SetAccountInfo(AccountInfo)
            player.SetRoleInfo(RoleInfo)
            var ac = player.CreateComponent(ComponentType.ECT_ATTR_ROLE)
            await ac.ReadFromRedis()
            if (!Verify(ac.Attr))//No corresponding player attribute found
            {
                SysLog.Log("player" + player.RoleID + "Failed to enter the game!")
                player.Release()
                delete player
                return
            }
            //Read the attributes normally and add the player to the manager.
            RoleMgr.Add(pkg.getRoleid(), player)
        }
        player.CreateComponent(ComponentType.ECT_COMBAT_BASE)
        player.SetSender(hs)
        var mvc = player.CreateComponent(ComponentType.ECT_MOVE_ROLE)
        if (Verify(mvc))//Get the player's map and coordinates from the attribute component
        {
            var map = SceneMgr.TryGetMap(mvc.MapId, player)
            map.AddPlayer(player)
        }

        var skMgr = player.CreateComponent(ComponentType.ECT_SKILL_MANAGER)
        if (Verify(skMgr)) {
            skMgr.ReStore()
        }

        var bfMgr = player.CreateComponent(ComponentType.ECT_BUFFER_MANAGER)
        if (Verify(bfMgr)) {
            bfMgr.ReStore()
        }

        var qstMgr = player.CreateComponent(ComponentType.ECT_PLAYER_QUEST_MGR)
        if (Verify(qstMgr)) {
            qstMgr.ReStore()
        }

        var atc = player.GetComponent(ComponentType.ECT_ATTR)
        if (Verify(atc)) {
            atc.CalculateAttr()
            atc.Notify()
        }
    }
}

ModuleMap.prototype.OnUpdate = function (ms) {
    SceneMgr.OnUpdate(ms)
}

ModuleMap.prototype.OnRelease = function () {
    SceneMgr.Clear()
}