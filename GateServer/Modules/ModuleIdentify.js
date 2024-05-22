const { Module } = require('../../Common/Module.js')
const { Class } = require('../../Common/Util/Class.js')

require('../../Common/CommonDefine.js')
require('../../Common/NetWork/NetPacket.js')
require('../../Common/Util/Util.js')
var SendMail = require('../Logic/SendMail.js')

var IDGenerator = require('../../Common/IDGenerator.js').GetInstance()
var EventCenter = require('../../Common/EventCenter.js').GetInstance()

IdentifyData = Class.extend({
    ctor: function () {
        this.id = 0
        this.Code = ""
        this.CreateTime = 0
        this.AboutID = 0
    }
})


ModuleIdentify = Module.extend({
    ctor: function (solution) {
        this._super(solution)
        this.Name = "ModuleIdentify"
        this.IdentifyMap = {}
    }
})

ModuleIdentify.prototype.OnInitialize = function () {
    //Bind packet processing function
    BIND_PKG_HANDLER(proto.PKGTypeID.PKG_ASK_IDENTIFY_CODE, this, 'OnAskIdentifyCode')

    //Binding event handling
    EventCenter.RegisterEvent('VerifyIdentifyCode', this, 'VerifyIdentifyCode')
}

ModuleIdentify.prototype.DeleteIdentify = function (id) {
    delete this.IdentifyMap[id]
}

//Check verification code
ModuleIdentify.prototype.VerifyIdentifyCode = function (vf) {
    if (Verify(vf)) {
        var item = this.IdentifyMap[vf.IdentifyID]
        if (Verify(item) && vf.AboutID == item.AboutID) {
            vf.Pass = vf.IdentifyCode == item.Code
            //this.DeleteIdentify(vf.IdentifyID);//Delete the verification code regardless of whether the verification is passed or not.
        }
    }
}

ModuleIdentify.prototype.CreateNewIdentify = function () {
    var s = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    var code = ''
    for (var i = 0; i < 4; i++) {
        var n = parseInt(Math.random() * s.length)
        code += s.substring(n, n + 1)
    }
    return code
}

ModuleIdentify.prototype.OnAskIdentifyCode = async function (pkg, hs) {
    if (Verify(pkg) && Verify(hs)) {
        var mail = pkg.getEmail()
        var old = pkg.getIdentifyid()

        var rpkg = new proto.GamePKG.AskIdentifyResult()
        rpkg.setPkgid(proto.PKGTypeID.PKG_ASK_IDENTIFY_RESULT)
        if (!VerifyEmail(mail)) {
            rpkg.setCode(EMAIL_ADDRESS_ERROR)
            rpkg.setInfo('Email address error!')
        }
        else {
            if (Verify(old) && Verify(this.IdentifyMap[old]) && this.IdentifyMap[old].CreateTime < RESEND_IDENTIFY_TIME) {
                rpkg.setCode(IDENTFY_TIME_TO_SHORT)
                rpkg.setInfo('The interval between two validations cannot be less than ' + RESEND_IDENTIFY_TIME + ' seconds！')
            }
            else {
                this.DeleteIdentify(old)
                var ident = new IdentifyData()
                ident.id = IDGenerator.GetNewID()
                ident.Code = this.CreateNewIdentify()
                ident.AboutID = mail
                this.IdentifyMap[ident.id] = ident

                if (await SendMail(mail, ident.Code) === 1) {
                    rpkg.setIdentifyid(ident.id)
                    rpkg.setCode(SUCCESS)
                }
                else {
                    rpkg.setCode(UNKNOW_ERROR)
                    rpkg.setInfo('Verification code sending failed, please try again later!')
                }
            }
        }

        hs.Send(rpkg)
    }
}

ModuleIdentify.prototype.OnUpdate = function (ms) {
    for (var id in this.IdentifyMap) {
        this.IdentifyMap[id].CreateTime += ms
        if (this.IdentifyMap[id].CreateTime >= IDENTIFY_TIME_OUT) {//If the verification code times out, delete it
            this.DeleteIdentify(id)
        }
    }
}

ModuleIdentify.prototype.OnRelease = function () {
    for (var id in this.IdentifyMap) {
        this.DeleteIdentify(id)
    }
    delete this.IdentifyMap
}