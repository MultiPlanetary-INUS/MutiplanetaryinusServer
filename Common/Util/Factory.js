require('./Verify.js');

function Factory(){
	this.MAP = {};
}

Factory.prototype.RegisterType = function(type, object){
	this.MAP[type] = object;
};

Factory.prototype.Create = function(type){
	var obj = this.MAP[type];
	if(Verify(obj)){
		return new obj();
	}
	
	return null;
};

exports.Factory = Factory;
