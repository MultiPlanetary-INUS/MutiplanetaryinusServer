var net = require('net')
var CallBackFunc = require('../CallBackFunc.js').CallBackFunc
var EventCenter = require('../EventCenter.js').GetInstance()
var DeSerialize = require('./NetPacket.js').DeSerialize
var Serialize = require('./NetPacket.js').Serialize

function TcpClient () {
	this.TcpClient = null
	this.LogService = null
	this.ID = null
	this.bConnected = false
	this.bListener = false
	this.Buffer = Buffer.alloc(1024 * 4, 0)
	this.BufferOffest = 0
	this.IP = null
	this.Port = null
	this.IgnoreProtoID = {}
	this.IgnoreProtoID[proto.PKGTypeID.PKG_PLAYER_CONTROL] = true
	this.IgnoreProtoID[proto.PKGTypeID.PKG_NPC_MOVE] = true
}

TcpClient.prototype.SetIsListener = function (b) {
	this.bListener = b
}

TcpClient.prototype.Connected = function () {
	return this.bConnected
}

TcpClient.prototype.OnConnect = function () {
	this.bConnected = true
	var EventName = this.bListener ? "ListenerConnect" : "TcpClientConnect"
	EventCenter.RaiseEvent(EventName, this)
}

TcpClient.prototype.GetID = function () {
	return this.ID
}

TcpClient.prototype.SetID = function (id) {
	this.ID = id
}

TcpClient.prototype.OnReceiveData = function (data) {
	if (!Buffer.isBuffer(data)) {
		return
	}

	data.copy(this.Buffer, this.BufferOffest, 0, data.length)
	this.BufferOffest += data.length

	while (this.BufferOffest > 8) {
		const head = Buffer.alloc(4, 0)
		this.Buffer.copy(head, 0, 0, 4)
		const length = head.readInt32LE()
		if (this.BufferOffest < length + 8) {
			delete head
			break
		}
		this.Buffer.copy(head, 0, 4, 8)
		const PkgID = head.readInt32LE()

		const Body = Buffer.alloc(length, 0)
		this.Buffer.copy(Body, 0, 8, length + 8)
		this.Buffer.copy(this.Buffer, 0, length + 8, this.BufferOffest)
		this.BufferOffest -= length + 8

		var pkg = DeSerialize(PkgID, Body)
		if (Verify(pkg)) {
			if (Verify(this.LogService) && this.IgnoreProtoID[pkg.getPkgid()] != true) {
				this.LogService.Log("Receive Data From " + this.ID, pkg)
			}
			EventCenter.RaiseEvent(PkgID, pkg, this)

			var EventName = this.bListener ? "ReceiveDateFromListener" : "ReceiveDateFromTCP"
			EventCenter.RaiseEvent(EventName, pkg, this)
		}

		delete Body
		delete head
		delete pkg
	}
}

TcpClient.prototype.OnClose = function (data) {
	this.bConnected = false
	if (Verify(this.LogService)) {
		this.LogService.Log('DisConnection: ' + this.ID)
	}

	var EventName = this.bListener ? "ListenerClientDisConnect" : "TcpClientDisConnect"
	EventCenter.RaiseEvent(EventName, this)
}

TcpClient.prototype.Release = function () {
	this.TcpClient.destroy()
}

TcpClient.prototype.Send = function (pkg) {
	if (Verify(pkg)) {
		var buf = Serialize(pkg)
		const headBuf = Buffer.alloc(8, 0)
		headBuf.writeInt32LE(buf.length, 0)
		headBuf.writeInt32LE(pkg.getPkgid(), 4)
		this.TcpClient.write(headBuf)
		this.TcpClient.write(buf)
		if (Verify(this.LogService) && this.IgnoreProtoID[pkg.getPkgid()] != true) {
			this.LogService.Log("Send Data to " + this.ID, pkg)
		}
		delete headBuf
		delete buf
		delete pkg
	}
}

TcpClient.prototype.SetClient = function (sock) {
	if (Verify(sock)) {
		this.TcpClient = sock
	}
}

TcpClient.prototype.Connect = function (ip, port) {
	this.TcpClient = new net.Socket()

	var OnConnect = new CallBackFunc(this, "OnConnect")
	var OnReceiveData = new CallBackFunc(this, "OnReceiveData")
	var OnClose = new CallBackFunc(this, "OnClose")

	this.IP = ip
	this.Port = port

	this.TcpClient.connect(port, ip, function () {
		OnConnect.Execute()
	})

	this.TcpClient.on('data', function (data) {
		OnReceiveData.Execute(data)
	})

	this.TcpClient.on('close', function () {
		OnClose.Execute()
	})
	if (Verify(this.LogService)) {
		this.LogService.Log("Connect To " + this.ID)
	}
}

TcpClient.prototype.SetLogSystem = function (log) {
	delete this.LogService
	if (Verify(log)) {
		this.LogService = log
	}
}

exports.TcpClient = TcpClient
