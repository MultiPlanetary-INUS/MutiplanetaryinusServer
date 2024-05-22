require("../../../Common/Util/Class.js")
var RoleMgr = require('../Player/RoleMgr.js').GetInstance()
const { Component, ComponentType } = require('../../../Common/Component.js')
var SysLog = require('../../../Common/LogService.js').GetInstance()
var ManagerServer = require("../../../CommonLogic/ManagerServer.js").GetInstance()

GmCommand = Class.extend({
    ctor: function () {
        this.StrKey = []
        this.Content = []
    }
})

GmCommand.prototype.DisearialStr = function (content) {
    this.Content = content.split(' ')
    if (this.Content.length > 0 && this.StrKey.length > 0) {
        var ss = this.Content[0].substring(1)
        for (var i = 0; i < this.StrKey.length; ++i) {
            if (ss == this.StrKey[i])
                return true
        }
    }
    return false
}

GmCommand.prototype.GetTarget = function () {
    if (this.Content.length > 1) {
        return RoleMgr.FindPlayerByName(this.Content[1])
    }
    return null
}

GmCommand.prototype.GetParam1 = function () {
    if (this.Content.length > 2) {
        return parseInt(this.Content[2], 10)
    }
    return 0
}

GmCommand.prototype.GetParam2 = function () {
    if (this.Content.length > 3) {
        return parseInt(this.Content[3], 10)
    }
    return 0
}

GmCommand.prototype.Execute = function (gmplayer) {
    var target = this.GetTarget()
    if (Verify(target)) {

    }
    return false
}

LevelUp = GmCommand.extend({
    ctor: function () {
        this.StrKey = ["LevelUp", "levelup"]
    }
})

LevelUp.prototype.Execute = async function (gmplayer) {
    var player = this.GetTarget()
    if (Verify(player)) {
        var oldLevel = player.GetLevel()
        player.LevelUp()
        var newLevel = player.GetLevel()
        if (newLevel > oldLevel) {
            var act = player.GetComponent(ComponentType.ECT_ATTR)
            var Attr = act.Attr
            Attr.setPkgid(proto.PKGTypeID.PKG_ROLE_INFO)
            await act.SaveToRedis()
            player.NotifyAround(Attr)//Send attribute changes to all surrounding players

            var src = new proto.ServerPKG.ServerRoleAttrChange()
            src.setPkgid(proto.PKGTypeID.PKG_SERVER_ROLE_ATTR_CHANGE)
            src.setUserid(player.AccountID)
            src.setRoleid(player.RoleID)
            src.setServerid(G_SOLUTION.Name)
            ManagerServer.SendPkg(src)

            //The result is returned to GM
            var cm = new proto.GamePKG.ChatMessage()
            cm.setPkgid(proto.PKGTypeID.PKG_CHAT_MESSAGE)
            cm.setUserid(gmplayer.AccountID)
            cm.setRoleid(0)
            cm.setChannelid(proto.CHATChannel.CT_SYSTEM)
            cm.setContent("Players:" + player.RoleInfo.getRolename() + "[" + player.RoleID + "]Level changes" + oldLevel + "=>" + newLevel)
            gmplayer.SendPkg(cm)

            SysLog.Log("Game manager:" + gmplayer.RoleID + "Adjust players:" + player.RoleInfo.getRolename() + "[" + player.RoleID + "]level" + oldLevel + "=>" + newLevel)
        }
    }
    return false
}

SetLevel = GmCommand.extend({
    ctor: function () {
        this.StrKey = ["SetLevel", "setlevel"]
    }
})

SetLevel.prototype.Execute = async function (gmplayer) {
    var player = this.GetTarget()
    var level = this.GetParam1()
    if (Verify(player) && Verify(level) && level > 0) {
        var oldLevel = player.GetLevel()
        player.SetLevel(level)
        var newLevel = player.GetLevel()
        if (newLevel != oldLevel) {
            var act = player.GetComponent(ComponentType.ECT_ATTR)
            var Attr = act.Attr
            Attr.setPkgid(proto.PKGTypeID.PKG_ROLE_INFO)
            await act.SaveToRedis()
            player.NotifyAround(Attr)//Send attribute changes to all surrounding players

            var src = new proto.ServerPKG.ServerRoleAttrChange()
            src.setPkgid(proto.PKGTypeID.PKG_SERVER_ROLE_ATTR_CHANGE)
            src.setUserid(player.AccountID)
            src.setRoleid(player.RoleID)
            src.setServerid(G_SOLUTION.Name)
            ManagerServer.SendPkg(src)

            //The result is returned to GM
            var cm = new proto.GamePKG.ChatMessage()
            cm.setPkgid(proto.PKGTypeID.PKG_CHAT_MESSAGE)
            cm.setUserid(gmplayer.AccountID)
            cm.setRoleid(0)
            cm.setChannelid(proto.CHATChannel.CT_SYSTEM)
            cm.setContent("Players:" + player.RoleInfo.getRolename() + "[" + player.RoleID + "]Level changes" + oldLevel + "=>" + newLevel)
            gmplayer.SendPkg(cm)

            SysLog.Log("Game manager:" + gmplayer.RoleID + "Adjust players:" + player.RoleInfo.getRolename() + "[" + player.RoleID + "]level" + oldLevel + "=>" + newLevel)
        }
    }
    return false
}

exports.GmCommand = GmCommand
exports.LevelUp = LevelUp
exports.SetLevel = SetLevel