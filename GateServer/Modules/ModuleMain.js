const { Module } = require('../../Common/Module.js')

require('../../Common/CommonDefine.js')
require('../../Common/NetWork/NetPacket.js')
var fs = require('fs')
var Config = require('ini').parse(fs.readFileSync('../Config/Server.ini', 'utf-8'))
var EventCenter = require('../../Common/EventCenter.js').GetInstance()
var ManagerServer = require("../../CommonLogic/ManagerServer.js").GetInstance()
var GameServer = require('../../CommonLogic/GameServer.js').GameServer
var GSManager = require('../../CommonLogic/GameServerMgr.js').GetInstance()
var GatePlayer = require('../Logic/GatePlayer.js').GatePlayer
var PlayerMgr = require('../Logic/PlayerMgr.js').GetInstance()
var SysLog = require('../../Common/LogService.js').GetInstance()

ModuleMain = Module.extend({
    ctor: function (solution) {
        this._super(solution)
        this.Name = "ModuleMain"
        this.TimerCount = 0.0
        this.SenderID = null
        this.DelayTime = 0
    }
})

ModuleMain.prototype.OnInitialize = function () {
    //Bind packet processing function
    BIND_PKG_HANDLER(proto.PKGTypeID.PKG_COMP_CLIENT_INFO, this, 'OnClientInfo')
    BIND_PKG_HANDLER(proto.PKGTypeID.PKG_SERVER_HEART_RETURN, this, 'OnHeartReturn')
    BIND_PKG_HANDLER(proto.PKGTypeID.PKG_SERVER_REGIST_RESULT, this, 'OnServerListResult')
    BIND_PKG_HANDLER(proto.PKGTypeID.PKG_SERVER_SHUTDOWN, this, 'OnServerShutDown')
    BIND_PKG_HANDLER(proto.PKGTypeID.PKG_GAME_LOGIN, this, 'OnLogin')
    BIND_PKG_HANDLER(proto.PKGTypeID.PKG_REGIST_ACCOUNT, this, 'OnRegist')
    BIND_PKG_HANDLER(proto.PKGTypeID.PKG_HEART, this, "OnClientHeart")

    //Binding event handling
    EventCenter.RegisterEvent("TcpClientConnect", this, "OnConnectTo")
    EventCenter.RegisterEvent("TcpClientDisConnect", this, "OnTCPClientDisConnect")
    EventCenter.RegisterEvent("ReceiveDateFromTCP", this, 'OnReceiveGameServerDate')

    //Client event handling
    EventCenter.RegisterEvent("ListenerConnect", this, "OnClientConnect")
    EventCenter.RegisterEvent("ListenerClientDisConnect", this, "OnClientDisConnect")
    EventCenter.RegisterEvent("ReceiveDateFromListener", this, 'OnReceiveGameDate')

    this.SenderID = "GateServer" + "_" + Config.GateServer.ServerID
    this.DelayTime = 0
}


ModuleMain.prototype.GeneratorVCode = function () {
    var s = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    var code = ''
    for (var i = 0; i < 32; i++) {
        var n = parseInt(Math.random() * s.length)
        code += s.substring(n, n + 1)
    }
    return code
}

ModuleMain.prototype.OnClientHeart = function (pkg, hs) {
    if (Verify(pkg) && Verify(hs)) {
        pkg.setPkgid(proto.PKGTypeID.PKG_HEART_RESULT)
        hs.Send(pkg)
    }
}

//Game version verification
ModuleMain.prototype.OnClientInfo = function (pkg, hs) {
    if (Verify(pkg) && Verify(hs)) {
        if (pkg.getGameversion() != GAME_VERSION) {
            var rPkg = new proto.GamePKG.NotifyClient()
            rPkg.setPkgid(proto.PKGTypeID.PKG_NOTIFY_CLIENT)
            rPkg.setCode(GAME_VERSION_ERROR)
            rPkg.setInfo("Client version error！")
            hs.Send(rPkg)
        }
    }
}


//Forward the packet to GameServer;
ModuleMain.prototype.SendPkgToGameServer = function (pkg, hs) {
    var typeid = Math.floor(pkg.getPkgid() / MSG_ID_BY_MODULE_SIZE)

    if (!GSManager.SendPkgToModule(typeid, pkg)) {
        SysLog.Log("Send Pkg " + pkg + " Error,GameServer Module " + typeid + " Not Found!")

        var rPkg = new proto.GamePKG.NotifyClient()
        rPkg.setPkgid(proto.PKGTypeID.PKG_NOTIFY_CLIENT)
        rPkg.setCode(SERVER_MODULE_NO_READY)
        rPkg.setInfo("The corresponding function of the server is not started or is under maintenance...")
        hs.Send(rPkg)
    }
}


ModuleMain.prototype.OnRegist = function (pkg, hs) {
    if (Verify(pkg) && Verify(hs)) {
        var username = pkg.getUsername()
        var password = pkg.getPassword()
        if (VerifyEmail(username)) {
            if (VerifyPassword(password)) {
                var player = PlayerMgr.Find(username)
                if (Verify(player)) {
                    var rPkg = new proto.GamePKG.NotifyClient()
                    rPkg.setPkgid(proto.PKGTypeID.PKG_NOTIFY_CLIENT)
                    rPkg.setCode(ACCOUNT_EXISTS)
                    rPkg.setInfo("Account already exists!")
                    hs.Send(rPkg)
                }
                else {
                    //Proofreading verification code
                    var vf = {}
                    vf.IdentifyID = pkg.getVerifyid()
                    vf.IdentifyCode = pkg.getVerifycode()
                    vf.AboutID = username
                    vf.Pass = false
                    EventCenter.RaiseEvent("VerifyIdentifyCode", vf)
                    if (!vf.Pass) {
                        var repk = new proto.GamePKG.NotifyClient()
                        repk.setPkgid(proto.PKGTypeID.PKG_NOTIFY_CLIENT)
                        repk.setCode(IDENTIFYCODE_WRONG)
                        repk.setInfo("Verification code error！")
                        hs.Send(repk)
                        return
                    }

                    player = new GatePlayer()
                    player.SetPlayerID(username)
                    PlayerMgr.Add(username, player)
                    player.SetSender(hs)
                    pkg.setIp(hs.IP)

                    //Forward the packet to GameServer;
                    this.SendPkgToGameServer(pkg, hs)
                }
            }
            else {
                var rPkg = new proto.GamePKG.NotifyClient()
                rPkg.setPkgid(proto.PKGTypeID.PKG_NOTIFY_CLIENT)
                rPkg.setCode(PASSWORD_ERROR)
                rPkg.setInfo("The password must contain a combination of upper and lower case letters and numbers. No special characters can be used. The length is between 8 and 10!")
                hs.Send(rPkg)
            }
        }
        else {
            var rPkg = new proto.GamePKG.NotifyClient()
            rPkg.setPkgid(proto.PKGTypeID.PKG_NOTIFY_CLIENT)
            rPkg.setCode(EMAIL_ADDRESS_ERROR)
            rPkg.setInfo("Wrong account. It must be an email address!")
            hs.Send(rPkg)
        }
    }
}

ModuleMain.prototype.OnLogin = function (pkg, hs) {
    if (Verify(pkg) && Verify(hs)) {
        var username = pkg.getUsername()
        var password = pkg.getPassword()
        if (VerifyEmail(username)) {
            if (VerifyPassword(password)) {
                var player = PlayerMgr.Find(username)
                if (!Verify(player)) {
                    player = new GatePlayer()
                    player.SetPlayerID(username)
                    PlayerMgr.Add(username, player)
                }
                player.SetSender(hs)
                pkg.setIp(hs.IP)

                //Forward the packet to GameServer;
                this.SendPkgToGameServer(pkg, hs)
            }
            else {
                var rPkg = new proto.GamePKG.NotifyClient()
                rPkg.setPkgid(proto.PKGTypeID.PKG_NOTIFY_CLIENT)
                rPkg.setCode(PASSWORD_ERROR)
                rPkg.setInfo("The password must contain a combination of upper and lower case letters and numbers. No special characters can be used. The length is between 8 and 10!")
                hs.Send(rPkg)
            }
        }
        else {
            var rPkg = new proto.GamePKG.NotifyClient()
            rPkg.setPkgid(proto.PKGTypeID.PKG_NOTIFY_CLIENT)
            rPkg.setCode(EMAIL_ADDRESS_ERROR)
            rPkg.setInfo("Wrong account. It must be an email address!")
            hs.Send(rPkg)
        }
    }
}

//server list
ModuleMain.prototype.OnServerListResult = function (pkg, hs) {
    if (Verify(pkg) && Verify(hs)) {
        var gsList = pkg.getServerlistList()
        for (var i = 0; i < gsList.length; ++i) {
            var gs = gsList[i]
            if (gs.getServertype() == SERVER_TYPE_GAME) {
                if (GSManager.Find(gs.getSenderid()) == null) {
                    var gameserver = new GameServer(gs.getIp(), gs.getPort())
                    gameserver.SetType(SERVER_TYPE_GAME)
                    gameserver.SetID(gs.getSenderid())
                    gameserver.ModuleList = gs.getModulelistList()
                    GSManager.Add(gs.getSenderid(), gameserver)
                    gameserver.Connect()
                }
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
    }
}

//Client connects in
ModuleMain.prototype.OnClientConnect = function (tc) {
    if (Verify(tc)) {

    }
}

//Client connection disconnected
ModuleMain.prototype.OnClientDisConnect = function (tc) {
    if (Verify(tc)) {
        var pl = PlayerMgr.FindPlayerBySender(tc)
        if (pl != null) {
            var pd = new proto.ServerPKG.PlayerDisconnection()
            pd.setPkgid(proto.PKGTypeID.PKG_SERVER_PLAYER_DISCONNETION)
            pd.setUserid(pl.PlayerID)
            GSManager.NotifyAll(pd)
            PlayerMgr.Remove(pl.PlayerID)
        }
    }
}

//Received data from client
ModuleMain.prototype.OnReceiveGameDate = function (pkg, tc) {
    var pkgid = pkg.getPkgid()
    if (pkgid > proto.PKGTypeID.PKG_GAME_LOGIN) {
        var id = pkg.getUserid()
        var player = PlayerMgr.Find(id)
        if (!Verify(player) || player.VerifyCode != pkg.getVerifycode()) {
            var rPkg = new proto.GamePKG.NotifyClient()
            rPkg.setPkgid(proto.PKGTypeID.PKG_NOTIFY_CLIENT)
            rPkg.setCode(UNKNOW_ERROR)
            rPkg.setInfo("Invalid data!")
            tc.Send(rPkg)
            tc.Release()
            return
        }

        var typeid = Math.floor(pkgid / MSG_ID_BY_MODULE_SIZE)
        GSManager.SendPkgToModule(typeid, pkg)//Divide according to functions and distribute to different servers
    }
}


//Connect to ManagerServer or GameServer
ModuleMain.prototype.OnConnectTo = function (tc) {
    if (Verify(tc)) {
        var pkg = new proto.ServerPKG.RegServerType()
        pkg.setPkgid(proto.PKGTypeID.PKG_SERVER_REGIST_TYPE)
        pkg.setSenderid(this.SenderID)
        pkg.setServertype(SERVER_TYPE_GATE)
        pkg.setIp(Config.GateServer.IP)
        pkg.setPort(Config.GateServer.PORT)
        pkg.setCuruser(0)
        pkg.setMaxuser(Config.GateServer.MaxUser)
        if (ManagerServer.GetSender() == tc) {
            ManagerServer.SendPkg(pkg)
        }
        else {
            var gs = GSManager.Find(tc.GetID())
            if (Verify(gs)) {
                gs.SendPkg(pkg)
            }
        }
    }
}

//Disconnect from ManagerServer or GameServer
ModuleMain.prototype.OnTCPClientDisConnect = function (tc) {
    if (Verify(tc)) {

    }
}

//Receive data from ManagerServer or GameServer
ModuleMain.prototype.OnReceiveGameServerDate = function (pkg, tc) {
    if (Verify(pkg) && Verify(tc)) {
        var pkgid = pkg.getPkgid()
        if (pkgid > proto.PKGTypeID.PKG_SERVER_MESSAGE_MAX) {
            var id = pkg.getUserid()
            if (pkg.getPkgid() == proto.PKGTypeID.PKG_GAME_LOGIN_RESULT || pkg.getPkgid() == proto.PKGTypeID.PKG_REGIST_RESULT) {
                id = pkg.getUsername()
            }
            var player = PlayerMgr.Find(id)
            if (!Verify(player) && pkg.getPkgid() == proto.PKGTypeID.PKG_NOTIFY_CLIENT)//Return login results
            {
                id = pkg.getUsername()
                player = PlayerMgr.Find(id)
            }
            if (Verify(player)) {
                var sender = player.GetSender()
                if (pkg.getPkgid() == proto.PKGTypeID.PKG_GAME_LOGIN_RESULT || pkg.getPkgid() == proto.PKGTypeID.PKG_REGIST_RESULT)//Return login results
                {
                    var nid = pkg.getUserid()
                    PlayerMgr.Remove(nid) //If you have logged in to your account before, please delete it directly.
                    PlayerMgr.Remove(id)
                    delete player
                    //Landed successfully
                    player = new GatePlayer()
                    player.SetPlayerID(nid)
                    player.SetSender(sender)
                    player.HasLogin = true
                    player.VerifyCode = this.GeneratorVCode()
                    pkg.setVerifycode(player.VerifyCode)
                    PlayerMgr.Add(nid, player)
                }
                else {
                    if (!player.HasLogin) {
                        PlayerMgr.Remove(id)
                    }
                }
                player.SendPkg(pkg)//Forward the packet to the player
            }
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
}

ModuleMain.prototype.OnHeartReturn = function (pkg, tc) {
    if (Verify(pkg) && Verify(tc)) {
        this.DelayTime = Math.floor(process.uptime() * 1000) - pkg.getSendtime()
        ManagerServer.OutTime = 0.0
    }
}

ModuleMain.prototype.OnRelease = function () { }