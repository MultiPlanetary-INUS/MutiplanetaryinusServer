var Manager = require('../../../Common/Manager').Manager;

TeamMgr = Manager.extend({
    ctor:function()
    {
        this._super();
    }
})


var ThisInstance = null;
exports.GetInstance = function()
{
	if(!Verify(ThisInstance))
	{
		ThisInstance = new TeamMgr();
	}
	
	return ThisInstance;
};