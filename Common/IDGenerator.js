const fs = require('fs')

var BEGIN_ID = 10000

function IDGenerator () {
	this.CurID = BEGIN_ID
}

IDGenerator.prototype.GetNewID = function (name) {
	var CurID = this.CurID++
	this.SaveIDSeek()
	return CurID
}

IDGenerator.prototype.LoadIDSeek = function () {
	var THIS = this
	fs.readFile("IDSeek.dat", 'utf-8', (err, data) => {
		if (!err) {
			THIS.CurID = parseInt(data)
			if (!THIS.CurID)
				THIS.CurID = BEGIN_ID

			console.log("Loaded IDSeek: " + data + "," + THIS.CurID)
		}
		else
			THIS.CurID = BEGIN_ID
	})

}

IDGenerator.prototype.SaveIDSeek = function () {
	fs.writeFileSync("IDSeek.dat", this.CurID.toString(), 'utf-8')
}

var ThisMgr = null
exports.GetInstance = function () {
	if (!Verify(ThisMgr)) {
		ThisMgr = new IDGenerator()
	}
	return ThisMgr
}