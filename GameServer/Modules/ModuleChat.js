const { Module } = require('../../Common/Module.js')

require('../../Common/CommonDefine.js')
require('../../Common/NetWork/NetPacket.js')
var EventCenter = require('../../Common/EventCenter.js').GetInstance()
var ManagerServer = require("../../CommonLogic/ManagerServer.js").GetInstance()
var RoleMgr = require('../Logic/Player/RoleMgr').GetInstance()
var SceneMgr = require('../Logic/Map/SceneMgr').GetInstance()
var GmCommandMgr = require("../Logic/GM/GmCommandMgr").GetInstance()

ModuleChat = Module.extend({
    ctor: function (solution) {
        this._super(solution)
        this.Name = "ModuleChat"
        this.ModuleID = GAMESERVER_MODULE_CHAT
    }
})

ModuleChat.prototype.OnInitialize = function () {
    //Bind packet processing function
    BIND_PKG_HANDLER(proto.PKGTypeID.PKG_CHAT_MESSAGE, this, 'OnChatMessage')
}


ModuleChat.prototype.OnChatMessage = function (pkg, hs) {
    if (Verify(pkg) && Verify(hs)) {
        var player = RoleMgr.Find(pkg.getRoleid())
        if (Verify(player)) {
            var content = pkg.getContent()

            if (content.indexOf('$') == 0)//GM
            {
                if (Verify(player.AccountInfo) && player.AccountInfo.getAuthority() > 0)//Determine GM authority
                {
                    if (!GmCommandMgr.Process(content, player)) {
                        pkg.setChannelid(proto.CHATChannel.CT_SYSTEM)
                        pkg.setRoleid(0)
                        pkg.setContent("命令格式错误或者没有权限！")
                        player.SendPkg(pkg)
                    }
                    return
                }
            }
            else if (content.indexOf('@') == 0)//Private letter
            {

            }

            switch (pkg.getChannelid()) {
                case proto.CHATChannel.CT_NORMAL:
                    //Simple forwarding
                    player.NotifyAround(pkg)
                    break
                case proto.CHATChannel.CT_GUILD:
                    break
                case proto.CHATChannel.CT_TEAM:
                    break
                case proto.CHATChannel.CT_WORLD:
                    break
            }
        }
    }
}


ModuleChat.prototype.OnUpdate = function (ms) {

}


ModuleChat.prototype.OnRelease = function () {

}