
function ConditionsFactory(){
	this.MAP = {};
}

ConditionsFactory.prototype.RegisterType = function(type, object){
	this.MAP[type] = object;
};

ConditionsFactory.prototype.Create = function(par, owner){
	var obj = this.MAP[par.ConditionTypeID];
	if(Verify(obj)){
		return new obj(par, owner);
	}
	
	return null;
};

var ThisMgr = null;

exports.GetInstance = function() {
	if (!Verify(ThisMgr)) {
		ThisMgr = new ConditionsFactory;
	}
	return ThisMgr;
};
