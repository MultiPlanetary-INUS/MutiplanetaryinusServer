
function BufferFactory(){
	this.MAP = {};
}

BufferFactory.prototype.RegisterType = function(type, object){
	this.MAP[type] = object;
};

BufferFactory.prototype.Create = function(type){
	var obj = this.MAP[type];
	if(Verify(obj)){
		return new obj();
	}
	
	return null;
};

var ThisMgr = null;

exports.GetInstance = function() {
	if (!Verify(ThisMgr)) {
		ThisMgr = new BufferFactory;
	}
	return ThisMgr;
};
