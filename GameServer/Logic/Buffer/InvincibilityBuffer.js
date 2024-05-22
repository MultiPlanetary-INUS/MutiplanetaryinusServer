const { ComponentType } = require("../../../Common/Component")
const { QueryType } = require("../../../Common/QueryType")
const { BufferType } = require("../../Gen/Types")
const { BaseBuffer } = require("./BaseBuffer")

InvincibilityBuffer = BaseBuffer.extend({
    ctor: function () {
        this.Type = BufferType.Invincibility
    }
})

InvincibilityBuffer.prototype.OnAttach = function () {
    this.Owner.Regist(QueryType.QT_AddHP, this.OnAddHP)
}

InvincibilityBuffer.prototype.OnDetach = function () {
    this.Owner.UnRegist(QueryType.QT_AddHP, this.OnAddHP)
}

InvincibilityBuffer.prototype.OnAddHP = function (obj, param1, param2) {
    if (Verify(this.Owner)) {
        var atc = this.Owner.GetComponent(ComponentType.ECT_ATTR)
        if (atc != null && param1 < 0 && -param1 < this.Param2)//When blood is lost, the blood volume will be directly added back.
            return -param1

        return 0
    }
}

exports.InvincibilityBuffer = InvincibilityBuffer
