require('../../Common/GameObject.js');
require('../../Common/Util/Verify.js');

GatePlayer = GameObject.extend({
    ctor:function()
    {
		this._super();
        this.PlayerID = null;
        this.Sender = null;
        this.DelayTime = 0.0;
		this.VerifyCode = null;
		this.HasLogin = false;
    }
});


GatePlayer.prototype.GetPlayerID = function()
{
	return this.PlayerID;
};

GatePlayer.prototype.SetPlayerID = function(id)
{
	this.PlayerID = id;
};

GatePlayer.prototype.SetSender = function(hc)
{
	this.Sender = hc;
};

GatePlayer.prototype.GetSender = function()
{
	return this.Sender;
};

GatePlayer.prototype.SendPkg = function(pkg)
{
	if(Verify(this.Sender) && Verify(pkg)){
		this.Sender.Send(pkg);
	}
};

exports.GatePlayer = GatePlayer;
