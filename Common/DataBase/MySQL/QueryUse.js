require('./QueryBase.js');

QueryUse = QueryBase.extend({
	ctor:function(szDBName){
		this._super();
		this.SQLString = null;
		this.SetDateBaseName(szDBName);
	}
});

QueryUse.prototype.SetDateBaseName = function(szDBName){
	if(Verify(szDBName)){
		this.SQLString = "Use " + szDBName;
	}
};


