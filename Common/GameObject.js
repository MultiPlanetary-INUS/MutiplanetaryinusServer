var ComponentFactory = require('./CompontentFactory.js').GetInstance()

require('./Util/Class.js')


GameObjectType = {
	GOT_None: 0,
	GOT_Player: 1,
	GOT_NPC: 2,
	GOT_MAP: 3,
	GOT_ITEM: 4,
	GOT_QUEST: 5,
	GOT_MAX: 6,
}


GameObject = Class.extend({
	ctor: function () {
		this.vComponentList = {}
		this.EventHandlerMap = {}
		this.bModify = false
		this.ObjType = GameObjectType.GOT_None
		this.ObjID = 0
	}
})

GameObject.prototype.GetObjType = function () {
	return this.ObjType
}

GameObject.prototype.Regist = function (id, func) {
	if (!Verify(id) || !Verify(func)) {
		return
	}

	if (!Verify(this.EventHandlerMap[id]))
		this.EventHandlerMap[id] = []

	this.EventHandlerMap[id].push(func)
}

GameObject.prototype.UnRegist = function (id, func) {
	if (Verify(id) && Verify(func) && Verify(this.EventHandlerMap[id])) {
		var fl = this.EventHandlerMap[id]
		for (var i = 0; i < fl.length; ++i) {
			if (fl[i] == func)
				this.EventHandlerMap[id].splice(i, 1)
		}
	}
}

GameObject.prototype.on = GameObject.prototype.Regist

GameObject.prototype.QueryValue = function () {
	var rl = 0
	var funcl = this.EventHandlerMap[arguments[0]]
	if (Verify(funcl)) {
		for (var i = 0; i < funcl.length; ++i) {
			var func = funcl[i]
			if (Verify(func)) {
				switch (arguments.length) {
					case 1:
						rl += func.call(this)
						break
					case 2:
						rl += func.call(this, arguments[1])
						break
					case 3:
						rl += func.call(this, arguments[1], arguments[2])
						break
					default:
						var l = arguments.length
						var args = new Array(l - 1)
						for (var i = 1; i < l; i++) args[i - 1] = arguments[i]
						rl += func.apply(this, args)
						break
				}
			}
		}
	}

	return rl
}

GameObject.prototype.SetModify = function (b) {
	this.bModify = b
}

GameObject.prototype.Modify = function () {
	return this.bModify
}

GameObject.prototype.OnAddComponent = function () { }

GameObject.prototype.OnRemoveComponent = function () { }

GameObject.prototype.AddComponent = function (comp) {
	if (Verify(comp)) {
		this.RemoveComponentByID(comp.GetTypeID())
		comp.SetOwner(this)
		this.vComponentList[comp.GetTypeID()] = comp
		this.OnAddComponent(comp)
	}
}

GameObject.prototype.FindComponentByID = function (id) {
	return this.vComponentList[id]
}

GameObject.prototype.GetComponent = function (id) {
	if (Verify(id)) {
		var comp = this.FindComponentByID(id)
		return comp
	}
	return null
}

GameObject.prototype.CreateComponent = function (id) {
	var comp = this.FindComponentByID(id >> 8)
	if (Verify(comp) && comp.nTypeID != id) {
		this.RemoveComponent(comp)
		comp = null
	}
	if (!Verify(comp)) {
		comp = ComponentFactory.Create(id)
		this.AddComponent(comp)
	}
	return comp
}

GameObject.prototype.RemoveComponentByID = function (id) {
	var comp = this.FindComponentByID(id)
	if (Verify(comp)) {
		this.RemoveComponent(comp)
	}
}

GameObject.prototype.RemoveComponent = function (comp) {
	if (Verify(comp) && Verify(this.FindComponentByID(comp.GetTypeID()))) {
		this.OnRemoveComponent(comp)
		comp.SetOwner(null)
		comp.Release()
		delete this.vComponentList[comp.GetTypeID()]
	}
}

GameObject.prototype.ClearComponent = function () {
	for (var id in this.vComponentList) {
		this.RemoveComponent(this.vComponentList[id])
	}
	this.vComponentList = {}
}

GameObject.prototype.RaiseEvent = function () {
	//this.QueryValue.apply(this, arguments);
	for (var id in this.vComponentList) {
		var cmp = this.vComponentList[id]
		if (Verify(cmp)) {
			var func = cmp.RaiseEvent
			if (Verify(func)) {
				func.apply(cmp, arguments)
			}
		}
	}
}

GameObject.prototype.Update = function (ms) {
	for (var id in this.vComponentList) {
		this.vComponentList[id].OnUpdate(ms)
	}
	this.OnUpdate(ms)
}


GameObject.prototype.OnUpdate = function (ms) { }

GameObject.prototype.Store = function () { }

GameObject.prototype.ReStore = function () { }

GameObject.prototype.Release = function () {
	this.ClearComponent()
}

exports.GameObject = GameObject
exports.GameObjectType = GameObjectType