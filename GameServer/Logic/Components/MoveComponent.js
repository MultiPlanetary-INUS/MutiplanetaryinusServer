const { Component, ComponentType } = require('../../../Common/Component')
var RedisMgr = require('../../../Common/DataBase/Redis/RedisMgr').GetInstance()
var fs = require('fs')
var Config = require('ini').parse(fs.readFileSync('../Config/Server.ini', 'utf-8'))
var DataCenter = require('../../Gen/DataCenter').GetInstance()
const { QueryBase } = require('../../../Common/DataBase/MySQL/QueryBase.js')
const { Vector3, Quaternion, Transform } = require('math3d')


MoveComponent = Component.extend({
    ctor: function () {
        this._super()
        this.nTypeID = ComponentType.ECT_MOVE_ROLE
        this.transform = new Transform(Vector3.zero, Quaternion.identity)

        this.MapId = 0
        this.bModify = false
        this.MoveSpeed = 0
        this.MoveTime = 0
        this.TotalMove = 0
        this.mLastStoreTime = 0
    }
})

MoveComponent.prototype.SetMapID = function (id) {
    this.MapId = id
    this.bModify = this.MapId != id
}


MoveComponent.prototype.Distance = function (pos) {
    var p1 = new Vector3(this.transform.position.x, 0, this.transform.position.z)
    var p2 = new Vector3(pos.x, 0, pos.z)
    return p1.distanceTo(p2)
}

MoveComponent.prototype.SetPosition = function (pos) {
    this.transform.position = pos
    this.bModify = true
}

MoveComponent.prototype.Store = function () {
    if (this.bModify) {
        var q = new QueryBase()
        //更新地图与位置
        q.SQLString = "Update rolesattr set MapID=" + this.MapId + ", PosX=" + this.transform.position.x + ", PosY=" + this.transform.position.y +
            ", PosZ=" + this.transform.position.z + ", Direction=" + this.transform.rotation.eulerAngles.y + " Where RoleID=" + this.GetOwner().RoleID

        var THIS = this
        q.Execute(function (result) {
            THIS.bModify = false
        })
    }
}

MoveComponent.prototype.OnAttach = function () {
    var atc = this.objOwner.GetComponent(ComponentType.ECT_ATTR)
    if (Verify(atc))//Get the player's map and coordinates from the attribute component
    {
        this.MapId = atc.Attr.getMapid()
        this.transform.position = new Vector3(atc.Attr.getPosx(), atc.Attr.getPosy(), atc.Attr.getPosz())
        this.transform.rotation = Quaternion.Euler(0, atc.Attr.getDirection(), 0)
    }
}

MoveComponent.prototype.OnDetach = function () {
    this.Store()
}

MoveComponent.prototype.OnUpdate = function (ms) {
    this.mLastStoreTime += ms
    if (this.mLastStoreTime >= Config.GameServer.AutoSaveTime * 1000) {
        this.Store()

        this.mLastStoreTime = 0
    }
}

exports.MoveComponent = MoveComponent