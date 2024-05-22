const { Component, ComponentType } = require('../../../Common/Component')
var RedisMgr = require('../../../Common/DataBase/Redis/RedisMgr').GetInstance()
var fs = require('fs')
var Config = require('ini').parse(fs.readFileSync('../Config/Server.ini', 'utf-8'))
var DataCenter = require('../../Gen/DataCenter').GetInstance()
const { QueryBase } = require('../../../Common/DataBase/MySQL/QueryBase.js')
var sd = require('silly-datetime')


QuestStorage = Component.extend({
    ctor: function () {
        this._super()
        this.mLastStoreTime = 0
        this.nTypeID = ComponentType.ECT_PLAYER_QUEST_MGR
    }
})

QuestStorage.prototype.ReStore = function () {
    var quest = this.GetOwner()
    if (Verify(quest) && Verify(quest.GetOwner())) {
        var q = new QueryBase()
        q.SQLString = "Select * From quest Where RoleID=" + quest.GetOwner().RoleID + " And QuestID=" + quest.ID
        q.Execute(function (result) {
            if (Verify(result) && result.length > 0) {
                quest.AcceptTime = new Date(result[0].AcceptTime).getTime()
                quest.State = result[0].State

                var ct = [result[0].Content1, result[0].Content2, result[0].Content3]
                for (var i = 0; i < quest.QuestContent.length && i < 3; ++i) {
                    quest.QuestContent[i].Param3 = ct[i]
                }
            }
        })
    }
}

QuestStorage.prototype.Store = function () {
    var quest = this.GetOwner()
    if (Verify(quest) && quest.bModify && quest.GetOwner() != null) {
        var pro = 0
        var con = []
        //The maximum number of tentative tasks is 3
        for (var i = 0; i < 3; ++i) {
            if (i < quest.QuestContent.length) {
                con.push(quest.QuestContent[i].Param3)
            }
            else
                con.push(0)
        }

        var q = new QueryBase()
        q.SQLString = "Call UpdateQuest(" + quest.GetOwner().RoleID + ", " + quest.ID + ", " + quest.State + "," + pro + "," + con[0] + "," + con[1] + "," + con[2] + ")"
        q.Execute(function (result) {
            quest.bModify = false
        })
    }
}

QuestStorage.prototype.Delete = function () {
    var quest = this.GetOwner()
    if (Verify(quest)) {
        var q = new QueryBase()
        q.SQLString = "Delete From quest Where RoleID=" + quest.GetOwner().RoleID + " And QuestID=" + quest.ID
        q.Execute(function (result) { })
    }
}

QuestStorage.prototype.OnUpdate = function (ms) {
    this.mLastStoreTime += ms
    if (this.mLastStoreTime >= Config.GameServer.AutoSaveTime * 1000) {
        this.Store()

        this.mLastStoreTime = 0
    }
}


QuestStorage.prototype.OnDetach = function () {
    this.Store()
}

exports.QuestStorage = QuestStorage