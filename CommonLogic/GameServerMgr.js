
//GameServerManager

require('./GateServerMgr.js')

require('../Common/Util/Verify.js')
var Manager = require('../Common/Manager.js').Manager

GameMgr = Manager.extend({
	ctor: function () {
		this._super()

		this.ServerModuleMap = {}
	}
})

GameMgr.prototype.OnAdd = function (id, obj) {
	for (var i = 0; i < obj.ModuleList.length; ++i) {
		if (!Verify(this.ServerModuleMap[obj.ModuleList[i]])) {
			this.ServerModuleMap[obj.ModuleList[i]] = []
		}
		this.ServerModuleMap[obj.ModuleList[i]].push(obj)
	}
}

GameMgr.prototype.OnRemove = function (id, obj) {
	for (var i = 0; i < obj.ModuleList.length; ++i) {
		for (var n = 0; n < this.ServerModuleMap[obj.ModuleList[i]]; ++n) {
			if (this.ServerModuleMap[obj.ModuleList[i]] == obj) {
				this.ServerModuleMap[obj.ModuleList[i]].splice(n, 1)
				break
			}
		}
	}
}

GameMgr.prototype.SendPkgToModule = function (mid, pkg) {
	let res = false
	if (Verify(this.ServerModuleMap[mid])) {
		for (var i = 0; i < this.ServerModuleMap[mid].length; ++i) {
			this.ServerModuleMap[mid][i].SendPkg(pkg)
			res = true
		}
	}
	return res
}

//Notify all servers
GameMgr.prototype.NotifyAll = function (pkg) {
	for (var id in this.ManagerMap) {
		this.ManagerMap[id].SendPkg(pkg)
	}
}

var ThisInstance = null
exports.GetInstance = function () {
	if (!Verify(ThisInstance)) {
		ThisInstance = new GameMgr()
	}

	return ThisInstance
}