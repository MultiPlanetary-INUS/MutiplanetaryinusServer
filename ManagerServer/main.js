require('../Common/CommonDefine.js')
var fs = require('fs')
const { Solution } = require('../Common/Solutions.js')
var ini = require('ini')
var Config = ini.parse(fs.readFileSync('../Config/Server.ini', 'utf-8'))
var SysLog = require('../Common/LogService.js').GetInstance()
var TCPListener = require('../Common/NetWork/TcpListener.js').TcpListener

var GTManager = require('../CommonLogic/GateServerMgr.js').GetInstance()
var GSManager = require('../CommonLogic/GameServerMgr.js').GetInstance()

require('./Modules/ModuleMain.js')

ManagerServer = Solution.extend({
    ctor: function () {
        this._super("ManagerServer")
        this.tp = null
        G_SOLUTION = this
    }
})

ManagerServer.prototype.OnCreate = function () {
    SysLog.SetLogPath(Config.LogService.LogPath)
    SysLog.SetLogFix(Config.LogService.LogFix)
    SysLog.SetLogAndPrint(Config.LogService.PrintLog)
    SysLog.SetWriteLog(Config.ManagerServer.WriteLog)
    this.SetLogService(SysLog)


    this.InstallModule(ModuleMain)
    this.tp = new TCPListener()
    this.tp.SetLogSystem(SysLog)
    this.tp.StartListen(Config.ManagerServer.IP, Config.ManagerServer.PORT)

}


ManagerServer.prototype.OnUpdate = function (ms) {
    GTManager.OnUpdate(ms)
    GSManager.OnUpdate(ms)
}

ManagerServer.prototype.OnRelease = function () {
    this.tp.Close()
}


var GS = new ManagerServer()
GS.Create()

function Update () {
    if (GS.bRelease) {

    }
    else {
        GS.Update()
    }
}

var si = setInterval(Update, SERVER_INTERVAL_TIME)//Server frame rate is around 30

function EXIT () {
    clearInterval(si)
    GS.Release()
    process.exit(0)
}

process.stdin.resume()
process.stdin.on('data', function (chunk) {
    var str = chunk.toString().trim()
    if (str == 'quit' || str == 'exit') {
        EXIT()
    }
})

process.on('SIGINT', function () {
    EXIT()
})