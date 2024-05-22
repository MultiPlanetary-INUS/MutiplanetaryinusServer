require('../../Common/Util/Verify.js');

var Manager = require('../../Common/Manager.js').Manager;

PlayerManager = Manager.extend({
	ctor:function()
	{
        this._super();
	}
})


PlayerManager.prototype.FindPlayerBySender=function(tc)
{
	if(Verify(tc)){
		for(var id in this.ManagerMap){
			var gs = this.ManagerMap[id];
			if(Verify(gs) && gs.GetSender() == tc){
				return gs;
			}
		}
	}

	return null;
}

var ThisInstance = null;
exports.GetInstance = function(){
	if(!Verify(ThisInstance)){
		ThisInstance = new PlayerManager();
	}
	
	return ThisInstance;
};
