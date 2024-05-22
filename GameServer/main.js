require('../Common/CommonDefine.js');
var MySqlClient = require('../Common/DataBase/MySQL/MySqlClient.js').GetInstance();
var RedisMgr = require('../Common/DataBase/Redis/RedisMgr.js').GetInstance();
var fs = require('fs');
const { Solution } = require('../Common/Solutions.js');
var Config = require('ini').parse(fs.readFileSync('../Config/Server.ini', 'utf-8'));
var SysLog = require('../Common/LogService.js').GetInstance();
var TCPListener = require('../Common/NetWork/TcpListener.js').TcpListener;
var ManagerServer = require('../CommonLogic/ManagerServer.js').GetInstance();
var GSManager = require('../CommonLogic/GameServerMgr.js').GetInstance();
var IDGenerator = require('../Common/IDGenerator.js').GetInstance();

require('./Modules/ModuleMain.js');
require('./Modules/ModuleChat.js');
require('./Modules/ModuleGuild.js');
require('./Modules/ModuleItem.js');
require('./Modules/ModuleLogin.js');
require('./Modules/ModuleMap.js');
require('./Modules/ModuleQuest.js');
require('./Modules/ModuleRelation.js');
require('./Modules/ModuleRole.js');

GSServer = Solution.extend({
    ctor:function(){
        this._super("GameServer"+"_"+Config.GameServer.ServerID);
        this.tp = null;
        this.UserCount = null;
        this.MaxCount = null;
        this.ModuleIDList = [];
        G_SOLUTION = this;
    }
});

GSServer.prototype.OnCreate = function()
{
    SysLog.SetLogPath(Config.LogService.LogPath);
	SysLog.SetLogFix(Config.LogService.LogFix);
	SysLog.SetLogAndPrint(Config.LogService.PrintLog);
	SysLog.SetWriteLog(Config.GameServer.WriteLog);
	this.SetLogService(SysLog);

    this.UserCount = 0;
    this.MaxCount = Config.GameServer.MaxUser;

	this.InstallModule(ModuleMain);
    
    for(var i = 0; i < Config.GameServer.ModuleList.length; ++i)
    {
        this.ModuleIDList[i] = +Config.GameServer.ModuleList[i];
        switch(this.ModuleIDList[i])
        {
            case GAMESERVER_MODULE_LOGIN:
                this.InstallModule(ModuleLogin);
                break;
            case GAMESERVER_MODULE_CHAT:
                this.InstallModule(ModuleChat);
                break;
            case GAMESERVER_MODULE_QUEST:
                this.InstallModule(ModuleQuest);
                break;
            case GAMESERVER_MODULE_ITEM:
                this.InstallModule(ModuleItem);
                break;
            case GAMESERVER_MODULE_RELATION:
                this.InstallModule(ModuleRelation);
                break;
            case GAMESERVER_MODULE_GUILD:
                this.InstallModule(ModuleGuild);
                break;
            case GAMESERVER_MODULE_ROLE:
                this.InstallModule(ModuleRole);
                break;
            case GAMESERVER_MODULE_MAP:
                this.InstallModule(ModuleMap);
                break;
        }
    }

    MySqlClient.SetLog("GameServerSQL", Config.MySQL.WriteLog, Config.LogService.LogPath, Config.LogService.LogFix, Config.LogService.PrintLog);
	MySqlClient.Connect(Config.MySQL.IP, Config.MySQL.PORT, Config.MySQL.USER, Config.MySQL.PASSWD, Config.MySQL.DATABASE);	
	IDGenerator.LoadIDSeek();

    RedisMgr.SetLog("GameServerRedis", Config.Redis.WriteLog, Config.LogService.LogPath, Config.LogService.LogFix, Config.LogService.PrintLog);
    RedisMgr.Connect(Config.Redis.IP, Config.Redis.PORT);

	this.tp = new TCPListener();
	this.tp.SetLogSystem(SysLog);	
	this.tp.StartListen(Config.GameServer.IP, Config.GameServer.PORT);

    ManagerServer.Set(Config.ManagerServer.IP, Config.ManagerServer.PORT);
    ManagerServer.SetID("ManagerServer");
    ManagerServer.Connect();
}


GSServer.prototype.OnUpdate = function(ms)
{
    MySqlClient.OnUpdate(ms);
    GSManager.OnUpdate(ms);
    ManagerServer.Update(ms);
}

GSServer.prototype.OnRelease = function()
{
    RedisMgr.Close();
    MySqlClient.Close();
    IDGenerator.SaveIDSeek();
    ManagerServer.Close();
    this.tp.Close();
}


var GS = new GSServer();
GS.Create();

function Update()
{
    if(GS.bRelease)
    {
        if(MySqlClient.CanClose())
        {
			clearInterval(si);
			MySqlClient.Close();
			GS.tp.Close();
			process.exit(0);
		}
        else
        {
			GS.Update();
		};
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
		EXIT();
    }
})
process.on('SIGINT', function()
{
    EXIT();
})