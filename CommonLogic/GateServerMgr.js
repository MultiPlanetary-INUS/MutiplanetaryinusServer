
//Gate server management

require('../Common/Util/Verify.js')
var Manager = require('../Common/Manager.js').Manager

GateMgr = Manager.extend({
	ctor: function () {
		this._super()
	}
})

GateMgr.prototype.FindServerBySender = function (tc) {
	if (Verify(tc)) {
		for (var id in this.ManagerMap) {
			var gs = this.ManagerMap[id]
			if (Verify(gs) && gs.GetSender() == tc) {
				return this.ManagerMap[id]
			}
		}
	}
}

var ThisInstance = null
exports.GetInstance = function () {
	if (!Verify(ThisInstance)) {
		ThisInstance = new GateMgr()
	}

	return ThisInstance
};


