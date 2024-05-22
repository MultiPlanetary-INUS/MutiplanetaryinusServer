const { Module } = require('../../Common/Module.js')

require('../../Common/CommonDefine.js')
require('../../Common/NetWork/NetPacket.js')
var fs = require('fs')
var Config = require('ini').parse(fs.readFileSync('../Config/Server.ini', 'utf-8'))
var EventCenter = require('../../Common/EventCenter.js').GetInstance()
var ManagerServer = require("../../CommonLogic/ManagerServer.js").GetInstance()
var GSManager = require('../../CommonLogic/GameServerMgr.js').GetInstance()
var GTManager = require('../../CommonLogic/GateServerMgr.js').GetInstance()
var GameServer = require('../../CommonLogic/GameServer.js').GameServer

ModuleRelation = Module.extend({
    ctor: function (solution) {
        this._super(solution)
        this.Name = "ModuleRelation"
        this.ModuleID = GAMESERVER_MODULE_RELATION
    }
})

ModuleRelation.prototype.OnInitialize = function () {
    //Bind packet processing function
}

ModuleRelation.prototype.OnUpdate = function (ms) { }

ModuleRelation.prototype.OnRelease = function () {

}