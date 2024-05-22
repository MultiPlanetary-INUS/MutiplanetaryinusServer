const { Module } = require('../../Common/Module.js')

require('../../Common/CommonDefine.js')
require('../../Common/NetWork/NetPacket.js')
var EventCenter = require('../../Common/EventCenter.js').GetInstance()
var GTManager = require('../../CommonLogic/GateServerMgr.js').GetInstance()
var GSManager = require('../../CommonLogic/GameServerMgr.js').GetInstance()
var GameServer = require('../../CommonLogic/GameServer.js').GameServer

ModuleMain = Module.extend({
    ctor: function (solution) {
        this._super(solution)
        this.Name = "ModuleMain"
    }
})

ModuleMain.prototype.OnInitialize = function () {
    //Binding message processing
    BIND_PKG_HANDLER(proto.PKGTypeID.PKG_SERVER_HEART, this, 'OnHeart')
    BIND_PKG_HANDLER(proto.PKGTypeID.PKG_SERVER_REGIST_TYPE, this, 'OnRegistServerType')

    //Binding message processing
    BIND_PKG_HANDLER(proto.PKGTypeID.PKG_SERVER_ROLE_ATTR_CHANGE, this, 'OnServerRoleAttrChange')

    //Binding event handling
    EventCenter.RegisterEvent("ListenerClientDisConnect", this, 'OnTCPDisConnect')
}


//Forward directly to other game servers
ModuleMain.prototype.OnServerRoleAttrChange = function (pkg, hs) {
    if (Verify(pkg) && Verify(hs)) {
        var GSmap = GSManager.GetMap()
        for (var id in GSmap) {
            var gas = GSmap[id]
            gas.SendPkg(pkg)
        }
    }
}


ModuleMain.prototype.OnHeart = function (pkg, tc) {
    if (Verify(pkg) && Verify(tc)) {
        pkg.setPkgid(proto.PKGTypeID.PKG_SERVER_HEART_RETURN)

        var ser = GTManager.Find(pkg.getSenderid())
        if (ser == null) {
            ser = GSManager.Find(pkg.getSenderid())
        }

        if (ser != null) {
            ser.OutTime = 0.0
            ser.DelayTime = pkg.getDelaytime()
            ser.SendPkg(pkg)
        }
    }
}

ModuleMain.prototype.OnRegistServerType = function (pkg, tc) {
    if (Verify(pkg) && Verify(tc)) {
        var gs = new GameServer(pkg.getIp(), pkg.getPort())
        gs.SetType(pkg.getServertype())
        gs.SetID(pkg.getSenderid())
        gs.ModuleList = pkg.getModulelistList()
        gs.SetSender(tc)

        if (pkg.getServertype() == SERVER_TYPE_GATE) {
            GTManager.Add(gs.GetID(), gs)
        }
        else if (pkg.getServertype() == SERVER_TYPE_GAME) {
            GSManager.Add(gs.GetID(), gs)
        }
    }

    this.SendServerList()
}

ModuleMain.prototype.SendServerList = function () {
    var res = new proto.ServerPKG.RegServerResult()
    res.setPkgid(proto.PKGTypeID.PKG_SERVER_REGIST_RESULT)
    res.setSenderid("ManagerServer")

    var GTmap = GTManager.GetMap()
    var GSmap = GSManager.GetMap()


    for (var id in GTmap) {
        var gas = GTmap[id]
        var rg = new proto.ServerPKG.RegServerType()
        rg.setIp(gas.GetIP())
        rg.setPort(gas.GetPort())
        rg.setServertype(SERVER_TYPE_GATE)
        rg.setSenderid(gas.GetID())
        res.addServerlist(rg)
    }
    for (var id in GSmap) {
        var gas = GSmap[id]
        var rg = new proto.ServerPKG.RegServerType()
        rg.setIp(gas.GetIP())
        rg.setPort(gas.GetPort())
        rg.setServertype(SERVER_TYPE_GAME)
        rg.setSenderid(gas.GetID())
        rg.setModulelistList(gas.ModuleList)
        res.addServerlist(rg)
    }


    for (var id in GTmap) {
        var gas = GTmap[id]
        gas.SendPkg(res)
    }
    for (var id in GSmap) {
        var gas = GSmap[id]
        gas.SendPkg(res)
    }

}

ModuleMain.prototype.OnUpdate = function (ms) {
    var GTmap = GTManager.GetMap()
    var rmList = []
    for (var id in GTmap) {
        var gas = GTmap[id]
        if (gas.OutTime >= TIME_INTERVAL_CHECK_OUT) {
            gas.Close()
            rmList.push(id)
        }
    }
    for (var i = 0; i < rmList.length; ++i) {
        this.OnTCPDisConnect(rmList[i].GetSender())
    }


    var GSmap = GSManager.GetMap()
    rmList = []
    for (var id in GSmap) {
        var gas = GSmap[id]
        if (gas.OutTime >= TIME_INTERVAL_CHECK_OUT) {
            gas.Close()
            rmList.push(id)
        }
    }
    for (var i = 0; i < rmList.length; ++i) {
        this.OnTCPDisConnect(rmList[i].GetSender())
    }
}

//There is a disconnection
ModuleMain.prototype.OnTCPDisConnect = function (tc) {
    var res = new proto.ServerPKG.RegServerType()
    res.setPkgid(proto.PKGTypeID.PKG_SERVER_SHUTDOWN)
    res.setSenderid(tc.ID)

    var gs = GSManager.Find(tc.ID)
    if (gs != null) {
        res.setIp(gs.GetIP())
        res.setPort(gs.GetPort())
        res.setServertype(SERVER_TYPE_GAME)
        GSManager.Remove(tc.ID)
    }
    else {
        gs = GTManager.Find(tc.ID)
        if (gs != null) {
            res.setIp(gs.GetIP())
            res.setPort(gs.GetPort())
            res.setServertype(SERVER_TYPE_GATE)
            GTManager.Remove(tc.ID)
        }
    }


    var GTmap = GTManager.GetMap()
    var GSmap = GSManager.GetMap()
    for (var id in GTmap) {
        var gas = GTmap[id]
        gas.SendPkg(res)
    }
    for (var id in GSmap) {
        var gas = GSmap[id]
        gas.SendPkg(res)
    }
}

ModuleMain.prototype.OnRelease = function () {
    GSManager.Clear()
    GTManager.Clear()
};


