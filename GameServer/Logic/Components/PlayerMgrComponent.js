const { Component, ComponentType } = require('../../../Common/Component')
var RedisMgr = require('../../../Common/DataBase/Redis/RedisMgr').GetInstance()
var fs = require('fs')
var Config = require('ini').parse(fs.readFileSync('../Config/Server.ini', 'utf-8'))
var DataCenter = require('../../Gen/DataCenter').GetInstance()
const { QueryBase } = require('../../../Common/DataBase/MySQL/QueryBase.js')
const { Vector3, Quaternion } = require('math3d')

//Map role management component
PlayerMgrComponent = Component.extend({
	ctor: function () {
		this._super()
		this.nTypeID = ComponentType.ECT_MAP_PLAYER_MGR
		this.ManagerMap = {}
	}
})

PlayerMgrComponent.prototype.Add = function (id, obj) {
	this.ManagerMap[id] = obj
}

PlayerMgrComponent.prototype.Remove = function (id) {
	var obj = this.ManagerMap[id]
	if (Verify(obj)) {
		if (Verify(obj.Release)) {
			obj.Release()
		}
		delete this.ManagerMap[id]
	}
}

PlayerMgrComponent.prototype.Find = function (id) {
	return this.ManagerMap[id]
}

PlayerMgrComponent.prototype.OnUpdate = function (ms) {
	for (var id in this.ManagerMap) {
		this.ManagerMap[id].OnUpdate(ms)
	}
}

PlayerMgrComponent.prototype.GetMap = function () {
	return this.ManagerMap
}

PlayerMgrComponent.prototype.Clear = function () {
	for (var id in this.ManagerMap) {
		this.Remove(id)
	}

	this.ManagerMap = {}
}

PlayerMgrComponent.prototype.OnDetach = function () {
	this.Clear()
}

exports.PlayerMgrComponent = PlayerMgrComponent