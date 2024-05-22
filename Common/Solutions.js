require('./Util/Class.js')

var EventCenter = require('./EventCenter.js').GetInstance()

process.on('uncaughtException', function (error) {
	EventCenter.RaiseEvent("DumpError", error)
})

Solution = Class.extend({
	ctor: function (name) {
		this.Name = name
		this.ModuleList = {}
		this.LastTime = 0

		this.LogService = null

		this.bRelease = false
	}
})

Solution.prototype.SetName = function (name) {
	this.Name = name
	if (Verify(this.LogService)) {
		this.LogService.SetSign(name)
	}
}

Solution.prototype.GetName = function () {
	return this.Name
}

Solution.prototype.SetLogService = function (Log) {
	this.LogService = Log
	if (Verify(this.LogService)) {
		this.LogService.SetSign(this.Name)
	}
}

Solution.prototype.OnInstallModule = function (module) { }

Solution.prototype.InstallModule = function (ModuleClass) {
	var module = new ModuleClass(this)
	if (Verify(module)) {
		module.Initialize()
		this.ModuleList[module.GetName()] = module
		this.OnInstallModule(module)
	}
}

Solution.prototype.OnUnInstallModule = function (module) { }

Solution.prototype.ClearModule = function () {
	for (var name in this.ModuleList) {
		var module = this.ModuleList[name]
		if (Verify(module)) {
			this.OnUnInstallModule(module)
			module.Release()
			delete this.ModuleList[name]
		}
	}
	this.ModuleList = {}
}

Solution.prototype.OnCreate = function () { }

Solution.prototype.Create = function () {
	EventCenter.RegisterEvent('DumpError', this, 'OnDumpError')

	this.OnCreate()

	this.LastTime = Date.now()

	if (Verify(this.LogService)) {
		this.LogService.Log(this.Name + " Start OK!!!")
	}
}

Solution.prototype.OnDumpError = function (err) {
	if (Verify(err)) {
		if (typeof err === 'object') {
			if (err.message) {
				if (Verify(this.LogService)) {
					this.LogService.Log("ErrorMessage: " + err.message)
				}
				else {
					console.log("ErrorMessage: " + err.message)
				}
			}
			if (err.stack) {
				if (Verify(this.LogService)) {
					this.LogService.Log("====>Stacktrace: " + err.stack)
				} else {
					console.log("====>Stacktrace: " + err.stack)
				}
			}
		} else {
			if (Verify(this.LogService)) {
				this.LogService.Log("dumpError :: " + err)
			} else {
				console.log("dumpError :: " + err)
			}
		}
	}
}

Solution.prototype.OnRelease = function () { }

Solution.prototype.Release = function () {
	this.ClearModule()
	this.OnRelease()
	if (Verify(this.LogService)) {
		this.LogService.Log(this.Name + " ShutDown!!!")
	}
	this.bRelease = true
}

Solution.prototype.OnUpdate = function (ms) { }

Solution.prototype.Update = function () {
	var TimeNow = Date.now()

	var tt = TimeNow - this.LastTime
	if (Verify(this.LogService)) {
		this.LogService.OnUpdate(tt)
	}

	for (var i in this.ModuleList) {
		var m = this.ModuleList[i]
		if (Verify(m)) {
			m.OnUpdate(tt)
		}
	}

	this.OnUpdate(tt)

	this.LastTime = TimeNow
}

exports.Solution = Solution;

