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
var RoleMgr = require('../Logic/Player/RoleMgr').GetInstance()

ModuleMain = Module.extend({
    ctor: function (solution) {
        this._super(solution)
        this.Name = "ModuleMain"
        this.SenderID = null
        this.DelayTime = 0
        this.TimerCount = 0.0
    }
})

ModuleMain.prototype.OnInitialize = function () {
    //Bind packet processing function
    BIND_PKG_HANDLER(proto.PKGTypeID.PKG_SERVER_HEART_RETURN, this, 'OnHeartReturn')
    BIND_PKG_HANDLER(proto.PKGTypeID.PKG_SERVER_REGIST_RESULT, this, 'OnServerListResult')
    BIND_PKG_HANDLER(proto.PKGTypeID.PKG_SERVER_SHUTDOWN, this, 'OnServerShutDown')
    BIND_PKG_HANDLER(proto.PKGTypeID.PKG_SERVER_PLAYER_DISCONNETION, this, 'OnPlayerDisConnection')
    BIND_PKG_HANDLER(proto.PKGTypeID.PKG_SERVER_ROLE_ATTR_CHANGE, this, 'OnServerNotifyAttrChange')

    //Binding event handling
    EventCenter.RegisterEvent("TcpClientConnect", this, "OnConnectTo")
    EventCenter.RegisterEvent("TcpClientDisConnect", this, "OnTCPClientDisConnect")
    EventCenter.RegisterEvent("ReceiveDateFromTCP", this, 'OnReceiveGameServerDate')

    //GateServer event handling
    EventCenter.RegisterEvent("ListenerConnect", this, "OnClientConnect")
    EventCenter.RegisterEvent("ListenerClientDisConnect", this, "OnClientDisConnect")
    EventCenter.RegisterEvent("ReceiveDateFromListener", this, 'OnReceiveGameDate')

    this.SenderID = "GameServer" + "_" + Config.GameServer.ServerID
    this.DelayTime = 0
    this.TimerCount = 0.0
}

ModuleMain.prototype.OnServerNotifyAttrChange = async function (pkg, hs) {
    if (Verify(pkg) && Verify(hs)) {
        if (pkg.getServerid() != this.Solution.Name)//Notifications not sent by this server
        {
            var role = RoleMgr.Find(pkg.getRoleid())
            if (Verify(role)) {
                var act = role.GetComponent(ComponentType.ECT_ATTR)
                if (Verify(act)) {
                    await act.ReadFromRedis()

                    //Notify surrounding players of attribute changes
                    role.NotifyAround(act.Attr)//Send attribute changes to all surrounding players
                }
            }
        }
    }
}

ModuleMain.prototype.OnPlayerDisConnection = function (pkg, hs) {
    if (Verify(pkg) && Verify(hs)) {
        var userid = pkg.getUserid()
        EventCenter.RaiseEvent("PlayerDisconnect", userid)
    }
}

//server list
ModuleMain.prototype.OnServerListResult = function (pkg, hs) {
    if (Verify(pkg) && Verify(hs)) {
        var gsList = pkg.getServerlistList()
        for (var i = 0; i < gsList.length; ++i) {
            var gs = gsList[i]
            if (gs.getServertype() == SERVER_TYPE_GAME) {
                if (gs.getSenderid() != this.SenderID && GSManager.Find(gs.getSenderid()) == null) {
                    //Different servers can have different functions, and servers communicate through ManagerServer
                    var gameserver = new GameServer(gs.getIp(), gs.getPort())
                    gameserver.SetType(SERVER_TYPE_GAME)
                    GSManager.Add(gs.getSenderid(), gameserver)
                }
            }
            else if (gs.getServertype() == SERVER_TYPE_GATE) {
                //Record the GateServer list and communicate with the client through Gate
                var gateserver = new GameServer(gs.getIp(), gs.getPort())
                gateserver.SetType(SERVER_TYPE_GATE)
                GTManager.Add(gs.getSenderid(), gameserver)
            }
        }
    }
}

//Server is down
ModuleMain.prototype.OnServerShutDown = function (pkg, hs) {
    if (Verify(pkg) && Verify(hs)) {
        if (pkg.getServertype() == SERVER_TYPE_GAME) {
            var gs = GSManager.Find(pkg.getSenderid())
            if (gs != null) {
                SysLog.Log(pkg.getSenderid() + " Is ShutDown, Disconnection!")
            }
            GSManager.Remove(pkg.getSenderid())
        }
        else if (pkg.getServertype() == SERVER_TYPE_GATE) {
            var gt = GTManager.Find(pkg.getSenderid())
            if (gt != null) {
                SysLog.Log(pkg.getSenderid() + " Is ShutDown, Disconnection!")
                //The Gate server is closed, and all player data related to it must be saved and set offline.
            }
            GTManager.Remove(pkg.getSenderid())
        }
    }
}

//GateServer connects in
ModuleMain.prototype.OnClientConnect = function (tc) {
    if (Verify(tc)) {

    }
}

//GateServer connection disconnected
ModuleMain.prototype.OnClientDisConnect = function (tc) {
    if (Verify(tc)) {

    }
}

//Received data from GateServer
ModuleMain.prototype.OnReceiveGameDate = function (pkg, tc) {

}

//Connect to ManagerServer
ModuleMain.prototype.OnConnectTo = function (tc) {
    if (Verify(tc)) {
        var pkg = new proto.ServerPKG.RegServerType()
        pkg.setPkgid(proto.PKGTypeID.PKG_SERVER_REGIST_TYPE)
        pkg.setSenderid(this.SenderID)
        pkg.setServertype(SERVER_TYPE_GAME)
        pkg.setIp(Config.GameServer.IP)
        pkg.setPort(Config.GameServer.PORT)
        pkg.setCuruser(0)
        pkg.setMaxuser(Config.GameServer.MaxUser)
        pkg.setModulelistList(this.Solution.ModuleIDList)
        if (ManagerServer.GetSender() == tc) {
            ManagerServer.SendPkg(pkg)
        }
    }
}

//Disconnect from ManagerServer
ModuleMain.prototype.OnTCPClientDisConnect = function (tc) {
    if (Verify(tc)) {

    }
}

//Receive data from ManagerServer
ModuleMain.prototype.OnReceiveGameServerDate = function (pkg, tc) {
    if (Verify(pkg) && Verify(tc)) {
        if (pkg.getPkgid() > proto.PKGTypeID.PKG_SERVER_MESSAGE_MAX) {

        }
    }
}

ModuleMain.prototype.OnUpdate = function (ms) {
    this.TimerCount += ms
    if (this.TimerCount >= TIME_INTERVAL_CHECK) {
        this.TimerCount -= TIME_INTERVAL_CHECK
        var heart = new proto.ServerPKG.ServerHeart()
        heart.setPkgid(proto.PKGTypeID.PKG_SERVER_HEART)
        heart.setSenderid(this.SenderID)
        heart.setSendtime(Math.floor(process.uptime() * 1000))
        heart.setDelaytime(this.DelayTime)
        ManagerServer.SendPkg(heart)
    }

    RoleMgr.OnUpdate(ms)
}

ModuleMain.prototype.OnHeartReturn = function (pkg, tc) {
    if (Verify(pkg) && Verify(tc)) {
        this.DelayTime = Math.floor(process.uptime() * 1000) - pkg.getSendtime()
        ManagerServer.OutTime = 0.0
    }
}

ModuleMain.prototype.OnRelease = function () {
    RoleMgr.Clear()
}