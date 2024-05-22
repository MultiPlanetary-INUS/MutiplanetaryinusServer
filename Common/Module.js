require('./Util/Class.js')
require('./Util/Verify.js')

Module = Class.extend({
	ctor: function (solution) {
		this.Name = null
		this.ModuleID = 0
		this.Solution = solution
	}
})

Module.prototype.SetName = function (name) {
	this.Name = name
}

Module.prototype.SetModuleID = function (id) {
	this.ModuleID = id
}

Module.prototype.GetModuleID = function () {
	return this.ModuleID
}

Module.prototype.GetName = function () {
	return this.Name
}

Module.prototype.Initialize = function () {
	return this.OnInitialize()
}

Module.prototype.OnInitialize = function () { }

Module.prototype.Release = function () {
	return this.OnRelease()
}

Module.prototype.OnUpdate = function (ms) { }

Module.prototype.OnRelease = function () { }

exports.Module = Module