
require('./Util/Verify.js');
var LogSystem = require('./LogSystem.js').LogSystem;
var ThisInstance = null;

exports.GetInstance = function(){
	if(!Verify(ThisInstance)){
		ThisInstance = new LogSystem();
	}
	
	return ThisInstance;
};
