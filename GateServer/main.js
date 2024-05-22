require('../Common/CommonDefine.js');
var fs = require('fs');
const { Solution } = require('../Common/Solutions.js');
var Config = require('ini').parse(fs.readFileSync('../Config/Server.ini', 'utf-8'));
var SysLog = require('../Common/LogService.js').GetInstance();
var TCPListener = require('../Common/NetWork/TcpListener.js').TcpListener;
var ManagerServer = require('../CommonLogic/ManagerServer.js').GetInstance();
var GSManager = require('../CommonLogic/GameServerMgr.js').GetInstance();

require('./Modules/ModuleMain.js');
require('./Modules/ModuleIdentify.js');

GateServer = Solution.extend({
    ctor:function(){
        this._super("GateServer"+"_"+Config.GateServer.ServerID);
        this.tp = null;
        this.UserCount = null;
        this.MaxCount = null;
        G_SOLUTION = this;
    }
});

GateServer.prototype.OnCreate = function()
{
    SysLog.SetLogPath(Config.LogService.LogPath);
	SysLog.SetLogFix(Config.LogService.LogFix);
	SysLog.SetLogAndPrint(Config.LogService.PrintLog);
	SysLog.SetWriteLog(Config.GateServer.WriteLog);
	this.SetLogService(SysLog);

    this.UserCount = 0;
    this.MaxCount = Config.GateServer.MaxUser;

	this.InstallModule(ModuleMain);
    this.InstallModule(ModuleIdentify);
    
	this.tp = new TCPListener();
	this.tp.SetLogSystem(SysLog);	
	this.tp.StartListen(Config.GateServer.IP, Config.GateServer.PORT);

    ManagerServer.Set(Config.ManagerServer.IP, Config.ManagerServer.PORT);
    ManagerServer.SetID("ManagerServer");
    ManagerServer.Connect();
}


GateServer.prototype.OnUpdate = function(ms)
{
    GSManager.OnUpdate(ms);
    ManagerServer.Update(ms);
}

GateServer.prototype.OnRelease = function()
{
    ManagerServer.Close();
    this.tp.Close();
}


var GS = new GateServer();
GS.Create();

function Update()
{
    if(GS.bRelease)
    {

    }
    else
    {
        GS.Update();
    }
}

var si = setInterval(Update, SERVER_INTERVAL_TIME);

function EXIT()
{
    clearInterval(si);
    GS.Release();
    process.exit(0);
}


process.stdin.resume();
process.stdin.on('data', function(chunk)
{
    var str = chunk.toString().trim();
    if(str == 'quit'||str == 'exit')
    {
		EXIT()
    }
})

process.on('SIGINT', function()
{
    EXIT();
})