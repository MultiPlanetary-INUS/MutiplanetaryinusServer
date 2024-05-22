var RedisClient = require('./RedisClient').RedisClient;
var PKGMap = require("../../NetWork/NetPacket.js").PKGMap;

class RedisMgr
{
    constructor()
    {
        this.IP = '127.0.0.1';
        this.Port = 6379;
        this.logFile = null;
        this.Log = false;
        this.logFix = null;
        this.LogPath = '';
        this.PrintLog = false;
        this.RedisClient = null;
    }

    SetLog(LogFile, bool, LogPath, LogFix, Print)
    {
        this.logFile = LogFile;
        this.log = bool;
        this.LogPath = LogPath;
        this.logFix = LogFix;
        this.PrintLog = Print;
    }

    Connect(IP, Port)
    {
        this.RedisClient = new RedisClient(IP, Port, this.logFile, this.log, this.LogPath, this.logFix, this.PrintLog);
    }

    async Write(key, value)
    {
        this.RedisClient.Log("Write key:"+key+"\n value:",value);
        await this.RedisClient.set(key, value.serializeBinary().toString());
    }

    async Read(key, type)
    {
        var value = await this.RedisClient.get(key);
        if(Verify(value))
        {
            var st = value.split(',')
            var bf = new Buffer.alloc(st.length, 0);
            for(var i = 0; i < st.length; ++i)
                bf[i] = parseInt(st[i]);
                
            value = PKGMap[type].deserializeBinary(bf);
        }

        this.RedisClient.Log("Read key:"+key+"\n value:",value);
        return value;
    }

    Close()
    {
        this.RedisClient.quit();
    }
}

var ThisInstance = null;
exports.GetInstance = function()
{
	if(!Verify(ThisInstance))
	{
		ThisInstance = new RedisMgr();
	}
	
	return ThisInstance;
};