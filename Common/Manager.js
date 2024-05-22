require('./Util/Class.js');
require('./Util/Verify.js');

Manager = Class.extend({
	ctor:function(){
		this.ManagerMap = {};
	}
});

Manager.prototype.OnAdd = function(id, obj){};

Manager.prototype.Add = function(id, obj)
{
	this.ManagerMap[id] = obj;
	this.OnAdd(id, obj);
};

Manager.prototype.OnRemove = function(id, obj){};

Manager.prototype.Remove = function(id)
{
	var obj = this.ManagerMap[id];
	if(Verify(obj)){
		this.OnRemove(id, obj);
		if(Verify(obj.Release)){
			obj.Release();
		}
		delete this.ManagerMap[id];
	}
};

Manager.prototype.Find = function(id)
{
	return this.ManagerMap[id];
};

Manager.prototype.OnUpdate = function(ms)
{
	for(var id in this.ManagerMap)
	{
		this.ManagerMap[id].Update(ms);
	}
};

Manager.prototype.GetMap = function()
{
	return this.ManagerMap;
};

Manager.prototype.Clear = function()
{
	for(var id in this.ManagerMap)
	{
		this.Remove(id);
	}
	
	this.ManagerMap = {};
};

exports.Manager = Manager;