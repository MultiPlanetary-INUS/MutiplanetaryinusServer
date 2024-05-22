const { Vector3 } = require("math3d")
const { ComponentType } = require("../../../Common/Component")
const { GameObject, GameObjectType } = require("../../../Common/GameObject")
const { ItemType, BandTypes } = require("../../Gen/Types")
var DataCenter = require('../../Gen/DataCenter.js').GetInstance()
var ConditonsFactory = require('../Conditions/ConditionsFactory.js').GetInstance()
var ActionsFactory = require('../Actions/ActionFactory.js').GetInstance()
var IDGenerator = require('../../../Common/IDGenerator.js').GetInstance()

Item = GameObject.extend({
    ctor: function () {
        this._super()
        this.ObjType = GameObjectType.GOT_ITEM
        this.ItemData = null
        this.ItemCF = null
        this.MapPosition = Vector3.zero
        this.bModify = false
        this.Owner = null
        this.Conditions = []
        this.Actions = []
    }
})

Item.prototype.GetOwnerID = function () {
    if (Verify(this.ItemCF))
        return this.ItemCF.getRoleid()

    return 0
}

Item.prototype.SetOwner = function (player) {
    if (Verify(player)) {
        this.Owner = player
        this.ItemCF.setRoleid(player.RoleID)
        this.bModify = true
    }
    else {
        this.Owner = null
        this.ItemCF.setRoleid(0)
        this.Destory()
    }
}

Item.prototype.Destory = function () {
    var isc = this.GetComponent(ComponentType.ECT_STORAGE)
    if (Verify(isc)) {
        isc.Delete()
        this.bModify = false
    }
}

Item.prototype.Store = function () {
    var isc = this.GetComponent(ComponentType.ECT_STORAGE)
    if (Verify(isc)) {
        isc.Store()
    }
}

Item.prototype.GetItemAttr = function () {
    return this.ItemData
}

Item.prototype.GetItemCF = function () {
    return this.ItemCF
}

Item.prototype.GetTypeID = function () {
    if (Verify(this.ItemCF)) {
        return this.ItemCF.getTypeid()
    }
    return ItemType.Unknow
}

Item.prototype.GetItemName = function () {
    if (Verify(this.ItemData)) {
        return this.ItemData.Name
    }
}

Item.prototype.GetStackLimit = function () {
    if (Verify(this.ItemData)) {
        return this.ItemData.StackLimit
    }

    return 0
}

Item.prototype.Create = function (itemtypeid, count, itemid = 0) {
    var data = DataCenter.GetItemData(itemtypeid)
    if (Verify(data)) {
        var itf = new proto.GamePKG.ItemCF()
        itf.setPkgid(proto.PKGTypeID.PKG_ITEM_INFO)
        itf.setTypeid(itemtypeid)


        if (itemid == 0)
            itemid = IDGenerator.GetNewID()
        itf.setItemid(itemid)

        if (count > data.StackLimit)
            count = data.StackLimit

        itf.setCount(count)
        itf.setDurability(data.Durability)
        itf.setDurabilitymax(data.Durability)
        itf.setDuration(data.Duration)
        itf.setTimesremain(data.UseTimes)
        itf.setGettime(Date.now())
        var bs = this.CreateByCF(itf)
        if (!bs) {
            delete itf
            return false
        }
        return true
    }
}

Item.prototype.CreateByCF = function (itemcf) {
    if (Verify(itemcf)) {
        this.ItemCF = itemcf
        if (this.ItemCF.getItemid() == 0) {
            this.ItemCF.setItemid(IDGenerator.GetNewID())
            this.bModify = true
        }
        this.ObjID = this.ItemCF.getItemid()

        var data = DataCenter.GetItemData(this.ItemCF.getTypeid())
        if (Verify(data)) {
            this.ItemData = data

            for (var i = 0; i < data.NeedConditions.length; ++i) {
                var con = ConditonsFactory.Create(data.NeedConditions[i], this)
                if (!Verify(con)) {
                    return false
                }
                this.Conditions.push(con)
            }

            for (var i = 0; i < data.OnUseActions.length; ++i) {
                var act = ActionsFactory.Create(data.OnUseActions[i])
                if (!Verify(act)) {
                    return false
                }
                this.Actions.push(act)
            }

            return true
        }
    }
    return false
}

Item.prototype.SetPos = function (pos, idx) {
    if (Verify(this.ItemCF)) {
        this.ItemCF.setContainer(pos)
        this.ItemCF.setIndex(idx)
        this.bModify = true
    }
}

Item.prototype.GetContainerPos = function () {
    if (Verify(this.ItemCF)) {
        return this.ItemCF.getContainer()
    }
    return proto.ItemContainerType.IC_OTHER
}

Item.prototype.GetIndexPos = function () {
    if (Verify(this.ItemCF)) {
        return this.ItemCF.getIndex()
    }
    return -1
}

Item.prototype.GetType = function () {
    if (Verify(this.ItemData)) {
        return this.ItemData.Type
    }
    return ItemType.Unknow
}

Item.prototype.GetItemID = function () {
    if (Verify(this.ItemCF)) {
        return this.ItemCF.getItemid()
    }
    return -1
}

Item.prototype.GetItemCount = function () {
    if (Verify(this.ItemCF)) {
        return this.ItemCF.getCount()
    }
    return 0
}

Item.prototype.SetItemCount = function (n) {
    if (Verify(this.ItemCF) && Verify(this.ItemData)) {
        if (n <= 0) {
            n = 0
            this.Destory()
        }
        else {
            this.ItemCF.setCount(n)
            this.bModify = true
        }
    }
    return n
}

Item.prototype.AddItemCount = function (n) {
    if (Verify(this.ItemCF) && Verify(this.ItemData)) {
        var nc = this.ItemCF.getCount() + n
        if (nc <= 0) {
            this.Destory()
        }
        else {
            this.ItemCF.setCount(nc)
            this.bModify = true
            return nc
        }
    }
    return 0
}


Item.prototype.IsSoulBand = function () {
    return this.ItemCF.getBinded()
}


Item.prototype.SetSoulBand = function (b) {
    this.ItemCF.setBinded(b)
    this.bModify = true
}

Item.prototype.GetDurability = function () {
    return this.ItemCF.getDurability()
}

Item.prototype.SetDurability = function (dur) {
    this.ItemCF.setDurability(dur)
    this.bModify = true
}

Item.prototype.GetDurabilityMax = function () {
    return this.ItemCF.getDurabilitymax()
}

Item.prototype.SetDurabilityMax = function (dm) {
    this.ItemCF.setDurabilitymax(dm)
    this.bModify = true
}

Item.prototype.SetTimesRemain = function (dm) {
    this.ItemCF.setTimesremain(dm)
    this.bModify = true
}

Item.prototype.CanStackWith = function (it) {
    if (it.GetTypeID() == this.GetTypeID() && it.IsSoulBand() == this.IsSoulBand())
        return true

    return false
}


Item.prototype.CanUse = function (player) {
    if (Verify(this.ItemData) && Verify(player)) {
        if (this.ItemData.NeedAllConditions) {
            for (var i = 0; i < this.Conditions.length; ++i) {
                if (!this.Conditions[i].Match(player))
                    return false
            }

            return true
        }
        else {
            for (var i = 0; i < this.Conditions.length; ++i) {
                if (this.Conditions[i].Match(player))
                    return true
            }
        }
    }
    return this.Conditions.length == 0
}

Item.prototype.UseTo = function (player) {
    if (Verify(this.Owner)) {
        var ItemMgr = this.Owner.GetComponent(ComponentType.ECT_ITEMMGR)

        if (Verify(ItemMgr) && this.CanUse(player)) {
            if (this.ItemData.BindType == BandTypes.BindOnceUsed) {
                this.SetSoulBand(2)
            }

            for (var i = 0; i < this.Actions.length; ++i) {
                this.Actions[i].Execute(player)
            }

            if (this.ItemCF.getTimesremain() > 1) {
                this.SetTimesRemain(this.ItemCF.getTimesremain() - 1)
            }
            else {
                if (this.GetItemCount() > 1) {
                    this.SetItemCount(this.GetItemCount() - 1)

                    this.Owner.RaiseEvent("UseItem", this, this.GetItemCount())
                }
                else {
                    ItemMgr.RemoveItem(this)
                    return
                }
            }

            ItemMgr.OnRefershItem(this)
        }
    }
}

//clone
Item.prototype.Clone = function (ncount) {
    if (Verify(this.ItemCF)) {
        var icf = new proto.GamePKG.ItemCF()
        icf.setPkgid(proto.PKGTypeID.PKG_ITEM_INFO)
        icf.setRoleid(this.GetOwnerID())
        icf.setContainer(this.GetContainerPos())
        icf.setIndex(this.GetIndexPos())
        icf.setCount(ncount)
        icf.setTypeid(this.ItemCF.getTypeid())
        var it = new Item()
        if (!it.Create(icf)) {
            delete it
        }

        return it
    }
    return null
}

Item.prototype.IsSetItem = function () {
    if (Verify(this.ItemData)) {
        return this.ItemData.SetID > 0
    }

    return false
}

Item.prototype.ActiveSetAttr = function () {
    if (this.Owner != null && this.ItemData != null && this.ItemData.SetID > 0 && (this.GetContainerPos() == proto.ItemContainerType.IcBody || this.GetContainerPos() == proto.ItemContainerType.IcFashion)) {
        var imgr = this.Owner.GetComponent(ComponentType.ECT_ITEMMGR)
        var sd = DataCenter.GetItemSet(this.ItemData.SetID)
        if (Verify(sd)) {
            for (var i = 0; i < sd.ItemList.length; ++i) {
                if (imgr.FindItemByDefIDInContainer(this.GetContainerPos(), sd.ItemList[i]) == null) {
                    return false
                }
            }
            return true
        }
    }
    return false
}

exports.Item = Item