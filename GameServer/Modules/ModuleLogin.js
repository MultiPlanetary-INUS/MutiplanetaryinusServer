const { Module } = require('../../Common/Module.js')
const crypto = require("crypto")
require('../../Common/CommonDefine.js')
require('../../Common/NetWork/NetPacket.js')
const { QueryBase } = require('../../Common/DataBase/MySQL/QueryBase.js')
var IDGenerator = require('../../Common/IDGenerator.js').GetInstance()
var RedisMgr = require('../../Common/DataBase/Redis/RedisMgr').GetInstance()

ModuleLogin = Module.extend({
    ctor: function (solution) {
        this._super(solution)
        this.Name = "ModuleLogin"
        this.ModuleID = GAMESERVER_MODULE_LOGIN
    }
})

ModuleLogin.prototype.OnInitialize = function () {
    //Bind packet processing function
    BIND_PKG_HANDLER(proto.PKGTypeID.PKG_GAME_LOGIN, this, 'OnLogin')
    BIND_PKG_HANDLER(proto.PKGTypeID.PKG_REGIST_ACCOUNT, this, 'OnRegist')
    BIND_PKG_HANDLER(proto.PKGTypeID.PKG_SET_SAFE_QUESTION, this, 'OnSetQuestion')
}

ModuleLogin.prototype.OnSetQuestion = function (pkg, hs) {
    if (Verify(pkg) && Verify(hs)) {
        var q = new QueryBase()
        q.SQLString = "UPDATE accounts SET Question=\'" + pkg.getQuestion() + "\' , Answer=\'" + pkg.getAnswer() + "\' WHERE ID=\'" + pkg.getUserid() + "\'"
        q.Execute(function (result) {
        })
    }
}


ModuleLogin.prototype.OnRegist = function (pkg, hs) {
    if (Verify(pkg) && Verify(hs)) {
        let md5 = crypto.createHash("md5")
        var pass = md5.update(pkg.getPassword()).digest("hex")
        var id = IDGenerator.GetNewID()

        var q = new QueryBase()
        q.SQLString = "CALL RegistAccount(" + id + ", \'" + pkg.getUsername() + "\', \'" + pass + "\', \'" + pkg.getBirthday() + "\', "
            + pkg.getGender() + ", \'" + pkg.getIp() + "\')"
        q.Execute(async function (result) {
            if (result.length > 0) {
                if (result[0][0].ID == -1) {
                    var rPkg = new proto.GamePKG.NotifyClient()
                    rPkg.setPkgid(proto.PKGTypeID.PKG_NOTIFY_CLIENT)
                    rPkg.setCode(ACCOUNT_EXISTS)
                    rPkg.setInfo("Account already exists!")
                    rPkg.setUsername(pkg.getUsername())
                    hs.Send(rPkg)
                }
                else {
                    var rPkg = new proto.GamePKG.LoginResult()
                    rPkg.setPkgid(proto.PKGTypeID.PKG_REGIST_RESULT)
                    rPkg.setUserid(result[0][0].ID)
                    rPkg.setUsername(pkg.getUsername())
                    rPkg.setState(0)
                    rPkg.setAuthority(0)
                    rPkg.setBlocktype(0)
                    rPkg.setBlocktime(0)
                    rPkg.setLastip(pkg.getIp())
                    rPkg.setGold(0)
                    hs.Send(rPkg)

                    await RedisMgr.Write("AccountInfo_" + result[0][0].ID, rPkg)
                }
            }
        })
    }
}


ModuleLogin.prototype.OnLogin = function (pkg, hs) {
    if (Verify(pkg) && Verify(hs)) {
        let md5 = crypto.createHash("md5")
        var pass = md5.update(pkg.getPassword()).digest("hex")

        var q = new QueryBase()
        q.SQLString = "CALL LoginAccount(\'" + pkg.getUsername() + "\', \'" + pass + "\', \'" + pkg.getIp() + "\')"
        q.Execute(async function (result) {
            if (Verify(result) && result.length > 0) {
                if (result[0][0].ID != -1) {
                    //The account will be suspended and will be added later.
                    var rPkg = new proto.GamePKG.LoginResult()
                    rPkg.setPkgid(proto.PKGTypeID.PKG_GAME_LOGIN_RESULT)
                    rPkg.setUserid(result[0][0].ID)
                    rPkg.setUsername(pkg.getUsername())
                    rPkg.setState(result[0][0].State)
                    rPkg.setAuthority(result[0][0].Authority)
                    rPkg.setBlocktype(result[0][0].BlockType)
                    rPkg.setBlocktime(new Date(result[0][0].BlockTime).getTime())
                    rPkg.setLastip(result[0][0].LaspIP)
                    rPkg.setGold(result[0][0].Gold)

                    hs.Send(rPkg)

                    await RedisMgr.Write("AccountInfo_" + result[0][0].ID, rPkg)
                }
                else {
                    var rPkg = new proto.GamePKG.NotifyClient()
                    rPkg.setPkgid(proto.PKGTypeID.PKG_NOTIFY_CLIENT)
                    rPkg.setCode(ACCOUNT_OR_PASSWORD_ERROR)
                    rPkg.setInfo("Wrong account or password!")
                    rPkg.setUsername(pkg.getUsername())
                    hs.Send(rPkg)
                }
            }
        })
    }
}

ModuleLogin.prototype.OnUpdate = function (ms) { }


ModuleLogin.prototype.OnRelease = function () {

}