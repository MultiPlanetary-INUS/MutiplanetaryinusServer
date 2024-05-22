var FS = require('fs')
const internal = require('stream')
require('./Util/Verify.js')
require('./Util/Util.js');

(function () {
	LOG_NO_FIX = 0			//
	LOG_ONE_DAY_FIX = 1	//
	LOG_ONE_HOUR_FIX = 2	//
})()


function LogSystem (sign) {
	this.Sign = sign || "LogSystem"
	this.LogAndPrint = true
	this.LogFile = null
	this.LogFix = LOG_NO_FIX
	this.LogPath = "."
	this.LastTime = 0
	this.bWriteLog = true
}
LogSystem.prototype.SetSign = function (sign) {
	this.Sign = sign || "LogSystem"
	this.ResetFileName()
}

LogSystem.prototype.SetLogAndPrint = function (b) {
	this.LogAndPrint = b == 1 || b == true
}

LogSystem.prototype.SetLogFix = function (fix) {
	this.LogFix = fix * 1
}

LogSystem.prototype.SetLogPath = function (path) {
	this.LogPath = path
}

LogSystem.prototype.SetWriteLog = function (bW) {
	this.bWriteLog = bW
}

LogSystem.prototype.ResetFileName = function () {
	var strFileName = ".log"
	var TimeNow = new Date()
	switch (this.LogFix) {
		case LOG_NO_FIX:
			strFileName = "LOG"
			break
		case LOG_ONE_HOUR_FIX:
			this.LastTime = TimeNow.getHours()
			strFileName = GetDateStringByDate(TimeNow, "_") + "_" + TimeNow.getHours() + strFileName
			break
		case LOG_ONE_DAY_FIX:
			this.LastTime = TimeNow.getDate()
			strFileName = GetDateStringByDate(TimeNow, "_") + strFileName
			break
	}

	this.LogFile = this.Sign + "_" + strFileName
}


LogSystem.prototype.OnUpdate = function (ms) {
	var TimeNow = new Date()
	switch (this.LogFix) {
		case LOG_ONE_HOUR_FIX:
			if (TimeNow.getHours() != this.LastTime) {
				this.ResetFileName()
			}
			break
		case LOG_ONE_DAY_FIX:
			if (TimeNow.getDate() != this.LastTime) {
				this.ResetFileName()
			}
			break
	}
}

LogSystem.prototype.CreateStringByArray = function (array) {
	var Content = ""
	var l = array.length
	for (var i = 0; i < l; ++i) {
		if (this.LogAndPrint) {
			console.log(array[i])
		}
		if (i > 0) {
			Content += "\t"
		}
		if (IsString(array[i])) {
			Content += array[i]
		} else {
			Content += JSON.stringify(array[i])
		}
	}
	return Content
}

LogSystem.prototype.Log = function () {
	var Content = this.CreateStringByArray(arguments)

	if (!this.bWriteLog) {
		return
	}

	if (!Verify(this.LogFile)) {
		this.ResetFileName()
	}

	var TimeNow = new Date()

	if (!FS.existsSync(this.LogPath)) {
		FS.mkdirSync(this.LogPath)
	}

	var FileName = this.LogPath + '/' + this.LogFile

	Content = GetTimeStringByDate(TimeNow, "-") + ": " + Content + "\n"

	if (LOG_NO_FIX == this.LogFix) {
		Content = GetDateStringByDate(TimeNow, "-") + "-" + Content
	}

	FS.appendFile(FileName, Content, (err) => {
		if (err)
			console.log(err)
	})
}

exports.LogSystem = LogSystem