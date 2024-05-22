const { Component, ComponentType } = require('../../../Common/Component')
var RedisMgr = require('../../../Common/DataBase/Redis/RedisMgr').GetInstance()
var fs = require('fs')
var Config = require('ini').parse(fs.readFileSync('../Config/Server.ini', 'utf-8'))
var DataCenter = require('../../Gen/DataCenter').GetInstance()
const { QueryBase } = require('../../../Common/DataBase/MySQL/QueryBase.js')
var sd = require('silly-datetime')


ItemStorage = Component.extend({
    ctor: function () {
        this._super()
        this.mLastStoreTime = 0
        this.nTypeID = ComponentType.ECT_ITEM_STORAGE
    }
})

//Only used when the item changes ownership to ensure that the attributes of the item remain unchanged.
ItemStorage.prototype.ReStore = function () {
    var item = this.GetOwner()
    if (Verify(item)) {
        var q = new QueryBase()
        q.SQLString = "Select * From roleitem Where ItemID=" + item.ItemCF.getItemid()
        q.Execute(function (result) {
            if (Verify(result) && result.length > 0) {
                item.ItemCF.setPkgid(proto.PKGTypeID.PKG_ITEM_INFO)
                item.ItemCF.setCount(result[0].Count)
                item.ItemCF.setDurability(result[0].Durability)
                item.ItemCF.setDurabilitymax(result[0].DurabilityMax)
                item.ItemCF.setDuration(result[0].Duration)
                item.ItemCF.setTimesremain(result[0].TimesRemain)
            }
        })
    }
}

ItemStorage.prototype.Store = function () {
    var item = this.GetOwner()
    if (Verify(item) && item.bModify && item.GetOwnerID() != null) {
        var ItemCF = item.ItemCF
        if (Verify(ItemCF)) {
            var q = new QueryBase()

            q.SQLString = "CALL UpdateItem(" + ItemCF.getItemid() + "," + ItemCF.getRoleid() + "," + ItemCF.getTypeid() + "," + ItemCF.getCount() + "," +
                ItemCF.getContainer() + "," + ItemCF.getIndex() + "," + ItemCF.getBinded() + "," + ItemCF.getDurability() + "," + ItemCF.getDurabilitymax() +
                "," + ItemCF.getDuration() + "," + ItemCF.getTimesremain() + "," + ItemCF.getLocked() + ",\'" +
                sd.format(new Date(ItemCF.getGettime(), 'YYYY-MM-DD HH:mm:ss')) + "\'" +
                ",\'" + sd.format(new Date(ItemCF.getLocktime(), 'YYYY-MM-DD HH:mm:ss')) + "\')"

            q.Execute(function (result) {
                item.bModify = false
            })
        }
    }
}

ItemStorage.prototype.Delete = function () {
    var item = this.GetOwner()
    if (Verify(item)) {
        var ItemCF = item.ItemCF
        if (Verify(ItemCF)) {
            var q = new QueryBase()

            q.SQLString = "Delete From roleItem Where ItemID=" + ItemCF.getItemid()

            q.Execute(function (result) { })
        }
    }
}

ItemStorage.prototype.OnUpdate = function (ms) {
    this.mLastStoreTime += ms
    if (this.mLastStoreTime >= Config.GameServer.AutoSaveTime * 1000) {
        this.Store()

        this.mLastStoreTime = 0
    }
}


ItemStorage.prototype.OnDetach = function () {
    this.Store()
}

exports.ItemStorage = ItemStorage