const { Vector3, Quaternion } = require('math3d')
const { Component, ComponentType } = require('../../../Common/Component')
const { NPCTypes, NPCBornType, NPCAttr, NPCAIType } = require('../../Gen/Types')
const { CombatState } = require('../Components/CombatComponent')
const { Npc } = require('./Npc')
var DataCenter = require('../../Gen/DataCenter.js').GetInstance()
var IDGenerator = require("../../../Common/IDGenerator.js").GetInstance()
require('../../../Common/Util/Util.js')

NpcMgr = Component.extend({
    ctor: function () {
        this._super()
        this.nTypeID = ComponentType.ECT_MAP_NPC_MGR
        this.RateList = []
        this.NpcMap = {}
    }
})

NpcMgr.prototype.FindNpc = function (nid) {
    return this.NpcMap[nid]
}

NpcMgr.prototype.RefershNpc = function (ms) {
    for (var i = 0; i < this.RateList.length; ++i) {
        var rate = this.RateList[i].config
        var elist = this.RateList[i].EntityList

        this.RateList[i].Time += ms / 1000.0

        if (this.RateList[i].Time > rate.BornTime && elist.length < rate.Count) {
            this.RateList[i].Time -= rate.BornTime

            var borns = rate.OnceBone
            if (rate.BornType == NPCBornType.Once) {
                this.RateList[i].Time = -9999999999999.99
                borns = rate.Count
            }
            else if (rate.BornType == NPCBornType.SetTime) {
                if (rate.Count - elist.length < rate.OnceBone && rate.Count - elist.length >= 0)
                    borns = rate.Count - elist.length
            }

            for (var i = 0; i < borns; ++i) {
                var na = DataCenter.GetNpcAttr(rate.NpcID)
                if (Verify(na)) {
                    this.CreateANpc(na, rate, elist)
                }
                else {
                    break
                }
            }

        }

    }
}


NpcMgr.prototype.OnRemove = function (id, npc) {
    var nd = new proto.GamePKG.NpcDead()
    nd.setPkgid(proto.PKGTypeID.PKG_NPC_DEAD)
    nd.setNpcid(id)
    nd.setTypeid(npc.NPCAttr.ID)
    nd.setMapid(this.GetOwner().MapID)
    this.GetOwner().NotifyAllPlayer(nd)
}

NpcMgr.prototype.Remove = function (id) {
    var obj = this.NpcMap[id]
    if (Verify(obj)) {
        for (var i = 0; i < this.RateList.length; ++i) {
            var rate = this.RateList[i].config
            var elist = this.RateList[i].EntityList

            if (obj.NPCAttr.ID == rate.NpcID) {
                for (var n = 0; n < elist.length; ++n) {
                    if (elist[n] == id) {
                        elist.splice(n, 1)
                        break
                    }
                }
            }
        }

        this.OnRemove(id, obj)
        if (Verify(obj.Release)) {
            obj.Release()
        }
        delete this.NpcMap[id]
    }
}


NpcMgr.prototype.CreateANpc = function (npcattr, rate, lis) {
    var npc = new Npc(npcattr)
    npc.NpcID = IDGenerator.GetNewID()
    npc.Map = this.GetOwner()

    var ac = npc.CreateComponent(ComponentType.ECT_ATTR_NPC)
    if (Verify(ac)) {
        ac.SetLevel(npcattr.Level)
        ac.SetHP(npcattr.Life)
        ac.Attack = npcattr.Attack
        ac.Defense = npcattr.Defense
        ac.Experience = npcattr.Experience
        ac.Money = npcattr.Money
        ac.Explosion = npcattr.ItemRate
    }

    var mc = npc.CreateComponent(ComponentType.ECT_MOVE_NPC)

    var randPos = new Vector3(GetRandom(-1.0, 1.0), 0, GetRandom(-1.0, 1.0)).normalize()
    var Pos = new Vector3(rate.BornPosition.x, rate.BornPosition.y, rate.BornPosition.z)

    Pos = Pos.add(randPos.mulScalar(GetRandom(0, rate.OffestRadio)))

    if (Verify(mc)) {
        mc.SetMapID(this.GetOwner().MapID)
        mc.transform.position = Pos

        var dir = rate.Direction
        if (rate.Count > 1)
            dir = GetRandom(-180, 180)

        mc.transform.rotation = Quaternion.Euler(0, dir, 0)
    }

    npc.CreateComponent(ComponentType.ECT_COMBAT_BASE)
    //Different AI components should be generated here according to different types of AI.
    var ai = npc.CreateComponent(ComponentType.ECT_NPC_AI_NORMAL)
    if (Verify(ai)) {
        ai.NpcType = npcattr.Type
        ai.AIType = npcattr.AIType
        ai.PatrolRadio = npcattr.PatrolRadio
        ai.BronPosition = Pos
        ai.ChevyRadio = npcattr.ChevyRadio
        ai.PatrolSpeed = npcattr.PatrolSpeed
        ai.ChevySpeed = npcattr.ChevySpeed
    }

    this.NpcMap[npc.NpcID] = npc
    lis.push(npc.NpcID)

    var pkg = npc.ToNetPKg()
    this.GetOwner().NotifyAllPlayer(pkg)
}

NpcMgr.prototype.OnAttach = function () {
    var map = this.GetOwner()
    if (Verify(map)) {
        var NpcRates = DataCenter.GetNpcRateByMap(map.MapID)
        for (var i = 0; i < NpcRates.length; ++i) {
            var rate = {}
            rate.config = NpcRates[i]
            rate.EntityList = []
            rate.Time = 0
            this.RateList.push(rate)
        }
    }
}

NpcMgr.prototype.OnDetach = function () {
    for (var id in this.NpcMap) {
        this.Remove(id)
    }

    this.NpcMap = {}
}

NpcMgr.prototype.OnUpdate = function (ms) {
    this.RefershNpc(ms)

    for (var id in this.NpcMap) {
        this.NpcMap[id].Update(ms)
        var cc = this.NpcMap[id].GetComponent(ComponentType.ECT_COMBAT)
        if (Verify(cc) && cc.State == CombatState.CS_DEAD) {
            if (cc.DieTime > 0)
                cc.DieTime -= ms / 1000.0
            else
                this.Remove(id)
        }
    }
}

NpcMgr.prototype.SendAllNpc = function (player) {
    if (Verify(player)) {
        for (var id in this.NpcMap) {
            var cc = this.NpcMap[id].GetComponent(ComponentType.ECT_COMBAT)
            if (Verify(cc) && cc.State != CombatState.CS_DEAD) {
                var pkg = this.NpcMap[id].ToNetPKg()
                player.SendPkg(pkg)
            }
        }
    }
}


exports.NpcMgr = NpcMgr