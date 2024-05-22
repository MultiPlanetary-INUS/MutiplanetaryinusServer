var Manager = require('../../../Common/Manager').Manager;
var EventCenter = require('../../../Common/EventCenter').GetInstance();

RoleMgr = Manager.extend({
    ctor:function()
    {
        this._super();
        this.AccountRoleList = {};
        this.NameMap={};
    }
})

RoleMgr.prototype.OnAdd = function(id, obj)
{
    EventCenter.RaiseEvent("AddPlayer", obj, id);

    if(!Verify(this.AccountRoleList[obj.AccountID]))
    {
        this.AccountRoleList[obj.AccountID]=new Map();
    }
    this.AccountRoleList[obj.AccountID][obj.RoleID] = obj;
    this.NameMap[obj.RoleInfo.getRolename()] = obj;
}

RoleMgr.prototype.OnRemove = function(id, role)
{
    EventCenter.RaiseEvent("RemovePlayer", role, id);
    // var obj = this.AccountRoleList[role.AccountID][role.RoleID];
	// if(Verify(obj))
    // {
	// 	if(Verify(obj.Release))
    //     {
	// 		obj.Release();
	// 	}
	// 	delete this.AccountRoleList[role.AccountID][role.RoleID];
	// }
    delete this.NameMap[role.RoleInfo.getRolename()];
}

RoleMgr.prototype.FindPlayerByName = function(name)
{
    return this.NameMap[name];
}

RoleMgr.prototype.FindPlayerByUserID = function(uid)
{
    for(var na in this.NameMap)
    {
        if(this.NameMap[na].AccountID == uid)
            return this.NameMap[na];
    }
    return null;
}

RoleMgr.prototype.EnterGame= function(role)
{
    var pmap = this.AccountRoleList[role.AccountID]
    for(var key of pmap.keys())
    {
        if(key != role.RoleID)
        {
            this.Remove(key);
        }
    }
}

var ThisInstance = null;
exports.GetInstance = function()
{
	if(!Verify(ThisInstance))
	{
		ThisInstance = new RoleMgr();
	}
	
	return ThisInstance;
};