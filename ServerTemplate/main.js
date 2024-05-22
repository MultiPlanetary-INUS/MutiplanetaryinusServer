require('../Common/Solutions.js');
var fs = require('fs');
const { Solution } = require('../Common/Solutions.js');
var ini = require('ini');
var Config = ini.parse(fs.readFileSync('../Config/Server.ini', 'utf-8'));
var SysLog = require('../Common/LogService.js').GetInstance();
var TCPListener = require('../Common/NetWork/TcpListener.js').TcpListener;


require('./Modules/ModuleMain.js');

ServerName = Solution.extend({
    ctor:function(){
        this._super("ServerName");
        this.tp = null;
    }
});

ServerName.prototype.OnCreate = function()
{
    SysLog.SetLogPath(Config.LogService.LogPath);
	SysLog.SetLogFix(Config.LogService.LogFix);
	SysLog.SetLogAndPrint(Config.LogService.PrintLog);
	SysLog.SetWriteLog(Config.ServerName.WriteLog);
	this.SetLogService(SysLog);


	this.InstallModule(ModuleMain);
	this.tp = new TCPListener();
	this.tp.SetLogSystem(SysLog);	
	this.tp.StartListen(Config.ServerName.IP, Config.ServerName.PORT);
	
}


ServerName.prototype.OnUpdate = function(ms)
{
    
}

ServerName.prototype.OnRelease = function()
{
    this.tp.Close();
}


var GS = new ServerName();
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

process.stdin.resume();
process.stdin.on('data', function(chunk)
{
    var str = chunk.toString().trim();
    if(str == 'quit'||str == 'exit')
    {
		clearInterval(si);
        GS.Release();
        process.exit(0);
    }
})
