

var GameServer = require('./GameServer.js').GameServer;



var ThisInstance = null;
exports.GetInstance = function()
{
	if(!Verify(ThisInstance))
	{
		ThisInstance = new GameServer();
	}
	
	return ThisInstance;
};
