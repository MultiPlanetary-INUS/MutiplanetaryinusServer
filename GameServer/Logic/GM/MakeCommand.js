const { ComponentType } = require('../../../Common/Component')
const { Item } = require('../Item/Item')
const { GmCommand } = require('./GmCommand')
var DataCenter = require('../../Gen/DataCenter.js').GetInstance()
var SysLog = require('../../../Common/LogService.js').GetInstance()

MakeCommand = GmCommand.extend({
    ctor: function () {
        this.StrKey = ["MakeItem", "makeitem"]
    }
})

MakeCommand.prototype.Execute = async function (gmplayer) {
    var targetPlayer = this.GetTarget()
    var ItemTypeID = this.GetParam1()
    var Count = this.GetParam2()

    if (Verify(targetPlayer) && Verify(ItemTypeID) && Verify(Count) && ItemTypeID > 0) {
        Count = Math.max(1, Count)

        var itMgr = targetPlayer.GetComponent(ComponentType.ECT_ITEMMGR)
        var data = DataCenter.GetItemData(ItemTypeID)
        if (Verify(data) && Verify(itMgr)) {
            var cnt = Math.ceil(Count / data.StackLimit)
            for (var i = 0; i < cnt; ++i) {
                var t = Count % data.StackLimit
                var s = (i == 0 && t > 0) ? t : data.StackLimit
                var it = new Item()
                if (it.Create(ItemTypeID, s)) {
                    it.CreateComponent(ComponentType.ECT_ITEM_STORAGE)
                    it.SetOwner(targetPlayer)
                    itMgr.AddItem(it, true)

                    //结果返回给GM
                    var cm = new proto.GamePKG.ChatMessage()
                    cm.setPkgid(proto.PKGTypeID.PKG_CHAT_MESSAGE)
                    cm.setUserid(gmplayer.AccountID)
                    cm.setRoleid(0)
                    cm.setChannelid(proto.CHATChannel.CT_SYSTEM)
                    cm.setContent("Players:" + targetPlayer.RoleInfo.getRolename() + "[" + targetPlayer.RoleID + "]Get props" + it.GetTypeID() + "=>" + it.GetItemCount() + "s")
                    gmplayer.SendPkg(cm)

                    SysLog.Log("Game manager:" + gmplayer.RoleID + "To players:" + targetPlayer.RoleInfo.getRolename() + "[" + targetPlayer.RoleID + "]Add props" + it.GetTypeID() + "=>" + it.GetItemCount() + "s")
                }
            }
        }
    }
    return false
}

exports.MakeCommand = MakeCommand