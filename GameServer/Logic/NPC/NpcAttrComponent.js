const { Component, ComponentType } = require('../../../Common/Component')
var RedisMgr = require('../../../Common/DataBase/Redis/RedisMgr').GetInstance()
var fs = require('fs')
var Config = require('ini').parse(fs.readFileSync('../Config/Server.ini', 'utf-8'))
var DataCenter = require('../../Gen/DataCenter').GetInstance()
const { AttrType } = require('../../Gen/Types')

NpcAttrComponent = Component.extend({
    ctor: function () {
        this._super()
        this.nTypeID = ComponentType.ECT_ATTR_NPC
        this.Level = 0
        this.HP = 0
        this.MaxHP = 0
        this.Defense = 0
        this.Attack = 0
        this.Experience = 0
        this.Money = 0
        this.Explosion = []
    }
})

NpcAttrComponent.prototype.GetLevel = function () {
    return this.Level
}

NpcAttrComponent.prototype.SetLevel = function (level) {
    this.Level = level
}

NpcAttrComponent.prototype.GetHP = function () {
    return this.HP
}

NpcAttrComponent.prototype.SetHP = function (hp) {
    this.MaxHP = hp
    this.HP = hp
}

NpcAttrComponent.prototype.GetMaxHP = function () {
    return this.MaxHP
}

NpcAttrComponent.prototype.AddHP = function (value) {
    this.HP += value
    if (this.HP > this.MaxHP)
        this.HP = this.MaxHP
    else if (this.HP <= 0) {
        //die
    }
}

NpcAttrComponent.prototype.OnAttach = function () {
}

NpcAttrComponent.prototype.OnDetach = function () {
}

NpcAttrComponent.prototype.GetAttackMin = function () {
    return this.Attack
}

NpcAttrComponent.prototype.GetAttackMax = function () {
    return this.Attack
}

NpcAttrComponent.prototype.GetDefenseMin = function () {
    return this.Defense
}

NpcAttrComponent.prototype.GetDefenseMax = function () {
    return this.Defense
}

exports.NpcAttrComponent = NpcAttrComponent