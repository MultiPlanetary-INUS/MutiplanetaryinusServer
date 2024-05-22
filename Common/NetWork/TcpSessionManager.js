require('../Util/Verify.js');

var Manager = require('../Manager.js').Manager;

var ThisInstance = null;
exports.GetInstance = function(){
	if(!Verify(ThisInstance)){
		ThisInstance = new Manager();
	}
	
	return ThisInstance;
};
