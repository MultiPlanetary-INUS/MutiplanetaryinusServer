
function ActFactory(){
	this.MAP = {};
}

ActFactory.prototype.RegisterType = function(type, object){
	this.MAP[type] = object;
};

ActFactory.prototype.Create = function(par){
	var obj = this.MAP[par.ActionTypeID];
	if(Verify(obj)){
		return new obj(par);
	}
	
	return null;
};


var ThisMgr = null;

exports.GetInstance = function() {
	if (!Verify(ThisMgr)) {
		ThisMgr = new ActFactory;
	}
	return ThisMgr;
};
