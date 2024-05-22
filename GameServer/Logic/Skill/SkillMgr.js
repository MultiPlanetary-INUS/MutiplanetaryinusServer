const { Component, ComponentType } = require("../../../Common/Component")
var SkillTables = require('./SkillTables').GetInstance()

SkillMgr = Component.extend({
    ctor: function () {
        this._super()
        this.nTypeID = ComponentType.ECT_SKILL_MANAGER
        this.SkillMap = {}
    }
})

SkillMgr.prototype.Notify = function (skill, player) {
    if (Verify(player) && Verify(skill)) {
        var ads = new proto.GamePKG.AddSkill()
        ads.setPkgid(proto.PKGTypeID.PKG_ADD_SKILL)
        ads.setUserid(player.AccountID)
        ads.setRoleid(this.GetOwner().RoleID)
        ads.setSkillid(skill.GetSkillID())
        ads.setSkilllevel(skill.Level)

        player.SendPkg(ads)
    }
}

SkillMgr.prototype.SyncSkill = function (player) {
    if (Verify(player)) {
        for (var id in this.SkillMap) {
            this.Notify(this.SkillMap[id], player)
        }
    }
}

SkillMgr.prototype.AddSkill = function (skill, store = false) {
    if (Verify(skill)) {
        skill.Owner = this.GetOwner()
        this.SkillMap[skill.GetSkillID()] = skill

        this.Notify(skill, this.GetOwner())

        if (store) {
            var q1 = new QueryBase()
            q1.SQLString = "Call UpdateSkill(" + this.GetOwner().RoleID + ", " + skill.SKData.ID + ", " + skill.Level + ")"
            q1.Execute(function (result) { })
        }
    }
}

SkillMgr.prototype.GetSkill = function (id) {
    return this.SkillMap[id]
}

SkillMgr.prototype.RemoveSkill = function (id) {
    var sk = this.SkillMap[id]
    if (Verify(sk)) {
        var dds = new proto.GamePKG.DelSkill()
        dds.setPkgid(proto.PKGTypeID.PKG_DEL_SKILL)
        dds.setUserid(this.GetOwner().AccountID)
        dds.setRoleid(this.GetOwner().RoleID)
        dds.setSkillid(sk.GetSkillID())

        this.GetOwner().NotifyAround(dds)//Other clients also need to record skill information for simultaneous release

        this.OnRemoveSkill(sk)
        delete this.SkillMap[id]
    }
}


SkillMgr.prototype.OnRemoveSkill = function (skill) {
    var player = this.GetOwner()
    if (Verify(player) && Verify(skill)) {
        var q = new QueryBase()
        q.SQLString = "Delete From skill Where RoleID=" + player.RoleID + " And SkillID=" + skill.SKData.ID
        q.Execute(function (result) { })
    }
}

SkillMgr.prototype.ReStore = function () {
    var player = this.GetOwner()
    if (Verify(player)) {
        var THIS = this
        var q = new QueryBase()
        q.SQLString = "Select * From skill Where RoleID=" + player.RoleID
        q.Execute(function (result) {
            if (Verify(result) && result.length > 0) {
                for (var n = 0; n < result.length; ++n) {
                    var skill = SkillTables.CreateSkill(result[n].SkillID)
                    if (Verify(skill)) {
                        skill.Level = result[n].SkillLevel
                        THIS.AddSkill(skill, false)
                    }
                }
            }
        })
    }
}

SkillMgr.prototype.OnUpdate = function (ms) {
    for (var id in this.SkillMap) {
        this.SkillMap[id].OnUpdate(ms)
    }
}


exports.SkillMgr = SkillMgr