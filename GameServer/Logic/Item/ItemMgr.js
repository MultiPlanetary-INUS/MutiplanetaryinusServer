const { Component, ComponentType } = require('../../../Common/Component')
const { ItemType, BandTypes } = require('../../Gen/Types')
var QueryBase = require('../../../Common/DataBase/MySQL/QueryBase').QueryBase

ItemMgr = Component.extend({
    ctor: function () {
        this._super()
        this.nTypeID = ComponentType.ECT_PLAYER_ITEM_MGR
        this.Init()
        this.NeedTrim = false
    }
})

ItemMgr.prototype.Init = function () {
    this.mSpace = []
    this.mEnabled = []
    //Define the size of each backpack
    this.mSpace[proto.ItemContainerType.IC_BAG] = 300
    this.mEnabled[proto.ItemContainerType.IC_BAG] = true
    this.mSpace[proto.ItemContainerType.IC_BODY] = 11
    this.mEnabled[proto.ItemContainerType.IC_BODY] = true
    this.mSpace[proto.ItemContainerType.IC_FASHION] = 5
    this.mEnabled[proto.ItemContainerType.IC_FASHION] = true
    this.mSpace[proto.ItemContainerType.IC_QUICKITEM] = 3
    this.mEnabled[proto.ItemContainerType.IC_QUICKITEM] = true


    this.ItemList = []
}

ItemMgr.prototype.GetSpaceBySpaceType = function (Container) {
    if (Container >= proto.ItemContainerType.IC_BAG && Container <= proto.ItemContainerType.IC_OTHER) {
        return this.mSpace[Container]
    }
    return 0
}

ItemMgr.prototype.OnUpdate = function (ms) {
    for (var i = 0; i < this.ItemList.length; ++i) {
        this.ItemList[i].Update(ms)
    }
}

ItemMgr.prototype.OnDetach = function () {
    for (var i = 0; i < this.ItemList.length; ++i) {
        this.ItemList[i].Store()
    }
}

ItemMgr.prototype.ContainerIsEnabled = function (container) {
    if (container >= proto.ItemContainerType.IC_BAG && container <= proto.ItemContainerType.IC_OTHER) {
        return this.mEnabled[container]
    }
    return false
}

ItemMgr.prototype.SetContainerEnable = function (container, enabled) {
    if (container >= proto.ItemContainerType.IC_BAG && container <= proto.ItemContainerType.IC_OTHER) {
        this.mEnabled[container] = enabled
    }
}

ItemMgr.prototype.GetItem = function (container, idx) {
    for (var i = 0; i < this.ItemList.length; ++i) {
        var it = this.ItemList[i]
        if (it.GetContainerPos() == container && it.GetIndexPos() == idx)
            return it
    }

    return null
}

//Get the first empty position
ItemMgr.prototype.GetFirstSpace = function (container) {
    if (!this.ContainerIsEnabled(container))
        return -1

    for (var idx = 0; idx < this.mSpace[container]; ++idx) {
        if (this.GetItem(container, idx) == null)
            return idx
    }

    return -1
}

//Get the number of empty positions
ItemMgr.prototype.GetSpace = function (container) {
    if (!this.ContainerIsEnabled(container))
        return 0

    var cnt = 0
    for (var idx = 0; idx < this.mSpace[container]; ++idx) {
        if (this.GetItem(container, idx) == null)
            ++cnt
    }

    return cnt
}

//Get the remaining space of all backpacks
ItemMgr.prototype.GetBagSpace = function () {
    return this.GetSpace(proto.ItemContainerType.IC_BAG)
}

ItemMgr.prototype.FindItemByDefID = function (tid) {
    for (var i = 0; i < this.ItemList.length; ++i) {
        if (this.ItemList[i].GetTypeID() == tid)
            return this.ItemList[i]
    }
    return null
}

ItemMgr.prototype.CountItemByDefID = function (tid) {
    var count = 0
    for (var i = 0; i < this.ItemList.length; ++i) {
        if (this.ItemList[i].GetTypeID() == tid)
            count += this.ItemList[i].GetItemCount()
    }
    return count
}

ItemMgr.prototype.FindItemByDefIDInContainer = function (container, tid) {
    for (var i = 0; i < this.ItemList.length; ++i) {
        if (this.ItemList[i].GetContainerPos() == container && this.ItemList[i].GetTypeID() == tid)
            return this.ItemList[i]
    }
    return null
}

ItemMgr.prototype.FindItemByID = function (id) {
    for (var i = 0; i < this.ItemList.length; ++i) {
        if (this.ItemList[i].GetItemID() == id)
            return this.ItemList[i]
    }
    return null
}

ItemMgr.prototype.FindItemByIDInContainer = function (container, id) {
    for (var i = 0; i < this.ItemList.length; ++i) {
        if (this.ItemList[i].GetContainerPos() == container && this.ItemList[i].GetItemID() == id)
            return this.ItemList[i]
    }
    return null
}

ItemMgr.prototype.AddItemAtPos = function (it) {
    if (this.GetItem(it.GetContainerPos(), it.GetIndexPos()) == null) {
        this.ItemList.push(it)

        if (it.ItemData.BindType == BandTypes.BindOncePicked) {
            it.SetSoulBand(1)
        }

        this.OnRefershItem(it)

        it.Store()

        return true
    }
    return false
}

ItemMgr.prototype.AddItem = function (it, stack) {
    if (stack && it.GetStackLimit() > it.GetItemCount()) {
        for (var i = 0; i < this.ItemList.length; ++i) {
            var iteminBag = this.ItemList[i]
            if (iteminBag.GetContainerPos() == proto.ItemContainerType.IC_BAG) {
                if (iteminBag.CanStackWith(it) &&
                    iteminBag.GetItemCount() + it.GetItemCount() <= it.GetStackLimit()) {
                    this.GetOwner().RaiseEvent("AddItem", it, it.GetItemCount())
                    iteminBag.AddItemCount(it.GetItemCount())
                    it.Destory()
                    it.Release()
                    delete it
                    this.OnRefershItem(iteminBag)
                    return true
                }
            }
        }
    }

    var con = proto.ItemContainerType.IC_BAG
    var idx = this.GetFirstSpace(con)
    if (idx >= 0) {
        this.GetOwner().RaiseEvent("AddItem", it, it.GetItemCount())
        it.SetPos(con, idx)
        return this.AddItemAtPos(it)
    }

    return false
}

ItemMgr.prototype.RemoveItem = function (it) {
    for (var i = 0; i < this.ItemList.length; ++i) {
        if (it == this.ItemList[i]) {
            this.ItemList.splice(i, 1)
            break
        }
    }

    if (it.GetContainerPos == proto.ItemContainerType.IC_BAG && i < this.ItemList.length - 1)
        this.NeedTrim = true

    this.GetOwner().RaiseEvent("RemoveItem", it, it.GetItemCount())
    this.OnRemoveItem(it)
    it.SetOwner(null)
    it.Release()
    delete it
}

//Add or refresh items all use this method to notify the client
ItemMgr.prototype.OnRefershItem = function (item) {
    if (Verify(item) && Verify(item.ItemCF)) {
        var pkg = item.ItemCF
        pkg.setPkgid(proto.PKGTypeID.PKG_ITEM_INFO)
        if (item.GetContainerPos() == proto.ItemContainerType.IC_BODY)
            this.GetOwner().NotifyAround(pkg)
        else
            this.GetOwner().SendPkg(pkg)
    }
}

//Use this method to notify the client when deleting an item
ItemMgr.prototype.OnRemoveItem = function (item) {
    if (Verify(item) && Verify(item.ItemCF)) {
        var pkg = item.ItemCF
        pkg.setPkgid(proto.PKGTypeID.PKG_ITEM_INFO)
        pkg.setUserid(this.GetOwner().AccountID)
        pkg.setCount(0)
        if (item.GetContainerPos() == proto.ItemContainerType.IC_BODY)
            this.GetOwner().NotifyAround(pkg)
        else
            this.GetOwner().SendPkg(pkg)
    }
}

ItemMgr.prototype.SyncEquip = function (player) {
    if (Verify(player)) {
        for (var i = 0; i < this.ItemList.length; ++i) {
            if (this.ItemList[i].GetContainerPos() == proto.ItemContainerType.IC_BODY) {
                var pkg = this.ItemList[i].ItemCF
                pkg.setPkgid(proto.PKGTypeID.PKG_ITEM_INFO)
                pkg.setRoleid(this.GetOwner().RoleID)
                player.SendPkg(pkg)
            }
        }
    }
}

ItemMgr.prototype.GetSlotType = function (pos, idx) {
    if (pos == proto.ItemContainerType.IC_BODY) {
        switch (idx) {
            case 0:
                return ItemType.Weapon
            case 1:
                return ItemType.ViceWeapon
            case 2:
                return ItemType.Head
            case 3:
                return ItemType.Chest
            case 4:
                return ItemType.Gloves
            case 5:
                return ItemType.Trousers
            case 6:
                return ItemType.Shoes
            case 7:
            case 8:
            case 9:
            case 10:
                return ItemType.Trinket
        }
    }
    else if (pos == proto.ItemContainerType.IC_FASHION) {
        switch (idx) {
            case 0:
                return ItemType.FashionHead
            case 1:
                return ItemType.FashionChest
            case 2:
                return ItemType.FashionGloves
            case 3:
                return ItemType.FashionTrousers
            case 4:
                return ItemType.FashionShoes
        }
    }
    else if (pos == proto.ItemContainerType.IC_QUICKITEM) {
        return ItemType.Expendable
    }

    return ItemType.Normal
}

ItemMgr.prototype.CanSetPos = function (item, pos, idx) {
    var tp = this.GetSlotType(pos, idx)
    if (tp != ItemType.Normal && item.GetType() != tp)
        return false

    if (pos == proto.ItemContainerType.IC_BODY)
        return item.CanUse(this.GetOwner())

    return true
}

ItemMgr.prototype.OnEquip = function (item) {
    this.GetOwner().RaiseEvent("EquitItem", item.ItemData)
}

ItemMgr.prototype.OnUnEquip = function (item) {
    this.GetOwner().RaiseEvent("UnEquipItem", item.ItemData)
}

ItemMgr.prototype.GetEquipPosIdx = function (item) {
    if (Verify(item)) {
        var tt = item.GetType()
        if (tt >= ItemType.Weapon && tt <= ItemType.Shoes) {
            return tt
        }
        else if (tt == ItemType.Trinket) {
            var nPos = ItemType.Trinket
            for (var i = 0; i < 4; ++i) {
                if (!Verify(this.GetItem(proto.ItemContainerType.IC_BODY, nPos + i))) {
                    nPos = i
                    break
                }
            }
            return nPos
        }
        else if (tt >= ItemType.FashionHead && tt <= ItemType.FashionShoes) {
            return tt - ItemType.FashionHead
        }
    }

    return -1
}

ItemMgr.prototype.ReStore = function () {
    this.Init()
    var q = new QueryBase()

    q.SQLString = "Select * From roleitem Where RoleID=" + this.GetOwner().RoleID
    var THIS = this
    q.Execute(function (result) {
        if (Verify(result)) {
            for (var i = 0; i < result.length; ++i) {
                var icf = new proto.GamePKG.ItemCF()
                icf.setPkgid(proto.PKGTypeID.PKG_ITEM_INFO)
                icf.setUserid(THIS.GetOwner().AccountID)
                icf.setRoleid(THIS.GetOwner().RoleID)
                icf.setItemid(result[i].ItemID)
                icf.setTypeid(result[i].TypeID)
                icf.setCount(result[i].Count)
                icf.setContainer(result[i].Container)
                icf.setIndex(result[i].Index)
                icf.setBinded(result[i].Binded)
                icf.setDurability(result[i].Durability)
                icf.setDurabilitymax(result[i].DurabilityMax)
                icf.setDuration(result[i].Duration)
                icf.setGettime(new Date(result[i].GetTime).getTime())
                icf.setTimesremain(result[i].TimesRemain)
                icf.setLocked(result[i].Locked)
                icf.setLocktime(new Date(result[i].LockedTime).getTime())

                var it = new Item()
                if (it.CreateByCF(icf)) {
                    it.SetOwner(THIS.GetOwner())
                    it.CreateComponent(ComponentType.ECT_ITEM_STORAGE)
                    THIS.AddItemAtPos(it)
                }
            }
        }
    })
}

ItemMgr.prototype.MoveItem = function (posOld, idxOld, posNew, idxNew) {
    var pItem = this.GetItem(posOld, idxOld)
    var pItem2 = this.GetItem(posNew, idxNew)

    if (!Verify(pItem) || !this.CanSetPos(pItem, posNew, idxNew))
        return false

    if (Verify(pItem2) && !this.CanSetPos(pItem2, posOld, idxOld))
        return false

    if (Verify(pItem2) && pItem2.CanStackWith(pItem) && pItem2.GetItemCount() < pItem2.GetStackLimit())//Stackable
    {
        if (pItem.GetItemCount() + pItem2.GetItemCount() <= pItem2.GetStackLimit())//merge into a pile
        {
            pItem2.AddItemCount(pItem.GetItemCount())
            pItem2.Store()
            this.OnRefershItem(pItem2)
            this.RemoveItem(pItem)

            if (posOld == proto.ItemContainerType.IC_BAG || posNew == proto.ItemContainerType.IC_BAG) {
                this.NeedTrim = true
            }
        }
        else {
            var nc = pItem2.GetStackLimit() - pItem2.GetItemCount()
            pItem2.AddItemCount(nc)
            pItem2.Store()
            this.OnRefershItem(pItem2)
            pItem.AddItemCount(-nc)
            pItem.Store()
            this.OnRefershItem(pItem)
        }
    }
    else//change location
    {
        pItem.SetPos(posNew, idxNew)
        pItem.Store()
        this.OnRefershItem(pItem)

        if (Verify(pItem2)) {
            pItem2.SetPos(posOld, idxOld)
            pItem2.Store()
            this.OnRefershItem(pItem2)
        }

        if (posOld == proto.ItemContainerType.IC_BODY || posOld == proto.ItemContainerType.IC_FASHION) {
            this.OnUnEquip(pItem)

            if (Verify(pItem2))
                this.OnUnEquip(pItem2)
        }

        if (posNew == proto.ItemContainerType.IC_BODY || posNew == proto.ItemContainerType.IC_FASHION)//equipment
        {
            if (Verify(pItem2))
                this.OnUnEquip(pItem2)

            if (pItem.ItemData.BindType == BandTypes.BindOnceUsed) {
                pItem.SetSoulBand(1)
            }

            this.OnEquip(pItem)
        }

        if (posOld == proto.ItemContainerType.IC_BAG || posNew == proto.ItemContainerType.IC_BAG) {
            if (!Verify(pItem) || !Verify(pItem2)) {
                this.NeedTrim = true
            }
        }
    }

    return true
}

ItemMgr.prototype.GetContainer = function (cp) {
    var li = []
    for (var i = 0; i < this.ItemList.length; ++i) {
        if (this.ItemList[i].GetContainerPos() == cp)
            li.push(this.ItemList[i])
    }

    return li
}

ItemMgr.prototype.TrimContainer = function (cp) {
    if (cp == proto.ItemContainerType.IC_BAG)//Catalog only supports automatic organization of backpacks
    {
        if (this.GetSpaceBySpaceType(cp) > 0) {
            var il = this.GetContainer(cp)
            for (var i = 0; i < il.length; ++i) {
                if (il[i].GetIndexPos() != i) {
                    this.MoveItem(cp, il[i].GetIndexPos(), cp, i)
                }
            }
            il = []
        }
    }
    this.NeedTrim = false
}