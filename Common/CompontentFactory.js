var Factory = require('./Util/Factory.js').Factory;

var ThisMgr = null;

exports.GetInstance = function() {
	if (!Verify(ThisMgr)) {
		ThisMgr = new Factory;
	}
	return ThisMgr;
};
