const { GameObject, GameObjectType } = require('../../../Common/GameObject');

require('../../../Common/DataBase/MySQL/QueryBase');

require('../../../Common/NetWork/Protobuf/LoginPKG_pb');


ServerRole = GameObject.extend({
    ctor:function()
    {
        this._super();
        this.ObjType = GameObjectType.GOT_Player;
        this.RoleID = 0;
        this.AccountID = 0;
        this.Sender = null;
        this.DelayTime = 0.0;
        this.IsCurrent = false;
        this.AccountInfo = null;
        this.RoleInfo = null;
        this.Map = null;
        this.TeamID = 0;
    }
})

ServerRole.prototype.SetAccountInfo = function(info)
{
    this.AccountInfo = info;
    if(Verify(info))
        this.AccountID = info.getUserid();
}

ServerRole.prototype.GetAccountInfo = function()
{
    return this.AccountInfo;
}

ServerRole.prototype.SetRoleInfo = function(info)
{
    this.RoleInfo = info;
    if(Verify(info))
    {
        this.RoleID = info.getRoleid();
        this.ObjID = this.RoleID;
    }
}    

ServerRole.prototype.GetRoleInfo = function()
{
    return this.RoleInfo;
}

ServerRole.prototype.SetSender = function(hc)
{
	this.Sender = hc;
};

ServerRole.prototype.GetSender = function()
{
	return this.Sender;
};

ServerRole.prototype.SendPkg = function(pkg)
{
	if(Verify(this.Sender) && Verify(pkg)){
        pkg.setUserid(this.AccountID);
		this.Sender.Send(pkg);
	}
};

ServerRole.prototype.GetLevel = function()
{
    var attr = this.GetComponent(ComponentType.ECT_ATTR);
    if(Verify(attr))
    {
        return attr.GetLevel();
    }
    return 0;
}

ServerRole.prototype.GetGuildID = function()
{
    var attr = this.GetComponent(ComponentType.ECT_ATTR);
    if(Verify(attr))
    {
        return attr.Attr.getGuildid();
    }
    return 0;
}

ServerRole.prototype.SetLevel = function(level)
{
    var attr = this.GetComponent(ComponentType.ECT_ATTR);
    if(Verify(attr))
    {
        return attr.SetLevel(level);
    }
}

ServerRole.prototype.LevelUp = function()
{
    var attr = this.GetComponent(ComponentType.ECT_ATTR);
    if(Verify(attr))
    {
        attr.LevelUp();
    }
}

ServerRole.prototype.NotifyAround = function(pkg)
{
    if(!Verify(this.Map) || !this.Map.NotifyAllPlayer(pkg))
    {
        this.SendPkg(pkg);
    }
}

exports.ServerRole = ServerRole;

