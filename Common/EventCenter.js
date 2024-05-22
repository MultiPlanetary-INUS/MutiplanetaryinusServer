var CallBackFunc = require('./CallBackFunc.js').CallBackFunc

function EventCenter () {
	this.EventHandlerMap = {}
	this.EventList = []
}

EventCenter.prototype.FindEventHandler = function (id) {
	return this.EventHandlerMap[id]
}

EventCenter.prototype.RegisterEvent = function (id, object, strFuncName) {
	if (!Verify(id) || !Verify(object) || !Verify(strFuncName)) {
		return
	}

	var handler = this.FindEventHandler(id)
	if (Verify(handler)) {
		handler.push(new CallBackFunc(object, strFuncName))
	} else {
		handler = new Array()
		handler.push(new CallBackFunc(object, strFuncName))
		this.EventHandlerMap[id] = handler
	}
}

EventCenter.prototype.UnRegisterEvent = function (id) {
	var handler = this.FindEventHandler(id)
	if (Verify(handler)) {
		var len = handler.length
		while (len--) {
			delete handler[len]
		}
	}
	delete this.EventHandlerMap[id]
}

EventCenter.prototype.ClearAllHandler = function () {
	for (var id in this.EventHandlerMap) {
		this.UnRegisterEvent(id)
	}

	this.EventHandlerMap = {}

	var len = this.EventList.length
	while (len--) {
		delete this.EventList[len]
	}
	this.EventList.splice[0, this.EventList.length]
}

EventCenter.prototype.RaiseEvent = function () {
	var handler = this.FindEventHandler(arguments[0])
	if (Verify(handler)) {
		var len = handler.length
		while (len--) {
			if (handler[len].IsValid()) {
				switch (arguments.length) {
					case 1:
						handler[len].Execute.call(handler[len])
						break
					case 2:
						handler[len].Execute.call(handler[len], arguments[1])
						break
					case 3:
						handler[len].Execute.call(handler[len], arguments[1], arguments[2])
						break
					default:
						var l = arguments.length
						var args = new Array(l - 1)
						for (var i = 1; i < l; i++) args[i - 1] = arguments[i]
						handler[len].Execute.apply(handler[len], args)
						break
				}
			}
		}
	}
}

EventCenter.prototype.PostEvent = function () {
	if (arguments.length > 0) {
		this.EventList.push(event)
	}
}

EventCenter.prototype.OnUpdate = function (ms) {
	var len = this.EventList.length
	for (var i = 0; i < len; ++i) {
		var args = this.EventList[i]
		this.RaiseEvent.apply(this, args)
		delete this.EventList[i]
	}
	this.EventList.splice(0, len)
}

var ThisInstance = null

exports.GetInstance = function () {
	if (!Verify(ThisInstance)) {
		ThisInstance = new EventCenter()
	}

	return ThisInstance
}
