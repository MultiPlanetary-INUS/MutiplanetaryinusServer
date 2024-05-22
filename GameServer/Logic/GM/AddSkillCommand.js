const { ComponentType } = require('../../../Common/Component')
const { GmCommand } = require('./GmCommand')
var DataCenter = require('../../Gen/DataCenter.js').GetInstance()
var SysLog = require('../../../Common/LogService.js').GetInstance()
var SkillTables = require('../Skill/SkillTables').GetInstance()

AddSkillCommand = GmCommand.extend({
    ctor: function () {
        this.StrKey = ["AddSkill", "addskill"]
    }
})

AddSkillCommand.prototype.Execute = async function (gmplayer) {
    var targetPlayer = this.GetTarget()
    var SkillID = this.GetParam1()
    var Level = this.GetParam2()

    if (Verify(targetPlayer) && Verify(SkillID) && Verify(Level) && SkillID > 0) {
        Level = Math.max(1, Level)

        var SkillMgr = targetPlayer.GetComponent(ComponentType.ECT_SKILLMGR)
        var SkillData = DataCenter.GetSkillData(SkillID)
        if (Verify(SkillMgr) && Verify(SkillData)) {
            var skill = SkillMgr.GetSkill(SkillID)
            if (!Verify(skill)) {
                skill = SkillTables.CreateSkill(SkillID)
            }

            if (Verify(skill)) {
                skill.Level = Level
                SkillMgr.AddSkill(skill, true)

                //The result is returned to GM
                var cm = new proto.GamePKG.ChatMessage()
                cm.setPkgid(proto.PKGTypeID.PKG_CHAT_MESSAGE)
                cm.setUserid(gmplayer.AccountID)
                cm.setRoleid(0)
                cm.setChannelid(proto.CHATChannel.CT_SYSTEM)
                cm.setContent("player:" + targetPlayer.RoleInfo.getRolename() + "[" + targetPlayer.RoleID + "]Add skills" + SkillID + "=>" + Level + "level")
                gmplayer.SendPkg(cm)

                SysLog.Log("Game manager:" + gmplayer.RoleID + "To players:" + targetPlayer.RoleInfo.getRolename() + "[" + targetPlayer.RoleID + "]Add skills" + SkillID + "=>" + Level + "level")
            }
        }

    }
    return false
}

exports.AddSkillCommand = AddSkillCommand