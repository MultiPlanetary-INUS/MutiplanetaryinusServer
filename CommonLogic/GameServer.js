//
//Other servers call GameServer
//
//

var TcpClient = require("../Common/NetWork/TcpClient.js").TcpClient
var SysLog = require("../Common/LogService.js").GetInstance()
require("../Common/CommonDefine.js")


function GameServer (ip = '127.0.0.1', port = 5000) {
	this.ClientID = null
	this.Sender = null
	this.IP = ip
	this.Port = port
	this.ServerType = SERVER_TYPE_MANAGER
	this.LinkCount = null
	this.LinkMax = null
	this.DelayTime = 0.0
	this.ModuleList = []
	this.OutTime = 0.0
	this.IsManager = false
}

//Connect to GameServer
GameServer.prototype.Connect = function () {
	if (!Verify(this.Sender)) {
		this.Sender = new TcpClient()
		this.Sender.SetLogSystem(SysLog)
		this.Sender.SetID(this.ClientID)
	}
	this.Sender.Connect(this.IP, this.Port)
}


GameServer.prototype.GetType = function () {
	return this.ServerType
}

GameServer.prototype.SetType = function (t) {
	this.ServerType = t
}

GameServer.prototype.GetIP = function () {
	return this.IP
}

GameServer.prototype.Set = function (ip, port) {
	this.IP = ip
	this.Port = port
}

GameServer.prototype.GetPort = function () {
	return this.Port
}

GameServer.prototype.SetID = function (id) {
	this.ClientID = id
	if (Verify(this.Sender))
		this.Sender.SetID(this.ClientID)
}

GameServer.prototype.GetID = function () {
	return this.ClientID
}

GameServer.prototype.SetSender = function (obj) {
	this.Sender = obj
	if (Verify(this.Sender)) {
		this.Sender.SetID(this.ClientID)
		this.IsManager = true
	}
}

GameServer.prototype.GetSender = function () {
	return this.Sender
}

GameServer.prototype.SendPkg = function (pkg) {
	if (Verify(this.Sender) && Verify(pkg) && this.Sender.Connected()) {
		this.Sender.Send(pkg)
	}
}

GameServer.prototype.Update = function (ms) {
	this.OutTime += ms
	// if(!this.IsManager && this.OutTime >= TIME_INTERVAL_CHECK_OUT)
	// {
	// 	this.OutTime = 0;
	// 	if(!Verify(this.Sender) || !this.Sender.Connected()){
	// 		this.Connect();
	// 	}
	// }
}

GameServer.prototype.Close = function () {
	if (Verify(this.Sender)) {
		this.Sender.Release()
	}
}

exports.GameServer = GameServer