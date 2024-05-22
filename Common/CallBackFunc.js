
require('./Util/Verify.js');

function CallBackFunc(obj, funcname){
	this.obj = obj;
	this.funcname = funcname;
}

CallBackFunc.prototype.Execute = function(){
	var func = this.obj[this.funcname];
	if(Verify(func)){
		 switch (arguments.length) {
		 case 0:
			 return func.call(this.obj);
	     case 1:
	    	 return func.call(this.obj, arguments[0]);
	     case 2:
	    	 return func.call(this.obj, arguments[0], arguments[1]);
	     default:
	        var l = arguments.length;
	        var args = new Array(l);
	        for (var i = 0; i < l; i++) args[i] = arguments[i];
	        func.apply(this.obj, args);
	    }
	}
};

CallBackFunc.prototype.IsValid = function(){
	return Verify(this.obj) && Verify(this.funcname);
};

exports.CallBackFunc = CallBackFunc;
