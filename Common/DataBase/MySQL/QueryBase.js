
var MySqlClient = require('./MySqlClient.js').GetInstance()
require('../../Util/Class.js')

var TIMEOUT = 5000//If there is no response to the query within 5 seconds, the server is considered to have timed out.

QueryBase = Class.extend({
	ctor: function () {
		//SQL statement
		this.SQLString = null
		this.RunTime = null
		this.NotRun = true
		this.TimeOut = false
	}
})

QueryBase.prototype.Execute = function (func) {
	this.RunTime = 0
	if (Verify(this.SQLString)) {
		MySqlClient.Execute(this, func)
	}
}

QueryBase.prototype.NexRun = function (func) {
	MySqlClient.AddNextQuery(this, func)//Will be processed next frame
}

QueryBase.prototype.OnUpdate = function (ms) {
	this.RunTime += ms
	if (this.RunTime >= TIMEOUT && this.NotRun) {
		this.TimeOut = true
		MySqlClient.Close()
		MySqlClient.DoConnect()
	}
}

exports.QueryBase = QueryBase