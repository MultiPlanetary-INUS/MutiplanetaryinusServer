const { Component, ComponentType } = require('../../../Common/Component')
var QueryBase = require('../../../Common/DataBase/MySQL/QueryBase').QueryBase
var QuestTable = require('./QuestTable.js').GetInstance()

QuestMgr = Component.extend({
    ctor: function () {
        this._super()
        this.nTypeID = ComponentType.ECT_PLAYER_TRIGGER_MGR
        this.QuestList = []
    }
})

QuestMgr.prototype.Add = function (quest) {
    if (Verify(quest)) {
        quest.SetOwner(this.GetOwner())
        this.QuestList.push(quest)
        this.OnAddQuest(quest)
    }
}

QuestMgr.prototype.Remove = function (quest) {
    for (var i = 0; i < this.QuestList.length; ++i) {
        if (quest == this.QuestList[i]) {
            this.OnRemoveQuest(quest)
            quest.SetOwner(null)
            this.QuestList.splice(i, 1)
            break
        }
    }
}

QuestMgr.prototype.RemoveByType = function (tp) {
    var quest = this.FindQuestByType(tp)
    if (Verify(quest))
        this.Remove(quest)
}

QuestMgr.prototype.FindQuestByType = function (tp) {
    for (var i = 0; i < this.QuestList.length; ++i) {
        if (tp == this.QuestList[i].ID) {
            return this.QuestList[i]
        }
    }

    return null
}

QuestMgr.prototype.OnUpdate = function (ms) {
    for (var i = 0; i < this.QuestList.length; ++i) {
        this.QuestList[i].OnUpdate(ms)
    }
}

QuestMgr.prototype.OnDetach = function () {
    for (var i = 0; i < this.QuestList.length; ++i) {
        this.QuestList[i].Store()
    }

    this.QuestList = []
}

QuestMgr.prototype.IsDone = function (id) {
    if (Verify(this.objOwner)) {
        var hc = this.objOwner.GetComponent(ComponentType.ECT_HISTORY)
        if (Verify(hc)) {
            return Verify(hc.GetQuestHistory(id))
        }
    }
    return false
}

QuestMgr.prototype.CanAccept = function (id) {
    //Existing tasks cannot be accepted repeatedly
    if (Verify(this.FindQuestByType(id)))
        return false

    var quest = QuestTable.GetQuest(id)
    if (Verify(quest)) {
        //Completed tasks cannot be accepted if they are non-repeatable tasks
        if (this.IsDone(id)) {
            if (quest.bRepeat) {
                return quest.CanAccept(this.objOwner)
            }
            return false
        }
        else {
            return quest.CanAccept(this.objOwner)
        }
    }

    return false
}

QuestMgr.prototype.Accept = function (qid) {
    var quest = QuestTable.CreateQuest(qid)
    if (Verify(quest)) {
        this.Add(quest)
        this.OnAcceptQuest(quest)
    }
}


QuestMgr.prototype.OnAddQuest = function (quest) {

}

QuestMgr.prototype.OnRemoveQuest = function (quest) {

}

QuestMgr.prototype.OnFinishQuest = function (quest) {
    if (Verify(quest)) {
        this.objOwner.RaiseEvent("CompleteQuest", quest)
    }
}

QuestMgr.prototype.OnAcceptQuest = function (quest) {
    if (Verify(this.objOwner)) {
        for (var i = 0; i < quest.AcceptActions.length; ++i) {
            quest.AcceptActions[i].Execute(this.objOwner)
        }
        quest.AcceptTime = Date.now()
        quest.bModify = true
        quest.Store()
    }
}

QuestMgr.prototype.ReStore = function () {
    var player = this.GetOwner()
    if (Verify(player)) {
        var THIS = this
        var q = new QueryBase()
        q.SQLString = "Select * From quest Where RoleID=" + player.RoleID
        q.Execute(function (result) {
            if (Verify(result) && result.length > 0) {
                for (var n = 0; n < result.length; ++n) {
                    var quest = QuestTable.CreateQuest(result[n].QuestID)
                    if (Verify(quest)) {
                        quest.AcceptTime = new Date(result[n].AcceptTime).getTime()
                        quest.State = result[n].State

                        var ct = [result[n].Content1, result[n].Content2, result[n].Content3]
                        for (var i = 0; i < quest.QuestContent.length && i < 3; ++i) {
                            quest.QuestContent[i].Param3 = ct[i]
                        }

                        THIS.Add(quest)
                    }
                }
            }
        })
    }
}

QuestMgr.prototype.CanFinish = function (quest) {
    if (Verify(quest)) {
        if (!quest.IsCompleted())
            return false

        if (quest.IsFailed())
            return false

        return true
    }
    return false
}

QuestMgr.prototype.Finish = function (qid, choice = -1) {
    var quest = this.FindQuestByType(qid)
    if (!this.CanFinish(quest))
        return false

    quest.Finish(choice)

    this.OnFinishQuest(quest)

    var hc = this.objOwner.GetComponent(ComponentType.ECT_HISTORY)
    if (Verify(hc)) {
        hc.AddQuestHistory(qid)
    }

    this.Remove(quest)
}

QuestMgr.prototype.IsFailed = function (qid) {
    var qst = this.FindQuestByType(qid)
    if (Verify(qst)) {
        return qst.IsFailed()
    }
    return false
}

QuestMgr.prototype.FindHistory = function (qid) {
    if (Verify(this.objOwner)) {
        var hc = this.objOwner.GetComponent(ComponentType.ECT_HISTORY)
        if (Verify(hc)) {
            return hc.GetQuestHistory(id)
        }
    }
    return false
}

exports.QuestMgr = QuestMgr