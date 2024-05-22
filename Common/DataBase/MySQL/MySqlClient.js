
var MYSQL = require("mysql")
var LogSystem = require('../../LogSystem.js').LogSystem
var CallBackFunc = require('../../CallBackFunc.js').CallBackFunc
var EventCenter = require('../../EventCenter.js').GetInstance()

function MySqlClient () {
	this.szHost = "127.0.0.1"
	this.szPort = "3306"
	this.szUserName = "root"
	this.szPassword = "123456"
	this.szDateBase = "CG1"
	this.client = null
	this.BLog = false
	this.LogService = null

	this.QueryList = []
	this.FuncList = []

	this.NextQuery = []
	this.NextFunc = []

	this.freeCount = 0
}

MySqlClient.prototype.AddNextQuery = function (que, func) {
	if (Verify(que)) {
		this.NextQuery.push(que)
		this.NextFunc.push(func)
	}
}

MySqlClient.prototype.SetLog = function (LogFile, bool, LogPath, LogFix, Print) {
	this.BLog = bool
	if (this.BLog) {
		this.LogService = new LogSystem(LogFile)
		this.LogService.SetLogAndPrint(Print)
		this.LogService.SetLogPath(LogPath)
		this.LogService.SetLogFix(LogFix)
	} else {
		delete this.LogService
		this.LogService = null
	}
}

MySqlClient.prototype.Log = function () {
	if (this.BLog && Verify(this.LogService)) {
		var Content = ""
		var l = arguments.length
		for (var i = 0; i < l; ++i) {
			if (i > 0) {
				Content += "\t"
			}
			if (IsString(arguments[i])) {
				Content += arguments[i]
			} else {
				Content += JSON.stringify(arguments[i])
			}
		}
		this.LogService.Log(Content)
	}
}

MySqlClient.prototype.Connect = function (szHost, szPort, szUserName, szPassword, szDateBase) {
	this.szHost = szHost
	this.szPort = szPort
	this.szUserName = szUserName
	this.szPassword = szPassword
	this.szDateBase = szDateBase
	return this.DoConnect()
}

MySqlClient.prototype.DoConnect = function () {
	if (!Verify(this.szHost) || !Verify(this.szPort) || !Verify(this.szUserName) || !Verify(this.szPassword) || !Verify(this.szDateBase)) {
		return false
	}

	this.client = MYSQL.createConnection({
		'host': this.szHost,
		'port': this.szPort,
		'user': this.szUserName,
		'password': this.szPassword,
		'database': this.szDateBase,
		'timezone': '08:00',
	})

	var LogString = "Connect to MySQL:" + this.szHost + " Port:" + this.szPort
	if (!Verify(this.client)) {
		this.Log(LogString + " Failed!!!")
		return false
	}
	this.Log(LogString + " Succeed!!!")

	this.UseData()

	return true
}

MySqlClient.prototype.UseData = function (isNoLog = false) {
	require('./QueryUse.js')
	var q = new QueryUse(this.szDateBase)
	var THIS = this
	q.Execute(function (result) {
		if (Verify(result) && !isNoLog) {
			var l = THIS.QueryList.length
			for (var i = 0; i < l; i++) {
				var que = THIS.QueryList[i]
				if (Verify(que) && que != q && que.TimeOut) {
					que.Execute(THIS.FuncList[i])
				}
			}
		}
	}, isNoLog)
}

MySqlClient.prototype.Execute = function (QuerryObj, func, isNoLog = false) {
	if (Verify(QuerryObj)) {
		this.freeCount = 0
		var THIS = this
		this.Log("Execute SQL:", QuerryObj.SQLString)
		var funcLog = new CallBackFunc(this, "Log")
		THIS.QueryList.push(QuerryObj)
		THIS.FuncList.push(func)
		QuerryObj.TimeOut = false
		QuerryObj.RunTime = 0
		this.client.query(QuerryObj.SQLString, function (error, result) {
			QuerryObj.NotRun = false
			if (error) {
				if (error.code == "ECONNREFUSED" && error.syscall == "connect") {
					//SQL disconnection
					QuerryObj.NotRun = true
					EventCenter.RaiseEvent("SQLWorkOK", false)
				}
				if (!isNoLog)
					funcLog.Execute("ExecuteSQL Error:" + JSON.stringify(error))

				if (Verify(func)) {
					func(null)
				}
			} else {
				EventCenter.RaiseEvent("SQLWorkOK", true)
				if (result.length > 0 && !isNoLog && QuerryObj.WriteLog)
					funcLog.Execute("ExecuteSQL Succeed:" + JSON.stringify(result))
				if (Verify(func)) {
					func(result)
				}
			}
		})
	}
}

MySqlClient.prototype.OnUpdate = function (ms) {
	if (this.client != null) {
		this.freeCount += ms
		if (this.freeCount > 300000)//Prevent MySQL connection timeout Execute UseData every 180 seconds
		{
			this.UseData(true)
		}

		var del = []
		var l = this.QueryList.length

		for (var i = 0; i < l; i++) {
			var q = this.QueryList[i]
			if (Verify(q)) {
				if (q.NotRun) {
					q.OnUpdate(ms)
				} else {
					del.push(i)
				}
			}
		}

		l = del.length
		for (var i = 0; i < l; i++) {
			delete this.QueryList[del[i]]
			this.QueryList.splice(del[i], 1)
			this.FuncList.splice(del[i], 1)
		}

		l = this.NextQuery.length
		for (var i = 0; i < l; i++) {
			this.Execute(this.NextQuery[i], this.NextFunc[i])
		}

		this.NextQuery = []
		this.NextFunc = []
	}
}

MySqlClient.prototype.CanClose = function () {
	return this.QueryList.length == 0
}

MySqlClient.prototype.Close = function () {
	this.client.end()
	this.client = null
	this.Log("MySQL is Disconnected!!!")
}


var ThisInstance = null

exports.GetInstance = function () {
	if (!Verify(ThisInstance)) {
		ThisInstance = new MySqlClient()
	}
	return ThisInstance
};

