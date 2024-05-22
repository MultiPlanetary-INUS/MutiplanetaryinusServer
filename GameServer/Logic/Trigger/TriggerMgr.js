const { Component, ComponentType } = require('../../../Common/Component')
var TriggerFactory = require('./TriggerFactory').GetInstance()
var QueryBase = require('../../../Common/DataBase/MySQL/QueryBase').QueryBase

TriggerMgr = Component.extend({
    ctor: function () {
        this._super()
        this.nTypeID = ComponentType.ECT_PLAYER_TRIGGER_MGR
        this.TriggerMap = []
    }
})

TriggerMgr.prototype.Add = function (trig) {
    if (Verify(trig)) {
        trig.SetOwner(this.GetOwner())
        this.TriggerMap.push(trig)
        this.OnAddTrigger(trig)
    }
}

TriggerMgr.prototype.Remove = function (trig) {
    for (var i = 0; i < this.TriggerMap.length; ++i) {
        if (trig == this.TriggerMap[i]) {
            this.OnRemoveTrigger(trig)
            trig.SetOwner(null)
            this.TriggerMap.splice(i, 1)
            break
        }
    }
}

//Delete triggers related to specified tasks
TriggerMgr.prototype.RemoveQuestTrigger = function (quest) {
    if (Verify(quest)) {
        var removelist = []
        for (var i = 0; i < this.TriggerMap.length; ++i) {
            if (quest == this.TriggerMap[i].Quest) {
                removelist.push(this.TriggerMap[i])
            }
        }

        for (var i = 0; i < removelist.length; ++i) {
            this.Remove(removelist[i])
        }
    }
}

TriggerMgr.prototype.RemoveByType = function (tp) {
    var trig = this.FindTriggerByType(tp)
    if (Verify(trig))
        this.Remove(trig)
}

TriggerMgr.prototype.AddTriggerType = function (tp) {
    var trig = TriggerFactory.Create(tp)
    if (Verify(trig)) {
        this.Add(trig)
    }
}

TriggerMgr.prototype.FindTriggerByType = function (tp) {
    for (var i = 0; i < this.TriggerMap.length; ++i) {
        if (tp == this.TriggerMap[i].GetType()) {
            return this.TriggerMap[i]
        }
    }

    return null
}

TriggerMgr.prototype.OnAddTrigger = function (trig) {

}

TriggerMgr.prototype.OnRemoveTrigger = function (trig) {

}

TriggerMgr.prototype.OnUpdate = function (ms) {
    for (var i = 0; i < this.TriggerMap.length; ++i) {
        this.TriggerMap[i].OnUpdate(ms)
    }
}

TriggerMgr.prototype.OnDetach = function () {
    for (var i = 0; i < this.TriggerMap.length; ++i) {
        this.TriggerMap[i].SetOwner(null)
    }

    this.TriggerMap = []
}

TriggerMgr.prototype.RaiseEvent = function (p1, p2, p3) {
    for (var i = 0; i < this.TriggerMap.length; ++i) {
        this.TriggerMap[i].RaiseEvent(p1, p2, p3)
    }
}

exports.TriggerMgr = TriggerMgr