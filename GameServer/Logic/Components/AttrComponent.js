const { Component, ComponentType } = require('../../../Common/Component')
var RedisMgr = require('../../../Common/DataBase/Redis/RedisMgr').GetInstance()
var fs = require('fs')
var Config = require('ini').parse(fs.readFileSync('../Config/Server.ini', 'utf-8'))
var DataCenter = require('../../Gen/DataCenter').GetInstance()
const { QueryBase } = require('../../../Common/DataBase/MySQL/QueryBase.js')
const { AttrType } = require('../../Gen/Types')


class RoleAttrCF {
    constructor() {
        this.Zero()
    }

    Zero () {
        this.HP = 0
        this.MP = 0
        this.AttackMin = 0
        this.AttackMax = 0
        this.DefenseMin = 0
        this.DefenseMax = 0
        this.Power = 0
        this.Accurate = 0
        this.Resistibility = 0
        this.Vitality = 0
        this.Lucky = 0
        this.Cooling = 0
    }

    Add (other) {
        var rf = new RoleAttrCF()
        rf.HP = this.HP + other.HP
        rf.MP = this.MP + other.MP
        rf.AttackMin = this.AttackMin + other.AttackMin
        rf.AttackMax = this.AttackMax + other.AttackMax
        rf.DefenseMin = this.DefenseMin + other.DefenseMin
        rf.DefenseMax = this.DefenseMax + other.DefenseMax
        rf.Power = this.Power + other.Power
        rf.Accurate = this.Accurate + other.Accurate
        rf.Resistibility = this.Resistibility + other.Resistibility
        rf.Vitality = this.Vitality + other.Vitality
        rf.Lucky = this.Lucky + other.Lucky
        rf.Cooling = this.Cooling + other.Cooling
        return rf
    }
}


AttrComponent = Component.extend({
    ctor: function () {
        this._super()
        this.nTypeID = ComponentType.ECT_ATTR_ROLE
        this.Attr = null
        this.bModify = false
        this.mLastStoreTime = 0

        this.BaseAttr = new RoleAttrCF()
        this.EquipAttr = new RoleAttrCF()
        this.BufferAttr = new RoleAttrCF()
        this.ResultAttr = null
    }
})

AttrComponent.prototype.CalculateBaseAttr = function () {
    if (Verify(this.Attr)) {
        var level = this.Attr.getRolelevel()
        var voc = this.GetOwner().RoleInfo.getVocation()
        var levelinfo = DataCenter.GetLevelInfo(level)
        var vocinfo = DataCenter.GetVocationSetting(voc)

        var a = vocinfo.HPCoefficient * levelinfo.BaseHP
        var b = levelinfo.BaseHP * vocinfo.GrowUpHP * (level - 1)
        this.BaseAttr.HP = Math.floor(a + (b + (a + b * vocinfo.HPGrowUpValue) * vocinfo.HPCoefficient))

        a = vocinfo.MPCoefficient * levelinfo.BaseMP
        b = levelinfo.BaseMP * vocinfo.GrowUpMP * (level - 1)
        this.BaseAttr.MP = Math.floor(a + (b + (a + b * vocinfo.MPGrowUpValue) * vocinfo.MPCoefficient))

        a = vocinfo.AttackCoefficient * levelinfo.Attack
        b = levelinfo.Attack * vocinfo.GrowUpAttack * (level - 1)
        this.BaseAttr.AttackMin = Math.floor(a + (b + (a + b * vocinfo.AttackGrowUpValue) * vocinfo.AttackCoefficient))
        this.BaseAttr.AttackMax = this.BaseAttr.AttackMin

        a = vocinfo.DefenseCoefficient * levelinfo.Defense
        b = levelinfo.Defense * vocinfo.GrowUpDefense * (level - 1)
        this.BaseAttr.DefenseMin = Math.floor(a + (b + (a + b * vocinfo.DefenseGrowUpValue) * vocinfo.DefenseCoefficient))
        this.BaseAttr.DefenseMax = this.BaseAttr.DefenseMin

        this.SendBaseAttr(this.GetOwner())
    }
}

AttrComponent.prototype.SendBaseAttr = function (player) {
    if (Verify(player)) {
        var binfo = new proto.GamePKG.RoleAttrValue()
        binfo.setPkgid(proto.PKGTypeID.PKG_ROLE_BASE_ATTR)
        binfo.setUserid(player.AccountID)
        binfo.setRoleid(this.GetOwner().RoleID)
        binfo.setHp(this.BaseAttr.HP)
        binfo.setMp(this.BaseAttr.MP)
        binfo.setAttackmin(this.BaseAttr.AttackMin)
        binfo.setAttackmax(this.BaseAttr.AttackMax)
        binfo.setDefensemin(this.BaseAttr.DefenseMin)
        binfo.setDefensemax(this.BaseAttr.DefenseMax)
        binfo.setPower(this.BaseAttr.Power)
        binfo.setAccurate(this.BaseAttr.Accurate)
        binfo.setResistibility(this.BaseAttr.Resistibility)
        binfo.setVitality(this.BaseAttr.Vitality)
        binfo.setLucky(this.BaseAttr.Lucky)
        binfo.setCooling(this.BaseAttr.Cooling)
        player.SendPkg(binfo)
    }
}

AttrComponent.prototype.CalculateAttr = function () {
    this.CalculateBaseAttr()
    this.ResultAttr = this.BaseAttr.Add(this.EquipAttr).Add(this.BufferAttr)
}

AttrComponent.prototype.SetAttr = function (attr) {
    if (Verify(attr)) {
        this.Attr = attr
        this.Notify()
    }
}

AttrComponent.prototype.GetLevel = function () {
    if (Verify(this.Attr))
        return this.Attr.getRolelevel()

    return 0
}

AttrComponent.prototype.SetLevel = function (level) {
    if (Verify(this.Attr)) {
        this.Attr.setRolelevel(level)
        this.CalculateAttr()
        this.bModify = true
        this.Notify()
    }
}

AttrComponent.prototype.LevelUp = function () {
    if (Verify(this.Attr)) {
        var level = this.Attr.getRolelevel() + 1
        var li = DataCenter.GetLevelInfo(level)
        var voc = this.GetOwner().RoleInfo.getVocation()
        if (Verify(li) && Verify(voc)) {
            this.Attr.setRolelevel(level)
            this.CalculateAttr()
            this.Attr.setCurhp(this.GetMaxHP())
            this.Attr.setCurmp(this.GetMaxMP())
            this.Attr.setFreepoint(this.Attr.getFreepoint() + 5)
            this.bModify = true
            this.Notify()
        }
    }
}

AttrComponent.prototype.GetCurExp = function () {
    return this.Attr.getCurexp()
}

AttrComponent.prototype.GetCurLevelUpExp = function () {
    var level = this.Attr.getRolelevel()
    var li = DataCenter.GetLevelInfo(level)
    if (Verify(li)) {
        return li.Exp
    }
    return -1
}

AttrComponent.prototype.AddExp = function (l) {
    this.Attr.setCurexp(this.Attr.getCurexp() + l)
    this.bModify = true
    while (this.Attr.getCurexp() >= this.GetCurLevelUpExp()) {
        this.Attr.setCurexp(this.Attr.getCurexp() - this.GetCurLevelUpExp())
        this.LevelUp()
    }

    this.Notify()
}

AttrComponent.prototype.AddMoney = function (m) {
    var money = this.Attr.getMoney() + m
    if (money < 0)
        this.money = 0

    this.Attr.setMoney(money)
    this.bModify = true

    this.Notify()
}

AttrComponent.prototype.GetHP = function () {
    if (Verify(this.Attr))
        return this.Attr.getCurhp()

    return 0
}

AttrComponent.prototype.SetHP = function (hp) {
    if (Verify(this.Attr)) {
        this.Attr.setCurhp(hp)
        this.bModify = true
        this.Notify()
    }
}

AttrComponent.prototype.GetMaxHP = function () {
    var hp = 0

    if (Verify(this.ResultAttr)) {
        hp = this.ResultAttr.HP + Math.floor(this.ResultAttr.HP * this.ResultAttr.Vitality * 0.001)
    }
    return hp
}

AttrComponent.prototype.AddHP = function (value) {
    if (Verify(this.Attr)) {
        var maxhp = this.GetMaxHP()
        var hp = this.GetHP()
        if (hp + value > maxhp)
            value = maxhp - hp
        if (hp + value < 0)
            value = -hp

        this.SetHP(hp + value)
    }
}

AttrComponent.prototype.GetMP = function () {
    var mp = 0

    if (Verify(this.Attr)) {
        mp = this.Attr.getCurmp()
    }

    return mp
}

AttrComponent.prototype.SetMP = function (mp) {
    if (Verify(this.Attr)) {
        this.Attr.setCurmp(mp)
        this.bModify = true
        this.Notify()
    }
}

AttrComponent.prototype.GetMaxMP = function () {
    if (Verify(this.ResultAttr)) {
        return this.ResultAttr.MP
    }
    return 0
}

AttrComponent.prototype.AddMP = function (value) {
    if (Verify(this.Attr)) {
        var maxmp = this.GetMaxMP()
        var mp = this.GetMP()
        if (mp + value > maxmp)
            value = maxmp - mp
        if (mp + value < 0)
            value = -mp

        this.SetMP(value + mp)
    }
}


AttrComponent.prototype.Store = function () {
    if (Verify(this.Attr) && this.bModify) {
        var q = new QueryBase()
        //The attribute component does not update the location data, only reads it
        // q.SQLString = "Update rolesattr set Level="+this.Attr.getRolelevel()+", CurHP="+this.Attr.getCurhp()+", CurMP="+this.Attr.getCurmp()+
        //               ", CurExp="+this.Attr.getCurexp()+", Money="+this.Attr.getMoney()+", GuildID="+this.Attr.getGuidid()+", GuildLevel="+
        //               this.Attr.getGuidlevel()+", MapID="+this.Attr.getMapid()+", PosX="+this.Attr.getPosx()+", PosY="+this.Attr.getPosy()+
        //               ", PosZ="+this.Attr.getPosz()+", Direction="+this.Attr.getDirection()+" Where RoleID="+this.GetOwner().RoleID;

        q.SQLString = "Update rolesattr set Level=" + this.Attr.getRolelevel() + ", CurHP=" + this.GetHP() + ", CurMP=" + this.Attr.getCurmp() +
            ", CurExp=" + this.Attr.getCurexp() + ", Money=" + this.Attr.getMoney() + ", GuildID=" + this.Attr.getGuidid() + ", GuildLevel=" +
            this.Attr.getGuidlevel() + ", Power=" + this.Attr.getPower() + ", Accurate=" + this.Attr.getAccurate() + ", Resistibility=" + this.Attr.getResistibility() + ", Vitality=" + this.Attr.getVitality() +
            ", Lucky=" + this.Attr.getLucky() + ", Cooling=" + this.Attr.getCooling() + ", FreePoint=" + this.Attr.getFreepoint() + " Where RoleID=" + this.GetOwner().RoleID

        q.Execute(function (result) { })
    }
}

AttrComponent.prototype.OnUpdate = function (ms) {
    this.mLastStoreTime += ms
    if (this.mLastStoreTime >= Config.GameServer.AutoSaveTime * 1000) {
        this.Store()

        this.mLastStoreTime = 0
    }
}

AttrComponent.prototype.Notify = async function () {
    if (Verify(this.Attr)) {
        this.Attr.setPkgid(proto.PKGTypeID.PKG_ROLE_ATTR)
        this.GetOwner().NotifyAround(this.Attr)


        await this.SaveToRedis()
    }
}


AttrComponent.prototype.SaveToRedis = async function () {
    //Pass attributes to other Modules through Redis
    await RedisMgr.Write("RoleAttr_" + this.Attr.getRoleid(), this.Attr)
}

AttrComponent.prototype.ReadFromRedis = async function () {
    //Read from Redis
    this.Attr = await RedisMgr.Read("RoleAttr_" + this.objOwner.RoleID, proto.PKGTypeID.PKG_ROLE_ATTR)
}

AttrComponent.prototype.ReStore = function () {
    var THIS = this
    var q = new QueryBase()
    q.SQLString = "Select * From rolesattr Where RoleID=" + this.GetOwner().RoleID
    q.Execute(function (result) {
        var RoleAttr = new proto.GamePKG.RoleAttr()
        RoleAttr.setPkgid(proto.PKGTypeID.PKG_ROLE_ATTR)
        RoleAttr.setUserid(THIS.GetOwner().AccountID)
        RoleAttr.setRoleid(THIS.GetOwner().RoleID)
        if (Verify(result) && result.length > 0) {
            RoleAttr.setRolelevel(result[0].Level)
            RoleAttr.setCurhp(result[0].CurHP)
            RoleAttr.setCurmp(result[0].CurMP)
            RoleAttr.setCurexp(result[0].CurExp)
            RoleAttr.setMoney(result[0].Money)
            RoleAttr.setGuidid(result[0].GuildID)
            RoleAttr.setGuidlevel(result[0].GuildLevel)
            RoleAttr.setMapid(result[0].MapID)
            RoleAttr.setPosx(result[0].PosX)
            RoleAttr.setPosy(result[0].PosY)
            RoleAttr.setPosz(result[0].PosZ)
            RoleAttr.setDirection(result[0].Direction)
            RoleAttr.setPower(result[0].Power)
            THIS.BaseAttr.Power = result[0].Power
            RoleAttr.setAccurate(result[0].Accurate)
            THIS.BaseAttr.Accurate = result[0].Accurate
            RoleAttr.setResistibility(result[0].Resistibility)
            THIS.BaseAttr.Resistibility = result[0].Resistibility
            RoleAttr.setVitality(result[0].Vitality)
            THIS.BaseAttr.Vitality = result[0].Vitality
            RoleAttr.setLucky(result[0].Lucky)
            THIS.BaseAttr.Lucky = result[0].Lucky
            RoleAttr.setCooling(result[0].Cooling)
            THIS.BaseAttr.Cooling = result[0].Cooling
            RoleAttr.setFreepoint(result[0].FreePoint)
        }
        else {
            var RoleInfo = THIS.GetOwner().GetRoleInfo()
            var v = RoleInfo.getVocation()
            var map = DataCenter.GetBornMapByVocation(v)
            var level = DataCenter.GetLevelInfo(1)

            RoleAttr.setRolelevel(1)
            THIS.SetAttr(RoleAttr)
            THIS.CalculateAttr()
            RoleAttr.setCurhp(THIS.GetMaxHP())
            RoleAttr.setCurmp(THIS.GetMaxMP())
            RoleAttr.setCurexp(0)
            RoleAttr.setMoney(0)
            RoleAttr.setGuidid(0)
            RoleAttr.setGuidlevel(0)
            RoleAttr.setMapid(map.ID)
            RoleAttr.setPosx(map.BornPosition.x)
            RoleAttr.setPosy(map.BornPosition.y)
            RoleAttr.setPosz(map.BornPosition.z)
            RoleAttr.setDirection(map.Direction)
            RoleAttr.setPower(0)
            RoleAttr.setAccurate(0)
            RoleAttr.setResistibility(0)
            RoleAttr.setVitality(0)
            RoleAttr.setLucky(0)
            RoleAttr.setCooling(0)
            RoleAttr.setFreepoint(0)

            var q = new QueryBase()
            q.SQLString = "Insert rolesattr set Level=" + RoleAttr.getRolelevel() + ", CurHP=" + RoleAttr.getCurhp() + ", CurMP=" + RoleAttr.getCurmp() +
                ", CurExp=" + RoleAttr.getCurexp() + ", Money=" + RoleAttr.getMoney() + ", GuildID=" + RoleAttr.getGuidid() + ", GuildLevel=" +
                RoleAttr.getGuidlevel() + ", MapID=" + RoleAttr.getMapid() + ", PosX=" + RoleAttr.getPosx() + ", PosY=" + RoleAttr.getPosy() +
                ", PosZ=" + RoleAttr.getPosz() + ", Direction=" + RoleAttr.getDirection() + ", RoleID=" + THIS.GetOwner().RoleID
            q.Execute(function (result) { })
        }
        THIS.SetAttr(RoleAttr)
        THIS.CalculateAttr()
        THIS.Notify()
    })
}

AttrComponent.prototype.OnAttach = function () {
}

AttrComponent.prototype.OnDetach = function () {
    this.Store()
}

AttrComponent.prototype.AddAttr = function (eqa) {
    if (Verify(eqa)) {
        switch (eqa.Type) {
            case AttrType.Attr_HP:
                {
                    this.EquipAttr.HP += eqa.Value1
                    break
                }
            case AttrType.Attr_MP:
                {
                    this.EquipAttr.MP += eqa.Value1
                    break
                }
            case AttrType.Attr_Attack:
                {
                    if (!Verify(eqa.Value2) || eqa.Value2 == 0) {
                        this.EquipAttr.AttackMin += eqa.Value1
                        this.EquipAttr.AttackMax += eqa.Value1
                    }
                    else {
                        this.EquipAttr.AttackMin += eqa.Value1
                        this.EquipAttr.AttackMax += eqa.Value2
                    }
                    break
                }
            case AttrType.Attr_Defense:
                {
                    if (!Verify(eqa.Value2) || eqa.Value2 == 0) {
                        this.EquipAttr.DefenseMin += eqa.Value1
                        this.EquipAttr.DefenseMax += eqa.Value1
                    }
                    else {
                        this.EquipAttr.DefenseMin += eqa.Value1
                        this.EquipAttr.DefenseMax += eqa.Value2
                    }
                    break
                }
            case AttrType.Attr_Accurate:
                {
                    this.EquipAttr.Accurate += eqa.Value1
                    break
                }
            case AttrType.Attr_Resistibility:
                {
                    this.EquipAttr.Resistibility += eqa.Value1
                    break
                }
            case AttrType.Attr_Power:
                {
                    this.EquipAttr.Power += eqa.Value1
                    break
                }
            case AttrType.Attr_Vitality:
                {
                    this.EquipAttr.Vitality += eqa.Value1
                    break
                }
            case AttrType.Attr_Lucky:
                {
                    this.EquipAttr.Lucky += eqa.Value1
                    break
                }
            case AttrType.Attr_Cooling:
                {
                    this.EquipAttr.Cooling += eqa.Value1
                    break
                }
        }
    }
}

AttrComponent.prototype.RaiseEvent = function (eid, param1, param2) {
    if (eid == "EquitItem" || eid == "UnEquipItem") {
        var ItMgr = this.GetOwner().GetComponent(ComponentType.ECT_ITEMMGR)
        if (Verify(ItMgr)) {
            this.EquipAttr.Zero()
            var ItemList = ItMgr.ItemList
            var SetIDList = []

            for (var n = 0; n < ItemList.length; ++n) {
                if (ItemList[n].GetContainerPos() == proto.ItemContainerType.IC_BODY || ItemList[n].GetContainerPos() == proto.ItemContainerType.IC_FASHION) {
                    var itd = ItemList[n].ItemData

                    if (Verify(itd)) {
                        for (var i = 0; i < itd.ItemAttr.length; ++i) {
                            var eqa = itd.ItemAttr[i]
                            this.AddAttr(eqa)
                        }

                        if (ItemList[n].IsSetItem() && ItemList[n].ActiveSetAttr()) {
                            var bC = false
                            for (var m = 0; m < SetIDList.length; ++m) {
                                if (SetIDList[m] == itd.SetID) {
                                    bC = true
                                    break
                                }
                            }
                            if (!bC) {
                                var sd = DataCenter.GetItemSet(itd.SetID)
                                if (sd != null) {
                                    for (var s = 0; s < sd.GroupAttr.length; ++s) {
                                        this.AddAttr(sd.GroupAttr[s])
                                    }
                                }
                                SetIDList.push(itd.SetID)
                            }
                        }
                    }
                }
            }

            this.CalculateAttr()
        }
    }
}

AttrComponent.prototype.GetAttackMin = function () {
    var atk = 0
    if (Verify(this.ResultAttr)) {
        atk = this.ResultAttr.AttackMin + Math.floor(this.ResultAttr.AttackMin * this.ResultAttr.Power * 0.001)
    }

    return atk
}

AttrComponent.prototype.GetAttackMax = function () {
    var atk = 0
    if (Verify(this.ResultAttr)) {
        atk = this.ResultAttr.AttackMax + Math.floor(this.ResultAttr.AttackMax * this.ResultAttr.Power * 0.001)
    }

    return atk
}

AttrComponent.prototype.GetDefenseMin = function () {
    var df = 0
    if (Verify(this.ResultAttr)) {
        df = this.ResultAttr.DefenseMin + Math.floor(this.ResultAttr.DefenseMin * this.ResultAttr.Resistibility * 0.001)
    }

    return df
}

AttrComponent.prototype.GetDefenseMax = function () {
    var df = 0
    if (Verify(this.ResultAttr)) {
        df = this.ResultAttr.DefenseMax + Math.floor(this.ResultAttr.DefenseMax * this.ResultAttr.Resistibility * 0.001)
    }

    return df
}

AttrComponent.prototype.SetPower = function (n) {
    if (Verify(this.Attr) && n != this.Attr.getPower()) {
        this.Attr.setPower(n)
        this.BaseAttr.Power = n
        this.CalculateAttr()
    }
}

AttrComponent.prototype.SetAccurate = function (n) {
    if (Verify(this.Attr) && n != this.Attr.getAccurate()) {
        this.Attr.setAccurate(n)
        this.BaseAttr.Accurate = n
        this.CalculateAttr()
    }
}

AttrComponent.prototype.SetResistibility = function (n) {
    if (Verify(this.Attr) && n != this.Attr.getResistibility()) {
        this.Attr.setResistibility(n)
        this.BaseAttr.Resistibility = n
        this.CalculateAttr()
    }
}

AttrComponent.prototype.SetVitality = function (n) {
    if (Verify(this.Attr) && n != this.Attr.getVitality()) {
        this.Attr.setVitality(n)
        this.BaseAttr.Vitality = n
        this.CalculateAttr()
    }
}

AttrComponent.prototype.SetLucky = function (n) {
    if (Verify(this.Attr) && n != this.Attr.getLucky()) {
        this.Attr.setLucky(n)
        this.BaseAttr.Lucky = n
        this.CalculateAttr()
    }
}

AttrComponent.prototype.SetCooling = function (n) {
    if (Verify(this.Attr) && n != this.Attr.getCooling()) {
        this.Attr.setCooling(n)
        this.BaseAttr.Cooling = n
        this.CalculateAttr()
    }
}

exports.AttrComponent = AttrComponent